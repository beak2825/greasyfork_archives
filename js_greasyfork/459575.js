// ==UserScript==
// @name         ChatGPT Content Download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  下载所有回复内容
// @author       不告诉你
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/auth/login
// @license      GPL-3.0
// @run-at       document-idie
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459575/ChatGPT%20Content%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/459575/ChatGPT%20Content%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a toggle button
    let toggleBtn2 = document.createElement("button");
    toggleBtn2.style.position = "fixed";
    toggleBtn2.style.top = "40px";
    toggleBtn2.style.right = "10px";
    toggleBtn2.innerHTML = "Download Content";
    toggleBtn2.onclick = function() {
        //const div = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative");
        let divs=document.getElementsByClassName("w-full border-b");
        var text = "";
        for (var i = 0; i < divs.length; i++) {
             text = text + divs[i].innerText +"\n";
        }
        const a = document.createElement("a");
        const blob = new Blob([text], { type: "text/plain" });
        a.href = URL.createObjectURL(blob);
        a.download = "text.txt";
        a.click();
    }
    document.body.appendChild(toggleBtn2);
})();