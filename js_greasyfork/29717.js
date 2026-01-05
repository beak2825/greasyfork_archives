// ==UserScript==
// @name         老木纹完美版OK-2020-01-02
// @namespace    http://tampermonkey.net/
// @version      2020-01-02
// @description  老木纹完美版
// @author       You
// @exnclude    https://www.inoreader.com/*
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29717/%E8%80%81%E6%9C%A8%E7%BA%B9%E5%AE%8C%E7%BE%8E%E7%89%88OK-2020-01-02.user.js
// @updateURL https://update.greasyfork.org/scripts/29717/%E8%80%81%E6%9C%A8%E7%BA%B9%E5%AE%8C%E7%BE%8E%E7%89%88OK-2020-01-02.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Basic fonts and color scheme. */",
"html,body{background:url(https://s2.ax1x.com/2019/11/26/QSwMAe.jpg) fixed !important;font-family: ''!important;}",
	//*https://s2.ax1x.com/2019/12/04/QQBcCT.jpg*https://pbs.twimg.com/media/C_xbf9oUAAEHi1H.jpg:large   no-repeat center center fixed//
"a{color:#999999!important;backgroundcolor:rgba(0, 0, 0,1)!important;}",
"user, .detailed-note, .comment .box, .simple-shortcut, .promo-item,*,div,text,.p,html,body,img,ul,.cata-title,.cata-tag,.tag-item,.s-opacity-65 .s-opacity-blank3{ border-color: #4c4a59!important;}",
"div,text,span,a,div,p,text,li,ul,input{font-family: ''!important;}",/*Microsoft Yahei*/
"body,h1,div,p,span,text,input,.s-opacity-65 .s-opacity-white-background,ul{color:#d9d9d9!important;}",
"span{color:#cccccc!important;}",
"em{color:rgba(0, 128, 0, 1)!important;}", 
".jhp input[type='submit'], .sbdd_a input, .gbqfba,div,p,ul,input,text,.s-opacity-65 .s-opacity-white-background{background:transparent!important;}",
"div#hplogo{background:url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)!important;}",
"body.FRAME_login{background-repeat:repeat!important;}",
"div,.s-opacity-65 .s-opacity-white-background{background:url(hidden)!important;}",
".module .flex-module,p,text,i,li,ul,img,input,#hgallery img,tab-inside{border:hidden!important;}",
"body,.S_page,div,li,p,a,text,dt,fieldset,input{background-color:transparent!important;}",
".S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:transparent!important;}",
".S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:rgba(0, 0, 0,0.08);box-shadow: 0px 0px 60px #000!important;}",
"input{background-color:rgba(0, 0, 0,0.2);box-shadow: 0px 0px 60px #888888!important;}",
"ul{padding:1.5px;background-color: rgba(0, 0, 0,0.1);box-shadow: 0px 0px 60px #888888;}",
"div#imgDiv{background-color: rgba(0, 0, 0,0.1);box-shadow: 0px 0px 50px #888888;}",
".module .flex-module,a,p,text,i,li,ul,img,input,#hgallery img,tab-inside{border:hidden!important;}",
"p,text,i,input,.rightli{background:url(hidden)!important;}",
".s-skin-hasbg .btn, .s-skin-hasbg .btn_wr,.s-down#s_top_wrap .s-center-box{background:url(hidden)!important;}", /*百度下拉框背景透明*/ 
"div#s_ctner_menus.s-ctner-menus.s-opacity-blank8{box-shadow: 0px 0px 60px #888888!important;}",
".s-mancacrd-main{padding:0px;box-shadow: 0px 0px 80px #000!important;} ", 
"#sidebar a:link {color:#888888 !important;}",
".ProfileCanopy--large, .ProfileCanopy--large .ProfileCanopy-header {height: 0px!important;}",
".gb_ka,.ProfilePage,.global-nav .search-input,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:transparent!important;}",
"body{",
"SCROLLBAR-FACE-COLOR: #444444;",
"SCROLLBAR-HIGHLIGHT-COLOR:#333333",
"SCROLLBAR-SHADOW-COLOR#444444;",
"SCROLLBAR-3DLIGHT-COLOR:#333333",
"SCROLLBAR-ARROW-COLOR:#333333",
"SCROLLBAR-TRACK-COLOR:#333333",
"SCROLLBAR-DARKSHADOW-COLOR:#333333",
"}",
".entry_box_h, .entry_box, .entry_box_s, .entrymeta, .entry_b, #respond_box, #slideshow, #hot_n, #hot_s, .tab-inside{color:#0196e3!important;}",
".lst-c,.sbib_b{overflow:visible!important;}",
".gb_5b{background-image:url(http://ssl.gstatic.com/gb/images/i1_1967ca6a.png)!important;}",
"p,div.zm-item-rich-text.expandable.js-collapse-body,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:rgba(0, 185, 141,0.09)!important;}",
".news-title{",   
"                   padding-left:1.1em;",
"                   color: #999!important;",//"  background: hsla(0,0%,100%,.1); ",
" 	                box-shadow:2px 2px 10px rgba(225,225,225,0.7) inset!important;",
      
