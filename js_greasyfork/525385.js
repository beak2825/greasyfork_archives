// ==UserScript==
// @name         Blokada stron (dozwolony tylko SellAsist i BaseLinker oraz jego kopia z zamowieniami)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pozwala na dostęp tylko do SellAsist i BaseLinker oraz jego kopia z zamówieniami, resztę blokuje
// @author       Dawid
// @match        *://*/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/525385/Blokada%20stron%20%28dozwolony%20tylko%20SellAsist%20i%20BaseLinker%20oraz%20jego%20kopia%20z%20zamowieniami%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525385/Blokada%20stron%20%28dozwolony%20tylko%20SellAsist%20i%20BaseLinker%20oraz%20jego%20kopia%20z%20zamowieniami%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const allowedPatterns = [
        /sellasist\.pl/,
        /baselinker\.com/,
        /zegaronline\.pl/,
        /^192\.168\.1\.53:5000/
    ];
    const password = 'wschodnia14';
    const currentHost = window.location.host;
    const isAllowed = allowedPatterns.some(pattern => pattern.test(currentHost));
    const unlockedSites = JSON.parse(sessionStorage.getItem('unlockedSites')) || [];
    if (!isAllowed && !unlockedSites.includes(currentHost)) {
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Wpisz hasło';
        passwordInput.style = 'position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); padding: 10px; font-size: 18px; border: 1px solid #ccc; border-radius: 5px; text-align: center;';
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Odblokuj';
        submitButton.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; font-size: 18px; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;';
        document.body.innerHTML = '';
        document.body.appendChild(passwordInput);
        document.body.appendChild(submitButton);
        document.title = "Strona zablokowana";
        submitButton.addEventListener('click', function() {
            if (passwordInput.value === password) {
                unlockedSites.push(currentHost);
                sessionStorage.setItem('unlockedSites', JSON.stringify(unlockedSites));
                location.reload();
            } else {
                alert('Nieprawidłowe hasło!');
            }
        });
    }
})();