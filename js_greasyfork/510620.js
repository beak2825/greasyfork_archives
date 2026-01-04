// ==UserScript==
// @name         Pasul 1 + Pasul 2 + Pasul 4 Form Fill with Automated CAPTCHA
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Automatically fills form fields for steps 1 and 2 when "Ctrl+Q" and "Ctrl+K" keys are pressed, respectively. "Ctrl+T" checks all boxes in step 4 and submits if CAPTCHA is filled.
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/510620/Pasul%201%20%2B%20Pasul%202%20%2B%20Pasul%204%20Form%20Fill%20with%20Automated%20CAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/510620/Pasul%201%20%2B%20Pasul%202%20%2B%20Pasul%204%20Form%20Fill%20with%20Automated%20CAPTCHA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables for easy access and customization
    const emailValue = "mihaela.barcan12@gmail.com";
    const automatedCaptcha = false; // CAPTCHA solver flag

    // Step 2 Variables
    const nameValue = "Eperjesi";
    const surnameValue = "Mihaela";
    const idSeriesValue = "ZC";
    const idNumberValue = "confidential";
    const validFromValue = "09.10.2023";
    const validUntilValue = "03.08.2031";
    const cnpValue = "confidential";
    const addressValue = "Mun.Bacău, Str.Ion Roată, nr.2";
    const phoneValue = "0749338754";
    const countyValue = "Bacau"; // This is the value to select from the dropdown

    // Function to fill the form fields for Step 1
    function fillStep1() {
        const emailField = document.getElementById("AdresaEmail");
        const confirmEmailField = document.getElementById("ConfirmareAdresaEmail");
        const captchaField = document.getElementById("CaptchaKeyEmail");

        if (emailField && confirmEmailField && captchaField) {
            emailField.value = emailValue;
            confirmEmailField.value = emailValue;
        } else {
            console.log("Required fields not found for Step 1.");
        }
    }

    // Function to fill the form fields for Step 2
    function fillStep2() {
        const nameField = document.getElementById("Nume");
        const surnameField = document.getElementById("Prenume");
        const idSeriesField = document.getElementById("SerieCI");
        const idNumberField = document.getElementById("NumarCI");
        const validFromField = document.getElementById("CiValabilDeLa");
        const validUntilField = document.getElementById("CiValabilPanaLa");
        const cnpField = document.getElementById("CNP");
        const addressField = document.getElementById("Adresa");
        const countyDropdown = document.getElementById("Judet");
        const phoneField = document.getElementById("Telefon");
        const submitStep2Button = document.getElementById("validate-step2");

        if (nameField && surnameField && idSeriesField && idNumberField && validFromField && validUntilField && cnpField && addressField && phoneField) {
            nameField.value = nameValue;
            surnameField.value = surnameValue;
            idSeriesField.value = idSeriesValue;
            idNumberField.value = idNumberValue;
            validFromField.value = validFromValue;
            validUntilField.value = validUntilValue;
            cnpField.value = cnpValue;
            addressField.value = addressValue;
            phoneField.value = phoneValue;
            if (countyDropdown) {
                for (let i = 0; i < countyDropdown.options.length; i++) {
                    if (countyDropdown.options[i].value === countyValue) {
                        countyDropdown.selectedIndex = i;
                        break;
                    }
                }
            }

            submitStep2Button.click();
        } else {
            console.log("Required fields not found for Step 2.");
        }
    }

    // Function to check all boxes in step 4
    function checkAllBoxes() {
        const checkboxIds = ["CheckDeAcord2", "CheckDeAcord3", "CheckDeAcord4", "CheckDeAcord"];
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && !checkbox.checked) {
                checkbox.click();
            }
        });
    }

    // Function to check CAPTCHA and submit form
    function submitIfCaptchaFilled() {
        const captchaField = document.getElementById("CaptchaKey");
        const submitButton = document.getElementById("validate-step4");

        if (captchaField && captchaField.value.trim().length > 0) {
            submitButton.click(); // Submit the form
        } else {
            console.log("CAPTCHA field is empty. Please fill it before submitting.");
        }
    }
        document.addEventListener('DOMContentLoaded', function() {
        // Automatically fill Step 1 when the page loads
        setTimeout(fillStep1, 100);
    });

    // Event listener for Ctrl+Q to fill Step 1
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            fillStep1();
        }
    });

    // Event listener for Ctrl+K to fill Step 2
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === ',') {
            fillStep2();
        }
    });

    // Event listener for Ctrl+T to check all boxes and submit form if CAPTCHA is filled
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === ';') {
            checkAllBoxes(); // Check all boxes
            submitIfCaptchaFilled(); // Check CAPTCHA and submit form
        }
    });

})();