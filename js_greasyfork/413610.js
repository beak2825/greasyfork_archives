// ==UserScript==
// @name         优书网搜索页屏蔽来自飞卢的小说
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.2.3
// @description  根据小说的标签来屏蔽飞卢小说，比如飞卢的同人，其标签一般是"同人小说"，那么添加这个标签到黑名单里就可以屏蔽飞卢的同人小说了。
// @author       仙圣
// @match        *://www.yousuu.com/search/*
// @include      *://www.yousuu.com/search/*
// @icon         http://www.yousuu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/413610/%E4%BC%98%E4%B9%A6%E7%BD%91%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD%E6%9D%A5%E8%87%AA%E9%A3%9E%E5%8D%A2%E7%9A%84%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/413610/%E4%BC%98%E4%B9%A6%E7%BD%91%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD%E6%9D%A5%E8%87%AA%E9%A3%9E%E5%8D%A2%E7%9A%84%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

//根据标签屏蔽
    var blackList = [
        "同人小说","玄幻奇幻","都市言情","科幻网游","恐怖灵异",
    ];
function 屏蔽某人(){
    var target = document.querySelectorAll("div.result-item-layout.full-mode-book");

    for (var i = 0;i < target.length; i++){
        if (target[i].querySelectorAll("p.bookinfo-tags>a")[0] != null){
            var node = target[i].querySelectorAll("p.bookinfo-tags>a")[0];

            for (var j = 0 ;j < blackList.length; j++){
                //在黑名单中则删掉
                if (node.innerHTML.indexOf(blackList[j]) > -1){
                    target[i].innerHTML='';
                }
            }
        }
    }
}
setInterval(function(){屏蔽某人();}, 2000);