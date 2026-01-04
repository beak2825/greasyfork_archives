// ==UserScript==
// @name         OSU Inso
// @namespace    http://www.sirokuma.cc/
// @version      0.1
// @description:zh-CN   自动跳转Inso下载beatmap
// @author       Sirokuma
// @include      http*://osu.ppy.sh/s/*
// @include      http*://osu.ppy.sh/b/*
// @grant        none
// @description 自动跳转Inso下载beatmap
// @downloadURL https://update.greasyfork.org/scripts/367629/OSU%20Inso.user.js
// @updateURL https://update.greasyfork.org/scripts/367629/OSU%20Inso.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.location.toString();
　　var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
　　var relUrl = arrUrl[1].substring(start+1);
    relUrl=relUrl.replace(/s/,"m");
    var inso=relUrl.replace(/\//,"=");
    window.location.href='http://inso.link/yukiho/?'+inso;
})();