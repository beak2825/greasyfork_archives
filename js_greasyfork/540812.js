// ==UserScript==
// @name         抖音采集用户
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  自动采集用户信息上传后台
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
// @downloadURL https://update.greasyfork.org/scripts/540812/%E6%8A%96%E9%9F%B3%E9%87%87%E9%9B%86%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540812/%E6%8A%96%E9%9F%B3%E9%87%87%E9%9B%86%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 通知配置test
    var messageOpts = {
        "positionClass": "toast-top-right",
        "timeOut": "2000",
    };
    toastr.options = messageOpts;

    // 目标请求 URL 部分标识
    const targetUrl = ["web/user/follower/list", "web/user/profile/other", "web/discover/search"];
    const urlCache = [];

    // 插入样式
    GM_addStyle(GM_getResourceText("notifyCss"));

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
                        console.log("get url:", url);
                        if (url.includes("follower")) {
                            handleEvent(this.responseText);
                        }else if (url.includes("search")) {
                            handleSearch(this.responseText);
                        } else {
                            handleCurrentUser(this.responseText);
                        }
                    }
                }
                return fn.apply(this, args);
            };
            return desc.set.call(this, wrapped);
        }
    });

    gmGet("http://127.0.0.1:5000/users/orderNo").then(function(response) {
            console.log("采集用户订单号：", response.responseText);
            window.orderNo = response.responseText;
        }).catch(function(error) {
            console.error("请求采集用户订单号：", error);
        });


})();

function handleSearch(responseText) {
    let orderNo = window.orderNo;
    if (!orderNo || orderNo === '') {
        return;
    }
    let data = JSON.parse(responseText);
    const searchKey = data.input_keyword;
    const matchResultArr = data.user_list.filter(user => user.user_info.unique_id === searchKey);
    if (matchResultArr.length === 0) {
        console.log("没有匹配的结果: ", searchKey);
        return;
    }
    const userInfo = matchResultArr[0].user_info;
    const users = [{
            username: userInfo.nickname,
            uid: userInfo.uid,
            signature: userInfo.signature,
            userAvatar: userInfo.avatar_thumb.url_list[0],
            platform: "抖音",
            userToken: userInfo.sec_uid,
            shortId: userInfo.unique_id,
            followerCount: userInfo.follower_count,
            orderNo: orderNo,
            ipLocation: "",
            city: ""
        }];
    console.log('采集用户信息:', users);
    let url = 'http://127.0.0.1:5000/users/batch_add';
    gmPost(url, users)
        .then(function(response) {
            toastr.success('上传成功');
            console.log("请求成功，响应内容：", response.responseText);
        })
        .catch(function(error) {
            toastr.error('上传失败');
            console.error("请求失败：", error);
        });

}

function handleEvent(responseText) {
    //console.log("handleEvent log: ", responseText);
    let orderNo = window.orderNo;
    if (!orderNo || orderNo === '') {
        return;
    }
    let data = JSON.parse(responseText);
    const users = data.followers.map(item => {
        return {
            username: item.nickname,
            uid: item.uid,
            signature: item.signature,
            userAvatar: item.avatar_thumb.url_list[0],
            platform: "抖音",
            followingUserToken: window.blogger.userToken,
            followingUserName: window.blogger.userName,
            followingShortId: window.blogger.userShortId,
            followingUid: window.blogger.uid,
            userToken: item.sec_uid,
            shortId: item.unique_id,
            shareQrcodeUrl: item.share_info.share_qrcode_url.url_list[0],
            followerCount: item.follower_count,
            orderNo: orderNo,
            ipLocation: "",
            city: ""
        };
    });
    console.log('采集粉丝信息:', users);
    let url = 'http://127.0.0.1:5000/users/batch_add';
    gmPost(url, users)
        .then(function(response) {
            toastr.success('上传成功');
            console.log("请求成功，响应内容：", response.responseText);
        })
        .catch(function(error) {
            toastr.error('上传失败');
            console.error("请求失败：", error);
        });
}

function handleCurrentUser(responseText) {
    //console.log("handleEvent log: ", responseText);
    let data = JSON.parse(responseText);
    const blogger = {
        userToken: data.user.sec_uid,
        userName: data.user.nickname,
        userShortId: data.user.unique_id,
        uid: data.user.uid
    };
    console.log('当前博主信息:', blogger);
    window.blogger = blogger;

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

