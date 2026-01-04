// ==UserScript==
// @name         Gitlab Booster
// @namespace    https://gitlab.devops.telekom.de/
// @version      0.5
// @description  Speeds up Gitlab by reducing default page refresh timeouts
// @author       Ilya Molchanov
// @match        https://gitlab.devops.telekom.de/*
// @icon         https://simpleicons.org/icons/gitlab.svg
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424995/Gitlab%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/424995/Gitlab%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.setTimeoutOriginal) {
        window.setTimeoutOriginal = window.setTimeout;
    }
    window.setTimeout = function(callback, ms, arg1, arg2, arg3) {
        return window.setTimeoutOriginal(callback, ms > 1000 ? 1000 : ms, arg1, arg2, arg3);
    }
})();