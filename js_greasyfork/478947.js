// ==UserScript==
// @name         Shiyancang-Effects
// @namespace    none
// @version      0.1
// @description  Shiyancang-Effects is a script
// @author       AllenOSdev@outlook.com
// @match        *://*.shiyancang.cn/*
// @icon         https://oj.shiyancang.cn/static/favicon.ico
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/478947/Shiyancang-Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/478947/Shiyancang-Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("ivu-badge-count")[0].innerHTML='old';
    document.getElementsByClassName("ivu-badge")[0].innerHTML='Old Power<sup class="ivu-badge-count" style="margin-top: 5px; margin-right: 15px;">old</sup>';
    document.getElementsByClassName("ivu-menu-item-group-title")[0].remove();
    document.getElementsByClassName("ivu-menu-item-group-title")[0].remove();
    document.getElementsByClassName("ivu-menu-item-group-title")[0].remove();
    document.getElementsByClassName("ivu-menu-item-group")[1].remove();
    document.getElementsByClassName("ivu-menu-submenu-title")[1].innerHTML=`<i class="ivu-icon ivu-icon-ios-construct"></i>
                    比赛,作业
                 <i class="ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon"></i>`;
    document.getElementById("nick-name").innerHTML='1145141919810';
    document.getElementById("nick-name").style='font-size: 15px; font-family: Cambria !important; height: 45px; line-height: 45px; background-image: linear-gradient(92deg, rgb(243, 86, 38) 0%, rgb(254, 171, 58) 100%); background-clip: text; -webkit-text-fill-color: transparent; font-weight: 600; animation: 10s linear 0s infinite normal none running hue;';
})();