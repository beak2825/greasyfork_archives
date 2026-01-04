// ==UserScript==
// @name         B站(bilibili哔哩哔哩)直播自动发弹幕
// @namespace    https://greasyfork.org/zh-CN/scripts/401608-b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95
// @version      0.21
// @description  哔哩哔哩自动发送弹幕
// @author       enjin
// @match        http://*/*
// @grant        none
// @include      *://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/401608/B%E7%AB%99%28bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%29%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401608/B%E7%AB%99%28bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%29%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==



   /**
 * 配置区域
 */
var on = 0 // 开关 =1开启
var bullet_screen = '填写弹幕' // 填写弹幕
var sleep_time = '2000' // 发送间隔，单位毫秒
var max_count = 100 // 发送条数


/**
 * 勿动
 */
var a = null // 定时器
var count = 0 // 计数器


function seed(){
    if(count > max_count){
        clearInterval(a) // 关闭定时器
        return
    }
    // 定义事件, 定义才可发送
    var event = document.createEvent('Event')
    event.initEvent('input', true, true);
    // 选择器填写弹幕内容
    $('.chat-input.border-box').val(bullet_screen);
    $('.chat-input.border-box')[0].dispatchEvent(event);
    $('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();
    count ++
}

if(on == 1){
    a = setInterval("seed()",sleep_time)
}

