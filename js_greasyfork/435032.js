// ==UserScript==
// @name         豆瓣读书翻页
// @namespace    https://*.douban.com/
// @version      0.7
// @description  现在跳出豆瓣读书也能跳回来了。算是利用了豆瓣的一个bug？
// @author       Pegasus
// @match        https://www.douban.com/people/*/statuses**
// @match        https://*.douban.com/*
// @match        https://www.douban.com/?p=*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435032/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/435032/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("我的脚本");
    console.log(window.location);
    var douban_fanye_settings = {
        "sub_domain": "book",
    };
    // TODO 通过用户界面设定～
    GM_setValue("douban_fanye_settings", douban_fanye_settings)
    var reg=/https?:\/\/www.douban.com\/people\/([^\/]+)\/statuses.*/g;

    var reg1=/https?:\/\/.*.douban.com\/(.*)\/(\d+)/g;
	var result=reg1.exec(window.location);
	if(result && result.length==3){
        var sub_domain = GM_getValue("douban_fanye_settings").sub_domain;
        var current_page = parseInt(result[2]);
        console.log(sub_domain);
        if (!window.location.href.includes(sub_domain)){
            setTimeout(() => {console.log("2s后自动向后翻页", "https://book.douban.com/" + result[1] + "/" + (current_page + 1)); }, 2000);
            // console.log();
            window.open("https://book.douban.com/" + result[1] + "/" + (current_page + 1), "_self");
            //

        }else{
            console.log("不用自动翻页", sub_domain);
        };
		// console.log(result[1]);
        // 注册翻页时间
        document.onkeydown = function() {
        if (event.keyCode == 39 ){
            console.log("向后翻页");
            window.open("https://book.douban.com/" + result[1] + "/" + (current_page + 1), "_self");
            };
          if (event.keyCode == 37 ){
            console.log("向前翻页");
            window.open("https://book.douban.com/" + result[1] + "/" + (current_page - 1), "_self");
            };
        }
	}else{
        //window.alert("跳出自增id页面。");
        console.log("未发现", window.location.href);
    }

    // Your code here...
})();