// ==UserScript==
// @name         巴士通票
// @namespace    undefined
// @version      0.3.0
// @description  巴士通票，一票在手，天下我有。无论是VIP限制，还是两个小时限制，统统无视。
// @author       c.c.木头
// @homepage     https://sleazyfork.org/zh-CN/scripts/26927
// @include      *://*avbus77.com/*op=view*
// @include      *://*avbus888.com/*op=view*
// @include      *://*bus222.com/*op=view*
// @include      *://*gogo5577.com/*op=view*
// @include      *://*gogo*/*op=view*
// @include      *://*gogo5588.com/*op=view*
// @include      *://*gogo7777.com/*op=view*
// @include      *://*gogo8866.com/*op=view*
// @include      *://*gogo8888.com/*op=view*
// @include      *://*jav513.com/*op=view*
// @include      *://*jav513.me/*op=view*
// @include      *://*kkk551.com/*op=view*
// @include      *://*mmav33.com/*op=view*
// @include      *://*uukk8811.com/*op=view*
// @include      *://*uukk8877.com/*op=view*
// @include      *://*uukk8888.com/*op=view*
// @include      *://*uuu557.com/*op=view*
// @include      *://*v101.co/*op=view*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT License
// @compatible   safari
// @compatible   chrome
// @compatible   firefox
// @compatible   opera 未测试

// @downloadURL https://update.greasyfork.org/scripts/34408/%E5%B7%B4%E5%A3%AB%E9%80%9A%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/34408/%E5%B7%B4%E5%A3%AB%E9%80%9A%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    showTitle();

    if(typeof(exportFunction) == "undefined"){
        unsafeWindow.do_playp2p=isLoading;
        unsafeWindow.do_playflash=isLoading;
        unsafeWindow.do_playts=isLoading;
    }else{
        var isLoadingFunc=exportFunction(isLoading,unsafeWindow);
        unsafeWindow.do_playp2p=isLoadingFunc;
        unsafeWindow.do_playflash=isLoadingFunc;
        unsafeWindow.do_playts=isLoadingFunc;
    }

    $(function(){
        if(typeof(exportFunction) == "undefined"){
            unsafeWindow.do_playp2p=get_p2p;
            unsafeWindow.do_playflash=get_flash;
            unsafeWindow.do_playts=get_mp4;
        }else{
            unsafeWindow.do_playp2p=exportFunction (get_p2p, unsafeWindow);
            unsafeWindow.do_playflash=exportFunction (get_flash, unsafeWindow);
            unsafeWindow.do_playts=exportFunction (get_mp4, unsafeWindow);
        }
    });

    function showTitle(){
        var infoElement = $("div.playerbtn table tbody tr td").first();
        var titleHtml='<p>尊敬的乘客</p>';
        if(infoElement.length === 0){
            infoElement = $("dl.dl_tip dd").first();
            titleHtml+='<p>(播放影片2)，(Android安卓)，(iPhone苹果)，点击即可播放，无需安装任何播放器。</p>';
        }

		var urlc = get_mp4();
		
        infoElement.html(titleHtml+urlc);
    }

    function isLoading(){
        alert('页面加载中，请耐心等待');
    }

    function get_play_view(){
        var play_view = $('#play_view');
        if(play_view.length === 0){
            play_view = $('#playvideo');
        }
        play_view.attr({width: "694px", height: "434px"});
        play_view.css("background-image", "url('')");
        return play_view;
    }

    function get_p2p(){
        var reg = new RegExp('<object classid=(.*)?</object>');
        var html = document.getElementsByTagName('html')[0].innerHTML;
        var match = html.match(reg)[0];

        var play_view = get_play_view();
        var phtml = match;
        play_view.html(phtml);
		//return match
    }

    function get_flash(){
        var reg = new RegExp('p2ps_embed\((.*)?\);');
        var html = document.getElementsByTagName('html')[0].innerHTML;
        var match = html.match(reg)[0];
        match = match.replace('data.onepwd', '""');

        var play_view = get_play_view();
        var phtml = '<div id="p2ps_video"><h1>我们需要Flash player 10.1或以上版本来播放。</h1><p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="安装最新的Flash player" /></a></p></div>';
        play_view.html(phtml);
        unsafeWindow.eval(match);
		//return match
    }

    function get_mp4(){
        var rnd_ip = $("#rnd_ip").val();
        var reg = new RegExp(":8080(.*)?.m3u8");
        var html = document.getElementsByTagName('html')[0].innerHTML;
        var match = html.match(reg)[0];
        var m3u8 = rnd_ip + match;

        var play_view = get_play_view();
        var phtml = '<video width="694px" height="434px" autoplay="autoplay" controls><source src="' + m3u8 + '" type="application/x-mpegURL">Your browser does not support the video tag.</video>';
        play_view.html(phtml);
		return m3u8
    }

})();