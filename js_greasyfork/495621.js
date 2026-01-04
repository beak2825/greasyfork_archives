// ==UserScript==
// @name         2006-2022 reddit favicon
// @namespace    http:/reddit.com/
// @version      1.2
// @description  Script to change reddit favicon to the old icon what I base this off of https://greasyfork.org/en/scripts/481559-use-old-reddit-favicon great with old.reddit.com
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/495621/2006-2022%20reddit%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/495621/2006-2022%20reddit%20favicon.meta.js
// ==/UserScript==

let newfav = `https://b.thumbs.redditmedia.com/JeP1WF0kEiiH1gT8vOr_7kFAwIlHzRBHjLDZIkQP61Q.jpg`;

// "beyond this line" etc etc

window.addEventListener('load', () => {
var icon = [...document.querySelectorAll('link[rel~="icon"]')];
var copy = icon[0].cloneNode(true);
copy.href = newfav;
icon.map(x=>x.parentNode.removeChild(x));
document.head.appendChild(copy);
}, false);