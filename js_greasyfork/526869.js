// ==UserScript==
// @name         Custom Font (Geoguessr)
// @namespace    alienperfect
// @version      1.0
// @description  Use your own font with CSS rules.
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526869/Custom%20Font%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526869/Custom%20Font%20%28Geoguessr%29.meta.js
// ==/UserScript==

// [1] Using custom fonts assumes that you have them installed on your system.

// [2] Replace "Roboto" with your own font if needed. If nothing changes and you're sure you've spelled the name of a font correctly
//     it might be due to browser fingerprinting protection. Look up a way to disable fingerprinting for language preferences in your browser.
//     This will reduce your privacy on the internet, though. If you're using Chrome/Edge you shouldn't have issues since they're not private anyway.

// [3] * {font-weight: 400 !important} makes the font thinner and easier to read, it works well with Roboto but if you don't need it, remove the line.

// [4] Technically you can add any CSS rules to this script besides changing font. I made it as a static configuration, it won't be updated.

GM_addStyle(`
* {font-family: Roboto !important}
* {font-weight: 400 !important}
`);
