// ==UserScript==
// @name         Youku 1080
// @namespace    http://v.youku.com/
// @version      0.3.5
// @description  解开 VIP 1080p
// @author       游客
// @match        http*://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37878/Youku%201080.user.js
// @updateURL https://update.greasyfork.org/scripts/37878/Youku%201080.meta.js
// ==/UserScript==
// 优酷更新代码 div层有变动
// <解开1080> 提示移到设置分辨率选项的底部
// 优酷终于把水印从视频中去掉啦 嘿嘿 2018.04.24
// 域名变化 http -> https 2018.07.25
// 优酷系统修改视频分辨率选择菜单 2019.08.26
// 优酷系统修改视频分辨率选择菜单 2019.09.01
(function() {
    'use strict';
    $('#playerBox').append('<div style=\"position:relative;left:512px;top:10px;Z-INDEX: 9999; text-align:center;\"><a href=javascript:voide(); onclick=\"$(\'div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p > span\').html(\'😜\');$(\'div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p\').attr(\'class\',\'settings-item quality-item\');  $(\'.youku-layer-logo\').hide();\"><font color=#20BCFF><b>解开1080</b></font></a></div>');
})();
