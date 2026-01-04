// ==UserScript==
// @name         Soul+Cleaner
// @name:en         Soul+Cleaner
// @name:zh         Soul+Cleaner
// @namespace    Xiccnd@qq.com
// @version      1.1.6
// @description  清洁魂+首页
// @description:en  Clean Soul+ HomePage
// @description:zh  清洁魂+首页
// @author       Xiccnd

// @license      GPL-3.0 License

// @match        *://*.white-plus.net/index.php
// @match        *://*.snow-plus.net/index.php
// @match        *://*.level-plus.net/index.php
// @match        *://*.east-plus.net/index.php
// @match        *://*.south-plus.net/index.php
// @match        *://*.north-plus.net/index.php
// @match        *://*.spring-plus.net/index.php
// @match        *://*.summer-plus.net/index.php
// @match        *://*.imoutolove.me/index.php
// @match        *://*.blue-plus.net/index.php

// @match        *://*.white-plus.net
// @match        *://*.snow-plus.net
// @match        *://*.level-plus.net
// @match        *://*.east-plus.net
// @match        *://*.south-plus.net
// @match        *://*.north-plus.net
// @match        *://*.spring-plus.net
// @match        *://*.summer-plus.net
// @match        *://*.imoutolove.me
// @match        *://*.blue-plus.net

// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://cdn.jsdelivr.net/gh/Xiccnd/Xiccnd-Pic@master/20220421113011992.1vh7zbll47r4.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443629/Soul%2BCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/443629/Soul%2BCleaner.meta.js
// ==/UserScript==

$(function () {

    'use strict';

    /*
    * 开关插件功能
    * */

    //开启清洁功能
    xiccndClean()

    //开启深度清洁功能
    //xiccndDeepClean()

    //一件打开常用版块
    xiccndOneClickOpen()

    /*
    * 清除功能
    * */
    function xiccndClean() {

        /*
        * 去除页头广告
        * */
        $('div#header div').eq(-2).remove()

        /*
        * 去除网页头部
        * */
        $('td.banner').remove()
        $('div.bdbA').remove()

        /*
        * 去除蜜柑计划
        * */
        $('div#t_123.t').remove()

        /*
        * 去除网页底部
        * */
        $('div#main>div.t_one').remove()
        $('div#main>div.t').remove()
        $('div#footer').remove()
    }

    /*
    * 深度清除功能
    * */
    function xiccndDeepClean() {
        //去除漫区特设
        $('div#t_39.t').remove()
        //去除人民囧府
        $('div#t_1.t').remove()
        //去除网赚资源区
        $('tr#fid_170.tr3.f_one').remove()
    }

    /*
    * 一件打开常用版块
    * */
    function xiccndOneClickOpen() {
        //生成一键打开按钮元素
        const BUTTON = "<button id='one_click' style='cursor: pointer; margin-left: 10px;'>一键打开</button>"

        //判断一键打开按钮元素是否存在
        if ($('button#one_click').size > 0) {
            console.log('一键打开按钮已存在')
        } else {
            //添加div
            $('div#t_7.t>table>tbody h2').append(BUTTON)
        }

        //按钮点击事件
        $('button#one_click').on('click', function () {
            window.location.href = "u.php"
            window.open('thread_new.php?fid-48.html')
            window.open('thread_new.php?fid-128.html')
            window.open('thread_new.php?fid-9.html')
        })
    }
})