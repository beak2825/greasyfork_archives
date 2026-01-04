// ==UserScript==
// @name         Ruffle Virtual Keyboard For Mobile
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  Displays an onscreen gamepad with arrow keys and spacebar so you can play Ruffle games on mobile
// @author       https://github.com/ed253/ruffle-virtual-keyboard/
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruffle.rs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543622/Ruffle%20Virtual%20Keyboard%20For%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/543622/Ruffle%20Virtual%20Keyboard%20For%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pressKey(kEvent, kName, kCode, kNumber) {
        if(document.querySelector("ruffle-player") != null) {
            var ruffleSelector = "ruffle-player";
        } else if(document.querySelector("ruffle-embed") != null) {
            var ruffleSelector = "ruffle-embed";
        } else if(document.querySelector("#player") != null) {
            var ruffleSelector = "#player";
        } else {
            return false;
        }
        document.querySelector(ruffleSelector).focus();
        document.querySelector(ruffleSelector).dispatchEvent(new KeyboardEvent(kEvent, { key: kName, code: kCode, keyCode: kNumber, which: kNumber, bubbles: true }));
        return false;
    }

    function addKeyboard() {
        var html = `<style>
        #virtualKb {
            position: fixed;
            width: 100%;
            height: 260px;
            left: 0px;
            bottom: 0px;
            z-index: 9999;
            background-color: transparent;
            pointer-events: none;
        }
        #keyboardLeft {
            position: absolute;
            top: 10px;
            left: 10px;
        }
        #keyboardRight {
            position: absolute;
            top: 10px;
            right: 20px;
        }
        #arrowKeys {
            position: relative;
            width: auto;
            height: auto;
        }
        #upKey, #downKey, #leftKey, #rightKey, #spaceBar {
            position: absolute;
            background: #333;
            border: 2px solid #eee;
            color: #eee;
            font-weight: bold;
            font-size: 18px;
            padding: 4px;
            pointer-events: all;
            cursor: pointer;
        }
        #upKey, #downKey, #leftKey, #rightKey {
            border-radius: 5px;
            width: 80px;
            height: 80px;
        }
        #upKey {
            top: 0px;
            left: 80px;
        }
        #downKey {
            top: 160px;
            left: 80px;
        }
        #leftKey {
            top: 80px;
            left: 0px;
        }
        #rightKey {
            top: 80px;
            left: 160px;
        }
        #spaceBar {
            width: 100px;
            height: 100px;
            border-radius: 100%;
            top: 80px;
            right: 0px;
        }
        </style>
        <div id="virtualKb">
            <div id="keyboardLeft">
                <div id="arrowKeys">
                    <button id="upKey">Up</button>
                    <button id="leftKey">Left</button>
                    <button id="downKey">Down</button>
                    <button id="rightKey">Right</button>
                </div>
            </div>
            <div id="keyboardRight">
                <button id="spaceBar">Space</button>
            </div>
        </div>`;
        var el = document.createElement("div");
        el.id = "virtualKbContainer";
        el.innerHTML = html;
        document.body.insertBefore(el, document.body.childNodes[0]);
        var buttons = [
            { id: "#upKey", keyName: "ArrowUp", keyCode: "ArrowUp", keyNumber: 38 },
            { id: "#leftKey", keyName: "ArrowLeft", keyCode: "ArrowLeft", keyNumber: 37 },
            { id: "#downKey", keyName: "ArrowDown", keyCode: "ArrowDown", keyNumber: 40 },
            { id: "#rightKey", keyName: "ArrowRight", keyCode: "ArrowRight", keyNumber: 39 },
            { id: "#spaceBar", keyName: " ", keyCode: "Space", keyNumber: 32 }
        ];
        for(var button of buttons) {
            document.querySelector(button.id).addEventListener("pointerdown", pressKey.bind(null, 'keydown', button.keyName, button.keyCode, button.keyNumber), false);
            document.querySelector(button.id).addEventListener("pointerup", pressKey.bind(null, 'keyup', button.keyName, button.keyCode, button.keyNumber), false);
        }
    }

    addKeyboard();

})();