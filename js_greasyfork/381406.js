// ==UserScript==
// @name         iBandaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽指定昵称的内容
// @author       You
// @match        http://i.jandan.net/*
// @match        https://i.jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381406/iBandaner.user.js
// @updateURL https://update.greasyfork.org/scripts/381406/iBandaner.meta.js
// ==/UserScript==


(function() {
var privCode = [
    "来点刺激的",
               ];
var comment = document.getElementsByClassName("commentlist");
var lis = comment[0].getElementsByTagName("li");
for (var i = lis.length - 1; i >= 0; --i) {
	var author = lis[i].getElementsByClassName("author");
	for (var j = 0; j < privCode.length; ++j) {
		if (lis[i].innerHTML.indexOf(privCode[j]) >= 0) {
            lis[i].getElementsByClassName("commenttext")[0].innerHTML = "<del>已屏蔽</del>";
            break ;
        }
    }
}
})();