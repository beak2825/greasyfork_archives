// ==UserScript==
// @name             国开自动刷课（不答题考试）
// @namespace        http://ibaiyu.top/
// @version          1.5.14.1
// @description      This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @note             1.5.4： 优化了下代码，并让它更加易读了。同时修复了发帖的时候轮询没被clear的问题。
// @note             1.5.5： 修复了视频/音频不会播放的问题 修复了查看页面任务类型不会返回的问题 修复了课程附件的问题
// @note             1.5.6： 优化了获取课程任务的代码，并且查询dom元素存在的函数添加了个maxCount参数
// @note             1.5.7： 脚本无任何更新，主要是为了更新版本号
// @note             1.5.8： 修复了发帖会提示内容重复的问题（解决办法：添加unix时间戳）
// @note             1.5.9： 修复了如果课程有直播课并且已结束的前提下会异常的BUG
// @note             1.5.10：这次会增加学习行为记录了，但视频学习记录好像还是没有增加 待研究
// @note             1.5.11：修改学习行为记录的API调用函数 这回去除了定时器
// @note             1.5.12: 本次更新已修复无法刷课程的问题 目前已测试过【查看页面】任务【观看视频】任务已正常使用
// @note             1.5.13: 更新版本号
// @note             1.5.14: 修复发帖函数找不到元素的问题
// @author           蜜桃加乌龙
// @match          *://lms.ouchn.cn/course/*
// @original-author  蜜桃加乌龙
// @original-license GPL-3.0
// @original-script  https://scriptcat.org/script-show-page/740
// @license          GPL-3.0
// @source           https://scriptcat.org/script-show-page/740
// @downloadURL https://update.greasyfork.org/scripts/464459/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E4%B8%8D%E7%AD%94%E9%A2%98%E8%80%83%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464459/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E4%B8%8D%E7%AD%94%E9%A2%98%E8%80%83%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==
