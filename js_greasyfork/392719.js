// ==UserScript==
// @name         yifile upload
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://wiki.greasespot.net/Greasemonkey_Manual:API
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @include      https://www.yifile.com/file/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @connect      huabc.top
// @connect      myspider.hu
// @downloadURL https://update.greasyfork.org/scripts/392719/yifile%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/392719/yifile%20upload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!window.jQuery.fn.jquery) {
        var jqry = document.createElement('script');
        jqry.src = "https://code.jquery.com/jquery-3.3.1.min.js";
        document.getElementsByTagName('head')[0].appendChild(jqry);
        console.log('原内容不包含jquery, 已动态引入版本'+window.jQuery.fn.jquery);
    } else {
        console.log(window.jQuery.fn.jquery)
    }

    var $ = window.$
    var obj = $('.tb4').find('a');
    if(obj.length >= 7){
        var arr = [];
        obj.each(function(ele){
            if($(this).text().indexOf('联通') != -1) {
                GM.setClipboard(this.href);
            }
            arr.push($(this).text()+'<>'+this.href);
        })

        if(arr.length > 0) {
            var site = location.href
            var data = arr.join('|||')
            console.log(data)
            var all = "data="+encodeURIComponent(data)+"&site="+encodeURIComponent(site)
            GM.xmlHttpRequest({
                method: "POST",
                url: "http://spider.huabc.top/api/uploadata",
                data: all,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    console.log(response.responseText)
                }
            });
        }

    }
})();