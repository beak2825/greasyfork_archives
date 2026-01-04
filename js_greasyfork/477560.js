// ==UserScript==
// @name         Aviso
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  surf ads
// @author       You
// @match        https://aviso.bz/work-serf
// @match        https://twiron.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aviso.bz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477560/Aviso.user.js
// @updateURL https://update.greasyfork.org/scripts/477560/Aviso.meta.js
// ==/UserScript==

const links = document.querySelectorAll('a[onclick*="funcjs[\'go-serf\']"]');
let index = 0;
const maxIndex = 2;

function clickNextLink() {
    if (index < links.length && index < maxIndex) {
        const currentLink = links[index];
        currentLink.click();
        index++;
        setTimeout(clickNextLink, 5000);
    } else if (index >= links.length || index >= maxIndex) {
        setTimeout(checkForButton, 5000);
    }
}
if (window.location.href.includes("https://aviso.bz/work-serf")) {
        clickNextLink();
}

function resetPage() {
    window.location.reload();
}

function openLink(link) {
    return window.open(link, '_blank');
}

function checkForButton() {
    const button = document.querySelector('.start-yes-serf');
    if (button) {
        const extractedLink = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        const newWindow = openLink(extractedLink);

        const observer = new MutationObserver(function() {
            if (!document.contains(button)) {
                observer.disconnect();
                newWindow.close();

                setTimeout(resetPage, 30000);
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        setTimeout(() => {
            if (document.contains(button)) {
                observer.disconnect();
               newWindow.close();
                setTimeout(resetPage, 30000);
            }
        }, 60000);
    } else {
        setTimeout(checkForButton, 1000);
    }
}

window.addEventListener('load', function() {
    var buttonElement = document.querySelector('.btn_capt');
    if (buttonElement) {
        buttonElement.click();
    }
});

