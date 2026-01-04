// ==UserScript==
// @name         KKT Interface Helper
// @namespace    kkt
// @version      0.1
// @description  Ease the use
// @author       MENTAL
// @match        https://krokonuts.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krokonuts.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459550/KKT%20Interface%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/459550/KKT%20Interface%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*No custom banner*/
    var img = document.querySelector('[alt="KroKonuTs"]');
    img.src = '/styles/bannieres/KKT.png';
    img.srcset = '/styles/bannieres/KKTx2.png x2';

})();