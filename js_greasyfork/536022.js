// ==UserScript==
// @name         抖音评论上传
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @description  上传抖音评论信息到后台
// @match        https://www.douyin.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      117.72.123.102
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @resource     notifyCss https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/536022/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/536022/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 通知配置test
    var messageOpts = {
        "positionClass": "toast-top-right",
        "timeOut": "2000",
    };
    toastr.options = messageOpts;

    // 插入样式
    GM_addStyle(GM_getResourceText("notifyCss"));
    GM_addStyle('.uploadBtn, .uploadDone {position: absolute;right: 25px; cursor: pointer; background-color: transparent; border: none;}');
    GM_addStyle('.uploadSvg { fill: #eddc10; width: 30px; height: 30px; }');
    GM_addStyle('.uploadSvg:hover { fill: #28A745 }');
    GM_addStyle('.uoload-done-svg { fill: #2aa7ee; width: 30px; height: 30px; }');
    GM_addStyle('.uploading { font-size: larger; color: red; font-weight: bold; }');


    window.commentCache = {};
    // 目标请求 URL 部分标识
    const targetUrl = ["web/comment/list"];
    const urlCache = [];


     const desc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'onreadystatechange');
    Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
        configurable: true,
        enumerable: desc.enumerable,
        get: function() {
            return desc.get.call(this);
        },
        set: function(fn) {
            const wrapped = function(...args) {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    const url = this._url;
                    if (url && targetUrl.some(item => url.includes(item)) && !urlCache.includes(url)) {
                        urlCache.push(url);
                        handleEvent(this.responseText);
                        setTimeout(() => {
                            let index = urlCache.indexOf(url);
                            if (index !== -1) {
                                urlCache.splice(index, 1); // 删除索引处的一个元素
                            }
                        }, 1000);
                    }
                }
                return fn.apply(this, args);
            };
            return desc.set.call(this, wrapped);
        }
    });


})();

function handleEvent(responseText) {
    console.log("handleEvent log: ", responseText);
    const divs = document.querySelectorAll('.title');
    const postTitle = divs[0].innerText;
    let data = JSON.parse(responseText);
    data.comments.forEach(item => recursionGetComment(item, postTitle));
    setTimeout(renderComment, 500);
}

function recursionGetComment(item, postTitle) {
    let id = item.cid;
    if (!window.commentCache[id]) {
        window.commentCache[id] = {
            createTime: item.create_time,
            content: item.text,
            pictures: item.image_list ? item.image_list.map(p => p.origin_url.url_list[0]) : [],
            commentId: id,
            ipLocation: item.ip_label,
            userInfo: item.user,
            postTitle: postTitle
        };
    }
    if (item.reply_comment && item.reply_comment.length > 0) {
        item.reply_comment.forEach(item => recursionGetComment(item, postTitle));
    }
}

function renderComment() {
    const commentMenus = document.querySelectorAll('.comment-item-info-wrap');
    commentMenus.forEach(commentMenu => {
            if (commentMenu.children.length === 2) {
                const tooltipDiv = commentMenu.children[1];
                if (tooltipDiv && tooltipDiv.children[0]) {
                    let commentId = tooltipDiv.children[0].id.replace("tooltip_", "");
                    let svg = '<svg class="uploadSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/></svg>';
                    let button = '<button id=' + commentId + ' class="uploadBtn">' + svg + '</button>';
                    // 在当前元素的右边插入一个包含“上传”的 div
                    commentMenu.insertAdjacentHTML('beforeend', button);
                }
            }
    });
    // 获取所有按钮
    const buttons = document.querySelectorAll('.uploadBtn');
    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
    });

}

function handleClick(e) {
    let target = e.currentTarget;
    let orgInnerHTML = target.innerHTML;
    target.innerHTML = "<span class='uploading'>正在上传</span>";
    let commentId = target.id;
    let data = window.commentCache[commentId];
    let uploadComment = {
        "commentId": data.commentId,
        "commentTime": data.createTime + '000',
        "username": data.userInfo.nickname,
        "uid": data.userInfo.uid,
        "content": data.content,
        "imageUrl": data.pictures.length > 0 ? data.pictures.join(",") : "",
        "userAvatar": data.userInfo.avatar_thumb.url_list[0],
        "ipAddress": data.ipLocation,
        "platform": "抖音",
        "matchStatus": 0,
        "contactStatus": 0,
        "postUrl": window.location.href,
        "postTitle": data.postTitle,
        "xsecToken": data.userInfo.sec_uid,
      };

    console.log('当前评论信息:', uploadComment);
    let url = 'http://117.72.123.102/api/comments';
    gmPost(url, uploadComment)
        .then(function(response) {
        toastr.success('上传成功');
            console.log("请求成功，响应内容：", response.responseText);
            let svg = '<svg class="uoload-done-svg"xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m414-280 226-226-58-58-169 169-84-84-57 57 142 142ZM260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg>';
        target.innerHTML = svg;
        target.className = 'uploadDone'
        target.removeEventListener('click', handleClick);
        })
        .catch(function(error) {
        toastr.error('上传失败');
            console.error("请求失败：", error);
            target.innerHTML = orgInnerHTML;
        });
}


// 封装 GM_xmlhttpRequest 为返回 Promise 的函数
    function gmPost(url, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    // 根据状态码判断请求是否成功
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(new Error("POST 请求失败，状态码：" + response.status));
                    }
                },
                onerror: function(error) {
                    reject(new Error("请求出错：" + error));
                }
            });
        });
    }


