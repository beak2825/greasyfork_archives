// ==UserScript==
// @name         Login Via Token
// @namespace    https://v15.studio/
// @version      v4.0.0
// @description  Adds a native looking button to the login screen for your token.
// @author       Emmet_v15
// @license      BSD
// @match        *://discord.com/login
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/460481/Login%20Via%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/460481/Login%20Via%20Token.meta.js
// ==/UserScript==

if (window.location.pathname === '/login' && localStorage.token && !localStorage.working) {
    localStorage.removeItem('token');
    window.location.reload();
} else if (localStorage.working) {
    localStorage.removeItem('working');
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm('button[type="submit"][class*="button__"]').then((elm) => {

    const customButton = elm.cloneNode(true);
    customButton.id = 'tokenLoginBtn';
    customButton.type = 'button';
    const buttonText = customButton.querySelector('[class*="contents__"]');
    if (buttonText) buttonText.textContent = 'Log In Via Token';

    elm.className = elm.className.replace(/marginBottom8_(\S+)/g, 'marginBottom20_$1');
    elm.addEventListener('click', function() {
        document.getElementById('tokenInput').value = " ";
    });

    const passwordField = document.querySelector('[name="password"]');
    const fieldWrapper = passwordField.closest('[class*="container__"][data-layout="vertical"]');

    const tokenFieldHTML = fieldWrapper.outerHTML
        .replace(/password/g, 'token')
        .replace(/Password/g, 'Token')
        .replace(/uid_\d+/g, 'tokenInput')
        .replace(/:r\d+:/g, 'tokenLabel');

    const container = document.createElement('div');
    container.innerHTML = tokenFieldHTML;
    const tokenField = container.firstChild;

    const marginClass = document.querySelector('[class*="marginBottom20"]').className.match(/marginBottom20\S+/)[0];
    if (marginClass) {
        tokenField.classList.add(marginClass);
    } else {
        tokenField.style.marginBottom = '20px';
    }

    elm.parentNode.insertBefore(tokenField, elm.nextSibling);
    elm.parentNode.insertBefore(customButton, tokenField.nextSibling);

    customButton.addEventListener('click', function() {
        const token = document.getElementById('tokenInput').value.trim();
        const iframe = document.body.appendChild(document.createElement('iframe'));
        iframe.contentWindow.localStorage.token = `"${token}"`;
        iframe.contentWindow.localStorage.working = `1`;
        window.location.reload();
    });
});