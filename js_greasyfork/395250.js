// ==UserScript==
// @name        google_http_warning2
// @namespace   https://catherine.v0cyc1pp.com/
// @match       https://www.google.co.jp/search?*
// @match       https://www.google.com/search?*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     0.8
// @grant       none
// @description Google検索結果でhttpは警告色で目立つようにする。（新デザイン用2023.3.5）
// @downloadURL https://update.greasyfork.org/scripts/395250/google_http_warning2.user.js
// @updateURL https://update.greasyfork.org/scripts/395250/google_http_warning2.meta.js
// ==/UserScript==

console.log("google_http_warning2 start");


function sub() {

    // URL行
    document.querySelectorAll("cite").forEach(function(elem) {
        var parent4 = elem.parentNode.parentNode.parentNode.parentNode;
        //console.log("parent4=" + parent4);
        if ( parent == null ) {
            return;
        }

        var tagname = parent4.tagName;
        //console.log("tagname=" + tagname);
        
        if ( tagname != "A" ) {
            return;
        }
        

        var href = parent4.href;
        if (href == "") return;
        var index = href.indexOf("https");
        if (index == 0) return;
        elem.style.color = "#cc6600";
        elem.style.backgroundColor = "#eeeeee";


        // 子のspanも色変える。2023.3.5
        elem.querySelectorAll("span").forEach(function(magospan) {
            magospan.style.color = "#cc6600";
            magospan.style.backgroundColor = "#eeeeee";
        });

    });

}

function main() {
    sub();
}


main();


