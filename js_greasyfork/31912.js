// ==UserScript==
// @name         Compact Outlook.com
// @namespace    http://prantlf.tk/
// @version      0.2
// @description  Show more e-mails in folders by hiding the row with the first sentence of the e-mail
// @author       prantlf@gmail.com
// @match        https://outlook.office.com/owa/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31912/Compact%20Outlookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/31912/Compact%20Outlookcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.info('[Compact Outlook.com] Adding compacting styles.');
    var style = document.createElement('style'),
        styles =
        '._lvv_w._lvv_x,' +
        '._lvv_C1._lvv_D1 {' +
        '  height: 55px;' +
        '}' +
        '._lvv_O,' +
        '._lvv_Q1 {' +
        '  display: none;' +
        '}';
    style.id = 'prantlf-compact-outlook';
    try{
        style.innerHTML = styles;
    } catch (error) {
        style.styleSheet.cssText = styles;
    }
    document.head.appendChild(style);
}());