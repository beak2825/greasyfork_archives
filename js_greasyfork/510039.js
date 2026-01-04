// ==UserScript==
// @name         Gmail Phishing Intercepter
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  Really simple POC script to warn when clicking hrefs and copy the link to clipboard instead of navigating. WARNING - this a POC and might fail. It's simple enough that it shouldn't fail too spectacularly though.  
// @author       You
// @match        https://mail.google.com/mail/u/0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510039/Gmail%20Phishing%20Intercepter.user.js
// @updateURL https://update.greasyfork.org/scripts/510039/Gmail%20Phishing%20Intercepter.meta.js
// ==/UserScript==

// Recursive function to find the email address of the sender
const getEmail = (p) => {
    // Exit with undefined if we ran out of parents (it's possible)
    if (p === undefined) return undefined;

    // Search children for an 'email' attribute.
    let emailElement = p.querySelector('[email]')

    if (emailElement) {
        // We found an email. So much success.
        return emailElement.getAttribute("email");

    } else {
        // Didn't find an email, so try with the next parent.
        return getEmail(p.parentElement);
    }
};


document.addEventListener('click', function(event) {
    const linkElement = event.target.closest("a")
    if (!linkElement) return;
    if (linkElement.href.startsWith("https://mail.google.com")) return;
    if (linkElement.href.startsWith("mailto:")) return;

    // To be safe, let's always activate on href
    if (linkElement.href) {
        // Copy link to clipboard
        navigator.clipboard.writeText(linkElement.href)

        // The warning
        alert("Copied URL, but do you trust it?\n" +
              getEmail(linkElement)
             )

        // prevent the default action
        event.stopPropagation();
        event.preventDefault();
    };
}, true);