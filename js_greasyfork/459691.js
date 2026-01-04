// ==UserScript==
// @name        站长工具/菜鸟教程/json在线解析 去广告
// @namespace   none
// @match       https://tool.chinaz.com/*
// @match       https://ping.chinaz.com/*
// @match       https://report.chinaz.com/*
// @match       https://whois.chinaz.com/*
// @match       https://www.runoob.com/*
// @match       https://www.json.cn/*
// @grant       none
// @version     1.0.1
// @icon        https://avatars.githubusercontent.com/u/51319096?s=40&v=4
// @description 🔥持续更新🔥 - 脚本集合整理
// @author      erkang
// @note        2023/2/8 v1.0.1 新增【菜鸟教程】去广告、菜鸟教程搜索样式为居中
// @note        2023/2/7 v1.0.0 初版发布,新增【站长工具】、【json在线解析】去广告
// @downloadURL https://update.greasyfork.org/scripts/459691/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8Bjson%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459691/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8Bjson%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //菜鸟教程去广告
    // 移除右侧教程列表
    $("div.right-column").remove();
    //移除底部google广告
    $("#ad-336280").remove()
    //移除建议分享按钮
    $(".feedback-btn").remove()
    //移除底部footer
    $("#footer").remove()
    //移除关注二维码
    $(".qrcode").remove()
    //修改 搜索样式为居中最大
    var middleColumn = document.querySelector('div.big-middle-column');
    if(middleColumn !== null){
        middleColumn.className='col big-middle-column';
    }

    //站长工具去广告
    // 移除左侧广告条
    $('#toolLeftImg').remove();
    // 移除头部广告
    $('.fr').remove();
    //移除头部下面的横批广告
    $('#navAfter').remove();
    //移除底部广告
    $('.wrapperTopBtm').remove();
    $('.bg-gray02').remove();
    //移除最底部广告
    $('#bottomImg').remove();
    //移除VIP工具
    $('.toItem').remove();
    //移除下拉广告
    $('.HeaderAdvert').remove();

    //json在线解析去广告
    // 移除底部广告条
    $('.footer-gg-b-addr-img').remove();
    // 右侧服务器广告
    $('.tool ul').remove();
    // csdn
    // 右侧
    $('#recommendAdBox').remove();
    // 顶部
    $('.toolbar-advert').remove();
    // 点击全屏
    $('.fullScreen').click();
    // 双11广告
    $('#shuangshi1Modal1 .close').click();

})();