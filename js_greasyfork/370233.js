// ==UserScript==
// @name         网易新闻视频地址解析
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网易新闻内容 视频地址 解析
// @author       Jack.Chan
// @match        *://c.m.163.com/news/*
// @include      https://3g.163.com/all/article/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370233/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/370233/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var videoList = [], pageTitle = document.title;
    if(window.DATA){
		if(window.DATA.video && window.DATA.video.length){
            videoList = window.DATA.video;
            pageTitle = window.DATA.title;
		}
	}else{
        if(document.querySelector('.js-video')){
            var video = document.querySelector('.js-video').querySelector('video');
            videoList.push({url:video.src, title: document.title});
            pageTitle = document.title;
        }
    }
    if(videoList.length){
        var html = [], url, title;
        html.push('<dl class="parser-list">');
        html.push('<dt>'+ pageTitle +'</dt>');
        videoList.forEach(function(item, i){
            item.url = (item.mp4Hd_url || item.mp4_url || item.url_mp4 || item.url || '#');
            item.title = (item.title || item.alt || document.title);
            html.push('<dd>视频'+ parseInt(i+1) +'：<a target="_blank" href="'+ item.url +'">'+ item.title +'</a>&nbsp;&nbsp;<a target="_blank" href="'+ item.url +'" download="'+ item.title +'">下载</a></dd>');
        });
        html.push('</dl>');
        var style = [];
        style.push('<style type="text/css">');
        style.push('.parser{position:fixed;right:0;bottom:0;left:0px;z-index:99999;background-color:rgba(255,255,255,0.45);padding-top:50px;}');
        style.push('.parser-list{max-width:640px;margin:0 auto;padding-bottom:10px;background-color:rgba(255,255,255,0.95);line-height:2em;border-radius:15px 15px 0 0;overflow:hidden;border:5px #5da4ef solid;box-shadow: 0 0 30px 10px #0f66c1;}');
        style.push('.parser-list>dt{background-color:#eee;font-size:24px;padding:10px;}');
        style.push('.parser-list>dd{border-top:1px #ccc solid;padding:10px 10px;}');
        style.push('.parser-list a{color:#3d93ef;}');
        style.push('.parser-list a:hover{text-decoration:underline;}');
        style.push('</style>');
        if(document.getElementById('parser')){
            document.body.removeChild(document.getElementById('parser'));
        }
        var $parser = document.createElement('div');
        $parser.id = 'parser';
        $parser.className = 'parser';
        $parser.innerHTML = style.join('') + html.join('');
        document.body.appendChild($parser);
    }else{
        if(location.host=='c.m.163.com'){
            if(confirm('切换到：3g.163.com 可查看视频')){
                var href = location.href.replace('c.m.163.com/news/a/', '3g.163.com/all/article/');
                location.href = href;
            }
        }
    }
	try{
		document.querySelector('.g-top-slider').remove();
		document.querySelector('.js-slider').remove();
		document.querySelector('.doc-footer-wrapper').remove();
		document.querySelector('.m-slider-footer').remove();
	}catch(ex){}
})();