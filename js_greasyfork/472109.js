// ==UserScript==
// @name         ThiccGPT
// @namespace    com.anwinity.chatgpt
// @version      1.0.2
// @description  Very simple. Just makes the ChatGPT chat interface wider so you can actually see stuff. Especially useful for code blocks.
// @author       Anwinity
// @match        *://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/472109/ThiccGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/472109/ThiccGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(id, css) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    }

    const css = `
		div.group {
			max-width: 100rem !important;
		}
    `;
    addStyle("thiccgpt-style", css);

})();