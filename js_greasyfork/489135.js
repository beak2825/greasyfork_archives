// ==UserScript==
// @id           auto-next-on-takeout-for-autodarts@https://github.com/sebudde/auto-next-on-takeout-for-autodarts
// @name         Auto next on takeout for Autodarts
// @namespace    https://github.com/sebudde/auto-next-on-takeout-for-autodarts
// @version      0.1
// @description  Userscript for Autodarts to reset board and switch to next player if takeout stucks
// @author       sebudde
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/489135/Auto%20next%20on%20takeout%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/489135/Auto%20next%20on%20takeout%20for%20Autodarts.meta.js
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

      let nextPlayerAfterTakeoutSec = (await GM.getValue('nextPlayerAfterTakeoutSec')) || 'OFF';

      const onSelectChange = (event) => {
        (async () => {
          eval(event.target.id + ' = event.target.value');
          await GM.setValue(event.target.id, event.target.value);
        })();
      };

      const nextPlayerAfterTakeoutSecArr = [
        {
          value: 'OFF'
        }, {
          value: '10'
        }, {
          value: '15'
        }, {
          value: '20'
        }, {
          value: '30'
        }];

      const nextPlayerAfterTakeoutSecSelect = document.createElement('select');
      nextPlayerAfterTakeoutSecSelect.id = 'nextPlayerAfterTakeoutSec';
      nextPlayerAfterTakeoutSecSelect.classList.add('css-1xbroe7');
      nextPlayerAfterTakeoutSecSelect.style.padding = '0 5px';
      nextPlayerAfterTakeoutSecSelect.onchange = onSelectChange;

      matchMenuContainer.appendChild(nextPlayerAfterTakeoutSecSelect);

      nextPlayerAfterTakeoutSecArr.forEach((sec) => {
        const optionEl = document.createElement('option');
        optionEl.value = sec.value;
        optionEl.text = `Next Player after Takeout for ${sec.value}${sec.value === 'OFF' ? '' : ' sec'}`;
        optionEl.style.backgroundColor = '#353d47';
        if (nextPlayerAfterTakeoutSec === sec.value) optionEl.setAttribute('selected', 'selected');
        nextPlayerAfterTakeoutSecSelect.appendChild(optionEl);
      });

      const boardStatusContainer = document.querySelector('.css-1uodvt1 a');

      const config = {
        characterData: true,
        attributes: false,
        childList: false
      };

      let countdown;

      const playgroundEl = document.getElementById('ad-ext-turn').nextElementSibling;

      const nextPlayerBtn = [...playgroundEl.querySelectorAll('button')].filter(el => el.textContent.includes('Next'))[0];
      const boardMenuEl = document.getElementById('ad-ext-game-settings-extra').previousSibling;
      const resetBoardBtn = [...boardMenuEl.querySelectorAll('button')].filter(el => el.textContent.includes('Reset'))[0];
      const timerEl = document.createElement('span');

      const resetCountdown = () => {
        clearInterval(countdown);
        timerEl?.remove();
      };

      nextPlayerBtn.addEventListener('click', (event) => {
        resetCountdown();
      }, false);

      [...turnContainerEl.querySelectorAll('.ad-ext-turn-throw')].forEach((counterBtn) => {
        counterBtn.addEventListener('click', (event) => {
          resetCountdown();
        }, false);
      });

      observeDOM(boardStatusContainer, config, function(m) {
        m.forEach((record) => {
          if (record.target.textContent !== '✊') {
            resetCountdown();
          } else {
            if (nextPlayerAfterTakeoutSec !== 'OFF' && nextPlayerBtn && resetBoardBtn) {
              timerEl.style.paddingLeft = '15px';
              timerEl.textContent = nextPlayerAfterTakeoutSec;
              nextPlayerBtn.append(timerEl);
              countdown = setInterval(() => {
                const time = parseInt(timerEl.textContent);
                timerEl.textContent = (time - 1).toString();
                if (time === 1) {
                  resetBoardBtn.click();
                  nextPlayerBtn.click();
                }
              }, 1000);

            }
          }
        });
      });

    }, 500);
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
