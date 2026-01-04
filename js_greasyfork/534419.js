
// ==UserScript==
// @name         Auto Login with Multiple Accounts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto login with multiple
// @author       infovissa
// @match       https://i2-auth.visas-fr.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth*
// @match       https://i2-auth.visas-fr.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth*
// @match       https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth*
// @match        https://visas-fr.tlscontact.com/*
// @match       https://fr.tlscontact.com/visa/eg*
// @match       https://visas-fr.tlscontact.com/country/tn/*
// @match        https://i2-auth.visas-fr.tlscontact.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534419/Auto%20Login%20with%20Multiple%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/534419/Auto%20Login%20with%20Multiple%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const accounts = [
        { name: "Account 1", email: "user1@gmail.com", password: "password1", color: "#FF5733" },
        { name: "Account 2", email: "user2@gmail.com", password: "password2", color: "#33FF57" },
        { name: "Account 3", email: "user3@gmail.com", password: "password3", color: "#3357FF" },
        { name: "Account 4", email: "user4@gmail.com", password: "password4", color: "#F1C40F" },
        { name: "Account 5", email: "user5@gmail.com", password: "password5", color: "#E67E22" },
        { name: "Account 6", email: "user6@gmail.com", password: "password6", color: "#8E44AD" },
        { name: "Account 7", email: "user7@gmail.com", password: "password7", color: "#2ECC71" },
        { name: "Account 8", email: "user8@gmail.com", password: "password8", color: "#3498DB" },
        { name: "Account 9", email: "user9@gmail.com", password: "password9", color: "#F39C12" },
        { name: "Account 10", email: "user10@gmail.com", password: "password10", color: "#D35400" }
    ];

    const panel = document.createElement('div');
    panel.id = 'login-panel';
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.padding = '10px';
    panel.style.backgroundColor = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.zIndex = 10000;
    document.body.appendChild(panel);

    const selectAccount = (account) => {
        document.querySelector('input[name="username"]').value = account.email;
        document.querySelector('input[name="password"]').value = account.password;
        document.querySelector('button[type="submit"]').click();
    };

    accounts.forEach((account) => {
        const button = document.createElement('button');
        button.textContent = account.name;
        button.style.display = 'block';
        button.style.marginBottom = '5px';
        button.style.backgroundColor = account.color;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '5px';
        button.style.borderRadius = '3px';
        button.addEventListener('click', () => selectAccount(account));
        panel.appendChild(button);
    });

    const manualLogin = document.createElement('div');
    manualLogin.innerHTML = `
        <label for="manual-email">Email:</label>
        <input type="text" id="manual-email" placeholder="Email">
        <br>
        <label for="manual-password">Password:</label>
        <input type="password" id="manual-password" placeholder="Password">
        <br>
        <button id="manual-login">Log In</button>
    `;
    panel.appendChild(manualLogin);

    document.getElementById('manual-login').addEventListener('click', () => {
        const email = document.getElementById('manual-email').value;
        const password = document.getElementById('manual-password').value;
        document.querySelector('input[name="username"]').value = email;
        document.querySelector('input[name="password"]').value = password;
        document.querySelector('button[type="submit"]').click();
    });
    const socialLinks = document.createElement('div');
    socialLinks.innerHTML = `
        <h3>Contact Me</h3>
        <a href="https://t.me/infovissa" target="_blank" style="display: block; margin-bottom: 5px;">Telegram</a>
        <a href="https://youtube.com/@infovissa?si=7VNcX9pLo5aZ8HsK" target="_blank" style="display: block; margin-bottom: 5px;">YouTube</a>
        <a href="https://www.instagram.com/jallal_said1?igsh=MXBtbjc3cG9hMzkweg==" target="_blank" style="display: block;">Instagram</a>
    `;
    panel.appendChild(socialLinks);

})();