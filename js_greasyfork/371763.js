// ==UserScript==
// @name         豆瓣TOP250电影下载
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  添加一个一键查找豆瓣电影TOP250（https://movie.douban.com/top250）的资源的按钮。
// @author       dianli
// @supportURL   dianligegege@163.com
// @match        https://movie.douban.com/top250*
// @grant        none
// @require       https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371763/%E8%B1%86%E7%93%A3TOP250%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/371763/%E8%B1%86%E7%93%A3TOP250%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
   //'use strict';
   window.setTimeout(function() {
//       alert('Hello world!');
       $(".bd").find("p:last").append("<spend class='tmdownload '><a>下载</a></spend>");
       //添加下载标签
       $(".tmdownload").css({
				"color":"#bbbbbb",
				"font-size":"12px",
				"text-align":"center",
				"cursor":"pointer"
		});
       //鼠标移入效果
       $(".tmdownload a").hover(function(){
			$(this).css({
			"color": "#ffffff",
		//	"display":"inline-block",
			"border-left": "1px solid #FF9999",
			'border-top': '1px solid #FF9999',
			'border-right': '1px solid #FF3333',
			'border-bottom': '1px solid #FF3333',
			'background-color': '#773333',
			'text-align': 'center'
			})
		},function(){
           $(this).css({
			"color": "#bbbbbb",
			"font-size": "12px",
			"text-align": "center",
			"cursor": "pointer",
            'background-color': '#ffffff',
			"border":"none"
               })
		});
       //网页跳转
       $(".tmdownload").click(function(){
			var title=$(this).parent().parent().prev().find('.title').first().text();
			//console.log(title);
           	window.open('http://www.dysfz.vip/key/'+title+'/');
		});
   }, 60);
    
 })();