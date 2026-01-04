// ==UserScript==
// @name         看直播极致爽版
// @namespace    http://z.houbin.site/douyu/
// @version      1.0
// @description  在斗鱼清爽版的基础上完善了一下,更加极致
// @author       原作者 z.houbin
// @match        *://www.douyu.com/*
// @match        *://egame.qq.com/*
// @match        *://video.duowan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373735/%E7%9C%8B%E7%9B%B4%E6%92%AD%E6%9E%81%E8%87%B4%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/373735/%E7%9C%8B%E7%9B%B4%E6%92%AD%E6%9E%81%E8%87%B4%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function () {
    var css = '.layout-Player-rank{display:none !important;height:0 !important}';//贵族榜
    //普通直播间调整

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
    css += 'div[data-component-id="imageItem"]{display:none !important;}';//首页广告
    css += '.layout-Bottom{display:none !important;}';//视频播放底部(互动竞猜/鱼吧)
    css += '.QRcode{display:none !important;}';//视频右侧二维码
    css += '.channelGame{display:none !important;}';//左侧页游中心
    css += '#__h5player > div:nth-child(11){display:none !important;}';//亲密互动
    css += '.chat-more-message{display:none !important;}';//聊天框多余信息
    css += '#treasure{display:none !important;}';//宝藏
    css += '.fans-icon-name{display:none !important;}';//粉丝牌
    css += '.motorcade-icon{display:none !important;}';//粉丝牌
    //css += '.chat-msg-item{color:#000 !important;}';//聊天文字颜色
    css += '.high-notice-new{display:none !important;}';//聊天通知
    css += '.normal-notice-new{display:none !important;}';//聊天通知
    css += '.chat-ad{display:none !important;}';//聊天广告(签到)
    css += '.chat-icon-pad{display:none !important;}';//聊天等级对齐
    css += '#js-chat-notice{display:none !important;height:0px !important}';
    css += '.UserLevel{display:none !important;}';//等级牌
    css += '.Motor{display:none !important;}';//等级牌
    css += '.Barrage-icon.Barrage-icon--roomAdmin{display:none !important;}';//等级牌
    css += '.Barrage-icon.Barrage-noble{display:none !important;}';//等级牌
    css += '.o_O{display:none !important;}';//提示浏览器版本低
    css += '.Barrage-listItem.js-noblefloating-barrage{display:none !important;}';//等级牌
    css += '.ladder-child.wm-slot{display:none !important;}';//人人贷
    css += '.noble--error{display:none !important;}';//开通贵族
    css += '.SysSign-Ad{display:none !important;}';//广告
    css += '.SignBarrage{display:none !important;}';//广告
    css += '.imageItem-wrap.linkImg{display:none !important;}';//广告

 //非全屏视频窗口输入框显示
    css += '.sendDanmu-592760{display: block !important;}';
    css += '.inputView-2a65aa{display: block !important;}';

    css += '.FansMedalPanel-container{display:none !important;height:0 !important}';//输入框调整
    //css += '#js-shie-gift{margin-top: -30px;height: 0px !important;}';//输入框调整
    css += '.ChatSend{margin-left: -9px;width: 245px;height: 50px !important;}';//输入框调整
    css += '.ChatSend{padding-bottom: -10px !important;}';//输入框调整
    css += '.ChatSend-button{border-bottom-width: -1px !important;}';//输入框调整
	css += '.ChatSend-txt{padding-left: 0px !important;}';//输入框调整
	css += '.ChatSend-txt{color: rgb(255, 68, 68) !important;}';//输入框字体颜色
	css += '.ChatSend-button {margin-left: 0px;width: 39px !important;}';//发送按钮调整
    css += '.Chat{padding-bottom: 0px !important;}';//输入框调整
    css += '.Chat{padding-right: 0px !important;}';//输入框调整
    //css += '.Barrage-listItem.hy-chat{padding-left: 0px !important;}';
    css += '.Barrage-listItem{margin-left: -10px !important;}';//聊天框调整
    css += '.js-nick.Barrage-nickName.Barrage-nickName--blue{padding-right: -2px !important;}';//聊天框调整
    css += '.js-nick.Barrage-nickName.Barrage-nickName--blue{padding-left: 0px !important;}';//聊天框调整
    //css += '.js-nick.Barrage-nickName.Barrage-nickName--blue{margin-left: -2px !important;}';
    css += '.Barrage-listItem{padding-right: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-listItem{margin-top: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-listItem{margin-bottom: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-listItem{margin-bottom: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-listItem.js-fansfloating-barrageBarrage-listItem.hy-chat{padding-top: 0px;padding-bottom: 0px;padding-right: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-notice--normalBarrage{margin-top: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-listItem.js-noblefloating-barrage{margin-top: -3px !important;}';//聊天框名字 内容对齐

    css += '.Barrage-notice--normalBarrage{padding-right: 0px !important;}';//聊天框名字 内容对齐
    css += '.Barrage-notice--normalBarrage{line-height: 13px !important;}';//聊天框行间距
    //比赛直播间调整
    css += '.layout-Main{padding-top: 0px !important;}';
    css += '.layout-Main{padding-left: 0px !important;}';
    css += '.layout-Main{padding-right: 0px !important;}';
    css += '.layout-Main{margin-left: 0px !important;}';
    css += '.layout-Container--hasAside{padding-top: 0px !important;}';
    css += '.layout-Player-main{margin-right: 245px !important;}';//聊天框宽度
    css += '.layout-Player-video{padding-bottom: 0px !important;}';
    css += '.layout-Player-video{padding-top: 900px !important;}';
    css += '.layout-Player-video{width: auto;height: auto !important;}';
    css += '.layout-Player-aside{height: 100%;width: 245px !important;}';
    css += '.layout-Player-main{width: auto;height: auto !important;}';
    css += '.layout-Player-videomain{height: 100%x !important;}';
    css += '.layout-Header{display:none !important;height:0 !important}';
    css += '.layout-Aside{display:none !important;height:0 !important}';
    css += '.layout-Player-title{display:none !important;height:0 !important}';
    css += '.left-small{display:none !important;height:0 !important}';
    css += '.left-menu{display:none !important;height:0 !important}';
    css += '.left-big{display:none !important;height:0 !important}';
    css += '.annualfestival-header{display:none !important;height:0 !important}';
    css += '.lol-ad{display:none !important;height:0 !important}';
    css += '.listcustomize-column-wrap{display:none !important;height:0 !important}';
    css += '.rank-video-ad{display:none !important;height:0 !important}';
    css += '.act_component{display:none !important;height:0 !important}';
    css += '.titlebotbordermore{display:none !important;height:0 !important}';
    css += '.tse-content{margin-right: 0px !important;}';
    css += '#mainbody{margin-top: -35px !important;}';
    css += '#mainbody{margin-left: 0px !important;}';
    css += '.switchRoom-child{display:none !important;height:0 !important}';
    css += '#anchor-info{display:none !important;height:0 !important}';
    css += 'div[data-component-id="view"]{display:none !important;}';//首页广告
    css += '#js-live-room-normal-left{margin-right: 245px;height: 900 !important;}';
    css += '#mainbody{margin-left: 0px !important;}';
    css += '#live-list-content{margin-right: -10px !important;}';
    css += '#live-list-content{margin-top: -15px !important;}';
    css += '.layout-newfullpage{width: 1440px !important;}';
    css += '#live-room{width: 1440px !important;}';
    css += '.lol-activity{display:none !important;height:0 !important}';
    css += '.PlayerCase-Sub{width: 245px !important;}';
    css += '#douyu_room_normal_flash_proxy_box{padding-top: 858px !important;}';
    css += 'div[data-component-id="header"]{display:none !important;}';//首页广告
    //非全屏视频窗口输入框显示
    css += '.sendDanmu-5a47e3{display: block !important;}';
    css += '.inputView-2b2f99{display: block !important;}';
    //右边聊天拦调整
    css += '.fans-entrance{display:none !important;height:0 !important}';//输入框调整
    css += '#js-shie-gift{margin-top: -30px;height: 0px !important;}';//输入框调整
    css += '#js-send-msg{margin-left: -9px;width: 245px;height: 50px !important;}';//输入框调整
    css += '#js-send-msg{padding-bottom: -10px !important;}';//输入框调整
    css += '.cs-textarea{padding-left: 0px !important;}';//输入框调整
    css += '.cs-textarea{color: rgb(255, 68, 68) !important;}';//输入框字体颜色
    css += '.b-btn{margin-left: 0px;width: 39px !important;}';//发送按钮调整
    css += '#js-chat-speak{padding-bottom: 0px !important;}';//输入框调整
    css += '#js-chat-speak{padding-right: 0px !important;}';//输入框调整
    //css += '.jschartli.hy-chat{padding-left: 0px !important;}';
    css += '.text-cont{margin-left: -10px !important;}';//聊天框调整
    css += '.nick-new{padding-right: -2px !important;}';//聊天框调整
    css += '.nick-new{padding-left: 0px !important;}';//聊天框调整
    //css += '.nick-new{margin-left: -2px !important;}';
    css += '.jschartli.hy-chat{padding-right: 0px !important;}';//聊天框名字 内容对齐
    css += '.jschartli.hy-chat{margin-top: 2px !important;}';//聊天框名字 内容对齐
    css += '.jschartli.hy-chat{margin-bottom: 0px !important;}';//聊天框名字 内容对齐
    css += '.jschartli.hy-chat{margin-bottom: 0px !important;}';//聊天框名字 内容对齐
    css += '.text-cont{line-height: 13px !important;}';//聊天框行间距

    css += '#banner-4103443-1750{display:none !important;height:0 !important}';//火箭
    css += '.yearFestival201810Mini.yearFestival201810{display:none !important;height:0 !important}';//鱼乐盛典
    css += 'div[data-component-id="backgroundImg"]{display:none !important;}';//广告



