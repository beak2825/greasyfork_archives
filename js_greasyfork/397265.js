// ==UserScript==
// @name         18acg图片预览加载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将图片地址加载
// @author       logicycle
// @match        https://awacgg2.vip/*
// @license      AGPL
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397265/18acg%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/397265/18acg%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $(function(){
        $(".t_fsz td").append("<div id='startIMG'></div>");
        var $startIMG = $("#startIMG");
		$(".t_fsz td font").each(function(i){
            if ($(this).children().length > 0)
                return true;
			let url = $(this).text();
			console.log(url);
			if (url != 0 && url.indexOf("http") == 0){
                $(this).remove();
                let content = "<img src='" +url+ "' class='zoom' onclick='zoom(this, this.src, 0, 0, 0)' width='770' inpost='1' initialized='true'>"
                $startIMG.prepend(content);
			}
		});
     })
    // Your code here...
})();