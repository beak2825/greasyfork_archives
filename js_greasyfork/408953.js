// ==UserScript==
// @name         公众号文章里面视频
// @namespace    https://console.tebieshuang.xyz
// @supportURL   https://console.tebieshuang.xyz
// @version      4.4.2
// @description  元初芸提供标准化的零售行业标准SAAS，为您便捷、快速地完成微信相关公众号、小程序的快速部署！！ https://console.tebieshuang.xyz
// @author       Leo
// @include      *://mp.weixin.qq.com/s/*
// @include      *://mp.weixin.qq.com/s?*
// @include      *//v.qq.com/x/page/*
// @include      *//v.qq.com/x/cover/*
// @include      /^https:\/\/www\.ixigua\.com\/([\d]+).*$/
// @include      /^https:\/\/www\.iesdouyin\.com\/share\/video\/([\d]+).*$/
// @resource     REMOTE_CSS https://cdn.bootcdn.net/ajax/libs/toastify-js/1.11.0/toastify.min.css  
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastify-js/1.11.0/toastify.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_download
// @grant 		 GM_setClipboard
// @grant        unsafeWindow
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/408953/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%87%8C%E9%9D%A2%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/408953/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%87%8C%E9%9D%A2%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	const myCss = GM_getResourceText( "REMOTE_CSS" );
	GM_addStyle( myCss );
	
	GM_addStyle(`html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;vertical-align:baseline;box-sizing:border-box;outline:none;}.ycy-body{margin:0 -25px;}.ycy-card-container{margin:0 25px;padding:20px;background:#fff;border-radius:8px;}.ycy-clear{clear:both;}h2.ycy-logo-container{font-size:34px;}.ycy-card-title{margin-bottom:15px;font-size:24px;}.ycy-card-item{padding:9px 0;margin:9px 0;border-top:1px solid #f3f3f3;width:100%;}.ycy-card-item:first-of-type{border-top:none;}.ycy-card-item:last-of-type{padding:9px 0 0;margin:9px 0 0;}.ycy-card-content{padding-top:25px;}.ycy-layout{width:100vw;height:100vh;display:flex;flex-direction:column;background:#ddd;}.ycy-container{max-width:1200px;padding:0 15px;margin:0 auto;}.ycy-header{height:68px;line-height:68px;width:100%;background:#202935;}.ycy-top{height:100%;display:flex;}.ycy-logo{flex:1;}.ycy-logo-container{color:#00a4ff;}.ycy-nav{margin-left:15px;height:100%;}.ycy-nav a{color:#fff;text-decoration:none;height:100%;display:inline-block;padding:0 20px;font-size:16px;}.ycy-nav a.ycy-nav-active{color:#00a4ff;border-bottom:2px solid #00a4ff;}.ycy-content{flex:1;overflow-y:auto;padding:25px 0;}.ycy-footer{background:#202935;padding:15px 0;text-align:center;color:#ccc;}@media screen and (max-width:800px){.ycy-nav a{padding:0 10px;font-size:14px;}}.ycy-home-list{width:50%;float:left;margin-bottom:25px;}.ycy-home-set-item{display:flex;align-items:center;width:100%;}.ycy-home-set-left{flex:1;}.ycy-home-set-desc{font-size:0.ycy-5em;}.ycy-home-set-value{margin-left:10px;}@media only screen and (max-width:800px){.ycy-home-list{width:100%;}}#yuanchuyun{width:100vw;height:100vh;background:#F8F8F8;position:fixed;top:0;left:0;z-index:99999;}#yuanchuyun div{font-size:15px;}#ycy-close{padding-top:50px;text-align:center;}#ycy-close a{padding:10px 20px;color:#fff;background:#00a4ff;border-radius:10px;}.ycy-value-btn{padding:3px 8px;display:inline-block;color:#fff;background:#00a4ff;border-radius:4px;margin-left:10px;font-size:12px;cursor:pointer;font-style:normal}`);
	
	/**
	 * 显示消息
	 * @param {Object} content
	 */
	function ycy_show_message( content, insert ){
		let html, e = window.document.createElement( 'div' );
		e.setAttribute( 'id', 'yuanchuyun' );
		html = '<div class="ycy-layout"><div class="ycy-header"><div class="ycy-top ycy-container"><div class="ycy-logo"><h2 class="ycy-logo-container">元初芸</h2></div><div class="ycy-nav"><a class="ycy-nav-active" target="_blank" href="https://console.tebieshuang.xyz">首页</a><a target="_blank" href="https://console.tebieshuang.xyz/login">登录</a></div></div></div><div class="ycy-content"><div class="ycy-container"><div class="ycy-body"><div class="ycy-home-list"><div class="ycy-card-container"><h3 class="ycy-card-title">视频信息</h3><div class="ycy-card-item">视频标题：' + content.title + '<i class="ycy-value-btn" data-value="' + content.title + '">点击复制</i></div><div class="ycy-card-item">视频图片：<a target="_blank" href="' + content.image + '">点击这里查看</a><i class="ycy-value-btn" data-value="' + content.image + '">点击复制</i></div>';
		if( content.vid ){
			html += '<div class="ycy-card-item">视频VID：' + content.vid + '<i class="ycy-value-btn" data-value="' + content.vid + '">点击复制</i></div>';
		}
		if( content.src ){
			html += '<div class="ycy-card-item">播放地址：<a target="_blank" href="' + content.src + '">点击这里查看</a><i class="ycy-value-btn" data-value="' + content.src + '">点击复制</i></div>';
		}
		if( content.href ){
			html += '<div class="ycy-card-item">网页地址：<a target="_blank" href="' + content.href + '">点击这里查看</a><i class="ycy-value-btn" data-value="' + content.href + '">点击复制</i></div>';
		}
		if( content.stitle ){
			html += '<div class="ycy-card-item">备选标题：' + content.stitle + '<i class="ycy-value-btn" data-value="' + content.stitle + '">点击复制</i></div>';
		}
		if( content.simage ){
			html += '<div class="ycy-card-item">备选图片：<a target="_blank" href="' + content.simage + '">点击这里查看</a><i class="ycy-value-btn" data-value="' + content.simage + '">点击复制</i></div>';
		}
		html += '</div></div><div class="ycy-home-list"><div class="ycy-card-container"><h3 class="ycy-card-title">如何填写</h3><div class="ycy-card-item"><div class="ycy-home-set-item"><div class="ycy-home-set-left"><div class="ycy-home-set-name">视频托管</div></div><div class="ycy-home-set-value">' + insert.method + '</div></div></div>';
		if( insert.vid ){
			html += '<div class="ycy-card-item"><div class="ycy-home-set-item"><div class="ycy-home-set-left"><div class="ycy-home-set-name">视频VID</div></div><div class="ycy-home-set-value">' + insert.vid + '</div></div></div>';
		}
		if( insert.href ){
			html += '<div class="ycy-card-item"><div class="ycy-home-set-item"><div class="ycy-home-set-left"><div class="ycy-home-set-name">视频播放地址</div></div><div class="ycy-home-set-value">' + insert.href + '</div></div></div>';
		}
		if( insert.mid ){
			html += '<div class="ycy-card-item"><div class="ycy-home-set-item"><div class="ycy-home-set-left"><div class="ycy-home-set-name">媒体ID</div></div><div class="ycy-home-set-value">' + insert.mid + '</div></div></div>';
		}
		html += '</div></div><div class="ycy-clear"></div></div><div id="ycy-close"><a href="javascript:;" id="ycy-close-btn">点击这里关闭</a></div></div></div><div class="ycy-footer">元初芸 @copyright 版权所有</div></div>';
		e.innerHTML = html;
		window.document.body.appendChild( e );
		ycy_event();
		GM_download(content.image, content.title + '.jpg');
		if( content.simage ){
			GM_download(content.simage, content.title + ' - 备选图片.jpg');
		}
		if( content.src ){
			GM_download( content.src, content.title + '.mp4' );
		}
	}
	
	/**
	 * 绑定事件
	 */
	function ycy_event(){
		setTimeout( function(){
		    window.document.querySelector('#ycy-close-btn').addEventListener('click', function(){
		        let e = window.document.querySelector( '#yuanchuyun' );
		        e.parentNode.removeChild( e );
		    }, false);
			new ClipboardJS( '.ycy-value-btn', {
			    text: function(e) {
			        return e.getAttribute('data-value');
			    }
			}).on('success', function() {
				Toastify({
					text: "复制成功",
					duration: 3000,
					position: "center"
				}).showToast();
			});
		}, 800 );
	}
	
	/**
	 * 解析小马哥的视频
	 * @param {Object} vid
	 * @param {Object} sImage
	 * @param {Object} sTitle
	 */
	function ycy_parse_qq_video( vid, sImage, sTitle ){
		window.ycy_video_cb = function (data) {
		   let video = data.vl.vi[0], src = 'https://ugcws.video.gtimg.com/' + video.fn + '?vkey=' + video.fvkey, image = 'https://shp.qpic.cn/qqvideo/0/' + vid + '/0', title = video.ti || '没有找到标题';
		   ycy_show_message({title: title, image: image, vid:vid, src:src, href: 'https://v.qq.com/x/page/' + vid + '.html', stitle: sTitle, simage: sImage}, {vid: vid, method: "使用腾讯的视频"});
		};
		let url = "http://vv.video.qq.com/getinfo?vids="+vid+"&platform=101001&charge=0&otype=json&callback=ycy_video_cb";
		GM_xmlhttpRequest({method:"GET",url:url,onload: function(response){if (response.status == 200){eval(response.responseText);}}});
	}
	
	/**
	 * 解析公众号内嵌视频
	 * 
	 * @param {Object} vid
	 * @param {Object} image
	 * @param {Object} title
	 * @param {Object} sImage
	 * @param {Object} sTitle
	 */
	function ycy_parse_mp_video( vid, image, title, sImage, sTitle ){
		GM_xmlhttpRequest({
			url: 'https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&vid=' + vid,
			method: 'GET',
			responseType: 'json',
			onload: function( e ){
				if( e.response && e.response.url_info && e.response.url_info.length > 0 ){
					ycy_show_message({title: title, image: image, vid: vid, src: e.response.url_info[0].url, stitle: sTitle, simage: sImage }, {mid: vid, method: "公众号的素材库"});
				}
			}
		});
	}
	
	/**
	 * 查询一下公众号文章的数据
	 * @param {Object} url
	 */
	function ycy_mp_video( url, sImage, sTitle ){
		url = url.indexOf('?') !== -1 ? url + '&f=json' : url + '?f=json';
		GM_xmlhttpRequest({method: "GET", responseType: "json", overrideMimeType: "application/json", url: url, onload: function(res){if (res.status == 200){
			let result = res.response, videoInfo = result.video_page_info || {}, content = result.content_noencode || "", vid, title, image, src;
			if( Object.keys( videoInfo ).length > 0 ){
				//这个是内嵌了视频
				vid = result.video_ids[0];
				title = result.title;
				image = result.cdn_url_16_9 || videoInfo.cover_url || result.cdn_url;
				src = videoInfo.mp_video_trans_info[0].url;
				ycy_show_message({title: title, image: image, vid:vid, src:src, stitle: sTitle, simage: sImage }, {mid: vid, method: "公众号的素材库"});
			}else if( result.video_ids && result.video_ids.length > 0 ){
				vid = result.video_ids[0];
				title = result.title;
				image = result.cdn_url_16_9 || result.cdn_url || 'https://shp.qpic.cn/qqvideo/0/' + vid + '/0';
				vid.substring(0, 4) == 'wxv_' ? ycy_parse_mp_video( vid, image, title, sImage, sTitle ) : ycy_parse_qq_video( vid, sImage, sTitle );
			}
		}}});
	}
	
	/**
	 * 解析腾讯视频
	 * @param {Object} url
	 */
	function ycy_qq_video( url ){
		let vid = url.split('/').pop().split('.html')[0];
		ycy_parse_qq_video( vid );
	}
	
	/**
	 * 解析西瓜视频
	 */
	function ycy_xigua_video(){
		setTimeout( function(){
			let url = window.document.querySelectorAll('meta[name="og:url"]')[0].getAttribute( 'content' ), image = window.document.querySelectorAll('meta[name="og:image"]')[0].getAttribute( 'content' ), title = window.document.querySelectorAll('meta[name="og:title"]')[0].getAttribute( 'content' ).replace(' - 西瓜视频', '');
			ycy_show_message({title: title, image: image, href: url}, {href: url, method: "使用第三方解析"});
		}, 800 );
	}
	
	/**
	 * 解析抖音
	 */
	function ycy_douyin_video(){
		setTimeout( function(){
			let url = window.location.href.split('?')[0], image = window.document.querySelectorAll('.video-player-bg')[0].style.backgroundImage.replace(/(url\(|\)|")/g, ''), title = window.document.querySelectorAll('.desc')[0].textContent;
			ycy_show_message({title: title, image: image, href: url}, {href: url, method: "使用第三方解析"});
		}, 800 );
	}
	
	/**
	 * 解析视频
	 */
	function ycy_parse_video(){
		let url = window.location.href;
		if( url.indexOf('mp.weixin.qq.com') !== -1 ){
			let t = document.querySelector('meta[property="og:title"]'), i = document.querySelector('meta[property="og:image"]'), title, image;
			if( t !== null ){
				title = t.getAttribute('content')
			}
			if( i !== null ){
				image = i.getAttribute('content');
			}
			url = url.split('#')[0];
			ycy_mp_video( url, image, title );
		}else if( url.indexOf( 'v.qq.com' ) !== -1 ){
			ycy_qq_video( url );
		}else if( url.indexOf( 'ixigua.com' ) !== -1 ){
			ycy_xigua_video();
		}else if( url.indexOf('iesdouyin.com') !== -1 ){
			ycy_douyin_video();
		}
	}
	ycy_parse_video();
	window.onpopstate = function(event) {
	  ycy_parse_video();
	};
})();