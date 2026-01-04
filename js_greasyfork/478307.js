// ==UserScript==
// @name         Inquest - Increase Chain size
// @description  Increase chain timer size
// @version      1.2
// @author       Fruity- [2259700] | Francois Robbertze
// @namespace    https://greasyfork.org/en/users/1156949
// @copyright    none
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478307/Inquest%20-%20Increase%20Chain%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/478307/Inquest%20-%20Increase%20Chain%20size.meta.js
// ==/UserScript==

(() => {
  "use strict";
   const elements = document.getElementsByClassName('bar-timeleft___B9RGV');
   console.log(elements);
   for (var i = 0; i < elements.length; i++) {
        elements[i].style.fontSize = '30px';
   }
})();