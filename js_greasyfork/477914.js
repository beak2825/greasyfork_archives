// ==UserScript==
// @name        typeracer.com - Cheats
// @name:zh-CN  TypeRacer 作弊工具
// @namespace   Violentmonkey Scripts
// @match       https://play.typeracer.com/
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @version     0.3
// @author      -
// @license     0BSD
// @description You shouldn't use this script or you are going to be banned from taking races.
// @description:zh-CN 此脚本图一乐，正常情况不应该使用本脚本
// @downloadURL https://update.greasyfork.org/scripts/477914/typeracercom%20-%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/477914/typeracercom%20-%20Cheats.meta.js
// ==/UserScript==
'use strict';

/*
 * This config is for Chinese typing.
{
  "speed_c": 300,
  "speed_v": 45
}*/

let el;

const press = (() => {
    const conf2 = {
        inputType: "insertText",
    };
    function type(key) {
        el.value += key;
        conf2.data = key;
        el.dispatchEvent(new InputEvent("input", conf2));
    }
    return type;
})();

const delay = n => new Promise(sol => setTimeout(sol, n));

let _stop = false;

async function main () {
    const txt = document.querySelector(".inputPanel div").innerText;
    el = document.querySelector(".txtInput");
    for (const t of txt) {
        if (_stop) return;
        await delay(GM_getValue("speed_c", 100) + Math.trunc(Math.random() * GM_getValue("speed_v", 30)));
        press(t);
    }
}

const stop = () => _stop = true
const start = () => (_stop = false, main());
GM_registerMenuCommand("停止 Stop", stop);
GM_registerMenuCommand("启动 Start", start);