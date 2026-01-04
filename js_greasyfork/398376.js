// ==UserScript==
// @name         百度展开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fucking baidu, 手机浏览器自动展开全文，去除底部安装百度APP弹窗
// @author       None
// @match        *://*.baidu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398376/%E7%99%BE%E5%BA%A6%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/398376/%E7%99%BE%E5%BA%A6%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    function ad() {
        var child1 = document.getElementsByClassName("fold-results-style")[0];
        var child2 = document.getElementsByClassName("hint-fold-results-box")[0];
        if(child1) child1.parentNode.removeChild(child1);
        if(child2) child2.parentNode.removeChild(child2);

        var egg = document.getElementsByClassName("egg-bubble")[0];
        if(egg) egg.parentNode.removeChild(egg);

        var el = document.getElementById('page-copyright');
        var childs = el.childNodes;
        for(var i = childs.length - 1; i >= 3; i--) {
            el.removeChild(childs[i]);
        }
        //console.log(childs.length);
    }


    window.onload = function(){
        var page = document.getElementById("page-copyright");
        page.addEventListener('DOMNodeInserted', ad, false);
        ad();
        //console.log("fresh");
    };


    document.body.addEventListener('DOMNodeInserted', function(){
        var box = document.getElementById("popupLead");
        if(box){
            box.parentNode.removeChild(box);
            document.getElementById("se-bn").click();
        }
    }, false);
})();