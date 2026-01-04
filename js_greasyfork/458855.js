// ==UserScript==
// @name 仰晨-B站样式改造计划
// @namespace github.com/yc-2018/reggit_take_out
// @version 2023.8.26
// @description 按自己想法改造b- 始于2022/10/19 13:31:30
// @author 仰晨
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @match https://www.bilibili.com/
// @match https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/458855/%E4%BB%B0%E6%99%A8-B%E7%AB%99%E6%A0%B7%E5%BC%8F%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/458855/%E4%BB%B0%E6%99%A8-B%E7%AB%99%E6%A0%B7%E5%BC%8F%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "bilibili.com" || location.hostname.endsWith(".bilibili.com"))) {
  css += `
      
  	/*透明掉搜索框的诱惑*/
      .nav-search-input{
  		transition: all 0.5s ;			/*过渡效果2023.1.31*/
          opacity: 0;
      }
  	.nav-search-input:hover,
  	.nav-search-input:focus{		/*:focus获取到焦点后执行 应该只有输入框能搞2023.1.31*/
  		opacity: 100%;
  	}
  	
  	/* 鼠标放到按钮样式变化:hover    先吧搜索框变透明度，鼠标放上去的时候就把透明度变成100%   点击瞬间为:active */
  	/*:active伪类 按下去有效果  分开鼠标马上消失
  	       注意： 在CSS定义中，a:hover 必须被置于 a:link 和 a:visited 之后，才是有效的。
            注意： 在 CSS 定义中，a:active 必须被置于 a:hover 之后，才是有效的。
            注意：伪类的名称不区分大小写。
  	*/
  	
  	 
  	 /*导航栏2023.1.25 begin*/
      div.bili-header__bar{
  		background: linear-gradient(100deg, #f9e4e4 0%, #afcdcc 100%);	/*渐变*/
  		box-shadow: 0 9px 9px 1px #39487061;							 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
      }
  	
     /*隐藏导航栏元素*/
  	.is-bottom-start,											 /*放到首页上出现的分类*/
  	.mini-header__title,								 /*首页文字按钮*/
     ul.left-entry li.v-popover-wrap:nth-child(n+2),		/*顶部左边不想要的*/
  	ul.right-entry li.v-popover-wrap:nth-child(2){		/*右边不需要的*/
  		width: 0;
       /*opacity: 0;         opacity 属性的意思是设置一个元素的透明度。*/
       visibility: hidden;     /*被隐藏的元素依然会对我们的网页布局起作用。它不会响应任何用户交互*/
      /*display: none;        确保元素不可见并且连盒模型也不生成     但是这里不生效*/
      } 
  	
  	/*bilibili热搜再见2023.2.25*/
  	.trending{
  		display: none;
  	}
  	
  	
  	/*无限循环动画
  	.right-entry{
  		animation:ikun 5s infinite;
  	}
  	@keyframes ikun {
      	0% {background-color: red;}
      	50% {background-color: #06f;}
  		100% {background-color: red;}
  	}
  	*/
  `;
}
if (location.href === "https://www.bilibili.com/") {
		css += `
			.floor-single-card,						/*带标签视频  包涵  《直播  课堂  国创  综艺  电影  电视剧  纪录片  漫画  番剧》  包涵直播就全部不要了*/
			.bili-live-card,						/*直播推荐*/
			.header-channel,						/*浮动推荐分类*/
			.adblock-tips[data-v-7f4a51a0]{			/*提示受到脚本影响*/
				display: none;						
			}
			.bili-header{
				margin-bottom: 1000px;
			}
		   .bili-header::before{
			   animation:myanimation 5s infinite;
			   position: fixed;		/*固定浮动*/
				/*top: 40%;*/
				left: 45%;
			   width: 200px;
			   border-radius: 8px;		/*圆角*/
			   color: #908e8e;
			   background-color: #c5eee500;
				content: "    记得要学习，不要上瘾了哇\\
					            推荐视频在下面";
			   box-shadow: 0px 1px 7px 4px #d7d6d6;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
					
			}
			@keyframes myanimation {
				0% {top:30%;}
				20% {top:90%;transform:rotate(20deg);}
				50%	{transform:rotate(360deg);}
				90%{top:30%;transform:rotate(0deg);}
				100% {top:30%;}
		    	
			}
			
			
			.bili-feed4 .bili-header .bili-header__channel,     /*分类栏*/
			.bili-header__bar.slide-down,						 /*搜索框（浮动的和顶部的不是同一个的）*/
			#i_cecream{											/*视频推荐页*/
				background: linear-gradient(90deg, #fbebe8 0%, #d0eeee 100%);
				
			}
			
			.bili-header .bili-header__banner{			    /*图片横幅消失术*/
				height: 0;
				min-height: 64px;
			}
			
		`;
}
if (location.href.startsWith("https://www.bilibili.com/video/")) {
		css += `
			/*视频播放页面
				适配了大屏却不电脑屏有点大了
			
			---背景颜色   新版才行 div.video-container-v1*/
			body,
			div.video-container-v1{
				background: linear-gradient(100deg, #cbc8fa 0%, #f9f2a4 100%);
			}
			
			
			/*搜索框居中 */
			div.center-search-container{
				position: fixed;		/*固定浮动*/
				top: 10px;
				left: 25%;
				width: 400px; 
				box-shadow: 3px 6px 10px 0px #8f9ca1;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
				border-radius: 9px;						  /*圆角*/
		/* 		background: #000; */
				
			}
			
			
			/*弹幕列表 +圆角*/
			.bpx-docker-minor:not(:empty){
				border-radius: 10px;
			}
		    
			
			/*集合下面的推荐视频放再下面一点，免得碍眼————集合看不到 单视频就能看到，完全不想看到也行但算了*/
			div #reco_list{
		    margin-top: 365px;
		}
			
			
			/*视频选集 向下扩大*/
			.multi-page-v1 .cur-list{
				height: 520px !important;
				max-height: 520px !important;
				
			}
			
			/*视频选集 向右扩大   (主要看片名长不长*/
		/* 	.cur-list {
				width: 450px;
			} */
			#app .video-container-v1 .right-container {
				width: 425px;
				
			}
			
			/*非视频选集列表向下扩大2023.8.20*/
			[class="video-sections-content-list"]{
				height: 543px !important;
				max-height: 652px !important;
				box-shadow: 0px 2px 6px 1px #f0f0f0;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
			}
			
			
			
			
			/*视频选集阴影__感觉一般*/
			#multi_page{
				box-shadow: 0px 0px 8px 1px #615e6391;	/*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
			}
			
			
			/*视频选集里面的内容 向右扩大2023.1.24*/
			.multi-page-v1.small-mode .cur-list .list-box li {
		    width: 400px;
			}
			
			
			/*————修改评论区——————*/
			
			div.browser-pc{
				width: 102%;			/*长度占掉推荐视频*/
				border-radius: 8px;		/*圆角*/
				background: linear-gradient(90deg, #cdcbf3 0%, #e5decd 100%);	/*换个背景颜色*/
			}
			
			/*------------修改视频选集的滑块------------------------*/
			.cur-list::-webkit-scrollbar-thumb{	/*定义滚动条颜色*/
				background-color: #d1d1d1;
			}
			.cur-list::-webkit-scrollbar{		/*定义滚动条宽度*/
				width: 7px;
			}
			  
			.cur-list::-webkit-scrollbar-track  /*定义滚动条轨道 内阴影+圆角*/
		{  
		    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .07);  
		    border-radius: 10px;  
		    background-color: #F5F5F5;  
		}
			[class="pop-live-small-mode part-undefined"],/*推荐视频列表下面的推荐直播*/
			[id="activity_vote"],    /*评论区上面通告*/
			[class="reply-notice"],  /*评论区上面的公告*/
			[data-loc-id="2629"],   /*评论上面的广告*/
			[data-loc-id="4331"],  /*视频选集 上面的广告*/
			.fixed-nav         /*新久版按钮消失*/
			{
				display: none !important;
			}
			
		/* 	视频大一点点------------------------------2023.2.25 */
			#bilibili-player {
		    	width: 1120px;
				 height: 686px;
			}
		/* 视频外层，视频变大不改 一键三连会重叠	 */
			#playerWrap {
		    	width: 1120px;
				 height: 686px;
			}
			
		/*  分左右的所以两边才会空	把左边（视频边变大） */
			.left-container {
		    width: 1100px;
		}
			
		/* 	不用头部时降低其透明度 ----2023.2.28*/
		/*  CSS的子选择器“>”来选择某个元素的全部子元素，例如：element > *{}，这样就可以选择element元素的全部子元素了	 */
			#biliMainHeader .mini-header > *{
				transition: all 0.5s ;
				opacity: 10%;         /*opacity 属性的意思是设置一个元素的透明度。*/
				
			}
			#biliMainHeader .mini-header:hover>*{
				opacity: 100%;
			}
			
			
			
			/*右边视频集合、推荐视频上一级 :::当元素的position属性设置为sticky时，则开启了元素的粘滞定位*/
			[class="right-container-inner scroll-sticky"]{
				position: static !important;	/*改回默认值2023.8.26*/
			}
			
			
			/*推荐视频列表*/
			[class="rec-list"]{
				opacity: 15%;
				transition: all 0.5s;
			}
			/*推荐视频列表*/
			[class="rec-list"]:hover{
				opacity: 100%;	
			}
			
			/*浮动评论框-未动时*/
			[class="reply-box fixed-box"]{
				border-radius: 15px;		/*圆角*/
				background-color: #8de3ff6b !important;
				box-shadow: 4px -3px 11px 5px #87b1ea;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
			}
			
			/*浮动评论框（下方）-点击后*/
			[class="reply-box box-active fixed-box"]{
				border-radius: 15px;		/*圆角*/
				background-color: #80a0eccf !important;
				box-shadow: 4px -3px 11px 5px #87b1ea;	 /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
			}   
			
			/*发送按钮*/
			[class="reply-box-send"]{
				margin-left: 40px !important;
				margin-right: 40px !important;
			}
			
			
			
		/*----------------[css-transition] 平移动画-----------------------------------*/
		/*	
			.moveR-enter-active,  .moveR-leave-active {
		  		transition: all .5s linear;
		  		transform: translateX(0);
			}
		 	.moveR-enter,  .moveR-leave {
		  		transform: translateX(100%);
			}
		 	.moveR-leave-to{
		   		transform: translateX(100%);
		 }
		*/
			/*——————————循环动画————————————
			
			div{
		    animation:myanimation 5s infinite;
			}
		 
			@keyframes myanimation {
		    	from {top:0px;}
		    	to {top:200px;}
			}
			*/
			
			/*
			::-webkit-scrollbar 滚动条整体部分
			::-webkit-scrollbar-thumb  滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
			::-webkit-scrollbar-track  滚动条的轨道（里面装有Thumb）
			::-webkit-scrollbar-button 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
			::-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分（除去）
			::-webkit-scrollbar-corner 边角，即两个滚动条的交汇处
			::-webkit-resizer 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件
			*/

			
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
