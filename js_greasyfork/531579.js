// ==UserScript==
// @name         GitHub Clone Prefix
// @name:zh-CN   Github上的clone前面加命令
// @name:en      GitHub Clone Prefix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description:zh-CN  在 GitHub 代码仓库页面的克隆地址前添加 "git clone "，复制即可用（对，这几个字都懒得打）
// @description:en     Add "git clone " before the clone URL on GitHub repository pages, making it ready for direct copying and use.
// @author       Yog-Sothoth
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @description Add "git clone " before the clone URL on GitHub repository pages, making it ready for direct copying and use.
// @downloadURL https://update.greasyfork.org/scripts/531579/GitHub%20Clone%20Prefix.user.js
// @updateURL https://update.greasyfork.org/scripts/531579/GitHub%20Clone%20Prefix.meta.js
// ==/UserScript==

(function() {
    function modifyInputAndButton() {
        let inputElem = document.querySelector("#clone-with-https");
        let buttonElem = inputElem?.closest("div")?.querySelector("button");
        if (!inputElem || !buttonElem) return false;
        if (!inputElem.value.startsWith("git clone ")) inputElem.value = "git clone " + inputElem.value;
        buttonElem.addEventListener("click", async (e) => {
            e.stopImmediatePropagation();
            await navigator.clipboard.writeText(inputElem.value);
        }, true);
        return true;
    }
    if (!modifyInputAndButton()) {
        let observer = new MutationObserver(() => {
            if (modifyInputAndButton()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();



