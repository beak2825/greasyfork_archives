// ==UserScript==
// @name         CSDN博客插件
// @namespace    zyStudio
// @version      1.2
// @description  去除CSDN复制限制、登录查看限制
// @author       zyStudio
// @match        https://blog.csdn.net/*
// @icon         https://gitee.com/zzyGodofWar/ownproject/raw/master/z.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438252/CSDN%E5%8D%9A%E5%AE%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/438252/CSDN%E5%8D%9A%E5%AE%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    pageBeforeLoaded();

    $(document).ready(function () {
		pageLoaded();
	});

})();

function pageBeforeLoaded(){
    //去广告
    var footAds = $('#footerRightAds');
    footAds.remove();

    var rightAds = $('#recommendAdBox');
    rightAds.remove();

    var adsbygoogle = $('.adsbygoogle');
    adsbygoogle.remove();

    document.addEventListener("copy",function(e){
        e.stopPropagation();
    },true);
}

function pageLoaded(){

     //去除复制限制
    var cview = $('#content_views');
    cview.attr('id','');

    //去除关注查看限制
    var rmask = $('.hide-article-box.hide-article-pos.text-center');
    rmask.remove();
    var articlec = $('#article_content');
    articlec.attr('style','');

    //去除登录提示
    var btnsign = $('.hljs-button.signin');

    for(let i =0;i<btnsign.length;i++){
        let tbtn = btnsign[i];
        tbtn.setAttribute('class','');
    }

    var logwindow = $('.passport-container.passport-container-mini');
    logwindow.remove();

    

}