// ==UserScript==
// @name         报纸灰完美版OK-05-18
// @namespace    http://tampermonkey.net/
// @version      2017051016
// @description  报纸灰完美版
// @author       You
// @exnclude   view-source:https://www.google.com.hk/_/chrome/newtab?espv=2&ie=UTF-8
// @exnclude    https://www.inoreader.com/*
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29482/%E6%8A%A5%E7%BA%B8%E7%81%B0%E5%AE%8C%E7%BE%8E%E7%89%88OK-05-18.user.js
// @updateURL https://update.greasyfork.org/scripts/29482/%E6%8A%A5%E7%BA%B8%E7%81%B0%E5%AE%8C%E7%BE%8E%E7%89%88OK-05-18.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Basic fonts and color scheme. */",
"html,body{background-image:url(https://pbs.twimg.com/media/C96hPzcV0AA-rUn.jpg)! important;font-family:'Microsoft Yahei', sans-serif !important;}",
"div,text,span,a,div,p,text,li,ul,input{font-family:'Microsoft Yahei'!important;}",
"p,text,input{color:#0000!important;} ",
"a{color:#0066CB!important;}", /*备用#3c78d8*/
/*去页面原始背景自定义*/
".jhp input[type='submit'], .sbdd_a input,.gbqfba,div,p,ul,text,.s-opacity-65 .s-opacity-white-background{background:transparent!important;}",
"body,.S_page,div,li,p,text,dt,fieldset,input{background-color:transparent!important;}",
"div,.s-opacity-65 .s-opacity-white-background{background:url(hidden)!important;}",
"div,a{background-color:transparent!important;}",
/*google去边框杂乱属性以保持与背景一致*/
"p,text,i,input,.rightli{background:url(hidden)!important;}",
".lst-c,.sbib_b{overflow:visible!important;}",
"div#hplogo{background:url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)!important;}",
".gb_5b{background-image:url(http://ssl.gstatic.com/gb/images/i1_1967ca6a.png)!important;}",
 /*wobo二级页面背景去掉*/
"body.FRAME_login{background-repeat:repeat!important;}", 
"div.zm-item-rich-text.expandable.js-collapse-body,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:rgba(247,238,214,0.4)!important;}",
/*文本背景着米黄色背景*/
"p{background-color:rgba(247,238,214,0.6)!important;}",
/*滚动条颜色*/
"body{",
"SCROLLBAR-FACE-COLOR: #D9D9D9;",
"SCROLLBAR-HIGHLIGHT-COLOR: #D0D0D0;",
"SCROLLBAR-SHADOW-COLOR: #D8D8D8;",
"SCROLLBAR-3DLIGHT-COLOR:#D0D0D0;",
"SCROLLBAR-ARROW-COLOR:#D0D0D0;",
"SCROLLBAR-TRACK-COLOR:#D0D0D0;",
"SCROLLBAR-DARKSHADOW-COLOR:#D0D0D0;",
"                   }",
/*baidu美化+页头背景美化+磨砂新闻流背景*/
".s-mancacrd-main {box-shadow: 0px 0px 50px #000;}",
".s-skin-hasbg .btn, .s-skin-hasbg .btn_wr,.s-down#s_top_wrap .s-center-box{background:url(hidden)!important;}",
"em{color:ff3300!important;}",
".news-title{",  
"               padding-left:1.1em;",
"               background: hsla(0,0%,100%,.25)border-box;",   
      
"                     } ",  
   
                     /*使用滤镜模糊边缘*/  
".news-title::before{",   
"                         content: '';",   
"                         position: absolute;",   
"                         top: 0; rightright: 0; bottombottom: 0; left: 0;",   
"                         margin: -30px;",   
"                         z-index: -1;",   
"                        -webkit-filter: blur(20px);",   
"                         filter: blur(20px);",   
"                    } ",
 /*中华珍宝网背景设置*/
"div#map,div#imgview{background-image:url(https://pbs.twimg.com/media/C-TAtJIV0AA3mx-.jpg:large)!important;}",
 /*推特宽屏设置*/
" .gb_ka,.ProfilePage,.global-nav .search-input,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:transparent!important;}",/*二级页面页头背景色透明化*/
".content-main {",
"    float: right!important;",
"    width: 877.2px!important;",
"                    }",
":not(.no-header-background-module).stream-item {",
"    background-color:rgba(247,238,214,0.4)!important;",
"    border-left:hidden!important;",
"    border-right:hidden!important;",
"   float:right!important;", /*推特二级页面宽屏效果-测试OK-新增*/ 
"   width: 877.2px!important;", /*推特二级页面宽屏效果-测试OK-新增*/
"                    }",
".ProfileSidebar,.ProfileSidebar--withLeftAlignment{display:none!important;}",/*左块状元素隐藏测试OK-新增*/ 
".account, .tweet, .app {border-bottom-color:#bcb9b9!important;} ", 
".AdaptiveMedia{max-height:100%!important;max-width:100%!important;}",
".Trends,.module .flex-module{border:hidden!important;}",
".new-tweets-bar {border-bottom-color:#535353!important;}",/*新增*/
".DashboardProfileCard{border-top:hidden!important;border-color:#bcb9b9!important;}",/*新增 信息卡框线颜色改变*/ ".new-tweets-bar{border-top:hidden!important;}",/*新增*/
".top-timeline-tweetbox .timeline-tweet-box,.RichEditor{border:hidden!important;}",/*新增*/
 /*facebook宽屏设置*/
"._4-u2,._2yq ._4-u2::before,._2yq ._4-u2,._5vsj .UFIRow._4204{border:hidden!important;}",
"._a7s,._5v3q ._5mxv {border-top-color:#bcb9b9!important;}",
"._4-u8 {",
"    padding-left:3em;",
"    background-color:rgba(247,238,214,0.4)!important;",
"    width: 840px!important;",
"                     }",
"._64b{display: none!important;}",
":first-child._1-ia, .sidebarMode #pagelet_rhc_ticker_card ~ .pagelet ._1-ia，._g3h，._4cwn,._1c02,._4v9u,._g3i span._38my{display: none!important;}",
/*ins页面背景设置*/
"._rnpza,._5z3y6,._oofbn{background-color:transparent!important;}",/*新增页头,页中，背景透明*/
"._82fo9, ._cag6k, ._gs7sp, ._h2d1o, ._mbp5e, ._s6b3o{background-color:transparent!important;border-color:#535353!important;border-radius:25px!important;}",/*新增 0512加圆角*/
"._82fo9, ._cag6k, ._gs7sp, ._h2d1o, ._mbp5e, ._s6b3o{background-color:rgba(0, 0, 0,0.3)!important;box-shadow: 0px 0px 70px #000!important;}",/*新增页面信息流发光效果*/
"._ea084,._n3cp9,._tjnr4,._ksjel,._a1rcs{background-image:url(https://pbs.twimg.com/media/C-Vd5lbUAAEMVtg.jpg:large)!important;}", /*ins点击图片后文本背景设置*/
"._98hun {background:transparent!important;}",/*新增主面搜索背景框透明*/
/*@media all and (min-width:736px)*/
/*点击图片后放大设置*/
"._n3cp9 {max-width: 1020px!important;}",
"._n3cp9{box-shadow: 0px 0px 60px #3c78d8!important;}",/*新增放大图片发光效果*/
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
"div.zg-wrap {margin-left:440px!important;width: 1300px!important;}", 
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
/*知乎搜索下拉背景色不透明,宽度自动*报纸灰*/ 
".ac-renderer {width: auto!important;background-image:url(https://pbs.twimg.com/media/C96hPzcV0AA-rUn.jpg)!important;}",
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
