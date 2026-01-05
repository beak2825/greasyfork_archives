// ==UserScript==
// @name         仓库自动删除评论广告
// @namespace    moe.jixun.galacg-clean-comment
// @version      0.3
// @description  [管理辅助] 自动删除机器发的套路广告。
// @author       Jixun <https://jixun.moe/>
// @include      http://galacg.me/*
// @include      http://*.galacg.me/*
// @include      https://galacg.me/*
// @include      https://*.galacg.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27165/%E4%BB%93%E5%BA%93%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%84%E8%AE%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/27165/%E4%BB%93%E5%BA%93%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%84%E8%AE%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 黑名单关键字列表
// 如果是域名可以把域名部分放在这。
// 进帖子后，评论加载完毕自动询问删除。
let blacklist = ['pinpai9.com'];
let _alt = window.alert;
window.alert = function (text) {
    if (text == '感谢您的反馈！') {
        return ;
    }

    _alt(text);
};

let _cfm = window.confirm;
var lastText, lastComment;
let records = {};
let removeQueue = [];

function removeNextComment () {
    if (removeQueue.length === 0) {
        console.info('删除过程结束。');
        return ;
    }

    removeQueue.pop().find('.ds-post-delete').get(0).click();
    setTimeout(removeNextComment, 500 + Math.random() * 250);
}

window.confirm = function (text) {
    let actionReport = text == "确定要举报这条评论吗？";
    let actionDelete = text == "确定要删除这条评论吗？";
    
    if (actionReport || actionDelete) {
        text = "确定要举报&删除？\n"+lastText;
    }

    let _store = text.replace(/\s/g, '');
    console.info('key: ' + _store);

    if (records.hasOwnProperty(_store)) {
        return records[_store];
    }

    let r = _cfm(text);
    records[_store] = r;
    if (r && actionReport) {
        removeQueue.push(lastComment);
    }
    return r;
};

function dsProcess() {
    console.info('仓库自动删除评论广告::开始');
    let $ = jQuery;
    $('.ds-post').each(function () {
        let comment = $(this);
        let body = comment.find('p').text();
        let hit = blacklist.filter(item => body.indexOf(item) != -1);
        if (hit.length > 0) {
            lastText = body;
            lastComment = comment;
            comment.find('.ds-post-report').get(0).click();
        }
    });

    removeNextComment();
}

var timer = setInterval(function () {
    if (!document.getElementById('ds-waiting')) {
        clearInterval(timer);
        dsProcess();
    }
}, 500);