"                     }", 
   
                     /*使用滤镜模糊边缘*/  
".news-title::before{",   
"                         content: '';",   
"                         position: absolute; ",   
"                         top: 0; rightright: 0; bottombottom: 0; left: 0;",   
"                         margin: -30px;",   
"                         z-index: -1;",   
"                         -webkit-filter: blur(20px);",   
"                         filter: blur(20px);",   
"                    }",  
"._lv5ky ._r3k3c {margin-right:0px!important;}",
".H-Logo {width: 122px!important;height:45px!important;float:left!important;background-image: url(https://i1.letvimg.com/lc07_img/201703/06/10/26/logo.png)!important;}",
 /*中华珍宝网背景设置*/
"div#map,div#imgview{https://pbs.twimg.com/media/C_xbf9oUAAEHi1H.jpg:large)!important;}",
 /*推特宽屏设置*/
" .gb_ka,.ProfilePage,.global-nav .search-input,.S_bg2, blockquote, .W_btn_b, .W_input, .SW_fun_bg{background-color:transparent!important;}",/*二级页面页头背景色透明化*/
" input{box-shadow: 0px 0px 40px #3c78d8!important;}",/*黑色背景下发光*/
".stream-item:not(.no-header-background-module),  .dashboard.dashboard-right{box-shadow: 0px 0px 80px #000!important;}",/*黑色背景下发光*/
".content-main {",
"    padding-left:0.2em;",
"    float: right!important;",
"    width: 877.2px!important;",
"} ", 
":not(.no-header-background-module).stream-item {",
"   background-color:rgba(0, 185, 141,0.09)!important;",
"    border-left:hidden!important;",
"    border-right:hidden!important;",
"   float:right!important;", /*推特二级页面宽屏效果-测试OK-新增*/ 
"   width: 877.2px!important;", /*推特二级页面宽屏效果-测试OK-新增*/
"                    }",
".ProfileSidebar,.ProfileSidebar--withLeftAlignment{display:none!important;}",/*左块状元素隐藏测试OK-新增*/
".account, .tweet, .app {border-bottom-color:#bcb9b9!important;}",
".AdaptiveMedia{max-height:100%!important;max-width:100%!important;}",
".Trends,.module .flex-module{border:hidden!important;}", 
".new-tweets-bar {border-bottom-color:#535353!important;}",/*新增*/
".DashboardProfileCard{border-top:hidden!important;border-color:#535353!important;}",/*新增 信息卡框线颜色改变*/

".new-tweets-bar{border-top:hidden!important;}",/*新增*/
".top-timeline-tweetbox .timeline-tweet-box,.RichEditor,.stream-loading{border:hidden!important;}",/*新增*/
 /*facebook宽屏设置*/
