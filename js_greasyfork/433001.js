// ==UserScript==
// @name         Insert zero-width spaces into your Tweet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Insert zero-width characters in your tweets
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://twitter.com/*/*
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433001/Insert%20zero-width%20spaces%20into%20your%20Tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/433001/Insert%20zero-width%20spaces%20into%20your%20Tweet.meta.js
// ==/UserScript==

/*jshint esversion: 8 */

function rafAsync() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}

async function checkElement(selector) {
    let q = null;
    while (q === null) {
        await rafAsync();
        q = document.querySelector(selector);
    }
    return q;
}

function main() {
    "use strict";
    let btn = document.createElement("button");
    btn.setAttribute("id", "zerow");
    btn.innerHTML = "Insert 0-width space";
    btn.onclick = function () {
        let elms = Array.from(
            document.querySelectorAll(
                `div[style="max-height: 720px; min-height: 96px;"]>div>div>div>div>div>div>span>*`
            )
        );
        let elms_ns = elms.map((x) => x.tagName);
        let uniq_elms_ns = [...new Set(elms_ns.flat(1))];
        if (
            elms.length === 0 ||
            (uniq_elms_ns.length === 1 && uniq_elms_ns[0] === "BR")
        ) {
            console.log("do nothing");
        } else if (
            elms_ns.includes("SPAN") &&
            elms[elms.length - 1].tagName !== "BR"
        ) {
            alert("Put a new line at the end of your tweet!");
        } else {
            elms.forEach((e) => {
                e.innerText = e.innerText
                    .replaceAll('\u{200B}', "")
                    .replaceAll(/(.)/g, "$1\u{200B}");
            });
            console.log("inserted!");
        }
    };
    const qs =
        "div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci" +
        ".r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t" +
        "> div:nth-child(3) > div > div > div:nth-child(1)";
    checkElement(qs).then((e) => {
        console.info(e);
        e.appendChild(btn);
    });
    console.log("loaded!");
}

function waitForCompose() {
    if (
        window.location.href === "https://twitter.com/compose/tweet" &&
        document.readyState === "complete" &&
        document.getElementById("zerow") === null
    ) {
        main();
        // clearInterval(t);
    } else {
        // console.log("timer");
    }
}

var t = setInterval(waitForCompose, 500);
