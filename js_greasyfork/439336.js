// ==UserScript==
// @name hate novel
// @version 1.0.0
// @author ㅇㅇ
// @description likenovel 개선 유저스크립트
// @match http*://likenovel.net/*
// @namespace hate-novel
// @rut-at document-start
// @grant GM_getValue
// @grant GM_setValue
// @noframes
// @license GPLv3
// @homepageURL https://greasyfork.org/ko/scripts/439336-hate-novel
// @downloadURL https://update.greasyfork.org/scripts/439336/hate%20novel.user.js
// @updateURL https://update.greasyfork.org/scripts/439336/hate%20novel.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const itemLength = () => {
        document.querySelector(".lengthChecker").innerHTML += `문단 수 <span class="item-length">0</span>`;

        /** @param ev {InputEvent} */
        const inputEvent = (ev) => {
            setLength(ev.target.textContent.length);
        };

        /** @param length {Number} */
        const setLength = (length) => {
            document.querySelector(".item-length").textContent = String(length).replace(/\n/g, "");
        };

        /** @type {Element} */
        let oldItem = null;

        const observer = new MutationObserver(() => {
            const item = document.querySelector("div[class*=focused]");

            if (item === null) {
                setLength(0);
                oldItem?.removeEventListener("input", inputEvent);
                return;
            }

            const p = item.querySelector("p[contenteditable]");

            p.addEventListener("input", inputEvent);
            setLength(p.textContent.length);

            if (p === oldItem) return;

            oldItem = p;
        });

        observer.observe(document.querySelector("#novelEditor div[class=editable]"), {
            attributes: true,
            subtree: true
        });
    };

    const backup = () => {
        const button = document.createElement("button");
        button.innerText = "복원";
        button.onclick = (ev) => {
            ev.preventDefault();

            const contents = GM_getValue("backup", "");

            if (contents === "") alert("백업이 없습니다.");

            document.querySelector("div#novelEditor > div[class=editable]").innerHTML = contents;
        };

        document.querySelector(".paywallCoinAmountContainer").parentElement.appendChild(button);

        setInterval(() => {
            GM_setValue("backup", document.querySelector("div#novelEditor > div[class=editable]").innerHTML);
        }, 180000);
    };

    /** 소설 작성 */
    const writeNovel = /^\/novels\/\d*\/write$/;

    /** 소설 수성 */
    const editNovel = /^\/novels\/\d*\/\d*\/edit$/;

    if (!writeNovel.test(location.pathname) && !editNovel.test(location.pathname)) return;

    try {
        itemLength();
    } catch {

    }

    try {
        backup();
    } catch {

    }
});