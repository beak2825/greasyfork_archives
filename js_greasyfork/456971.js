// ==UserScript==
// @name         Bitbucket change pull request title
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  For change title for PRs in bitbucket
// @author       You
// @match        https://bitbucket.org/rexmas_cl/%7Bcfa73af8-a135-4ef5-bb8a-421a75d73ba4%7D/*
// @match        https://bitbucket.org/rexmas_cl/rexmas/pull-requests/*
// @icon         http://bitbucket.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456971/Bitbucket%20change%20pull%20request%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/456971/Bitbucket%20change%20pull%20request%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const changeTitle = () => {
        const regex = /^\w+\/REX-(\d+).*$/g;
        const newTitle = regex.exec(document.querySelector("#pull-request-details span.css-1ul4m4g.evx2nil0").textContent)[1];
        const completeTitle = `${newTitle} Pull Request`;

        if (document.title !== completeTitle) {
            document.title = completeTitle;
        }
    };

    changeTitle();

    const observer = new MutationObserver(changeTitle);
    observer.observe(document.querySelector('head > title'), { childList: true });
})();