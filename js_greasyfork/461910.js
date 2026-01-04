// ==UserScript==
// @name         onche.org
// @namespace    https://onche.org/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://onche.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461910/oncheorg.user.js
// @updateURL https://update.greasyfork.org/scripts/461910/oncheorg.meta.js
// ==/UserScript==

function improve() {
    'use strict';
    const color1 = "rgb(28, 43, 58)";
    const color2 = "rgb(38, 53, 68)";
    const color3 = "rgb(48, 63, 78)";
    const color4 = "rgb(107, 145, 183)";
    const color5 = "rgb(83 174 255)";

    //Forum
    Array.from(document.querySelectorAll(".bloc")).map(x => x.style= "background-color: "+color2)
    Array.from(document.querySelectorAll(".topic:nth-child(odd)")).map(x => x.style= "background-color: "+color1)
    Array.from(document.querySelectorAll(".topic-subject link")).map(x => x.style.color=color5)


    Array.from(document.querySelectorAll(".input")).map(x => x.style.border="solid 1px "+color3)
    Array.from(document.querySelectorAll(".textarea")).map(x => x.style.border="solid 1px "+color3)
    Array.from(document.querySelectorAll(".bloc")).map(x => x.style.border="solid 1px "+color3)
    Array.from(document.querySelectorAll("#post")).map(x => x.style.border="solid 1px "+color3)

    // Message
    Array.from(document.querySelectorAll(".message")).map(x => x.style= "background-color: "+color2)
    Array.from(document.querySelectorAll(".message")).map(x => x.style.border="solid 1px "+color3)
    Array.from(document.querySelectorAll(".message")).map(x => x.style.margin="0 0 15px")
    Array.from(document.querySelectorAll(".message-date")).map(x => x.style="font-size:.7rem")
    Array.from(document.querySelectorAll(".message-date")).map(x => x.style.border="solid 1px "+color3)
    Array.from(document.querySelectorAll(".message-date")).map(x => x.style.color=color4)
    console.log("Thème bleu amélioré")
}

window.onload = (() => {
    console.log(document.querySelector("body").className.includes("blue"))
    if (document.querySelector("body").className.includes("blue"))
        improve();
    })()