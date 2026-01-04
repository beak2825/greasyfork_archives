// ==UserScript==
// @name         hide-lln-bottom-panel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide lln-bottom-panel
// @author       SedationH
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471725/hide-lln-bottom-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/471725/hide-lln-bottom-panel.meta.js
// ==/UserScript==

GM_addStyle(`
  #lln-bottom-panel {
      display: none
  }
`)
