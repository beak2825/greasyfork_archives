// ==UserScript==
// @name         虎扑帖子详情页屏蔽用户
// @namespace    hupu.com
// @version      0.3
// @description  在贴子里屏蔽某些人
// @author       仙圣
// @match        *://bbs.hupu.com/*
// @icon         none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463774/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85%E9%A1%B5%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/463774/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85%E9%A1%B5%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

//屏蔽词列表。
//屏蔽词的双引号为英文半角引号，逗号也是，请勿忘记加逗号。
    var blackList = [
    '和洗脑营销斗到底','成都人吊打北上光','Last成','玲珑心啊',
    ];
function 屏蔽回复(){
    var target = document.querySelectorAll("div.post-reply-list_post-reply-list-wrapper__o4_81");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("a.post-reply-list-user-info-top-name")[0] != null){
            var node = target[i].querySelectorAll("a.post-reply-list-user-info-top-name")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].remove();
                }
            }
        }
    }
}
function 屏蔽主贴(){
    var target2 = document.querySelectorAll("div.index_post-wrapper__IXkg_");

    for (var i = 0;i < target2.length; i++){
        if (target2[i].querySelectorAll("a.post-user_post-user-comp-info-top-name__N3D4w")[0] != null){
            var node2 = target2[i].querySelectorAll("a.post-user_post-user-comp-info-top-name__N3D4w")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node2.innerHTML.indexOf(blackList[j]) > -1){
                    target2[i].remove();
                }
            }
        }
    }
}
function 屏蔽查看评论里的回复(){
    var target3 = document.querySelectorAll("post-reply-detail-list_reply-detail-list__otjdd");

    for (var i = 0;i < target3.length; i++){
        if (target3[i].querySelectorAll("a.preply-detail-list-user-info-top-name")[0] != null){
            var node3 = target3[i].querySelectorAll("a.reply-detail-list-user-info-top-name")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //用户名在黑名单中则删掉
                if (node3.innerHTML.indexOf(blackList[j]) > -1){
                    target3[i].remove();
                }
            }
        }
    }
}

setInterval(function(){屏蔽回复();}, 2000);
setInterval(function(){屏蔽主贴();}, 2000);
setInterval(function(){屏蔽查看评论里的回复();}, 2000);