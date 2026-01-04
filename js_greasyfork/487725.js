// ==UserScript==
// @name         Cookie clicker -- inf cookies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gives you infinite cookies in https://orteil.dashnet.org/cookieclicker/
// @author       LkTheMaster
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487725/Cookie%20clicker%20--%20inf%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/487725/Cookie%20clicker%20--%20inf%20cookies.meta.js
// ==/UserScript==



setInterval(function(){
    window.Game.cookies = Infinity
}, 1);