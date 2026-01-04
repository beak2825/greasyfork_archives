// ==UserScript==
// @name         World Duels Scanner
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @license MIT
// @description  It helps to find all matherfuckers of the west!
// @author       Serhii T
// @include http*://*.the-west.*/game.php*
// @include http*://*.the-west.*.*/game.php*
// @require https://update.greasyfork.org/scripts/490628/1347984/Ajax%20Async%20Lib.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ru.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494310/World%20Duels%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/494310/World%20Duels%20Scanner.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let cities = [];
  let allianceCities = [];
  let pages;
  let playersData = [];
  let currentSort = {'sortBy': 'level', 'orderBy': 'desc'};
  let currentPlayerId;
  let isStarted = false;
  let toDrinkOrNotToDrink = false;
  let duelSorting = 'distance'; // level / distance
  let sets;
  const setNames = {
    speed: 'Бег',
    duel: 'дуэль-танк'
  };
  const buffs = {
    tea: 1890000,
    pinkWater: 1898000,
  };
  const ignoreList = [
  ];
  const priorityCities = [
    'Пиф-Паф','Шивелуч'
  ];
  const priorityPlayers = {
    'Sando': 'дуэль-мили-меткость'
  };
  const storageKey = `${Game.worldName}_world_duel_players`
  let checkCharacterIntervalId;

  let sortingBy = {
    name: function (a, b) {
      return a.name.toUpperCase().replace(/^Ä/, "A").replace(/^Ö/, "O").replace(/^Ü/, "U").replace(/^É/, "E") > b.name.toUpperCase().replace(/^Ä/, "A").replace(/^Ö/, "O").replace(/^Ü/, "U").replace(/^É/, "E") ? 1 : -1;
    }, level: function (a, b) {
      return a.level - b.level || -sortingBy.name(a, b);
    }, duellevel: function (a, b) {
      return a.duel_level - b.duel_level;
    }, experience: function (a, b) {
      return a.inLevelRange - b.inLevelRange;
    }, waytime: function (a, b) {
      const timeA = convertTimeToSeconds(a.travel_distance);
      const timeB = convertTimeToSeconds(b.travel_distance);

      return timeA - timeB;
    }, standard: function (a, b) {
      return sortingBy.name(a, b);
    }
  };

  const convertTimeToSeconds = (time) => {
    if (time === '-') return 0;
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };


  async function getAllCities() {
    let page = 1;
    do {
      const citiesPart = await getCities(page);
      cities.push(...citiesPart.filter(city => city.mean_level > 100 && !allianceCities.includes(city.town_id)));
      page++
    } while (page <= pages)
  }

  async function getCities(page) {
    return AjaxAsync.remoteCallMode('ranking', 'get_data', {
      page: page,
      tab: 'cities',
    }).then(function (json) {
      if (!json.error) {
        pages = json.pages;
        return json.ranking;
      }
    })
  }

  function sortContent(ev) {
    startSortDispatcher(ev.data.sortBy);
    updateSaloonWindow();
  }

  function startSortDispatcher(sortBy) {
    if (currentSort.sortBy == sortBy) {
      currentSort.orderBy = currentSort.orderBy == 'asc' ? 'desc' : 'asc';
      playersData.reverse();
    } else {
      currentSort.sortBy = sortBy;
      currentSort.orderBy = 'asc';
      playersData.sort(sortingBy.hasOwnProperty(currentSort.sortBy) ? sortingBy[currentSort.sortBy] : sortingBy.standard);
    }
  }


  function initSaloonWindow() {
    let maindiv = $('<div></div>');
    maindiv.append('<div class="saloon-info">' + "Все игроки мира доступные для дуэли" + '</div>' + '<div class="saloon_duel_moti"></div>');
    SaloonWindow.table = new west.gui.Table().setId('saloon-table-' + SaloonWindow.townId).appendTo(maindiv).addColumn("sal_playername").addColumn("sal_duel_lvl").addColumn("sal_duel_exp").addColumn("sal_way").addColumn("sal_duel").appendToThCell("head", "sal_playername", 'Имя персонажа', 'Имя персонажа').appendToThCell("head", "sal_duel_lvl", 'Дуэльный разряд', 'Дуэльный разряд').appendToThCell("head", "sal_duel_exp", 'Опыт'.cutIt(10), 'Опыт').appendToThCell("head", "sal_way", 'Расстояние', 'Расстояние').appendToThCell("head", "sal_duel", 'Дуэль', 'Дуэль');
    $('div.sal_playername', maindiv).on('click', {sortBy: 'name'}, sortContent);
    $('div.sal_duel_lvl', maindiv).on('click', {sortBy: 'duellevel'}, sortContent);
    $('div.sal_duel_exp', maindiv).on('click', {sortBy: 'experience'}, sortContent);
    $('div.sal_way', maindiv).on('click', {sortBy: 'waytime'}, sortContent);
    $('div.saloon-content', SaloonWindow.DOM).append(maindiv);
  }

  function openSaloon(data) {
    SaloonWindow.townId = Character.homeTown.town_id;
    SaloonWindow.window = wman.open('saloon-' + SaloonWindow.townId).setMiniTitle('Смертники').appendToContentPane($('<div class="saloon-content"></div>'));
    SaloonWindow.DOM = $('div.saloon-' + SaloonWindow.townId);
    SaloonWindow.window.setTitle('Смертники');
    initSaloonWindow();

    playersData = data.players;
    SaloonWindow.self = data.self;

    updateSaloonWindow();
  }

  function updateSaloonWindow() {
    SaloonWindow.table.clearBody();
    let tmpCells = {};
    for (let i = 0; i < playersData.length; i++) {
      let rd = playersData[i];
      if (isPlayerIncluded(rd)) {
        let name_link = '<a href="javascript:void(PlayerProfileWindow.open(' + rd.player_id + '));">' + rd.name + '</a>';
        let name_title = (rd.title) ? rd.title + rd.name : rd.name;
        let name_link_title = (rd.title) ? rd.title + name_link : name_link;
        tmpCells['sal_playername'] = "<span title='" + name_title + "'>" + name_link_title + "</span>";
        tmpCells['sal_duel_lvl'] = rd.duel_level;
        tmpCells['sal_duel_exp'] = rd.exp;
        tmpCells['sal_way'] = rd.travel_distance;
        tmpCells['sal_duel'] = SaloonWindow.playerStat(rd);
        SaloonWindow.table.buildRow('sal_duel_id_' + rd.player_id, tmpCells);
      }
    }
  }

  function isPlayerIncluded(player) {
    const stat = SaloonWindow.playerStat(player);
    return (Object.keys(priorityPlayers).includes(player.name) || stat.includes('SaloonWindow.startDuel'))
      && !ignoreList.includes(player.name);
  }

  function updateDistance() {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const data = JSON.parse(storedData);
      const players = data.players;
      for (const player of players) {
        player.travel_distance = Map.calcWayTime(Character.position, {x: player.x, y: player.y }).formatDuration()
      }
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }

  async function updatePlayersPositions() {
    const storedData = localStorage.getItem(storageKey);
    const data = JSON.parse(storedData);

    for (const player of data.players) {
      const position = await getPosition(player.player_id);
      player.x = position.x;
      player.y = position.y;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  async function getPosition(playerId) {
    return AjaxAsync.remoteCallMode("profile", "init", {playerId: playerId}).then(function (json) {
      if (!json.error) {
        return {x: json.x, y: json.y};
      }
    });
  }

  async function getPlayerPosition(name, playerId) {
    return AjaxAsync.remoteCallMode("profile", "init", {name, playerId});
  }

  async function getPlayers(townId) {
    return AjaxAsync.remoteCallMode("building_saloon", "get_data", {
      town_id: townId
    });
  }

  async function getAllianceCities() {
    if (Character.homeTown.alliance_id === 0) return [];

    const resp = await AjaxAsync.remoteCallMode("alliance", "get_data", {alliance_id: Character.homeTown.alliance_id});
    return resp.data.towns.map(town => town.town_id);
  }

  async function executeRequestsSequentially(cities) {
    const data = {
      players: [],
      self: null
    };

    for (const city of cities) {
      // Perform the request for each city
      const cityData = await getPlayers(city.town_id);

      cityData.players.forEach(player => {
        player.town_name = city.town_name;
      })

      // Update the data object
      data.players.push(...cityData.players);
      if (!data.self) {
        data.self = cityData.self;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return data;
  }

  function getSortedDataForDuel() {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const data = JSON.parse(storedData);
      let players = data.players;
      if (duelSorting === 'level') {
        // sort by duel level
        return {...data, players: players.sort((a, b) => b.duel_level - a.duel_level)};
      }
      // sort by distance and city and players priority
      const highestPriorityPlayers = players.filter((player) => Object.keys(priorityPlayers).includes(player.name));
      players = players.filter((player) => !highestPriorityPlayers.some(p => p.name === player.name));

      const priorityCityPlayers = players.filter((player) => priorityCities.includes(player.town_name))
        .sort((a, b) => convertTimeToSeconds(a.travel_distance) - convertTimeToSeconds(b.travel_distance));
      players = players.filter((player) => !priorityCityPlayers.some(p => p.name === player.name));

      const notPriorityPlayers =  players
        .sort((a, b) => convertTimeToSeconds(a.travel_distance) - convertTimeToSeconds(b.travel_distance));

      return {...data, players: [...highestPriorityPlayers, ...priorityCityPlayers, ...notPriorityPlayers]};
    }
  }

  async function startDuel() {
    if (!isStarted || !localStorage.getItem(storageKey) || Character.energy < 12) return;
    const data = getSortedDataForDuel();
    const oneHour = 3600 * 1000;
    let index = data.players.findIndex((player) => player.lastDuelTime + oneHour < Date.now())
    if (currentPlayerId === data.players[index].player_id) {
      console.log(`Excluding ${data.players[index].name} for 1 hour`);
      // get the same player again. Exclude him from the list for 1 hour
      data.players[index].lastDuelTime = Date.now();
      // increment to get the next player
      index = index + 1;
    }

    console.log('selected players', data.players);
    const player = data.players[index];
    console.log('Dueling ', player.name);
    currentPlayerId = player.player_id;

    const playerPosition = await getPlayerPosition(player.name, player.player_id);
    console.log('playerPosition', playerPosition);
    player.x = playerPosition.x;
    player.y = playerPosition.y;
    player.travel_distance = Map.calcWayTime(Character.position, {x: player.x, y: player.y }).formatDuration()


    if (isTheSamePosition(player)) {
      // update time for player to exclude him from the list for 1 hour
      player.lastDuelTime = Date.now() + 600 * 1000; // + ten minutes
      if (Object.keys(priorityPlayers).includes(player.name)) {
        console.log('Wearing duel set: ', priorityPlayers[player.name]);
        await wearSet(priorityPlayers[player.name]);
      } else {
        console.log('Wearing duel set: ', setNames.duel);
        await wearSet(setNames.duel);
      }
    } else {
      // don't update lastDuelTime if character moves to the player. This player will be found on the next function call
      console.log('Wearing speed set: ', setNames.speed);
      await wearSet(setNames.speed);
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
    TaskQueue.add(new TaskDuel(player.player_id));
  }

  async function wearSet(setName) {
    const set = (await getSets()).find(set => set.name === setName)
    EquipManager.switchEquip(set.equip_manager_id);
    await Beans.waitEquip(Beans.getSetItemArray(set))
  }

  async function getSets() {
    return sets || (await AjaxAsync.remoteCallMode('inventory', 'show_equip', {})).data;
  }

  function isTheSamePosition(player) {
    return Character.calcWayTo(player.x, player.y) == 0
  }

  function listenTaskQueueUpdated() {
    EventHandler.listen('taskqueue-updated', function (taskQueue) {
      if (!isStarted) return;

      if (taskQueue.length === 0) {
        console.log('taskqueue-updated fired. Starting duel')
        startDuel();
      }
    });
  }

   function listenCharacterPositionChanged() {
    EventHandler.listen('position_change', async ()=> {
      updateDistance();
      if (!isStarted) return;

      const task = TaskQueue.queue[0];
      if (task && task.type === 'duel') {
        const data = task.data;
        console.log('duel', data)
        if (isTheSamePosition(data)) {
          currentPlayerId = null;
          TaskQueue.cancelAll();
        }
      }
    });
  }

  function checkCharacter() {
    // Clear interval if it's already running
    clearInterval(checkCharacterIntervalId);

    checkCharacterIntervalId = setInterval(function () {
      if (!isStarted || !toDrinkOrNotToDrink) return;
      if (Date.now() < Character.cooldown * 1000) return;
      let missedEnergyPercents = 100 - Character.energy / Character.maxEnergy * 100;
      let missedHealthPercents = 100 - Character.health / Character.maxHealth * 100;
      let buff;

      if (!buff && missedHealthPercents > 30) {
        buff = Bag.getItemByItemId(buffs.pinkWater);
      }
      if (!buff && missedEnergyPercents > 30) {
        buff = Bag.getItemByItemId(buffs.tea);
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
          Bag.updateChanges(response.msg.changes || {});
        }
      })
    }, 10000);
  }

  function toggleSelectBox() {
    let pos = $('#world-duels-scanner').offset();
    pos = {
      clientX: pos.left,
      clientY: pos.top
    };
    let listener = function (k) {
      switch (k) {
        case 'open':
          if (!localStorage.getItem(storageKey)) {
            new UserMessage('Загружаем список игроков', UserMessage.TYPE_HINT).show();
          }
          open();
          break;
        case 'refresh':
          new UserMessage('Обновляем данные', UserMessage.TYPE_HINT).show();
          localStorage.removeItem(storageKey);
          open();
          break;
        case 'refresh-positions':
          new UserMessage('Обновляем позиции игроков', UserMessage.TYPE_HINT).show();
          updatePlayersPositions().then(() => {open()});
          break;
        case 'toggle-auto-duels':
          isStarted = !isStarted;
          const message = isStarted ? 'Авто-дуэли включены' : 'Авто-дуэли выключены';
          new UserMessage(message, UserMessage.TYPE_HINT).show();
          // clearInterval(updatePositionIntervalId);
          if (isStarted) {
            startDuel();
            // updatePositionIntervalId = setInterval(function () {
            //   updateMyPosition();
            // }, 30000);
          }
          break;
        case 'toggle-auto-drink':
          toDrinkOrNotToDrink = !toDrinkOrNotToDrink;
          const messageDrink = toDrinkOrNotToDrink ? 'Авто-подбухивание включено' : 'Авто-подбухивание выключено';
          new UserMessage(messageDrink, UserMessage.TYPE_HINT).show();
          if (toDrinkOrNotToDrink) {
            checkCharacter();
          } else {
            clearInterval(checkCharacterIntervalId);
          }
          break;
        case 'auto-duel-sorting':
          duelSorting = duelSorting === 'level' ? 'distance' : 'level';
          const messageSorting = duelSorting === 'level' ? 'Сортировка по ДР' : 'Сортировка по расстоянию';
          new UserMessage(messageSorting, UserMessage.TYPE_HINT).show();
          break;
      }
    };
    const selectBox = new west.gui.Selectbox().setWidth(150)
      .addListener(listener)
      .addItem('open', 'Открыть список')
      .addItem('refresh', 'Обновить данные')
      .addItem('refresh-positions', 'Обновить позиции')
      .addItem('toggle-auto-duels', 'Авто-дуэли ' + (isStarted ? 'ON' : 'OFF'))
      .addItem('toggle-auto-drink', 'Подбухивание ' + (toDrinkOrNotToDrink ? 'ON' : 'OFF'))
      .addItem('auto-duel-sorting', 'Сортировка ' + (duelSorting === 'level' ? 'по ДР' : 'по расстоянию'));

    selectBox.show(pos)
  }

  function init() {
    const div = $('<div class="ui_menucontainer" />');
    const link = $(
      '<img class="menulink"' +
      ' id="world-duels-scanner"' +
      ' title="World duels scanner"' +
      ' src="https://westru.innogamescdn.com/images/achievements/duel-gold-1tyg1.png"' +
      ' width="25px" height="25px">'
    )

    $(link).on('click', () => toggleSelectBox());

    $('#ui_menubar').append(
      div.append(link).append('<div class="menucontainer_bottom" />'),
    );
  }

  async function open() {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const data = JSON.parse(storedData);
      openSaloon(data);
    } else {
      allianceCities = await getAllianceCities();
      await getAllCities();

      const data = await executeRequestsSequentially(cities);
      data.players = data.players
        .filter((player) => player.player_id !== Character.playerId)
        .filter((player) => isPlayerIncluded(player))
        .map((player) => {
          player.lastDuelTime = 0;
          return player;
        });
      localStorage.setItem(storageKey, JSON.stringify(data));
      openSaloon(data);
    }
  }

  $(document).ready(async () => {
    try {
      init();
      listenTaskQueueUpdated();
      listenCharacterPositionChanged();
    } catch (err) {
      console.log(err.stack);
    }
  });
})();
