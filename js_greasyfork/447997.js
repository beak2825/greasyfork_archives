// ==UserScript==
// @name         Adult:Cmsd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click nag screen "I'm 18"
// @author       NoobAlert
// @match        https://www.camsoda.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=camsoda.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447997/Adult%3ACmsd.user.js
// @updateURL https://update.greasyfork.org/scripts/447997/Adult%3ACmsd.meta.js
// ==/UserScript==

window.onload = setTimeout(function() {
    'use strict';
    document.getElementsByClassName('button-module__btn--aIyOa button-module__btnSecondary--zTGq6 button-module__block--vYk3Q button-module__bold--fvbVS button-module__uppercase--xpLGQ')[0].click();
},1500)();