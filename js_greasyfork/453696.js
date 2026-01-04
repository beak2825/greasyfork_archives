// ==UserScript==
// @name         界面初始化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  初始化浏览器本地存储
// @author       xgm
// @match      https://www.douyin.com/user/*
// @match      https://www.xiaohongshu.com/user/profile/*
// @match      https://space.bilibili.com/*
// @match      https://www.ixigua.com/home/*
// @match      https://www.kuaishou.com/profile/*
// @match      https://weibo.com/*
// @match      https://author.baidu.com/*
// @match      https://baijiahao.baidu.com/u*
// @match      https://v.qq.com/biu/creator/home*
// @match      https://static-play.kg.qq.com/node/personal*
// @match      https://v.douyu.com/author/*
// @match      https://v.huya.com/u/*
// @match      https://y.qq.com/*
// @match      https://music.163.com/user*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/453696/%E7%95%8C%E9%9D%A2%E5%88%9D%E5%A7%8B%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453696/%E7%95%8C%E9%9D%A2%E5%88%9D%E5%A7%8B%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义css
    let div_css = `
        #init_btn{
            position: fixed;
            left: 30px;
            top: 80px;
            z-index: 99999;
        }
        #init_btn span{
            display: inline-block;
            padding: 10px 20px;
            border: 0;
            border-radius: 6px;
            font-size: 14px;
            background-color: #1890ff;
            color: rgb(232, 230, 227);
            cursor: pointer;
            outline: none;

        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `<div id="init_btn"><span>初始化</span></div>`
    $("body").append(div);

    $("#init_btn span").click(function(){
        localStorage.clear();
        window.location.reload();
    })
})();