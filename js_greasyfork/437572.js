// ==UserScript==
// @icon         https://github.githubassets.com/favicon.ico
// @name         镜像访问Github
// @version      0.1
// @description  支持git命令行克隆加速命令复制，镜像快速访问，下载切换镜像源
// @author       waahah
// @license      GPL License
// @match        *://github.com/*
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @grant             GM_setClipboard
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @namespace https://greasyfork.org/users/856508
// @downloadURL https://update.greasyfork.org/scripts/437572/%E9%95%9C%E5%83%8F%E8%AE%BF%E9%97%AEGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/437572/%E9%95%9C%E5%83%8F%E8%AE%BF%E9%97%AEGithub.meta.js
// ==/UserScript==

(function() {
    'use strict';


$(function(){

     var location = window.location.href;
     var InterfaceList = [ {"name":"香港镜像","url":"https://hub.fastgit.org"},
                           {"name":"新加坡镜像","url":"https://github.com.cnpmjs.org"},
                           {"name":"浙江clone","url":"https://gitclone.com"},
                           {"name":"韩国Download","url":"https://ghproxy.com"}
                         ]
     var str = window.location.pathname;
	 var webUrl = InterfaceList[0].url + str;
     var str1 = "git clone ";
	 var a = location.split("/");
	 var b = a[5] === "wiki" ? ".wiki" : "";
	 var str2 = "/" + a[3] + "/" + a[4] + b + ".git";
	 var clone_utl1 = str1 + InterfaceList[0].url +str2;
     var url1 = InterfaceList[3].url +"/"+window.location.host+"/"+a[3]+"/"+a[4]+ "/archive/refs/heads/master.zip";
    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function css(css) {
		var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
		doc.appendChild(myStyle);
	}

	css(`#zuihuitao {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
			#zuihuitao .logo { position: absolute;right: 0; width: 22px;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: #00aa00;}
            #zuihuitao .logo #m {text-decoration: none;color: #fff;font-size:12px;}
			#zuihuitao .die {display:none; position:absolute; left:23px; top:0; text-align:center;background-color:#04B4AE; border:1px solid gray;}
			#zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 8px;list-style-type: none;}
			#zuihuitao .die li:hover{color:#fff;background:#FE2E64;}
            #zuihuitao .die li a {text-decoration: none;color: #fff;font-size:12px;}
			.add{background-color:#FE2E64;}`);

	var html = $(`<div id='zuihuitao'>
		    <div class='item_text'>
		        <div class="logo"><a id="m">加速</a></div>
		            <div class='die' >
		                <div style='display:flex;'>
		                    <div style='width:128px; padding:0px 0;'>
		                    <br>
		                        <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>镜像访问</div>
		                        <ul style='margin:0 24px;'>
		                            <li id="li0">快速浏览</li>
		                            <div style='clear:both;'></div>
		                        </ul>
		                        <br>
		                        <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>快速克隆</div>
		                        <ul style='margin:0 25px;'>
		                            <li id="li2">复制命令</li>
		                            <div style='clear:both;'></div>
		                        </ul>
                                <br>
                                <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>文件下载</div>
		                        <ul style='margin:0 25px;'>
		                            <li id="li3"><a href="${url1}" rel="nofollow">点击下载</li>
		                            <div style='clear:both;'></div>
		                        </ul>
		                        <br>
							</div>`);

	$("body").append(html);
	$(".item_text").on("mouseover", () => {
	        $(".die").show();
	    });
	    $(".item_text").on("mouseout", () => {
	        $(".die").hide();
	    });
	// 事件处理
	$("#li0").bind("click", () => {
              window.location.href = webUrl ;
	});
    //
    $("#li2").bind("click", () => {
            GM_setClipboard(clone_utl1)
            alert("复制成功")
    });
    $("#li3").bind("click", () => {
            //window.open(str3,"_blank");
    });

});

})();