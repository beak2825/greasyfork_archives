// ==UserScript==
// @name        CCTV13-Pro
// @namespace   Violentmonkey Scripts
// @icon        https://p1.img.cctvpic.com/photoAlbum/templet/common/DEPA1548732472557170/logonew190218.jpg
// @match       https://tv.cctv.com/live/cctv13/
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @version     1.4
// @author      智尚智学
// @description 2022/3/12 15:36:33
// @license     MIT
// @note        1.4版本：新增加图标
// @note        1.3版本：修复全屏元素错误的Bug
// @note        1.2版本：初版
// @note        1.0和1.1测试版：两种方案不可行
// @downloadURL https://update.greasyfork.org/scripts/442083/CCTV13-Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/442083/CCTV13-Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(()=>{
        console.log("引入完成-jquery运作");
        setTimeout(() => {
            $("#player_pagefullscreen_player")[0].click();
        },3000);
    })
})();

