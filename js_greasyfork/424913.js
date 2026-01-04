// ==UserScript==
// @name         爱奇艺视频、优酷视频、芒果TV、腾讯视频、哔哩哔哩全网VIP解析，免费使用，跳过广告。
// @namespace    小啦啦哈
// @version      1.2
// @description  视频解析，无广告，全网vip视频解析，无需再购买视频会员，好用到飞起。
// @author       小啦啦哈
// @match        https://v.qq.com/x/cover/*
// @match        https://www.iqiyi.com/v_*
// @match        https://v.youku.com/v_show/id_*
// @match        https://www.mgtv.com/b/*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/424913/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E3%80%81%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%85%A8%E7%BD%91VIP%E8%A7%A3%E6%9E%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%EF%BC%8C%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/424913/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E3%80%81%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%85%A8%E7%BD%91VIP%E8%A7%A3%E6%9E%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%EF%BC%8C%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
             $(function(){
            var url=location.href
            $("<div></div>").css({
                "width":75,
                "height":25,
                "background":"bisque",
                "position":"absolute",
                "top":300,
                "left":70,
                "zIndex":999,
                "float":"left",
                "borderRadius":50,
            }).attr("id","btnxiao").appendTo("body")
            $("<a></a>").css({
                "display":"block",
                "width":75+"%",
                "height":25+"%",
                "marginLeft":9,
                "marginTop":1.5,
                "textDecoration":"none",
                "fontSize":14,
                "color":"black"
            }).attr("href","https://jsap.attakids.com/?url="+url).html("解析视频").appendTo("#btnxiao")

        })

})();