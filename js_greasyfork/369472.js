// ==UserScript==
// @name         ZKKR Agar Tool
// @namespace　　https://twitter.com/kag2p
// @version      9.9.9
// @author       Num Jai | Kagra Edit
// @description  ZKKR
// @match        http://agar.io/*
// @match        https://agar.io/*
// @updateURL　　https://greasyfork.org/scripts/369472-zkkr-agar-tool/code/ZKKR%20Agar%20Tool.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/162561
// @downloadURL https://update.greasyfork.org/scripts/369472/ZKKR%20Agar%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/369472/ZKKR%20Agar%20Tool.meta.js
// ==/UserScript==

window.stop();

GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://hastebin.com/raw/mutowifide',
  onload: function(e) {
    document.open();
    document.write(e.responseText);
    document.close();
  }
});