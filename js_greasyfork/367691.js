// ==UserScript==
// @name         Google_HightLight
// @namespace    http://tampermonkey.net
// @run-at       document-body
// @version      1.3
// @description  对Google搜索结果进行高亮
// @author       cweijan
// @include      https://www.google.co*/search*
// @downloadURL https://update.greasyfork.org/scripts/367691/Google_HightLight.user.js
// @updateURL https://update.greasyfork.org/scripts/367691/Google_HightLight.meta.js
// ==/UserScript==

(function() {
    var keyWords = document.getElementById("lst-ib").value;
    var searchList = document.querySelectorAll(".g,.r,a");
    searchList.forEach(function(index) {
        var text =index.innerHTML;
        for (var i = 0; i < keyWords.length; i++) {
            var keyWord = keyWords.charAt(i);
            if(keyWord.charCodeAt()<128){
                continue;
            }
            text = text.replace(new RegExp(keyWord,'g'), "<em>" + keyWord + "</em>");
        }
        index.innerHTML=text;
    });
})();

