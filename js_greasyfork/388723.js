// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.png
// @name             阿里巴巴高级自定义在线装修工具
// @namespace        https://www.thfou.com/
// @version          1.1.0
// @description      为阿里巴巴店铺详情页、自定义页等页面开启自定义模块功能。
// @author           头号否
// @match            *://design.1688.com/page/offerdetail.htm?spm=*
// @require          https://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @compatible	     Firefox
// @compatible	     Edge
// @compatible   	 Safari
// @compatible   	 Opera
// @compatible	     UC
// @license          GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/388723/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%AB%98%E7%BA%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9C%A8%E7%BA%BF%E8%A3%85%E4%BF%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/388723/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%AB%98%E7%BA%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9C%A8%E7%BA%BF%E8%A3%85%E4%BF%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#site_footer-box').attr("class","segment-box segment-box-fluid");
$('#content .segment-box').attr("class","segment-box segment-box-op-insertable segment-box-op-deletable segment-box-op-movable segment-box-enable segment-box-op-movable-up segment-box-op-movable-down segment-box-op-switchable");
$('.segment-header').attr("class","segment-header op-insertable op-movable op-switchable");
//页头全屏布局
var shb = document.getElementById('site_header-box');
    shb.className = 'segment-box segment-box-fluid';
//页尾全屏布局
var sfb = document.getElementById('site_footer-box');
    sfb.className = 'segment-box segment-box-fluid segment-box-op-insertable segment-box-enable';
//页头全屏布局添加
var adh = document.createElement('div');
    adh.className = 'box-adder';
    adh.style = 'margin-bottom:9px';
    adh.innerHTML = '<a href="#">添加版块</a>';
$('#site_header .region').append(adh);
//通栏布局
var adtl = document.createElement('div');
    adtl.className = 'box-adder';
    adtl.innerHTML = '<a href="#">添加版块</a>';
$('#site_user_segment_102 .grid-main .region').append(adtl);
//全屏布局
var adqp = document.createElement('div');
    adqp.className = 'box-adder';
    adqp.innerHTML = '<a href="#">添加版块</a>';
$('#site_user_segment_103 .region').append(adqp);
//宽屏布局
var adkp = document.createElement('div');
    adkp.className = 'box-adder';
    adkp.innerHTML = '<a href="#">添加版块</a>';
$('#site_user_segment_107 .grid-main .region').append(adkp);
})();