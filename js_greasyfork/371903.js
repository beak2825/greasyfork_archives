// ==UserScript==
// @name         Hentai-Foundry.com - Stories reading help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to make reading story on Hentai-Foundry.com easier
// @author       Fiduciam
// @match        *://www.hentai-foundry.com/stories/user/*/*/*/*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371903/Hentai-Foundrycom%20-%20Stories%20reading%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/371903/Hentai-Foundrycom%20-%20Stories%20reading%20help.meta.js
// ==/UserScript==

GM_addStyle ( `
.ui-dialog-content,.boxbody {
/* The left and right margin, px and % can be used */
padding: 5% 20%;

/*The size of the text */
font-size: 150%;
}
`);