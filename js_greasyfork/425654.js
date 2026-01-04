// ==UserScript==
// @name         javlib 将文章回复数放置第一列
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  将文章的回复人数提到标题前面, 顺带把所有免翻链接替换成javlibrary
// @author       qxin
// @match        *://*.o58c.com/*
// @match        *://*.e59f.com/*
// @match        *://*.k51r.com/*
// @match        *://*.g60y.com/*
// @match        *://*.javlib.com/*
// @match        *://*.javlibrary.com/*
// @require      https://greasyfork.org/scripts/447533-findandreplacedomtext-v-0-4-6/code/findAndReplaceDOMText%20v%20046.js?version=1067927
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/425654/javlib%20%E5%B0%86%E6%96%87%E7%AB%A0%E5%9B%9E%E5%A4%8D%E6%95%B0%E6%94%BE%E7%BD%AE%E7%AC%AC%E4%B8%80%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/425654/javlib%20%E5%B0%86%E6%96%87%E7%AB%A0%E5%9B%9E%E5%A4%8D%E6%95%B0%E6%94%BE%E7%BD%AE%E7%AC%AC%E4%B8%80%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pubgroup =  document.querySelector(".pubgroup")
    if(pubgroup){
        var tr = pubgroup.rows;
        for (var i = 0; i < tr.length; i++) {   // 将第三列的“回复数”提到第一列
            tr[i].insertBefore(tr[i].cells[2], tr[i].cells[0]);
        }
         for (var i = 0; i < tr.length; i++) {   // 将第四列的“发表时间”提到第一列
            tr[i].insertBefore(tr[i].cells[3], tr[i].cells[0]);
        }
    }

    var allHTML = document.querySelector("body");
    findAndReplaceDOMTextFun();
    function findAndReplaceDOMTextFun(){
        findAndReplaceDOMText(allHTML, {
            find:/(?<!(\w|-))(?:p42u|058c|e59f|k51r|g60y|javlib)\.com/gi,
            preset: 'prose', 
            forceContext: findAndReplaceDOMText.NON_INLINE_PROSE,   
            replace: function(portion) {
                return "javlibrary.com";
            }
        });
}
})();