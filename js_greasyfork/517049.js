// ==UserScript==
// @name         文学城论坛用户屏蔽
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  根据发帖用户id，屏蔽文学城帖子或者删除帖子
// @author         svscholar
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include        https://bbs.wenxuecity.com/*
// @licence        freeware
// @downloadURL https://update.greasyfork.org/scripts/517049/%E6%96%87%E5%AD%A6%E5%9F%8E%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517049/%E6%96%87%E5%AD%A6%E5%9F%8E%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
 
 
 
var blockedList=[ 
    "id1",
    "id2",
    "id3"
];

// 把被屏蔽人的帖子删除。
for (var i = 0; i < blockedList.length; i ++)
{
    var x = document.querySelectorAll('.b a[href$=\"'+encodeURI(blockedList[i])+'\"]');
    for (var j = 0; j < x.length; j++)
    {
        var y = x[j].parentElement.parentElement;
        y.remove();
    }
}

/* 
// 可以看到被屏蔽人在发帖，但是贴的内容被屏蔽。
for (var i = 0; i < blockedList.length; i ++)
{
    var x = document.querySelectorAll('.b a[href$=\"'+encodeURI(blockedList[i])+'\"]');
    for (var j = 0; j < x.length; j++)
    {
        var y = x[j].parentElement.parentElement.firstElementChild;
        y.removeAttribute("href");
        y.innerText = "已被拉黑";
    }
}
*/