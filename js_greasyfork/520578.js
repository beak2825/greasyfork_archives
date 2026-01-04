// ==UserScript==
// @name         e-timologio | login form helper for mydata.aade.gr
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Προσθέτει μια βοηθητική φόρμα για σύνδεση στο e-timologio, που επιτρέπει στον browser να αποθηκεύει username και password. Στο πεδίο username (π.χ. username-vat) μπορείτε να περιλάβετε και το VAT.
// @author       ratikal
// @match        https://mydata.aade.gr/timologio/Account/login*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520578/e-timologio%20%7C%20login%20form%20helper%20for%20mydataaadegr.user.js
// @updateURL https://update.greasyfork.org/scripts/520578/e-timologio%20%7C%20login%20form%20helper%20for%20mydataaadegr.meta.js
// ==/UserScript==

(function() 
{
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --pc: #E73879;
            --sc: #FCC737;
            --muted: #888;
            --shadow: rgba(231, 56, 121, 0.5);
        }
        #helper-form {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 20px;
            color: var(--pc);
            background-color: var(--sc);
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px var(--shadow);          
        }
        #helper-form input {
            width: 100%;
            padding: 5px;
            border-radius: 4px;
            text-align: center;
            border: 1px solid var(--pc);
        }
        #helper-form button {
            width: 100%;
            padding: 8px 16px;
            background-color: var(--pc);
            color: white;
            border: none;
            border-radius: 4px;
        }
        #helper-form small {
            color: var(--muted);
        }
    `;
    document.head.appendChild(style);

    const form = document.createElement('form');
    form.id = 'helper-form';
    form.innerHTML = `
        <label for="combined_username">Username-VAT:</label>
        <input type="text" id="combined_username" name="username" required autocomplete="username">
        <small>Example: username-123456789</small>
        <label for="subscriptionkey">Subscription Key:</label>
        <input type="password" id="subscriptionkey" name="password" required autocomplete="current-password">
        <button type="submit">Login</button>
        <small>Made with &#10084; by <a target="_blank" href="https://ratikal.gr/contact">ratikal</a></small>
    `;
    document.body.appendChild(form);

    form.addEventListener('submit', (e) => 
    {
        e.preventDefault();

        const combined_value = document.getElementById('combined_username').value;
        const subscription_key = document.getElementById('subscriptionkey').value;

        const [user_name, vat_number] = combined_value.split('-');
        if (!user_name || !vat_number) {
            alert('Invalid format. Use username-VAT.');
            return;
        }

        const username_field = document.getElementById('UserName');
        const vatnumber_field = document.getElementById('VatNumber');
        const subscriptionkey_field = document.getElementById('SubscriptionKey');

        if (username_field) username_field.value = user_name;
        if (vatnumber_field) vatnumber_field.value = vat_number;
        if (subscriptionkey_field) subscriptionkey_field.value = subscription_key;

        const main_form = (username_field && username_field.form) || document.querySelector('form');
        main_form ? main_form.submit() : alert('Main form not found!');
    });
})();
