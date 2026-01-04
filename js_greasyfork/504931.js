// ==UserScript==
// @name         B站夜间模式
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  修改B站css并清除背景图片
// @author       MeowRain
// @match        *://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     dark_css https://s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/dark.css
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @icon64       https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504931/B%E7%AB%99%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/504931/B%E7%AB%99%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
 const style = document.createElement('style');
    style.type = 'text/css';

    // Add your custom CSS here
    style.textContent = `
    :root{--Ga0:#101011;--Ga0_s:#1E2022;--Ga0_t:#1E2022;--Ga1:#0A0B0C;--Ga1_s:#232527;--Ga1_t:#232527;--Ga1_e:#232527;--Ga2:#2F3134;--Ga2_t:#2F3134;--Ga3:#46494D;--Ga3_t:#46494D;--Ga4:#5E6267;--Ga4_t:#5E6267;--Ga5:#757A81;--Ga5_t:#757A81;--Ga6:#8B9097;--Ga6_t:#8B9097;--Ga7:#A2A7AE;--Ga7_t:#A2A7AE;--Ga8:#B9BDC2;--Ga8_t:#B9BDC2;--Ga9:#D0D3D7;--Ga9_t:#D0D3D7;--Ga10:#E7E9EB;--Ga10_t:#E7E9EB;--Ga11:#242628;--Ga12:#1F2022;--Ga12_s:#2B2C2F;--Ga13:#1A1B1D;--Ga13_s:#2F3134;--Wh0:#17181A;--Wh0_s:#2F3134;--Wh0_t:#17181A;--Ba0:#000000;--Ba0_s:#FFFFFF;--Ba0_t:#000000;--Pi0:#26161C;--Pi1:#2F1A22;--Pi2:#472030;--Pi3:#76304B;--Pi4:#A73E65;--Pi5:#D44E7D;--Pi5_t:#D44E7D;--Pi6:#DC6D94;--Pi7:#E38CAA;--Pi8:#EBABC1;--Pi9:#F2CAD8;--Pi10:#FAE9EF;--Ma0:#261525;--Ma1:#2E182D;--Ma2:#461C43;--Ma3:#72296C;--Ma4:#A13396;--Ma5:#CB41BB;--Ma6:#D462C7;--Ma7:#DD83D3;--Ma8:#E6A4DE;--Ma9:#EFC5EA;--Ma10:#F8E6F6;--Re0:#261314;--Re1:#2E1617;--Re2:#471A1C;--Re3:#742728;--Re4:#A63131;--Re5:#D1403E;--Re6:#D9615F;--Re7:#E18281;--Re8:#E9A3A2;--Re9:#F1C5C4;--Re10:#F9E5E5;--Or0:#28180F;--Or1:#301B10;--Or2:#4A230E;--Or3:#783610;--Or4:#A9490D;--Or5:#D66011;--Or6:#DD7C3A;--Or7:#E49764;--Or8:#EBB38D;--Or9:#F2CEB6;--Or10:#FAEADF;--Ye0:#2A1E0F;--Ye1:#342410;--Ye2:#4D300B;--Ye3:#7C4C08;--Ye4:#AD6800;--Ye5:#DB8700;--Ye6:#E19C2C;--Ye7:#E7B158;--Ye8:#EEC584;--Ye9:#F4DAB1;--Ye10:#FAEFDD;--Ly0:#2A2310;--Ly1:#332A11;--Ly2:#49390C;--Ly3:#745909;--Ly4:#A27C00;--Ly5:#CCA000;--Ly6:#D5B02C;--Ly7:#DEC158;--Ly8:#E7D184;--Ly9:#EFE2B1;--Ly10:#F8F2DD;--Lg0:#19220F;--Lg1:#1E2911;--Lg2:#273C0E;--Lg3:#3C600F;--Lg4:#50840B;--Lg5:#67A70E;--Lg6:#81B638;--Lg7:#9CC562;--Lg8:#B6D58B;--Lg9:#D0E4B5;--Lg10:#EBF3DF;--Gr0:#102017;--Gr1:#11271B;--Gr2:#123923;--Gr3:#175C34;--Gr4:#198042;--Gr5:#1FA251;--Gr6:#46B26F;--Gr7:#6DC28D;--Gr8:#93D2AB;--Gr9:#BAE2C9;--Gr10:#E1F3E8;--Cy0:#0C1F20;--Cy1:#0D2627;--Cy2:#093739;--Cy3:#085B5C;--Cy4:#028080;--Cy5:#03A29F;--Cy6:#2FB2B0;--Cy7:#5AC2C0;--Cy8:#86D2D1;--Cy9:#B2E2E1;--Cy10:#DDF3F3;--Lb0:#0A1B23;--Lb1:#0B202A;--Lb2:#082D40;--Lb3:#064A69;--Lb4:#006996;--Lb5:#0087BD;--Lb6:#2C9CC8;--Lb7:#58B1D4;--Lb8:#84C5DF;--Lb9:#B1DBEB;--Lb10:#DDEFF6;--Bl0:#151826;--Bl1:#181C2F;--Bl2:#1F2748;--Bl3:#2E3C76;--Bl4:#3B53A8;--Bl5:#4B6BD4;--Bl6:#6A85DB;--Bl7:#899EE3;--Bl8:#A9B8EA;--Bl9:#C8D2F2;--Bl10:#E7EBF9;--Pu0:#1D1628;--Pu1:#221A31;--Pu2:#31214C;--Pu3:#4E317D;--Pu4:#6D3FB1;--Pu5:#8C50E0;--Pu6:#A06EE5;--Pu7:#B48DEB;--Pu8:#C8ABF0;--Pu9:#DBC9F5;--Pu10:#F0E8FB;--Br0:#211D1B;--Br1:#282320;--Br2:#382F2A;--Br3:#59483F;--Br4:#7A6154;--Br5:#9A7C6A;--Br6:#AC9384;--Br7:#BDA99E;--Br8:#CEBFB7;--Br9:#E0D7D1;--Br10:#F2EEEB;--Si0:#212325;--Si1:#27292C;--Si2:#36393F;--Si3:#535962;--Si4:#6F7987;--Si5:#8C99AA;--Si6:#A0ABB9;--Si7:#B4BCC7;--Si8:#C8CED6;--Si9:#DCE0E5;--Si10:#F0F2F4;--Ga0_rgb:16,16,17;--Ga0_s_rgb:30,32,34;--Ga1_rgb:10,11,12;--Ga1_s_rgb:35,37,39;--Ga2_rgb:47,49,52;--Ga3_rgb:70,73,77;--Ga5_rgb:117,122,129;--Ga7_rgb:162,167,174;--Ga10_rgb:231,233,235;--Ga11_rgb:36,38,40;--Ga12_rgb:31,32,34;--Ga12_s_rgb:43,44,47;--Ga13_rgb:26,27,29;--Ga13_s_rgb:47,49,52;--Wh0_rgb:23,24,26;--Wh0_s_rgb:47,49,52;--Ba0_rgb:0,0,0;--Pi1_rgb:47,26,34;--Pi5_rgb:212,78,125;--Re1_rgb:46,22,23;--Re5_rgb:209,64,62;--Or1_rgb:48,27,16;--Or5_rgb:214,96,17;--Ye1_rgb:52,36,16;--Ye5_rgb:219,135,0;--Ye6_rgb:225,156,44;--Gr1_rgb:17,39,27;--Gr5_rgb:31,162,81;--Lb1_rgb:11,32,42;--Lb5_rgb:0,135,189;--Lb7_rgb:88,177,212}

   /* //收藏页面 */
 .s-space {
     background-color: var(--bg1)  !important;;
 }

 .h {
     background-color: var(--bg1)  !important;;
 }

 #navigator {
     background-color: var(--bg1)  !important;;
 }

 #app {
     background-color: var(--bg1)  !important;;
 }

 .n .n-inner {
     background-color: var(--bg1)  !important;;
     color: white;
     box-shadow: 0 0 0 1px var(--Ba0);
 }

 .n .n-data .n-data-v {
     color: white;
 }

 .g-search input {
     background-color: var(--bg1)  !important;;
     color: white;
 }

 #page-fav .fav-main {
     background-color: var(--bg1)  !important;;
 }

 #page-fav .fav-main .search-input input {
     background-color: var(--bg1)  !important;;
 }

 .col-full {
     background-color: var(--bg1);
 }

 #page-fav .fav-main .small-item {
     background-color: var(--bg1)  !important;;
     color: white;
     border: 1px solid transparent;
 }

 #page-fav .fav-sidenav .nav-title .text {
     color: white;
 }

 #page-fav .fav-sidenav .text {
     color: var(--text2);
 }

 .favInfo-box .favInfo-details .fav-name {
     color: white;
 }

 /* // 视频观看历史页面 */
 .history-list .r-info {
     background-color: var(--bg1)  !important;;
 }
 .b-head-search_input {
     background-color: var(--bg1)  !important;;
 }

 .history-wrap .b-head .b-head-t {
     color: var(--text1);
 }

 /* //个人主页页面 */

 #page-index .col-1 {
     background: var(--bg1)  !important;;
 }
.title {
  color:var(--text2);
}
.section-title .t {
  color:var(--text2);
}
ol, ul {
    list-style: none;
    color: var(--text2);
}
.article-title a {
    color: var(--text2);
    word-break: break-all;
}
#page-index .fav-item .name {
    color: var(--text2);
}
.large-item .detail {
    margin-left: 130px;
    padding-right: 20px;
    max-height: 140px;
    overflow: hidden;
    color: var(--text2);
}
#page-index .bangumi .content .title {
    font-family: Microsoft Yahei UI Light, Microsoft Yahei Light;
       color: var(--text2);
}
.section-title {
    color: var(--text2)  !important;;
    font-size: 20px;
    font-weight: 400;
    line-height: 33px;
    padding: 0 0 15px;
    position: relative;
}
.i-pin-title {
color: var(--text2) !important;
}
#page-index .col-2 .section .user-auth.no-auth {
    margin: -15px -20px -18px;
    background: var(--bg1)  !important;
}
#page-index .col-2 .section .user-auth.no-auth .no-auth-title .goto-auth {
    cursor: pointer;
    font-size: 18px;
color: var(--text2);
    display: block;
    margin-bottom: 4px;
}
#page-index .col-2 .section.elec, #page-index .col-2 .section{
    background: var(--bg1) !important;
}
#page-index #i-ann-content textarea {
    width: 306px;
    height: 172px;
    background: var(--bg1);
 color: var(--text2);
    font-size: 12px;
    font-family: Microsoft Yahei;
    line-height: 20px;
    padding: 10px;
    margin: -10px 0 0 -11px;
    border: 1px solid transparent;
    border-radius: 4px;
    box-sizing: content-box;
}
.i-live .i-live-host-text{
    color: var(--text2) !important;
}
.user-info .user-info-title .info-title{
    color: var(--text2) !important;
}
#page-dynamic .col-2 .section {
    background: var(--bg1)  !important;
    color: var(--text2) !important;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 15px 20px 18px;
    margin-bottom: 10px;
}
.pgc-space-follow-item .pgc-item-info .pgc-item-title{
    color: var(--text2) !important;
}
.pgc-space-follow-item .pgc-item-info .pgc-item-desc {
color: var(--text2) !important;
}
.sub-tabs a {
color: var(--text2) !important;
}

/*动态页面*/
.fixed-header .bili-header__bar {
    background: var(--bg1)  !important;
}

    `;

    // Append the style element to the head
    document.head.appendChild(style);
    // 清除body背景图片
    function clearBodyBackgroundImage() {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'var(--bg1)';
    }

    // 页面加载时执行
    window.addEventListener('load', clearBodyBackgroundImage);


})();
