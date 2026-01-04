// ==UserScript==
// @description:en doeng cookie clicker )
// @name         doeng cookie clicker)
// @namespace doeng
// @name:en         doeng cookie clicker)
// @version      many cookie
// @description  infinity Cookie
// @match        http://orteil.dashnet.org/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/*
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://orteil.dashnet.org/cookieclicker/*
// @downloadURL https://update.greasyfork.org/scripts/474622/doeng%20cookie%20clicker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474622/doeng%20cookie%20clicker%29.meta.js
// ==/UserScript==
Game.lastClick = 0
setInterval(function(){
    Game.cookies = 1000000000
}, 1);