// ==UserScript==
// @name         巴哈姆特調整檢視回覆留言
// @version      2024-07-26
// @description  點開來才能看到回覆的訊息？不需要，只要將游標移上去就可以看到留言！
// @author       Peugin_
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=f31033103
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @require      https://unpkg.com/popper.js@1
// @require      https://unpkg.com/tippy.js@5
// @resource     TIPPY_LIGHT_THEME https://unpkg.com/tippy.js@5/themes/light.css
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449342/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%AA%BF%E6%95%B4%E6%AA%A2%E8%A6%96%E5%9B%9E%E8%A6%86%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/449342/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%AA%BF%E6%95%B4%E6%AA%A2%E8%A6%96%E5%9B%9E%E8%A6%86%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    //避免重複查詢，浪費資源
    const replyMap = new Map();
    GM_addStyle(GM_getResourceText("TIPPY_LIGHT_THEME"));

    console.info('[BahaFastViewReplay] Start');

    //對初始留言的回應新增監聽器
    addReplyMouseoverListener(document);

    //對整個留言區做監聽，當展開/收縮留言時巴哈會重新建立元素，這時候我們也需要重新建立相對應的監聽器
    document.querySelectorAll("[id^=Commendlist]").forEach(commentList => {
        let observer = new MutationObserver(mutations => {
            addReplyMouseoverListener(mutations[0].target);
        }).observe(commentList, {childList: true});
    });

    console.info('[BahaFastViewReplay] End');



    //對有回覆的留言新增監聽器
    function addReplyMouseoverListener(node) {
        let commentEles = new Set();

        node.querySelectorAll('.reply-content a[href^="javascript:Forum.C.openCommentDialog"]').forEach(replyEle => {
            let commentEle = replyEle.closest(".c-reply__item");
            if(!commentEles.has(commentEle)) {
                addReplyTooltip(commentEle);
            }
        });
    };

    //對該回覆新增 tooltip
    function addReplyTooltip(commentEle) {
        commentEle.querySelectorAll('a[href^="javascript:Forum.C.openCommentDialog"]').forEach(replyEle => {
            let bsn = replyEle.getAttribute("href").match(/\d+/g)[0];
            let snB = replyEle.getAttribute("href").match(/\d+/g)[1];
            let snC = replyEle.getAttribute("href").match(/\d+/g)[2];

            getReplyApiEle(bsn,snB,snC).then(replyApiEle => {
                replyEle.setAttribute("data-placement", "top");
                replyEle.setAttribute("data-toggle", "tooltip");
                replyEle.setAttribute("data-tooltipped", "");
                replyEle.setAttribute("data-tippy-content", `<div class="dialogify" style="display: contents; text-align:left;"><div class="dialogify__body">${replyApiEle}</div></div>`);

                replyEle.addEventListener('mouseover', () => showReplyTooltip(replyEle));
            });
        });
    }

    //顯示回覆的 tooltip
    function showReplyTooltip(replyEle) {
        tippy(replyEle, {
            maxWidth: 560,
            interactive: true,
            appendTo: document.body,
            theme: document.querySelector("html").dataset.theme === undefined ? 'light' : 'dark',
            onShow(instance) {
                instance.setContent(instance.reference.dataset.tippyContent);
                Forum.C.commentFormatter(instance.popper.querySelector("span"));
        }});
    }

    //回覆 API，回傳組裝好的 html 元素
    function getReplyApiEle(bsn,snB,snC) {
        return new Promise((resolve,reject) => {
            if(!replyMap.has(snC)) {
                return fetch(`https://api.gamer.com.tw/forum/v1/comment_get.php?bsn=${bsn}&snB=${snB}&snC=${snC}&type=pc`, {
                    credentials: "include"
                }).then(res => {
                    return res.json().then(json => {
                        replyMap.set(snC, json.data.comment.html);
                        return resolve(replyMap.get(snC));
                    });
                });
            }

            return resolve(replyMap.get(snC));
        });
    }
})();