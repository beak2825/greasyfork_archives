// ==UserScript==
// @name Twitch box clicker
// @description Twitch box-clicker
// @namespace Violentmonkey Scripts
// @grant none
// @include     *.twitch.tv/*
// @version 0.0.1.20191018143948
// @downloadURL https://update.greasyfork.org/scripts/391320/Twitch%20box%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/391320/Twitch%20box%20clicker.meta.js
// ==/UserScript==
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function claimPoints() {
    let claimButton = getElementByXpath('//div[@class="tw-absolute"]//button');
    if (claimButton !== null) {
        claimButton.click();
        console.log('Points claimed!')
    }
}

window.addEventListener('load', function(){
    setInterval(claimPoints, (Math.random() * 900 + 1)*800)
});
