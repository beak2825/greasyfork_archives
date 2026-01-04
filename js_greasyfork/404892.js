// ==UserScript==
// @name         iogames.space Redirect 2020
// @version      2.2
// @description  Redirects games from iogames.space to thier source websites
// @author       ARISTheGod
// @website      https://github.com/ARISTheGod
// @supportURL   https://github.com/ARISTheGod/iogames.space-redirect-2020/issues
// @match        http://iogames.space/*
// @match        https://iogames.space/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/404892
// @downloadURL https://update.greasyfork.org/scripts/404892/iogamesspace%20Redirect%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/404892/iogamesspace%20Redirect%202020.meta.js
// ==/UserScript==


// RUN AFTER 6s delay
setTimeout(function() {
var iframedatagamestring=document.getElementById("game_iframe_window");[0];
iframedatagamestring && !iframedatagamestring.src.startsWith(location.origin) && location.replace(iframedatagamestring.src);
}, 6000);