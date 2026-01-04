// ==UserScript==
// @name         隐藏U校园环境监测
// @namespace    undefined
// @version      1.0
// @description  屏蔽恼人的环境检测（只是隐藏，不具有更改检测结果功能）
// @author       xiaodong
// @match        https://u.unipus.cn/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405062/%E9%9A%90%E8%97%8FU%E6%A0%A1%E5%9B%AD%E7%8E%AF%E5%A2%83%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405062/%E9%9A%90%E8%97%8FU%E6%A0%A1%E5%9B%AD%E7%8E%AF%E5%A2%83%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('layui-layer-shade1').style.zIndex=-1
    document.getElementById('layui-layer1').style.zIndex=-2

})();