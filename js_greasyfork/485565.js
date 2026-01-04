// ==UserScript==
// @name         Ultra Lite QZone
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  重新排版并移除了许多冗余元素，搭配Dark Reader使用更佳。请调整主页排版至默认（“社交元素”）以取得最佳使用效果。
// @author       MFn
// @match        http://qzone.qq.com/*
// @match        https://qzone.qq.com/*
// @match        http://*.qzone.qq.com/*
// @match        https://*.qzone.qq.com/*
// @match        https://i.qq.com/?s_url=http%3A%2F%2Fuser.qzone.qq.com%2*
// @icon         https://user.qzone.qq.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485565/Ultra%20Lite%20QZone.user.js
// @updateURL https://update.greasyfork.org/scripts/485565/Ultra%20Lite%20QZone.meta.js
// ==/UserScript==

//下为本user script设置（config）,修改后请按 ctrl + s 保存。
//每次更新可能需要再次手动修改，但这比cookie好操作很多
const config = {
    background: {
        enable: true,//是否修改背景，true=是，false=否，下同
        cover: true,//是否开启背景暗角
        src: "https://i0.imgs.ovh/2024/02/02/bsxwl.jpeg"//图床：imgloc.com，这是背景路径，填写你的背景图直链，（应该）不支持file:/// .
    },
    animation: {
        transition: true//是否开启过渡动画（感觉好像没啥用的样子……）
    }
};

(function() {
    'use strict';
    console.log("Ultra Lite QZone By MFn.");
    GM_addStyle(".lay_wrap .lay_foot .login_device li a:hover {top:0 !important;background-color: #000000aa;border-radius: 15px;}");
    //登陆界面下方图标抖动bug。。。解决方式就是直接不位移
    GM_addStyle("ul#feed_friend_list {border: 1px #e6e6e6 solid !important;border-radius: 3px;background: white;width: fit-content;}");
    GM_addStyle(".fn-feed-control-v2 .control-inner {border: 1px #e6e6e6 solid !important;border-radius: 3px;background: white;}");
    //主要部分边框重写，防止无背景时与背景相连
    GM_addStyle(".bg-body{background-image:none !important;background-color:#dcdcdc;}");
    GM_addStyle(".background-container{background-image:none !important;}");
    //去除原本的背景图
    GM_addStyle("a.qz-btn-vip.qz-btn-vip-open {visibility: hidden;}");
    GM_addStyle(".profile-hd-actions{display: none !important;}");
    GM_addStyle("i.ui-icon.icon-vip {display: none !important;}");
    //去VIP等
    GM_addStyle(".layout-nav .head-avatar {border: 1px #e6e6e6 solid !important;border-radius: 3px;bottom: 60px;");
    GM_addStyle("div#vipBottomAdContainer {display: none;}");
    //头像位置
    GM_addStyle(".layout-nav .head-avatar .head-avatar-edit .avatar-edit-list {top: -60px;position: absolute;width: 120px;height: 60px;}");
    //修改头像优化
    GM_addStyle(".head-nav .head-nav-menu {background-color:white; width: 912px;height: 50px;font-size: 14px;margin-left: -150px;border: 1px #e6e6e6 solid !important;border-radius: 3px;}")
    //头像下一排边框。。。可见架构混乱程度
    GM_addStyle(".layout-head .head-info {position: absolute;top: 180px;left: 680px !important;}");
    GM_addStyle("div#visitorsDiv {top: 170px;left: 850px;}");
    //info位置（就是空间名字）
    GM_addStyle(".layout-head .head-info, .layout-head .head-description a, .layout-head .head-name .user-name, .layout-head .head-detail-name .user-name, .layout-head .qz-progress-bar .progress-bar-info {color: white;}");
    GM_addStyle(".layout-head .weather-module, .layout-head .visit-module {color: antiquewhite;}");
    //字体颜色修改
    GM_addStyle("a#site_hot_btn {display: none !important;}");
    GM_addStyle(".mod-side-nav.mod-side-nav-recently-used {display: none;}");
    //去广告
    GM_addStyle(".ui_avatar {border-radius: 100%;overflow: hidden;}");
    GM_addStyle(".feed .avatar a {border-radius: 100%;}");
    //圆形头像
    GM_addStyle("div#ifeedsContainer {background-color: white;}");
    //主要部分白色背景，为了防止添加背景后的连接处透明
    //以下是其他界面适配。。。（以上是main）
    GM_addStyle("div#feed_me {border: 1px #e6e6e6 solid !important;position: absolute;width: 592px;}");
    GM_addStyle("div#qz_poster_v4_editor_container_1 {border: 0.5px #e6e6e6 solid !important;width: 592px !important;}");
    GM_addStyle(".bg_mode.bg {border: 1px #e6e6e6 solid !important;padding-bottom: 100px;}");
    GM_addStyle(".mod_wrap.bg.mod-wrap {border: 1px #e6e6e6 solid !important;}");
    GM_addStyle(".top-fix-bar .top-fix-inner {background-color: #000000cc;box-shadow: 1px 1px 5px #000000bb;}");//top bar
    GM_addStyle("div#_qz_zoom_detect {display: none;}");//奇怪的flash。。
    GM_addStyle(".fn-dialog-hide-feed {background: white;}");

    if(config.animation.transition == true){
        //过渡动画
        GM_addStyle("html{transition: all 0.5s ease-out;}");
    }
    if(config.background.enable == true) {
        //GM_addStyle(".bg-body:not(#pageApp), .layout-background:not(#pageApp), .layout-head, .layout-nav {z-index:-5; background: url("+ config.background.src +") fixed !important;}");
        //这个效果并不好，所以我使用了下面的方法
        //美化背景
        let bgimg = document.createElement("div");
        bgimg.setAttribute("class","bgimg");
        document.body.append(bgimg);
        GM_addStyle(".bgimg {z-index: -5;position: fixed;left: 0;top: 0;width: 100%;height: 100%;background: url("+ config.background.src +") fixed !important;}");
    }
    if(config.background.cover == true){
        //背景暗角（来自limestart）
        let cover = document.createElement("div");
        cover.setAttribute("class","cover");
        document.body.append(cover);
        GM_addStyle(".cover {z-index: -2;position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-image: radial-gradient(rgba(0,0,0,0) 0,rgba(0,0,0,.5) 100%),radial-gradient(rgba(0,0,0,0) 33%,rgba(0,0,0,.3) 166%);transition: .25s;}");
    }

    GM_addStyle(".layout-nav {background: transparent;}");
    GM_addStyle(".layout-background {background: transparent;}");
    //访问其他人的空间时遇到的小bug，改成透明就解决了
})();