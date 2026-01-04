// ==UserScript==
// @name           Vultr console paste
// @name:zh        Vultr 控制台 粘贴功能
// @version        0.3
// @description    Add a Paste button to Vultr console
// @description:zh 给Vultr的控制台添加一个粘贴按钮
// @author         Sam0230
// @match          *://my.vultr.com/*/novnc/*
// @grant          none
// @run-at         document-start
// @namespace https://greasyfork.org/users/305841
// @downloadURL https://update.greasyfork.org/scripts/391907/Vultr%20console%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/391907/Vultr%20console%20paste.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ASCIIString = function ASCIIChar(str) {
        return (str == str.match(/[\t-~]*/)[0]);
    }
    let clearNonASCIIChar = function clearNonASCIIChar(str) {
        let result = str.match(/[\t-~]/g);
        if (!result) {
            result = [];
        }
        return result.join("");
    }
    let sendString = (function () {
        if (window.sendString) {
            return window.sendString;
        }
        window.sendStringWorking = false;
        let sendStringTimeoutId = -1;
        window.sendString = function sendString(str, onfinish, noWorkingAuth) {
            if (noWorkingAuth != "___noWorkingAuth___noWorkingAuth___noWorkingAuth___noWorkingAuth___noWorkingAuth___") {
                if (window.sendStringWorking) {
                    return false;
                }
                rfb._keyboard.ungrab();
                rfb._mouse.ungrab();
            }
            window.sendStringWorking = true;
            rfb._keyboard._allKeysUp();
            let KeyCode = str.charCodeAt(), needShift = ('~!@#$%^&*()_+{}|:"<>?'.indexOf(str[0]) != -1);
            if (KeyCode == "\n".charCodeAt()) {
                KeyCode = XK_Return;
            }
            if (KeyCode == "\t".charCodeAt()) {
                KeyCode = XK_Tab;
            }
            if (needShift) {
                rfb.sendKey(XK_Shift_L, true);
            }
            rfb.sendKey(KeyCode);
            if (needShift) {
                rfb.sendKey(XK_Shift_L, false);
            }
            if (str.length != 1) {
                for (let i = 0; i <= 27; i++) {
                    setTimeout(function () {
                        rfb._keyboard._allKeysUp();
                    }, i);
                }
                sendStringTimeoutId = setTimeout(sendString.bind(this, str.slice(1), onfinish, "___noWorkingAuth___noWorkingAuth___noWorkingAuth___noWorkingAuth___noWorkingAuth___"), 30);
            } else {
                window.sendStringWorking = false;
                rfb._keyboard.grab();
                rfb._mouse.grab();
                if (onfinish && onfinish.constructor == Function.prototype.constructor) {
                    onfinish();
                }
            }
            return function stop () {
                clearTimeout(sendStringTimeoutId);
                window.sendStringWorking = false;
                rfb._keyboard.grab();
                rfb._mouse.grab();
                if (onfinish && onfinish.constructor == Function.prototype.constructor) {
                    onfinish();
                }
            };
        }
        return window.sendString;
    })();
    let pasteButton = document.createElement("input"), textarea = document.createElement("textarea"), CapsLockButton = document.createElement("input");
    pasteButton.type = "button";
    pasteButton.value = "Paste";
    pasteButton.id = "pasteButton";
    pasteButton.style.display = "inline";
    pasteButton.disabled = true;
    textarea.placeholder = "Paste";
    textarea.id = "pasteTextarea";
    textarea.style.display = "inline";
    textarea.style.position = "relative";
    textarea.style.top = "4px";
    textarea.style.height = "13px";
    textarea.cols = "6";
    textarea.style.border = "none";
    textarea.style.resize = "none";
    textarea.onfocus = function () {
        rfb._keyboard.ungrab();
        rfb._mouse.ungrab();
    }
    textarea.onblur = function () {
        rfb._keyboard.grab();
        rfb._mouse.grab();
    }
    textarea.oninput = function () {
        textarea.value = clearNonASCIIChar(textarea.value);
    }
    CapsLockButton.type = "button";
    CapsLockButton.value = "CapsLock";
    CapsLockButton.id = "CapsLockButton";
    CapsLockButton.style.display = "inline";
    CapsLockButton.disabled = true;
    let addButton = function addButton() {
        if (!document.getElementById("noVNC_buttons")) {
            setTimeout(addButton, 25);
            return;
        }
        document.getElementById("noVNC_buttons").appendChild(textarea);
        document.getElementById("noVNC_buttons").appendChild(pasteButton);
        document.getElementById("noVNC_buttons").appendChild(CapsLockButton);
        let enableButton = function enableButton() {
            if (!document.getElementById("noVNC_canvas") || document.getElementById("noVNC_canvas").height == 20) {
                setTimeout(enableButton, 25);
                return;
            }
            pasteButton.disabled = false;
            pasteButton.onclick = function () {
                let self = pasteButton.onclick;
                textarea.value = clearNonASCIIChar(textarea.value);
                let text = textarea.value;
                textarea.value = "";
                textarea.disabled = true;
                textarea.placeholder = "Busy";
                pasteButton.value = "Stop";
                let stop = sendString(text, function () {
                    pasteButton.onclick = self;
                    pasteButton.value = "Paste";
                    textarea.disabled = false;
                    textarea.placeholder = "Paste";
                });
                pasteButton.onclick = function () {
                    stop();
                }
            }
            CapsLockButton.disabled = false;
            CapsLockButton.onclick = function () {
                rfb.sendKey(XK_Caps_Lock, 1);
            }
        }
        setTimeout(enableButton, 0);
    }
    setTimeout(addButton, 0);
})();