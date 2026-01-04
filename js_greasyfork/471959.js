// ==UserScript==
// @name         Woomy High Resolution Screenshotter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Takes a high resolution screenshot when you click SHIFT + N
// @author       PowfuArras // Discord: @xskt
// @match        *://*.woomy.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/471959/Woomy%20High%20Resolution%20Screenshotter.user.js
// @updateURL https://update.greasyfork.org/scripts/471959/Woomy%20High%20Resolution%20Screenshotter.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const options = [
        { display: "", value: "1.00", scale: 1.00 },
        { display: "", value: "1.25", scale: 1.25 },
        { display: "", value: "1.50", scale: 1.50 },
        { display: "", value: "2.00", scale: 2.00 },
        { display: "", value: "5.00", scale: 5.00 },
        { display: "", value: "10.0", scale: 10.0 }
    ];
    let screenshotModeCheckbox;
    let saveOptionsButton;
    let currentOption = options[options.findIndex(option => option.value === localStorage.getItem("PowfuArras_ScreenshotResolution"))] || options[0];
    let canvas;
    let listenForFrame = false;
    let width;
    let height;
    const nativeRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = function (callback) {
        switch (listenForFrame) {
            case 1:
                window.open().document.write(`<html><style>*{padding:0;margin:0;border:0;font-size:0;outline:0;border-radius:0;}</style><title>High Resolution Screenshot</title><head></head><body><img src="${canvas.toDataURL("image/png")}"/></body></html>`);
                window.innerWidth = width;
                window.innerHeight = height;
                window.dispatchEvent(new Event("resize"));
                screenshotModeCheckbox.checked = false;
                screenshotModeCheckbox.dispatchEvent(new Event("change"));
                saveOptionsButton.click();
                listenForFrame = 0;
                break;
            case 0:
                break;
            default:
                listenForFrame -= 1;
                break;
        }
        nativeRequestAnimationFrame(callback);
    };
    window.addEventListener("load", function () {
        canvas = document.getElementById("gameCanvas");
        canvas.addEventListener("keydown", function (event) {
            if (event.shiftKey && event.keyCode === 78) {
                width = window.innerWidth;
                height = window.innerHeight;
                window.innerWidth = width * currentOption.scale;
                window.innerHeight = height * currentOption.scale;
                window.dispatchEvent(new Event("resize"));
                screenshotModeCheckbox.checked = true;
                screenshotModeCheckbox.dispatchEvent(new Event("change"));
                saveOptionsButton.click();
                listenForFrame = 2;
            }
        });
        let interval = setInterval(function () {
            try {
                const element = document.getElementById("Woomy_backgroundAnimation").parentElement.cloneNode(true);
                clearInterval(interval);
                const select = element.children[0];
                element.childNodes[0].textContent = "Screenshot Resolution: ";
                select.style.maxWidth = "120x";
                select.id = "PowfuArras_ScreenshotResolution";
                select.innerHTML = options.map(option => `<option value=${option.value}>x${option.value}</option>`);
                select.addEventListener("change", function (event) {
                    currentOption = options[options.findIndex(option => option.value === event.target.value)];
                    localStorage.setItem("PowfuArras_ScreenshotResolution", currentOption.value);
                    if (currentOption.scale > 4.99) alert("[Warning] The screenshot resolution you have chosen is particularly high, and may crash your browser so be careful!\n-Jekyll // xskt");
                });
                element.children[0].selectedIndex = options.findIndex(option => option.value === currentOption.value);
                element.dispatchEvent(new Event("change"));
                document.querySelectorAll(".optionsFlexHolder")[0].appendChild(element);
                screenshotModeCheckbox = document.getElementById("Woomy_screenshotMode");
                saveOptionsButton = document.getElementById("saveOptions");
            } catch (error) {}
        }, 100);
    });
})();