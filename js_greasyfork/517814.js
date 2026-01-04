// ==UserScript==
// @name         BSKY EZ HASHTAGS
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add pre-defined tags easily!
// @author       minnie
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517814/BSKY%20EZ%20HASHTAGS.user.js
// @updateURL https://update.greasyfork.org/scripts/517814/BSKY%20EZ%20HASHTAGS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const tags = {
        "myTags": "#add #your #tags"
    };

    const styleEZ = document.createElement('style');
    styleEZ.innerHTML = `
    :root { color-scheme: light dark; }
    .light { color-scheme: light; }
    .dark { color-scheme: dark; }
    .EZOptions {
        display: none;
        position: relative;
        background-color: light-dark(#D8DFF2, #0F1B27);
        color: light-dark(#ffffff, #000000);
        border: 1px solid light-dark(#7B8EBF, #344F95);
        border-radius: 8px;
        padding: 10px;
        z-index: 100000000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .EZOptions.EZvisible { display: block; }
    `;
    document.head.appendChild(styleEZ);

    document.addEventListener("DOMContentLoaded", () => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add("light");
    });

    const createTagButton = () => {
        const actionBtns = document.querySelector(".r-1xfd6ze > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1)");
        if (actionBtns && !document.querySelector(".custom-button")) {
            const newBtn = document.createElement("button");
            newBtn.setAttribute("aria-label", "Tags");
            newBtn.className = "css-175oi2r r-1loqt21 r-1otgn73 custom-button";
            newBtn.style.flexDirection = "row";
            newBtn.style.alignItems = "center";
            newBtn.style.justifyContent = "center";
            newBtn.style.borderRadius = "999px";
            newBtn.style.padding = "8px";
            newBtn.style.position = "relative";
            newBtn.innerHTML = `
                <svg class="w-6 h-6 text-gray-800 custom-button dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="hsl(211, 99%, 53%)" d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                </svg>
            `;
            actionBtns.append(newBtn);

            const options = document.createElement("div");
            options.classList.add("EZOptions");
            newBtn.appendChild(options);

            for (const [key, value] of Object.entries(tags)) {
                const option = document.createElement("button");
                option.textContent = key;
                option.style.margin = "5px";
                option.style.padding = "5px 10px";
                option.style.border = "1px solid light-dark(#1471D5, #1471D5)";
                option.style.borderRadius = "4px";
                option.style.cursor = "pointer";
                option.style.backgroundColor = "light-dark(#1471D5, #000000)";
                option.style.color = "light-dark(#ffffff, #ffffff)";

                option.addEventListener("click", () => {
                    const textBox = document.querySelector(".tiptap");
                    if (textBox) {
                        textBox.focus();
                        const range = document.createRange();
                        range.selectNodeContents(textBox);
                        range.collapse(false);

                        const selectedTags = tags[key];
                        const textNode = document.createTextNode(`${selectedTags} `);
                        range.insertNode(textNode);

                        range.setStartAfter(textNode);
                        range.setEndAfter(textNode);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);

                        textBox.dispatchEvent(new Event("input", { bubbles: true }));
                    } else {
                        console.log("TEXT BOX NOT FOUND");
                    }
                });

                options.appendChild(option);
            }

            newBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                options.classList.toggle("EZvisible");
            });

            document.body.addEventListener("click", () => {
                options.classList.remove("EZvisible");
            });
        }
    };

    const observer = new MutationObserver(() => {
        createTagButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();