// ==UserScript==
// @description:en infinity cookie(cookie clicker )
// @name         infinity cookie(cookie clicker)
// @name:en         infinity cookie(cookie clicker)
// @namespace    https://twitter.com/tato_glitch
// @version      2.3
// @description  infinity Cookie
// @match        http://orteil.dashnet.org/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/*
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://orteil.dashnet.org/cookieclicker/*
// @downloadURL https://update.greasyfork.org/scripts/392984/infinity%20cookie%28cookie%20clicker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392984/infinity%20cookie%28cookie%20clicker%29.meta.js
// ==/UserScript==
Game.lastClick = 0
setInterval(function(){
    Game.cookies = Infinity
}, 1); 