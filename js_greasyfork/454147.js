// ==UserScript==
// @name         🐭️ MouseHunt - Shields
// @version      1.7.0
// @description  Change your MouseHunt shield to an event shield, like the Halloween shield.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.5.3/mousehunt-utils.js
// @require      https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/454147/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Shields.user.js
// @updateURL https://update.greasyfork.org/scripts/454147/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Shields.meta.js
// ==/UserScript==

((function () {
  'use strict';

  const addClass = (el, shieldClass) => {
    const classToAdd = shieldClass.replace('.', ' ');

    classToAdd.split(' ').forEach((className) => {
      el.classList.add(className);
    });
  };

  const changeShield = () => {
    const classesToUse = [];

    shieldChoices.forEach((shield) => {
      const setting = getSetting(`${shield}-shield`);
      if (setting) {
        classesToUse.push(shield);
      }
    });

    const shieldEl = document.querySelector('.mousehuntHud-shield');
    if (! shieldEl) {
      return;
    }

    // Remove all shield classes.
    shieldEl.classList.remove(...shieldChoices);

    if (classesToUse.length > 1) {
      // If there are multiple shields, use a random one.
      const randomShield = classesToUse[ Math.floor(Math.random() * classesToUse.length) ];
      addClass(shieldEl, randomShield);
    } else if (classesToUse.length === 1) {
      // If there is only one shield, use that one.
      addClass(shieldEl, classesToUse[ 0 ]);
    }
  };

  const titleBadge = () => {
    let title = user.title_name || 'novice';
    title = title.toLowerCase();

    title.replace('lady', 'lord');
    title.replace('wo', '');
    title.replace('ess', '');
    title.replace('duch', 'duke');

    const titleImages = {
      novice: 'https://www.mousehuntgame.com/images/titles/84bc1109b5cd7aa8c24d195bc8207c38.png?cv=2',
      apprentice: 'https://www.mousehuntgame.com/images/titles/3f1e44bbaa7138da4c326819e9f3f0a8.png?cv=2',
      initiate: 'https://www.mousehuntgame.com/images/titles/6f4673dd2d9d1e98b4569667d702a775.png?cv=2',
      journeyman: 'https://www.mousehuntgame.com/images/titles/e96387f7261b95c0eeab9291e4e594e1.png?cv=2',
      master: 'https://www.mousehuntgame.com/images/titles/ad6875955f541159133c6d3798519f81.png?cv=2',
      grandmaster: 'https://www.mousehuntgame.com/images/titles/35ee6056a09037fb13a9195881875045.png?cv=2',
      legendary: 'https://www.mousehuntgame.com/images/titles/0da3761747914f497c16dc2051ba132d.png?cv=2',
      hero: 'https://www.mousehuntgame.com/images/titles/fca35751046f4bcc972716ca484b6d61.png?cv=2',
      knight: 'https://www.mousehuntgame.com/images/titles/398dca9a8c7703de969769491622ca32.png?cv=2',
      lord: 'https://www.mousehuntgame.com/images/titles/9a6acd429a9a3a4849ed13901288b0b8.png?cv=2',
      baron: 'https://www.mousehuntgame.com/images/titles/ea9c0ec2e6d3d81c14e61f5ce924d0e1.png?cv=2',
      count: 'https://www.mousehuntgame.com/images/titles/dd11711a25b80db90e0306193f2e8d78.png?cv=2',
      duke: 'https://www.mousehuntgame.com/images/titles/eb46ac1e8197b13299ab860f07d963db.png?cv=2',
      grandduke: 'https://www.mousehuntgame.com/images/titles/87937fa96bbb3b2dd3225df883002642.png?cv=2',
      archduke: 'https://www.mousehuntgame.com/images/titles/043efe31de4f0f2e0ddca590fe829032.png?cv=2',
      viceroy: 'https://www.mousehuntgame.com/images/titles/e2e79f6f9201a4d4e7a89684fbb5356f.png?cv=2',
      elder: 'https://www.mousehuntgame.com/images/titles/0f3cf224bf98457f6b5bad91ab1c7bd2.png?cv=2',
      sage: 'https://www.mousehuntgame.com/images/titles/cb49e43c5e4460da7c09fe28ca4f44ce.png?cv=2',
      fabled: 'https://www.mousehuntgame.com/images/titles/5daba92a8d609834aa8b789f37544e08.png?cv=2',
    };

    return titleImages[ title ];
  };

  /**
   * Add the settings.
   */
  const addShieldSettings = () => {
    const tab = addSettingsTab();
    const settingSection = {
      id: 'mh-shields',
      name: 'MouseHunt Shields',
      description: 'Replaces the default shield. If multiple shields are enabled, a random one will be used.',
    };

    addSetting('Birthday', 'birthday-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 10)', 'birthday.year10-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 11)', 'birthday.year11-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 12)', 'birthday.year12-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 13)', 'birthday.year13-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 14)', 'birthday.year14-shield', false, '', settingSection, tab);
    addSetting('Birthday (Year 15)', 'birthday.year15-shield', false, '', settingSection, tab);
    addSetting('Halloween', 'halloween-shield', false, '', settingSection, tab);
    addSetting('Remembrance Day', 'remembrance_day-shield', false, '', settingSection, tab);
    addSetting('Valentine\'s', 'valentines-shield', false, '', settingSection, tab);
    addSetting('Great Winter Hunter', 'winter_hunt-shield', false, '', settingSection, tab);
    addSetting('Larry\'s Football Challenge', 'larrys_football_challenge-shield', false, '', settingSection, tab);
    addSetting('Spring Egg Hunt', 'eggs-shield', false, '', settingSection, tab);
    addSetting('Title ', 'title-shield', false, 'Hunter Title badge', settingSection, tab);
    addSetting('Fabled ', 'fabled-shield', false, 'Custom shield with Fabled Badge', settingSection, tab);
    addSetting('Scrambles ', 'scrambles-shield', false, 'Bawk!', settingSection, tab);
    addSetting('Jerry ', 'jerry-shield', false, 'Custom shield with Jerry', settingSection, tab);
    addSetting('Romeno ', 'romeno-shield', false, 'Custom shield with Romeno', settingSection, tab);
    addSetting('Captain America', 'capt-america-shield', false, '', settingSection, tab);
    addSetting('Hylian Shield', 'hylian-shield', false, '', settingSection, tab);
  };

  const shieldChoices = [
    'remembrance_day',
    'winter_hunt',
    'valentines',
    'birthday',
    'birthday.year10',
    'birthday.year11',
    'birthday.year12',
    'birthday.year13',
    'birthday.year14',
    'birthday.year15',
    'larrys_football_challenge',
    'halloween',
    'scrambles',
    'jerry',
    'romeno',
    'title',
    'fabled',
    'capt-america',
    'hylian',
    'eggs',
  ];

  onPageChange({ change: changeShield });
  changeShield();

  onPageChange({ change: addShieldSettings });
  addShieldSettings();

  addStyles(`#mh-shields .defaultSettingText {
    display: none;
  }

  #mh-shields .settingRowTable {
    display: inline-block;
    width: 300px;
  }

  #mh-shields .settingRowTable:nth-child(even) {
    margin-right: 50px;
  }

  #mh-shields .settingRow {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
  }

  .mousehuntHud-shield.larrys_football_challenge.golden {
    background-image: url(https://www.mousehuntgame.com/images/ui/elements/header_world_cup_golden_shield.png?asset_cache_version=2);
  }

  .mousehuntHud-shield.scrambles.golden {
    background-image: url(https://i.mouse.rip/shield-scrambles-bawk.png), url(https://www.mousehuntgame.com/images/ui/elements/header_golden_shield.gif?asset_cache_version=2);
  }

  .mousehuntHud-shield.scrambles {
    background-image: url(https://i.mouse.rip/shield-scrambles-bawk.png);
  }

  .mousehuntHud-shield.jerry.golden {
    background-image: url(https://i.mouse.rip/shield-jerry.png), url(https://www.mousehuntgame.com/images/ui/elements/header_golden_shield.gif?asset_cache_version=2);
  }

  .mousehuntHud-shield.jerry {
    background-image: url(https://i.mouse.rip/shield-jerry.png);
  }

  .mousehuntHud-shield.capt-america.golden {
    background-image: url(https://i.mouse.rip/shield-capt-america.png), url(https://www.mousehuntgame.com/images/ui/elements/header_golden_shield.gif?asset_cache_version=2);
  }

  .mousehuntHud-shield.capt-america {
    background-image: url(https://i.mouse.rip/shield-capt-america.png);
  }

  .mousehuntHud-shield.hylian::after {
    position: absolute;
    top: -8px;
    left: 7px;
    width: 145px;
    height: 145px;
    content: "";
    background-image: url(https://i.mouse.rip/shield-hylian.png?2);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .mousehuntHud-shield.romeno::after {
    position: absolute;
    bottom: -8px;
    left: -30px;
    z-index: 1;
    width: 140px;
    height: 140px;
    content: "";
    background-image: url(https://i.mouse.rip/shield-romeno.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .mousehuntHud-shield.title::after {
    position: absolute;
    top: 3px;
    left: 8px;
    width: 120px;
    height: 120px;
    content: "";
    background-image: url(${titleBadge()});
    filter: drop-shadow(0 0 10px #ff970a);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .mousehuntHud-shield.fabled::after {
    position: absolute;
    top: 3px;
    left: 8px;
    width: 120px;
    height: 120px;
    content: "";
    background-image: url(https://i.mouse.rip/shield-fabled.png);
    filter: drop-shadow(0 0 10px #ff970a);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .mousehuntHud-shield.eggs::after {
    position: absolute;
    position: absolute;
    top: 2px;
    left: 0px;
    width: 137px;
    height: 137px;
    content: "";
    // background-image: url(https://i.mouse.rip/eggs-shield.png);
    background-image: url(https://i.mouse.rip/shield-eggs-alt.png);
    background-repeat: no-repeat;
    background-size: contain
  }
  `);

  migrateUserscript('🐭️ MouseHunt - Shields', 'https://greasyfork.org/en/scripts/454147-mousehunt-shields');
})());
