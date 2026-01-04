// ==UserScript==
// @name        kukuw.com 作弊工具
// @namespace   Violentmonkey Scripts
// @match       https://dazi.kukuw.com/typing.html
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     0.3.1a1
// @run-at      document-idle
// @author      -
// @license     MIT
// @description 点击进入页面直接开始打字
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/480236/kukuwcom%20%E4%BD%9C%E5%BC%8A%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480236/kukuwcom%20%E4%BD%9C%E5%BC%8A%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
'use strict';

const delay = n => new Promise(r => setTimeout(r, n));
const getspeed = () => GM_getValue("speed_c", 100) + (Math.random() * GM_getValue("speed_v", 30));
let elem, elem2;

let stop = false;
let i, dest;

const press = (() => {
    const conf2 = {
        inputType: "insertText",
    };
    function type(key) {
        elem.value += conf2.data = key;
        elem.dispatchEvent(new InputEvent("input", conf2));
    }
    return type;
})();



const listener = new MutationObserver(list => list.forEach(rec => {
    const t = rec.target;
    if (t.className.includes("typing_on")) elem2 = t, main();

}));

document.querySelectorAll("div.typing").forEach(el => listener.observe(el, {attributeFilter: ["class"]}));

elem2 = document.querySelector("div.typing_on");
main();

function main() {
    elem = elem2.querySelector("input.typing");
    dest = elem2.querySelector("input[type=hidden]").value;
    i = 0;
    if (!stop) typer();
}


async function typer() {
    console.debug("Runtime on");
    if (GM_getValue("split_on", false))
        for (let t; t = GM_getValue("split", 3), i < dest.length; i += t) {
            if (stop) return;
            press(dest.substring(i, i+t));
            await delay(getspeed());
        }
    else
        for (; i < dest.length; ++i) {
            if (stop) return;
            press(dest[i]);
            const t = getspeed();
            console.debug("Speed = ", t);
            await delay(t);
        }
}

GM_registerMenuCommand("开始/停止", () => {
    stop = !stop;
    if (!stop) typer();
});

console.log("running...");