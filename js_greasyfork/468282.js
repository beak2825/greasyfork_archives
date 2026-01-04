// ==UserScript==
// @name         pwnACT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's break ACT testprep
// @author       JTC
// @match        https://onlineprep.act.org/app/act-online-prep-tm*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468282/pwnACT.user.js
// @updateURL https://update.greasyfork.org/scripts/468282/pwnACT.meta.js
// ==/UserScript==

function pwn(){
    'use strict';
    // Prompt user for the number of iterations
    const numIterations = Math.floor(parseInt(prompt('Enter the number of iterations(approximately):', '5'))*1.2);
    const sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

    // Perform the actions `numIterations` number of times
    for (let i = 0; i < numIterations; i++) {

        // Find the button with choice 'A' and click it
        const btnA = document.querySelector('a.btn[data-choice="A"]');
        btnA.click();

        // Find the button with id 'confirm-choice' and click it
        const btnConfirm = document.getElementById('confirm-choice');
        btnConfirm.click();

        // Find the button with text 'Continue' and click it
        sleep(4000).then(() => {
            const btnContinue = document.querySelector('a.continue');
            console.log(btnContinue)
            btnContinue.click();
        });
    }
};

GM_registerMenuCommand("Let's Go", pwn);