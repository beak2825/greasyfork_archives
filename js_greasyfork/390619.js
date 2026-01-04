// ==UserScript==
// @name         SeaSploit ESP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YOu must wait for your game to fully load.
// @author       Lemons
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390619/SeaSploit%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/390619/SeaSploit%20ESP.meta.js
// ==/UserScript==

fetch(document.URL).then(res => res.text()).then(res => {
    res = res.replace(/if\(!tmpObj.inView\)continue;/, '');

    document.open();
    document.write(res);
    document.close();
});