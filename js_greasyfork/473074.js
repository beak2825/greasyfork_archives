// ==UserScript==
// @name         Bitbucket change pipeline title
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  For change title for pipelines in bitbucket
// @author       You
// @match        https://bitbucket.org/rexmas_cl/rexmas/pipelines/results/*
// @icon         http://bitbucket.org/favicon.ico
// @grant        none
// @require      https://greasyfork.org/scripts/467272-awaitfor/code/awaitFor.js?version=1235249
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473074/Bitbucket%20change%20pipeline%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/473074/Bitbucket%20change%20pipeline%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    awaitFor(() => document.querySelector('.css-1h7hxw8'), (element) => {
        const cardNumber = element.textContent;
        const changeTitle = () => {
            const regex = /^REX-(\d+).*$/g;
            const newTitle = regex.exec(cardNumber)[1];
            const completeTitle = `${newTitle} Pipeline`;

            if (document.title !== completeTitle) {
                document.title = completeTitle;
            }
        };

        changeTitle();

        const observer = new MutationObserver(changeTitle);
        observer.observe(document.querySelector('head > title'), { childList: true });

    });
})();