// ==UserScript==
// @name         sonarcloud auto login
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto login for sonarcloud
// @license      MIT
// @author       IgnaV
// @match        https://sonarcloud.io/*
// @icon         https://sonarcloud.io/favicon.ico
// @require      https://greasyfork.org/scripts/467272-awaitfor/code/awaitFor.js?version=1201552
// @require      https://greasyfork.org/scripts/468732-blockpage/code/blockPage.js?version=1205573
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445435/sonarcloud%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/445435/sonarcloud%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickButton = (btn) => {
        btn.click();
        blockPage();
    };

    const findLoginLink = () => [...document.querySelectorAll('a')].find(e => /login/i.test(e.innerText));
    awaitFor(findLoginLink, clickButton);

    const findBitbucketLink = () => [...document.querySelectorAll('a')].find(e => /bitbucket/i.test(e.innerText));
    awaitFor(findBitbucketLink, clickButton);
})();