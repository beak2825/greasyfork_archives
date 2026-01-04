// ==UserScript==
// @name         Teleclub Auto-click
// @namespace    https://greasyfork.org/users/592063
// @version      0.1.1
// @description  Teleclub Auto-click.
// @author       wuniversales
// @match        https://tv.teleclub.xyz/activar
// @icon         https://icons.duckduckgo.com/ip2/teleclub.xyz.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491171/Teleclub%20Auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/491171/Teleclub%20Auto-click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {document.getElementById('activaID').click();}catch(err){console.log(err);}
})();