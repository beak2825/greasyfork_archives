// ==UserScript==
// @name         MR Gitlab
// @namespace    proximis
// @version      0.4
// @description  ohoho
// @author       teles
// @match        https://gitlab.change-commerce.com/*/merge_requests/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/30811/MR%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/30811/MR%20Gitlab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function start() {
        if (!document.querySelector('.mr-widget-body input[type=checkbox]')) {
            setTimeout(start, 300);
        } else {
            uncheck();
        }
    }

    function uncheck() {
        if (document.querySelectorAll('.label-branch a')[0].text.indexOf('cherry-pick') === -1) {
           document.querySelector('.mr-widget-body input[type=checkbox]').click();
        }
    }

    start();
})();