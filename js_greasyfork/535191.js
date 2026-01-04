// ==UserScript==
// @name         zhihu blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  使用黑名单过滤知乎
// @author       You
// @match        https://www.zhihu.com/*
// @match        zhihu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535191/zhihu%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/535191/zhihu%20blacklist.meta.js
// ==/UserScript==

function removeVideo()
{
    var elements = document.querySelectorAll('div.ContentItem.ZVideoItem');
    elements.forEach((item)=>{
        console.log("remove video",item);
        item.parentElement.remove(item);
    });
    var elements_faked_as_answer = document.querySelectorAll('div.VideoAnswerPlayer');
    elements_faked_as_answer.forEach((item)=>{
        console.log("remove video",item);
        item.parentElement.remove(item);
    });
}

function removeBlackListItem()
{
    var blacklist = [
        "财富",
        "大S",
        "大s",
        "网红",
        "演唱会",
    ];
    var elements = document.querySelectorAll('[data-za-detail-view-element_name="Title"]');
    elements.forEach((item)=>{
        //console.log(item.textContent);
        var inblacklist = false;
        for(var i=0;i<blacklist.length;i++)
        {
            if(item.textContent.includes(blacklist[i]))
            {
                inblacklist = true;
                break;
            }
        }
        if(inblacklist)
        {
            //remove this item
            var node = item.parentElement.parentElement.parentElement;
            node.parentElement.remove(node);
            console.warn("删除:"+item.textContent);
        }
    })
}

function removeMessage()
{
    var elements = document.querySelectorAll('div.AppHeader-userInfo');
    elements.forEach((item)=>{
        item.parentElement.remove(item);
    });
}

let idx = 0;
function removeAll()
{
    document.title = "乎知";
    removeMessage();
    removeVideo();
    removeBlackListItem();
    console.log(idx++);

}
(function() {
    'use strict';
    console.log("start...");
    // Your code here...
    setInterval(removeAll,5000);

    console.log(idx++);
})();