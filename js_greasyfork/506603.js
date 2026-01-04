// ==UserScript==
// @name         Retool - Release Automator
// @namespace    http://gofortuna.com
// @license      MIT
// @version      2024-09-01
// @description  Reduce the number of steps to release an app version with a hotkey.
// @author       Kevin Hill
// @match        https://*.retool.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=retool.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.5/mousetrap.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506603/Retool%20-%20Release%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/506603/Retool%20-%20Release%20Automator.meta.js
// ==/UserScript==

/* globals Mousetrap, $ */
(function() {
    'use strict';

    Mousetrap.bind(['command+/', 'ctrl+/'], async function(e) {
        const panel = $('[data-testid="ReleasesAndHistoryPanel::Container"]');

        const steps = [
            () => {
                if (panel && !panel.is(":visible")) {
                    $('[data-testid="ReleaseManagement::Launcher"]').parent("button").click();
                }
            },
            () => panel.find('button:contains("Create")').click(),
            () => $("#createRelease--trigger").click(),
            () => $('#createReleaseBox div[role="option"]').first().click(),
            () => $("#CreateRelease-description").focus()
        ];

        return runSteps(steps, 300);
    });
})();

async function runSteps(steps, delay) {
    for (const step of steps) {
        await step();
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}