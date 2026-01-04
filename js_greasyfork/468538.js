// ==UserScript==
// @name     Less Blue Blue's News
// @namespace https://www.bluesnews.com
// @description Makes Blue's News a little easier on the eyes
// @include https://www.bluesnews.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version  1
// @downloadURL https://update.greasyfork.org/scripts/468538/Less%20Blue%20Blue%27s%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/468538/Less%20Blue%20Blue%27s%20News.meta.js
// ==/UserScript==

$("a").attr("style", "color:#FFFFFF");
$("body").attr("style", "background-color:#36393e");
$(".gutter-bottom").attr("style", "border:solid;border-color:FFFFFF;border-radius:5px;padding-left:10px;padding-bottom:10px");