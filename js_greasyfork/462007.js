// ==UserScript==
// @name         阿坤学习小助手
// @namespace    https://greasyfork.org/zh-CN/scripts/462007-%E9%98%BF%E5%9D%A4%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B
// @version      2.0.13
// @description  写写写个篮子跑了跑了
// @author       WLCB
// @homepage     https://greasyfork.org/zh-CN/scripts/462007-%E9%98%BF%E5%9D%A4%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B
// @match        https://course.icve.com.cn/learnspace/learn/learn/templateeight/*
// @icon         https://nmslcxk.com/sharpicons_Rooster.png
// @grant        none
// @license      GPL 
// @downloadURL https://update.greasyfork.org/scripts/462007/%E9%98%BF%E5%9D%A4%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462007/%E9%98%BF%E5%9D%A4%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/** 配置 后期添加UI DOM控制*/
let sleepInitTime = 500;    // 助手弹出时间，默认500ms，如未出现请调高；
let waitTime = 500          //代码执行等待时间，获取元素；
let textSleepTime = 5000    //文本类型课程执行等待时间，5000ms下一课；
let getVideoTime = 2500     //视频课程资源较大需要一定的时间去获取；
let delayedTime = 2000      //视频延时，防止脚本较快没完成就跳过了
/** 配置完 */






function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

