// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Clothing Bumper
// @version      3003
// @author       Spacekiller
// @description  Updates clothing to bump to the top of the shop.
// @match        https://www.brick-hill.com/*
// @run-at       document-body
// @grant        none
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhclothingbumper
// @downloadURL https://update.greasyfork.org/scripts/491690/%5BBrick-Kill%5D%20Clothing%20Bumper.user.js
// @updateURL https://update.greasyfork.org/scripts/491690/%5BBrick-Kill%5D%20Clothing%20Bumper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*-    SETTINGS    -*/
    const Update_link = 'https://www.brick-hill.com/shop/#'
    // The clothing you want to bump, like this: https://www.brick-hill.com/shop/#

    const Seconds_between_updates = 30
    // Amount of seconds to wait between each update.


    function runScript() {

        localStorage.setItem('updateItem', Update_link);
        const url = window.location.href;

        const tasks = [{
            condition: url.includes("brick-hill.com/shop/") && url.includes("/edit"),
            action: () => {
                localStorage.setItem('loopModify', true)
                modifyTextAreaContent();
            }
        },
                       {
                           condition: url.includes(Update_link),
                           action: () => {
                               setTimeout(() => {
                                   localStorage.setItem('loopModify', true);
                                   window.location.href = Update_link + '/edit';
                               }, Seconds_between_updates * 1000);
                           }
                       }
                      ];

        tasks.forEach(task => {
            if (task.condition) {
                task.action();
            }
        });
    }

    window.addEventListener('load', runScript);

    function modifyTextAreaContent() {
        if (localStorage.getItem('loopModify') === "true") {
            const textarea = document.querySelector('textarea[type="text"]');
            if (textarea) {
                localStorage.setItem('loopModify', false);
                const originalText = textarea.value;
                localStorage.setItem('originalTextareaContent', originalText);
                textarea.value = "Not a permanent description replacement.";
                const saveButton = document.querySelector('button.blue');
                if (saveButton) {
                    saveButton.click();
                }
            }
        }
    }
})();