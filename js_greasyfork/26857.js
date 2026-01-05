// ==UserScript==
// @name         Nice Meme!
// @version      1.1
// @description  NiceMeme! Loop
// @author       DaCurse0
// @copyright    2016+, DaCurse0
// @match        http://niceme.me/
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/62051
// @downloadURL https://update.greasyfork.org/scripts/26857/Nice%20Meme%21.user.js
// @updateURL https://update.greasyfork.org/scripts/26857/Nice%20Meme%21.meta.js
// ==/UserScript==

$(function(){setInterval(function(){$.get("/",function(a){$("body").append(a),$("body").animate({scrollTop:$(document).height() + 2e3},1)})},1)});