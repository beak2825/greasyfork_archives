// ==UserScript==
// @name         Discord Text Highlight Remover
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Discord theme
// @author       Aristo-TTL
// @icon
// @match        *://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422356/Discord%20Text%20Highlight%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/422356/Discord%20Text%20Highlight%20Remover.meta.js
// ==/UserScript==

var Primary = "#373A40"; // #373A40
var Secondary = "#303237"; // #303237
var Tertiary = "#FFFFFF"; // #FFFFFF"
var Quaternary = "#EBEDEF"; // #EBEDEF

GM_addStyle(`
.theme-dark {
   --background-primary: ${Primary};
   --background-secondary: ${Secondary};
   --background-message-hover: ${Primary};
}
.theme-light {
   --background-primary: ${Tertiary};
   --background-secondary: ${Quaternary};
   --background-message-hover: ${Tertiary};
}
`);