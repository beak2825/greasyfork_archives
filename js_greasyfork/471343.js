// ==UserScript==
// @name         r/place 2023 Lockard Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script that adds a button to toggle an hardcoded image shown in the 2023's r/place canvas
// @author       wueffi
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471343/rplace%202023%20Lockard%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471343/rplace%202023%20Lockard%20Overlay.meta.js
// ==/UserScript==

if (window.top !== window.self) {
  addEventListener('load', () => {
    // ==============================================

    const OVERLAY_IMAGE_MAX_OPACITY = '0.7';

    // ==============================================
    // Insert image

    const img = document.createElement('img');
    img.style.pointerEvents = 'none';
    img.style.position = 'absolute';
    img.style.imageRendering = 'pixelated';
    img.style.opacity = OVERLAY_IMAGE_MAX_OPACITY;
    // img.style.outline = '2px inset grey';
    img.style.zIndex = '100';

    const mainContainer = document
      .querySelector('garlic-bread-embed')
      .shadowRoot.querySelector('.layout');
    const positionContainer = mainContainer
      .querySelector('garlic-bread-canvas')
      .shadowRoot.querySelector('.container');
    positionContainer.appendChild(img);

    // ==============================================
    // Add buttons to toggle overlay

    const pillButtonContainer = mainContainer.querySelector(
      'garlic-bread-status-pill'
    ).shadowRoot;


    const toggleOverlay = (e) => {
      img.style.opacity === OVERLAY_IMAGE_MAX_OPACITY
        ? (img.style.opacity = '0')
        : (img.style.opacity = OVERLAY_IMAGE_MAX_OPACITY);
    };

    const loadOverlay = () => {
      const name = "LockardLogo";
      const url = "https://i.ibb.co/gznk9vX/Overlay-Lockard-removebg.png";
      const x = 0;
      const y = 0;
      const width = 2000;
      const height = 1000;

      img.src = url;
      img.style.top = `${y}px`;
      img.style.left = `${x}px`;
      if (width && height) {
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
      }
      img.style.opacity = OVERLAY_IMAGE_MAX_OPACITY;
    };

    const createButton = (text, subtext, onClick, id) => {
      const buttonChild = document.createElement('div');
      buttonChild.classList.add('pixeled', 'fullscreen');
      buttonChild.style.backgroundColor = "#333";
      const buttonText = document.createElement('div');
      buttonText.classList.add('main-text');
      buttonText.innerText = text;
      if (id) {
        buttonText.id = id;
      }
      buttonChild.appendChild(buttonText);
      const buttonSecondaryText = document.createElement('div');
      buttonSecondaryText.classList.add('secondary-text');
      buttonSecondaryText.innerText = subtext;
      buttonChild.appendChild(buttonSecondaryText);
      const button = document.createElement('button');
      button.onclick = onClick;
      button.appendChild(buttonChild);

      pillButtonContainer.appendChild(button);
    };

    loadOverlay();

    setInterval(() => {
      // Shadow root content gets replaced after placing a square, so this is a hacky way to detect the buttons were removed and re-add them
      const toggleOverlayButton = pillButtonContainer.querySelector(
        '#overlay-toggle-child'
      );
      if (!toggleOverlayButton) {
        createButton(
          'Toggle',
          'overlay',
          toggleOverlay,
          'overlay-toggle-child'
        );
      }
    }, 500);
  });
}
