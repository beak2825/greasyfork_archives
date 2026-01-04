// ==UserScript==
// @name         YK Holiday
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @run-at       document-end
// @description  再也不用联系HR
// @author       Sheep
// @match        http://oa.yankon.com/spa/workflow/static4form/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/436751/YK%20Holiday.user.js
// @updateURL https://update.greasyfork.org/scripts/436751/YK%20Holiday.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements ("#field117453span > a", showTime, false);
    function showTime (jNode) {
        //-- Here you are:)
        document.querySelector("#field393958span").innerHTML = document.querySelector("#field282449span").innerHTML;
    }
})();