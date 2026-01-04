// ==UserScript==
// @name         OI Wiki 複製程式碼按鈕
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.1.1
// @description  程式碼右上角新增「複製」按鈕
// @author       zica
// @match        https://oi-wiki.org/*
// @match        http://oi-wiki.com/*
// @match        https://demo.oi-wiki.org/*
// @match        https://oi-wiki.net/*
// @match        https://oi-wiki.wiki/*
// @match        https://oi-wiki.win/*
// @match        https://oi-wiki.xyz/*
// @match        https://oiwiki.moe/*
// @match        https://oiwiki.net/*
// @match        https://oiwiki.org/*
// @match        https://oiwiki.vx.st/*
// @match        https://oiwiki.wiki/*
// @match        https://oiwiki.win/*
// @match        https://oiwiki.com/*
// @match        https://oi.wiki/*
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/499212/OI%20Wiki%20%E8%A4%87%E8%A3%BD%E7%A8%8B%E5%BC%8F%E7%A2%BC%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499212/OI%20Wiki%20%E8%A4%87%E8%A3%BD%E7%A8%8B%E5%BC%8F%E7%A2%BC%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const cssString = `
.copy-button {
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 5px;
    padding: 3px;
}

.copy-mode {
    opacity: 0.5;
    cursor: pointer;
    background-color: gray;
}

.copy-mode:hover {
    opacity: 1;
}

.copied-mode {
    opacity: 0.5;
    cursor: unset;
    background-color: unset;
}
`;

    let path = undefined;
    const observer = new MutationObserver(() => {
        if (window.location.pathname === path) {
            return;
        }
        path = window.location.pathname;
        GM_addStyle(cssString);
        add_buttons();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    function toCopyMode(button) {
        button.textContent = "copy";
        button.classList.add("copy-mode");
        button.classList.remove("copied-mode");
    }
    function toCopiedMode(button) {
        button.textContent = "✅copied";
        button.classList.add("copied-mode");
        button.classList.remove("copy-mode");
    }
    function add_buttons() {
        const code_blocks = document.getElementsByClassName("highlight");
        for (const code_block of code_blocks) {
            const code = code_block.getElementsByTagName("code")[0];
            const button = document.createElement("button");
            button.className = "copy-button";
            button.onclick = async () => {
                if (button.textContent[0] == "✅") {
                    return;
                }
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    toCopiedMode(button);
                    setTimeout(() => {
                        toCopyMode(button);
                    }, 3000);
                } catch (error) {
                    alert(error.message);
                    console.error(error);
                }
            };
            toCopyMode(button);
            code.before(button);
        }
    }
})();
