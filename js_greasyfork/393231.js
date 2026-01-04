// ==UserScript==
// @name         MexaShare Auto Scroll To Bottom
// @namespace    https://github.com/livinginpurple
// @version      2019.12.03.02
// @description  MexaShare Auto Scroll To Bottom (Download Page)
// @license      WTFPL
// @author       livinginpurple
// @match        https://mexa.sh/*
// @run-at       document-end
// @grant        none
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393231/MexaShare%20Auto%20Scroll%20To%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/393231/MexaShare%20Auto%20Scroll%20To%20Bottom.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log(GM_info.script.name + " is loading.");
    if (document.getElementsByClassName("Downloadpre").length > 0) {
        window.scrollTo(0, document.body.scrollHeight);
    }
    console.log(GM_info.script.name + " is running.");
})(document);