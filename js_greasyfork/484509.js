// ==UserScript==
// @name         Scrool to bottom automatically in 'chatgpt.openai.com'.
// @namespace    https://github.com/syouSui
// @version      0.1
// @description  Click 'go to bottom' button automatically when send meassage to AI.
// @author       You
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484509/Scrool%20to%20bottom%20automatically%20in%20%27chatgptopenaicom%27.user.js
// @updateURL https://update.greasyfork.org/scripts/484509/Scrool%20to%20bottom%20automatically%20in%20%27chatgptopenaicom%27.meta.js
// ==/UserScript==

(function() {
    document.getElementById('prompt-textarea').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.querySelector(".cursor-pointer.absolute.z-10.rounded-full.bg-clip-padding.border.text-gray-600.dark\\:border-white\\/10.dark\\:bg-white\\/10.dark\\:text-gray-200.right-1\\/2.border-black\\/10.bg-token-surface-primary.bottom-5").click();
        }
    });
})();