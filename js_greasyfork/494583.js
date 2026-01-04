// ==UserScript==
// @name         github merge blocker
// @namespace    maoanran@gmail.com
// @version      2024-05-10
// @description  Disable merge buttons for the base branches you wish to restrict.
// @author       maoanran
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494583/github%20merge%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/494583/github%20merge%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let RESTRICTED_BASE_BRANCHES = ['main', 'master'] // Change the array to add more branches to prevent merging

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 10) {
                    console.warn('Giving up after 10 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    let baseBranch = document.querySelectorAll('.commit-ref.base-ref span');

    if (baseBranch.length == 1 && RESTRICTED_BASE_BRANCHES.includes(baseBranch[0].innerText)) {
        runWhenReady('.BtnGroup button', function() {
            document.querySelectorAll('.BtnGroup button').forEach(button => button.setAttribute("disabled","disabled"));
        })
    }

})();
