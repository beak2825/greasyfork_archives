// ==UserScript==
// @name         Bandaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽指定防伪码的内容
// @author       You
// @match        http://jandan.net/*
// @match        https://jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381405/Bandaner.user.js
// @updateURL https://update.greasyfork.org/scripts/381405/Bandaner.meta.js
// ==/UserScript==


(function() {
var privCode = [
    "4cdd0baacc923f86466cdf78a0cd4e8687002a91", // 来点刺激的
    "619d84c246a65b845179c5444c59036301b089ee", // 来点刺激的
               ];
var comment = document.getElementsByClassName("commentlist");
var lis = comment[0].getElementsByTagName("li");
for (var i = lis.length - 1; i >= 0; --i) {
	var author = lis[i].getElementsByClassName("author");
	for (var j = 0; j < privCode.length; ++j) {
		if (author[0].innerHTML.indexOf(privCode[j]) >= 0) {
			author[0].nextElementSibling.innerHTML = "<del>已屏蔽</del>";
            break ;
        }
    }
}
})();