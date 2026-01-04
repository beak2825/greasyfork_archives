// ==UserScript==
// @name         适合电脑浏览的maimai鸡盘游玩记录的排版
// @namespace    https://www.acgsteps.com:1001/
// @version      1.2
// @description  为了截图方便而已0.0
// @author       GYlove1994
// @match        https://my-aime.cn/player/recent_play
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429906/%E9%80%82%E5%90%88%E7%94%B5%E8%84%91%E6%B5%8F%E8%A7%88%E7%9A%84maimai%E9%B8%A1%E7%9B%98%E6%B8%B8%E7%8E%A9%E8%AE%B0%E5%BD%95%E7%9A%84%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/429906/%E9%80%82%E5%90%88%E7%94%B5%E8%84%91%E6%B5%8F%E8%A7%88%E7%9A%84maimai%E9%B8%A1%E7%9B%98%E6%B8%B8%E7%8E%A9%E8%AE%B0%E5%BD%95%E7%9A%84%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
var whenReadyToStop;
var whenReadyToStopSet;
var flexBoxWidth = "20%";
function setFlex() {
	var pageWidth = $(window).width();
	$("body").css("max-width",$(window).width());
	$("h3").css("text-align","center");
	$("div.recent-plays.narrow-column").css("max-width",$(window).width());
	$("div.recent-plays.narrow-column").css("margin","auto");
	$("div.recent-plays.narrow-column div:first").css({
		"display":"flex",
		"flex-wrap":"wrap",
		"justify-content":"center"
	});
	$("ul.pagination.row.s12").css({
		"align-self":"center",
		"width":"100%"
	});
	$("div.playlog-item").css({
		"margin":"10px",
        "min-width":"400px"
	});
	$("div.playlog-item").css("width",flexBoxWidth);
	if($("div.playlog-item").length != 0){
		clearInterval(whenReadyToStop);
	}
	if($(".button_box").length === 0){
		setButton();
	}
	// console.log($("div.playlog-item").length);
	// console.log($("button_box").length+" box");
}
let setButton = function () {
	$("form.right-align").after("<style>.myButton{-moz-box-shadow:0 0 0 2px #9fb4f2;-webkit-box-shadow:0 0 0 2px #9fb4f2;box-shadow:0 0 0 2px #9fb4f2;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#7892c2),color-stop(1,#476e9e));background:-moz-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-webkit-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-o-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-ms-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:linear-gradient(to bottom,#7892c2 5%,#476e9e 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#7892c2',endColorstr='#476e9e',GradientType=0);background-color:#7892c2;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;border:1px solid #4e6096;display:inline-block;cursor:pointer;color:#fff;font-family:Arial;font-size:19px;padding:5px 37px;text-decoration:none;text-shadow:0 1px 0 #283966}.myButton:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#476e9e),color-stop(1,#7892c2));background:-moz-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-webkit-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-o-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-ms-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:linear-gradient(to bottom,#476e9e 5%,#7892c2 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#476e9e',endColorstr='#7892c2',GradientType=0);background-color:#476e9e}.myButton:active{position:relative;top:1px}</style>")
	$("form.right-align").after("<div class='button_box'><a href=\"#\" id='button_3' class=\"myButton\">每行3个</a></div>");
	$(".button_box").append("<a href=\"#\" id='button_4' class=\"myButton\">每行4个</a>");
	$(".button_box").append("<a href=\"#\" id='button_5' class=\"myButton\">最多显示</a>");
	$(".button_box").css({
		"display":"flex",
		"justify-content":"center"
	})
	$("#button_3").click(function () {
		flexBoxWidth = "25%";
		setFlex();
	});
	$("#button_4").click(function () {
		flexBoxWidth = "20%";
		setFlex();
	});
	$("#button_5").click(function () {
		flexBoxWidth = "auto";
		setFlex();
	});
}
$(function (){
	whenReadyToStop = setInterval(setFlex,50);
	whenReadyToStopSet = setInterval(setClick,50);
})
$("body")[0].onresize = function () {
	setFlex();
}
let setClick = function () {
	setFlex();
}