// ==UserScript==
// @name         NGA-NoAd
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @author       Githuboy
// @description  去除NGA论坛广告
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @grant       GM_addStyle
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/430584/NGA-NoAd.user.js
// @updateURL https://update.greasyfork.org/scripts/430584/NGA-NoAd.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id =0;
    const _fixStyle = function(){
        GM_addStyle(".goodbad span[title]{color:inherit !important}")
    }
    var $ = window.jQuery||{};
    var findUrl = function(url){
        var idx = url.indexOf("?5");
        var len = 2;
        if(idx<0){
            idx = url.indexOf("?");
            len = 1;
        }
        if(idx<0){
            return "";
        }else{
            return url.substr(idx+len);
        }
    }
    //https://bbs.nga.cn/misc/adpage_insert_2.html?5https://bbs.nga.cn/read.php?tid=28126278
    //https://nga.178.com/misc/adpage_insert_2.html?https://nga.178.com/read.php?tid=35426260
    var url = window.location.href;
    if(url.includes("adpage")){
        var result = findUrl(url);
        if(result){
            window.location.href=result;
            return;
        }
    }
    var task = function(){
        var adImgs = $("img[src='https://img4.nga.178.com/ngabbs/nga_classic/admark.png']");
        var adLength = adImgs.length;
        if(adLength==0){
            clearInterval(id);
            setTimeout(function(){
                id = setInterval(task,100);
            },1500);
            return;
        }
        console.log("发现广告数量:"+adLength+",执行清理");
        $(adImgs).each((i,a)=>{
            var p =$(a).parent();
            if(p !=null){
                $(p).parent().remove();
            }
            else p.remove();
        })
    };
    _fixStyle();
    id = setInterval(task,100);
    // Your code here...
})();