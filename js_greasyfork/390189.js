// ==UserScript==
// @name        twitter_instagram_show2_newdesign
// @namespace   https://catherine.v0cyc1pp.com/
// @include     https://twitter.com/*
// @exclude     https://twitter.com/i/cards/*
// @author      greg10
// @license     GPL 3.0
// @run-at      document-start
// @version     3.2
// @connect     www.instagram.com
// @connect     cdninstagram.com
// @connect     fbcdn.net
// @grant       GM_xmlhttpRequest
// @description Show Instagram images on your Twitter time line.（インスタ画像もタイムラインに表示する。）
// @downloadURL https://update.greasyfork.org/scripts/390189/twitter_instagram_show2_newdesign.user.js
// @updateURL https://update.greasyfork.org/scripts/390189/twitter_instagram_show2_newdesign.meta.js
// ==/UserScript==

console.log("twitter_instagram_show2_newdesign start");


function main() {

    document.querySelectorAll("a").forEach(function(elem) {
        //var str = $(this).attr('title');
        //console.log("main: forEach() start!");
        //var aaa = elem.getAttribute("href");
        //console.log("aaa="+aaa);
        /*
        var str = elem.getAttribute("title");
        console.log("str="+str);
        var text1 = elem.innerText;
        console.log("text1="+text1);
        if (str == null || str == undefined || str == "") {
            return;
        }

        if ( str.indexOf("https://www.instagram.com/p/") == -1 ) {
            return;
        }
        */
        var text1 = elem.innerText;
        //console.log("text1="+text1);
        if ( text1.indexOf("instagram.com/p/") == -1 ) {
            return;
        }
        console.log("text1="+text1);


        
        // titleが"https://instagram.com"の場合がある。この場合www.instagram.comへのリダイレクトになるので、GM_xmlhttpRequest()が301のリダイレクトページが返ってくるので、videosrc, imgsrcを取得できない。
        text1 = text1.replace(/\?.*/, "");

        var tmp = elem.getAttribute("myloaded");
        if (tmp == "done") {
            return;
        }

        elem.setAttribute("myloaded", "done");
        var origurl = text1;
        console.log("origurl="+origurl);
        var embedurl = origurl + "embed";

        var vid_container = document.createElement('iframe');
        vid_container.src = embedurl;
        vid_container.width = 400;
        vid_container.height = 500;
        vid_container.frameborder = 0;
        vid_container.scrolling = "no";
        elem.parentNode.appendChild(vid_container);

    });
}

main();

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

var config = {
    childList: true,
    subtree: true
};


observer.observe(document, config);