// ==UserScript==
// @name         scratch.griddy.click : Semi Auto Claim (SCAM)
// @namespace    scratch.griddy.click.semi.auto.claim
// @version      1.3
// @description  script still available for educational purposes. the dev deleted the website
// @author       stealtosvra
// @match        https://scratch.griddy.click/*
// @match        https://nerdiess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=griddy.click
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463853/scratchgriddyclick%20%3A%20Semi%20Auto%20Claim%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463853/scratchgriddyclick%20%3A%20Semi%20Auto%20Claim%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.alert = (msg) => console.log(msg);

    (function() {
        const original = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(event, listener, ...rest) {
            const hooked = (event) => {
                const proxy = new Proxy(event, {
                    get(target, name) {
                        if (name === 'isTrusted') {
                            return true;
                        }
                        if (typeof target[name] === "function") {
                            return target[name].bind(target);
                        }
                        return target[name];
                    }
                });
                listener(proxy);
            };
            original.call(this, event, hooked, ...rest);
        }
    })();

    const button = document.querySelector('.mywarnbtn');
    const spinBtn = document.querySelector("#spinbtn");
    const mymsgDiv = document.getElementById("mymsg");
    const claimButton = document.querySelector('.myoknbtn');
    const boosted = document.querySelector('.myinfobtn');
    const h1Element = document.querySelector('.text-center.text-md-center.mb-4.mt-md-0 h1.h3');
    const h1Element2 = document.querySelector('.text-center.text-md-center.mb-4.mt-md-0 .h3');
    const divElement = document.querySelector('.text-center.text-md-center.mb-4.mt-md-0');
    var buttonElement = document.querySelector('.btn.btn-success.bordered.rounded');

    setInterval(function() {if (divElement && divElement.innerText.includes('Welcome')) {
        claimButton.click();
    }}, 5000);

    function checkAndClickButton() {
        if (h1Element2 && h1Element2.innerText.includes("Scratch your ticket")) {

            if (button) { button.click();} else if (boosted) {boosted.click();}
        }}

    setTimeout(checkAndClickButton, 5000);

    setInterval(function() {checkAndClickButton();}, 5000);

if (buttonElement) {
    buttonElement.addEventListener('click', function() {
});

    window.addEventListener('load', function() {
        setInterval(function() {
            buttonElement.click();
        }, 5000);
    });
}

    if (h1Element && h1Element.innerText === "Claim your booster!") {
        setTimeout(function() {if (spinBtn) {spinBtn.click();}}, 3000);
        setInterval(function() {if (mymsgDiv.textContent.includes("CLICK HERE TO CONTINUE")) {mymsgDiv.click();}}, 40000);
    }



})();