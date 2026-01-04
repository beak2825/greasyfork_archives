// ==UserScript==
// @name         直播接口改potplayer播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将txt格式的直播接口改成直观的图文列表
// @match        http://api.hclyz.com:81/mf/*.txt*
// @match        http://api.zbjk.xyz:81/luo/*.txt*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391831/%E7%9B%B4%E6%92%AD%E6%8E%A5%E5%8F%A3%E6%94%B9potplayer%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/391831/%E7%9B%B4%E6%92%AD%E6%8E%A5%E5%8F%A3%E6%94%B9potplayer%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = "\u0070\u006f\u0074\u0070\u006c\u0061\u0079\u0065\u0072\u76d2\u5b50";
    var add="",num="",img="",li="",list=[];
    var html = document.querySelector("body pre").innerHTML;
	var style = document.createElement('style');
	style.innerHTML = '*{margin:0;padding:0;list-style:none;box-sizing:border-box;scroll-behavior:smooth;}'
                     +'ul{width:100%;height:100%;overflow:hidden;overflow-y:scroll;-webkit-overflow-scrolling: touch;}'
                     +'li{float:left;padding:10px;overflow:hidden;}'
                     +'.img{width:100%;height:auto;padding-bottom:100%;overflow:hidden;position:relative}'
                     +'img{width:100%;height:100%;position: absolute;}'
                     +'.title{width:100%;text-align:center;word-break: keep-all;white-space: nowrap;overflow:hidden;transition:all .3s}'
                     +'li:hover .title{color:#f93ab3}';
    document.head.appendChild(style);
    var c = isNaN(window.location.href.split("?")[1])?"width:25%":"width:"+100/window.location.href.split("?")[1]+"%";
    html.indexOf("pingtai")>0?(list = JSON.parse(html).pingtai,img = "xinimg"):(list = JSON.parse(html).zhubo,img = "img")
    for(var i = 0;i<list.length;i++){
        list[i].Number!=null?(num = "("+ list[i].Number +")",add = list[i].address+window.location.search):(num="",add = "potplayer://"+list[i].address);
        var title = list[i].title.replace(/%25/g,"%").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%3F/g,"?").replace(/%20/g," ").replace(/%7E/g,"~").replace(/%5E/g,"^");
        li+='<li style="'+c+'"><p class="img"><a target="_blank" href="'+add+'"><img src="'+list[i][img]+'"></a></p><p class="title">'+title+num+'</p></li>';
    }
    document.querySelector("body").innerHTML = "<ul>"+li+"</ul>";

})();