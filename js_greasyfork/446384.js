// ==UserScript==
// @name Discord Theme (Dark Blue)
// @description Comfy blue theme for Discord
// @version 1.0.1
// @namespace http://tampermonkey.net/
// @license G56XS
// @run-at document-start
// @include https://discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/446384/Discord%20Theme%20%28Dark%20Blue%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446384/Discord%20Theme%20%28Dark%20Blue%29.meta.js
// ==/UserScript==

(function() {
let css = `

.appMount-3lHmkl {
    background-image: url("");
    background-color: rgba(9, 24, 51, 0);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.theme-dark {
    --background-primary: rgba(9, 24, 51, .4);
    --background-secondary: rgba(0, 11, 30, .4);
    --background-tertiary: rgba(0, 11, 30, .4);
    --deprecated-panel-background: rgba(9, 24, 51, .4);
    --channeltextarea-background: rgba(19, 62, 124, .7);
    --background-secondary-alt: rgba(9, 24, 51, .7)

}
.theme-dark .container-1D34oG {
    background-color: rgba(9, 24, 51, .4)
}
.theme-dark .inset-3sAvek {
    background-color: rgba(19, 62, 124, .2);
}
.theme-dark .outer-1AjyKL.active-1xchHY, .theme-dark .outer-1AjyKL.interactive-3B9GmY:hover {
    background-color: rgba(9, 24, 51, .4)
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();