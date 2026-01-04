// ==UserScript==
// @name         novelai.manana.kr always on
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bruh moment
// @author       ME TF2Rulz
// @match        https://novelai.manana.kr/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453239/novelaimananakr%20always%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/453239/novelaimananakr%20always%20on.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("btn btn-outline-primary")[0].addEventListener("click", buttonEnable);
    document.getElementsByClassName("btn btn-outline-primary")[1].addEventListener("click", buttonEnable);

    function buttonEnable () {
        document.getElementsByClassName("btn btn-outline-primary")[1].disabled = false;
        document.getElementsByClassName("btn btn-outline-primary")[0].disabled = false;
    }
})();