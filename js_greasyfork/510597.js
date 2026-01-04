// ==UserScript==
// @name         Script Kid Theme
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  Windows!
// @author       Zee
// @match        https://toonio.ru/*
// @match        https://*.toonio.ru/*
// @icon         https://www.pngall.com/wp-content/uploads/3/Anonymous-Hacker-PNG-Free-Download.png
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/510597/Script%20Kid%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/510597/Script%20Kid%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
.toony img[src="/img/paint.webp?v=943"] {
  content:url("https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-wearing-jacket-hoodie-in-anonymous-hacker-theme-png-image_9949749.png");
}
.username.user {
    background-color: #07660e;
}
body {
    background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/cc/Digital_rain_animation_medium_letters_shine.gif) !important;
    backdrop-filter: blur(3px);
    --main: #0aa300 !important;
    --main-lighter: #64ff51 !important;
}
p, li, label, a, b, input, i, textarea, span.description {
    font-family: unset;
}
.title a, a.nav {
    font-family: unset;
}
.header a.menu, .header a.item, .header a.logo {
    font-family: unset;
}
.title, .header, .footer_section, .container.watch, .categories.notifications {
    background: unset !important;
    backdrop-filter: unset !important;
}
body, .draw {
    --outline-size: 2px !important;
    --border-radius: 0px !important;
    --border-radius-small: 7px !important;
    --toon: black !important;
    --block-shadow: rgba(0, 0, 0, 0.1) 0px 2px 3px, rgba(0, 0, 0, 0.1) 0px 8px 12px;
    --header-shadow: rgba(0, 0, 0, 0.1) 0px 3px 5px, rgba(0, 0, 0, 0.05) 0px 10px 14px;
    --inset-shadow: rgba(0, 0, 0, 0.082) 0px -10px 20px 0px inset;
    --comment-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px, rgba(0, 0, 0, 0.1) 0px 4px 8px;
    --outline: #00ff14 !important;
    --outline-darker: #00c200 !important;
    --outline-dark: #00ff14 !important;
    --outline-transparent: rgba(179, 179, 179, .5);
    --outline-dark-transparent: rgba(0, 0, 0, .15);
    --background: black !important;
    --window: black !important;
    --transparent-editor: rgb(0 0 0 / 0%) !important;
    --timeline-background: black !important;
    --timeline-layer: black !important;
    --layer-1: black !important;
    --layer-2: black !important;
    --layer-3: black !important;
    --layer-4: black !important;
    --layer-5: black !important;
    --layer-6: black !important;
    --title: #e4e4e4;
    --selected: #E2E2E2;
    --hover: #00c200 !important;
    --transparent: rgba(255, 255, 255, .9);
    --transparent-2: unset !important;
}
.toon {
    background-color: var(--toon);
    border: var(--outline-size) solid #00ff14;
}
a.nav {
    opacity: .6;
    display: inline-block;
    /* font-size: 1.1em; */
    margin: 0 .25em;
    padding: 0.45em 0.65em;
    border-radius: unset;
    transition: opacity .1s ease, background-color .1s ease, color .1s ease;
    user-select: none;
    cursor: pointer;
    vertical-align: middle;
    text-wrap: nowrap;
}
.avatar, .autosave_screenshot {
    /* object-fit: cover; */
    border-radius: unset;
    border: var(--outline-size) solid var(--outline);
    box-sizing: unset;
    aspect-ratio: 1280 / 720;
    vertical-align: unset;
}
.notification, .mini_comment, .autosave_card {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-gap: 1em;
    align-items: center;
    border: var(--outline-size) solid rgb(0 255 20);
    border-radius: unset;
    background-color: black;
    padding: 0.75em;
    min-height: 50px;
    text-align: left !important;
    box-sizing: border-box;
    transition: box-shadow .1s ease;
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