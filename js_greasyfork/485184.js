// ==UserScript==
// @name         DropGalaxy Bypasser
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  This userscript will auto-click the buttons and redirect to the final download URL.
// @author       Rust1667
// @match        https://dropgalaxy.com/drive/*
// @match        https://dropgalaxy.co/drive/*
// @match        https://dropgalaxy.co/disk/*
// @match        https://dropgalaxy.com/disk/*
// @match        https://financemonk.net/*
// @downloadURL https://update.greasyfork.org/scripts/485184/DropGalaxy%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/485184/DropGalaxy%20Bypasser.meta.js
// ==/UserScript==


// 1st PAGE - click the hidden button inmediately
function clickButton(selector) {
    var button = document.querySelector(selector);
    if (button) {
        button.click();
        console.log('Button with selector ' + selector + ' clicked!');
    } else {
        console.log('Button with selector ' + selector + ' not found!');
    }
}
clickButton('#method_free');


// 2nd PAGE - 16 seconds delay to click the initially blocked #downloadbtn
const clickIfNotDisabled = (buttonSelector) => {
    let intervalId = setInterval(() => {
        let button = document.querySelector(buttonSelector);
        if (!button.hasAttribute('disabled') && !button.classList.contains('disabled')) {
            clearInterval(intervalId);
            setTimeout(function() {
                button.click();
            }, 500)
        }
    }, 500);
};
clickIfNotDisabled('#downloadbtn')


// 3rd PAGE - Extract the download link as soon as it is available
var intervalId2 = setInterval(function() {// Keep checking if link is available, every 1s
    var downloadUrl = document.getElementById('dllink').getAttribute('action');
    if (downloadUrl) {
        clearInterval(intervalId2);
        alert('Press OK to go to the download link:\n' + downloadUrl);
        window.location.assign(downloadUrl)
    }
}, 1000);

