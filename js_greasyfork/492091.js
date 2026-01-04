// ==UserScript==
// @name         Adicional shortlink
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adicional
// @author       LTW
// @license      none
// @match        https://shrinkme.site/*
// @match        https://www.google.com/search?q=anhdep24.com
// @match        https://tii.la/*
// @match        https://techbixby.com/*
// @match        https://neverdims.com/*
// @match        https://gameblog.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shrinkme.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492091/Adicional%20shortlink.user.js
// @updateURL https://update.greasyfork.org/scripts/492091/Adicional%20shortlink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => location.reload(), 120000);

    const handleTechBixby = () => {
        const interval = setInterval(() => {
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                clearInterval(interval);
                setTimeout(() => submitButton.click(), 1000);
            }
        }, 2000);
    };

    const handleShrinkMe = () => {
        const checkAndClaim = async () => {
            if (grecaptcha && grecaptcha.getResponse().length !== 0) {
                document.getElementById('invisibleCaptchaShortlink').click();
            }
            setTimeout(checkAndClaim, 2000);
        };
        checkAndClaim();
    };

    const handleNeverDims = () => {
        setTimeout(() => {
            const buttons = document.querySelectorAll('button[type="submit"]');
            buttons.forEach(button => {
                if (button.textContent.trim() === "Im a Human") {
                    button.click();
                }
            });
        }, 2000);
    };

    const handleGoogleSearch = () => {
        setTimeout(() => {
            window.location.href = 'https://anhdep24.com';
        }, 3000);
    };

    const handleTiiLa = () => {
        const checkAndClaim = async () => {
            if (grecaptcha && grecaptcha.getResponse().length !== 0) {
                document.getElementById('continue').click();
            }
            setTimeout(checkAndClaim, 15000);
        };
        checkAndClaim();

        const clickAfterWait = () => {
            const element = document.querySelector('[onclick="window.open(\'https://eergortu.net/4/5016961\', \'_blank\')"]');
            if (element) {
                const randomTime = Math.floor(Math.random() * (20000 - 15000 + 1)) + 15000;
                setTimeout(() => element.click(), randomTime);
            }
        };
        clickAfterWait();
    };

 const gameblog = () => {
setTimeout(function() {
wpsafegenerate();
       let links = document.querySelectorAll('a.wpsafelink-button[style="cursor:pointer"]');
        links.forEach(link => {
            if (link.textContent.trim() === 'Step 5/5') {
                setTimeout(function() {
                link.click();
               }, 3000);
            }
        });
}, 32000);
};
    if (window.location.href.includes('https://gameblog.in/')) gameblog();
    if (window.location.href.includes('https://techbixby.com/')) handleTechBixby();
    if (window.location.href.includes('https://shrinkme.site/')) handleShrinkMe();
    if (window.location.href.includes('https://neverdims.com/')) handleNeverDims();
    if (window.location.href.includes('https://www.google.com/search?q=anhdep24.com')) handleGoogleSearch();
    if (window.location.href.includes('https://tii.la/')) handleTiiLa();

})();
