// ==UserScript==
// @name         小红书采集评论
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动采集上传
// @license      MIT
// @match        https://www.xiaohongshu.com/explore*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @resource     notifyCss https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/540814/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%87%87%E9%9B%86%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540814/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%87%87%E9%9B%86%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 通知配置
    var messageOpts = {
        "positionClass": "toast-top-right",
        "timeOut": "2000",
    };
    toastr.options = messageOpts;

    // 插入样式
    GM_addStyle(GM_getResourceText("notifyCss"));

    window.commentCache = {};
    // 目标请求 URL 部分标识
    const targetUrl = ["comment/page", "comment/sub/page"];

    // 保存原始的 setRequestHeader 方法
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    // 重写 setRequestHeader 方法
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        // 初始化存储请求头的属性
        if (!this._requestHeaders) {
            this._requestHeaders = {};
        }
        // 保存当前设置的请求头
        this._requestHeaders[header] = value;
        return originalSetRequestHeader.apply(this, arguments);
    };

    /**
     * 重写open方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
     */
    XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (targetUrl.some(item => url.includes(item))) {
            this._url = url;
            this.addEventListener("loadend", handleEvent);
        }
        this.myOpen(method, url, async);
    };

    /**
     * 重写sned方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
     */
    XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this._requestBody = body;
        return this.mySend(body);
    };

    gmGet("http://127.0.0.1:5000/comments/orderNo").then(function(response) {
            console.log("采集评论订单号：", response.responseText);
            window.orderNo = response.responseText;
        }).catch(function(error) {
            console.error("请求采集评论订单号：", error);
        });

})();

function handleEvent(e) {
    let orderNo = window.orderNo;
    if (!orderNo || orderNo === '') {
        return;
    }
    let data = JSON.parse(e.currentTarget.response).data;
    const comments = data.comments.map(item => {
        return {
            "commentId": item.id,
            "commentTime": item.create_time,
            "username": item.user_info.nickname,
            "uid": item.user_info.user_id,
            "content": item.content,
            "imageUrl": item.pictures ? item.pictures.map(p => p.url_default).join(",") : "",
            "userAvatar": item.user_info.image,
            "ipAddress": item.ip_location,
            "platform": "小红书",
            "matchStatus": 0,
            "postUrl": window.location.href,
            "postTitle": document.title.replace("- 小红书", ""),
            "userToken": item.user_info.xsec_token,
            orderNo: orderNo
        }
    });
    console.log('当前评论信息:', comments);
    let url = 'http://127.0.0.1:5000/comments/batch_add';
    gmPost(url, comments)
        .then(function(response) {
            toastr.success('上传成功');
            console.log("请求成功，响应内容：", response.responseText);
        })
        .catch(function(error) {
            toastr.error('上传失败');
            console.error("请求失败：", error);
        });
}

function gmGet(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET", url, onload: res => resolve(res), onerror: reject
    });
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


