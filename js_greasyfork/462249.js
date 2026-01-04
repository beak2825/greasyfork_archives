// ==UserScript==
// @name         Jira open externals links in a new tab
// @namespace    https://atlassian.net/
// @version      0.1
// @description  Script for Jira to make externals links open in a new tab. #IHateJira
// @author       You
// @match        https://*.atlassian.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462249/Jira%20open%20externals%20links%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/462249/Jira%20open%20externals%20links%20in%20a%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('click', function (e) {
        console.log("click: on "+ e.target.tagName +' '+ e.target.hostname);
        let target = e.target
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
            if (!target) return;
        }
        if(target.hostname === '' || target.hostname === location.hostname) return;
        if(['domain-pour-lequel-on-veut-ouvrir-dans-le-meme-onglet.com','domain-pour-lequel-on-veut-ouvrir-dans-le-meme-onglet.fr'].indexOf(target.hostname) !== -1) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        window.open(target.href);
        return false;
    }, true );
})();