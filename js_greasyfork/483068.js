// ==UserScript==
// @name         Skills Scanner
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @license MIT
// @description  It helps to kill all matherfuckers of the west!
// @author       Serhii T
// @include http*://*.the-west.*/game.php*
// @include http*://*.the-west.*.*/game.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ru.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483068/Skills%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/483068/Skills%20Scanner.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let currentSet;
  let playerId;
  let playerName;

  function open() {
    let setSkills;
    let fullSkills;
    let nativeSkills;
    const win = wman
      .open('SkillsScanner', 'Skills Scanner', 'noreload')
      .setMaxSize(1268, 900)
      .setMiniTitle('Skills Scanner');
    const scrollPane = new west.gui.Scrollpane();
    scrollPane.appendContent(`<br/>`);

    const input = new west.gui.Textfield(
      `#skill_scan_input`,
      'text',
    );
    input.setPlaceholder('Ник игрока');
    scrollPane.appendContent(input.getMainDiv());
    const button = new west.gui.Button('Посмотреть', async () => {
      $('#skill-scan__skills').remove();

      const loader = $('#skill-scan-loader');

      loader.show();
      try {
        const name = getSearchName(input.getValue());

        await findPlayer(name);

        new UserMessage(
          'Смотрим статы игрока ' + playerName,
          UserMessage.TYPE_HINT,
        ).show();

        setSkills = await getWearBonus(playerId);
        fullSkills = await getFullStats(setSkills);
        nativeSkills = getNativeSkills(fullSkills, setSkills);

        fullSkills.skill.aim = setSkills.skill.aim + nativeSkills.skill.aim;
        fullSkills.skill.dodge = setSkills.skill.dodge + nativeSkills.skill.dodge;

        scrollPane.appendContent(`
        <div id="skill-scan__skills">
          <div class="skill-scan__title">Все навыки и характеристики</div>
          ${TWIR.Popups.bonusXHTML(fullSkills)}
          <div class="skill-scan__title">Бонус комплекта</div>
          ${TWIR.Popups.bonusXHTML(setSkills)}
          <div class="skill-scan__title">Раскач персонажа (меткость и увёртливость взяты с характеристик)</div>
          ${TWIR.Popups.bonusXHTML(nativeSkills)}
        </div>`
        );
      } catch (err) {
        scrollPane.appendContent(`<div id="skill-scan__skills" class="skill-scan__title">${err}</div>`);
      }
      finally {
        loader.hide();
      }
    });

    scrollPane.appendContent(button.getMainDiv());
    scrollPane.appendContent(`<br />
      <div style="margin-top: 10px" class="skill-scan__title"><b>Значения навыков включают в себя характеристики</b></div>
     <br />`);
    scrollPane.appendContent(`
      <div id="skill-scan-loader">
        <img src="https://westru.innogamescdn.com/images/throbber2.gif">
      <div/>`);

    win.appendToContentPane(scrollPane.getMainDiv());
  }

  async function findPlayer(name) {
    return AjaxAsync.remoteCallMode('ranking', 'get_data', {
      page: 0,
      search: name,
      tab: 'experience',
      entries_per_page: 1
    }).then(function (json) {
      if (!json.error) {
        const player = json.ranking[0];
        if (player) {
          playerId = player.player_id;
          playerName = player.name;
        } else {
          throw new Error('Игрок не найден');
        }
      } else {
        throw new Error('Игрок не найден');
      }
    })
  }

  function getWearBonus(playerId) {
    let setSkills;
    const emptyAttributes = {
      charisma: 0,
      dexterity: 0,
      flexibility: 0,
      strength: 0,
    }

    const win = PlayerProfileWindow.open(playerId);
    $('div.tw2gui_window_buttons_close', win.window.divMain).click();

    return new Promise(resolve => {
      setTimeout(() => {
        setSkills = {
          skill: currentSet.skill,
          attribute: { ...emptyAttributes, ...currentSet.attribute },
        };
        Object.keys(CharacterSkills.skillKeys4Attr).forEach(attr => {
          const attributeValue = setSkills.attribute[attr];
          if (attributeValue) {
            CharacterSkills.skillKeys4Attr[attr]
              .forEach(skill => {
                setSkills.skill[skill] ?
                  setSkills.skill[skill] += attributeValue :
                  setSkills.skill[skill] = attributeValue;
              })
          }
        });
        resolve(setSkills);
      }, 1000);
    });
  }

  async function getFullStats() {
    let result = {
      skill: {},
      attribute: {},
    };
    const skills = CharacterSkills.allSkillKeys
      .filter(skill => skill !== 'aim')
      .filter(skill => skill !== 'dodge');

    for (const skill of skills) {
      await new Promise(resolve => setTimeout(resolve, 500));
      AjaxAsync.remoteCallMode('ranking', 'get_data', {
        page: 0,
        tab: 'skills',
        skill: skill,
        entries_per_page: 1000
      }).then(function (json) {
        if (!json.error) {
          const player = json.ranking.find(char => char.player_id === playerId);
          if (player) {
            result.skill[skill] = player.skill_level;
          }
        }
      });
    }

    const attributes = CharacterSkills.allAttrKeys;

    const attributesReq = attributes.map((attribute) => {
      return AjaxAsync.remoteCallMode('ranking', 'get_data', {
        page: 0,
        tab: 'skills',
        skill: attribute,
        entries_per_page: 1000
      }).then(function (json) {
        if (!json.error) {
          const player = json.ranking.find(char => char.player_id === playerId);
          if (player) {
            result.attribute[attribute] = player.skill_level;
          }
        }
      })
    });

    await Promise.all(attributesReq)

    return result;
  }

  function getNativeSkills(fullSkills, setSkills) {
    const nativeSkills = {};
    Object.keys(fullSkills.skill).forEach(skill => {
      nativeSkills[skill] = fullSkills.skill[skill] - setSkills.skill[skill];
    });
    nativeSkills.aim = fullSkills.attribute.dexterity - setSkills.attribute.dexterity;
    nativeSkills.dodge = fullSkills.attribute.flexibility - setSkills.attribute.flexibility;

    const nativeAttributes = {};
    Object.keys(fullSkills.attribute).forEach(attribute => {
      nativeAttributes[attribute] = fullSkills.attribute[attribute] - setSkills.attribute[attribute];
    });

    return {
      skill: nativeSkills,
      attribute: nativeAttributes,
    }
  }

  function getSearchName(name) {
    return name.trim().toLowerCase();
  }

  function improveMenuBar() {
    const style = document.createElement('style');

    style.textContent = `
      div#ui_menubar {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        direction: rtl;
      }
      div.ui_menucontainer {
        background: #502B20;
        margin: 0;
        padding: 4px;
        height: max-content;
        border-radius: 4px;
      }
      .menulink {
        margin: 0;
      }
      div.ui_menucontainer div.menucontainer_bottom {
        background: none
      }
      .ui_menucontainer.questtracker {
        order:1
      }
      #skill-scan-loader {
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 95%;
        margin-top: 25px;
        display: none;
      }
      #skill-scan-loader img {
        position: absolute;
        height: 27px;
        width: 35px;
        margin: -18px 0px 0px -14px;
        top: 50%;
        left: 50%;
      }
      .skill-scan__title {
        margin: 2px 10px;
        font-size: 14px;
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    const div = $('<div class="ui_menucontainer" />');
    const link = $(
      '<div id="skill-scan" class="menulink lcharacter" title="Skill scanner" />',
    )

    $(link).on('click', () => open());

    $('#ui_menubar').append(
      div.append(link).append('<div class="menucontainer_bottom" />'),
    );

    const mergeBonus = TWIR_Calc.mergeBonus;

    TWIR_Calc.mergeBonus = (e) => {
      const bonus = mergeBonus(e);
      currentSet = bonus;
      return bonus;
    }
  }

  $(document).ready(() => {
    try {
      init();
      improveMenuBar();
    } catch (err) {
      console.log(err.stack);
      setTimeout(init, 5000);
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
