// ==UserScript==
// @name         Cryptofy . Auto Shortlinks (NOT WORKING)
// @namespace    cryptofy.autoshortlinks
// @version      1.2
// @description  Automatically clicks shortlink buttons. Made in Trinidad - https://ouo.io/5D5F0X
// @author       stealtosvra
// @match        https://cryptofy.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptofy.club
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472284/Cryptofy%20%20Auto%20Shortlinks%20%28NOT%20WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472284/Cryptofy%20%20Auto%20Shortlinks%20%28NOT%20WORKING%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('https://cryptofy.club/')) {


        const email = 'email@gmail.com'; // INSERT YOUR EMAIL


        const emailInput = document.querySelector('input[name="email"]');
        if (document.querySelector('input[name="email"]')) {
        emailInput.value = email;}}


    if (window.location.href === 'https://cryptofy.club/home.php' && window.location.href !== 'https://link1s.com/1rFj1U') {
        window.location.href = 'https://cryptofy.club/short.php';
    } else {

        setTimeout(() => {
            const loginButton = document.querySelector('button[name="btn-start"]');
            loginButton.click();
        }, 5000); // 5000 milliseconds = 5 seconds

}

            if (window.location.href === 'https://cryptofy.club/short.php') {
            setTimeout(() => {
                // Select all buttons with type "submit"
                const buttons = document.querySelectorAll("button.btn.btn-block.btn-primary");
                const bypassList = ['megaurl' , 'megafly' , 'linksly']; // Add the names of buttons to bypass

                buttons.forEach(buttons => {
                    if (!bypassList.includes(buttons.name)) {
                        buttons.click();
                    }
                });
            }, 5000); // 5000 milliseconds = 5 seconds
        }

})();