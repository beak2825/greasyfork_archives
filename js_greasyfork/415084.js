// ==UserScript==
// @name         ニコニコ_マイページスタイル_1:1
// @namespace    https://twitter.com/TONoran0414
// @version      1.3.3
// @description  NicoNico_mypageStyle_1:1
// @author       You
// @match        https://www.nicovideo.jp/my*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415084/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3_%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB_1%3A1.user.js
// @updateURL https://update.greasyfork.org/scripts/415084/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3_%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB_1%3A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style")
    let styletext = [
        ".PageTopButtonContainer-pageTopButton{bottom:25px;right:25px;}",
        ".RightSideContainer{margin-left:325px;}",
        ".NicorepoTimeline-more{color:#828282;box-shadow:10px 10px 10px rgba(0,0,0,0.3);background-color:white;}",
        ".NicorepoTimeline-more:active{box-shadow:7px 7px 7px rgba(0,0,0,0.4)}",
        "body.BaseLayout{max-width:calc(100vw - 17px);min-width:calc(100vw - 17px);overflow-x:clip;}"
    ];
    console.log(styletext)
    styletext = styletext.join("\n")
    style.innerHTML = styletext;
    document.body.appendChild(style)
    // Your code here...
})();