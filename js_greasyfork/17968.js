// ==UserScript==
// @name         5336cf
// @namespace    https://greasyfork.org/zh-CN/scripts/17968
// @version      0.7
// @description  系好安全带
// @include      *://*www.5336cf.com/anime/*
// @include      *://*www.5336cf.com/comic/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17968/5336cf.user.js
// @updateURL https://update.greasyfork.org/scripts/17968/5336cf.meta.js
// ==/UserScript==

//5336cf
(function () {
    var x = document.getElementsByClassName("article-content")[0];
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