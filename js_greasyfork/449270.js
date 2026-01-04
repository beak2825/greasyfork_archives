// ==UserScript==
// @name         cleanYeahMailAds
// @namespace    https://coderntoes.club/sms
// @version      0.14
// @description  clean mail.yeah
// @author       mooring@codernotes.club
// @match        mail.yeah.net/*
// @match        *.mail.yeah.net/*
// @match        mail.163.com/*
// @match        *.mail.163.com/*
// @match        mail.126.com/*
// @match        *.mail.126.com/*
// @match        mail.netease.com/*
// @match        *.mail.netease.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yeah.net
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449270/cleanYeahMailAds.user.js
// @updateURL https://update.greasyfork.org/scripts/449270/cleanYeahMailAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerText = [
        '.nui-closeable,.tI0.txt-info{display:none!important}'
    ].join('')
    document.body.previousElementSibling.appendChild(style);
})();