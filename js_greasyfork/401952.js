// ==UserScript==
// @name         弹琴吧免vip播放
// @namespace    lovelesski
// @version      0.2
// @icon         http://www.tan8.com/static/tan8/style/img/Icon-80@2x.png
// @description  弹琴吧免vip观看乐谱视频，可下载乐谱图片
// @author       iam_kiwen
// @match        http://www.tan8.com/yuepu-*.html
// @match        http://www.77music.com/yuepu-*.html
// @run-at       document-end

// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/401952/%E5%BC%B9%E7%90%B4%E5%90%A7%E5%85%8Dvip%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/401952/%E5%BC%B9%E7%90%B4%E5%90%A7%E5%85%8Dvip%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".flash_img").remove();
    var url = location.href;
    var reg = new RegExp(/yuepu-\d+/);
    var match = url.match(reg)[0];
    var yid = match.split("-")[1];
    var player='<object type="application/x-shockwave-flash" data="http://www.77music.com/flash/'+yid+'.swf" width="100%" height="900px" id="flashDiv" style="visibility:visible;"><param name="wmode" value="Opaque"><param name="allowNetworking" value="all"><param name="allowFullScreen" value="true"></object>'
    document.querySelector(".flash_0421").insertAdjacentHTML('afterbegin',player);
    downimg();

    function page_parser(responseText) {
    responseText = responseText.replace(/s+src=/ig, ' data-src=');
    responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, '');
    return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    function downimg(){
        GM_xmlhttpRequest({
            "method": "GET",
            "url": "http://www.tan8.com/yuepu-"+yid+"-m.html",
            "headers": {
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
             "onload": function (response) {
                 var new_dom = page_parser(response.responseText);
                 var img = new_dom.querySelector(".swiper-wrapper");
                 var innerhtml = '';
                 var imglist = img.querySelectorAll('img')
                 for (let i = 0, len = imglist.length; i < len; ++i) {
                     innerhtml += '<img src="'+imglist[i].src+'" style="width: 100%;">';
                 }
                 document.querySelector(".flash_0421").insertAdjacentHTML('beforeEnd',innerhtml);
            }
        });
    }

})();