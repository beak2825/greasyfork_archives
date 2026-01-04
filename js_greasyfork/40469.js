// ==UserScript==
// @name                Wandoujia Download APK Directly
// @name:zh-CN          豌豆荚直接下载APK
// @namespace           @null
// @version             0.2
// @description         All install links are replaced with direct download APK links
// @description:zh-CN   页面内所有安装按钮链接修改为直接下载APK链接
// @author              test01wrk
// @match               http*://www.wandoujia.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/40469/Wandoujia%20Download%20APK%20Directly.user.js
// @updateURL https://update.greasyfork.org/scripts/40469/Wandoujia%20Download%20APK%20Directly.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btns = document.getElementsByClassName('i-source');
    [].forEach.call(btns, function(e) {
        var url = e.getAttribute('href');
        if (!url.startsWith('http')) {
            url = window.location.origin + url;
        }
        var success = true;
        var dataType = e.getAttribute('data-type');
        var dataFeat = e.getAttribute('data-feat');
        //console.log('dataType=' + dataType + ', dataFeat=' + dataFeat + ', url=' + url);
        if (dataType == 'bind' && dataFeat == 'binded') {
            url = url.replace(/(^https?:\/\/[^\/]+\/apps\/[^\/]+)\/.*$/, '$1/download');
        } else if (dataType == 'history' && dataFeat == 'binded_history') {
            url = decodeURIComponent(url);
            url = url.replace(/^https?:\/\/.*\?downloadUrl=(https?:\/\/.*\.apk)\?.*$/, '$1');
        } else {
            success = false;
        }
        //console.log('direct.url=' + url);
        if (success) {
            e.setAttribute('href', url);
            if (e.innerHTML.trim().length >= 4) {
                e.innerHTML = '下载APK';
            }
        }
    });
})();