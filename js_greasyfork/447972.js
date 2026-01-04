// ==UserScript==
// @name         Nitro Type - Racing Styles
// @version      0.1.0
// @description  Custom Styles for Race Track.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/447972/Nitro%20Type%20-%20Racing%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/447972/Nitro%20Type%20-%20Racing%20Styles.meta.js
// ==/UserScript==

const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`
.dash-copy {
    font-size: 12px;
}`))
document.head.appendChild(style)
