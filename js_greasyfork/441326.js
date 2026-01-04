// ==UserScript==
// @name         WBPure
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  catch fish on  the work with wb
// @author       You
// @match        *://weibo.com/*
// @grant	     GM_addStyle
// @grant	     GM_getResourceText
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @resource     css http://166.16.6.193:8088/frame/static/bootstrap/2.3.1/css_default/font-awesome.min.css
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/441326/WBPure.user.js
// @updateURL https://update.greasyfork.org/scripts/441326/WBPure.meta.js
// ==/UserScript==

(function() {
'use strict';
GM_addStyle(GM_getResourceText("css"));
GM_addStyle(`
a{
color: black !important;
}
.lzl_link_fold{
color: black !important;
}
span.woo-icon-main{
display:none;
}
footer{
display:none;
}
.wbpro-tab2{display:none;}
.woo-icon-wrap{display:none;}
.woo-button-main{display:none;}
video{display:none;}
.card-video_videoBox_2MQL0{display:none;}
.Bar_main_R1N5v{display:none;}
.logo-con img{display:block !important}
.Feed_wrap_3v9LH {
border-color:white;
}
:root {
--frame-background: white;
}
#leftId {

position: fixed;
text-align:center;
width: 175px;
height: 22px;
top: 46px;
}
#topId {

position: fixed;


text-align:center;

width: 1930px;

height: 22px;

top: 0px;

}
#left {
background: #3d4d66;
}
.logo-con {
background-position: center;
background-repeat: no-repeat;
width: 117px;
height: 107px;
margin: 15px auto;
background-color: #e6f0ff;
border-radius: 20px;
box-shadow: 2px 2px 2px rgb(0 0 0 / 50%);
}
.accordion{
background: #3d4d66;
}
.accordion-heading, .table th {
color: #0663aa;
background-image: none !important;
background-color: #fff;
}
.accordion-heading {
background-image: none !important;
background-color: transparent !important;
}
.accordion-heading, .table th {
border-radius: 0;
}
.accordion-heading {
float: inherit;
width: 100%;
}
.accordion-heading, .table th {
white-space: nowrap;
-webkit-border-radius: 3px 3px 0 0;
-moz-border-radius: 3px 3px 0 0;
border-radius: 3px 3px 0 0;
background-color: #8cbff1;
background-image: -moz-linear-gradient(top, #DCE9F7, #8cbff1);
background-image: -ms-linear-gradient(top, #DCE9F7, #8cbff1);
background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#DCE9F7), to(#8cbff1));
background-image: -webkit-linear-gradient(top, #DCE9F7, #8cbff1);
background-image: -o-linear-gradient(top, #DCE9F7, #8cbff1);
background-image: linear-gradient(top, #DCE9F7, #8cbff1);
background-repeat: repeat-x;
}
.accordion-heading {
border-bottom: 0;
}

#left .collapse {
position: static;
}
.collapse.in {
*display: block;
}
.collapse.in {
height: auto;
}
.collapse {
*display: none;
_position: static;
}
.collapse {
position: relative;
height: 0;
overflow: hidden;
-webkit-transition: height .35s ease;
-moz-transition: height .35s ease;
-o-transition: height .35s ease;
transition: height .35s ease;
}
.accordion-inner {
padding: 0 !important;
}
.accordion-inner {
padding: 8px 13px 3px 13px;
}
.accordion-inner {
padding: 9px 15px;
border-top: 0px solid #e5e5e5;
}
.nav, .breadcrumb {
margin-bottom: 10px;
}
.nav-list {
padding-right: 15px;
padding-left: 15px;
margin-bottom: 0;
}
.nav {
margin-bottom: 20px;
margin-left: 0;
list-style: none;
}
ul, ol {
padding: 0;
margin: 0 0 10px 25px;
}
.nav-list>li>a {
padding: 5px 0px 5px 50px;
font-size: 16px;
}
.nav-list>li>a, .nav-list .nav-header {
text-shadow: 0 0px 0 rgb(255 255 255 / 50%);
}
.nav-list li a {
margin-top: 5px;
margin-bottom: 5px;
_padding-top: 6px;
}
.nav-list>li>a {
padding: 3px 15px;
}
.nav-list>li>a, .nav-list .nav-header {
margin-right: -15px;
margin-left: -15px;
text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
}
.nav>li>a {
display: block;
}
.nav-list a {
color: #ddeafd !important;
}
.nav-list a {
color: #333;
}
a {
color: #3c8dbc;
}
a {
outline: 0;
}
a {
color: #186ECA;
text-decoration: none;
}
.accordion-heading .accordion-toggle {
font-family: "微软雅黑" !important;
font-size: 14px;
_padding-top: 10px;
_padding-bottom: 8px;
}
.accordion-heading .accordion-toggle {
display: block;
padding: 8px 15px;
}
.accordion-heading>a {
font-size: 18px !important;
font-weight: bold !important;
color: #91a0b7 !important;
}
.accordion-toggle {
cursor: pointer;
}
a {
color: #3c8dbc;
}
a {
outline: 0;
}
a {
color: #186ECA;
text-decoration: none;
}
#header {
margin: 0 0 8px;
position: static;
}

#header {
margin: 0 !important;
}
.navbar-fixed-top {
top: 0;
}
.navbar-fixed-top, .navbar-fixed-bottom {
position: fixed;
right: 0;
left: 0;
z-index: 1030;
margin-bottom: 0;
}
.navbar {
*position: relative;
*z-index: 2;
margin-bottom: 20px;
overflow: visible;
}
.navbar-fixed-top .navbar-inner, .navbar-static-top .navbar-inner {
box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
}
.navbar-fixed-top .navbar-inner, .navbar-static-top .navbar-inner {
-webkit-box-shadow: 0 1px 10px rgb(0 0 0 / 10%);
-moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
box-shadow: 0 1px 10px rgb(0 0 0 / 10%);
}
.navbar-fixed-top .navbar-inner, .navbar-fixed-bottom .navbar-inner {
padding-right: 0;
padding-left: 0;
-webkit-border-radius: 0;
-moz-border-radius: 0;
border-radius: 0;
}
.navbar-fixed-top .navbar-inner, .navbar-static-top .navbar-inner {
border-width: 0 0 1px;
}
.navbar-inner {
padding-left: 0px;
padding-right: 0px;
border: none;
*zoom: 1;
background-color: #fff !important;
background-image: none !important;
height: 60px;
width: 100%;
}
.navbar-inner {
min-height: 50px;
padding-right: 20px;
padding-left: 20px;
background-color: #45aeea;
background-image: -moz-linear-gradient(top, #54b4eb, #8CC5F1);
background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#54b4eb), to(#8CC5F1));
background-image: -webkit-linear-gradient(top, #54b4eb, #8CC5F1);
background-image: -o-linear-gradient(top, #54b4eb, #8CC5F1);
background-image: linear-gradient(to bottom, #54b4eb, #8CC5F1);
background-repeat: repeat-x;
border: 1px solid #1990d5;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
*zoom: 1;
-webkit-box-shadow: 0 1px 4px rgb(0 0 0 / 7%);
-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);
box-shadow: 0 1px 4px rgb(0 0 0 / 7%);
}
#header .brand {
font-family: Helvetica, Georgia, Arial, sans-serif, 黑体;
font-size: 26px;
padding-left: 33px;
}
.navbar .brand {
padding: 14px 20px 16px;
font-family: 'Telex', sans-serif;
}
.navbar .brand {
display: block;
float: left;
padding: 15px 20px 15px;
margin-left: -20px;
font-size: 20px;
font-weight: 200;
color: #fff;
}
.brand {
margin: 0px 20px !important;
padding: 0px !important;
line-height: 60px !important;
font-size: 36px !important;
font-weight: bold !important;
color: #000 !important;
}
.navbar .nav.pull-right {
float: right;
margin-right: 0;
}
.navbar .nav {
position: relative;
left: 0;
display: block;
float: left;
margin: 0 10px 0 0;
}
.pull-right {
margin: 10px 25px 0 0 !important;
font-family: "微软雅黑" !important;
font-weight: bold !important;
color: #0b4579 !important;
}
.nav, .breadcrumb {
margin-bottom: 10px;
}
.pull-right {
float: right;
}
.pull-right {
float: right;
}
.pull-right {
float: right;
}
.nav {
margin-bottom: 20px;
margin-left: 0;
list-style: none;
}
ul, ol {
padding: 0;
margin: 0 0 10px 25px;
}
#header li {
font-size: 14px;
_font-size: 12px;
}
.navbar .nav>li {
float: left;
}
.navbar li {
line-height: 20px;
}
li {
line-height: 20px;
}
#userControl>li>a {
/* color: #fff; */
text-shadow: none;
}
.navbar .nav>li>a {
color: #3d4d66;
}
.navbar .nav>li>a {
padding: 16px 10px 14px;
font-family: 'Telex', sans-serif;
text-shadow: 1px 1px 0 rgb(0 0 0 / 20%);
}
.navbar .nav>li>a {
float: none;
padding: 15px 15px 15px;
color: #fff;
text-decoration: none;
}
.nav>li>a {
display: block;
}
a {
color: #3c8dbc;
}
a {
outline: 0;
}
a {
color: #186ECA;
text-decoration: none;
}
.text-red {
color: #dd4b39 !important;
}
.fa {
display: inline-block;
font: normal normal normal 14px/1 FontAwesome;
font-size: inherit;
text-rendering: auto;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}
.dropup, .dropdown {
position: relative;
}
`)
deleteCss();

})();
function deleteCss(){
$('.Nav_wrap_gHB1a').hide();
$('#__sidebar').hide();
$('.woo-panel-main').hide();
$('.wbpv-poster').hide();
$('.woo-box-justifyCenter').hide();
var left = document.createElement("div");
left.id = 'leftId'
left.innerHTML = `<div id="left" style="width: 215px; height: 382px;">
<div class="logo-con">
	<img src="http://166.16.6.193:8088/frame/static/images/tonganjulong-logo-touxiang.jpg" style="background-position: center;
	background-repeat: no-repeat;width:117px;height:107px;background-color:#e6f0ff;border-radius:20px;box-shadow:2px 2px 2px rgba(0,0,0,0.5)">
</div><!-- å½éå -->
<div class="accordion" id="menu-left">
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-20" href="#collapse-20" title="">
				<img id="image-20" src="http://166.16.6.193:8088/frame/static/images/ico-new-20-1.png">
				&nbsp;调拨管理</a>
		</div>
		<div id="collapse-20" class="accordion-body collapse in">
			<div class="accordion-inner">
				<ul class="nav nav-list">	 	 	 <li class="active"><a data-href=".menu3-2002" onclick="clickallMenuTree('200209')" href="http://166.16.6.193:8088/frame/main/logout">
					<i></i>&nbsp;下拨汇总
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="disconnect();" href="http://166.16.6.193:8088/frame/main/logout">
					<i></i>&nbsp;上缴汇总
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200201')" href="http://166.16.6.193:8088/frame/main/allocation/v01/boxHandover/handout" target="mainFrame">
					<i></i>&nbsp;箱袋下拨
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200203')" href="http://166.16.6.193:8088/frame/main/allocation/v01/boxHandover/handin" target="mainFrame">
					<i></i>&nbsp;箱袋上缴
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200202')" href="http://166.16.6.193:8088/frame/main/allocation/v01/cashOrder" target="mainFrame">
					<i></i>&nbsp;现金预约
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200210')" href="http://166.16.6.193:8088/frame/main/allocation/v01/cashReserve/list" target="mainFrame">
					<i></i>&nbsp;备用金预约
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('202107')" href="http://166.16.6.193:8088/frame/main/allocation/v01/emergencyCashOrder" target="mainFrame">
					<i></i>&nbsp;应急预约登记
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200221')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allTaskApplyInfo" target="mainFrame">
					<i></i>&nbsp;任务申请
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('202103')" href="http://166.16.6.193:8088/frame/main/store/v01/StoBoxAccount" target="mainFrame">
					<i></i>&nbsp;箱包调拨申请
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('202104')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allocationSummary" target="mainFrame">
					<i></i>&nbsp;现金预约实时统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200222')" href="http://166.16.6.193:8088/frame/main/allocation/v01/cashConfirm" target="mainFrame">
					<i></i>&nbsp;现金接收确认
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-2002" onclick="clickallMenuTree('200212')" href="http://166.16.6.193:8088/frame/main/allocation/v01/report/boxOutAndInInfoReport/list" target="mainFrame">
					<i></i>&nbsp;出入库交接统计表
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-120" href="#collapse-120" title="">
				<img id="image-120" src="http://166.16.6.193:8088/frame/static/images/ico-new-120.png">
				&nbsp;中心收款</a>
		</div>
		<div id="collapse-120" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list"> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-1201" onclick="clickallMenuTree('12011')" href="http://166.16.6.193:8088/frame/main/allocation/v01/centralCollection" target="mainFrame">
					<i></i>&nbsp;收款登记
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-31" href="#collapse-31" title="">
				<img id="image-31" src="http://166.16.6.193:8088/frame/static/images/ico-new-31.png">
				&nbsp;交接管理</a>
		</div>
		<div id="collapse-31" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-80001" onclick="clickallMenuTree('8000101')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allocationConnect/list" target="mainFrame">
					<i></i>&nbsp;库区交接登记
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-3103" onclick="clickallMenuTree('310301')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allocationPay" target="mainFrame">
					<i></i>&nbsp;配款室交款
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-310302" onclick="clickallMenuTree('31030201')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allocationDraw/drawList" target="mainFrame">
					<i></i>&nbsp;配款室领款
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-3104" onclick="clickallMenuTree('310401')" href="http://166.16.6.193:8088/frame/main/allocation/v01/blancePayment/PayIn" target="mainFrame">
					<i></i>&nbsp;清分尾款上缴
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-3104" onclick="clickallMenuTree('310402')" href="http://166.16.6.193:8088/frame/main/allocation/v01/blancePayment/PayOut" target="mainFrame">
					<i></i>&nbsp;清分尾款取回
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->  	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-3105" onclick="clickallMenuTree('310501')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allQrcodeRegistInfo/list" target="mainFrame">
					<i></i>&nbsp;库区交接扫描
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-3107" onclick="clickallMenuTree('310701')" href="http://166.16.6.193:8088/frame/main/allocation/v01/smallPay/list" target="mainFrame">
					<i></i>&nbsp;尾零交款登记
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-35" href="#collapse-35" title="">
				<img id="image-35" src="http://166.16.6.193:8088/frame/static/images/ico-new-35.png">
				&nbsp;差错管理</a>
		</div>
		<div id="collapse-35" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list"> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-3502" onclick="clickallMenuTree('350201')" href="http://166.16.6.193:8088/frame/main/store/v01/stoBoxErrorInfo" target="mainFrame">
					<i></i>&nbsp;开箱卡把差错管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-52" href="#collapse-52" title="">
				<img id="image-52" src="http://166.16.6.193:8088/frame/static/images/ico-new-52.png">
				&nbsp;现金账务</a>
		</div>
		<div id="collapse-52" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">  	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-5205" onclick="clickallMenuTree('520501')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allCashErrorInfo" target="mainFrame">
					<i></i>&nbsp;账务登记
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-5204" onclick="clickallMenuTree('520401')" href="http://166.16.6.193:8088/frame/main/allocation/v01/TradeAccount" target="mainFrame">
					<i></i>&nbsp;同业账
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-5206" onclick="clickallMenuTree('520601')" href="http://166.16.6.193:8088/frame/main/allocation/v01/tradeAccountInOut" target="mainFrame">
					<i></i>&nbsp;同业转出
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-40" href="#collapse-40" title="">
				<img id="image-40" src="http://166.16.6.193:8088/frame/static/images/ico-new-40.png">
				&nbsp;自助设备</a>
		</div>
		<div id="collapse-40" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-4001" onclick="clickallMenuTree('400101')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmBrandsInfo" target="mainFrame">
					<i></i>&nbsp;品牌型号
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4001" onclick="clickallMenuTree('400103')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmInfoMaintain" target="mainFrame">
					<i></i>&nbsp;自助设备维护
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4002" onclick="clickallMenuTree('400201')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmPlanInfo/importFile" target="mainFrame">
					<i></i>&nbsp;计划管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4002" onclick="clickallMenuTree('400203')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmClearEvidence" target="mainFrame">
					<i></i>&nbsp;清机管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4002" onclick="clickallMenuTree('400204')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmRetaincardManageInfo" target="mainFrame">
					<i></i>&nbsp;吞卡管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4003" onclick="clickallMenuTree('400301')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmBindingInfo" target="mainFrame">
					<i></i>&nbsp;加钞管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4003" onclick="clickallMenuTree('400302')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmPlanInfo/addSpePlanList" target="mainFrame">
					<i></i>&nbsp;特殊计划
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4003" onclick="clickallMenuTree('400303')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmBoxInfo" target="mainFrame">
					<i></i>&nbsp;钞箱管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-4003" onclick="clickallMenuTree('400304')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmPlanInfo/equipmentAddCash" target="mainFrame">
					<i></i>&nbsp;自助设备加钞
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->  	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4005" onclick="clickallMenuTree('400501')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmEquipmentGoodsInfo" target="mainFrame">
					<i></i>&nbsp;设备物品维护
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4006" onclick="clickallMenuTree('400602')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmEquipmentGoodsHandoverInfo" target="mainFrame">
					<i></i>&nbsp;设备物品交接管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4007" onclick="clickallMenuTree('400701')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmRetaincardRegistInfo" target="mainFrame">
					<i></i>&nbsp;吞卡交接记录
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-101001" onclick="clickallMenuTree('10100101')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmShutDownInfo/list" target="mainFrame">
					<i></i>&nbsp;设备终止
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4008" onclick="clickallMenuTree('400801')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmPlanInfo/atmBanknotesInfoList" target="mainFrame">
					<i></i>&nbsp;ATM加钞钞包
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-4009" onclick="clickallMenuTree('400901')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmRetaincardInfo" target="mainFrame">
					<i></i>&nbsp;吞卡基础数据信息
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-10" href="#collapse-10" title="">
				<img id="image-10" src="http://166.16.6.193:8088/frame/static/images/ico-new-10.png">
				&nbsp;中心管理</a>
		</div>
		<div id="collapse-10" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">	 	 	 	 	 	 	 	 <li><a data-href=".menu3-1001" onclick="clickallMenuTree('100101')" href="http://166.16.6.193:8088/frame/main/store/v01/stoBoxInfo/list" target="mainFrame">
					<i></i>&nbsp;箱袋管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('100102')" href="http://166.16.6.193:8088/frame/main/store/v01/stoEscortInfo/list" target="mainFrame">
					<i></i>&nbsp;人员管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('100103')" href="http://166.16.6.193:8088/frame/main/store/v01/stoRouteInfo/list" target="mainFrame">
					<i></i>&nbsp;线路管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('100110')" href="http://166.16.6.193:8088/frame/main/store/v01/stoCarInfo/list" target="mainFrame">
					<i></i>&nbsp;车辆管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('100112')" href="http://166.16.6.193:8088/frame/main/store/v01/stoRouteInfo/checkRouteList" target="mainFrame">
					<i></i>&nbsp;查看线路
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('100113')" href="http://166.16.6.193:8088/frame/main/store/v01/stoRelevanceOffice/list" target="mainFrame">
					<i></i>&nbsp;商行物品关联
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('202105')" href="http://166.16.6.193:8088/frame/main/allocation/v01/hardCoinNumSet/form" target="mainFrame">
					<i></i>&nbsp;硬币额度配置
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('456132')" href="http://166.16.6.193:8088/frame/main/store/v01/largeCoinsConfig/list" target="mainFrame">
					<i></i>&nbsp;网点硬币额度信息
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1001" onclick="clickallMenuTree('8974563')" href="http://166.16.6.193:8088/frame/main/store/v01/voucherPackageInfo/list" target="mainFrame">
					<i></i>&nbsp;包类管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-1002" onclick="clickallMenuTree('100209')" href="http://166.16.6.193:8088/frame/main/store/v01/storeManagementInfo/graph" target="mainFrame">
					<i></i>&nbsp;库房管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-1002" onclick="clickallMenuTree('100211')" href="http://166.16.6.193:8088/frame/main/store/v01/StoreManagementAccount/graph" target="mainFrame">
					<i></i>&nbsp;库区台账
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-90" href="#collapse-90" title="">
				<img id="image-90" src="http://166.16.6.193:8088/frame/static/images/ico-new-90.png">
				&nbsp;报表统计</a>
		</div>
		<div id="collapse-90" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">	 	 	 	 	 	 <li><a data-href=".menu3-9001" onclick="clickallMenuTree('110666')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/currentOpenBoxList" target="mainFrame">
					<i></i>&nbsp;开箱可视化监控
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('110667')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/currentBoxUpList" target="mainFrame">
					<i></i>&nbsp;配款可视化监控
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('200220')" href="http://166.16.6.193:8088/frame/main/report/v01/graph/toAllocationGraphPage" target="mainFrame">
					<i></i>&nbsp;上缴下拨数据可视化
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900133')" href="http://166.16.6.193:8088/frame/main/report/v01/graph/stoBoxValidate" target="_blank">
					<i></i>&nbsp;开箱卡把数据监控
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900134')" href="http://166.16.6.193:8088/frame/main/report/v01/graph/stoBoxValidateForAssembly" target="_blank">
					<i></i>&nbsp;装箱配款数据监控
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900144')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/stoBoxValidateSummary" target="mainFrame">
					<i></i>&nbsp;卡把配款中心工位统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900143')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/customerStatistics" target="mainFrame">
					<i></i>&nbsp;卡把配款中心客户统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900147')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmCashBoxInfo/atmStationStatistics" target="mainFrame">
					<i></i>&nbsp;ATM中心工位统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900146')" href="http://166.16.6.193:8088/frame/main/atm/v01/atmCashBoxInfo/atmCustomerStatistics" target="mainFrame">
					<i></i>&nbsp;ATM中心客户统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900148')" href="http://166.16.6.193:8088/frame/main/store/v01/stoBoxInfo/showBoxStatus" target="mainFrame">
					<i></i>&nbsp;箱包状态实时监控
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900149')" href="http://166.16.6.193:8088/frame/main/allocation/v01/boxHandover/addEscortStatistics" target="mainFrame">
					<i></i>&nbsp;ATM加钞人员统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900909')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/supplementList" target="mainFrame">
					<i></i>&nbsp;开箱补录
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900145')" href="http://166.16.6.193:8088/frame/main/store/stoBoxValidate/stoBoxValidateOperator" target="mainFrame">
					<i></i>&nbsp;卡把配款中心人员统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900150')" href="http://166.16.6.193:8088/frame/main/allocation/v01/allInOutStatistics" target="mainFrame">
					<i></i>&nbsp;上缴下解流程统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('900161')" href="http://166.16.6.193:8088/frame/main/weChat/v04/updoorInfo/updoorCustomerStatistics" target="mainFrame">
					<i></i>&nbsp;上门收款客户统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-9001" onclick="clickallMenuTree('202020')" href="http://166.16.6.193:8088/frame/main/store/v01/stoBoxStatistics/list" target="mainFrame">
					<i></i>&nbsp;箱包库存统计报表
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> -->
					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-38" href="#collapse-38" title="">
				<img id="image-38" src="http://166.16.6.193:8088/frame/static/images/ico-new-38.png">
				&nbsp;上门收款</a>
		</div>
		<div id="collapse-38" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list">  	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-3801" onclick="clickallMenuTree('22233')" href="http://166.16.6.193:8088/frame/main/weChat/v04/updoorDifference" target="mainFrame">
					<i></i>&nbsp;差错登记单
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
					<i></i>&nbsp;上门收款清分
					</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-3801" onclick="clickallMenuTree('380119')" href="http://166.16.6.193:8088/frame/main/weChat/v04/doorAllocationInfo" target="mainFrame">
					<i></i>&nbsp;上门收款预约
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-3801" onclick="clickallMenuTree('8765')" href="http://166.16.6.193:8088/frame/main/weChat/v04/updoorWorker" target="mainFrame">
					<i></i>&nbsp;工位统计
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-39" href="#collapse-39" title="">
				<img id="image-39" src="http://166.16.6.193:8088/frame/static/images/ico-new-39.png">
				&nbsp;微信管理</a>
		</div>
		<div id="collapse-39" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list"> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-3091" onclick="clickallMenuTree('390101')" href="http://166.16.6.193:8088/frame/main/weChat/v03/Guest" target="mainFrame">
					<i></i>&nbsp;客户授权
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-3091" onclick="clickallMenuTree('390102')" href="http://166.16.6.193:8088/frame/main/weChat/v03/sysMessageSendAuthorization" target="mainFrame">
					<i></i>&nbsp;消息授权
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
	<div class="accordion-group">
		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu-left" data-href="#collapse-01" href="#collapse-01" title="">
				<img id="image-01" src="http://166.16.6.193:8088/frame/static/images/ico-new-01.png">
				&nbsp;系统配置</a>
		</div>
		<div id="collapse-01" class="accordion-body collapse ">
			<div class="accordion-inner">
				<ul class="nav nav-list"> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <li><a data-href=".menu3-0102" onclick="clickallMenuTree('010203')" href="http://166.16.6.193:8088/frame/main/sys/user/" target="mainFrame">
					<i></i>&nbsp;用户管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->
				</li><li><a data-href=".menu3-0102" onclick="clickallMenuTree('010202')" href="http://166.16.6.193:8088/frame/main/sys/office/" target="mainFrame">
					<i></i>&nbsp;机构管理
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --> 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 </li><li><a data-href=".menu3-0106" onclick="clickallMenuTree('010601')" href="http://166.16.6.193:8088/frame/main/sys/serviceConfiguration" target="mainFrame">
					<i></i>&nbsp;业务配置
				</a>
					<!-- <ul class="nav nav-list hide" style="margin:0;padding-right:0;"> -->

					<!-- </ul> --><!-- </li> --></li></ul>
			</div>
		</div>
	</div>
</div>
</div>`;
var top = document.createElement("div");
top.id = 'topId'
top.innerHTML = `<div id="header" class="navbar navbar-fixed-top">
<div class="navbar-inner">
	<div class="brand">
		<span id="productName">

		区域现金处理中心——南通管理平台	</span>
	</div>	<ul id="userControl" class="nav pull-right">
	<li><a href="#"><i class="fa  fa-bank  text-red"></i>&nbsp;归属机构：区域现金处理中心</a></li>
	<li id="userInfo" class="dropdown">
		<a class="dropdown-toggle" data-toggle="dropdown" href="#" title="个人信息"><i class="fa fa-user  text-red"></i>&nbsp;&nbsp;您好, 王皓晨&nbsp;<span id="notifyNum" class="label label-info hide"></span></a>
	</li>
	<li><a id="logoutBtn" href="http://166.16.6.193:8088/frame/main/logout" onclick="disconnect();" title="退出登录"><i class="fa fa-sign-out  text-red"></i>&nbsp;退出</a></li>
</ul>	<div class="nav-collapse">
	<ul id="menu" class="nav" style="*white-space:nowrap;float:none;">		<li class="menu_ico  active">		</li>


		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>

		<li class="menu_ico ">		</li>


		<li class="menu_ico ">		</li>


		<li class="menu_ico ">		</li>

	</ul>
</div>
</div>
</div>`
document.body.appendChild(left);
document.body.appendChild(top);
$('img').hide();
$(document).attr("title","区域现金处理中心");
}