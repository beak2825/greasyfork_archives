// ==UserScript==
// @name         改变网站的主题色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  filter theme for websites
// @author       mengxun
// @match        *://juejin.cn/*
// @match        *://github.com/*
// @match        *://*.zhihu.com/*
// @match        *://stackoverflow.com/*
// @icon         https://cdn.britannica.com/70/191970-050-1EC34EBE/Color-wheel-light-color-spectrum.jpg?q=60
// @grant        GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452965/%E6%94%B9%E5%8F%98%E7%BD%91%E7%AB%99%E7%9A%84%E4%B8%BB%E9%A2%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/452965/%E6%94%B9%E5%8F%98%E7%BD%91%E7%AB%99%E7%9A%84%E4%B8%BB%E9%A2%98%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addElement('style', {
        textContent: `
          html {
            filter: invert(1) hue-rotate(180deg);
          }

          img {
            filter: invert(1) hue-rotate(180deg);
          }
        `
    })
})();