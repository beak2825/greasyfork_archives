// ==UserScript==
// @name         Coinpayu Auto Task Approver (No Reload)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automatically approves all Coinpayu tasks without page reload
// @match        *://*.coinpayu.com/dashboard/advertise/tasks-pending*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544457/Coinpayu%20Auto%20Task%20Approver%20%28No%20Reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544457/Coinpayu%20Auto%20Task%20Approver%20%28No%20Reload%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('🚀 Coinpayu auto-approver started');

    function processNextTask() {
        const proofBtn = document.querySelector('.pending-proof-btn');

        if (!proofBtn) {
            console.log('✅ No more tasks found.');
            return;
        }

        // Step 1: Click view proof
        proofBtn.click();
        console.log('🔍 Clicked proof button');

        // Step 2: Wait for modal, then click approve
        const tryApprove = () => {
            const approveBtn = document.querySelector('.coinpayu-review-btn-approve');
            if (approveBtn) {
                approveBtn.click();
                console.log('✅ Approved task');

                // Step 3: Wait for modal to close, then try next
                setTimeout(() => {
                    processNextTask();
                }, 1500); // Adjust delay between approvals if needed
            } else {
                console.log('⏳ Waiting for approve button...');
                setTimeout(tryApprove, 500); // Retry until approve button appears
            }
        };

        setTimeout(tryApprove, 1000); // Wait for modal after clicking proof
    }

    // Start after initial page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            processNextTask();
        }, 2000); // Initial delay for task list load
    });
})();
