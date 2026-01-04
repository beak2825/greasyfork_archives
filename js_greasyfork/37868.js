// ==UserScript==
// @name         Google App Downloader
// @namespace    mscststs
// @version      0.1
// @description  基于Apkpure的应用商店下载器
// @author       You
// @match        *://play.google.com/store/*
// @match        *://apkpure.com/cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37868/Google%20App%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/37868/Google%20App%20Downloader.meta.js
// ==/UserScript==

(function() {
	'use strict';
	console.log("hello dler");
	let my = window.location.href+"";
	if(/https?:\/\/play\.google\.com/.test(my)){
		$().ready(()=>{
			$(document).on("DOMNodeInserted",".main-content",function(e){
				console.log($(this).find(".apps.large.play-button.buy-button-container").length);
				//<span id="dler-helper"><span class="large play-button"><button><span>下载APK</span>  </button></span></span>
				if($(this).find(".apps.large.play-button.buy-button-container[data-docid]").length>0){
					let pa = $(this).find(".apps.large.play-button.buy-button-container[data-docid]").parent();
					if(pa.find("#dler-helper").length>0){
						//该按钮已存在
					}else{
						pa.append(`<span id="dler-helper"><span class="large play-button"><button><span>下载APK</span>  </button></span></span><style>#dler-helper .play-button,#dler-helper button{cursor:pointer}</style>`);
					}
				}
			});
			$(document).on("click","#dler-helper",function(e){
				let h = window.location.href+"";
				let index = h.indexOf("?id=")+4;
				let id = h.substr(index,10000);
				//alert(id);
				let src = `https://apkpure.com/cn/${id}`;
				//console.log("qewqwe");
				if(confirm("点击确定，预计将在5s内开始下载，如果下载没有开始，说明该APP无法下载。")){
					$("body").append("<iframe src="+src+" style='position=absolute;' top='-100px' left='-100px'   width='1px' height='1px'></iframe>");
					$("#dler-helper").attr("disabled","disabled");
					setTimeout(function(){$("#dler-helper").removeAttr("disabled");},5e3);
				}
			});
		});
	}else{
		if (self != top) {
			//console.log($("body").length);
			$(document).ready(function(){
				//setTimeout(function(){$("a.btn-success").click();},3e3);
				function fake_click(obj) {
					/* 该函数用于解决click事件无法下载东西的尴尬 */
					var ev = document.createEvent("MouseEvents");
					ev.initMouseEvent(
						"click", true, false, window, 0, 0, 0, 0, 0
						, false, false, false, false, 0, null
					);
					obj.dispatchEvent(ev);
				}
				fake_click($("div.ny-down>a.da")[0]);
				//$(".btn.btn-primary.btn-lg.btn-block").click();
			});
		}

	}
})();