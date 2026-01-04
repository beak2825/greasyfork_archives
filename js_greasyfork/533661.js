// ==UserScript==
// @name         thepornjoy 直接观看
// @description  访问thepornjoy时，会先访问一个广告页，再跳转才是真实访问网址。这个脚本能直接访问视频网址。Automatically add ?play=true on thepornjoy.org for autoplay.behavior.
// @match        https://thepornjoy.org/*
// @version       1.0.1
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @namespace   https://greasyfork.org/users/1171320
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533661/thepornjoy%20%E7%9B%B4%E6%8E%A5%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533661/thepornjoy%20%E7%9B%B4%E6%8E%A5%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const url = new URL(window.location.href);

    // 如果已经存在 play 参数，就不做任何操作
    if (url.searchParams.has('play')) return;

    // 没有 play 参数，添加上去
    url.searchParams.append('play', 'true');

    // 替换当前地址，不刷新页面
    window.location.replace(url.href);
})();