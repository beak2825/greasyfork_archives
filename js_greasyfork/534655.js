// ==UserScript==
// @name         Verify kour.io 
// @namespace    LC
// @version      0.4
// @description  verification script
// @author       LC
// @license CC BY-ND 4.0
// @match        https://kour.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534655/Verify%20kourio.user.js
// @updateURL https://update.greasyfork.org/scripts/534655/Verify%20kourio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add dark theme CSS styles
    GM_addStyle(`
        #lcVerifyContainer {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: #1a1a1a;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 15px;
            width: 250px;
            border: 1px solid #333;
        }

        #lcVerifyHeader {
            color: #6a4aff;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #lcVerifyBtn {
            background: linear-gradient(135deg, #6a4aff, #4a6bff);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            margin-bottom: 10px;
            transition: all 0.2s;
        }

        #lcVerifyBtn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        #lcHideBtn {
            background: #333;
            color: #ccc;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        #lcHideBtn:hover {
            background: #444;
            color: white;
        }

        #lcVerifyStatus {
            font-size: 13px;
            color: #aaa;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #333;
            text-align: center;
        }

        .success {
            color: #2ecc71 !important;
        }

        .error {
            color: #ff4757 !important;
        }

        .processing {
            color: #4a6bff !important;
        }

        .hidden {
            display: none;
        }
    `);

    // Create the verification panel HTML
    const panelHTML = `
        <div id="lcVerifyContainer">
            <div id="lcVerifyHeader">
                <span>LC Verification</span>
                <button id="lcHideBtn">Hide</button>
            </div>
            <button id="lcVerifyBtn">Verify Account</button>
            <div id="lcVerifyStatus">Ready to verify</div>
        </div>
    `;

    // Insert the panel into the page
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Verification functionality
    const verifyBtn = document.getElementById('lcVerifyBtn');
    const statusText = document.getElementById('lcVerifyStatus');
    const hideBtn = document.getElementById('lcHideBtn');
    const container = document.getElementById('lcVerifyContainer');

    // Hide/show functionality
    hideBtn.addEventListener('click', () => {
        container.classList.toggle('hidden');
        hideBtn.textContent = container.classList.contains('hidden') ? 'Show' : 'Hide';
    });

    verifyBtn.addEventListener('click', () => {
        statusText.textContent = "Verifying...";
        statusText.className = "processing";

        // Command to be executed
        const command = `
            firebase.database().goOffline();
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).child('verified').set('1');
            showUserDetails(firebase.auth().currentUser.email, firebase.auth().currentUser);
            firebase.database().goOnline();
        `;

        // Execute the command
        setTimeout(() => {
            try {
                eval(command);
                statusText.textContent = "Account verified successfully!";
                statusText.className = "success";
            } catch (e) {
                statusText.textContent = "Error: " + e.message;
                statusText.className = "error";
            }
        }, 500);
    });
})();