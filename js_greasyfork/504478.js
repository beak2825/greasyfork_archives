// ==UserScript==
// @name         综合自动操作脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Combines several automatic actions on web pages
// @author       YourName & You
// @match        https://1100.gg/*
// @match        *.ceocp.com/auth/login
// @match        *.ceocp.com/auth/register*
// @match        https://*.ceocp.com/user*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504478/%E7%BB%BC%E5%90%88%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/504478/%E7%BB%BC%E5%90%88%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to automatically click a link with class 'enter'
    function autoClickEnterLink() {
        var enterLink = document.querySelector('a.enter');
        if (enterLink) {
            enterLink.click();
        }
    }

    // Function to automatically click the register button on ceocp.com/auth/login pages
    function autoClickRegisterButton() {
        var registerButton = document.querySelector('a[href="/auth/register"]');
        if (registerButton) {
            registerButton.click();
        }
    }

    // Function to automate user registration
    function autoRegisterUser() {
        var nameInput = document.querySelector('input[name="name"]');
        var emailInput = document.querySelector('input[name="email"]');
        var passwdInput = document.querySelector('input[name="passwd"]');
        var repasswdInput = document.querySelector('input[name="repasswd"]');
        var submitButton = document.getElementById('login_submit');

        var userData = {
            name: 'kk',
            email: generateRandomEmail(),
            passwd: 'Aa112211',
            repasswd: 'Aa112211'
        };

        nameInput.value = userData.name;
        emailInput.value = userData.email;
        passwdInput.value = userData.passwd;
        repasswdInput.value = userData.repasswd;

        submitButton.click();
    }

    // Function to generate a random email
    function generateRandomEmail(emailLength = 10, domain = "@gmail.com") {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomEmail = '';
        for (var i = 0; i < emailLength; i++) {
            randomEmail += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomEmail + domain;
    }

    // Function to handle the "congratulations" message and click the confirm button
    function handleCongratulatoryMessage() {
        var targetText = "恭喜您注册成功，开始使用吧!";
        var confirmButton;

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.textContent && node.textContent.includes(targetText)) {
                        confirmButton = document.querySelector('.sweet-alert .confirm.btn.btn-lg.btn-primary');
                        if (confirmButton) {
                            setTimeout(function() {
                                confirmButton.click();
                            }, 1000); // 1000 milliseconds, i.e., 1 second
                        }
                    }
                });
            });
        });

        var config = {
            childList: true,
            subtree: true,
            characterData: true
        };

        observer.observe(document.body, config);
    }

    // Function to automatically click the "每日签到" button
    function autoCheckin() {
        var checkinButton = document.getElementById('checkin');
        if (checkinButton) {
            checkinButton.click();
        }
    }

    // Event listeners for page load
    window.addEventListener('load', function() {
        autoClickEnterLink(); // For https://1100.gg/*
        autoClickRegisterButton(); // For *.ceocp.com/auth/login
        // The autoRegisterUser function should only be called if the current URL matches the register page
        if (document.URL.includes('/auth/register')) {
            autoRegisterUser();
        }
        handleCongratulatoryMessage(); // For *.ceocp.com/auth/register*
        autoCheckin(); // For https://*.ceocp.com/user*
    });
})();