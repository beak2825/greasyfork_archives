// ==UserScript==
// @name     修改title-888051
// @version  2.3
// @description   修改title
// @grant    none
// @match    https://cnki.net/*
// @require  https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @namespace https://greasyfork.org/users/824980
// @downloadURL https://update.greasyfork.org/scripts/433874/%E4%BF%AE%E6%94%B9title-888051.user.js
// @updateURL https://update.greasyfork.org/scripts/433874/%E4%BF%AE%E6%94%B9title-888051.meta.js
// ==/UserScript==

(function(){
	console.log("start");
	var name = $(".unit-box1 h4").html();
    console.log(name);
    $("title").html(name);
})()