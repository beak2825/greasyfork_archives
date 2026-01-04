// ==UserScript==
// @name         Astral Client's Menu
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  none needed
// @license     MIT
// @author       _x7333 on discord
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe.io
// @match        https://scenexe2.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491177/Astral%20Client%27s%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/491177/Astral%20Client%27s%20Menu.meta.js
// ==/UserScript==

!function() {
    "use strict";

console.log("%c Astral %c Client %c v1.5 %c by %c _x7333",
    "font-size: 24px; font-weight: bold; color: #691b70; background: #461c63; border-radius: 5px; padding: 5px;",
    "font-size: 24px; font-weight: bold; color: #461c63; background: #691b70; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: bold; color: white; background: black; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: bold; color: white; background: black; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: 700; color: #9300a1; background: black; border-radius: 5px; padding: 5px;",);

eval(`
const a = document.querySelectorAll("div#title");
a.forEach((t) => {
    t.textContent = "Astral Client";
});

const b = document.querySelectorAll("#serverSelect");
b.forEach((e) => {
    e.style.height = "125px";
    e.style.width = "400px";
});

const c = document.querySelectorAll("div#playMenu");
c.forEach((e) => {
    e.style.height = "50px";
    e.style.width = "400px";
});

const d = document.querySelectorAll("div#serverSelectLowerText");
d.forEach((e) => {
    e.textContent = "Astral Client";
});

const e = document.querySelectorAll("div#credits");
e.forEach((e) => {
    e.remove();
});

const f = document.querySelectorAll("div#featured");
f.forEach((e) => {
    e.remove();
});

const g = document.querySelectorAll("div#modals");
g.forEach((e) => {
    e.remove();
});

const i = document.querySelectorAll("div#discordButton");
i.forEach((e) => {
    e.remove();
});

const j = document.querySelectorAll("button#b3");
j.forEach((e) => {
    e.remove();
});

const k = document.querySelectorAll("button");
k.forEach((button) => {
    if (k.innerText === "ad") {
        k.remove();
    }
});

const l = document.querySelectorAll("button#b0");
l.forEach((e) => {
    e.remove();
});

function h() {
    const t = document.getElementById("-0"),
          e = document.getElementById("-1"),
          n = document.getElementById("-2");
    if (t && e && n) {
        t.style.opacity = "0.1";
        e.style.opacity = "0.1";
        n.style.opacity = "0.1";
    }
}
h();
`);

}();