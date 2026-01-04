// ==UserScript==
// @name         Globoplay Sem Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Esconde o header do Globoplay.
// @author       euromoon
// @match        https://globoplay.globo.com/*/ao-vivo/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=globo.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457461/Globoplay%20Sem%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/457461/Globoplay%20Sem%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#app > div > div > div.application-controller__layout > header').style.display = 'none';
})();