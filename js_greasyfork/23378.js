// ==UserScript==
// @name         MIUI medal block
// @namespace    http://diathedia.com/
// @version      0.21
// @description  Disable the medal list on MIUI forum that make page scrolling a pain on the ass
// @author       Diathedia
// @match        http://en.miui.com/*
// @match        https://en.miui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23378/MIUI%20medal%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/23378/MIUI%20medal%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName("md_ctrl");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    //Remove the /* and */ to hide the hideously long rating log as well
    /*
    //kill rating list (you can still see the rating log)
    elements = document.getElementsByClassName("ratl");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    elements = document.getElementsByClassName("m_rec_title");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    */

})();