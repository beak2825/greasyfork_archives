// ==UserScript==
// @name         快手自动发弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快手自动发弹幕-使用ajax发送弹幕，没12秒发送一条弹幕。
// @author       YiKe
// @match        https://zs.kwaixiaodian.com/control
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424506/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424506/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


// 根据网速自己设置时间间隔
var interval = 8000;
// 快手入参（需手动配置）
var liveStreamId = 7900240331;
// 循环发送的弹幕内容
var textArrTemp = [
    "每人限购2件",
    "厂家直销，不包运费",
    "打五遍<新来的>方可报名成功",
    "打三遍<抢到了>订单生效",
    "动动发财的小手给主播点点赞",
    "数量有限，不付款不要拍",
    "七天无理由退换货",
    "关注主播不迷路，主播带你上高速！坚持分享好物",
    "主播人美性格好，关注就像捡到宝",
    "错过了，我们就不会再有这个价格啦！想要的朋友抓紧时间哦！"
];
var textArr = [
    "四件套包含一个床单，一个被套，两个枕套",
    "选择颜色和尺寸可看到款式图片",
    "小黄车里查看颜色和尺寸，有40种花色可选",
    "点击下方小黄车，红色按钮‘去抢购’",
    "下单后24小时内加急发货",
    "拍错尺寸的联系客服更改",
    "动动发财的小手给主播点点赞",
    "尺寸有1.2米床，1.5米床，1.8米床，2.0米床，按照被套尺寸下单",
    "数量有限，不付款不要拍",
    "百分之100亲肤棉，不起球，不掉色，不缩水。",
    "七天无理由退换货",
    "关注主播不迷路，主播带你上高速！坚持分享好物",
    "公屏666扣不停，红包发不停。",
    "主播人美性格好，关注就像捡到宝",
    "实物拍摄，放心拍",
    "错过了，我们就不会再有这个价格啦！想要的朋友抓紧时间哦！"
]
var len = textArr.length;

(function () {
    'use strict';
    var currentURL = window.location.href;
    var zhibo = /control/;
    //若为直播助手地址
    if(zhibo.test(currentURL)){
        var timer = 0;
        setInterval(function () {
            var myData = {
                commentContent:textArr[timer],
                liveStreamId: liveStreamId
            };
            $.ajax({
                type : "POST",
                contentType: "application/json;charset=UTF-8",
                url : "/rest/app/zs/comment/publish",
                data : JSON.stringify(myData),
                success : function(data,status) {
                    timer++;
                    if(timer>len){
                        timer = 0;
                    }
                    console.log("第"+timer+"条数据发送 " + data.message);
                },
                //请求失败，包含具体的错误信息
                error : function(e){
                    console.log(e.status);
                    console.log(e.responseText);
                }
            });

        }, interval);
    }
})();