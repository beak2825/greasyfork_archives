// ==UserScript==
// @name         bilibili 专栏去除复制文本自带出处
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站专栏去除复制文本时自带的出处
// @author       You
// @match        https://www.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442037/bilibili%20%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E8%87%AA%E5%B8%A6%E5%87%BA%E5%A4%84.user.js
// @updateURL https://update.greasyfork.org/scripts/442037/bilibili%20%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E8%87%AA%E5%B8%A6%E5%87%BA%E5%A4%84.meta.js
// ==/UserScript==

const cob = document.createElement("textarea");
cob.id = "bilibili-copy";
cob.style.position = "fixed";
cob.style.top = "-999px";
const labelZ = document.createElement("label");
labelZ.appendChild(cob);
document.body.appendChild(labelZ);

function _keyAll(key) {
    if (key === "Control") {
        _keyDownRun = _keyCtrl;
        _keyUpRun = _CtrlRemove;
    }
    return true;
}

function _keyCtrl(key) {
    if (key === "c") {
        cob.value = document.getSelection().toString().replaceAll("\n\n", "\n");
        cob.select();
        document.execCommand("copy");
        return false;
    }
    _keyDownRun = _keyAll;
    return true;
}

function _Void(key) {
}

function _CtrlRemove(key) {
    if (key === "Control") {
        _keyDownRun = _keyAll;
        _keyUpRun = _Void;
    }
}

let _keyDownRun = _keyAll;
let _keyUpRun = _Void;

window.onkeydown = function () {
    const key = event.key;
    return _keyDownRun(key);
}

window.onkeyup = function () {
    const key = event.key;
    _keyUpRun(key);
}