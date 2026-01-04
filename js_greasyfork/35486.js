// ==UserScript==
// @name         NGA显示真名(临时用)
// @version      0.3
// @description  根据NGA暗暗十分的chrome扩展修改而来
// @match        http*://bbs.nga.cn/*
// @match        http*://bbs.ngacn.cc/*
// @match        http*://nga.178.com/*
// @match        http*://nga.donews.com/*
// @require      https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js
// @namespace    https://greasyfork.org/users/131449
// @downloadURL https://update.greasyfork.org/scripts/35486/NGA%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%90%8D%28%E4%B8%B4%E6%97%B6%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35486/NGA%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%90%8D%28%E4%B8%B4%E6%97%B6%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var uidDataReal = {};
    if (window.localStorage && window.localStorage.hasOwnProperty('uidDataReal')) {
        try {
            var storedData = JSON.parse(window.localStorage.getItem("uidDataReal"));
            uidDataReal = storedData;
        } catch (e) {}
    }
    var users = $('a[href*="nuke.php?func=ucp&uid="]:contains("UID")');
    $.each(users, function(i, user) {
        var uid = $(user).attr('href').replace(/\D/g, '');
        if (uidDataReal[uid]) {
            $(user).html(uidDataReal[uid]);
        } else {
            replaceUid(user, uid);
        }
    });

    function getRealUidData(user, uid, pageCont) {
        var pattern = new RegExp("用户 (.*?)\\(\\d+\\) 对用户");
        var username = pattern.exec(pageCont)[1];
        console.log("uid:", uid, "username:", username);
        uidDataReal[uid] = username;
        window.localStorage.setItem("uidDataReal", JSON.stringify(uidDataReal));
        $(user).html(uidDataReal[uid]);
    }

    function replaceUid(user, uid) {
        var xhr = new XMLHttpRequest();
        var dataUrl = window.location.origin + "/nuke.php?func=user_reputation&uid=" + uid + "&nameselect=uid&name=" + uid;
        xhr.open('GET', dataUrl);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (this.status == 200) {
                var dataView = new DataView(this.response);
                var decoder = new TextDecoder('gbk');
                var decodedString = decoder.decode(dataView);
                getRealUidData(user, uid, decodedString);
            } else {
                console.error('Error while requesting', dataUrl, this);
            }
        };
        xhr.send();
    }
})();