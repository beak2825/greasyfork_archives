// ==UserScript==
// @name 仰晨-抖音样式削减计划
// @namespace yc556.gitee.io
// @version 2024.7.21.1636
// @description 按自己想法改造b- 始于2022/10/19 13:31:30
// @author 仰晨
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.douyin.com/*
// @match https://www.douyin.com/
// @match https://www.douyin.com/?*
// @match https://www.douyin.com/search/*
// @match https://example.com/*
// @downloadURL https://update.greasyfork.org/scripts/483956/%E4%BB%B0%E6%99%A8-%E6%8A%96%E9%9F%B3%E6%A0%B7%E5%BC%8F%E5%89%8A%E5%87%8F%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/483956/%E4%BB%B0%E6%99%A8-%E6%8A%96%E9%9F%B3%E6%A0%B7%E5%BC%8F%E5%89%8A%E5%87%8F%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "douyin.com" || location.hostname.endsWith(".douyin.com"))) {
		css += `
		/*整个抖音域名都生效*/
		/*眼不见为净*/
		[class="YLK1Proo wZsfSQtZ"],           /*通知里面叫你下载客户端     2023.7.28--12.16*/
		[class = "oWZT1rhs fP8n2eAM"],			  /*私信里面叫你下载客户端     2023.7.28*/
		[class="MkxzAXKO"],						  /*搜索下面的推荐 猜你想搜按钮  2023.12.16*/
		[data-e2e="search-guess-container"],	  /*搜索下面的推荐 猜你想搜    2023.12.16*/
		[class="_FQT2Mbu"],							/*抖音热点 文字*/
		[data-e2e="search-hot-container"],			/*抖音热点*/
		[class="cdImlWbw"],							/*业务合作（视频页）*/
		[class="X2xZ8n4C"],							/*业务合作（搜索页）*/
		[class="tMj7BYwg"],							/*相关搜索（搜索页）*/
		[class="w5EpFlgg"],							/*大家都在搜（搜索页）*/
		[class="rYeSCC9G"],							/*更多相关视频 2024.1.5*/
		[class="RQFWObp0"],							/*右上角的 冲逗比 下载客户端 2024.1.5*/
		[class="eNkk7yWz"],							/*快捷访问里面的内容*/
		[class="N49UESFC"]+[class="gq_BtyCM"]+[class="N49UESFC"],  /*我的订单、抖币充值、直播伴侣*/
		[data-popupid="helsm8e"]+[class="iqAeEhI1"],		     /* 快捷访问（右上角的 ）+2024.7.21*/
		[data-popupid="w770wr0"],                       /* 壁纸（右上角的 ）2024.7.21*/
		[class="YLK1Proo pSGzKt_7"],				          /* 个人资料旁边的下载抖音按钮2024.1.5*/
		[class = "DsdpRAYf fP8n2eAM"],
		/*私信通知里面的下载抖音*/
		[class = "DsdpRAYf n4H8QMkw"],
		/*私信通知里面的下载抖音*/
		#douyin-sidebar/*右下角的意见反馈*/
		{
			display: none !important;
		}

		/*---------左边框收缩----------移动过去就还原-----------2024.7.21--*/
		#douyin-navigation{
			max-width: 10px;
		}
		#douyin-navigation>div{
			display: none;   
		}
		#douyin-navigation:hover{
			max-width: 666px;
		}
		#douyin-navigation:hover > div{
			display:unset;    
		}
			
		/*调整视频和评论的显示占比-----------2024.7.21--*/
		#sliderVideo>.playerContainer.hide-animation-if-not-suport-gpu {
			min-width: 80%;
		}
		#videoSideCard{
			max-width: 20%;
		}
			
			
			
			
			
		    
		/* ---------------------------------对应脚本样式------------------------------------*/
		/*————————————————对应脚本的下载按钮————————————————*/
		#downloadLink {
			color: white;
		}
		/*生成的到刷视频按钮的样式*/
		#ikun {
			opacity: 90%;
			z-index: 504;
			position: fixed;
			right: 5px;
			bottom: 80px;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			text-align: center;
			line-height: 30px;
			box-shadow: 0 0 5px #999;
			cursor: pointer;
			background-image: url(data:image/png;base64,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);
			background-repeat: no-repeat;
			background-size: 100%;
			background-color: #4a4949;
		}

		/*说明快捷键---------样式--------------*/
		.shortcut {
			z-index: 501;
			position: fixed;
			right: 5px;
			top: 90px;
			width: 50px;
			height: 40px;
			opacity: 30%;
			border-radius: 50%;
			color: #fff;
			font-size: 10px;
			line-height: 40px;
			cursor: pointer;
			box-shadow: 0 0px 6px 3px #7b849c87;
			/*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
			transition: all 0.5s;
			/*过渡效果2023.1.31*/
		}
		.shortcut:hover,
		.shortcut:hover .shortcut-info {
			opacity: 80%;
			display: block;
		}
		.shortcut-info {
			display: none;
			position: absolute;
			top: 40px;
			right: 0px;
			width: 130px;
			padding: 10px;
			border-radius: 5px;
			background-color: rgb(242, 242, 242);
			font-size: 12px;
			color: #6a5acd;
			z-index: 999;
			text-align: left;
			/* 文字靠左 */
			line-height: 1.2;
			/* 设置行高 */
		}
		`;
}
if (location.href === "https://www.douyin.com/" || location.href.startsWith("https://www.douyin.com/?")) {
		css += `
		/*刷视频 页面生效  */
		/*评论区广告提交表单*/
		.htirveP0:before {
			display: flex;
			min-width: 60px;
			min-height: 680px;
			color: #929faf;
			content: "ikun:广告已被覆盖";
			justify-content: center;
			/* 水平居中 */
			align-items: center;
			/* 垂直居中 */
			font-size: 40px;
		}
		/*视频位置微调一下2023.9.6*/
		[class = "oLQoaUK3 qRePWKBJ fullscreen_capture_feedback agh_7JEd"] {
			left: 10px !important;
			top: 6px !important;
		}
		`;
}
if (location.href.startsWith("https://www.douyin.com/search/")) {
		css += `
		/*搜索视频 页面生效  */
		#ikun {
			right: 250px;
			bottom: 125px;
			width: 39px;
			height: 39px;
		}
		/*推荐搜索的关键字2023.9.20*/
		[class = "FGEFs33b"] {
			position: absolute;
			width: 120px;
			height: 10px;
			top: 120px;
			left: 1200px;
		}
		[class = "Ny_5e1TS"] {
			white-space: normal;
		}
		.Nzd7zqo6:last-child {
			margin-right: 0
		}
		[class = "Nzd7zqo6 Tw44MG9s"] {
			margin: 5px
		}
		/*头像 名字 时间*/
		/*         [class="AwIKR2fG"]{
		         	position: absolute;
		         	width: 80px;
		         	left: -2px;
		         }
		         [class="rffQNga8"],
		         [class="mSoL45jm"]{
		         	display: block
		         }
		*/
		/*筛选哪一行*/
		[class = "qB3P4FP2"] {
			margin: 0px;
			bottom: 5px;
		}
		/*视频上上上*/
		[class = "STSbtY1V diFUSb1N cGfCnmTK"] {
			margin-top: 40px !important;
		}
		/*------偶尔第一个视频-----------热点视频-------------------图文-------------------视频-----变大2023.10.11*/
		[class = "TPVYdbJj"]:hover,
		[class = "iW7XZ5FF"]:hover,
		[class = "GauTlg_e"]:hover,
		[class = "Ys1zFCEZ"]:hover {
			height: 600px;
			position: fixed !important;
			top: 123px;
			left: 50px;
			z-index: 99999;
			width: 75%;
		}
		`;
}
if (location.href === "https://www.douyin.com/" || location.href.startsWith("https://www.douyin.com/?") || location.href.startsWith("https://www.douyin.com/search/")) {
		css += `
		/*刷视频  搜索视频 页面生效  */
		[class = "JTui1eE0"]:nth-child(3),
		/*合作2023.7.26*/
		[class = "XNmfpct4 fJOjbqAw"],
		/*直播间名字 标题*/
		[class = "NWMyy49m"],
		/*点击进入直播间*/
		[class = "U6kxNmZU"],
		/*直播叫你买浮窗*/
		[class = "QUUswvJ3"],
		/*客户端*/
		[class = "JTui1eE0"]:nth-child(2),
		/*收藏网页*/
		[class = "JTui1eE0"]:nth-child(3) {
			/*合作*/
			display: none !important;
		}
		/*广告标签*/
		[class = "RA5iG98_"] {
			background-color: red;
			width: 40%;
		}
		`;
}
if (location.href.startsWith("https://example.com/")) {
		css += `
		/*个人主页生效-----------------------------*/
		/*全部隐藏----------------------------------*/
		footer,
		/*脚步2023.7.26*/
		[class = "oWZT1rhs TbGlYyuw"],
		/*主页下载客户端*/
		[class = "VgThzTk9 vwAQ8Y04"],
		/*观看历史-今天 漂浮*/
		[class = "bbec3J8x m5e7YGwM"],
		/*视频|影视综 观看历史漂浮*/
		[class = "sDAMysaM AO2sIdEP subTabSticky"],
		/*别人视频漂浮2023.9.5出现*/
		.MFb3tP0s._bpGHYWu > :nth-child(-n+3),
		/*前4个直接子元素 0、冲钱 1、客户端 2、收藏网页 3、合作*/
		[class = "feXqXaSk a3sjxRqS"],
		/*收藏夹|视频|合集*/
		[class = "iwzpXgQ3 lXuWkeYW dSNgkU25 K4TZD9ct wJgU15d1"],
		/*滚动还显示搜索栏*/
		[class = "gX8AKvzT gthle0Gj"],
		/*滚动还显示作品栏*/
		[class = "_7gdyuNUv"]/*主页的下载电脑客户端*/
		{
			display: none !important;
			/*使用!important可以覆盖所有其他样式规则，但不建议过度使用*/
		}
		/*背景全黑----------------------------------*/
		[class = "y7RF26pa"],
		/*集合标题2023.7.27*/
		[class = "oJArD0aS"],
		/*顶部2023.7.26*/
		[class = "_bEYe5zo nypYF5wY ML2jyK_o"],
		/*背景2023.7.26*/
		[class = "iJKEP67A"],
		/*顶部*/
		[class = "VgThzTk9"],
		/*观看历史-今天*/
		[class = "bbec3J8x"],
		/*视频|影视综*/
		.feXqXaSk,
		/*收藏夹|视频|合集*/
		[class = "gX8AKvzT"],
		/*作品栏*/
		[class = "UKp0VfC1"],
		/*下面的视频背景*/
		html[dark] ._LDrC7Wb.Smb5gBZJ:before {
			/*名片*/
			background-image: linear-gradient(to bottom, #000, #000) !important;
		}
		/*使用!important可以覆盖所有其他样式规则，但不建议过度使用。例如：
					.N_HNXA04 {
				  	background-color: red !important;
					}
					但是，使用!important可能会导致样式难以维护和调试，因此应该尽量避免使用它。*/
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
