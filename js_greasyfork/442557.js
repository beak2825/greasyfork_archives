// ==UserScript==
// @name         A-SOUL r/place 2022 Protector
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Protect A-SOUL in r/place!
// @author       You
// @match        https://hot-potato.reddit.com/embed*
// @match        https://www.reddit.com/r/place/
// @icon         https://external-content.duckduckgo.com/ip3/www.reddit.com.ico
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/442557/A-SOUL%20rplace%202022%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/442557/A-SOUL%20rplace%202022%20Protector.meta.js
// ==/UserScript==

if (window.top !== window.self) {
  window.addEventListener('load', () => {
    function createMask() {
      const img = document.createElement('img');
      img.src = 'https://openbayes-public.cn-bj.ufileos.com/asoul-place-v10.png';
      img.style = 'position: absolute; top: 0; left: 0; width: 2000px; height: 2000px; image-rendering: pixelated;';
      console.log('A-SOUL r/place 2022 Protector', img);
      return img;
    };

    document.getElementsByTagName('mona-lisa-embed')[0].shadowRoot.children[0].getElementsByTagName('mona-lisa-canvas')[0].shadowRoot.children[0].appendChild(createMask())
  }, false);
}