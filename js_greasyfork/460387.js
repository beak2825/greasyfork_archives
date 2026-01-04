// ==UserScript==
// @name         超级简历｜全民简历｜英才简历｜五百丁简历｜简历本｜锤子简历｜熊猫云简历｜乔布简历｜七分简历｜简历超人｜简历网｜简历设计网｜ 🖨️打印网页时优化网页排版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ██ ██ 注意：本脚本仅作为个人打印网页使用，打印的素材仅作为个人研究、学习和欣赏，脚本和素材不得用作其他用途。使用前请仔细阅读脚本详情页面。【脚本功能】：打印网页时隐藏一些内容，方便打印所需的素材，使用快捷键 Ctrl + P 调起系统打印功能。
// @license      MIT
// @author       AiniyoMua
// @homepageURL  https://github.com/CandyTek/PrintOnlineResume-JS
// @supportURL   https://greasyfork.org/zh-CN/scripts/460387/feedback
// @match        *://www.wondercv.com/cvs/*
// @match        *://www.qmjianli.com/cv/edit/*
// @match        *://www.jianliben.com/resume/*
// @match        *://www.jianliben.com/editor/*
// @match        *://online.tukuppt.com/resume/*
// @match        *://www.500d.me/newcvresume/edit/*
// @match        *://www.259577.com/editor*
// @match        *://www.100chui.com/resume/edit/*
// @match        *://www.ycresume.com/cv/edit/*
// @match        *://cv.qiaobutang.com/resume/*
// @match        *://www.jianli.com/cwedit*
// @match        *://jlcr.haitou.cc/editResume*
// @match        *://www.jianlisheji.com/resume/edit/*
// @match        *://www.canva.cn/design/*
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PCEtLT94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8tLT4KCjxzdmcgd2lkdGg9IjI0cHQiIGhlaWdodD0iMjRwdCIgdmlld0JveD0iMCAwIDI0IDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBpZD0iQGFuZHJvaWQ6Y29sb3Ivd2hpdGUiPgogICAgICAgIDxwYXRoIGZpbGw9IkBhbmRyb2lkOmNvbG9yL3doaXRlIiBvcGFjaXR5PSIxLjAwIiBkPSJNMTgsN1Y0YzAsLTAuNTUgLTAuNDUsLTEgLTEsLTFIN0M2LjQ1LDMgNiwzLjQ1IDYsNHYzSDE4eiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGZpbGw9IkBhbmRyb2lkOmNvbG9yL3doaXRlIiBvcGFjaXR5PSIxLjAwIiBkPSJNMTksOEg1Yy0xLjY2LDAgLTMsMS4zNCAtMywzdjVjMCwwLjU1IDAuNDUsMSAxLDFoM3YyYzAsMS4xIDAuOSwyIDIsMmg4YzEuMSwwIDIsLTAuOSAyLC0ydi0yaDNjMC41NSwwIDEsLTAuNDUgMSwtMXYtNUMyMiw5LjM0IDIwLjY2LDggMTksOHpNMTYsMTlIOHYtNGg4VjE5ek0xOCwxMi41Yy0wLjU1LDAgLTEsLTAuNDUgLTEsLTFzMC40NSwtMSAxLC0xczEsMC40NSAxLDFTMTguNTUsMTIuNSAxOCwxMi41eiI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4=
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460387/%E8%B6%85%E7%BA%A7%E7%AE%80%E5%8E%86%EF%BD%9C%E5%85%A8%E6%B0%91%E7%AE%80%E5%8E%86%EF%BD%9C%E8%8B%B1%E6%89%8D%E7%AE%80%E5%8E%86%EF%BD%9C%E4%BA%94%E7%99%BE%E4%B8%81%E7%AE%80%E5%8E%86%EF%BD%9C%E7%AE%80%E5%8E%86%E6%9C%AC%EF%BD%9C%E9%94%A4%E5%AD%90%E7%AE%80%E5%8E%86%EF%BD%9C%E7%86%8A%E7%8C%AB%E4%BA%91%E7%AE%80%E5%8E%86%EF%BD%9C%E4%B9%94%E5%B8%83%E7%AE%80%E5%8E%86%EF%BD%9C%E4%B8%83%E5%88%86%E7%AE%80%E5%8E%86%EF%BD%9C%E7%AE%80%E5%8E%86%E8%B6%85%E4%BA%BA%EF%BD%9C%E7%AE%80%E5%8E%86%E7%BD%91%EF%BD%9C%E7%AE%80%E5%8E%86%E8%AE%BE%E8%AE%A1%E7%BD%91%EF%BD%9C%20%F0%9F%96%A8%EF%B8%8F%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E6%97%B6%E4%BC%98%E5%8C%96%E7%BD%91%E9%A1%B5%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460387/%E8%B6%85%E7%BA%A7%E7%AE%80%E5%8E%86%EF%BD%9C%E5%85%A8%E6%B0%91%E7%AE%80%E5%8E%86%EF%BD%9C%E8%8B%B1%E6%89%8D%E7%AE%80%E5%8E%86%EF%BD%9C%E4%BA%94%E7%99%BE%E4%B8%81%E7%AE%80%E5%8E%86%EF%BD%9C%E7%AE%80%E5%8E%86%E6%9C%AC%EF%BD%9C%E9%94%A4%E5%AD%90%E7%AE%80%E5%8E%86%EF%BD%9C%E7%86%8A%E7%8C%AB%E4%BA%91%E7%AE%80%E5%8E%86%EF%BD%9C%E4%B9%94%E5%B8%83%E7%AE%80%E5%8E%86%EF%BD%9C%E4%B8%83%E5%88%86%E7%AE%80%E5%8E%86%EF%BD%9C%E7%AE%80%E5%8E%86%E8%B6%85%E4%BA%BA%EF%BD%9C%E7%AE%80%E5%8E%86%E7%BD%91%EF%BD%9C%E7%AE%80%E5%8E%86%E8%AE%BE%E8%AE%A1%E7%BD%91%EF%BD%9C%20%F0%9F%96%A8%EF%B8%8F%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E6%97%B6%E4%BC%98%E5%8C%96%E7%BD%91%E9%A1%B5%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
(function () {
	const hostname = window.location.hostname;
	if (hostname.includes("wondercv")) {
		wondercv();
	} else if (hostname.includes("qmjianli")) {
		qmjianli();
	} else if (hostname.includes("ycresume")) {
		qmjianli();
	} else if (hostname.includes("jianliben")) {
		jianliben();
	} else if (hostname.includes("500d")) {
		website500d();
	} else if (hostname.includes("259577")) {
		qifenjianli2();
	} else if (hostname.includes("100chui")) {
		chui();
	} else if (hostname.includes("tukuppt")) {
		xiaomao();
	} else if (hostname.includes("qiaobutang")) {
		qiaobu();
	} else if (hostname.includes("haitou")) {
		chaorenjianli();
	} else if (hostname.includes("jianlisheji")) {
		chui();
	} else if (hostname.includes("jianli.com")) {
		jianli();
	}
	// 快捷键：Ctrl + L
	document.onkeydown = (event) => {
		if (event.ctrlKey && event.keyCode == 76 && !event.altKey && !event.shiftKey) {
			window.print();
		}
	};

})();
/** 超级简历 */
function wondercv() {
	const css = `
		@media print {
			/* 左侧栏 */
			div.sidebar-side-content {display:none !important;}
			/* 简历上面的样式编辑框 */
			div.cvs > div:nth-child(1) {display:none !important;}
			/* 下面悬浮的 页数框 */
			div.cvs > div.resume-pagination {display:none !important;}
			/* 右下角悬浮按钮 */
			#phone-code {display:none !important;}
			/* 右下角悬浮按钮 */
			#udesk_container {display:none !important;}
			/* 顶栏 */
			.nav-container {display:none !important;}
			/* 顶栏 */
			div.pc-nav {display:none !important;}
			/* 简历正文上方黑黑一条的东西 */
			.header-line {display:none !important;}
			/* 简历正文右上角字数框 */
			.cv-font-number {display:none !important;}
			/* 简历正文把高度拉满 */
			.cvs-component {max-height:100% !important;}
			/* 正文细节纠正 */
			.edit-cv-main {
				padding-top:0px !important;
				height:fit-content !important;
				width:100% !important;
				min-width:0px !important;
				justify-content:flex-start !important;
				padding: 0px 0px 0 !important;
				display:block !important;
			}
			/* 正文因为有transform这个属性，所以div框是智能适配宽度的，必须得去掉 */
			div.scale.visible {width:100% !important;transform:none !important;}
			/* 正文宽度调整，更改背景色为白色 */
			.cv-editor-main{min-width: 0px !important;background-color: #fff !important;}
			/* 右侧悬浮栏，大图片 */
			div.popup-banner-container{display:none !important;}
			/* 正文背景图片 */
			/* div.one-page-container{background-image: unset !important;} */
			/* 页之间的空白 */
			div.cover{display:none !important;}
			div.one-page-container:after {height:0px !important;}
			#cv-container>.main.one-page-container.default-header{margin-bottom:0px !important;padding:0px !important;}
			/* 移除空白，调整高度 */
			body{transform: unset !important;}
			div.cv-editor-main{height:fit-content !important;}
			.resume.a4{height:fit-content !important;}
			div.cvs {margin-left: 0px !important;max-height:unset !important;}
			.main.one-page-container.page-index-1.default-header,div.resume> div.resume-main{height:fit-content !important;}
			/* 底部没用空间 */
			div.down-resume-box{display:none !important;}
			/* 更改页面背景色 */
			body,html{background:#ffffff !important;}
			/* 右下提示框 */
			div.pc-editor-helper-subscribe{display:none !important;}
			/* 其他页数，只保留一页 */
			div#cv-container>div:nth-child(n+2){display:none !important;}
			/* 补救 */
			body {display: block !important;}
		}`;
	GM_addStyle(css);
}
/** 全民简历 */
function qmjianli() {
	const css = `
		@media print {
			/* 弹出toast提示框 */
			div.alert{display:none !important;}
			/* 小标题 */
			section.edit_resume > h1{display:none !important;}
			/* 网页的顶栏 */
			div.edit_header {display:none !important;}
			/* 网页底部的编辑栏 */
			div.edit_all {display:none !important;}
			/* 网页右下角悬浮栏 */
			div.float_r {display:none !important;}
			/* 网页顶部下载按钮 */
			div.down_big {display:none !important;}
			/* 正文顶部页数显示 */
			ul.page_line {display:none !important;}
			/* 网页右边栏 */
			div.edit_fixed {display:none !important;}
			/* 去掉正文上面的padd，调整正文宽度 */
			div.edit_main {padding-top:0px !important;width: 100% !important;}
			/* 去掉正文上面的padd，调整正文宽度，更改背景色 */
			section.edit_resume {padding-top:0px !important;min-width: 0px !important;background-color: #fff !important;}
			/* 打印时，右边总是留有一点空白，不知是什么元素，直接全删了 */
			section.edit_resume > div:nth-child(n+4){display: none !important;}
		}
	`
	GM_addStyle(css);
	window.addEventListener('load', qmjianliRemedy);
	qmjianliRemedy();
}
/** 全民简历后面的补救方法 */
function qmjianliRemedy() {
	const el = document.querySelector('section.edit_resume');
	if (el) {
		for (const attr of el.attributes) {
			if (attr.name.startsWith('data-v')) {
				GM_addStyle(`@media print {.edit_resume [${attr.name}]{visibility: visible !important;}}`);
				return;
			}
		}
	}
}
/** 简历本 */
function jianliben() {
	const css = `
		@media print {
			/* 顶栏 */
			div#header{display:none !important;}
			/* 右侧操作栏 */
			div#sidemenu-right{display:none !important;}
			/* 右下放大缩小框 */
			div#page-scale{display:none !important;}
			/* 左下字数框 */
			div#page-info{display:none !important;}
			/* 每页间的，“缩成一页” */
			#page-line-one{display:none !important;}
			/* 正文顶部，去掉留白 */
			div#content{margin:unset !important;}
			/* 底边登录栏 */
			div#login-tips{display:none !important;}
			/* 更改网页背景色 */
			body,html{background: #ffffff !important;}
		}`;
	GM_addStyle(css);
}
/** 熊猫云简历 */
function xiaomao() {
	const css = `
		@media print {
			/* 顶栏 */
			header.el-header{display:none !important;}
			/* 左右侧栏 */
			div.edit-right,div.edit-left{display:none !important;}
			/* 页数 */
			ul.page-line{display:none !important;}
			/* 移除多余空白 */
			div.edit-resume,div.edit-main,div.tpl-box{margin:0px !important;}
			div.edit_container{min-width:0px !important;}
			body,div.edit-main{width:fit-content !important;}
			section.main-container{padding-top:unset !important;}
			div.edit-resume{padding-bottom:unset !important;}
			/* 更改网页背景色 */
			body, html {background-color: #FFFFFF !important;}
		}`;
	GM_addStyle(css);
}
/** 五百丁简历 */
function website500d() {
	const css = `
		@media print {
			/* 顶栏 */
			div.wbdCv-header{display:none !important;}
			/* 左侧操作栏 */
			div.wbdCv-leftbar{display:none !important;}
			/* 右上悬浮按钮栏 */
			div.function_panel{display:none !important;}
			/* 右下悬浮按钮栏 */
			div.guide_mobile_container{display:none !important;}
			/* 去掉正文的top padd */
			div.wbdCv-editorBody{padding-top:unset !important;}
			/* 去掉正文的margin */
			div.wbdCv-baseStyle {margin:unset !important;left:unset !important;}
			/* 打印时，右边总是留有一点空白，不知是什么元素，直接全删了 */
			body > div:nth-child(n+15){display: none !important;}
			/* 预览提示 */
			div.show-swal3{display: none !important;}
			/* 分页提示 */
			div.page_tips{display: none !important;}
			/* 合为一页提示 */
			div.auto_one_page{display: none !important;}
			/* 宽度适应内容 */
			body,html{min-width:0px !important;width:fit-content !important;}
			/* 左侧的条状阴影 */
			div.wbdCv-modals{display: none !important;}
			/* 更改网页背景颜色 */
			.wbd_cvresume_edit, .wbd_cvresume_edit body {background-color: #ffffff !important;;}
		}`;
	GM_addStyle(css);
}
/** 七分简历网 */
function qifenjianli2() {
	const css = `
		@media print {
			/* 顶栏 */
			div.header{display:none !important;}
			div.h100{display:none !important;}
			div.header_editor{display:none !important;}
			/* 右侧栏 */
			div.right_tab{display:none !important;}
			/* 右侧悬浮按钮栏 */
			div.right_fixed{display:none !important;}
			/* 去掉正文的top padd */
			div#app{padding-top:unset !important;}
			/* 去掉正文的padd */
			div.resume-pager{padding:unset !important;box-shadow:unset !important;}
			/* 设置正文父布局宽度自适应 */
			div.editor_content{width:auto !important;}
			/* 设置正文的宽度 */
			/* div.resume-pager{width:820px !important;} */
			/* 更改网页背景颜色 */
			body {background-color: #ffffff !important;}
		}`;
	GM_addStyle(css);
}
/** 锤子简历 */
function chui() {
	const css = `
		@media print {
			/* 顶栏 */
			div.header_bar{display:none !important;}
			/* 左侧栏 */
			div.left_bar{display:none !important;}
			/* 右侧栏 */
			div.right_opt_panel{display:none !important;}
			/* 右上悬浮按钮栏 */
			div.right_opt_item{display:none !important;}
			/* 正文顶部，风格编辑框 */
			div.style_set_panel{display:none !important;}
			/* 页数分割栏 */
			div.page_num{display:none !important;}
			/* 帮助提示悬浮栏 */
			div.page_tips{display:none !important;}
			/* 去掉正文的padd */
			div.resume_box_wrap{padding:unset !important;padding-left:unset !important;}
			/* 去掉正文的margin，宽度、高度自适应 */
			div.edit_box{margin-top:unset !important;width:unset !important;height:unset !important;}
			/* 去掉父布局的限制宽度 */
			body,html{min-width:unset !important;}
			/* 底部登录栏 */
			div.not_singin_tips{display:none !important;}
			/* 右下悬浮框 */
			div.right_op_ai_nav{display:none !important;}
			/* 更改网页背景颜色为白色 */
			body,html,div.edit_box{background-color: #ffffff !important;}
		}`;
	GM_addStyle(css);
}
/** 乔布简历 */
function qiaobu() {
	const css = `
		@media print {
			/* 顶栏 */
			div.page-header{display:none !important;}
			/* 工具栏 */
			div.new-toolbar{display:none !important;}
			/* 正文头部 */
			div.resume_head{display:none !important;}
			/* 提示面板 */
			div.tips_container{display:none !important;}
			/* 页脚 */
			div.qbt-footer{display:none !important;}
			/* 模块移动工具 */
			div.section-sort-range,div.row-sort-range,div.section_handle,div.row_handle{display:none !important;}
			/* 页数超过提示工具 */
			div.expanded{display:none !important;}
			/* 移除多余空白 */
			.row_layout .resume ,div.inner_resume{margin:0px !important;}
			body,div.row_layout,div.page_content{width:fit-content !important;min-width:0px !important;}
			div.main_content{padding-top:0px !important;}
		}`;
	GM_addStyle(css);
}
/** 简历网 */
function jianli() {
	const css = `
		@media print {
			/* 顶栏 */
			div.top{display:none !important;}
			nav.gs-setting-box{display:none !important;}
			/* 左右侧栏 */
			div.left,div.right-box{display:none !important;}
			/* 页分隔 */
			div.zhineng{display:none !important;}
			/* 更改网页背景色 */
			.design-box .bottom,.design-box,body{background-color: #ffffff !important;}
			/* 移除多余空白 */
			div.center,div.bottom{padding:0px !important;}
			div.bottom{margin-top: 0px !important;}
			/* 移除滚动条 */
			::-webkit-scrollbar {display: none !important;}
			/* 更改宽度高度 */
			body{width:fit-content !important;min-width:0px !important;}
			body,div.bottom{height:fit-content !important;}
		}`;
	GM_addStyle(css);
}
/** 简历超人 */
function chaorenjianli() {
	const css = `
	@media print {
			/* 顶栏 */
			div#__next>div:nth-child(1)>div:nth-child(1){display:none !important;}
			/* 更改页面背景颜色 */
			div#__next>div:nth-child(1)>div:nth-child(2){background-color: #ffffff !important;}
			div#__next>div:nth-child(1)>div:nth-child(2)>div:nth-child(1)>div:nth-child(1){background-color: #ffffff !important;width:unset !important;padding:0px !important;}
			/* 调整宽度 */
			body{width:fit-content !important;}
			/* 左右侧栏 */
			aside#sliderAside{display:none !important;}
			/* 页脚 */
			div#super-resume-footer{display:none !important;}
			/* 页分隔 */
			div#editResume_pageSlider__85_Sh{display:none !important;}
			/* 调整空白 */
			div.content{padding:48px !important;}
		}`;
	GM_addStyle(css);
}
// ██ 备注，更多简历网站

// 微软 Word 简历模板，www.officeplus.cn/WORD/?popularity=Total&industry=&purpose=&paymentMethod=0&keywords=
// 简历超人，jlcr.haitou.cc
// YOO简历，www.yoojober.com
// 个人简历网，www.gerenjianli.com
// YY简历网，www.yyfangchan.com
// 个人简历模板，jianlimb.cn
// 精品简历模板，www.51386.com
// 职业圈简历模板，www.job592.com/doc/
