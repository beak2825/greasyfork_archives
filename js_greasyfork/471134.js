// ==UserScript==
// @name         钉钉PC/移动端快捷登录
// @namespace    http://tampermonkey.net/
// @license      GNU GPLv3
// @version      2.4
// @description  适用于AA3、AA4页面使用钉钉PC端/移动客户端进行认证登录。
// @author       You
// @match        https://account-auth-v4.test.leqeegroup.com/cas/login*
// @match        https://account-auth-v4.test.leqeegroup.com/cas/logout*
// @match        https://account-auth-v4.leqeegroup.com/cas/login*
// @match        https://account-auth-v4.leqeegroup.com/cas/logout*
// @match        https://test-aa-v4.leqee.com/cas/login*
// @match        https://test-aa-v4.leqee.com/cas/logout*
// @match        https://account-auth-v4.leqee.com/cas/login*
// @match        https://account-auth-v4.leqee.com/cas/logout*
// @match        https://account-auth-v3.leqee.com/cas/login*
// @match        https://account-auth-v3.leqee.com/cas/logout*
// @match        https://test-aa-lemai.leqee.com/cas/login*
// @match        https://test-aa-lemai.leqee.com/cas/logout*
// @match        https://srm-test.leqee.com/*
// @match        https://srm.leqee.com/*
// @match        https://srm.test.leqeegroup.com/*
// @match        https://srm.leqeegroup.com/*
// @match        https://auto-manage-test.leqee.com/*
// @match        https://freechess-manage.leqee.com/*
// @match        https://auto-manage.test.leqeegroup.com/*
// @match        https://freechess-manage.leqeegroup.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leqee.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471134/%E9%92%89%E9%92%89PC%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/471134/%E9%92%89%E9%92%89PC%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // 检测是否为移动设备
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.screen.width <= 768 ||
               ('ontouchstart' in window);
    }
    
    var isMobile = isMobileDevice();
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = isMobile ? "手机端钉钉登录" : "PC端钉钉登录"; //按钮内容
    button.style = "margin-top:10px; background-color: #409eff; color: #fff; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; cursor: pointer; outline: none;"; //按钮样式

    button.addEventListener("click", clickBotton) //监听按钮点击事件

    function getQueryParams() {
        var url = document.location.toString()
        // 如果url中有特殊字符则需要进行一下解码
        url = decodeURI(url)
        var arr1 = url.split("?");
        var obj = {}
        if (arr1.length > 1) {
            var arr2 = arr1[1].split("&");
            for (var i = 0; i < arr2.length; i++) {
                var curArr = arr2[i].split("=");
                obj[curArr[0]] = decodeURIComponent(curArr[1])
            }
        }
        return obj
    }
    var click_times = 0;

    function clickBotton(isAuto = false) {
        var nowUrl = window.location.href;
        var params = getQueryParams();
        var qrDataTitle = "";
        
        // 获取二维码数据
        if (nowUrl.indexOf('v4') != -1) {
            let qrData = document.getElementById('qrData');
            // 获取title属性
            qrDataTitle = qrData.getAttribute('title');
            if (qrDataTitle === null || qrDataTitle === undefined || qrDataTitle === "" || (isAuto && click_times > 0)) {
                return;
            }
            if (isAuto){
                click_times++;
            }
        }
        if (nowUrl.indexOf('v3') != -1 || nowUrl.indexOf('lemai') != -1) {
            let qrDataImg = document.getElementsByClassName('img-wrapper')[0];
            // 获取qrDataImg子节点含有img标签的第一个子节点
            let qrData = qrDataImg.getElementsByTagName('img')[0];
            // 获取title属性
            qrDataTitle = qrData.getAttribute('src');
        }
        
        // 如果是移动设备，使用二维码title跳转到钉钉客户端
        if (isMobile) {
            if (qrDataTitle) {
                var finallyUrl = "dingtalk://dingtalkclient/page/link?url=" + encodeURIComponent(qrDataTitle);
                console.log("Mobile device detected, jumping to:", finallyUrl);
                window.location.href = finallyUrl;
                button.textContent = "正在跳转到钉钉客户端...";
            } else {
                button.textContent = "获取二维码数据失败";
            }
            return;
        }
        if (nowUrl.indexOf('v3') != -1 || nowUrl.indexOf('lemai') != -1) {
            let qrDataImg = document.getElementsByClassName('img-wrapper')[0];
            // 获取qrDataImg子节点含有img标签的第一个子节点
            let qrData = qrDataImg.getElementsByTagName('img')[0];
            // 获取title属性
            qrDataTitle = qrData.getAttribute('src');
        }
        if (nowUrl.indexOf('srm.leqee.com') != -1) {
            window.location.href = "https://account-auth-v4.leqee.com/cas/login?service=srm#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('srm-test.leqee.com') != -1) {
            window.location.href = "https://test-aa-v4.leqee.com/cas/login?service=srm#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('freechess-manage.leqee.com') != -1) {
            window.location.href = "https://account-auth-v4.leqee.com/cas/login?service=freechess-manage#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('auto-manage-test.leqee.com') != -1) {
            window.location.href = "https://test-aa-v4.leqee.com/cas/login?service=freechess-manage#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('srm.leqeegroup.com') != -1) {
            window.location.href = "https://account-auth-v4.leqeegroup.com/cas/login?service=srm#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('srm-test.leqeegroup.com') != -1) {
            window.location.href = "https://account-auth-v4.test.leqeegroup.com/cas/login?service=srm#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('freechess-manage.leqeegroup.com') != -1) {
            window.location.href = "https://account-auth-v4.leqeegroup.com/cas/login?service=freechess-manage#dingtalk_h5_scan"
            return;
        }
        if (nowUrl.indexOf('auto-manage-test.leqeegroup.com') != -1) {
            window.location.href = "https://account-auth-v4.test.leqeegroup.com/cas/login?service=freechess-manage#dingtalk_h5_scan"
            return;
        }
        button.textContent = "登录中...";
        // 取出qr_data=后面的内容
        var qrDataValue = qrDataTitle.split('qr_data=')[1];
        // 取出域名，不包含https://
        var domain = qrDataTitle.split('https://')[1].split('/')[0];
        var url = "http://jst-idaas-hzlm.leqee.com/dingtalk-login/?qr_data=" + qrDataValue + "&domain=" + domain + "&service=" + params.service;
        console.log(url);
        var finallyUrl = "dingtalk://dingtalkclient/page/link?url=" + encodeURIComponent(url) + "&pc_slide=true"
        console.log(finallyUrl);
        if (params.code !== null && params.code !== undefined && params.code !== "" &&
            params.location_data !== null && params.location_data !== undefined && params.location_data !== "") {
            console.log(params.code);
            button.textContent = "授权中...";
            let postUrl = "https://" + domain + "/api/DingtalkLogin/scanQRCodeAutoLogin";
            var data = { "code": params.code, "qr_data": qrDataValue, "location_data": JSON.parse(params.location_data) };

            GM_xmlhttpRequest({
                method: "POST",
                url: postUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                onload: function (response) {
                    console.log("请求成功");
                    button.textContent = "授权成功，等待转跳...";
                    console.log(response.responseText);
                },
                onerror: function (response) {
                    button.textContent = "授权失败";
                    console.log("请求失败");
                }
            });
        } else {
            // 点击按钮跳转到finallyUrl
            window.location.href = finallyUrl;
            button.textContent = "等待钉钉客户端授权...";
        }
    }

    var div = document.createElement("div"); //创建一个div, 距离上个元素间隔10px
    div.className = "mt-10 text-xs text-N-02 flex items-center justify-center";
    div.id = "dingdingLogin";
    div.appendChild(button); //把按钮加入到div中

    var url = window.location.href;
    if (url.indexOf('v4') != -1) {
        console.log('v4');
        let ops = document.querySelector('#app');
        // 使用MutationObserver监视DOM变化
        const observer = new MutationObserver((mutations) => {
            let blank = document.getElementsByClassName('text-xs')[0];
            if (blank === undefined || blank === null) {
                return;
            }
            let nowDiv = document.getElementById('dingdingLogin');
            if(nowDiv !== null && nowDiv !== undefined){
                return;
            }
            blank.parentElement.insertBefore(div, null);
        });

        observer.observe(ops, { childList: true, subtree: true });
        // 每隔2秒点击按钮（仅在PC端）
        if (!isMobile) {
            setInterval(function () {
                clickBotton(true);
            }, 2000);
        }
    }
    if (url.indexOf('v3') != -1 || url.indexOf('lemai') != -1) {
        console.log('v3');
        let blank = document.getElementsByClassName('tabs__content')[0];
        blank.parentElement.insertBefore(div, null); //把按钮加入到 x 的子节点中
        // 点击按钮
        button.click();
    }
    if (url.indexOf('srm') != -1) {
        console.log('srm');
        let ops = document.querySelector('#app');
        const observer = new MutationObserver((mutations) => {
            let blank = document.getElementsByClassName('mt-6 text-info-2 text-sm select-none')[0];
            if (blank === undefined || blank === null) {
                return;
            }
            let nowDiv = document.getElementById('dingdingLogin');
            if(nowDiv !== null && nowDiv !== undefined){
                return;
            }
            blank.parentElement.insertBefore(div, null);
        });

        observer.observe(ops, { childList: true, subtree: true });
        // 更改按钮颜色为#1e9f71
        button.style.backgroundColor = "#1e9f71";
        button.textContent = isMobile ? "使用AA页面登录" : "使用AA页面登录";
    }
    if (url.indexOf('auto-manage') != -1 || url.indexOf('freechess-manage') != -1) {
        console.log('auto-manage');
        let ops = document.querySelector('#app');
        const observer = new MutationObserver((mutations) => {
            let blank = document.getElementsByClassName('tips')[0];
            if (blank === undefined || blank === null) {
                return;
            }
            let nowDiv = document.getElementById('dingdingLogin');
            if(nowDiv !== null && nowDiv !== undefined){
                return;
            }
            blank.parentElement.insertBefore(div, null);
        });

        observer.observe(ops, { childList: true, subtree: true });
        // 更改按钮颜色为#477df6
        button.style.backgroundColor = "#477df6";
        button.textContent = isMobile ? "使用AA页面登录" : "使用AA页面登录";
    }
})();