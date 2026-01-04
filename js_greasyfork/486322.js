// ==UserScript==
// @name         隐藏知乎评论
// @version      0.0.4
// @author       wzj042
// @description  隐藏低信息量的评论，如单纯表情类评论
// @icon         https://picx.zhimg.com/v2-abed1a8c04700ba7d72b45195223e0ff_l.jpg?source=d16d100b
// @match        *://*.zhihu.com/*
// @license      MIT
// @namespace    https://github.com/wzj042/hide-zhihu-comment
// @supportURL   https://github.com/wzj042/hide-zhihu-comment
// @homepageURL  https://github.com/wzj042/hide-zhihu-comment
// @downloadURL https://update.greasyfork.org/scripts/486322/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486322/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const strictBan = [
        // 严格匹配，相等即隐藏
        'mark',
        'Mark',
        '订阅'
    ]

    const looseBan = [
        // 宽松匹配，包含关键词即隐藏
        // 隐藏表情
        [5,'[尴尬]'],
        // 小于5个字，出现相应关键词时即隐藏
        '追更',
    ]

    // 最短评论长度限制，小于或等于该长度的评论将被隐藏
    const banLenLimit = 3;

    // 数组存储对应功能开关
    let funcSwitch = {
        strictBan: true,
        looseBan: true,
        banLenLimit: true,
        pureImgBan: true
    }

    // 后续内容
    const banSvg = `<svg width="16" height="16" viewBox="0 0 24 24" class="ZDI ZDI--PowerFill24" fill="currentColor"><path fill-rule="evenodd" d="M13.25 3.25a1.25 1.25 0 1 0-2.5 0V11a1.25 1.25 0 1 0 2.5 0V3.25ZM4.84 13.372A7.276 7.276 0 0 1 7.735 6.36a1.25 1.25 0 0 0-1.472-2.02 9.776 9.776 0 0 0-.597 15.32 9.741 9.741 0 0 0 12.666 0 9.776 9.776 0 0 0-.597-15.32 1.25 1.25 0 0 0-1.472 2.02 7.277 7.277 0 0 1 .444 11.4 7.242 7.242 0 0 1-9.416 0 7.268 7.268 0 0 1-2.453-4.388Z" clip-rule="evenodd"></path></svg>`
    const tempBan = `<button type="button" class="Button Button--plain Button--grey Button--withIcon Button--withLabel " style="transform: none;"><span style="display: inline-flex; align-items: center;">​${banSvg}</span>这次不看</button>`


    // 定时检查当前展开评论列表
    setInterval(function () {
        let curCommentList = document.querySelectorAll('.CommentContent');
        // 如果内容纯粹为img标签
        for (let i = 0; i < curCommentList.length; i++) {
            let curComment = curCommentList[i];
            let commentDiv = curComment.parentElement.parentElement.parentElement;
            if (funcSwitch.pureImgBan && curComment.querySelector('img')) {
                let formart = curComment.querySelector('img').outerHTML;
                // 如果评论内容为纯图片
                if (formart === curComment.innerHTML) {
                    commentDiv.style.display = 'none';
                }
            }
            let text = curComment.innerText;

            let textLen = getTextLen(curComment);


            if (funcSwitch.banLenLimit && textLen <= banLenLimit) {
                commentDiv.style.display = 'none';
            }

            // 获取文本内容，匹配筛选关键词
            if (funcSwitch.strictBan) {
                for (let j = 0; j < strictBan.length; j++) {
                    if (text === strictBan[j]) {
                        commentDiv.style.display = 'none';
                    }
                }
            }
            if (funcSwitch.looseBan) {
                for (let j = 0; j < looseBan.length; j++) {
                    // 如果元素为字符串，直接判断
                    console.log(looseBan[j], text.indexOf(looseBan[j]) !== -1, text);
                    if (typeof looseBan[j] === 'string' && text.indexOf(looseBan[j]) !== -1) {
                        commentDiv.style.display = 'none';
                        continue;
                    }
                    // 如果元素为数组，拆分第一个为判断长度，第二个为文本
                    let { 0: len, 1: key } = looseBan[j];

                    if (textLen <= len && text.indexOf(key) !== -1) {
                        commentDiv.style.display = 'none';
                    }

                }
            }




        }
    }, 1000);

    function getTextLen(ele) {
        // 深拷贝文本，避免修改原文本
        var input = ele.innerHTML;

        // 有一定误差
        // 匹配HTML标签的正则表达式
        var htmlTag = /<[^>]*>/g;
        // 将所有HTML标签替换为一个特殊字符
        input = input.replace(htmlTag, '□');

        var chineseChar = /[\u4e00-\u9fa5]/g;
        // 匹配特殊字符的正则表达式
        var specialChar = /□/g;
        // 匹配字母、数字、标点的正则表达式
        var otherChar = /[a-zA-Z0-9\p{P}]/gu;

        var chineseCharCount = (input.match(chineseChar) || []).length;
        var specialCharCount = (input.match(specialChar) || []).length;
        var otherCharCount = (input.match(otherChar) || []).length;

        return chineseCharCount + specialCharCount + otherCharCount;
    }
})();