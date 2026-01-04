// ==UserScript==
// @name                Pixiv-JoystickControl
// @name:zh-CN          Pixiv-摇杆控制
// @name:ja             Pixiv-コントローラー制御
// @namespace           https://github.com/Mehver
// @version             1.0
// @description         Implement joystick control in Pixiv using the HTML5 Gamepad API.
// @description:zh-CN   使用HTML5 Gamepad API在Pixiv上实现操纵杆控制。
// @description:ja      HTML5 Gamepad APIを使用してPixivでジョイスティックコントロールを実装します。
// @author              https://github.com/Mehver
// @icon                data:image/png;base64,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
// @match               http*://pixiv.net
// @match               http*://pixiv.net/*
// @match               http*://www.pixiv.net
// @match               http*://www.pixiv.net/*
// @license             MPL-2.0
// @license             Mozilla Public License 2.0
// @homepageURL         https://github.com/SynRGB/Pixiv-JoystickControl
// @contributionURL     https://github.com/SynRGB/Pixiv-JoystickControl
// @copyright           Copyright © 2022-PRESENT, Mehver (https://github.com/Mehver)
// @charset             UTF-8
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               unsafeWindow
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/475490/Pixiv-JoystickControl.user.js
// @updateURL https://update.greasyfork.org/scripts/475490/Pixiv-JoystickControl.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let buttonA, buttonB, buttonX, buttonY, buttonRB, buttonLB, buttonRT, buttonLT;
    let buttonESC, buttonLike, buttonPageBack, buttonPageForward;
    // let buttonTabindexExit, buttonShiftTab, buttonTab, buttonEnter;

    let buttonPageBackPrevious = false;
    let buttonPageForwardPrevious = false;

    let buttonTabindexExitPrevious = false;
    let buttonShiftTabPrevious = false;
    let buttonTabPrevious = false;
    let buttonEnterPrevious = false;


    let preset = GM_getValue("preset", "Xbox");

    function setupPreset() {
        buttonA = preset === "Xbox" ? 0 : 2;
        buttonB = preset === "Xbox" ? 1 : 1;
        buttonX = preset === "Xbox" ? 2 : 0;
        buttonY = preset === "Xbox" ? 3 : 3;
        buttonRB = preset === "Xbox" ? 5 : 5;
        buttonLB = preset === "Xbox" ? 4 : 4;
        buttonRT = preset === "Xbox" ? 7 : 7;
        buttonLT = preset === "Xbox" ? 6 : 6;

        // buttonESC = buttonA;
        // buttonLike = buttonB;
        // buttonPageBack = buttonX;
        // buttonPageForward = buttonY;
    }

    function switchToXbox() {
        preset = "Xbox";
        GM_setValue("preset", "Xbox");
        setupPreset();
    }

    function switchToPlayStation() {
        preset = "PlayStation";
        GM_setValue("preset", "PlayStation");
        setupPreset();
    }

    GM_registerMenuCommand("Switch to Xbox preset", switchToXbox);
    GM_registerMenuCommand("Switch to PlayStation preset", switchToPlayStation);

    setupPreset();

    window.addEventListener("gamepadconnected", (event) => {
        console.log("A gamepad was connected:", event.gamepad);
    });

    let lastAxis0 = null;
    let lastAxis1 = null;

    function simulateKeyPress(key, extraParams = {}) {
        const eventInitDict = {bubbles: true, cancelable: true, composed: true, ...extraParams};
        document.dispatchEvent(new KeyboardEvent('keydown', {...eventInitDict, key}));
        document.dispatchEvent(new KeyboardEvent('keyup', {...eventInitDict, key}));
    }

    function focusNextElement(reverse = false) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(document.querySelectorAll(focusableElements));

        const currentIndex = focusables.findIndex(el => el === document.activeElement);
        let nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;

        if (nextIndex < 0) nextIndex = focusables.length - 1;
        if (nextIndex >= focusables.length) nextIndex = 0;

        focusables[nextIndex]?.focus();
    }

    function pollGamepad() {
        const gamepads = navigator.getGamepads();
        if (gamepads[0]) {
            const gp = gamepads[0];

            if (lastAxis0 === null) lastAxis0 = gp.axes[0];
            if (lastAxis1 === null) lastAxis1 = gp.axes[1];

            if (Math.abs(gp.axes[0] - lastAxis0) > 0.7) {
                if (gp.axes[0] > 0.7) {
                    simulateKeyPress("ArrowRight");
                } else if (gp.axes[0] < -0.7) {
                    simulateKeyPress("ArrowLeft");
                }
                lastAxis0 = gp.axes[0];
            }

            if (Math.abs(gp.axes[1] - lastAxis1) > 0.7) {
                if (gp.axes[1] > 0.7) {
                    simulateKeyPress("ArrowDown");
                } else if (gp.axes[1] < -0.7) {
                    simulateKeyPress("ArrowUp");
                }
                lastAxis1 = gp.axes[1];
            }

            if (gp.buttons[buttonESC].pressed) {
                simulateKeyPress("Escape");
            }

            if (gp.buttons[buttonLike].pressed) {
                const url = window.location.href;
                const artworksRegex1 = /\/artworks\/\d+/;
                if (artworksRegex1.test(url)) {
                    const xpath1 = '//*[@id="root"]/div[2]/div/div[3]/div/div/div[1]/main/section/div[1]/div/div[4]/div/div[2]/section/div[3]/button';
                    const xpath2 = '//*[@id="root"]/div[2]/div/div[3]/div/div/div[1]/main/section/div[1]/div/div[4]/div/div[2]/section/div[3]/a';
                    const xpath3 = '//*[@id="root"]/div[2]/div/div[3]/div/div/div[1]/main/section/div[1]/div/div[5]/div/div[2]/section/div[3]/a';
                    const element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const element3 = document.evaluate(xpath3, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element1) {
                        element1.click();
                    } else if (element2) {
                        element2.click();
                    } else if (element3) {
                        element3.click();
                    }
                }
                const artworksRegex2 = /\/bookmark_add\.php\?type=illust&illust_id=\d+/;
                if (artworksRegex2.test(url)) {
                    const xpath = '//*[@id="wrapper"]/div[1]/section/form[2]/input[7]';
                    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) {
                        element.click();
                    }
                }
            }

            if (gp.buttons[buttonPageBack].pressed && !buttonPageBackPrevious) {
                window.history.back();
            }
            buttonPageBackPrevious = gp.buttons[buttonPageBack].pressed;

            if (gp.buttons[buttonPageForward].pressed && !buttonPageForwardPrevious) {
                window.history.forward();
            }
            buttonPageForwardPrevious = gp.buttons[buttonPageForward].pressed;

            // if (gp.buttons[buttonTabindexExit].pressed) {
            //     document.elementFromPoint(10, 10)?.click();
            // }
            // buttonTabindexExitPrevious = gp.buttons[buttonTabindexExit].pressed;
            //
            // if (gp.buttons[buttonEnter].pressed && !buttonEnterPrevious) {
            //     simulateKeyPress("Enter");
            // }
            // buttonEnterPrevious = gp.buttons[buttonEnter].pressed;
            //
            // if (gp.buttons[buttonShiftTab].pressed && !buttonShiftTabPrevious) {
            //     focusNextElement(true);
            // }
            // buttonShiftTabPrevious = gp.buttons[buttonShiftTab].pressed;
            //
            // if (gp.buttons[buttonTab].pressed && !buttonTabPrevious) {
            //     focusNextElement();
            // }
            // buttonTabPrevious = gp.buttons[buttonTab].pressed;
        }
        requestAnimationFrame(pollGamepad);
    }

    pollGamepad();

    console.log("JS script Pixiv-JoystickControl (Pixiv-摇杆控制) loaded. See more details at https://github.com/SynRGB/Pixiv-JoystickControl");
})();