// ==UserScript==
// @name         淘师湾 - 上传
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  破解淘师湾隐藏上传自定义文件功能
// @author       别问我是谁请叫我雷锋
// @match        http://www.51taoshi.com
// @match        http://www.51taoshi.com/html/index.html
// @match        http://ucenter.51taoshi.com/user/res/addRes.do?isUpload=1
// @match        http://ucenter.51taoshi.com/static/commons/js/ueditor/dialogs/image/image.html
// @match        http://ucenter.51taoshi.com/static/commons/js/ueditor/dialogs/attachment/attachment.html
// @match        http://ucenter.51taoshi.com/html/index.html
// @grant        none
// @license      百度百科-保密协议范本 https://baike.baidu.com/item/%E4%BF%9D%E5%AF%86%E5%8D%8F%E8%AE%AE/8743375?fr=aladdin#1
// @downloadURL https://update.greasyfork.org/scripts/403271/%E6%B7%98%E5%B8%88%E6%B9%BE%20-%20%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/403271/%E6%B7%98%E5%B8%88%E6%B9%BE%20-%20%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==
var index = 0;
var urls = [];


(function() {
    'use strict';
    if (location.href.lastIndexOf("addRes.do?isUpload=1") != -1) {
        window.onload = function () {
            $("#edui25_body").click();
        }
    }

    if (location.href.lastIndexOf("image/image.html") != -1) {
        location.href = "http://ucenter.51taoshi.com/static/commons/js/ueditor/dialogs/attachment/attachment.html";
    }



    if (location.href.lastIndexOf("www.51taoshi.com") != -1 || location.href.lastIndexOf("http://ucenter.51taoshi.com/html/index.html") != -1) {
        console.log($(".m-user").length);
        $('<a href="http://ucenter.51taoshi.com/user/res/addRes.do?isUpload=1" onclick="if ($(\'.m-user\').length == 0) { layer.msg(\'没有登录账号或者还没有加载到登录的账号，不能上传文件！请先登录账号！\', {icon: 2, anim: 6}); return false; } else { return true; }" target="_blank" style="color: #fff;     background: #e64818; height: 20px; margin-top: 20px; padding: 10px; font-weight:bold;">上传文件</a>').insertAfter(".m-search");
    }

    if (location.href.lastIndexOf("attachment/attachment.html") != -1) {
        ;(function() {
            function ajaxEventTrigger(event) {
                var ajaxEvent = new CustomEvent(event, { detail: this });
                window.dispatchEvent(ajaxEvent);
            }

            var oldXHR = window.XMLHttpRequest;

            function newXHR() {
                var realXHR = new oldXHR();
                realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
                realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
                realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
                realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
                realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
                realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
                realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
                realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
                return realXHR;
            }

            window.XMLHttpRequest = newXHR;
        })();

        window.addEventListener('ajaxReadyStateChange', function (e) {
            console.log(e.detail); // XMLHttpRequest Object
            if (e.detail.readyState == 4) {
                parent.layer.close(index);
                urls.push({"URL": JSON.parse(e.detail.responseText).url, "大小" : JSON.parse(e.detail.responseText).size + "字节" , "本地文件名" : JSON.parse(e.detail.responseText).original});
                index = parent.layer.alert("上传成功，已得到的返回URL有：" + JSON.stringify(urls));
            }
        });
    }

    // Your code here...
})();

