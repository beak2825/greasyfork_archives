// ==UserScript==
// @name         嘉兴学院考试成绩查询结果去遮挡
// @namespace    http://mewchen.com/
// @version      0.1
// @description  解决 嘉兴学院考试成绩查询结果（旧版）中，底部图片会遮挡学期等信息的Bug；
// @author       MewChen
// @include      http://210.33.28.180/*
// @include      http://sc.jwc.zjxu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15812/%E5%98%89%E5%85%B4%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/15812/%E5%98%89%E5%85%B4%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%81%AE%E6%8C%A1.meta.js
// ==/UserScript==

(function() {
    document.getElementById('bottom').style.display='none';
})();