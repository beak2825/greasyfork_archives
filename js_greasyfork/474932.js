// ==UserScript==
// @name        sascacci 自动点击器
// @name:en     sascacci.com Auto presser
// @namespace   Violentmonkey Scripts
// @homepageURL https://sascacci.com/
// @match       https://sascacci.com/touchwaves/*
// @grant       GM_log
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @version     0.5.0.53-beta-056
// @author      axototl
// @license     AGPL-3.0-or-later
// @run-at      document-idle
// @inject-into page
// @icon        https://sascacci.com/favicon.ico
// @description:zh-CN 自动点击,解放你的双手!
// @description:en An auto presser to release your hands !!!
// @description 自动点击,解放你的双手!
// @downloadURL https://update.greasyfork.org/scripts/474932/sascaccicom%20Auto%20presser.user.js
// @updateURL https://update.greasyfork.org/scripts/474932/sascaccicom%20Auto%20presser.meta.js
// ==/UserScript==
'use strict';

(async () => {

const Random = await import("https://cdn.jsdelivr.net/npm/random-js/+esm");

function getValue(name, def) {
    let t = GM_getValue(name);
    if (null == t) {
        t = def;
        GM_setValue(name, t);
    }
    return t;
}

(() => {
    if (GM_info.scriptHandler != "Violentmonkey" && getValue("non_alert", true)) {
        alert("警告：您并没有使用Violentmonkey脚本管理器，这可能会导致一些问题。\n Warn: You did not use Violentmonkey script Manager, something may be not work properly.");
        GM_openInTab("https://violentmonkey.github.io/get-it/");
        GM_setValue("non_alert", false);
    }
})();

const codecs = [
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    109,
    110,
    111
];
const len = codecs.length;

const typ = !!location.search && parseInt(new URLSearchParams(location.search).get("typ"));

let dbg = getValue("debug", false);
const canvas = document.getElementById("cvsID");
let keeptime = getValue("keeptime", -500);
let rnd = (keeptime < 0);
keeptime = Math.abs(keeptime);
const special2 = typ == 2;


function press(key) {
    const conf = {
        bubbles: true,
        cancelable: true,
        keyCode: key
    };
    const ke = new KeyboardEvent('keydown', conf);
    canvas.dispatchEvent(ke);
}

const delay = n => new Promise(resolve => setTimeout(resolve,n));

let stop = false;
let pause = false;

let _getNxt;
let getNxt = rnd ? (_getNxt = Random.integer(10, keeptime), () => _getNxt(Random.nativeMath)) : (() => keeptime);
async function main () {
    const _gen = (typ == 4 || typ == 3) ?
          Random.MersenneTwister19937.autoSeed() : Random.browserCrypto;
    const getKey = () => Random.pick(_gen, codecs);
    if (special2) nxt = 500;
    for (;;) {
        if (stop) return;
        if (!pause)
            press(getKey());
        await delay(getNxt());
    }
}
console.log("Running");

(() => {
    // Configure
    if (special2 && GM_getValue("alert_2", true)) {
        alert("请不要让标签页处于后台后迅速切换回来, 否则可能会出现声量过大的问题 (之后不再提醒)\n\
Please don't leave tabs in the background and then switch them back immediately, or you may go deaf.");
        GM_setValue("alert_2", false);
    }
    if (GM_getValue("first", true)) {
        alert(" Click any place to Start!\n 点击任意一处开始自动播放\n 按下pause键暂停\n Press pause to suspend.");
        GM_setValue("first", false);
    }
    canvas.addEventListener("click", listen);
    function listen(ev) {
        canvas.removeEventListener("click", listen);
        main();
    }
    const listener = ev => {
        // GM_log(ev);
        const k = ev.keyCode;
        if (k == 19) pause = !pause; // Key Code of Pause button
        else if (k == 0x73) // Virtual Key Code of F4
            unreg();
        // if (ev.key == ' ') pause = !pause;
    };
    window.addEventListener("keydown", listener);
    if (special2)
        window.onblur = () => pause = true;

    const props = ["❌ (Disabled) ", "✅ (Enabled) "];
    const reg_dbg = () =>
      GM_registerMenuCommand(props[dbg | 0] + "调试模式 (Debug)", () => GM_setValue("debug", !dbg));
    let tmp2 = reg_dbg();
    GM_addValueChangeListener("debug", (_1, _2, nv) => {
        GM_unregisterMenuCommand(tmp2);
        dbg = nv;
        tmp2 = reg_dbg();
    });
    const tp3 = GM_registerMenuCommand("暂停/继续 (pause/continue)", () => pause = !pause);
    const tmp = GM_registerMenuCommand("停止运行 (Stop)", unreg);
    function unreg() {
        stop = true;
        window.removeEventListener("keydown", listener);
        GM_unregisterMenuCommand(tmp);
        GM_unregisterMenuCommand(tmp2);
        GM_unregisterMenuCommand(tp3);
    }

    GM_registerMenuCommand("设置间隔 (Time)", () => {
        let t;
        const tip = keeptime * (rnd ? 1 : -1);
        do {
            t = prompt("输入两次之间的时间间隔, 负数将会在每次模拟后 生成 最大为 输入数的相反数 的随机数\n\
Type the waiting time of two key pressing event.", tip)*1;
            if (t === null) return;
        } while(isNaN(t) || Math.abs(t) < 10);
        GM_setValue("keeptime", t);
    });
    GM_addValueChangeListener("keeptime", (_1, _2, nv) => {
        rnd = (nv < 0), keeptime = Math.abs(nv);
        getNxt = rnd ? (_getNxt = Random.integer(10, keeptime), () => _getNxt(Random.nativeMath)) : (() => keeptime);
    });
    if (typ == 4 && GM_getValue("alert_4", true)) {
        alert("第四组尚未开发完成\n Type 4 is in developing...")
        GM_setValue("alert_4", false);
    }
})();

})();