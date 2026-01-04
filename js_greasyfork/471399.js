// ==UserScript==
// @name         r/place AOTY Logo
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  aoty logo for r/place
// @author       Rice
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471399/rplace%20AOTY%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/471399/rplace%20AOTY%20Logo.meta.js
// ==/UserScript==

if (window.top !== window.self) {
  addEventListener('load', () => {
    const OVERLAY_IMAGE_MAX_OPACITY = '0.7';
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
    const pillButtonContainer = mainContainer.querySelector(
      'garlic-bread-status-pill'
    ).shadowRoot;
    const toggleOverlay = (e) => {
      img.style.opacity === OVERLAY_IMAGE_MAX_OPACITY
        ? (img.style.opacity = '0')
        : (img.style.opacity = OVERLAY_IMAGE_MAX_OPACITY);
    };

    const loadOverlay = () => {
      const name = "aotyLogo";
      const url = "https://i.ibb.co/ncK9bgV/aotytest.png";
      const x = 0;
      const y = 0;
      const width = 1500;
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
