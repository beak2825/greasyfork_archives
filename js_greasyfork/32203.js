// ==UserScript==
// @name         google play apk downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add a download button (https://apps.evozi.com/apk-downloader/?id=xxx) to goole pages (play.google.com/store/apps/details?id=xxx)
// @author       yurenchen
// @match        https://play.google.com/store/apps/details?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32203/google%20play%20apk%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/32203/google%20play%20apk%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取 apk id
    //var id=document.body.getAttribute('data-docid');
    var id=location.search.match(/id=(.*)/)[1];
    //利用 apps.evozi.com 下载
    var url='https://apps.evozi.com/apk-downloader/?id='+id;
    //创建超链接按钮
    var html='<a href="'+url+'" class="large play-button download-apk-button apps ">download apk</a>';
    $('.details-actions>div:first>span').append(html);

})();
