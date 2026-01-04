// ==UserScript==
// @name         Use old reddit favicon
// @namespace    http:/reddit.com/
// @version      1.0
// @description  Script to change reddit favicon to the old icon
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/481559/Use%20old%20reddit%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/481559/Use%20old%20reddit%20favicon.meta.js
// ==/UserScript==

let newfav = `data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAQlBMVEVHcEz/RQD/RQD/QgD/RQD/RQD/RQD/RQD/RQD/RQD/////MgD/OgD/s5//z8P/a0T/5d3/VyH/iGr/qJP/mYD/+vcCA1U1AAAACnRSTlMAJP//y5WUn+ElsgVe0gAAAJFJREFUGJVtT1sOwyAMy0JpIa/C2t3/qjNQaT+zkMAmD5sIqLkwl1zpwcEPjsW3ScxMefv9m7u3WVNXdXJ9Q+BKGYRN+62miXmnMvg7WotT8SzE6ZQHHzkTL+HuIv2SKRTWkHCRC5eiJWOCSJvnNgzFWrtQ4iGuY+0wZt0jHFuWeVhPpmpwsf0PR/TaR/x9xv8CYoYGnu4Mr1kAAAAASUVORK5CYII=`;

// "beyond this line" etc etc

window.addEventListener('load', () => {
var icon = [...document.querySelectorAll('link[rel~="icon"]')];
var copy = icon[0].cloneNode(true);
copy.href = newfav;
icon.map(x=>x.parentNode.removeChild(x));
document.head.appendChild(copy);
}, false);