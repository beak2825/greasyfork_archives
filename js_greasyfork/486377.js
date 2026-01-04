// ==UserScript==
// @name         Duels bot
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @license MIT
// @description  Grow your duel level with friends
// @author       Serhii T
// @include      http*://*.the-west.*/game.php*
// @include      http*://*.the-west.*.*/game.php*
// @match        https://*.the-west.*/index.php?page=logout
// @icon         https://westru.innogamescdn.com/images/window/character/greenhorn_ava.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486377/Duels%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/486377/Duels%20bot.meta.js
// ==/UserScript==


(function() {
  'use strict';

  const storageKey = `${Game.worldName}_duels_bot_nicks`;
  const settingsStorageKey = `${Game.worldName}_duels_bot_settings`;
  // model { playerId: { nick: 'nick', lastDuelTime: 0, lastDuelStartTime: 0 } }
  let storedPlayers = JSON.parse(localStorage.getItem(storageKey) || '{}');
  // model { toDrinkOrNotToDrink: boolean, isNotRestoreMotivation: boolean, isStarted: boolean, isAutoLogout: boolean}
  let storedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || '{}');
  let statistics = {};
  let startButton;
  let checkCharacterIntervalId;
  let sleepInFortIntervalId;
  let jobTaskIntervalId;
  const oneHour = 60 * 60 * 1000;
  const tenMinutes = 10 * 60 * 1000;

  const buffs = {
    cigarettes: 13703000,
    duelEgg: 185202000,
    firecracker: 12703000,
    gingerbread: 2355000,
    duelDye: 2293000,

    beans10: 1943000,
    tea20: 1890000,
    tea: 2130000,
    guarana: 2129000,
    coffee: 2128000,

    cake: 53336000,
    healthEgg: 185204000,
    chocoCake: 12705000,
    cabbage: 2357000,
    healthDye: 2295000,
    bag: 1952000,
  }

  function init() {
    const div = $('<div class="ui_menucontainer" />');
    const link = $(
      '<img class="menulink"' +
      ' id="world-duels-scanner"' +
      ' title="Duels bot"' +
      ' src="https://westru.innogamescdn.com/images/window/character/greenhorn_ava.png"' +
      ' width="25px" height="25px">'
    )

    $(link).on('click', () => openSettings());

    $('#ui_menubar').append(
      div.append(link).append('<div class="menucontainer_bottom" />'),
    );
  }

  function openSettings() {
    const win = wman
      .open('DuelsBot', 'Duels Bot', 'noreload')
      .setMaxSize(1268, 900)
      .setMiniTitle('Duels Bot');
    const scrollPane = new west.gui.Scrollpane();
    scrollPane.appendContent(`
      <div style="margin-top: 10px" class="duels-bot__title"><b>Список игроков через запятую</b></div>
     `);

    const input = new west.gui.Textfield(
      `#duels_bot_input`,
      'text',
    ).setSize(65);
    input.setPlaceholder('Ники игроков');
    scrollPane.appendContent(input.getMainDiv());

    const initialStr = Object.values(storedPlayers).map(p => p.nick).join(',');
    input.setValue(initialStr);
    const saveButton = new west.gui.Button('Сохранить', async () => {
      try {
        new UserMessage(
          'Сохраняем...',
          UserMessage.TYPE_HINT,
        ).show();

        const inputVal = input.getValue();

        const nicks = parseStringWithNicks(inputVal);

        if (inputVal.length && nicks.length) {
          const players = {};

          const getPlayerIds = nicks.map((name) => getPlayerId(name));

          await Promise.all(getPlayerIds).then((ids) => {
            ids.forEach((id, index) => {
              players[id] = { nick: nicks[index], lastDuelTime: 0, lastDuelStartTime: 0 };
            });
          });

          persistPlayers(players);
          storedPlayers = players;
          if (!storedSettings.isStarted) {
            startButton.setVisible(true);
          }
        } else {
          localStorage.removeItem(storageKey);
          storedPlayers = {};
          startButton.setVisible(false);
          storedSettings.isStarted = false;
        }

        new UserMessage(
          'Настойки сохранены',
          UserMessage.TYPE_SUCCESS,
        ).show();
      } catch (err) {
        console.log(err);
        new UserMessage(
          'Ошибка сохранения настроек',
          UserMessage.TYPE_ERROR,
        ).show();
      }
    });

    scrollPane.appendContent(saveButton.getMainDiv());
    scrollPane.appendContent(`<br/>`);

    addStartStopButtons(scrollPane);

    const statisticsButton = new west.gui.Button('Посмотреть статистику', () => {
      getStatistics();
    });

    scrollPane.appendContent(statisticsButton.getMainDiv());

    // addFortSleepButtons(scrollPane);

    addSettings(scrollPane);

    scrollPane.appendContent('<div id="duel-statistics-container"></div>');

    win.appendToContentPane(scrollPane.getMainDiv());
  }

  function addSettings(scrollPane) {
    scrollPane.appendContent(`
      <div style="margin: 10px 0" class="duels-bot__title"><b>Дополнительные настройки:</b></div>
    `);
    const settingContainer = document.createElement('div');
    settingContainer.classList.add('duels-bot__settings');
    settingContainer.append(getCheckCharacterCheckbox().getMainDiv()[0]);
    settingContainer.append(getMotivationCheckbox().getMainDiv()[0]);
    settingContainer.append(getAutoLogoutCheckbox().getMainDiv()[0]);
    scrollPane.appendContent(settingContainer);
  }

  function addStartStopButtons(scrollPane) {
    startButton = new west.gui.Button('Запустить', () => {
      storedSettings.isStarted = true;
      startButton.setVisible(false);
      stopButton.setVisible(true);
      localStorage.setItem(settingsStorageKey, JSON.stringify(storedSettings));
      startDuel();
    })

    const stopButton = new west.gui.Button('Остановить', () => {
      storedSettings.isStarted = false;
      startButton.setVisible(true);
      stopButton.setVisible(false);
      localStorage.setItem(settingsStorageKey, JSON.stringify(storedSettings));
    })

    startButton.setVisible(!storedSettings.isStarted && Object.keys(storedPlayers).length);
    stopButton.setVisible(storedSettings.isStarted && Object.keys(storedPlayers).length);

    scrollPane.appendContent(startButton.getMainDiv());
    scrollPane.appendContent(stopButton.getMainDiv());
  }

  function addFortSleepButtons(scrollPane) {
    const startSleepButton = new west.gui.Button('Спать в форте', () => {
      sleepInFort();
      startSleepButton.setVisible(false);
      stopSleepButton.setVisible(true);
    })

    const stopSleepButton = new west.gui.Button('Отменить сон', () => {
      stopSleepInFort();
      startSleepButton.setVisible(true);
      stopSleepButton.setVisible(false);
    })

    startSleepButton.setVisible(true);
    stopSleepButton.setVisible(false);

    scrollPane.appendContent(startSleepButton.getMainDiv());
    scrollPane.appendContent(stopSleepButton.getMainDiv());
  }

  function persistPlayers(players) {
    localStorage.setItem(storageKey, JSON.stringify(players));
  }

  function parseStringWithNicks(str) {
    const nicks = str.split(',');
    return nicks.map((nick) => nick.trim());
  }

  async function getPlayerId(name) {
    return AjaxAsync.remoteCallMode('ranking', 'get_data', {
      page: 0,
      search: name,
      tab: 'experience',
      entries_per_page: 1
    }).then(function (json) {
      if (!json.error) {
        const player = json.ranking[0];
        if (player) {
          return player.player_id;
        } else {
          throw new Error('Игрок не найден');
        }
      } else {
        throw new Error('Игрок не найден');
      }
    })
  }

  function addStyles() {
    const style = document.createElement('style');

    style.textContent = `
      .duels-bot__title {
        margin: 2px 10px;
        font-size: 14px;
      }
      #duel-statistics-container table {
        padding-bottom: 10px;
      }
      #duel-statistics-container th,
      #duel-statistics-container td {
        padding: 4px 8px;
      }
      .duels-bot__settings {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: flex-start;
        grid-gap: 10px;
      }
    `;

    document.head.appendChild(style);
  }

  function listenTaskQueueUpdated() {
    EventHandler.listen('taskqueue-updated', function (taskQueue) {
      if (!storedSettings.isStarted) return;

      if (taskQueue.length && taskQueue[0].type === 'duel') {
        const data = taskQueue[0].data;
        storedPlayers[data.playerId].lastDuelTime = data.date_done;
        persistPlayers(storedPlayers);
      } else {
        startDuel();
      }
    });
    EventHandler.listen('taskqueue-task-canceling', function (taskQueue) {
      if (!storedSettings.isStarted) return;

      if (taskQueue.length && taskQueue[0].type === 'duel') {
        const data = taskQueue[0].data;
        storedPlayers[data.playerId].lastDuelTime = 0;
        persistPlayers(storedPlayers);
      }
    });
    EventHandler.listen('duel_finished', async function () {
      if (!storedSettings.isStarted) return;

      await updateMotivation();
    });
  }

  async function startDuel() {
    if (!storedSettings.isStarted) return;

    const playerId = findPlayerIdForDuel();

    if (!playerId) {
      setTimeout(() => startDuel(), tenMinutes);
      console.log('No players for duel found. Waiting 10 minutes.');
      return;
    }

    const player = await getPlayer(storedPlayers[playerId].nick);
    storedPlayers[playerId].lastDuelStartTime = Date.now();

    if (!isTheSamePosition(player)) {
      console.log('Player is not in the same location. Duel another player.');
      setTimeout(() => startDuel(), 1000);
      return;
    }

    // first duel
    if (storedPlayers[playerId].lastDuelTime === 0) {
      TaskQueue.add(new TaskDuel(playerId));
      storedPlayers[playerId].lastDuelStartTime = Date.now();
    } else if (storedPlayers[playerId].lastDuelTime + oneHour < Date.now()) {
      TaskQueue.add(new TaskDuel(playerId));
      storedPlayers[playerId].lastDuelStartTime = Date.now();
    } else {
      setTimeout(() => startDuel(), Date.now() - (storedPlayers[playerId].lastDuelTime + oneHour) + 1000);
    }
  }

  async function getPlayer(playerName) {
    return await AjaxAsync.remoteCallMode("profile", "init", {
      name: playerName,
      playerId: null
    });
  }

  function isTheSamePosition(player) {
    return Character.calcWayTo(player.x, player.y) == 0
  }

  function findPlayerIdForDuel() {
    // Find the player with the lowest lastDuelTime
    let foundPlayerId;
    let lowestTime = Infinity;

    for (const playerId in storedPlayers) {
      const player = storedPlayers[playerId];
      if (player.lastDuelTime < lowestTime && player.lastDuelStartTime + tenMinutes < Date.now()) {
        lowestTime = player.lastDuelTime;
        foundPlayerId = playerId;
      }
    }

    return foundPlayerId;
  }

  function toggleBuffsUsing(isUsing) {
    if (isUsing) {
      checkCharacter();
    } else {
      clearInterval(checkCharacterIntervalId);
    }
  }

  const getMotivationCheckbox = function() {
    const checkbox = new west.gui.Checkbox('Не восстанавливать мотивацию');
    if (storedSettings.isNotRestoreMotivation) {
      checkbox.toggle();
    }
    checkbox.setCallback(() => {
      storedSettings.isNotRestoreMotivation = checkbox.isSelected();
      localStorage.setItem(
        settingsStorageKey,
        JSON.stringify(storedSettings),
      );
      new UserMessage(
        'Настойки сохранены',
        UserMessage.TYPE_SUCCESS,
      ).show();
    });

    return checkbox;
  };

  const getAutoLogoutCheckbox = function() {
    const checkbox = new west.gui.Checkbox('Автоматический релогин');
    if (storedSettings.isAutoLogout) {
      checkbox.toggle();
    }
    checkbox.setCallback(() => {
      storedSettings.isAutoLogout = checkbox.isSelected();
      localStorage.setItem(
        settingsStorageKey,
        JSON.stringify(storedSettings),
      );
      new UserMessage(
        'Настойки сохранены',
        UserMessage.TYPE_SUCCESS,
      ).show();
    });

    return checkbox;
  };

  const getCheckCharacterCheckbox = function() {
    const checkbox = new west.gui.Checkbox('Подбухивать');
    if (storedSettings.toDrinkOrNotToDrink) {
      checkbox.toggle();
    }
    toggleBuffsUsing(storedSettings.toDrinkOrNotToDrink);
    checkbox.setCallback(() => {
      toggleBuffsUsing(checkbox.isSelected());
      storedSettings.toDrinkOrNotToDrink = checkbox.isSelected();
      localStorage.setItem(
        settingsStorageKey,
        JSON.stringify(storedSettings),
      );
      new UserMessage(
        'Настойки сохранены',
        UserMessage.TYPE_SUCCESS,
      ).show();
    });

    return checkbox;
  };

   async function updateMotivation() {
     const json = await AjaxAsync.remoteCall('duel', 'search_op', {});
     Character.setDuelMotivation(json.motivation);
  }

  function checkCharacter() {
     // Clear interval if it's already running
    clearInterval(checkCharacterIntervalId);

    checkCharacterIntervalId = setInterval(function () {
      if (!storedSettings.isStarted || !storedSettings.toDrinkOrNotToDrink) return;
      if (Date.now() < Character.cooldown * 1000) return;
      let missedEnergyPercents = 100 - Character.energy / Character.maxEnergy * 100;
      let missedHealthPercents = 100 - Character.health / Character.maxHealth * 100;
      let buff;

      if (!buff && missedHealthPercents > 50) {
        buff = Bag.getItemByItemId(buffs.cake) ||
          Bag.getItemByItemId(buffs.healthEgg) ||
          Bag.getItemByItemId(buffs.chocoCake) ||
          Bag.getItemByItemId(buffs.cabbage) ||
          Bag.getItemByItemId(buffs.healthDye);
      }
      if (storedSettings.isNotRestoreMotivation) {
        if (!buff && missedEnergyPercents > 25) {
          buff = Bag.getItemByItemId(buffs.tea20);
        }
        if (!buff && missedEnergyPercents >= 10) {
          buff = Bag.getItemByItemId(buffs.beans10);
        }
      } else {
        if (!buff && Character.energy < 12) {
          buff = Bag.getItemByItemId(buffs.tea);
        }
        if (!buff && missedEnergyPercents >= 50 && Character.duelMotivation <= 0.9) {
          buff = Bag.getItemByItemId(buffs.guarana);
        }
        if (!buff && Character.duelMotivation < 0.9) {
          buff = Bag.getItemByItemId(buffs.cigarettes) ||
            Bag.getItemByItemId(buffs.duelEgg) ||
            Bag.getItemByItemId(buffs.firecracker) ||
            Bag.getItemByItemId(buffs.gingerbread) ||
            Bag.getItemByItemId(buffs.duelDye) ||
            Bag.getItemByItemId(buffs.bag);
        }
        if (!buff && missedEnergyPercents >= 25 && Character.duelMotivation <= 0.95) {
          buff = Bag.getItemByItemId(buffs.coffee);
        }
      }

      if (!buff || buff.obj == null) return;

      let itemId = buff.obj.item_id;
      console.log('Хочу подбухнуть ' + ItemManager.get(itemId).name);
      Ajax.remoteCall("itemuse", "use_item", {
        item_id: itemId,
        lastInvId: Bag.getLastInvId()
      }, function (response) {
        if (!response.error) {
          if (Character.cooldown != response.msg.cooldown) {
            Character.cooldown = response.msg.cooldown;
            EventHandler.signal("cooldown_changed");
          }
          if (response.msg.itemCooldown) {
            Bag.itemCooldown[itemId] = response.msg.itemCooldown;
            EventHandler.signal("cooldown_changed");
          }
          if (response.msg.itemLifetime) {
            EventHandler.signal('item_lifetime_changed', [itemId, response.msg.itemLifetime]);
          }
          console.log(response);
          Bag.updateChanges(response.msg.changes || {});
        }
      })
    }, 10000);
  }

  async function getStatistics(currentPage = 1) {
    const container = document.getElementById('duel-statistics-container');
    if (currentPage === 1) {
      container.innerHTML = '';
      statistics = {};
      new UserMessage(
        'Смотрим статистику...',
        UserMessage.TYPE_HINT,
      ).show();
    }

    const json = await AjaxAsync.remoteCall('reports', 'get_reports', {
      page: currentPage,
      folder: 'duel',
    });

    const reports = json.reports.filter(report => report.title.includes('Дуэль:') && report.date_received.includes('Сегодня'));

    reports.forEach(report => {
      const data = determineWinnerAndExperience(report);
      if (statistics[data.winner]) {
        statistics[data.winner].experience += data.experience;
        statistics[data.winner].won += 1;
      } else {
        statistics[data.winner] = { experience: data.experience, won: 1, lost: 0 };
      }

      if (statistics[data.loser]) {
        statistics[data.loser].lost += 1;
      } else {
        statistics[data.loser] = { experience: 0, won: 0, lost: 1 };
      }
    });

    if (reports.length > 0) {
      await getStatistics(currentPage + 1);
    } else {
      const sortedPlayerExperience = Object.entries(statistics)
        .sort(([, a], [, b]) => b.experience - a.experience)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const title = document.createElement('div');
      title.textContent = 'Статистика:';
      title.classList.add('duels-bot__title');
      title.style.marginTop = '10px';
      title.style.fontWeight = '600';
      container.appendChild(title);
      container.appendChild(createTableFromPlayerExperience(sortedPlayerExperience));
    }
  }

  function createTableFromPlayerExperience(experienceData) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const headerCell1 = headerRow.insertCell();
    const headerCell2 = headerRow.insertCell();
    const headerCell3 = headerRow.insertCell();
    const headerCell4 = headerRow.insertCell();
    headerCell1.textContent = 'Игрок';
    headerCell2.textContent = 'Опыт';
    headerCell3.textContent = 'Побед';
    headerCell4.textContent = 'Поражений';

    for (const playerName in experienceData) {
      const row = table.insertRow();
      const cell1 = row.insertCell();
      const cell2 = row.insertCell();
      const cell3 = row.insertCell();
      const cell4 = row.insertCell();
      cell1.textContent = playerName;
      cell2.textContent = experienceData[playerName].experience;
      cell3.textContent = experienceData[playerName].won;
      cell4.textContent = experienceData[playerName].lost;
    }

    return table;
  }

  function determineWinnerAndExperience(report) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(report.popupData, 'text/html');

    const duelPattern = /Дуэль:\s*(.*?)\s* и \s*(.*?)$/;
    const match = report.title.match(duelPattern);
    const player1 = match[1];
    const player2 = match[2];

    const victoryRow = htmlDoc.querySelector('tr:nth-of-type(3)');
    if (victoryRow) {
      const victoryText = victoryRow.textContent.trim();
      const winner = victoryText.split(' за игроком ')[1];

      const experienceRow = htmlDoc.querySelector('div table tr:nth-of-type(1) td:nth-of-type(2)');
      const experienceText = experienceRow.textContent.trim();
      const experience = parseFloat(experienceText);

      return { winner, experience, loser: winner === player1 ? player2 : player1 };
    }
  }

  function startJob() {
    const maxJobs = Premium.hasBonus('automation') ?  9 : 4;

    const jobTask = TaskQueue.queue.find(task => task.type === 'job');
    if (jobTask) {
      jobTaskIntervalId = setInterval(() => {
        TaskQueue.add(new TaskJob(jobTask.post.jobId, jobTask.post.x, jobTask.post.y, 3600))
      }, tenMinutes);
      new UserMessage(
        'Люблю поработать',
        UserMessage.TYPE_SUCCESS,
      ).show();
    } else {
      new UserMessage(
        'Сначала поставь работу',
        UserMessage.TYPE_ERROR,
      ).show();
    }
  }

  function sleepInFort() {
    const sleepTask = TaskQueue.queue.find(task => task.type === 'fortsleep');
    if (sleepTask) {
      sleepInFortIntervalId = setInterval(() => {
        TaskQueue.add(new TaskFortSleep(sleepTask.data.fortId))
      }, tenMinutes);
      new UserMessage(
        'Режим вечного сна включен',
        UserMessage.TYPE_SUCCESS,
      ).show();
    } else {
      new UserMessage(
        'Сначала поставь сон в форте',
        UserMessage.TYPE_ERROR,
      ).show();
    }
  }

  function stopSleepInFort() {
    clearInterval(sleepInFortIntervalId);
    new UserMessage(
      'Режим вечного сна выключен',
      UserMessage.TYPE_SUCCESS,
    ).show();
  }

  function autoLogin() {
    if (location.href.includes('index.php?page=logout')) {
      location.href = '/';
      return;
    }
    if (location.hash.includes('loginWorld')) {
      setTimeout(function () {
        $('#loginButton').click();
        let val = setInterval(function () {
          let u = Worlds.playerWorlds;
          if (Object.keys(u).length !== 0) {
            clearInterval(val);
            Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
          }
        }, 500);
      }, 1000);
    }
  }

  function autoLogout() {
    const timeoutInMinutes = Math.floor(Math.random() * (360 - 120 + 1)) + 120; // Random timeout between 120 and 360 minutes
    const timeoutInMilliseconds = timeoutInMinutes * 60 * 1000; // Convert minutes to milliseconds
    if (storedSettings.isAutoLogout) {
      console.log('Auto logout after ' + timeoutInMinutes + ' minutes');
    }
    setTimeout(() => {
      if (storedSettings.isAutoLogout) {
        let world = Game.gameURL.replace(/\D/g, '');
        window.history.pushState("object or string", "Title", `/#loginWorld${world}`);
        setTimeout(function() {
          window.history.go()
        }, 3000);
      }
    }, timeoutInMilliseconds);
  }

  $(document).ready(async () => {
    try {
      init();
      addStyles();
      listenTaskQueueUpdated();
      autoLogin();
      autoLogout();
      if (storedSettings.isStarted && storedSettings.toDrinkOrNotToDrink) {
        checkCharacter();
      }
      if (storedSettings.isStarted) {
        startDuel();
      }
    } catch (err) {
      console.log(err.stack);
    }
  });

  const AjaxAsync = function() {
    jQuery.ajaxSetup({
      type: 'POST',
      dataType: 'json'
    });
    var makeUrl = function(options) {
      var url = 'game.php'
        , params = [];
      if (options.window)
        params.push('window=' + options.window);
      if (options.action)
        params.push('action=' + options.action, 'h=' + Player.h);
      if (options.ajax)
        params.push('ajax=' + options.ajax);
      if (options.mode)
        params.push('mode=' + options.mode);
      return url + params.length ? '?' + params.join('&') : '';
    };
    var onFinish = function(window) {
      return function() {
        if (window && window.hideLoader)
          window.hideLoader();
        else if (window && window.hasOwnProperty('window'))
          window.window.hideLoader();
      };
    };
    var request = async function(options) {
      var url = options.url || makeUrl(options);
      return await jQuery.ajax(url, options);
    };
    var defaultRequest = async function(options, window) {
      if (window && window.showLoader)
        window.showLoader();
      else if (window && window.hasOwnProperty('window'))
        window.window.showLoader();
      var result = await request(options);
      onFinish(window)();
      return result;
    };
    return {
      remoteCall: async function(window, action, param, view) {
        return await defaultRequest({
          window: window,
          action: action,
          data: param
        }, view);
      },
      remoteCallMode: async function(window, mode, param, view) {
        return await defaultRequest({
          window: window,
          mode: mode,
          data: param
        }, view);
      },
      get: async function(window, ajax, param, view) {
        return await defaultRequest({
          window: window,
          ajax: ajax,
          data: param
        }, view);
      },
      gameServiceRequest: async function(method, urlparam, post) {
        return await defaultRequest({
          url: Game.serviceURL + '/' + method + '/' + urlparam,
          data: post
        });
      },
      request: request
    }
  }();
})();



