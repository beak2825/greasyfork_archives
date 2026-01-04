// ==UserScript==
// @name         阿里云盘令牌提交
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  令牌提交
// @author       mumumi
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @connect      nas.pasre.cn
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @require      https://cdn.staticfile.org/localforage/1.10.0/localforage.min.js
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/474263/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%BB%A4%E7%89%8C%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/474263/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%BB%A4%E7%89%8C%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var localforage = window.localforage;
    var $ = $ || window.$;
    var obj = {
        cache: 'mmmtoken',
        key: 'token',
        timeout: 3000,
        url: 'http://nas.pasre.cn:612/alyd'
    };

    obj.showTipSuccess = function (msg, timeout) {
        obj.hideTip();
        var $element = $(".aDrive div");
        var elementhtml='<div class="aDrive-notice"><div class="aDrive-notice-content"><div class="aDrive-custom-content aDrive-success"><span data-role="icon" data-render-as="svg" data-icon-type="PDSCheckmarkCircleFill" class="success-icon--2Zvcy icon--d-ejA "><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSCheckmarkCircleFill"></use></svg></span><span><div class="content-wrapper--B7mAG" data-desc="false" style="margin-left: 44px; padding-right: 20px;"><div class="title-wrapper--3bQQ2">' + msg + '<div class="desc-wrapper--218x0"></div></div></div></span></div></div>'
        if ($element.length) {
            $element.append(elementhtml);
        }
        else {
            $(document.body).append('<div><div class="aDrive"><div>'+elementhtml+'</div></div></div>');
        }
        setTimeout(function () {
            obj.hideTip();
        }, timeout || 3000);
    };

    obj.showTipError = function (msg, timeout) {
        obj.hideTip();
        var $element = $(".aDrive div");
        var elementhtml='<div class="aDrive-notice"><div class="aDrive-notice-content"><div class="aDrive-custom-content aDrive-error"><span data-role="icon" data-render-as="svg" data-icon-type="PDSCloseCircleFill" class="error-icon--1Ov4I icon--d-ejA "><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSCloseCircleFill"></use></svg></span><span><div class="content-wrapper--B7mAG" data-desc="false" style="margin-left: 44px; padding-right: 20px;"><div class="title-wrapper--3bQQ2">' + msg + '<div class="desc-wrapper--218x0"></div></div></div></span></div></div></div>'
        if ($element.length) {
            $element.append(elementhtml);
        }
        else {
            $(document.body).append('<div><div class="aDrive"><div>'+elementhtml+'</div></div></div>');
        }
        setTimeout(function () {
            obj.hideTip()
        }, timeout || 3000);
    };

    obj.showTipLoading = function (msg, timeout) {
        obj.hideTip();
        var $element = $(".aDrive div");
        var elementhtml = '<div class="aDrive-notice"><div class="aDrive-notice-content"><div class="aDrive-custom-content aDrive-loading"><div></div><span><div class="content-wrapper--B7mAG" data-desc="false" style="margin-left: 20px; padding-right: 20px;"><div class="title-wrapper--3bQQ2">' + msg + '<div class="desc-wrapper--218x0"></div></div></div></span></div></div></div>'
        if ($element.length) {
            $element.append(elementhtml);
        }
        else {
            $(document.body).append('<div><div class="aDrive"><div>'+elementhtml+'</div></div></div>');
        }
        setTimeout(function () {
            obj.hideTip()
        }, timeout || 5000);
    };

    obj.hideTip = function() {
        var t = $(".aDrive-notice");
        t.length && "function" == typeof t.remove ? t.remove() : "function" == typeof t.removeNode && t.removeNode(!0);
    };

    obj.isHomePage = function () {
        return location.href.indexOf("aliyundrive.com/drive") + location.href.indexOf("alipan.com/drive") > 0;
    };

    obj.isLogin = function () {
        return !document.querySelector("[class^=login]");
    };

    obj.getItem = function (n) {
        n = localStorage.getItem(n);
        if (!n) {
            return null;
        }
        try {
            return JSON.parse(n);
        } catch (e) {
            return n;
        }
    };

    obj.setItem = function (n, t) {
        n && t != undefined && localStorage.setItem(n, t instanceof Object ? JSON.stringify(t) : t);
    };

    obj.init = function () {
        if (!obj.isHomePage()) {
            return;
        }
        if ($(".button-upload--token").length) {
            return;
        }
        if ($("#root header").length) {
            $("#root header:eq(0)").append('<div style="margin:0px 8px;"></div><button class="button--2Aa4u primary--3AJe5 small---B8mi button-upload--token">令牌提交</button>');
            $(".button-upload--token").on("click", obj.click);
        }
        else {
            setTimeout(obj.init, obj.timeout)
        }
    };

    obj.click = function () {
        if (!obj.isLogin()) {
            document.querySelector("[class^=login]").click();
            return;
        }
        var token = obj.getItem(obj.key);
        var user = token.nick_name + '(' + token.user_name + ')';
        var drivetoken = token.refresh_token + ';' + user;
        if (drivetoken == obj.getItem(obj.cache)) {
            obj.showTipError("重复提交：" + user);
            return;
        }
        var url = obj.url + "?t=" + encodeURIComponent(drivetoken);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                obj.showTipSuccess("成功提交：" + user);
                obj.setItem(obj.cache, drivetoken);
            }
        });
    };

    obj.run = function() {
        obj.init();
    }();
})();
