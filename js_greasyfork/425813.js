// ==UserScript==
// @name         Google Play APK downloader
// @namespace    https://imciel.com/
// @version      0.2
// @description  add APK download buttons to Google Play
// @author       cielpy
// @match        https://play.google.com/store/apps/details?id=*
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425813/Google%20Play%20APK%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/425813/Google%20Play%20APK%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取 apk id
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get('id')
    //利用 apps.evozi.com 下载
    var url='https://apps.evozi.com/apk-downloader/?id='+id;
    //创建超链接按钮
    const apkPureUrl = 'https://apkpure.com/no/' + id +'/download?from=details'
    var html='<a href="'+url+'" class="large play-button download-apk-button apps evozi" style="margin-left: 8px">Download From Evozi</a>';
    html += '<a href="'+apkPureUrl+'" class="large play-button download-apk-button apps apkmirror" style="margin-left: 8px">Download From APKPure</a>';
    var html = '<div >' + html +'</div>'
    $('wishlist-add').append(html);
    $('wishlist-added').append(html);
})();
