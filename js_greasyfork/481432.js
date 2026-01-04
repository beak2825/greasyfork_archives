// ==UserScript==
// @name         Better Journal+
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  cool
// @author       Cyrsia
// @match        https://journal.top-academy.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=top-academy.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481432/Better%20Journal%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/481432/Better%20Journal%2B.meta.js
// ==/UserScript==

let logger = true;

let CurrentTheme = "dark";

let dark = {
    "rgb(154, 201, 192)": "#293230",
    "rgb(255, 255, 255)": "#212020",
    "rgb(255, 213, 235)": "#ffffff",
    "rgb(169, 246, 180)": "#1f0707",
    "rgb(217, 24, 66)": "#400531",
    "rgb(241, 246, 250)": "#3d3436",
    "rgb(245, 248, 250)": "#212020",
    "rgb(246, 248, 249)": "#736f6f",
    "rgb(206, 229, 240)": "#ffffff",
    "rgb(163, 174, 200)": "#44474f",
    "rgb(33, 37, 41)": "#676e75",
    "rgb(41, 49, 63)": "#7c8799",
    "rgb(90, 95, 98)": "#9ba0a3",
    "rgb(24, 129, 148)": "#8c1c25",
    "rgb(25, 195, 224)": "#ad1318",
    "rgb(51, 51, 51)": "#ffffff",
    "rgb(31, 138, 28)": "#361c8a",
    "rgb(27, 210, 199)": "#d21b1b",
    "rgb(25, 195, 224)": "#941818",
    "rgb(225, 225, 225)": "#212020",
    "rgb(252, 252, 252)": "#1c1b1b",
    "rgb(26, 164, 203)": "#cb1a1a",
    "rgb(245, 212, 125)": "#b53d3d",
    "rgba(33, 51, 71, 0.8)": "rgba(40, 3, 7, 0.8)",
    "texts": {
        "rgb(255, 255, 255)": "#c4bebe",
        "rgb(51, 51, 51)": "#ffffff",
        "rgb(41, 49, 63)": "#7c8799",
        "rgb(33, 37, 41)": "#676e75",
        "rgb(24, 129, 148)": "#fff",
        "rgb(27, 210, 199)": "#d21b1b",
        "rgb(25, 195, 224)": "#941818",
        "rgb(26, 164, 203)": "#cb1a1a",
    },
    "imgs": {
        "https://journal.top-academy.ru/assets/images/arrow-up.png?v=d714e2c7a00aab4f227a453afbbf0342": "hue-rotate(180deg) saturate(6.5)",
        "https://journal.top-academy.ru/assets/images/arrow-circle.png?v=9380259b60f27f7c98a96ba07c9cbd60": "hue-rotate(180deg) saturate(6.5) contrast(65%) brightness(65%)",
        "https://journal.top-academy.ru/assets/images/arrow-circle-white.png?v=55c286266e42c5bddd2088bd3f3a0f36": "hue-rotate(180deg) saturate(6.5) contrast(65%) brightness(65%)",
    }
};

let themes = {
    "dark": dark,
}

function log(msg) {
    if (logger){
        console.log("[LOG] " + msg)
    }
}

(function() {
    'use strict';

    let updating = false;

    function replaceColors() {
        const allElements = document.querySelectorAll('*');
        updating = true;

        let themeSpace = themes[CurrentTheme]

        const images = document.querySelectorAll('img');

        images.forEach(image => {
            const src = image.src;
            if (src && themeSpace.imgs[src]){
                image.style.filter = themeSpace.imgs[src];
            }
        });


        allElements.forEach(element => {
            const currentBC = window.getComputedStyle(element).backgroundColor;
            const currentC = window.getComputedStyle(element).color;
            const currentF = window.getComputedStyle(element, "filled").fill;
            const background = window.getComputedStyle(element).background.split(")")[0] + ")"
            const backgroundA = window.getComputedStyle(element, ".active").background.split(")")[0] + ")"

            if (currentBC && themeSpace[currentBC]) {
                element.style.backgroundColor = themeSpace[currentBC];
            }

            if (currentC && themeSpace[currentC]) {
                if (!element.textContent) {
                    element.style.color = themeSpace[currentC];
                } else {
                    element.style.color = themeSpace.texts[currentC]
                }
            }

            if (background && themeSpace[background]) {
                element.style.background = themeSpace[background]
            }
        })
    };

    function update() {
        if (!updating) {
            updating = true;
            log("Update");
            replaceColors();
            updating = false;
        }
    }

    window.addEventListener('load', update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { subtree: true, childList: true });
})();