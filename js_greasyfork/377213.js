// ==UserScript==
// @name         自动复制Issues内容
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  自动复制gitlab里的issue内容到剪切板,可直接粘贴到tower上使用.
// @author       LiTao
// @match        https://git.marykay.com.cn/*/issues
// @match        https://git.marykay.com.cn/*/issues/*
// @require        http://code.jquery.com/jquery-1.11.0.min.js
// @require        https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377213/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6Issues%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/377213/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6Issues%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var copyToClipBoard = function(text){
    	const input = document.createElement('input');
	    document.body.appendChild(input);
	    input.setAttribute('value', text);
	    input.select();
	    if (document.execCommand('copy')) {
	        document.execCommand('copy');
	        console.log('复制成功');
	    }
	 	document.body.removeChild(input);
    };

    var btn = $("<button type='button' class='copy_issue'>复制</button>");
    $(".issue-title-text").append(btn);
    $(".issue-title-text").on("click",".copy_issue",function(){
    	var obj = $(this);
		obj = obj.parents(".issue-title-text")[0];
		obj = $(obj).find("a")[0];
		var href = $(obj).attr("href");

    	var list = href.split("/");
    	var str = $(obj).text();
    	str = "[IOS] " + "#" + list.pop() + str;
    	copyToClipBoard(str);
    });

    var url = window.location.href;
    if (url.split("/").pop() > 0){
    	$(".title-container h2").append(btn);
    	$(".copy_issue").click(function(){
    		var btn = $(this);
    		var h2 = $(btn).parents("h2");
    		var str = $(h2).text();
    		str = "[IOS] " + "#" + url.split("/").pop() + str;
	    	copyToClipBoard(str);
    	});

    };
})();