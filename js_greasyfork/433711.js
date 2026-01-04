// ==UserScript==
// @name         byrbt趣味盒图片放大v2
// @version      1.2.2
// @author       camedeus,tiger
// @description  放大byrbt主页和历史趣味盒图片,基于byr社区的原始版本进行修改,支持更换域名后的byr和新版主页地址,添加了开源协议.
// @icon         https://bt.byr.cn/favicon.ico
// @match        *://bt.byr.cn/*
// @match        *://byr.pt/*
// @grant        none
// @namespace    https://gist.github.com/Devil-Z/1c68b4eee9b28164dbad64c8890ca089
// @license      Apache Licence 2.0
// @downloadURL https://update.greasyfork.org/scripts/433711/byrbt%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7v2.user.js
// @updateURL https://update.greasyfork.org/scripts/433711/byrbt%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7v2.meta.js
// ==/UserScript==
'use strict';
/*                 *
 *   简易参数设定   *
 *                 */

window.addEventListener('load', function() {
    var path = location.pathname;
    if(path.match("index.php")||path==="/"){
        var e = document.querySelector("iframe[src='fun.php?action=view']")
        var a = e.contentDocument.querySelectorAll('.shoutrow')[1].querySelectorAll('img')
        e.height=600
        // a = e.contentquerySelectorAll('.shoutrow')[1].querySelector('img')
        for(var i=0;i<a.length;i++){
            var x = a[i].src
            if(x.match('thumb.jpg')){
                a[i].src = x.substring(0,x.length-10)
            }
        }
    }else if(path.match("log.php")){
        var table = document.querySelectorAll("td.rowfollow");

        for(var i=0;i<table.length;i++){
            var imgs=table[i].querySelectorAll("img[src]");
             console.log(imgs.length);
            for(var j=0;j<imgs.length;j++){
                var tempSrc=imgs[j].src;
                imgs[j].src=tempSrc.match('thumb.jpg')?tempSrc.slice(0,-10):tempSrc ;
            }
        }
    }
}, false);