// ==UserScript==
// @name        google_highlight
// @namespace   https://catherine.v0cyc1pp.com/
// @match       https://www.google.co.jp/search?*
// @match       https://www.google.com/search?*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     0.1
// @grant       none
// @description Google検索結果でwikipediaは優良サイトなので目立つようにする。
// @downloadURL https://update.greasyfork.org/scripts/462445/google_highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/462445/google_highlight.meta.js
// ==/UserScript==

console.log("google_highlight start");


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

        if ( href.indexOf("wikipedia.org") == -1 ) return;

        elem.style.color = "#007f00";
        elem.style.backgroundColor = "#eeeeee";


        // 子のspanも色変える。2023.3.5
        elem.querySelectorAll("span").forEach(function(magospan) {
            magospan.style.color = "#007f00";
            magospan.style.backgroundColor = "#eeeeee";
        });

    });

}

function main() {
    sub();
}


main();


