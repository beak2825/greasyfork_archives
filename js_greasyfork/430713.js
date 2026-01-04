// ==UserScript==
// @name         CC TOTP
// @namespace    TOTP
// @version      0.5
// @description  Auto generate the TOTP code and sumbit the form in mfa page.
// @author       Larry Xie
// @include      https://*/core/mfa/*
// @include      https://*/core/mfa
// @require      https://unpkg.com/@otplib/preset-browser@^12.0.0/buffer.js
// @require      https://unpkg.com/@otplib/preset-browser@^12.0.0/index.js
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430713/CC%20TOTP.user.js
// @updateURL https://update.greasyfork.org/scripts/430713/CC%20TOTP.meta.js
// ==/UserScript==

// Secrets of each environment.
const secrets = {
    staging: '',
    stagingJp: '',
    stagingGov: '',
    production: '',
    productionJp: '',
    productionGov: ''
};

// Retry times if code is incorrect.
let retryTimes = 3;

// Get the secret accroding to current domain.
function getSecret() {
    const domain = location.hostname.split('.').slice(1).join('.');
    switch(domain) {
        case 'cloudburrito.com': return secrets.staging;
        case 'citrixcloudstaging.jp': return secrets.stagingJp;
        case 'cloudstaging.us': return secrets.stagingGov;
        case 'cloud.com': return secrets.production;
        case 'citrixcloud.jp': return secrets.productionJp;
        case 'cloud.us': return secrets.productionGov;
    }
    return null;
}

// Generate the totp code according to the secret.
function getCode(secret) {
    return window.otplib.authenticator.generate(secret);
}

// Type the generated code to the input box.
function typeCode(code) {
    const inputElements = document.querySelectorAll('input.ctx-vcode-input-rectangle');
    for (let i = 0; i < inputElements.length; i++) {
        const targetElement = inputElements[i];
        targetElement.focus();
        targetElement.setAttribute('value', code[i])
        targetElement.dispatchEvent(new Event('input', {bubbles: true}));
    }
}

// Click the Verify button in order to sumbit the form.
function submitForm() {
    const submitButton = document.querySelector('#verify-totp-code');
    submitButton.click();
    // If code is incorrect or expired, retry it for three times.
    setInterval(function() {
        if (document.querySelector('.invalid-credentials') && retryTimes) {
            retryTimes--;
            init();
        }
    }, 500);
}

function init() {
    const interval = setInterval(function() {
        if (document.querySelector('#mfa-login')) {
            clearInterval(interval);
            const secret = getSecret();
            if (secret) {
                typeCode(getCode(secret));
                submitForm();
            }
        }
    }, 1000);
}

init();
