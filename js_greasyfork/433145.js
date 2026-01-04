// ==UserScript==
// @name         爱回收填表助手
// @namespace    http://tampermonkey.net/
// @version      210929.1
// @description  自动填表助手demo
// @author       gy1682005
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @match        */aihuishou/%E8%BF%90%E8%90%A5%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.html*
// @match        https://newocs.aihuishou.com/inspection/operation
// @icon         https://sr.aihuishou.com/b2b/ocs/2021090901312381765740/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433145/%E7%88%B1%E5%9B%9E%E6%94%B6%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433145/%E7%88%B1%E5%9B%9E%E6%94%B6%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('爱回收填表助手.init');
    $('#body > section > section > header > div > div.global-header-left > div > span:nth-child(2) > span.ant-breadcrumb-link').after('<span class="ant-breadcrumb-link"><button id="ahs-auto-fill" style="margin-left:10px" class="ant-btn-sm ant-btn ant-btn-primary">自动填表</button></span>');
    $('#ahs-auto-fill').click(function(){
        let i=0;
        $.each(selectors,function(key,obj){
            $(obj).click();
            let value=$(obj).find('.tag-stroke').text();
            console.log(++i+'\t', key, '->', value);
        });
    });

    let selectors={
        '开机情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(1) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '存储容量':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(2) > div.ant-timeline-item-content > div > div.content > div:nth-child(3) > span',
        '小型号':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(3) > div.ant-timeline-item-content > div > div.content > div:nth-child(1) > span',
        '机身颜色':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(4) > div.ant-timeline-item-content > div > div.content > div:nth-child(3) > span',
        '保修时长':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(5) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '序列号异常情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(6) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '购买渠道':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(7) > div.ant-timeline-item-content > div > div.content > div:nth-child(6) > span',
        '通话功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(8) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '后摄拍摄功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(9) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '前摄拍摄功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(10) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '触摸功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(11) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '屏幕传感器功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(12) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '指南针功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(13) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '充电功能 ':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(14) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '无线功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(15) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '实体按键功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(16) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '重力感应':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(17) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '耳机接口功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(18) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '振动功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(19) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '数据连接功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(20) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        'NFC':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(21) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '声音功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(22) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '面容识别功能':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(23) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '账号':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(24) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        'SIM卡2检测':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(25) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '无线充电':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(26) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '售后案例情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(27) > div.ant-timeline-item-content > div > div.content > div.tag-wrap > span',
        '卡槽外观':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(28) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '电池效率':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(29) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '电池':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(30) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '受潮状况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(31) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '维修情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(32) > div.ant-timeline-item-content > div > div.content > div:nth-child(17) > span',
        '还原激活情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(33) > div.ant-timeline-item-content > div > div.content > div:nth-child(2) > span',
        '零件维修情况':'#main-content > div > section > div.ant-card.left-card.ant-card-bordered > div > ul > form > li:nth-child(34) > div.ant-timeline-item-content > div > div.content > div:nth-child(18) > span',
    };
})();