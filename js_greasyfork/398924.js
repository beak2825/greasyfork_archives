// ==UserScript==
// @name         自动替换 github 下载地址
// @namespace    undefined
// @version      0.1
// @description  将 github.com 替换成 github.strcpy.cn, 这样子下载就可以加速了
// @author       江南小虫虫
// @match        *://github.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/398924/%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20github%20%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/398924/%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20github%20%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(window.location.href.search("releases") != -1){
        // release 页面
        var links = $(".Box.Box--condensed.mt-3").find('a');
        links.each(function(index,value){
            var new_link = "https://github.strcpy.cn" + $(this).attr("href");
            $(this).attr("href", new_link);
            console.log("新链接: " + $(this).attr("href"));
        });
    }else{
        //flex-1 btn btn-outline get-repo-btn
        // 先找 github 页面的压缩包
        var github_link = $(".flex-1.btn.btn-outline.get-repo-btn");
        var t = github_link.attr("href");
        if(typeof(t) != "undefined"){
            var new_link = "https://github.strcpy.cn" + t;
            console.log("测试: "+ github_link.attr("href"));
            console.log("新链接: " + new_link);
            github_link.attr("href", new_link);
        }else{
            console.log("不是需要下载的两个页面之一");
        }
    }
})();
