// ==UserScript==
// @name         Gladiatus Battle Bot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Expedition, dungeon, circus turma on colddown
// @author       You
// @match        https://*.gladiatus.gameforge.com/*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/390300/Gladiatus%20Battle%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/390300/Gladiatus%20Battle%20Bot.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const ENEMY_NUMBER = 2;
    const EXPEDITION_NUMBER = 6;
    const ENABLE_EXPEDITIONS = true;

    const HP_THRESHOLD = 15;
    const ENABLE_SMELTERY = false;

    const ENABLE_TURMA = true;
    const ENABLE_DUNGEON = true;
    const TURMA_ENEMY = 5;

    const ENABLE_EVENT = false;
    const EVENT_ENEMY = 3;

    setInterval(main, 3000);

    createGetResourcesToStore();


    function main() {
      console.log('Run Expedition Script');
      const d = document;
      var query = new URLSearchParams(window.location.search);

      // VIEW
      const mod = query.get('mod');
      const submod = query.get('submod');
      const isDashboard = mod === 'overview';
      const isExpeditionView = mod === 'location';
      const isDungeonView = mod === 'dungeon';
      const isReportsView = mod === 'reports';
      const isArenaView = mod === 'arena';
      const isWorkView = mod === 'work';
      const isSmelteryView = mod === 'forge' && submod === 'smeltery';
      const isTurmaView = mod === 'arena' && submod === 'serverArena';
      const isEventView = mod === 'location' && submod === 'serverQuest';

      // STATUS
      const hp = parseInt(d.getElementById('header_values_hp_percent').innerText);
      const expeditionReady = d.querySelectorAll('#cooldown_bar_expedition .cooldown_bar_fill_ready')[0];
      const dungeonReady = d.querySelectorAll('#cooldown_bar_dungeon .cooldown_bar_fill_ready')[0];
      const turmaReady = d.querySelectorAll('#cooldown_bar_ct .cooldown_bar_fill_ready')[0];
      const eventReady = findEventReady();


      // expedition battle
      if (hp > HP_THRESHOLD && expeditionReady) {
        sendRequest(
          'get',
          'ajax.php',
          `mod=location&submod=attack&location=${EXPEDITION_NUMBER}&stage=${ENEMY_NUMBER}&premium=0`,
          null);
      }

      // dungeon battle
      if (ENABLE_EXPEDITIONS && isDungeonView && dungeonReady) {
        const enemies = d.getElementById('content').getElementsByTagName('img');

        // start dungeon
        if (enemies.length === 0) {
          const dungeonBtns = d.getElementById('content').getElementsByTagName('input');

          if(!dungeonBtns[1] || dungeonBtns[1].disabled) {
              dungeonBtns[0].click();
          } else {
              dungeonBtns[1].click();
          }

        }
        //dungeon battle
        else {
          for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].onclick) {
              enemies[i].click();
              break;
            }
          }
        }
      }

      // circus turma battle
      if (isTurmaView && turmaReady) {
        const attackButton = document.getElementById('own3').getElementsByClassName('attack')[TURMA_ENEMY - 1];
        attackButton.click();
      }

      // event battle
      if (ENABLE_EVENT && hp > HP_THRESHOLD && isEventView && eventReady) {
        const attackBtn = document.getElementsByClassName('expedition_button')[EVENT_ENEMY - 1];
        if (!attackBtn.disabled) {
          attackBtn.click();
        }
      }

      // navigate to dungeon
      if (ENABLE_DUNGEON && dungeonReady && !isDungeonView) {
        const goToLink = d.querySelectorAll('#cooldown_bar_dungeon .cooldown_bar_link')[0];
        goToLink.click();
      }

      // navigate to turma
      if (ENABLE_TURMA && turmaReady && !isTurmaView) {
        const battleLinkElem = d.querySelectorAll('#cooldown_bar_ct .cooldown_bar_link')[0];
        battleLinkElem.click();
      }

      // navigate to event
      if (ENABLE_EVENT && eventReady && !isEventView) {
        const banner = document.getElementById('banner_event_link');
        banner.click();
      }

      //Smeltery
      if (!isSmelteryView && ENABLE_SMELTERY) {
        d.getElementById('submenu1').getElementsByTagName('a')[12].click();
      }

      if (isSmelteryView && ENABLE_SMELTERY) {
        const forges = d.getElementsByClassName('forge_finished-succeeded');

        for (let i = 0; i < forges.length; i++) {
          if (!forges[i].hasClass('tabActive')) {
            forges[i].click();
          }

          setTimeout(function () {
            const elem = d.getElementById('forge_lootbox');
            elem && elem.click();
          }, 500);
        }
      }
    }

    function createGetResourcesToStore() {
      const intervalId = setInterval(function () {
        const gcaBar = document.getElementById('gca_shortcuts_bar');
        if (!gcaBar) {
          return
        }

        const element = document.createElement('div');
        element.className = 'icon-out';

        const iconElement = document.createElement('a');
        iconElement.className = 'icon box-icon';
        iconElement.setAttribute('title', 'Store packages');

        element.appendChild(iconElement);
        element.addEventListener('click', function () {
          var content = document.getElementById('content');
          var link = 'ajax.php?mod=forge&submod=storageIn';
          var params = 'inventory=1&packages=1&sell=1';
          sendAjax(content, link, params, function () {
            gca_notifications.success('Packages were stored');
          });
        });

        gcaBar.appendChild(element);
        clearInterval(intervalId);
      }, 100);
    }

    function findEventReady() {
      const tries = document.querySelectorAll('#ServerQuestTime span')[0] || {};
      return parseInt(tries.innerHTML) > 0;
    }
  }
)();
