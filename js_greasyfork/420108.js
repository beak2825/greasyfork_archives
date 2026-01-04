// ==UserScript==
// @name         安静看手机虎扑
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  我只想不注册不下载APP看虎扑
// @author       soundEgg
// @require  https://cdn.jsdelivr.net/npm/xgplayer@2.9.6/browser/index.js
// @match         *://m.hupu.com/*
//@run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/420108/%E5%AE%89%E9%9D%99%E7%9C%8B%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91.user.js
// @updateURL https://update.greasyfork.org/scripts/420108/%E5%AE%89%E9%9D%99%E7%9C%8B%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('注入开始~~~~~~')
    var window_url = window.location.href;
    var website_host = window.location.host;
    console.log(window_url)
    console.log(website_host)
    document.cookie='sc=2;';
    window.addEventListener("load", function(){
        setTimeout(function() {
            //移除任意页面 APP打开
            //document.getElementsByClassName('open-app-suspension')[0].remove();
            //移除底部打开APP
           // document.getElementsByClassName('for-more')[0].remove();
            //帖子中的 打开亮评 广告 推荐 排行
            var a =['.open-app-suspension','.for-more','.open-btn-under-reply','div.hupu-m-detail-content div[class^="_"]' ,'.recommand-new-style','.hot-ranking-new']
            a.forEach(function(e) {
                var obj = document.querySelector(e)
                if (obj) {
                    obj.remove();
                }
            });
        },700);
        setTimeout(function() {
            //移除视频试看限制
            newvideo()
        },1000);
    });
    function newvideo(){
        var o = document.querySelector('.thread-video-wrap');
        console.log('111111')
        if(o){
            o.remove();
            document.querySelector('.normal').insertAdjacentHTML("afterEnd", `
<div id="newvideo" class="thread-video-wrap" style="width: 100%;display: block;"></div>
`)
            var k = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
            var mp4url=k.props.pageProps.thread.t_detail.content.match("src='(.*)' con")[1];
            let player = new Player({
                id: 'newvideo',
                url: mp4url,
                volume: 0.6,//音量
                width: '100%',//加载宽度 默认div
                height: '220px',//高度
                controls:true,//
                playsinline: !0,
                //fluid: true,//流式布局
                playbackRate: [0.5, 0.75, 1, 1.5, 2],//倍速播放
                disableProgress: false,
                rotate: {   //视频旋转按钮配置项
                    innerRotate: true, //只旋转内部video
                    clockwise: false // 旋转方向是否为顺时针
                },
                screenShot: 0,//截图
                download: true //下载
            });
            player.on('rotate',function(deg) {
                console.log(deg);// 旋转时会触发rotate事件，角度有四个值90，180，270，0
            });

        };


    };
})();