// ==UserScript==
// @name         Roblox Alt Creator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to autofill the Roblox signup form.
// @author       find
// @match        https://www.roblox.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544228/Roblox%20Alt%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/544228/Roblox%20Alt%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_BIRTH_YEAR = 1990;
    const MAX_BIRTH_YEAR = 2005;

    const adjectives = [
        "Silent", "Golden", "Red", "Cosmic", "Dark", "Epic", "Shadow", "Aqua",
        "Cyber", "Mystic", "Iron", "Super", "Arctic", "Brave", "Grand", "Chrono"
    ];

    const nouns = [
        "Knight", "Hunter", "Panda", "Wolf", "Gamer", "Player", "Fox", "Coder",
        "Dragon", "Phoenix", "Guard", "Pilot", "Jester", "King", "Wizard"
    ];

    function generateRandomUsername() {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 9999) + 1;
        return Math.random() > 0.5 ? `${adj}_${noun}${num}` : `${adj}${noun}${num}`;
    }

    function fillForm() {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const randomMonth = months[Math.floor(Math.random() * months.length)];
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const randomYear = String(Math.floor(Math.random() * (MAX_BIRTH_YEAR - MIN_BIRTH_YEAR + 1)) + MIN_BIRTH_YEAR);

        setDropdownValue('MonthDropdown', randomMonth);
        setDropdownValue('DayDropdown', randomDay);
        setDropdownValue('YearDropdown', randomYear);

        setInputValue('signup-username', generateRandomUsername());
        setInputValue('signup-password', Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2, 8));

        if (Math.random() < 0.5) {
            document.getElementById('FemaleButton')?.click();
        } else {
            document.getElementById('MaleButton')?.click();
        }
    }

    function setDropdownValue(id, value) {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.value = value;
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function init() {
        const signUpButton = document.getElementById('signup-button');
        if (signUpButton && !document.getElementById('autofill-button')) {
            const button = document.createElement('button');
            button.innerHTML = 'Auto-Fill Form';
            button.id = 'autofill-button';
            button.type = 'button';
            button.addEventListener('click', fillForm);

            signUpButton.parentNode.insertBefore(button, signUpButton);

            GM_addStyle(`
                #autofill-button {
                    background-color: #00a2ff; color: white; border: none; padding: 10px 15px;
                    width: 100%; font-size: 16px; font-weight: bold; border-radius: 8px;
                    cursor: pointer; margin-bottom: 16px; transition: background-color 0.2s;
                    text-align: center; line-height: normal;
                }
                #autofill-button:hover { background-color: #008ae6; }
            `);
            return true;
        }
        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (init()) {
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();