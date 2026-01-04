// ==UserScript==
// @name        Bluesky Blur All Images
// @namespace   gudzpoz
// @match       https://bsky.app/*
// @grant       none
// @version     1.0
// @license     AGPL-3.0-or-later
// @author      gudzpoz
// @run-at      document-end
// @description Make all images on Bluesky blurred by default. Hover (or hold on mobile) to show temporarily. Click to show.
// @downloadURL https://update.greasyfork.org/scripts/525333/Bluesky%20Blur%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/525333/Bluesky%20Blur%20All%20Images.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement('style')).innerHTML = `
/* Timeline images */
div[data-expoimage] > div > img {
  filter: blur(1.6em);
}
div[data-expoimage] > div > img:hover {
  transition-duration: 0.8s !important;
  filter: none;
}
div[data-expoimage] > div > img.visible {
  filter: none;
}
`;

(() => {
  document.body.addEventListener('mousedown', (event) => {
    const target = event.target;
    if (!target.matches('div[data-expoimage] > div > img')) {
      return;
    }
    if (target.classList.contains('visible')) {
      return;
    }
    target.style.transitionDuration = '1s';
    target.style.filter = 'none';
    target.mousedownTime = Date.now();
    const button = target.closest('button');
    if (button && !target.classList.contains('visible')) {
      button.addEventListener('click', () => target.classList.add('visible'));
    }
  });
})();
