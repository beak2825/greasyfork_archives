// ==UserScript==
// @name         D&D Beyond - Jumping Distance
// @namespace    https://greasyfork.org/users/649
// @version      1.0.10
// @description  Adds a jumping distance section to D&D Beyond
// @author       Adrien Pyke
// @match        *://www.dndbeyond.com/profile/*/characters/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/40734/DD%20Beyond%20-%20Jumping%20Distance.user.js
// @updateURL https://update.greasyfork.org/scripts/40734/DD%20Beyond%20-%20Jumping%20Distance.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'D&D Beyond - Jumping Distance';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    }
  };

  const App = {
    createSpeedManagerItem(label, amount) {
      const div = document.createElement('div');
      div.classList.add('speed-manager-item');

      const lblSpan = document.createElement('span');
      lblSpan.classList.add('speed-manager-item-label');
      lblSpan.textContent = label;
      div.appendChild(lblSpan);

      const lblAmount = document.createElement('span');
      lblAmount.classList.add('speed-manager-item-amount');
      lblAmount.textContent = `${amount} ft.`;
      div.appendChild(lblAmount);

      return div;
    },
    createOverrideItem(label, key) {
      const div = document.createElement('div');
      div.classList.add('speed-manager-override-item');
      div.dataset.key = key;

      const lblDiv = document.createElement('div');
      lblDiv.classList.add('speed-manager-override-item-label');
      lblDiv.textContent = label;
      div.appendChild(lblDiv);

      const inputDiv = document.createElement('div');
      inputDiv.classList.add('speed-manager-override-item-input');

      const value = document.createElement('input');
      value.type = 'number';
      value.min = 0;
      value.value = GM_getValue(`${Character.id}-${key}`) || '';
      inputDiv.appendChild(value);

      div.appendChild(inputDiv);

      const sourceDiv = document.createElement('div');
      sourceDiv.classList.add('speed-manager-override-item-source');

      const source = document.createElement('input');
      source.type = 'text';
      source.value = GM_getValue(`${Character.id}-${key}-source`) || '';
      sourceDiv.appendChild(source);

      div.appendChild(sourceDiv);

      return div;
    },
    saveOverrideItem(item) {
      if (item) {
        const key = item.dataset.key;
        const value = Util.q(
          '.speed-manager-override-item-input > input',
          item
        ).value;
        const source = Util.q(
          '.speed-manager-override-item-source > input',
          item
        ).value;
        GM_setValue(`${Character.id}-${key}`, value);
        GM_setValue(`${Character.id}-${key}-source`, source);
      }
    }
  };

  const Character = {
    id: parseInt(location.pathname.match(/\/([0-9]+)$/u)[1]),
    get strength() {
      return parseInt(
        Util.q('.character-ability-strength > .character-ability-score')
          .textContent
      );
    },
    get strengthModifier() {
      return parseInt(
        Util.q(
          '.character-ability-strength > .character-ability-modifier > .character-ability-stat-value'
        ).textContent
      );
    },
    get longJump() {
      return parseInt(
        GM_getValue(`${Character.id}-long-jump`) || Character.strength
      );
    },
    get highJump() {
      return parseInt(
        GM_getValue(`${Character.id}-high-jump`) ||
          Math.max(Character.strengthModifier + 3, 0)
      );
    }
  };

  waitForElems({
    sel: '.speed-manager-view',
    onmatch(view) {
      const items = Util.q('.speed-manager-items', view);
      items.appendChild(
        App.createSpeedManagerItem('Long Jump', Character.longJump)
      );
      items.appendChild(
        App.createSpeedManagerItem('High Jump', Character.highJump)
      );

      Util.q('.fullscreen-modal-accept > button').addEventListener(
        'click',
        () => {
          Util.qq('.speed-manager-override-item[data-key]').forEach(item =>
            App.saveOverrideItem(item)
          );
        }
      );
    }
  });

  waitForElems({
    sel: '.speed-manager-override-list',
    onmatch(overrides) {
      overrides.appendChild(App.createOverrideItem('Long Jump', 'long-jump'));
      overrides.appendChild(App.createOverrideItem('High Jump', 'high-jump'));
    }
  });
})();
