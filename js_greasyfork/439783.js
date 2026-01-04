// ==UserScript==
// @name         Decline-Google-Cookies
// @namespace    http://tampermonkey.net/
// @source       https://github.com/kakka0903/decline-google-cookies
// @version      0.2
// @description  Auto-decline google consent cookies. More on github.
// @author       Kasper J. Hopen Alfarnes
// @match        https://consent.google.com/*
// @match        https://*.google.com/*
// @match        https://google.com/*
// @match        https://consent.youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=chrome.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439783/Decline-Google-Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/439783/Decline-Google-Cookies.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function isHidden (element) {
        /* check if elmement is hidden in the dom */
        return element.offsetParent === null;
    }

    function isButton (element) {
        /* check if element is a button */
        if (element.tagName == "BUTTON") {
            return 1;
        }
        return 0;
    }

    function hasTextInChild (element, text, ignore_casing = true) {
        var result = 0;

        // loop through all child elements
        element.childNodes.forEach(child => {
            var found_text = child.textContent;

            // convert both to lowecase if ignor_casing
            if (ignore_casing) {
                found_text = found_text.toLowerCase();
                text = text.toLowerCase();
            }

            // check text
            if (found_text == text) {
                result = 1;
            } else {
                result = 0;
            }
        });

        return result;
    }

    function isHeadingIncludingText (text, ignore_casing = true) {
        /* Check if the page heading (H1 tag) contains given text */
        var result = 0;
        var all_headings = [...document.getElementsByTagName("H1")];

        all_headings.forEach(element => {
            var found = element.textContent;

            // ignore casing
            if (ignore_casing) {
                text = text.toLowerCase();
                found = found.toLowerCase();
            }

            // check if heading is not hidden and includes given text
            if (!isHidden(element) && found.includes(text)) {
                result = 1;
            }
        });

        return result;
    }

    function main () {
        // get all buttons
        var all_buttons = [...document.getElementsByTagName("BUTTON")];

        // when page head ing says something like "before you continue to youtube"
        if (isHeadingIncludingText("Before")) {
            console.log("before!");
            all_buttons.forEach(element => {
                // click them if not hidden and says "Customize"
                console.log(element.textContent);
                console.log(hasTextInChild(element, "customize"));

                if (
                    (!isHidden(element) &&
                        hasTextInChild(element, "customise")) ||
                    (!isHidden(element) && hasTextInChild(element, "customize"))
                ) {
                    console.log("found customize button");
                    element.click();
                }
            });
        }

        // when page heading says something like "Personalisation settings and cookies"
        if (
            isHeadingIncludingText("settings") &&
            isHeadingIncludingText("cookies")
        ) {
            // click off buttons
            all_buttons.forEach(element => {
                // click them if not hidden and says "Off"
                if (!isHidden(element) && hasTextInChild(element, "off")) {
                    console.log("found off button");
                    element.click();
                }
            });

            // then, click confirm button
            all_buttons.forEach(element => {
                // click them if not hidden and says "Confirm"
                if (!isHidden(element) && hasTextInChild(element, "confirm")) {
                    console.log("found off button");
                    element.click();
                }
            });
        }
    }

    setTimeout(() => {
        main();
        console.log("Running tampermonkey script to decline google cookies");
    }, 100);
})();
