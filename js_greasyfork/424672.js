// ==UserScript==
// @name            失焦时暂停视频
// @name            pause-video-when-blur
// @namespace       https://github.com/NiaoBlush/pause-video-when-blur
// @version         1.1
// @description     在切换标签时暂停视频播放,返回时继续
// @author          NiaoBlush
// @license         MIT
// @grant           none
// @include         https://www.bilibili.com/*
// @include         https://v.youku.com/*
// @include         https://www.acfun.cn/*
// @downloadURL https://update.greasyfork.org/scripts/424672/%E5%A4%B1%E7%84%A6%E6%97%B6%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/424672/%E5%A4%B1%E7%84%A6%E6%97%B6%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

const bilibili = {
    regex: /bilibili\.com/,
    play: function () {
        player.play();
    },
    pause: function () {
        player.pause();
    }
};

const youku = {
    regex: /v\.youku\.com/,
    play: function () {
        H5player.play();
    },
    pause: function () {
        H5player.pause();
    }
};

const acfun = {
    regex: /acfun\.cn\//,
    play: function () {
        player.play();
    },
    pause: function () {
        player.pause();
    }
};

const sites = [bilibili, youku, acfun];

function initSite() {

    let site = null;
    sites.forEach(function (e) {
        if (e.regex.test(window.location.href)) {
            site = e;
        }
    });
    return site;
}

(function () {
    "use strict";

    const thisSite = initSite();

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            thisSite.pause();
        } else {
            thisSite.play();
        }
    });
})();
