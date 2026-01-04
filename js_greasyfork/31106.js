// ==UserScript==
// @name         自动获取JAVLIB的字幕
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  自动获取JAVLIB的字幕，暂时只支持JAVLIB。
// @author       bestYy
// @include     http*://*javlibrary.com/*
// @include     http*://*javlib.com/*
// @include     http*://*javl10.com/*
// @include     http*://*jav11b.com/*
// @include     http*://*13vlib.com/*
// @include     http*://*d21b.com/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/31106/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96JAVLIB%E7%9A%84%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/31106/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96JAVLIB%E7%9A%84%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("#divZm{margin-left:70px;}");
    var japonxUrl = "https://www.japonx.net";
    $("#video_cast").after("<div id='divZm'>正在查询字幕...</div>");
    var my = {
    	getFh:function(){
            var fh = $("td.text").html();
            var star = $('#video_cast').find('span.star').find('a').html();
    		return {fh:fh, star:star};
    	},
    	getZm:function(fh, star){
    		GM_xmlhttpRequest({
    			method:"GET",
                url: japonxUrl + "/portal/index/search.html?k=" + fh,
                headers: {
                    'user-agent': 'mozilla/4.0 (compatible) greasemonkey',
                    'accept': 'application/atom+xml,application/xml,text/xml',
                },
    			onload:function(result){
                    //搜索番号
                     var doc = result.responseText;
                     doc = doc.replace(/[\r\n]/g,"");
                     var re = new RegExp('<ul id="works" class="normal clearfix">.*<li>.*<a href="(.*)".*<img.*' + star + '<\/a>');
                     var arr = doc.match(re);
    				 if(!arr){
    				 	$("#divZm").html("暂无字幕");
    				 	return ;
                     }
                     var fhUrl = japonxUrl + arr[1];
                     //搜索字幕
                     GM_xmlhttpRequest({
                        method:"GET",
                        url: fhUrl,
                        headers: {
                            'user-agent': 'mozilla/4.0 (compatible) greasemonkey',
                            'accept': 'application/atom+xml,application/xml,text/xml',
                        },
                        onload:function(result){
                             var doc = result.responseText;
                             var re2 = new RegExp(fh);
                             var re = /中文/;
                             var arr = doc.match(re);
                             var arr2 = doc.match(re2);
                             if(arr && arr2){
                                $("#divZm").html('<b>字幕下载地址：</b><a href="'+ fhUrl +'" target="_blank">'+ fhUrl +'</a><b>请复制地址在浏览器打开，否则会出现404</b>');
                                return ;
                             }
                             $("#divZm").html("暂无字幕");
                             return ;
                        },
                        onerror:function(e){
                            console.log('搜索字幕出现错误');
                        }
                    });
    			},
    			onerror:function(e){
    				console.log('搜索字幕出现错误');
    			}
    		});
        },
    };
    var info = my.getFh();
    console.log('info', info);
    my.getZm(info.fh, info.star);
})();