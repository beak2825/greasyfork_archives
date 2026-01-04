// ==UserScript==
// @name 万能解析
// @description     播放视频
// @include         *yaoshe*.com/videos/*
// @include         *ppx*.com/videos/*
// @include         *soav*.com/videos/*
// @include         *99a27*.com/videos/*
// @include         *xxhu*.com/videos/*
// @include         *haicao*.com/videos/*
// @include         *xiaobi*.com/videos/*
// @include         *kedousex*.com/videos/*
// @include         *85tube*.com/videos/*
// @include         *jjdong*.com/videos/*
// @include         *xxx*.vip/videos/*
// @include         *she17173*.com/videos/*
// @version         0.5
// @grant none
// @namespace https://greasyfork.org/users/381425
// @downloadURL https://update.greasyfork.org/scripts/390666/%E4%B8%87%E8%83%BD%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/390666/%E4%B8%87%E8%83%BD%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //获取解析网址
    var currentUrl = window.location.href.split("videos")[0]+"embed"+window.location.href.split("videos")[1]+"/2048";
    window.location.href=currentUrl; 
})();