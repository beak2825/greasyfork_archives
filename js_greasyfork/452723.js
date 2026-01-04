// ==UserScript==
// @name         阿里云盘样式优化
// @version      0.14
// @description  调整了部分阿里云盘样式
// @author       mzcc
// @license      MIT
// @match        www.aliyundrive.com/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/jquery/1.12.4/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/230778
// @downloadURL https://update.greasyfork.org/scripts/452723/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452723/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML=`
    .folder-cover--ExDmp[data-size=L] .fileicon--Ob-Oj {width:80px;height:auto;}
    .node-card-container--TLrx5 .outer-wrapper--JCodp {border-radius:4px;}
    .thumbnail--skb-6 .img--zRwPE {border-radius:4px;}
    .rich-text-wrapper--pBxsV .thumbnail--skb-6 .img--zRwPE {border-left: none;}
    .nav-tab-item-name--eOuOe {display:none;}
    .nav-menu--Lm1q6 .nav-menu-item--Jz5IC {font-size:13px;}
    .node-card-container--TLrx5 .node-card--wp9KL .info--YLxTD .title--HvI83 {font-size:13px;}
    .breadcrumb-wrap--Uq5Lb .breadcrumb--gnRPG {font-size:16px;}
    .breadcrumb-item--j8J5H:last-child .breadcrumb-item-link--9zcQY {font-weight:normal;}

    .logo--HhiDI {width: 34px; height: 34px;margin-bottom: 20px;}
    .nav-tab-item--WhAQf {width: 50px; height: 50px; min-height: initial;}
    .icon--D3kMk[data-render-as=svg] svg {width:0.8em; height: 0.8em;}
    .content--qGEQd {width: 50px; height: 50px; border-radius: 8px; border: none;}
    .content--qGEQd svg {width: 1em; height: 1em;}
    `;
    $('head').append(style);
})();