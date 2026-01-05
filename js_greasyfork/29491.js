// ==UserScript==
// @name         格线+背景绿完美版OK-05-10
// @namespace    http://tampermonkey.net/
// @version      20170510006
// @description  格线+背景绿完美版
// @author       You
// @exnclude   view-source:https://www.google.com.hk/_/chrome/newtab?espv=2&ie=UTF-8
// @exnclude    https://www.inoreader.com/*
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29491/%E6%A0%BC%E7%BA%BF%2B%E8%83%8C%E6%99%AF%E7%BB%BF%E5%AE%8C%E7%BE%8E%E7%89%88OK-05-10.user.js
// @updateURL https://update.greasyfork.org/scripts/29491/%E6%A0%BC%E7%BA%BF%2B%E8%83%8C%E6%99%AF%E7%BB%BF%E5%AE%8C%E7%BE%8E%E7%89%88OK-05-10.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Basic fonts and color scheme. */",
"html,body{background-image:url(http://source.wwqk.net/b.png)!important;background-color:#CEEACA!important;font-family:'Microsoft Yahei', sans-serif !important;}",  
"body,text,input{color:#000!important;}",   
"a{color:#0066CB!important;}",   //*备用#3c78d8*//
".jhp input[type='submit'], .sbdd_a input,.gbqfba,div,p,ul,text,a,.s-opacity-65 .s-opacity-white-background{background:transparent!important;}",  
"body,.S_page,div,li,p,text,dt,fieldset,input{background-color:transparent!important;}",  
"div,.s-opacity-65 .s-opacity-white-background{background:url(hidden)!important;}",  
"div,a{background-color:transparent!important;}",
/*google去边框杂乱属性以保持与背景一致*/
"a,p,text,i,input,.rightli{background:url(hidden)!important;}",
".lst-c,.sbib_b{overflow:visible!important;}",
"div#hplogo{background:url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)!important;}",
".gb_5b{background-image:url(http://ssl.gstatic.com/gb/images/i1_1967ca6a.png)!important;",
 /*wobo二级页面背景去掉*/
"body.FRAME_login{background-repeat:repeat!important;}",   
"SCROLLBAR-FACE-COLOR: #00b98d;",  
"SCROLLBAR-HIGHLIGHT-COLOR:#f6f6f6;",  
"SCROLLBAR-SHADOW-COLOR: #00b98d;",  
"SCROLLBAR-3DLIGHT-COLOR:#f6f6f6;",  
"SCROLLBAR-ARROW-COLOR:#f6f6f6;",  
"SCROLLBAR-TRACK-COLOR:#f6f6f6;",  
"SCROLLBAR-DARKSHADOW-COLOR:#f6f6f6;",  
"                    }",  
"em{color:rgba(0, 128, 0, 1)!important;}",    
"input{background-color:rgba(206, 234, 202,0.05);box-shadow: 0px 0px 50px #00b98d!important;}",  
"p,div.zm-item-rich-text.expandable.js-collapse-body,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:rgba(0, 185, 141,0.1)!important;}",  
".news-title{",   
"                   padding-left:1.1em;",
"                  background: hsla(0,0%,100%,.1)border-box; ",  
      
"                     }", 
   
                     /*使用滤镜模糊边缘*/  
".news-title::before{",   
"                         content: '';",   
"                         position: absolute;",    
"                         top: 0; rightright: 0; bottombottom: 0; left: 0;",   
"                         margin: -30px;",   
"                         z-index: -1;",   
"                         -webkit-filter: blur(20px);",   
"                         filter: blur(20px);",   
"                    }",  
"._6ltyr,._oofbn,._tn2fu,._6v8vp{background-image:url(https://pbs.twimg.com/media/C-Vd5lbUAAEMVtg.jpg:large)!important;}",
"._98hun,._ea084,._n3cp9,._tjnr4,._ksjel {background-image:url(https://pbs.twimg.com/media/C-Vd5lbUAAEMVtg.jpg:large)!important;}",
"._lv5ky ._r3k3c {margin-right:0px!important;}",
".H-Logo {width: 122px!important;height:45px!important;float:left!important;background-image: url(https://i1.letvimg.com/lc07_img/201703/06/10/26/logo.png)!important;}",
 /*中华珍宝网背景设置*/
