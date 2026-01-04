// ==UserScript==
// @name        youtube_block_comments
// @namespace   https://catherine.v0cyc1pp.com/
// @include     https://www.youtube.com/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     0.1
// @grant       none
// @description Hide videos comments including specified words. （不愉快なコメントを非表示にする）
// @downloadURL https://update.greasyfork.org/scripts/390941/youtube_block_comments.user.js
// @updateURL https://update.greasyfork.org/scripts/390941/youtube_block_comments.meta.js
// ==/UserScript==


//================================
// Configurations
//   - specify texts you don't want to see.
var g_list = [
    "毛in濃すぎ",
    ];
//================================




function main() {

    //$("div.yt-lockup-content").each(function() {
    document.querySelectorAll("ytd-comment-thread-renderer").forEach(function(elem) {
        //var str = $(this).text();
        var str = elem.innerText;
        //console.log("str="+str);

        for (var i = 0; i < g_list.length; ++i) {
            var ngword = g_list[i];
            if (ngword == "") continue;

            ngword = ngword.replace(/^\s+|\s+$/g, "");

            var obj = new RegExp(ngword, "i");
            var index = str.search(obj);
            //var index = str.indexOf( ngword );
            if (index != -1) {
                //$(this).parent("div").parent("div").parent("li").hide();
                elem.style.display = "none";
                //console.log("str="+str);
            }
        }
    });
}

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

//var config = { attributes: true, childList: true, characterData: true, subtree:true }
var config = {
    childList: true,
    characterData: true,
    subtree: true
}

observer.observe(document, config);