// ==UserScript==
// @name         PinAntDocsVersion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pin docs version
// @author       Formax
// @match        https://ant.design/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397356/PinAntDocsVersion.user.js
// @updateURL https://update.greasyfork.org/scripts/397356/PinAntDocsVersion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MAIN_DOMAIN = 'ant.design';
    const targetUrl = '3x.ant.design';
    const hostName = window.location.hostname;
    if(hostName.startsWith(MAIN_DOMAIN)){
        const url = window.location.href;
        window.location.href = url.replace(MAIN_DOMAIN,targetUrl);
    }
})();