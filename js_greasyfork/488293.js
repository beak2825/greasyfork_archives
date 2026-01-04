// ==UserScript==
// @name         Mark CVE
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Mark the current page CVE
// @author       Kali-Team
// @match        *://*/*
// @exclude      https://scap.kali-team.cn/*
// @icon         https://avatars.githubusercontent.com/u/99640169?s=200&v=4
// @grant        none
// @run-at       document-idle
// @homepage     https://github.com/cn-kali-team/mark-cve
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/488293/Mark%20CVE.user.js
// @updateURL https://update.greasyfork.org/scripts/488293/Mark%20CVE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let DefaultBaseUrl = 'https://scap.kali-team.cn/cve/';

    function GetBaseURL() {
        const KeyName = 'base_url';
        if (typeof browser === "undefined") {
            return DefaultBaseUrl;
        }
        try {
            browser.storage.local.get(KeyName).then((item) => {
                DefaultBaseUrl = item.base_url || DefaultBaseUrl;
            });
        } catch (error) {
            console.error(error);
        }
        return DefaultBaseUrl;
    }

    function Mark() {
        const userSelection = window.getSelection();
        const id = userSelection.toString().toLocaleUpperCase();
        const selectedTextRange = userSelection.getRangeAt(0);
        let cve = selectedTextRange.startContainer.parentNode;
        if (cve.querySelector(".Marked") != null || cve.getAttribute("class") === "Marked") {
            return;
        }
        if (["A", "CODE"].includes(cve.tagName)) {
            return;
        }
        const spanElement = document.createElement("span");
        spanElement.setAttribute("class", "Marked");
        selectedTextRange.surroundContents(spanElement);
        const icon = document.createElement("a");
        icon.href = DefaultBaseUrl + id;
        icon.target = "_blank";
        const svg = document.createElement('img');
        svg.setAttribute("style", "background-color: rgb(154, 205, 50);");
        svg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb24tdGFibGVyLWJ1ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggc3Ryb2tlPSJub25lIiBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTkgOXYtMWEzIDMgMCAwIDEgNiAwdjEiIC8+PHBhdGggZD0iTTggOWg4YTYgNiAwIDAgMSAxIDN2M2E1IDUgMCAwIDEgLTEwIDB2LTNhNiA2IDAgMCAxIDEgLTMiIC8+PHBhdGggZD0iTTMgMTNsNCAwIiAvPjxwYXRoIGQ9Ik0xNyAxM2w0IDAiIC8+PHBhdGggZD0iTTEyIDIwbDAgLTYiIC8+PHBhdGggZD0iTTQgMTlsMy4zNSAtMiIgLz48cGF0aCBkPSJNMjAgMTlsLTMuMzUgLTIiIC8+PHBhdGggZD0iTTQgN2wzLjc1IDIuNCIgLz48cGF0aCBkPSJNMjAgN2wtMy43NSAyLjQiIC8+PC9zdmc+";
        icon.appendChild(svg);
        spanElement.appendChild(icon);
    }

    function FindCVE() {
        GetBaseURL();
        if (DefaultBaseUrl.startsWith(location.hostname)) {
            return;
        }
        const regex = new RegExp('\\bCVE-\\d{4}-\\d{4,7}\\b', 'gmi');
        let m;
        let cve_arr = [];
        while (m = regex.exec(document.body.innerText)) {
            cve_arr.push(m.toString().toLocaleUpperCase());
        }
        document.designMode = "on";
        Array.from(new Set(cve_arr)).forEach(cve => {
            const sel = window.getSelection();
            sel.collapse(document.body, 0);
            while (window.find(cve)) {
                Mark();
                sel.collapseToEnd();
            }
            Mark();
            sel.collapseToEnd();
        });
        window.scrollTo(0, 0);
        document.designMode = "off";
    }

    FindCVE();
})();