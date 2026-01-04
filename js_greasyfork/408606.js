// ==UserScript==
// @name         古诗文网 复制时不弹出登陆界面
// @description  屏蔽古诗文网复制内容时弹出用户登陆界面
// @match        https://so.gushiwen.cn/*
// @match        https://www.gushiwen.org/*
// @version 0.0.1.20200811150739
// @namespace https://greasyfork.org/users/675370
// @downloadURL https://update.greasyfork.org/scripts/408606/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%20%E5%A4%8D%E5%88%B6%E6%97%B6%E4%B8%8D%E5%BC%B9%E5%87%BA%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/408606/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%20%E5%A4%8D%E5%88%B6%E6%97%B6%E4%B8%8D%E5%BC%B9%E5%87%BA%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName("html")[0].oncopy = ""
})();