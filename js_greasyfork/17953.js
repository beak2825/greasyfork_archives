// ==UserScript==
// @name         琉璃神社
// @namespace    https://greasyfork.org/zh-CN/scripts/17953
// @version      0.5
// @description  系好安全带
// @include      *://hacg.riwee.com/wordpress/*
// @include      *://www.hacg.me/wordpress/*
// @include      *://www.hacg.in/wordpress/*
// @include      *://www.hacg.be/wordpress/*
// @include      *://www.hacg.lol/*
// @include      *://www.hacg.li/wp/*
// @include      *://*hacg.club/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17953/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/17953/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE.meta.js
// ==/UserScript==


//琉璃神社
(function () {
    var x = document.getElementsByClassName("entry-content")[0];
    var y = x.childNodes;
    for (var i = y.length - 1; i >= 0; i--) 
        if (z = y[i].textContent.match(/(\w{40})|(([A-Za-z0-9]{2,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,37})\b)/g)){
            for (j = 0; j < z.length; ++j) {
                console.log(z[j]);
                var hash = z[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim();
                if (hash.length >= 40) {
                    var go = "<a href='magnet:?xt=urn:btih:" + hash + "'> 磁力链</a>";
                    y[i].innerHTML = y[i].innerHTML.toString().replace(z[j], go);
                }
            }
        }
})();