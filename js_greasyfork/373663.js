// ==UserScript==
// @name         斗鱼清极致爽版
// @namespace    http://z.houbin.site/douyu/
// @version      0.6
// @description  在斗鱼清爽版的基础上完善了一下,更加极致
// @author       原作者 z.houbin
// @match        *://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373663/%E6%96%97%E9%B1%BC%E6%B8%85%E6%9E%81%E8%87%B4%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/373663/%E6%96%97%E9%B1%BC%E6%B8%85%E6%9E%81%E8%87%B4%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function () {
    var css = '.layout-Player-rank{display:none !important;height:0 !important}';//贵族榜

    css += '.fans-rank{display:none !important;height:0 !important}';//贵族榜2
    css += '.ACT110913Pdt{display:none !important;height:0 !important}';//
    css += '.layout-Player-barrage{top:2px !important;}';//弹幕
    css += '.js-chat-cont{top:2px !important;}';//弹幕
    css += '.chat-cont{top:2px !important;}';//弹幕
    css += '.chat-cont{height:865px !important;}';//弹幕
    css += '.Barrage-chat-ad{display:none !important;}';//聊天广告
    css += '.js-fans-dysclick{display:none !important;}';//粉丝牌
    css += '.SignBaseComponent-sign-ad{display:none !important;}';//提示登录广告
    css += '.sq-ad{display:none !important;}';//提示登录广告
    css += '.layout-Player-toolbar{display:none !important;height:0px !important}';//视频下方礼物信息
    css += '.stats-and-actions{display:none !important;height:0px !important}';//视频下方礼物信息
    css += '.sys-tips{display:none !important;}';//系统提示
    css += '.Title-roomOtherBottom{display:none !important;}';//分享/客户端观看
    css += '.sq-wrap{display:none !important;}';//分享/客户端观看
    css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(5){display:none !important;}';//顶部游戏
    css += '.funny{display:none !important;}';//顶部游戏
    css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(6){display:none !important;}';//顶部鱼吧
    css += '.yuba{display:none !important;}';//顶部鱼吧
    css += '.DropPane-ad{display:none !important;height:0px !important}';//历史下拉广告
    css += '.his-sign-cont{display:none !important;height:0px !important}';//历史下拉广告
    css += '.f-sign-cont{display:none !important;height:0px !important}';//关注下拉广告
    css += '.assort-ad{display:none !important;height:0px !important}';//分类下拉广告
    css += 'div[data-type*="dyrec"]{display:none !important;}';//首页斗鱼推广
    css += 'div[data-type*="sign"]{display:none !important;}';//首页广告
    css += '.layout-Bottom{display:none !important;}';//视频播放底部(互动竞猜/鱼吧)
    css += '.QRcode{display:none !important;}';//视频右侧二维码
    css += '.channelGame{display:none !important;}';//左侧页游中心
    css += '#__h5player > div:nth-child(11){display:none !important;}';//亲密互动
    css += '.chat-more-message{display:none !important;}';//聊天框多余信息
    css += '#treasure{display:none !important;}';//宝藏
    css += '.fans-icon-name{display:none !important;}';//粉丝牌
    css += '.motorcade-icon{display:none !important;}';//粉丝牌
    css += '.chat-msg-item{color:#000 !important;}';//聊天文字颜色
    css += '.high-notice-new{display:none !important;}';//聊天通知
    css += '.normal-notice-new{display:none !important;}';//聊天通知
    css += '.chat-ad{display:none !important;}';//聊天广告(签到)
    css += '.chat-icon-pad{display:none !important;}';//聊天等级对齐
    css += '.layout-Main{padding-top: 0px !important;}';
    css += '.layout-Main{padding-left: 0px !important;}';
    css += '.layout-Main{padding-right: 0px !important;}';
    css += '.layout-Main{margin-left: 0px !important;}';
    css += '.layout-Container--hasAside{padding-top: 0px !important;}';
    css += '.layout-Player-main{margin-right: 245px !important;}';//聊天框宽度
    css += '.layout-Player-video{padding-bottom: 0px !important;}';
    css += '.layout-Player-video{padding-top: 899px !important;}';
    css += '.layout-Player-aside{width: 245px !important;}';
    css += '.layout-Player-main{height: 899px !important;}';
    css += '.layout-Player-videomain{height: 899px !important;}';
    css += '.video-571f3f{width: 1195px;height: 672.188px !important;}';
    css += '.layout-Header{display:none !important;height:0 !important}';
    css += '.layout-Aside{display:none !important;height:0 !important}';
    css += '.layout-Player-title{display:none !important;height:0 !important}';
    css += '.left-small{display:none !important;height:0 !important}';
    css += '.left-menu{display:none !important;height:0 !important}';
    css += '.left-big{display:none !important;height:0 !important}';
    //css += '.annualfestival-header{display:none !important;height:0 !important}';
    css += '.lol-ad{display:none !important;height:0 !important}';
    css += '.listcustomize-column-wrap{display:none !important;height:0 !important}';
    css += '.rank-video-ad{display:none !important;height:0 !important}';
    css += '.act_component{display:none !important;height:0 !important}';
    css += '.titlebotbordermore{display:none !important;height:0 !important}';
    css += '.tse-content{margin-right: 0px !important;}';
    css += '#mainbody{margin-top: 20px !important;}';
    css += '#mainbody{margin-left: 10px !important;}';
    css += '.switchRoom-child{display:none !important;height:0 !important}';
    css += '#anchor-info{display:none !important;height:0 !important}';
    css += 'div[data-component-id="view"]{display:none !important;}';//首页广告
    css += '#js-live-room-normal-left{margin-right: 245px;height: 899 !important;}';
    css += '#mainbody{margin-left: 0px !important;}';
    css += '#mainbody{margin-right: 0px !important;}';
    css += '.layout-newfullpage{width: 1440px !important;}';
    css += '#live-room{width: 1440px !important;}';
    css += '.lol-header{display:none !important;height:0 !important}';
    css += '.PlayerCase-Sub{width: 245px !important;}';
    css += '#douyu_room_normal_flash_proxy_box{padding-top: 899px !important;}';





    setTimeout(function () {
        //进入直播间提示
        var barrage = document.getElementsByClassName('Barrage-list')[0];
        if (barrage !== undefined) {
            barrage.addEventListener("DOMNodeInserted", function (e) {
                var node = e.target;
                if (node.tagName === 'LI') {
                    if (node.innerText.indexOf('欢迎来到本直播间') !== -1) {
                        node.parentElement.removeChild(node);
                    }
                    if (node.innerText.indexOf('赠送给主播') !== -1) {
                        node.parentElement.removeChild(node);
                    }
                }
            });
        }
        //进入直播间提示
        var chat = document.getElementsByClassName('chat-cont-wrap')[0];
        if (chat !== undefined) {
            chat.addEventListener("DOMNodeInserted", function (e) {
                var node = e.target;
                if (node.tagName === 'LI') {
                    if (node.innerText.indexOf('欢迎来到本直播间') !== -1) {
                        node.parentElement.removeChild(node);
                    }
                    if (node.innerText.indexOf('赠送给主播') !== -1) {
                        node.parentElement.removeChild(node);
                    }
                }
            });
        }
        //屏蔽全部特效
        var shie = document.getElementsByClassName('ShieldTool-listItem')[0];
        if (shie.className.indexOf('is-noChecked') !== -1) {
            shie.click();
        }
    }, 3000);

    loadStyle(css);

    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})();