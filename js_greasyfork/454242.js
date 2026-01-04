// ==UserScript==
// @name         scholar2readpaper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  jump from google scholar to readpaper
// @author       Yuhang
// @include      https://scholar.google.*/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/454242/scholar2readpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/454242/scholar2readpaper.meta.js
// ==/UserScript==

(function() {
var papers = document.querySelectorAll('.gs_ri');

console.log(papers)
papers.forEach(function(item){
    var title = item.querySelector("a").innerText;
    var newurl = 'https://readpaper.com/search/'+encodeURIComponent(title);
    var loc = item.getElementsByClassName("gs_ggs gs_fl");

    var obj1 = document.createElement("a");
    obj1.href = newurl;
    obj1.target = '_blank';
    obj1.appendChild(document.createTextNode('ReadPaper'));
	item.querySelector('.gs_ri .gs_fl').insertBefore(obj1,item.querySelector('.gs_ri .gs_fl .gs_or_mor'));
});
})();