"div#map,div#imgview{background-image:url(https://pbs.twimg.com/media/C-TAtJIV0AA3mx-.jpg:large)!important;}",
 /*推特宽屏设置*/
".content-main {",
"    padding-left:0.2em;",
"    float: right!important;",
"    width: 876px!important;",
"} ", 
":not(.no-header-background-module).stream-item {",
"    background-color:rgba(0, 185, 141,0.1)!important;",
"    border-left:hidden!important;",
"    border-right:hidden!important;",
"}",
".account, .tweet, .app {border-bottom-color:#bcb9b9!important;}",
".AdaptiveMedia{max-height:100%!important;max-width:100%!important;}",
".Trends,.module .flex-module{border:hidden!important;}", 
".new-tweets-bar {border-bottom-color:#535353!important;}",/*新增*/
".DashboardProfileCard{border-top:hidden!important;}",/*新增*/
".new-tweets-bar{border-top:hidden!important;}",/*新增*/
 ".top-timeline-tweetbox .timeline-tweet-box,.RichEditor{border:hidden!important;}",/*新增*/
 /*facebook宽屏设置*/
"._4-u2,._2yq ._4-u2::before,._2yq ._4-u2,._5vsj .UFIRow._4204{border:hidden!important;}",
"._a7s,._5v3q ._5mxv {border-top-color:#666666!important;}",
"._4-u8{",
"    padding-left:3em;",
"    background-color:rgba(0, 185, 141,0.1)!important;",
"    width: 840px!important;",
"}",
"._64b{display: none!important;}",
":first-child._1-ia, .sidebarMode #pagelet_rhc_ticker_card ~ .pagelet ._1-ia，._g3h，._4cwn,._1c02,._4v9u,._g3i span._38my{display: none!important;}",
 /*ins页面背景设置*/
"._6ltyr,._oofbn,._tn2fu,._6v8vp{background-image:url(https://pbs.twimg.com/media/C-Vd5lbUAAEMVtg.jpg:large)!important;}",  
 /*ins点击图片后文本背景设置*/
" ._98hun,._ea084,._n3cp9,._tjnr4,._ksjel,._a1rcs{background-image:url(https://pbs.twimg.com/media/C-Vd5lbUAAEMVtg.jpg:large)!important;}",
/*@media all and (min-width:736px)*/
/*点击图片后放大设置*/
"._n3cp9 {max-width: 1020px!important;}",
"._djxz1._j5hrx {padding-right:0px!important;}",
/*点击图片后文字体颜色 透明实行隐藏设置*/  
 "._djxz1 ._rgrbt{display:none!important;}", /*instagram隐藏大图所有内容，只看图*/ 
"._de018 {right: -80px!important;}",
/*知乎宽屏设置*/ 
"div.zu-main-sidebar,.HomeEntry-draft{display: none !important;}", 
".Card-section {display: none !important;}", 
".HomeEntry-box{border:hidden!important;}", 
".Input-wrapper{border:hidden!important;}", 
".Button{border:hidden!important;}", 
"div.zg-wrap {margin-left:auto!important;width: 1300px!important;}", 
".Card {margin-left:0px!important;border:hidden!important;width: 1000px!important;}", 
".feed-item { padding: 20px 0!important;}", 
".zu-main-feed-con{border-top-color:#535353!important;}", 
".QuestionMainDivider::before{border-top-color:#535353!important;}", 
".feed-item + .feed-item {border-top-color:#535353!important;}", 
".QuestionHeader{border-bottom-color:#535353!important;}", 
":not(:last-child).List-item::after{border-bottom-color:#535353!important;}", 
".Question-main {display: block!important;}", 
".AppHeader{ background:transparent!important;}", 
".Navbar{ background:transparent!important;}", 
".SearchBar-input {width: 200px;}", 
".Input-wrapper{border:hidden!important;}", 
".zm-votebar .down,.zm-votebar .up{color:#535353!important;background:transparent!important;}",
/*知乎搜索下拉背景色不透明,宽度自动*背景绿*/
 ".ac-renderer {",
  "  width: auto!important;",
  "  background-color: #CEEACA!important;",
  "}",
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
