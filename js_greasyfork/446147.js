// ==UserScript==
// @name bili_rebuild
// @description b站评论过滤器
// @license MIT
// @namespace dreamcenter
// @version 3.1.0.3
// @match *://*.bilibili.com/video/*
// @match *://*.bilibili.com/opus/*
// @match *://space.bilibili.com/*/dynamic
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446147/bili_rebuild.user.js
// @updateURL https://update.greasyfork.org/scripts/446147/bili_rebuild.meta.js
// ==/UserScript==


/*******************************下方内容可以修改***************************************/
// 文本屏蔽
let banMap = [
    'test','随机','恶心','病','纯','ch','CH','op','策划'
];
// 等级可选项： level_0/level_1/level_2/level_3/level_4/level_5/level_6/level_h  其中h表示的是加闪电的六级号
let banLevel = [
    'level_0'
]
// 表情屏蔽：打开F12 > 鼠标右键表情 > 选择检查，此时定位到了元素， 查看alt属性值，复制中括号中内容
let banEmoji = [
    '呲牙'
]
// 屏蔽@某人：输入用户名即可，如果想要禁用所有的@某人，只要输入 "@" 即可
let banAt = [
    "LexBurner"
]

// 控制台日志模式，F12控制台日志记录被屏蔽的内容【注意，正式使用时，务必改成false，否则会影响性能】 [true/false]
let logMode = false
// 即将被屏蔽的内容用红字体，而不隐藏 [true/false]
let redLine = false

/*******************************下方内容不要修改***************************************/

const filterFunction = {
    bySpan (raw) {
        for(var key of banMap) {
            if (raw.includes(key)) return true;
        }
    },
    byImg (raw) {
        for(var key of banEmoji) {
            if (raw.includes(key)) return true;
        }
    },
    byAt (raw) {
        for(var key of banAt) {
            if (raw.includes(key)) return true;
        }
    }
}

function judgeIfBanned(raw) {
    // 获取完整文本
    const fullText = (raw.innerText || raw.textContent || '').trim();
    // 用正则找出目标回复人
    const replyMatch = fullText.match(/^回复\s*(@[^\s]+)\s*[:：]/);
    let targetUser = replyMatch ? replyMatch[1] : null;

    for (let node of raw.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 暂无此情形
        }
        if (node.tagName === 'SPAN') {
            const text = node.innerText;
            if (text && filterFunction.bySpan(text)) return true;
        }
        else if (node.tagName === 'IMG') {
            if (filterFunction.byImg(node.alt)) return true;
        }
        else if (node.tagName === 'A') {
            // data-type : search 关键词搜索 / link 链接地址 / mention @某人
            var type = node.dataset.type
            if (type == "mention") {
                const atText = node.innerText.trim();

                // 使用预计算的 targetUser 进行比对
                if (targetUser && targetUser === atText) {
                    targetUser = null; // 设置为null，这样正文不再做匹配判断
                    continue; // 跳过被回复者的检查
                }
                if (filterFunction.byAt(atText)) return true;
            }
            // 其它情况看是否有需求再加
        }
        // 其他标签
    }

    return false;
}

function judgeIfLevelBanned(levelImg) {
    for(var key of banLevel) {
        if (levelImg.includes(key)) return true;
    }
    return false;
}

(function() {
    'use strict';
    window.onload=function(){

        var startMark = false

        setInterval(function(){
            // 判断是否可以开始执行核心程序
            if (startMark){
                runCore();
            } else {
                // 判断节点是否渲染完毕
                startMark = document.querySelector("bili-comments") != null
            }
        },100)
    }



    function runCore (){
        // 获取整楼评论
        var reviews = document.querySelector("bili-comments").shadowRoot.querySelectorAll("#feed > bili-comment-thread-renderer");
        for(var review of reviews){
            // 判断该元素是否为null（可能元素还没渲染出来）

            // 检查楼主评论是否过滤过，过滤则不再计算
            if (review.getAttribute('filtered') == null){
                // 获取楼主评论
                var comment = review.shadowRoot.querySelector('#comment')
                // 获取楼主Lv等级
                var level = comment.shadowRoot.querySelector("#header > bili-comment-user-info").shadowRoot.querySelector("#user-level > img").src
                // 获取楼主评论内容
                var commentText = comment.shadowRoot.querySelector("#content > bili-rich-text").shadowRoot.querySelector("#contents");
                // 状态设置成已经过滤判断过
                review.setAttribute('filtered',true)
                // 过滤判断
                if(judgeIfLevelBanned(level) || judgeIfBanned(commentText)) {
                    if (logMode) console.log(commentText.innerText)
                    if (redLine) commentText.style.color = "red";
                    else review.style.display = "none";
                }
            }

            // 获取回复评论集
            var replies = review.shadowRoot.querySelector("#replies > bili-comment-replies-renderer").shadowRoot.querySelectorAll("#expander-contents > bili-comment-reply-renderer:not([filtered])")
            for(var reply of replies) {
                // 获取回复评论Lv等级
                var replyLevel = reply.shadowRoot.querySelector("#main > bili-comment-user-info").shadowRoot.querySelector("#user-level > img").src
                // 获取回复评论内容
                var replyCommentText = reply.shadowRoot.querySelector("#main > bili-rich-text").shadowRoot.querySelector("#contents");
                // 状态设置成已经过滤判断过
                reply.setAttribute('filtered',true)
                // 过滤判断
                if(judgeIfLevelBanned(replyLevel) || judgeIfBanned(replyCommentText)) {
                    if (logMode) console.log(replyCommentText.innerText)
                    if (redLine) replyCommentText.style.color = "red";
                    else review.style.display = "none";
                }
            }
        }
    }

})();