"._4-u2,._2yq ._4-u2::before,._2yq ._4-u2,._5vsj .UFIRow._4204,._5va1{border:hidden!important;}",
"._a7s,._5v3q ._5mxv {border-top-color:#535353!important;}",
"._4-u8{",
"    box-shadow: 0px 0px 80px #000!important;",
"    padding-left:3em;",
"   background-color:rgba(0, 185, 141,0.09)!important;",
"    box-shadow: 0px 0px 80px #000!important;",
"    width: 840px!important;",
"}",
"._64b{display: none!important;}",
":first-child._1-ia, .sidebarMode #pagelet_rhc_ticker_card ~ .pagelet ._1-ia，._g3h，._4cwn,._1c02,._4v9u,._g3i span._38my{display: none!important;}",
 /*ins页面背景设置*/
".o64aR, ._3Laht{background:url(https://pbs.twimg.com/media/C_xbf9oUAAEHi1H.jpg:large) no-repeat center center fixed !important;font-family: ''!important;}",
".o64aR, ._3Laht{background-color:transparent!important;}",/*新增页头,页中，背景透明*/
"._82fo9, ._cag6k, ._gs7sp, ._h2d1o, ._mbp5e, ._s6b3o{background-color:transparent!important;border-color:#535353!important;border-radius:25px!important;}",/*新增 0512加圆角*/
"._82fo9, ._cag6k, ._gs7sp, ._h2d1o, ._mbp5e, ._s6b3o{background-color:rgba(0, 0, 0,0.4)!important;box-shadow: 0px 0px 80px #3c78d8!important;}",/*新增页面信息流发光效果*/
"._ea084,._n3cp9,._tjnr4,._ksjel,._a1rcs{background-image:url(https://pbs.twimg.com/media/C_xbf9oUAAEHi1H.jpg:large)!important;}", /*ins点击图片后文本背景设置*/
"._98hun {background:transparent!important;}",/*新增主面搜索背景框透明*/
/*@media all and (min-width:736px)*/
/*点击图片后放大设置*/
"._n3cp9,div._9AhH0,div.KL4Bh{size:750px!important;}",
"._n3cp9{box-shadow: 0px 0px 60px #000!important;}",/*新增放大图片发光效果*/
"._djxz1._j5hrx {padding-right:0px!important;}",
/*点击图片后文字体颜色 透明实行隐藏设置*/  
"._djxz1 ._rgrbt{display:none!important;}", /*instagram隐藏大图所有内容，只看图*/ 
"._de018 {right: -80px!important;}",
 /*知乎宽屏设置*/ 
"div.zu-main-sidebar,.HomeEntry-draft{display: none !important;}", 
".Card-section,footer.Footer,Card.GlobalWrite,Card.CreatorEntrance,Card.CreatorEntrance,img.Banner-image,div.Sticky.is-fixed,div.Card.GlobalWrite,ul.GlobalSideBar-categoryList,div.Sticky{display: none !important;}",//,.Sticky
".Card{margin-left:0px!important;border:hidden!important;width: 1000px!important;background-color:rgba(0, 0, 0,0.3)!important;box-shadow: 0px 0px 50px rgba(0, 0, 0,0.8)!important;}",/*新增页面信息流发光效果*/
".HomeEntry-box{border:hidden!important;}", 
".Input-wrapper{border:hidden!important;}", 
".Button{border:hidden!important;}", 
"div.zg-wrap{margin-left:440px!important;width: 1300px!important;}",
"section.HotItem{margin-left:0px!important;border:hidden!important;width: 1000px!important;box-shadow: 0px 0px 20px rgb(0,0,0) !important;background-color:rgba(0, 0, 0,0.3)!important;}",
"h2.HotItem-title{color:#999!important;background-color:rgba(0, 185, 141,0.09)!important;}",
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
/*知乎搜索下拉背景色不透明,宽度自动透明黑*/ 
".ac-renderer {width: auto!important;background-image:ur(https://pbs.twimg.com/media/C_xbf9oUAAEHi1H.jpg:large)!important;}",
".ac-renderer { box-shadow:0 0 30px #eee inset,2px 2px 17px rgba(130,170,190,.8),0 0 0 1px #e8e8e8 inset!important;}",
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