//多玩视频
    css += '.dw-mini-popup-wrap{display:none !important;}';//广告

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
//企鹅电竞

(function() {
    var css = '.gui-navbar{display:none !important;height:0 !important}';
    css += '.left-menu-main{display:none !important;height:0 !important}';
    css += '.gui-navbar{display:none !important;height:0 !important}';//顶部导航栏
    css += '.rank-header{display:none !important;height:0 !important}';//贵族1
    css += '.rank-tab{display:none !important;height:0 !important}';//贵族2
    css += '.collapsing{display:none !important;height:0 !important}';//贵族3
    ////css += '.chat-fans{display:none !important;height:0 !important}';//输入框粉丝牌
    css += '.gui-left{display:none !important;height:0 !important}';//左边导航
    css += '.left-bubble{display:none !important;height:0 !important}';//左边导航收缩按钮
    css += '.live-mod-anchor{display:none !important;height:0 !important}';//主播信息框
    css += '.live-panel-player-bottom{display:none !important;height:0 !important}';//礼物框
    css += '.gift-panel-placeholder{display:none !important;height:0 !important}';//礼物框2
    css += '.live-list-guess{display:none !important;height:0 !important}';//推荐视频1
    css += '.live-review{display:none !important;height:0 !important}';//推荐视频2
    css += '.box-result{display:none !important;height:0 !important}';//

    css += '.vcp-controls-panel.hide{height: 40px !important;}';//全屏下部导航高度
    css += '.vcp-controls-panel.show{height: 40px !important;}';//全屏下部导航高度
    css += '.gui-main{padding-top: 0px !important;}';//调整直播窗口
    css += '.gui-main{padding-bottom: 0px !important;}';//调整直播窗口
    css += '.gui-main{padding-right: 0px !important;}';//调整直播窗口
    css += '.gui-main{margin-right: 0px !important;}';//调整直播窗口
    css += '.gui-main{padding-left: 0px !important;}';//调整直播窗口
    css += '.gui-main{margin-left: 0px !important;}';//调整直播窗口
    css += '.live-right-menu{top: 0px;width: 245px !important;}';//调整聊天框
    //css += '#data-v-3e15e412{top: 0px !important;}';//调整空白框
    //css += '.vcp-player{width: 100%;height: 100% !important;}';//
    //css += '.vcp-playingb{width: 100%;height: 100% !important;}';//
    //css += '.vcp-fullscreen{width: 100%;height: 100% !important;}';//
    //css += '.common-wrap{margin-right: 245px !important;}';//
    css += '.live-player-wrap{padding-top: 100px !important;}';//视频窗口
    css += '.common-wrap{width: 100%;height: 100% !important;}';//
    css += '.chat-inputbox-wrap.has-guard{width: 320px;height: 70px !important;}';//


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