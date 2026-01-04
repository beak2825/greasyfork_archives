// ==UserScript==
// @name         ykm_zhanzhangzjia
// @namespace    站长工具网页版 
// @version      0.2
// @description  移除网页部分不需要标签
// @author       ykm
// @match        https://seo.chinaz.com/
// @match        https://seo.chinaz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/456932/ykm_zhanzhangzjia.user.js
// @updateURL https://update.greasyfork.org/scripts/456932/ykm_zhanzhangzjia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
     #download_video{
        position:fixed;
        top:10px;
        right:10px;
        z-index:99999;
        background:red;
        padding:5px 10px;
        border-radius:5px;
    }
      .ToolHead{
        display:none;
    } .Tool-mainnav{
        display:none;
    }
  `)
    var elem00 = document.getElementsByClassName('Tool-link');
    elem00[0].parentNode.removeChild(elem00[0]);
    var elem010 = document.getElementsByClassName('Tool-nav clearfix');
    elem010[0].parentNode.removeChild(elem010[0]);
        var elem01 = document.getElementsByClassName('Tool-mainnav');
    elem01[0].parentNode.removeChild(elem01[0]);
    var elem011 = document.getElementsByClassName('w74-0 fl');
    elem011[0].parentNode.removeChild(elem011[0]);
    var elem0 = document.getElementsByClassName('backtoTop backtoTop-new backfix');
    elem0[0].parentNode.removeChild(elem0[0]);
    var elem1 = document.getElementsByClassName('Map-navbar wrapper mb10 clearfix');
    elem1[0].parentNode.removeChild(elem1[0]);
    var elem2 = document.getElementsByClassName('keyexpansion clearfix _chinaz-seo-new5 wrapperTopBtm mb10');
    elem2[0].parentNode.removeChild(elem2[0]);
    var elem3 = document.getElementsByClassName('_chinaz-seo-new2 bg-gray02 wrapper mb10');
    elem3[0].parentNode.removeChild(elem3[0]);
    var elem4 = document.getElementsByClassName('clearfix _chinaz-seo-new9 wrapperTopBtm mb10');
    elem4[0].parentNode.removeChild(elem4[0]);
    var elem6 = document.getElementsByClassName('clearfix _chinaz-seo-new9 wrapperTopBtm mb10');
    elem6[0].parentNode.removeChild(elem6[0]);
    var elem7 = document.getElementsByClassName('_chinaz-seo-about');
    elem7[0].parentNode.removeChild(elem7[0]);
    var elem71 = document.getElementsByClassName('_chinaz-seo-title bor-b1s');
    elem71[0].parentNode.removeChild(elem71[0]);
    var elem8 = document.getElementsByClassName('wrapper mb10 _chinaz-seo-new13 ');
    elem8[0].parentNode.removeChild(elem8[0]);
    var elem9 = document.getElementsByClassName('wrapperTopBtm pb10  bg-gray02');
    elem9[0].parentNode.removeChild(elem9[0]);
    var elem10 = document.getElementsByClassName('wrapperTopBtm _chinaz-seo-lately');
    elem10[0].parentNode.removeChild(elem10[0]);

    var elem11 = document.getElementsByClassName('pl20 fb');
    elem11[0].parentNode.removeChild(elem11[0]);

})();