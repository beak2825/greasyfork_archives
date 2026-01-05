// ==UserScript==
// @name         iogames.space Redirect
// @version      1.3
// @description  Redirects games from iogames.space to thier source websites
// @author       someRandomGuy
// @match        *://iogames.space/*
// @grant        none
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/30266/iogamesspace%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/30266/iogamesspace%20Redirect.meta.js
// ==/UserScript==
var a=document.getElementsByTagName("iframe")[0];
a && !a.src.startsWith(location.origin) && location.replace(a.src);