// ==UserScript==
// @name        Enroll Class
// @namespace   Enroll Class
// @match       https://fap.fpt.edu.vn/FrontOffice/MoveSubject.aspx*
// @grant       none
// @version     1.1
// @author      Eric Anti Code
// @description 11:49:50 9/12/2024
// @downloadURL https://update.greasyfork.org/scripts/520203/Enroll%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/520203/Enroll%20Class.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const desiredText = "IA1702";
    const selectElement = document.getElementById("ctl00_mainContent_dllCourse");
    const saveButton = document.getElementById("ctl00_mainContent_btSave");

    if (selectElement) {
        if (selectElement.value === "49447") {
            saveButton.click();
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            for (let option of selectElement.options) {
                if (option.text === desiredText) {
                    selectElement.value = option.value;
                    const event = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(event);
                    break;
                }
            }

            setTimeout(() => {
                saveButton.click();
            }, 2000);
        }
    }

  function checkForError() {
        const errorMessage = document.querySelector('#cf-error-details h1');
        if (errorMessage && errorMessage.textContent.includes("Web server is returning an unknown error")) {
            location.reload(); 
        }
    }

  function checkForAlert() {
        const originalAlert = window.alert;
        window.alert = function(message) {
            location.reload();
            originalAlert(message);
        };
    }

    checkForAlert();

    setInterval(checkForError, 4000);
})();