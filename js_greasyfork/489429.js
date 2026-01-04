// ==UserScript==
// @id           auto-next-player-for-autodarts@https://github.com/sebudde/auto-next-player-for-autodarts
// @name         Auto next player for Autodarts
// @namespace    https://github.com/sebudde/auto-next-player-for-autodarts
// @version      0.0.1
// @description  Userscript for Autodarts to switch to next player after 3 darts
// @author       sebudde
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/489429/Auto%20next%20player%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/489429/Auto%20next%20player%20for%20Autodarts.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const observeDOM = (function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    return function(obj, config, callback) {
      if (!obj || obj.nodeType !== 1) return;
      const mutationObserver = new MutationObserver(callback);
      const mutConfig = {
        ...{
          attributes: true,
          childList: true,
          subtree: true
        }, ...config
      };
      mutationObserver.observe(obj, mutConfig);
      return mutationObserver;
    };
  })();

  const setActiveAttr = (el, isActive) => {
    if (isActive) {
      el.setAttribute('data-active', '');
      el.classList.add('active');
    } else {
      el.removeAttribute('data-active');
      el.classList.remove('active');
    }
  };

  const onDOMready = async () => {

    setTimeout(async () => {

      console.log('match ready!');

      const matchMenuEl = document.getElementById('ad-ext-game-settings-extra');
      let matchMenuContainer;

      if (matchMenuEl.children[0].classList.contains('adp_match-menu-row')) {
        // Autodarts Plus is active
        matchMenuContainer = matchMenuEl.children[0];

      } else {
        // const matchMenuRow = document.createElement('div');
        // matchMenuRow.classList.add('css-k008qs');
        // matchMenuRow.style.marginTop = 'calc(var(--chakra-space-2) * -1 - 4px)';
        // matchMenuContainer = document.createElement('div');
        // matchMenuContainer.classList.add('css-a6m3v9');
        // matchMenuRow.appendChild(matchMenuContainer);
        // document.querySelector('.css-k008qs').after(matchMenuRow);
      }

      const turnContainerEl = document.getElementById('ad-ext-turn');

      let nextPlayerAfterSec = (await GM.getValue('nextPlayerAfterSec')) || false;

      const nextPlayerAfterSecBtn = document.createElement('button');
      nextPlayerAfterSecBtn.id = 'nextPlayerAfterSec';
      nextPlayerAfterSecBtn.innerText = 'Next Player';
      nextPlayerAfterSecBtn.classList.add('adp_config-btn');
      setActiveAttr(nextPlayerAfterSecBtn, nextPlayerAfterSec);
      matchMenuContainer.appendChild(nextPlayerAfterSecBtn);

      nextPlayerAfterSecBtn.addEventListener('click', async (event) => {
        const isActive = event.target.hasAttribute('data-active');
        setActiveAttr(nextPlayerAfterSecBtn, !isActive);
        nextPlayerAfterSec = !isActive;
        await GM.setValue('nextPlayerAfterSec', !isActive);
      }, false);

      const config = {};
      const playgroundEl = document.getElementById('ad-ext-turn').nextElementSibling;

      const nextPlayerBtn = [...playgroundEl.querySelectorAll('button')].filter(el => el.textContent.includes('Next'))[0];

      const nextPlayerAfterSecDuration = 1;

      observeDOM(turnContainerEl, config, function(m) {
        m.some((record) => {
          if (record.type === 'attributes' && record.target.classList.contains('ad-ext-turn-throw') && nextPlayerAfterSec && nextPlayerAfterSecDuration > 0 && nextPlayerBtn &&
              turnContainerEl.querySelectorAll('.ad-ext-turn-throw').length === 3) {
            const playerCount = document.getElementById('ad-ext-player-display').children.length;
            const isFirstPlayer = document.querySelector('#ad-ext-player-display > div:nth-child(1) > div.ad-ext-player-active');
            const dartsSumText = document.querySelector('.ad-ext-player-active').nextElementSibling.textContent;
            const dartsSum = dartsSumText.slice(dartsSumText.indexOf('#') + 1, dartsSumText.indexOf('|') - 1).trim();
            if ((playerCount === 2 && !!isFirstPlayer) || (playerCount === 1 && dartsSum % 6)) {
              console.log('next');
              nextPlayerBtn.click();
              return true;
            }
          }

        });
      });

    }, 100);
  };

  observeDOM(document.getElementById('root'), {}, function(mutationrecords) {
    mutationrecords.forEach((record) => {
      if (record.addedNodes.length && record.addedNodes[0].classList?.length) {
        const elemetClassList = [...record.addedNodes[0].classList];
        return elemetClassList.forEach((className) => {
          if (className === 'css-ul22ge') {
            onDOMready();
          }
        });
      }
    });
  });
})();
