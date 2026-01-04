// ==UserScript==
// @name         Krunker.io ESP [Currently Outdated]
// @namespace    https://greasyfork.org/en/users/817964
// @homepage     https://www.patreon.com/tech2survive
// @version      outdated - 3.7
// @description  Simple ESP script for krunker.io (featuring AD-block enhancer)
// @author       Hidden_X
// @include      *://krunker.io/*
// @include      *browserfps.com*
// @exclude      *://krunker.io/games.html
// @exclude      *://krunker.io/social.html*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/18490-ads-dom-remover-runner/code/Ads%20DOM%20Remover%20Runner.js?version=983896
// @license      GNU General Public License v2.0
// @donate       https://www.patreon.com/tech2survive
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432803/Krunkerio%20ESP%20%5BCurrently%20Outdated%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/432803/Krunkerio%20ESP%20%5BCurrently%20Outdated%5D.meta.js
// ==/UserScript==

// ESP code
Object.defineProperty(Object.prototype, 'cnBSeen', {value: true, enumerable: false}); // "cnBSeen" current nametags variable

// UI elements
const titles = ["Krunker | Simple ESP", "Made by Hidden_X"];
let i = 0;

setInterval(() => {
    i = i % 2; // <-- number of titles
    document.title = titles[i];
    i++;
}, 1250); // <-- delay between each title (ms)




/*
Developed by Hidden_X
    - on behalf of Tech2Survive

This is an open-source and copyright-free project. You can use and modify it as you wish.
Warning: Any attempts of reuploading it without permission from the original creator (Hidden_X) will be taken down by GreasyFork as it goes against it's TOS!

· Copyright is for cowards ·

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Consider Donating: https://www.patreon.com/tech2survive
Thank you :)
*/