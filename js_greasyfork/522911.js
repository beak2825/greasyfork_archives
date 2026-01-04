// ==UserScript==
// @name         【VIP视频免费观看-VIP视频解析】
// @namespace    XUEWUHEN
// @version      1.3.0
// @description  【VIP视频免费观看-VIP视频解析】腾讯、爱奇艺、优酷、乐视、土豆、B站等网站VIP视频解析
// @author       XUEWUHEN
// @match        *://v.qq.com/*
// @match        *://*.iqiyi.com/v_*
// @match        *://v.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @license      GPL License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522911/%E3%80%90VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/522911/%E3%80%90VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(
				'.dropdown {display: inline-block;margin-top: 120px;position: fixed;z-index: 999;}'+
                '#dropdownButton {background-color: cyan;}'+
				'.dropdown-content {display: none;background-color: #f9f9f9;min-width: 160px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);z-index: 1;}'+
				'.dropdown-content button {color: black;padding: 12px 16px;text-align: left;text-decoration: none;display: block;width: 100%;border: none;background-color: transparent;}'+
				'.dropdown-content button:hover {background-color: #f1f1f1;}'+
				'.dropdown:hover .dropdown-content {display: block;}'
			)
           // console.log(111)
           var ss = window.location.href;
           console.log(ss)
           // console.log(222)

            if(ss.indexOf("jd.com")=="-1" ){
				if(ss.indexOf("v.qq.com") > 0 || ss.indexOf("iqiyi.com") > 0 || ss.indexOf("v.youku.com") > 0 || ss.indexOf("le.com") > 0 || ss.indexOf("tudou.com") > 0 || ss.indexOf("mgtv.com") > 0 || ss.indexOf("sohu.com") > 0 || ss.indexOf("acfun.cn") > 0 || ss.indexOf("bilibili.com") > 0 || ss.indexOf("vip.1905.com") > 0 || ss.indexOf("vip.pptv.com") > 0 || ss.indexOf("v.yinyuetai.com") > 0 || ss.indexOf("fun.tv") > 0){
					// console.log(333);
                      if( ss.indexOf("url=https") < 0 ){
					// 动态创建按钮元素
					const dropdownButton = document.createElement('button');
					dropdownButton.id = "dropdownButton";
					dropdownButton.innerText = 'VIP解析';
					dropdownButton.style.padding = '10px 20px';
					dropdownButton.style.fontSize = '16px';

					// 动态创建下拉列表元素
					const dropdownContent = document.createElement('div');
					dropdownContent.className = 'dropdown-content';

					// 将下拉列表元素添加到按钮元素之后，并包裹在一个div中以便应用样式
					const dropdownWrapper = document.createElement('div');
					dropdownWrapper.className = 'dropdown';
					dropdownWrapper.appendChild(dropdownButton);
					dropdownWrapper.appendChild(dropdownContent);
                    document.body.insertBefore(dropdownWrapper, document.body.firstChild);
					// console.log(444);

					var myUrlList = [ 
					{
						url: "https://www.ckplayer.vip/jiexi/?url=",
						id: "ckplayer",
						name:"ckplayer"
					}, {
						url: "https://tv.woaimoon.net/label/v.html?url=",
						id: "woaimoon",
						name:"月亮网"
					}, {
						url: "https://yparse.ik9.cc/index.php?url=",
						id: "yparse",
						name:"云解析"
					}, {
						url: "https://jx.m3u8.tv/jiexi/?url=",
						id: "m3u8",
						name:"M3U8解析"
					}, {
						url: "https://www.pouyun.com/?url=",
						id: "pouyun",
						name:"剖元"
					}, {
						url: "https://jx.xmflv.com/?url=",
						id: "xmflv",
						name:"虾米"
					}, {
						url: "https://www.yemu.xyz/?url=",
						id: "yemu",
						name:"夜幕"
					}, {
						url: "https://jx.nnxv.cn/tv.php?url=",
						id: "nnxv",
						name:"七哥"
					}, {
						url: "https://www.8090g.cn/?url=",
						id: "8090g",
						name:"8090解析"
					} ];
					myUrlList.forEach(optionText => {
						const optionButton = document.createElement('button');
						optionButton.id = optionText.id
						optionButton.innerText = optionText.name;
						dropdownContent.appendChild(optionButton);
						optionButton.addEventListener("click",function(){
                            var ss = window.location.href;
					        // console.log(555);
							window.open(optionText.url + ss);
						})
					});
					// document.body.insertBefore(dropdownWrapper, document.body.firstChild);
				}
            }
			}
})();