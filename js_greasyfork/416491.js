// ==UserScript==
// @name        Redirect to high res image
// @namespace   RedirectToHiRes
// @match       https://*.imagetwist.com/*
// @match       https://*.imgspice.com/*
// @match       https://*.turboimagehost.com/*.html
// @match       https://*.acidimg.cc/*
// @match       https://*.imx.to/*
// @match       https://*.pixhost.to/*
// @match       https://*.imagebam.com/view/*
// @match       https://*.imgbox.com/*
// @match       https://*.kropic.com/*
// @match       https://*.vipr.im/*
// @match       https://*.imagevenue.com/*
// @grant       none
// @version     1.4
// @author      codingjoe
// @author      vt-idiot
// @description Automatically redirects the browser to the full resolution image for any landing page on imagetwist.com imgspice.com acidimg.cc imx.to pixhost.to imagebam.com imgbox.com kropic.com vipr.im
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/416491/Redirect%20to%20high%20res%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/416491/Redirect%20to%20high%20res%20image.meta.js
// ==/UserScript==


function goToImage() {
    location.href = document.querySelector(".centred").src;
}

(function() {
    'use strict';
    let img;

    if (location.href.includes("imagetwist.com")) {
        let arr = Array.from(document.querySelectorAll("a")).filter(r => r.innerText === "Continue to your image");
        img = document.querySelector(".pic");

        if (img) {
            location.href = img.src;
        } else {
            if (arr.length > 0) {
                arr[0].click();
            }
        }
    } else if (location.href.includes("imgspice.com")) {
        img = document.querySelector("#imgpreview");

        if (img) {
            location.href = img.src;
        }
    } else if (location.href.includes("turboimagehost.com")) {
        img = document.querySelector(".uImage");

        if (img) {
            location.href = img.src;
        }
    } else if (location.href.includes("acidimg.cc")) {
        let btn = document.querySelector("input[type=submit]");

        if (btn) {
            btn.click();

            window.setTimeout(function() {
              goToImage();
            }, 2000);
        } else {
            goToImage();
        }
    } else if (location.href.includes("imx.to")) {
        let blueButton = document.querySelector(".button") || document.querySelector("#continuebutton");

        if (blueButton != null) {
            blueButton.click();
            window.setTimeout(function() {
                goToImage();
            }, 500);
        } else {
            goToImage();
        }
    } else if (location.href.includes("pixhost.to")) {
        img = document.querySelector("img#image");

        if (img) {
            // redirect to full res
            location.href = img.src;
        }
    } else if (location.href.includes("imagebam.com")) {
        let anchor = document.querySelector("#continue > a");
        img = document.querySelector("img.main-image");
        if (img) {
            // redirect to full res
            location.href = img.src;
        } else {anchor.click();}
    } else if (location.href.includes("imgbox.com")) {
        img = document.querySelector("img.image-content");

        if (img) {
            // redirect to full res
            location.href = img.src;
        }
    } else if (location.href.includes("kropic.com")) {
        let btn = Array.from(document.querySelectorAll("input[type='submit']")).filter(r => r.value === "Continue to image...");
        let img = document.querySelector("img.pic");

        if (img) {
            // redirect to full res
            location.href = img.src;
        } else {
            if (btn.length > 0) {
                // click "Continue to image..."
                btn[0].click();
            }
        }
    } else if (location.href.includes("vipr.im")) {
        img = document.querySelector(".img-responsive");

        if (img) {
            location.href = img.src;
        }
    } else if (location.href.includes("imagevenue")) {
        let img = document.querySelector("#main-image");
        if (img) {location.href = img.src;}
    }

    return false;
})();
