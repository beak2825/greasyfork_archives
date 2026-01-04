
// ==UserScript==
// @name         Figos client
// @version      0.1.2
// @description  Figma Oss Export
// @license      MIT
// @author       Murphy
// @match        https://www.figma.com/*
// @namespace    http://tampermonkey.net/
// @icon         https://static.figma.com/app/icon/1/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464956/Figos%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/464956/Figos%20client.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.__FIGOS_SEVER_PORT__ = '8086';
    fetch(`http://localhost:${window.__FIGOS_SEVER_PORT__}/client.js`, { method: 'get' }).then(res => {
        return res.text()
    }).then(res => {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/javascript'
        scriptEl.text = res;
        document.body.appendChild(scriptEl);
    }).catch(console.log)

})();
