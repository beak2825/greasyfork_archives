// ==UserScript==
// @name         91共享福利无限看
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  不用登录，不用花费金币，无限次观看91共享福利网的视频!
// @author       qm3.top
// @match        http://www.fuli91.info/video/play/id/*
// @match        http://www.63ysk.com/video/play/id/*
// @match        http://www.91kb.in/video/play/id/*
// @match        http://www.fulise666.com/video/play/id/*
// @match        http://www.gongxiangfuli.vip/video/play/id/*
// @match        http://www.zbzxfl.com/video/play/id/*
// @match        http://www.jdknss.com/video/play/id/*
// @match        http://www.1024gongxiang.com/video/play/id/*
// @match        http://www.91gxfl.space/video/play/id/*
// @match        http://www.gongxiang51.com/video/play/id/*
// @match        http://www.zhibo2017.com/video/play/id/*
// @match        http://www.zhubo911.com/video/play/id/*
// @match        http://www.zhubo1212.com/video/play/id/*
// @match        http://www.zhubo760.info/video/play/id/*
// @match        http://www.zhubo8.info/video/play/id/*
// @match        http://www.zhubo900.info/video/play/id/*
// @match        http://www.91gxfl77.com/video/play/id/*
// @match        http://www.91gxfl3.com/video/play/id/*
// @match        http://www.91gxfl111.com/video/play/id/*
// @match        http://www.91gxfl333.com/video/play/id/*
// @match        http://www.zhubo350.info/video/play/id/*
// @match        http://www.chaopao8.info/video/play/id/*
// @match        http://www.91gxfl91gxfl.com/video/play/id/*
// @match        http://www.kanfulila.info/video/play/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374073/91%E5%85%B1%E4%BA%AB%E7%A6%8F%E5%88%A9%E6%97%A0%E9%99%90%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374073/91%E5%85%B1%E4%BA%AB%E7%A6%8F%E5%88%A9%E6%97%A0%E9%99%90%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.ajax({
        url:"http://"+ window.location.host +"/api/payvideo.html",
        type:"post",
        data:{id:window.location.href.match(/\/([0-9]+)\./)[1]},
        success:function(e){
            e = JSON.parse(e);
            $(".share").html('<p>下载地址：<a href="http://blog.sina.com.cn/s/blog_6264e0aa0102x8wd.html" target="_blank" style="color:red">查看下载教程</a></p><p>'+e.data.videoInfo.url.split("?")[0]+'</p>');
            if(e.message == "\u89c6\u9891\u9700\u8981\u4ed8\u8d39\u002c\u8bf7\u767b\u9646\u540e\u89c2\u770b"){
                console.log(e.data.videoInfo.url);
                $("body").append("<style>.layui-layer-shade,.layui-layer-dialog,.layui-layer-move{display:none}</style>");
                new ckplayer({container:"#playerBox",autoplay:true,video:e.data.videoInfo.url});
            }
        }
    });
})();