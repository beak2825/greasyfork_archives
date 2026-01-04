// ==UserScript==
// @name         抖音采集评论
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  自动采集上传抖音评论信息到后台
// @match        https://www.douyin.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @resource     notifyCss https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/540815/%E6%8A%96%E9%9F%B3%E9%87%87%E9%9B%86%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540815/%E6%8A%96%E9%9F%B3%E9%87%87%E9%9B%86%E8%AF%84%E8%AE%BA.meta.js
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
                    }
                }
                return fn.apply(this, args);
            };
            return desc.set.call(this, wrapped);
        }
    });

    gmGet("http://127.0.0.1:5000/comments/orderNo").then(function(response) {
            console.log("采集评论订单号：", response.responseText);
            window.orderNo = response.responseText;
        }).catch(function(error) {
            console.error("请求采集评论订单号：", error);
        });



})();

function handleEvent(responseText) {
    //console.log("handleEvent log: ", responseText);
    let orderNo = window.orderNo;
    if (!orderNo || orderNo === '') {
        return;
    }
    const divs = document.querySelectorAll('.title');
    const postTitle = divs[0].innerText;
    let data = JSON.parse(responseText);
    const comments = data.comments.map(item => {
        return {
            "commentId": item.cid,
            "commentTime": item.create_time + '000',
            "username": item.user.nickname,
            "uid": item.user.uid,
            "content": item.text,
            "imageUrl": item.image_list ? item.image_list.map(p => p.origin_url.url_list[0]).join(",") : "",
            "userAvatar": item.user.avatar_thumb.url_list[0],
            "ipAddress": item.ip_label,
            "platform": "抖音",
            "matchStatus": 0,
            "postUrl": window.location.href,
            "postTitle": postTitle,
            "userToken": item.user.sec_uid,
            "shortId": item.user.unique_id,
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


