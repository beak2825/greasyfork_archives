// ==UserScript==
// @name          快速发布
// @description   在 U2 种子详情页的某个位置加一个“快速发布”链接
// @version       0.91
// @namespace     https://greasyfork.org/users/12682
// @include       *://u2.dmhy.org/details.php?id=*
// @icon          https://u2.dmhy.org/favicon.ico
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/14037/%E5%BF%AB%E9%80%9F%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/14037/%E5%BF%AB%E9%80%9F%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

var bookmark1;
for (var i = 0; document.getElementsByTagName("a")[i].innerHTML.match("Unbookmarked") != "Unbookmarked" && document.getElementsByTagName("a")[i].innerHTML.match("Bookmarked") != "Bookmarked"; i++)
    bookmark1 = document.getElementsByTagName("a")[i+1];

var fabu = document.createElement("a");
fabu.innerHTML = '<a href="' + window.location.href + '" title="快速发布"><b>快速发布</b></a>' + ' | ';
bookmark1.parentNode.insertBefore(fabu, bookmark1);