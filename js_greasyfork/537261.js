// ==UserScript==
// @name         Lotto Buttons QoL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cleanly centers and enlarges Torn lottery Buy buttons for better mobile usability without breaking native styling.
// @author       yoyo
// @match        https://www.torn.com/page.php?sid=lottery
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537261/Lotto%20Buttons%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/537261/Lotto%20Buttons%20QoL.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const lottos = [
    {
      id: 'daily-dime',
      imageSel: '#daily-dime > .lottery-head-wrap > div',
      buttonWrapSel: '#daily-dime > .lottery-foot-wrap .btn-wrap.silver'
    },
    {
      id: 'lucky-shot',
      imageSel: '#lucky-shot > .lottery-head-wrap > div',
      buttonWrapSel: '#lucky-shot > .lottery-foot-wrap .btn-wrap.silver'
    },
    {
      id: 'holy-grail',
      imageSel: '#holy-grail > .lottery-head-wrap > div',
      buttonWrapSel: '#holy-grail > .lottery-foot-wrap .btn-wrap.silver'
    }
  ];

  function enhanceLottoButton({ id, imageSel, buttonWrapSel }) {
    const card = document.getElementById(id);
    const imageContainer = document.querySelector(imageSel);
    const originalButtonWrap = document.querySelector(buttonWrapSel);

    if (!card || !imageContainer || !originalButtonWrap || originalButtonWrap.classList.contains('enhanced')) return;

    // Create centered container
    const newWrapper = document.createElement('div');
    newWrapper.style.display = 'flex';
    newWrapper.style.justifyContent = 'center';
    newWrapper.style.alignItems = 'center';
    newWrapper.style.padding = '10px 0';

    newWrapper.appendChild(originalButtonWrap);
    imageContainer.parentElement.insertBefore(newWrapper, imageContainer);

    // Style the button
    const button = originalButtonWrap.querySelector('button');
    if (button) {
      Object.assign(button.style, {
        fontSize: '16px',
        minWidth: '120px',
        height: '38px',
        lineHeight: '38px',
        borderRadius: '6px',
        background: 'linear-gradient(180deg, #555 0%, #000 100%)',
        color: '#fff',
        border: '1px solid #888',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        padding: '0 16px',
        boxShadow: '0 0 4px rgba(255,255,255,0.1)',
        cursor: 'pointer'
      });

      // Hover effect
      button.addEventListener('mouseenter', () => {
        button.style.background = 'linear-gradient(180deg, #777 0%, #111 100%)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = 'linear-gradient(180deg, #555 0%, #000 100%)';
      });
    }

    originalButtonWrap.classList.add('enhanced');
  }

  const observer = new MutationObserver(() => {
    lottos.forEach(enhanceLottoButton);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  lottos.forEach(enhanceLottoButton);
})();
