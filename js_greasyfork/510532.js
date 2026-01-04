// ==UserScript==
// @name Toonio Space Theme
// @namespace http://tampermonkey.net/
// @version 2024-09-28
// @description Поехали!
// @author Zee
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/510532/Toonio%20Space%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/510532/Toonio%20Space%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `(function() {
let css = \`
.title h1 {
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 1.3em;
    padding: 0.284em 0.55em;
    -webkit-text-stroke-width: 0.9px;
    -webkit-text-stroke-color: #00fff3;
    text-decoration: none;
}
a {
    -webkit-text-stroke-width: 0.9px;
    -webkit-text-stroke-color: #00fff3;
    text-decoration: none;
}
p, li, label, a, b, h1, h2, h3, i {
    color: #ffffff;
    text-size-adjust: none;
}
body {
    background-image: url(https://i.pinimg.com/originals/04/9c/94/049c943e88395cbc8dde48a79959cd81.gif) !important;
    --main: #3b9eff !important;
    --main-lighter: #9bfaff !important;
}
.title, .header, .footer_section, .container.watch, .categories.notifications {
    background: rgb(21 107 157 / 37%) !important;
    /* backdrop-filter: blur(6px); */
}
.title_bro {
    background: rgb(22 124 183 / 22%) !important;
}
.container.filled {
    background-color: #0089ff2b;
    padding: 1em;
}
body, :root {
    --toon: #176ca58a !important;
    }
.title, .header, .footer_section, .container.watch, .categories.notifications {
    backdrop-filter: none !important;
}
.avatar, .autosave_screenshot {
    border: none;
}
.notification, .mini_comment, .autosave_card {
    background-color: #2073c91c;
}
input, textarea, select {
    background-color: #a0b9ff14;
    color: #000000;
    outline: none;
    border: none;
}
.container {
    color: #9be2ff;
}

.com {
    background: #07203bb0;
    color: #9be2ff;
}
.dropdown .categories {
    position: absolute;
    top: 28px;
    min-width: 250px;
    z-index: 1;
    background-color: #0d688b9e;
    border-radius: var(--border-radius);
    box-shadow: var(--block-shadow);
    opacity: 0;
    visibility: hidden;
    transition: visibility .1s linear, opacity .1s linear;
    padding: .5em;
}

.custom_icon {
    background-color: #00f3ff;
}

body, :root {
    --outline-size: none !important;
    --selected: #3b9eff !important;
    --transparent-editor: rgb(0 24 45 / 63%) !important;
    --window: #0e3649a3 !important;
    --background: none;
    --outline: #0089ff !important;
    --timeline-background: #3290d39e !important;
    --timeline-layer: #3d82a3a3 !important;
    --toon: #0d688b9e !important;
}
#frame_tools .slider {
    background-color: #00000000;
}
\`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
