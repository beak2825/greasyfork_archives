// ==UserScript==
// @name         V3rmillion Code Box Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  balls
// @author       https://v3rmillion.net/member.php?action=profile&uid=1735791
// @match        https://v3rmillion.net/showthread.php?tid=*
// @icon         https://www.google.com/s2/favicons?domain=v3rmillion.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433057/V3rmillion%20Code%20Box%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/433057/V3rmillion%20Code%20Box%20Copy.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let CodeBlocks = Object.values($(".codeblock")).filter(v => v?.className);

    for (let CodeBlock of CodeBlocks) {
        let ImgButton = document.createElement("img");
        let Content = CodeBlock.children[1].firstChild.textContent;
    
        ImgButton.src = "https://cdn.avonis.app/bc9385a1.svg";
        ImgButton.style = "height: 17px; float: right;";
        ImgButton.onclick = (() => navigator.clipboard.writeText(Content));
    
        CodeBlock.prepend(ImgButton);
    }
})();