// ==UserScript==
// @name 仰晨-百度搜索页
// @namespace cgl556.gitee.io/grid
// @version 2.0.1
// @description 主观百度搜索样式。始于 - 2023/4/11 20:01:47
// @author 仰晨
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.baidu.com/s?*
// @downloadURL https://update.greasyfork.org/scripts/465077/%E4%BB%B0%E6%99%A8-%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/465077/%E4%BB%B0%E6%99%A8-%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
let css = `
	#searchTag,  /*搜索标签*/
	#head{     /*顶部搜索框。*/
		background-color: #fff0;
	}
	[class="s_down"]{ /*顶部搜索框下滑时。*/
		background-color: #395f3673 !important;
	}
	
	
	/*搜索给出来的推荐标签2023.4.15*/
	#searchTag{
		width: 10px;
		position: fixed;		/*固定浮动*/
		right: 30%;
		top: 19%;
	}
	[tpl="app/head-tab"]{
		z-index: 9999999 !important;
	}
	
	/*搜索给出来的推荐标签*/
	.tag-scroll_3EMBO{
		 width: 160px;
      height: 500px;
      display: flex;
		 flex-wrap: wrap;
	}
	/*搜索给出来的推荐标签 向下滚动时显示*/
	#searchTag.tag-fixed{
		top: 20.8%;
	}
	
	
	[tpl="app/footer"],    /*最底下的帮助，推广，举报。*/
	[tpl="app/rs"],      /*相关搜索。*/
	#content_right{      /*右边热门。*/
		display: none;
	}
	
	[class="c-span12"],                 /*智能搜索聚合框。*/  
	[class="single-card-wrapper_2nlg9"],   /*智能搜索聚合框。*/
	.new-pmd .c-span9 {              /*文章文字宽*/
		width: 800px !important;
	}	
	
	
	
	.wrapper_new .fm {  /*搜索框放到中间。*/
    margin: 15px 0 15px 250px;
	}
	
	[tpl="app/search-tool"]{      /*筛选工具。*/
		padding-left: 200px;
		padding-top: 60px;
	}
	
	
	[tpl="app/head-tab"]{       /*搜索框下面的各种搜索放右边。*/
		width: 10px;
		position: fixed;		/*固定浮动*/
		right: 14%;
		top: 19%;
	}
	
    [id="s_tab"]>div,
	.wrapper_new #s_tab a,    
	.wrapper_new #s_tab b{    /*搜索框下面的各种搜索放右边。要宽一点*/
		width: 80px !important;
	}
	
	
	
	/*搜索条词变宽2023.9.4*/
	[class="new-pmd"],
	[class="c-border"],
	[class="c-container result"],
	[class="result c-container xpath-log new-pmd"],
	[class="result-op c-container xpath-log new-pmd"],
	[class="_content-border_17ta2_4 content-border_r0TOp cu-border sc-aladdin sc-cover-card"]{
		width: 800px !important
	}
	
	[tpl="app/page"],     /*底下的翻页。*/
  
   #content_left {     /*左边出来一点。 下去一点。*/
	   padding-left: 350px !important;
	   margin-top: 0px !important;
	}
	
	/*把翻页纵向，并固定位置2023.9.4*/
	[id="page"]{
		white-space: revert !important;
		width: 50px;
		position: fixed;
		top: 160px;
		left: 76px;
		opacity: 30%;
		transition: all 0.5s ;			/*过渡效果*/
	}
    [id="page"]>div{
    width: 44px !important;
    }
	[id="page"]:hover{
		opacity: 100%;
	}
	/*下一页2023.9.4*/
	[class="n"]{
		left: -44px;
		top: -425px;
		position: relative;
		
		
	}
	
	[class="page-item_M4MDr pc"],
	/*单个页的按钮2023.9.4*/
	[class="page-inner_2jZi2"] a{
		margin: 1px 0;
		box-shadow: 0px 2px 6px 2px #d7d6d6 !important;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
	}
	
	
	/************************************添加背景*******************************/
	#container::before{
		background-color: #e9fbe2;
		position: fixed;		/*固定浮动*/
		width: 60%;
		height: 98%;
		left: 18%;
		top: 1%;
		content: "";
		z-index: -1;
		border-radius: 40px;
		box-shadow: 0px 1px 7px 4px #d7d6d6;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
		
	}
	
	#page {    /*翻页按钮背景色*/
    background-color: #4b659f00;
	}
	
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
