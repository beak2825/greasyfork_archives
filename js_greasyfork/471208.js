// ==UserScript==
// @name         JobNinja Dev
// @namespace    http://jobninja.com/
// @version      0.1.3
// @description  JobNinja Dev Helper - This script does: - Hide the annoying leave popover - Print the job-id of every JobCard you click to the console.
// @author       You
// @match        *://*.jobninja.com/*
// @match        http://localhost:3000/*
// @exclude      *://jobninja.com/s3iframe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jobninja.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471208/JobNinja%20Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/471208/JobNinja%20Dev.meta.js
// ==/UserScript==

// make sure we do NOT run inside the iFrame
if (window.top === window.self) {
    (function() {
        'use strict';

        const LOG_ID = `UserScript '${GM_info.script.name}': `;

        // say hello
        console.log(`${LOG_ID} Hello world!`)

        // make leave popover hidden
        GM_addStyle('.ctxPopupNewsletter { display: none !important; }');


        // set clickhandler for all JobCards to log the job-id on click
        const setCardsClickHandlerTimer = () => {
            window.setTimeout(() => {
                addJobCardClickHandler();
                setCardsClickHandlerTimer();
            }, 1000)
        }

        const addJobCardClickHandler = () => {
            let jobCards = document.querySelectorAll('[data-job-id]:not([gm-click-listener])');
            jobCards.forEach((element) => {
                const jobId = element.getAttribute('data-job-id');
                element.addEventListener('click', (event) => {
                    console.log(`${LOG_ID} Clicked JobCard job-id: ${jobId}`);
                });
                element.setAttribute('gm-click-listener', 'true');
            });
            return jobCards.length
        }

        addEventListener("load", (event) => {
            setCardsClickHandlerTimer();
            addJobCardClickHandler();
        });
    })();
}