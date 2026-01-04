// ==UserScript==
// @name         PVNG Never Timeout
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  PVNG never timeout
// @author       DryChicken
// @match        https://*.aptech-inc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aptech-inc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488303/PVNG%20Never%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/488303/PVNG%20Never%20Timeout.meta.js
// ==/UserScript==

let timeoutCounter = 0;

function monitorandCloseDialogModal() {
    const timer = document.querySelector('#spanTimer');
    const closeButton = document.querySelector('#dialogSession .modal-footer .btn.btn-default');
    if (timer) {
        const config = {childList: true, characterData: true, subtree: false};
        // Create observer instance
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Check childList changes or characterData changes
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    timeoutCounter += 1;
                    var newText = timer.innerText;
                    console.log(`${newText}`);
                    // Perform action
                    closeButton.click();
                    console.log(`Clicked button, closed countdown: skipped ${timeoutCounter}`);
                    // Backup click 1.5 sec later
                    setTimeout(() => {closeButton.click()}, 1500);
                }
            });
        });
        console.log('Initiating session timeout modal observer');
        observer.observe(timer, config);
    }
}

function autofillCompany() {
    document.getElementById('ddlCompanies').value = '2';
    document.getElementById('PlaceHolderBody_ContinueButton').click();
}


function autoLogin() {
    
    const userNameInput = document.getElementById('PlaceHolderBody_Login1_UserName');
    const passwordInput = document.getElementById('PlaceHolderBody_Login1_Password');
    let passwordLength = passwordInput.textLength;
    
    function checkValueChange(input) {
        console.log(`Input event on password ${input.value}`)
        if (input.textLength > passwordLength + 4) {
            console.log('password filled')
            passwordInput.focus();
            passwordInput.blur();
        } else {
            passwordLength = input.textLength;
        }
    }

    passwordInput.addEventListener('input', (event) => {checkValueChange(event.target)});

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value !== '' && userNameInput.value !== '') {
            document.getElementById('PlaceHolderBody_Login1_LoginButton').click();
        }
    });
}

function autoMechanism() {
    const url = window.location.href;
    const legend = document.querySelector('legend');
    if (!legend) return;
    if (url.includes('Login') ||  legend.textContent == 'Login') {
        autoLogin();
    } else if (url.includes('CompanySelect') || legend.textContent == 'Company Select') {
        autofillCompany();
    }

}

autoMechanism();
monitorandCloseDialogModal();