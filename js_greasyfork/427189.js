// ==UserScript==
// @author      oscarcx123
// @name        B站保存播放进度
// @description 自动保存B站多集视频的进度（例如各类网课视频）
// @namespace   https://github.com/oscarcx123
// @language    zh-CN
// @version     1
// @icon        https://www.bilibili.com/favicon.ico
// @website     https://github.com/oscarcx123/bili-seeker
// @supportURL  https://github.com/oscarcx123/bili-seeker/issues
// @include     https://www.bilibili.com/video/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427189/B%E7%AB%99%E4%BF%9D%E5%AD%98%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/427189/B%E7%AB%99%E4%BF%9D%E5%AD%98%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var video = document.querySelector(".bilibili-player-video video");
    var episodeLst = document.querySelector(".list-box"); // 检测有无视频选集列表（没有会返回null）
    var videoId = getVideoID();
    var savedEpisode = getVal("savedEpisode", 1); // 读取集数
    var savedTime = getVal("savedTime", 0); // 读取时间点
    var currEpisode = getCurrEpisode(); // 获取当前集数
    var currTime = getCurrTime(); // 获取当前时间点


    // 读取触发条件：超过1集的视频，并且当前进度和储存的进度不同
    if (episodeLst != null && ((savedEpisode != currEpisode) || (savedTime != currTime))) {
        loadEpisode();
    }

    // 储存触发条件：超过1集的视频
    if (episodeLst != null) {
        setInterval(saveEpisode, 10000); // 定时保存播放进度
    }

    // 读取播放进度
    function loadEpisode() {
        var savedEpisode = getVal("savedEpisode", 1);
        var savedTime = getVal("savedTime", 0);
        GM_log("CurrPos", savedEpisode, "@", savedTime);

        if (!(savedTime == 0 && savedEpisode == 1)) {
            location.href = `/video/${videoId}?p=${savedEpisode}&t=${savedTime}`;
        }
    }


    // 保存播放进度
    function saveEpisode() {
        var pageNo = getCurrEpisode();
        var currentTime = video.currentTime || 0;
        if (!(pageNo == 1 && currentTime == 0)) {
            setVal("savedEpisode", pageNo);
            setVal("savedTime", currentTime);
        }
    }


    // 读取数据
    function getVal(name, defaultValue) {
        var key = `${videoId}_${name}`;
        var res = GM_getValue(key, defaultValue);
        GM_log("getVal -", key, res);
        return res;
    }

    // 储存数据
    function setVal(name, value) {
        var key = `${videoId}_${name}`;
        GM_setValue(key, value);
        GM_log("setVal -", key, value);
    }


    // 获取视频id
    function getVideoID() {
        return location.pathname.split("/")[2];
    }


    // 获取参数（?p=xxx&t=xxx）
    function getParams() {
        var params = location.search;
        var res = {};
        if (params.length > 1) {
            var lst = params.substring(1).split("&");
            for (var i = 0; i < lst.length; i++) {
                var param = lst[i].split("=");
                res[param[0]] = param[1];
            }
        }
        return res;
    }


    // 获取当前集数（?p=xxx）
    function getCurrEpisode() {
        var lst = getParams();
        return lst.p || 1;
    }


    // 获取当前时间（?t=xxx）
    function getCurrTime() {
        var lst = getParams();
        return lst.t || 0;
    }
})();
