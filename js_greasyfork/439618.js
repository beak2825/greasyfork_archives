// ==UserScript==
// @name         Google shortcuts
// @namespace    lightningking
// @version      1.0
// @description  1-9 to open corresponding link, shift to open in new tab. Shift+L to focus search bar.
// @include      /^https://www.google*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439618/Google%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/439618/Google%20shortcuts.meta.js
// ==/UserScript==

window.getAllLinksArr = function () {
    if (window.location.hostname.indexOf('www.google') != -1) {
        return document.querySelectorAll('.g .rc .r > a[href], .g .rc > div > a[href], .g > div > div > a[href][ping], .g > div > div > div > a[href]');
    }
};

document.onload = function () {
    var allLinksArr = window.getAllLinksArr();
    for (var i = 0; i < allLinksArr.length && i < 10; i++) {
        allLinksArr[i].innerHTML = "<i><u>" + (i + 1) + "</u></i> " + allLinksArr[i].innerHTML;
    }
};

window.selectLinkNum = function (linkNum, openInNewTab) {
    var allLinksArr = window.getAllLinksArr();
    if (allLinksArr[linkNum - 1]) {
        allLinksArr[linkNum - 1].focus();
        setTimeout(function () {
            if (openInNewTab) {
                window.open(allLinksArr[linkNum - 1].href, '_blank');
            } else {
                allLinksArr[linkNum - 1].click();
            }
        }, 0);
    }
};

document.addEventListener('keyup', function (event) {
    event = event || window.event;
    if (event.target instanceof HTMLInputElement && event.target.type == 'text') {
        return;
    }
    // @formatter:off
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 49 || event.which ===  97)) { selectLinkNum(1, event.shiftKey); return false; } // 1 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 50 || event.which ===  98)) { selectLinkNum(2, event.shiftKey); return false; } // 2 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 51 || event.which ===  99)) { selectLinkNum(3, event.shiftKey); return false; } // 3 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 52 || event.which === 100)) { selectLinkNum(4, event.shiftKey); return false; } // 4 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 53 || event.which === 101)) { selectLinkNum(5, event.shiftKey); return false; } // 5 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 54 || event.which === 102)) { selectLinkNum(6, event.shiftKey); return false; } // 6 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 55 || event.which === 103)) { selectLinkNum(7, event.shiftKey); return false; } // 7 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 56 || event.which === 104)) { selectLinkNum(8, event.shiftKey); return false; } // 8 was pressed.
    if (!event.ctrlKey && !event.altKey  && !event.metaKey && (event.which === 57 || event.which === 105)) { selectLinkNum(9, event.shiftKey); return false; } // 9 was pressed.
    // @formatter:on

    if (window.location.hostname.indexOf('www.google') != -1 && !event.ctrlKey && !event.altKey && event.shiftKey && event.which === 76) { // Shift+L was pressed.
        document.querySelector('input[title="Search"], input[aria-label="Search"]').focus();
        document.querySelector('input[title="Search"], input[aria-label="Search"]').select();
        return false;
    }
});

function removeAnnoyingElements () {
    var allThingsToRemove = document.querySelectorAll('.kno-kp, .AUiS2, .exp-outline');
    for (var i = 0; i < allThingsToRemove.length; i++) {
        var elementToRemove = allThingsToRemove[i];
        elementToRemove.parentNode.removeChild(elementToRemove);
    }
}

removeAnnoyingElements();

setInterval(removeAnnoyingElements, 500);
