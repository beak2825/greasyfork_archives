// ==UserScript==
// @name         【自用】优书网动态去除黑名单用户，去除自己关注的人给别人点赞的动态
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.2.2
// @description  如果有用户在发现页面使用“待看”、“mark”、“未看”等毫无营养的词大量刷屏，就可以复制他的ID到屏蔽词列表屏蔽他。
// @author       myself
// @match        *://www.yousuu.com/explore*
// @include      *://www.yousuu.com/explore*
// @icon         http://www.yousuu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/445737/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8A%A8%E6%80%81%E5%8E%BB%E9%99%A4%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%EF%BC%8C%E5%8E%BB%E9%99%A4%E8%87%AA%E5%B7%B1%E5%85%B3%E6%B3%A8%E7%9A%84%E4%BA%BA%E7%BB%99%E5%88%AB%E4%BA%BA%E7%82%B9%E8%B5%9E%E7%9A%84%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445737/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8A%A8%E6%80%81%E5%8E%BB%E9%99%A4%E9%BB%91%E5%90%8D%E5%8D%95%E7%94%A8%E6%88%B7%EF%BC%8C%E5%8E%BB%E9%99%A4%E8%87%AA%E5%B7%B1%E5%85%B3%E6%B3%A8%E7%9A%84%E4%BA%BA%E7%BB%99%E5%88%AB%E4%BA%BA%E7%82%B9%E8%B5%9E%E7%9A%84%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==



//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
        "某个人的id","第二个人的id"
    ];


function 屏蔽某人(){
    var target = document.querySelectorAll("div.BookCommentItem:not(.checked)");
    console.log("优书网刷屏用户屏蔽:");
    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("div.comment-author-info>p")[0] != null){
            var node = target[i].querySelectorAll("div.comment-author-info>p")[0];
            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1 ){
                    target[i].remove();
                    console.log(node);
                    break;
                }
            }
            target[i].classList.add("checked");
        }
    }

    //去除动态点赞
    var feed = document.querySelectorAll("span.feed-from:not(.checked)");
    for(let i=0;i<feed.length; i++){
        if(feed[i].innerText.indexOf('点赞')!=-1){
            feed[i].parentNode.parentNode.remove();
        }else{
            feed[i].classList.add("checked");
        }
    }
}

setInterval(function(){屏蔽某人();}, 1000);