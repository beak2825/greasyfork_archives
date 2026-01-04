// ==UserScript==
// @name         Bold First Letter
// @namespace    https://codeforces.com/
// @version      0.2
// @description  𝗠ake 𝗲very 𝗳irst 𝗹etter 𝗶n 𝗲very 𝘄ord 𝗯𝗼𝗹𝗱.
// @author       𝗺agurofly
// @match        https://codeforces.com/contest/*/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445298/Bold%20First%20Letter.user.js
// @updateURL https://update.greasyfork.org/scripts/445298/Bold%20First%20Letter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    await new Promise(done => setTimeout(done, 500));

    const doc = unsafeWindow.document;

    for (const paragraph of doc.querySelectorAll(".problem-statement p")) {
        for (const node of paragraph.childNodes) {
            if (node.nodeType !== node.TEXT_NODE) continue;

            const wordPattern = /^[-\w]+$/;
            const words = node.textContent.split(" ");
            const wrapper = doc.createElement("span");
            for (let i = 0; i < words.length - 1; i++) words[i] += " ";
            for (const word of words) {
                if (wordPattern.test(word[0])) {
                    const bold = doc.createElement("span");
                    bold.style.fontWeight = "600";
                    bold.style.color = "darkslateblue";
                    const m = Math.ceil(word.length * 0.25);
                    bold.textContent = word.slice(0, m);
                    const text = doc.createTextNode(word.slice(m));
                    wrapper.appendChild(bold);
                    wrapper.appendChild(text);
                } else {
                    wrapper.appendChild(doc.createTextNode(word));
                }
            }

            paragraph.insertBefore(wrapper, node);
            paragraph.removeChild(node);
        }
    }
})();