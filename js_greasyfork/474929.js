// ==UserScript==
// @name         海晟教育视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  海晟教育视频自动播放，测试版
// @author       thunder-sword
// @match        *://videoadmin.chinahrt.com/videoPlay/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474929/%E6%B5%B7%E6%99%9F%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474929/%E6%B5%B7%E6%99%9F%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    attrset.autoPlay=1;

//     // 拦截响应
//     var originalSend = XMLHttpRequest.prototype.send;
//     XMLHttpRequest.prototype.send = function() {
//         // 全部请求相关信息
//         var self = this;

//         // 监听readystatechange事件
//         this.onreadystatechange = function() {
//             // 当readyState变为4时获取响应
//             if (self.readyState === 4) {
//                 // self 里面就是请求的全部信息
//                 // JSON.parse(self.response);可以获取到返回的数据
//             }
//         };
//         debugger;

//         // 调用原始的send方法
//         originalSend.apply(this, arguments);
//     };

    // // 创建一个包含URL参数的URLSearchParams对象
    // const urlParams = new URLSearchParams(window.location.search);
    // if(!urlParams.get("autoPlay")){
    //     window.location.search="?autoPlay=1&"+window.location.search.substr(1);
    // }

    setTimeout(() => {
        document.querySelectorAll('video').forEach(function (element) {
            //自动播放视频
            element.play();

            //重载视频暂停事件，只有在双击暂停才能成功暂停【但是双击暂停并不起作用，好像是element.pause不能保存，这就导致视频不能暂停了，也勉强能用吧】
            let lastTime=0, nowTime=0;
            let pauseFunc = element.pause;
            element.pause = () => {
                console.log("pasue被调用");
                nowTime=new Date().getTime();
                //console.log(nowTime, lastTime);
                //console.log(pauseFunc);
                //两次调用小于1s才能成功暂停
                if(nowTime - lastTime < 1000){
                    console.log("双击触发");
                    pauseFunc();
                }
                //更新时间
                lastTime=nowTime;
            }
        });
    }, 2000);
})();