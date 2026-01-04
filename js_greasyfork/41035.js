// ==UserScript==
// @name         Twitch Chatroom Essential
// @namespace    https://wiki.gslin.org/wiki/TwitchChatroomEssential
// @version      0.20250125.0
// @description  Show users with essential badge(s) only.
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/41035/Twitch%20Chatroom%20Essential.user.js
// @updateURL https://update.greasyfork.org/scripts/41035/Twitch%20Chatroom%20Essential.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const free_badges = [
    'Arcane Season 2 Premiere ',
    'Clip the Halls',
    'GLHF Pledge ',
    'GlitchCon ',
    'Listening ',
    'Minecraft ',
    'Predicted ',
    'Raging Wolf Helm',
    'SUBtember ',
    'Twitch Recap ',
    'Watching without ',
    'r/place ',
  ];

  const toggle_css = document.createElement('style');
  document.getElementsByTagName('head')[0].appendChild(toggle_css);

  const sheet = document.createElement('style');
  sheet.innerHTML = '#toggle_essential {padding-left:0.5em;width: 100%;}\n#toggle_essential input {vertical-align: middle;}';
  document.getElementsByTagName('head')[0].appendChild(sheet);

  const opt = document.createElement('div');
  opt.setAttribute('id', 'toggle_essential');
  opt.innerHTML = '<input id="toggle_essential_checkbox" type="checkbox"> <label for="toggle_essential_checkbox">Show essential messages only</label>';
  opt.querySelector('#toggle_essential_checkbox').addEventListener('change', function() {
    if (this.checked) {
      toggle_css.innerHTML = '.notessential {display:none;visibility:hidden;}';
    } else {
      toggle_css.innerHTML = '';
    }
  });

  // Install checkbox.
  const ob = new window.MutationObserver(events => {
    if (null === document.getElementById('toggle_essential')) {
      const el = document.querySelector('div.chat-input__buttons-container');
      if (el) {
        el.insertAdjacentElement('afterend', opt);
        console.debug('toggle_essential installed');
      }
    }

    events.forEach(ev => {
      ev.addedNodes.forEach(node => {
        // Ignore TEXT_NODE.
        if (node.nodeType === 3) {
          return;
        }

        if (!node.querySelector('div.chat-line__message')) {
          return;
        }

        // Add .notessential class.
        let n = 0;
        outer: for (const img of node.querySelectorAll('.chat-badge')) {
          const al = img.getAttribute('aria-label');
          for (const f of free_badges) {
            if (al.startsWith(f)) {
              continue outer;
            }
          }

          n++;
        }

        if (0 === n) {
          node.classList.add('notessential');
        }
      });
    });
  });

  ob.observe(document.getElementById('root'), {
    childList: true,
    subtree: true,
  });
})();
