// ==UserScript==
// @name         贪吃蛇小游戏
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @license      GPLv3
// @description  贪吃蛇小游戏脚本版
// @author       Yasin Yan
// @match        https://*.baidu.com/*
// 配置块里添加上面两个grant
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @resource     SnakeFragment https://gitee.com/yasin-yan/resources/raw/master/PageRes/SnakeFragment.html
// @resource     SnakeCSS https://gitee.com/yasin-yan/resources/raw/master/PageRes/SnakeCSS.css
// @note         2020/10/24作
// @downloadURL https://update.greasyfork.org/scripts/414527/%E8%B4%AA%E5%90%83%E8%9B%87%E5%B0%8F%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/414527/%E8%B4%AA%E5%90%83%E8%9B%87%E5%B0%8F%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

//代码添加上面两行代码，让油猴解析CSS
var snakeCSS = GM_getResourceText("SnakeCSS");;
GM_addStyle(snakeCSS)

var SnakeFragment = GM_getResourceText("SnakeFragment");
(function() {
    'use strict';

    var $hidden = $('#head')
    var $qrcode = $('#qrcodeCon.qrcodeCon')
    $qrcode.remove()
    $hidden.empty()
    $hidden.append(SnakeFragment)

    // Your code here...
})();