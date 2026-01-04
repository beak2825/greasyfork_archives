// ==UserScript==
// @name         昆明市导游在线培训系统
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于解锁视频检测
// @author       luwenjie
// @match        *://*.ylxue.net/*
// @license      MIT
// @match        http://kmlypx.ylxue.net/LearningCenter/LearningCourseVideo?cid=42599&tid=1715
// @match        http://kmlypx.ylxue.net/LearningCenter/LearningCourseVideo?cid=46238&tid=1715
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437034/%E6%98%86%E6%98%8E%E5%B8%82%E5%AF%BC%E6%B8%B8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/437034/%E6%98%86%E6%98%8E%E5%B8%82%E5%AF%BC%E6%B8%B8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
setInterval(function () { //每1秒刷新一次图表
         //需要执行的代码写在这里
    $(".layui-layer-btn0").click();
    }, 1000);

})();