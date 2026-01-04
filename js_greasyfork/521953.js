// ==UserScript==
// @name         Auto Vote and Refresh
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automate voting and refresh with styled credits
// @author       Mohamed Nasr
// @match        *://vote.1billionsummit.com/*
// @grant        none
// @license MIT  Mohammed Elshreef
// @downloadURL https://update.greasyfork.org/scripts/521953/Auto%20Vote%20and%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/521953/Auto%20Vote%20and%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function voteAndRefresh() {
        try {
            const voteButton = document.querySelector('button[aria-label*="Vote for Ahmed AbuZaid"]');
            if (!voteButton) {
                console.error("Vote button not found!");
                return;
            }

            voteButton.click();
            console.log("Vote button clicked");

            setTimeout(() => {
                const submitButton = Array.from(document.querySelectorAll('button span')).find(
                    el => el.textContent.trim() === "Submit Vote"
                )?.closest('button');

                if (!submitButton) {
                    console.error("Submit Vote button not found!");
                    return;
                }

                submitButton.click();
                console.log("Submit Vote button clicked");

                setTimeout(() => {
                    document.cookie.split(";").forEach(cookie => {
                        const name = cookie.split("=")[0].trim();
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    });
                    console.log("Cookies cleared");

                    localStorage.clear();
                    sessionStorage.clear();
                    console.log("LocalStorage and SessionStorage cleared");

                    location.reload();
                }, 2000);
            }, 2000);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    function showCredits() {
        const creditDiv = document.createElement('div');
        creditDiv.innerHTML = 'Script by <a href="https://discord.com/users/832761264542449695" target="_blank" style="color: #FFD700; text-decoration: none;"><strong>Mohamed Nasr</strong></a>';
        creditDiv.style.position = 'fixed';
        creditDiv.style.bottom = '10px';
        creditDiv.style.right = '10px';
        creditDiv.style.backgroundColor = '#222';
        creditDiv.style.color = '#fff';
        creditDiv.style.padding = '15px 30px';
        creditDiv.style.borderRadius = '10px';
        creditDiv.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.7)';
        creditDiv.style.fontSize = '18px';
        creditDiv.style.zIndex = '9999';
        creditDiv.style.animation = 'fadeInOut 5s linear infinite';
        creditDiv.style.textAlign = 'center';

        document.body.appendChild(creditDiv);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateY(20px); }
                50% { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    const intervalTime = 10000;
    setInterval(voteAndRefresh, intervalTime);
    showCredits();
})();
