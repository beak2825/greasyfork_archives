// ==UserScript==
// @name         ChatGPT Auto Continue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically inputs "继续" in ChatGPT's dialog box after a response is received
// @author       不告诉你
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/auth/login
// @license      GPL-3.0
// @run-at       document-idie
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459495/ChatGPT%20Auto%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/459495/ChatGPT%20Auto%20Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a toggle button
    let toggleBtn = document.createElement("button");
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "10px";
    toggleBtn.style.right = "10px";
    toggleBtn.innerHTML = "Auto Continue: Off";
    toggleBtn.onclick = function() {
        if (this.innerHTML === "Auto Continue: Off") {
            this.innerHTML = "Auto Continue: On";
            startAutoInput();
        } else {
            this.innerHTML = "Auto Continue: Off";
            stopAutoInput();
        }
    };
    document.body.appendChild(toggleBtn);

    let interval;
    function startAutoInput() {
        interval = setInterval(function() {
            // 判断页面上是否有 regenerate response的元素
            let button1 = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\] > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient > form > div > div.flex.ml-1.mt-1\\.5.md\\:w-full.md\\:m-auto.md\\:mb-2.gap-0.md\\:gap-2.justify-center > button");
            if (button1.innerHTML.includes("Regenerate response")) {
                //判断最后的回复是不是已经到了结尾，以及有无抱歉、对不起字眼。英文可自行添加，下个版本关键词列为数组
                var allParagraphs = document.getElementsByTagName("p");
                var lastParagraph = allParagraphs[allParagraphs.length - 1];
                if ((lastParagraph.innerText.indexOf("很抱歉")!= -1) || (lastParagraph.innerText.indexOf("对不起")!=-1)){
                    console.info(lastParagraph.innerText);
                    clearInterval(interval);
                    toggleBtn.innerHTML = "Auto Continue: Off";
                    stopAutoInput();
                }
                // 如果不是结尾，那么在文本框中输入 "继续" 和回车
                let inputElem = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\] > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient > form > div > div.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-md.shadow-\\[0_0_10px_rgba\\(0\\,0\\,0\\,0\\.10\\)\\].dark\\:shadow-\\[0_0_15px_rgba\\(0\\,0\\,0\\,0\\.10\\)\\] > textarea");
                inputElem.value = "继续";

                var event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                });
                inputElem.dispatchEvent(event);
            }
        }, 2000);
    }

    function stopAutoInput() {
        clearInterval(interval);
    }
})();
