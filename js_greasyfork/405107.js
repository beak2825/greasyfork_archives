// ==UserScript==
// @name        steam unlock
// @namespace   http://tampermonkey.net/
// @version     0.0.5
// @description steam直接添加愿望单
// @author      Aldaris
// @include     *://store.steampowered.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/405107/steam%20unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/405107/steam%20unlock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        let settingTarget = document.getElementById("error_box");

        if (settingTarget == null || settingTarget == undefined) {
            return;
        }
        settingTarget.addEventListener('click', function () {
            let url = window.location.href
            let appid = url.match('/[0-9]+/');
            appid = appid.toString().replaceAll('/', '');
            if (prompt("确定添加到愿望单吗？",appid)) {
                addWishList(appid);
            }
        }, false);
    };
})();

function addWishList(appid) {
    let sessionId = getCookie('sessionid');

    let tempform = document.createElement('form');
    tempform.action = '/api/addtowishlist';
    tempform.method = "post";
    // tempform.target = "_blank";
    tempform.style.display = "none"

    var opt = document.createElement("input");
    opt.type = "submit";
    tempform.appendChild(opt);

    let optSessionid = document.createElement("input");
    optSessionid.name = 'sessionid';
    optSessionid.value = sessionId;
    tempform.appendChild(optSessionid);

    let optAppid = document.createElement("input");
    optAppid.name = 'appid';
    optAppid.value = appid;
    tempform.appendChild(optAppid);

    document.body.appendChild(tempform);

    tempform.submit();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}