// ==UserScript==
// @name         vrchat one-time code
// @version      2.1
// @description  使用按鈕複製Gmail內的vrchat one-time code
// @author       BaconEgg
// @match        https://mail.google.com/mail/*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/475432/vrchat%20one-time%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/475432/vrchat%20one-time%20code.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const otpRegex = /Your One-Time Code is (\d{6})/;

    function getRandomColor() {
        return `#${Math.random().toString(16).slice(2, 8).padEnd(6, '0')}`;
    }

    function extractOTP() {
        const element = [...document.querySelectorAll("span, div")].find(el => otpRegex.test(el.textContent));
        if (element) {
            const otp = element.textContent.match(otpRegex)[1];
            GM_setClipboard(otp);
            document.getElementById('customOTPButton').style.background = getRandomColor();
        }
    }

    function addButton() {
        if (document.getElementById('customOTPButton')) return; // Prevent duplicate button

        const customButton = document.createElement('button');
        customButton.id = 'customOTPButton';
        customButton.textContent = 'VRChat code';
        customButton.addEventListener('click', extractOTP);

        Object.assign(customButton.style, {
            padding: "10px 15px",
            background: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        });

        const buttonParent = document.querySelector('.bGJ') || document.querySelector('.aeH');
        if (buttonParent) buttonParent.appendChild(customButton);
    }

    window.addEventListener("load", () => setTimeout(addButton, 1000));
})();