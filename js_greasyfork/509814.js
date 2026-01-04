// ==UserScript==
// @name         MinuteInbox Email Copy and Auto Sign-in (Fast, iframe-aware)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Instantly copy email address from MinuteInbox and handle Civitai sign-in, working with iframes
// @author       Your Name
// @match        https://www.minuteinbox.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509814/MinuteInbox%20Email%20Copy%20and%20Auto%20Sign-in%20%28Fast%2C%20iframe-aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509814/MinuteInbox%20Email%20Copy%20and%20Auto%20Sign-in%20%28Fast%2C%20iframe-aware%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function copyEmail() {
        let emailSpan = document.querySelector('span#email.animace');
        if (emailSpan) {
            let email = emailSpan.textContent.trim();
            GM_setClipboard(email);
            console.log("Email copied: " + email);
            let copiedText = document.createElement('span');
            copiedText.textContent = 'Copied!';
            copiedText.style.color = 'green';
            copiedText.style.marginLeft = '10px';
            emailSpan.parentNode.insertBefore(copiedText, emailSpan.nextSibling);
            setTimeout(() => copiedText.remove(), 3000);
        } else {
            setTimeout(copyEmail, 100);
        }
    }
    function checkForSignInMail() {
        let mailRows = document.querySelectorAll('tr.klikaciRadek');
        for (let row of mailRows) {
            let subjectElement = row.querySelector('.predmet');
            if (subjectElement && subjectElement.textContent.includes("Sign in to Civitai")) {
                row.querySelector('td').click();
                return true;
            }
        }
        return false;
    }
    function handleSignIn() {
        let iframe = document.getElementById('iframeMail');
        if (iframe) {
            try {
                let signInLink = iframe.contentDocument.querySelector('a[href^="https://civitai.com/api/auth/callback/email"]');
                if (signInLink) {
                    window.open(signInLink.href, '_blank');
                    window.close();
                } else {
                    setTimeout(handleSignIn, 100);
                }
            } catch (e) {
                console.log("Cannot access iframe content. Retrying...");
                setTimeout(handleSignIn, 100);
            }
        } else {
            setTimeout(handleSignIn, 100);
        }
    }
    if (window.location.href === "https://www.minuteinbox.com/") {
        copyEmail();
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (checkForSignInMail()) {
                        observer.disconnect();
                        break;
                    }
                }
            }
        });
        let emailTable = document.querySelector('.table-hover');
        if (emailTable) {
            observer.observe(emailTable, { childList: true, subtree: true });
        }
        checkForSignInMail();
    }
    if (window.location.href === "https://www.minuteinbox.com/") {
        handleSignIn();
    }
})();