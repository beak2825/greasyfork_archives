// ==UserScript==
// @name         Reddit cracktorio
// @namespace    Danielv123
// @version      1.0
// @description  Makes the subreddit title more accurate
// @author       You
// @match        https://www.reddit.com/r/factorio*
// @match        http://www.reddit.com/r/factorio*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22844/Reddit%20cracktorio.user.js
// @updateURL https://update.greasyfork.org/scripts/22844/Reddit%20cracktorio.meta.js
// ==/UserScript==

document.querySelector("#header-bottom-left > span > a").style.backgroundImage = 'url("https://i.imgur.com/Ndte8GT.png")';
document.querySelector("#header-bottom-left > span > a").style.backgroundSize = '440px 80px';
document.querySelector("#header-bottom-left > span > a").style.top = '-20px';
