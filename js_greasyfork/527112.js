// ==UserScript==
// @name         MyAnimeList(MAL) - BBCODE Editor Character Counter
// @version      1.0.4
// @description  This script will add a character counter to the MAL BBCODE Editor.
// @author       Cpt_mathix
// @match        https://myanimelist.net/*
// @grant        none
// @run-at document-body
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/527112/MyAnimeList%28MAL%29%20-%20BBCODE%20Editor%20Character%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/527112/MyAnimeList%28MAL%29%20-%20BBCODE%20Editor%20Character%20Counter.meta.js
// ==/UserScript==

init();

function init() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('sceditor-outer')) {
                        var tabs = node.querySelector(".sceditor-tabs");
                        var textarea = node.querySelector("textarea");

                        tabs.insertAdjacentHTML("beforeend", `<li class="character-counter" style="margin-left: auto;">Character count: ${getCharCount(textarea)}</li>`);

                        textarea.addEventListener("input", (event) => {
                            var counter = event.target.closest(".sceditor-outer").querySelector(".character-counter");
                            counter.innerHTML = "Character count: " + getCharCount(event.target);
                        });
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    var interestStackTextArea = document.getElementById("stack_description");
    if (interestStackTextArea) {
        interestStackTextArea.previousElementSibling.insertAdjacentHTML("beforeend", '<small class="character-counter" style="float: right;padding-top: 10px;">Character count: 0</small>');
        interestStackTextArea.addEventListener("input", (event) => {
            var counter = event.target.previousElementSibling.querySelector(".character-counter");
            counter.innerHTML = "Character count: " + getCharCount(event.target);
        });
    }
}

function getCharCount(textarea) {
    return textarea.value.length || 0;
}