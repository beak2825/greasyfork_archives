// ==UserScript==
// @name         Escape From WebVPN
// @version      0.0.4
// @description  避免WebVPN劫持CC98站外链接
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439958/Escape%20From%20WebVPN.user.js
// @updateURL https://update.greasyfork.org/scripts/439958/Escape%20From%20WebVPN.meta.js
// ==/UserScript==

/* eslint-env jquery */
/* global revertUrl */

$(document).on('click', 'a', function(e) {
    if(revertUrl && this.href && !(new URL(this.href).host.includes('cc98.org'))) {
        e.preventDefault();
        window.open().location = revertUrl(this.href);
        return false;
    }
});
