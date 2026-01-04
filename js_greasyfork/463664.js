// ==UserScript==
// @name Avoid Copy Self Email in OpenAI ChatGPT
// @namespace github.com/openstyles/stylus
// @version 1.0.3
// @description To avoid copying the avatar email address in OpenAI ChatGPT's chatroom.
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/463664/Avoid%20Copy%20Self%20Email%20in%20OpenAI%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/463664/Avoid%20Copy%20Self%20Email%20in%20OpenAI%20ChatGPT.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    span > span + img[src*="avatar"][alt*="@"], span > span + img[src*="gravatar"][alt]{
        user-select: none !important;
        touch-action: none !important;
    }

    img[src*="https://s.gravatar.com/avatar/"] {
        user-select: none !important;
        touch-action: none !important;
    }
    
    div.h-6.w-6 > div > img[src*="https://s.gravatar.com/avatar/"] {
        transform: scale(8);
        transform-origin: 1px 1px;
        transform-origin: 0.2px 0.2px;
    }

    body main .select-none[class] {
        user-select: none !important;
    }
    
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
