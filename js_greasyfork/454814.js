// ==UserScript==
// @name         Minimalist BibleGateway
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Minimalist version of BibleGateway.com
// @author       Landon
// @match        https://www.biblegateway.com/passage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454814/Minimalist%20BibleGateway.user.js
// @updateURL https://update.greasyfork.org/scripts/454814/Minimalist%20BibleGateway.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    deleteElement('resources flex-5');
    deleteElement('top-bar sidebar-tab-active');
    deleteElement('passage-tools w-sidebar no-sidebar');
    deleteElement('top-wrapper');
    deleteElement('toggle-fontsize');
    deleteElement('footer-flex-row');
    deleteElement('other-resources');
    deleteElement('passage-bottom-ad');
    deleteElement('copyright-table');
    deleteElement('content-divider');
    deleteElement('bbl-fontsize');
    deleteElement('search-bar-version');

    function deleteElement(elementName) {
        document.getElementsByClassName(elementName)[0].remove();
    }

    document.getElementsByClassName('logo-menu-user')[0].parentNode.remove();
    document.body.style.paddingBottom = '0px'

})();