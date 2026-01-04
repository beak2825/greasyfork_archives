// ==UserScript==
// @name         Vodní pólo - Regionalna vaterpolo liga
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generuje live url
// @author       MK
// @match        https://rwp-league.com/results/index.php*
// @match        https://rwp-league.com/results/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rwp-league.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458857/Vodn%C3%AD%20p%C3%B3lo%20-%20Regionalna%20vaterpolo%20liga.user.js
// @updateURL https://update.greasyfork.org/scripts/458857/Vodn%C3%AD%20p%C3%B3lo%20-%20Regionalna%20vaterpolo%20liga.meta.js
// ==/UserScript==

(function() {
'use strict';
const url = document.querySelectorAll('tr[data-url]');
for (let i = 0; i < url.length; i++) {
let id = url[i].getAttribute('data-url');
let header = url[i].querySelector('.match-result');
const el = document.createElement('a');
header.append(el);
el.href = id;
el.append('LIVE URL')
}
})();