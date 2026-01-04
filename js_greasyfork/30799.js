// ==UserScript==
// @name         优书网刷屏用户屏蔽脚本
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.2.2
// @description  如果有用户在发现页面使用“待看”、“mark”、“未看”等毫无营养的词大量刷屏，就可以复制他的ID到屏蔽词列表屏蔽他。
// @author       仙圣
// @match        *://www.yousuu.com/explore
// @include      *://www.yousuu.com/explore
// @icon         http://www.yousuu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/30799/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%88%B7%E5%B1%8F%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/30799/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%88%B7%E5%B1%8F%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
        "franklin223",
    ];

function 屏蔽某人(){
    var target = document.querySelectorAll("div.BookCommentItem");
    console.log("优书网刷屏用户屏蔽:");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("div.comment-author-info>p")[0] != null){
            var node = target[i].querySelectorAll("div.comment-author-info>p")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                    console.log(node);
                }
            }
        }
    }
}

setInterval(function(){屏蔽某人();}, 2000);