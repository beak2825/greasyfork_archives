// ==UserScript==
// @name         优书网傻逼屏蔽
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.3
// @description  屏蔽傻逼
// @author       仙圣
// @match        *://www.yousuu.com/book/*
// @include      *://www.yousuu.com/book/*
// @icon         http://www.yousuu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/373901/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%82%BB%E9%80%BC%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/373901/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%82%BB%E9%80%BC%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


(function(){
//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
       "例子1","例子2"

    ];

function 屏蔽傻逼(){

    var target = document.querySelectorAll("div.BookCommentItem");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("div.comment-author-info>p")[0] != null){
            var node = target[i].querySelectorAll("div.comment-author-info>p")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                }
            }
        }
    }

        var target2 = document.querySelectorAll("div.ReplyItemWrap");

    for (var i2 = 0;i2 < target2.length; i2++){
        if (target2[i2].querySelectorAll("div.comment-author-info>p")[0] != null){
            var node2 = target2[i2].querySelectorAll("div.comment-author-info>p")[0];

            for (var j2 = 0 ;j2 < blackList.length; j2++){
                //用户名在黑名单中则删掉
                if (node2.innerHTML.indexOf(blackList[j2]) > -1){
                    target2[i2].remove();
                }
            }
        }
    }

}
setInterval(屏蔽傻逼, 2000);
})();