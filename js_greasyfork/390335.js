// ==UserScript==
// @name        bilibili 去网页广告

// @namespace   https://space.bilibili.com/39873101
// @icon        https://upload.cc/i1/2019/05/20/Vrt832.png
// @version     2021.04.18
// @icon         https://www.bilibili.com/favicon.ico
// @description 此脚本用来去除bilibili上的部分广告
// @author      貔貅I勿念
// @grant       GM_addStyle
// @grant       $
// @match       *://www.bilibili.com/*
// @match       *://www.bilibili.com/video/*
// @copyright   CNGEGE,夜雾
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/390335/bilibili%20%E5%8E%BB%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/390335/bilibili%20%E5%8E%BB%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

'use strict';

var Url = location.href;

//     www.bilibili.com/*
GM_addStyle(".gg-floor-module{display:none;}");//去主页横幅广告
GM_addStyle("bangumi-module{display:none;}");//去主页横幅广告

//GM_addStyle(".adpos{display:none;}");//去主页QQ绿钻等会员广告
//GM_addStyle("#reportFirst1{display:none;}");//去主页头部滚动广告
GM_addStyle(".banner-card.b-wrap{display:none;}");//去主页横幅广告


//     www.bilibili.com/video/*
GM_addStyle(".slide-gg{display:none;}");//去视频页右下角广告
GM_addStyle("#live_recommand_report{display:none;}");//去除推荐的直播