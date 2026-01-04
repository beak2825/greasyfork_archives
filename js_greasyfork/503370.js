// ==UserScript==
// @name         粗糙阅读模式｜持续更新
// @namespace    https://github.com/CandyTek
// @version      1.5
// @license      MIT
// @description  使用简单的方法对这些网页进行处理，开启粗糙的信纸阅读模式
// @author       CandyTek
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNNTYwLTU2NHYtNjhxMzMtMTQgNjcuNS0yMXQ3Mi41LTdxMjYgMCA1MSA0dDQ5IDEwdjY0cS0yNC05LTQ4LjUtMTMuNVQ3MDAtNjAwcS0zOCAwLTczIDkuNVQ1NjAtNTY0Wm0wIDIyMHYtNjhxMzMtMTQgNjcuNS0yMXQ3Mi41LTdxMjYgMCA1MSA0dDQ5IDEwdjY0cS0yNC05LTQ4LjUtMTMuNVQ3MDAtMzgwcS0zOCAwLTczIDl0LTY3IDI3Wm0wLTExMHYtNjhxMzMtMTQgNjcuNS0yMXQ3Mi41LTdxMjYgMCA1MSA0dDQ5IDEwdjY0cS0yNC05LTQ4LjUtMTMuNVQ3MDAtNDkwcS0zOCAwLTczIDkuNVQ1NjAtNDU0Wk0yNjAtMzIwcTQ3IDAgOTEuNSAxMC41VDQ0MC0yNzh2LTM5NHEtNDEtMjQtODctMzZ0LTkzLTEycS0zNiAwLTcxLjUgN1QxMjAtNjkydjM5NnEzNS0xMiA2OS41LTE4dDcwLjUtNlptMjYwIDQycTQ0LTIxIDg4LjUtMzEuNVQ3MDAtMzIwcTM2IDAgNzAuNSA2dDY5LjUgMTh2LTM5NnEtMzMtMTQtNjguNS0yMXQtNzEuNS03cS00NyAwLTkzIDEydC04NyAzNnYzOTRabS00MCAxMThxLTQ4LTM4LTEwNC01OXQtMTE2LTIxcS00MiAwLTgyLjUgMTFUMTAwLTE5OHEtMjEgMTEtNDAuNS0xVDQwLTIzNHYtNDgycTAtMTEgNS41LTIxVDYyLTc1MnE0Ni0yNCA5Ni0zNnQxMDItMTJxNTggMCAxMTMuNSAxNVQ0ODAtNzQwcTUxLTMwIDEwNi41LTQ1VDcwMC04MDBxNTIgMCAxMDIgMTJ0OTYgMzZxMTEgNSAxNi41IDE1dDUuNSAyMXY0ODJxMCAyMy0xOS41IDM1dC00MC41IDFxLTM3LTIwLTc3LjUtMzFUNzAwLTI0MHEtNjAgMC0xMTYgMjF0LTEwNCA1OVpNMjgwLTQ5NFoiLz48L3N2Zz4=
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503370/%E7%B2%97%E7%B3%99%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%EF%BD%9C%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/503370/%E7%B2%97%E7%B3%99%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%EF%BD%9C%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-end 以获得更好的体验
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-end 以获得更好的体验

// 网站规则列表
const myMatchWebsites = [
	{
		// https://ost.51cto.com/answer/19974
		match: ["*://ost.51cto.com/answer/*"],
		article: ["#commentbox"],
		title:".title > h1",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://www.iplaysoft.com/powertoys.html
		match: ["*://www.iplaysoft.com/*"],
		article: ["div.entry-content"],
		title:"#post-title",
		noArticleWidth: "",
	},
	{
		// https://health.baidu.com/m/detail/ar_15251283663566260296
		match: ["*://health.baidu.com/m/detail/*"],
		article: ["div.noise"],
		title:"#spread-fold > div > div > p",
		noArticleWidth: "",
		delay:2000,
	},
	{
		// https://m.youlai.cn/askmip/D0A2F9MMnY0.html
		match: ["*://m.youlai.cn/askmip/*"],
		article: ["#js-content"],
		title:".view > h1",
		noArticleWidth: "",
	},
	{
		// https://www.youlai.cn/yyk/article/943030.html
		match: ["*://www.youlai.cn/yyk/article/*"],
		article: [".text.noise"],
		title:" h3.v_title",
		noArticleWidth: "",
		delay:1000,
	},
	{
		// https://www.bohe.cn/article/view/7rx9kpsvkxtzxrs.html
		match: ["*://www.bohe.cn/article/view/*"],
		article: [".dis-info"],
		title:".dis-info > h2",
		noArticleWidth: "",
	},
	{
		// https://www.xywy.com/arc/223419.html
		match: ["*://www.xywy.com/arc/*"],
		article: [".article-txt"],
		title:".art-con-left > h1",
		noArticleWidth: "",
	},
	{
		// https://mip.mfk.com/ask/3433285.shtml
		match: ["*://mip.mfk.com/ask/*"],
		article: [".ContentChoiceness"],
		title:".videoTab > h1",
	},
	{
		// https://www.3d66.com/answers/question_138466.html
		match: ["*://www.3d66.com/answers/*"],
		article: [".answer-type-list"],
		noArticleWidth: "",
		title:".info-hd > h1",
		noArticlePadding: "",
	},
	{
		// https://edu.iask.sina.com.cn/bdjx/6dHYUDB8oGA.html
		match: ["*://edu.iask.sina.com.cn/bdjx/*"],
		article: [".pc-content-body"],
		title:".pc-content-title-t",
	},
	{
		// https://bbs.pcbeta.com/viewthread-1918547-1-1.html
		match: ["*://bbs.pcbeta.com/viewthread-*"],
		article: [".pcb"],
		title:"#thread_subject",
		noArticleWidth: "",
	},
	{
		// https://www.jb51.net/softs/764765.html
		match: ["*://www.jb51.net/softs/*"],
		article: ["#xqjs"],
		title:".soft-title>h1",
		noArticleWidth: "",
		noArticlePadding: "",
		customCss: "#footer{display: flex;}",
	},
	{
		// https://zixue.3d66.com/article/details_99119.html
		match: ["*://zixue.3d66.com/article/*"],
		article: [".rich-text-container"],
		title:".details-1-1-title",
		noArticleWidth: "",
	},
	{
		// https://shouyou.3dmgame.com/android/141590.html
		match: ["*://shouyou.3dmgame.com/*"],
		article: [".detail-txt"],
		title:".bt >h1",
		noArticleWidth: "",
		noArticlePadding: "",
		customCss:".detail-txt{width:99% !important;} .fottertop2,.fotter-bottom{background:unset !important;}",
	},
	{
		// https://www.xue51.com/soft/53010.html#xzdz
		match: ["*://www.xue51.com/soft/*"],
		article: [".showcon"],
		title:".title >h1",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://m.yilianmeiti.com/article/309063.html
		match: ["*://m.yilianmeiti.com/article/*"],
		article: [".art-detail "],
		title:".art-detail>h1",
	},
	{
		// https://www.cndzys.com/ylcore/wenda_detail/11_329253.html
		match: ["*://www.cndzys.com/ylcore/wenda_detail/*"],
		article: [".content "],
		title:".content>h1",
	},
	{
		// https://wapask-mip.39.net/bdsshz/question/92837081.html
		match: ["*://wapask-mip.39.net/bdsshz/question/*"],
		article: [".doctor-replay "],
		title:".question-box>h2",
	},
	{
		// https://www.yilianmeiti.com/article/309063.html
		match: ["*://www.yilianmeiti.com/article/*"],
		article: [".detail "],
		title:".layout>h1",
		noArticleWidth: "",
	},
	{
		// https://m.youlai.cn/ask/D1B39BYgBYM.html
		match: ["*://m.youlai.cn/ask/*"],
		article: [".view "],
		title:".view>h1",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://tieba.baidu.com/p/3086321295
		match: ["*://tieba.baidu.com/p/*"],
		article: [".p_postlist "],
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://www.douban.com/note/176448624/?_i=889288986Jrxqa,2504488dFtxpF-
		match: ["*://www.douban.com/note/*"],
		article: [".note "],
		title: ".note-header>h1",
		noArticleWidth: "",
	},
	{
		// https://www.liqucn.com/rj/71586.shtml
		match: ["*://www.liqucn.com/rj/*"],
		article: [".app_wrap "],
		title: "h1",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://soft.onlinedown.net/soft/570888.htm
		match: ["*://soft.onlinedown.net/soft/*"],
		article: [".downdecailItem "],
		title: "div.name",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://m.wenda.so.com/q/1638486092215398
		match: ["*://m.wenda.so.com/q/*"],
		article: [".ans-box"],
		title: ".ask-title",
	},
	{
		// https://wenwen.sogou.com/z/q826940480.htm
		match: ["*://wenwen.sogou.com/z/*"],
		article: [".replay-wrap "],
		title: ".detail-tit",
	},
	{
		// https://mip.pingguolv.com/ask/hioolhooa.html
		match: ["*://mip.pingguolv.com/ask/*"],
		article: [".artBody"],
		title: ".artTitle",
	},
	{
		// https://www.dongao.com/dy/zjzcgl_zjcg_44909/14638527.shtml
		match: ["*://www.dongao.com/dy/*"],
		article: [".answer_detail"],
		title: ".detail_top>h1",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://www.iteye.com/problems/141596
		match: ["*://www.iteye.com/problems/*"],
		article: [".problem","#solutions"],
		title: ".close",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// http://www.winwin7.com/soft/86529.html
		match: ["*://www.winwin7.com/soft/*"],
		article: ["div.content"],
		title: ".ititle",
		noArticleWidth: "",
	},
	{
		// https://avmedia.0voice.com/?id=43028
		match: ["*://avmedia.0voice.com/?id=*"],
		article: [".article-content"],
		title: ".article-title",
		noArticleWidth: "",
		customCss:".footer{background:unset !important;}",
		float:".header",
	},
	{
		// https://linux.do/t/topic/62838
		match: ["*://linux.do/t/topic/*"],
		article: ["#topic"],
		title: ".title-wrapper>h1",
		noArticleWidth: "",
	},
	{
		// https://m.youlai.cn/jingbian/article/F89F40mJFEO.html
		match: ["*://m.youlai.cn/jingbian/article/*"],
		article: [".view-article"],
		title: ".view-article>h1",
		noArticleWidth: "",
	},
	{
		// https://www.cnblogs.com/lyongyong/p/15184395.html#circle=on
		match: ["*://www.cnblogs.com/*"],
		header: ".navbar",
		article: [".post"],
		title: ".postTitle2,.postTitle1",
		noArticlePadding: "",
	},
	{
		// https://www.douban.com/group/topic/233172019/?_i=483527186Jrxqa,498503986Jrxqa
		match: ["*://www.douban.com/group/topic/*"],
		header: ".nav,.global-nav",
		article: ["#topic-content", ".article > ul"],
		title: ".article > h1",
		noArticleWidth: "",
	},
	{
		// https://www.ximalaya.com/sound/654833787/720357314
		match: ["*://www.ximalaya.com/sound/*"],
		header: "header",
		article: [".layout-main"],
		title: ".title-wrapper",
	},
	{
		// https://web.shobserver.com/wx/detail.do?id=751736
		// https://www.jfdaily.com/wx/detail.do?id=751736
		match: ["*://web.shobserver.com/wx/*", "*://www.jfdaily.com/wx/*"],
		header: ".xiazai-top",
		article: [".news-container"],
		title: ".news-title",
	},
	{
		// https://www.dxy.cn/bbs/newweb/pc/post/8168102
		match: ["*://www.dxy.cn/bbs/newweb/pc/post/*"],
		header: "header",
		article: [".threadWrap___qgo9d>div"],
		title: ".title___2fLXg>span",
		noArticleWidth: "",
		noArticlePadding: "",
		delay: 2000,
	},
	{
		// https://www.mafengwo.cn/wenda/detail-13960453.html
		match: ["*://www.mafengwo.cn/wenda/*"],
		header: ".topBar,.hide",
		article: [".col-main"],
		title: ".q-title>h1",
		float: ".fixed",
	},
	{
		// https://bbs.chinauos.com/zh/post/13120
		match: ["*://bbs.chinauos.com/*/post/*"],
		header: "app-header-nav-pc",
		article: [".comment"],
		title: ".pot_title",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://bbs.deepin.org/post/258516
		match: ["*://bbs.deepin.org/post/*"],
		header: "app-header-nav-pc",
		article: [".comment"],
		title: ".pot_title",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://iask.sina.com.cn/jx/sh/4Q7EpdkHqONF.html
		match: ["*://iask.sina.com.cn/jx/*"],
		header: ".header-search-bar",
		article: [".detail-quesion", ".detail-answer"],
		title: ".quesion-title",
		noArticlePadding: "",
	},
	{
		// https://www.92sucai.com/soft/517280.html
		match: ["*://www.92sucai.com/soft/*"],
		header: "#header",
		article: ["#dcont"],
		title: "h1.articleTitle",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://download.csdn.net/blog/column/12443431/133098225
		match: ["*://download.csdn.net/blog/*"],
		header: "#csdn-toolbar",
		article: [".blog-column-content-paper"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1.articleTitle",
	},
	{
		// https://my.oschina.net/emacs_7348206/blog/11428459
		match: ["*://my.oschina.net/emacs_*", "*://www.oschina.net/news/*", "*://my.oschina.net/u/*/blog/*"],
		header: ".small-header-box__wrapper",
		article: [".article-box"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: ".article-box__title > a",
	},
	{
		// https://answers.microsoft.com/zh-hans/windows/forum/all/win10%E7%B3%BB%E7%BB%9F%E9%94%81%E5%B1%8F%E5%90%8E/d7e4722d-829a-4d5c-968d-57469f9850d3
		match: ["*://answers.microsoft.com/*"],
		header: "#headerArea",
		article: ["#threadQuestion", "#threadBottomSection"],
		noArticleWidth: "",
		title: "#threadQuestionTitleStatusIcons",
	},
	{
		// https://consumer.huawei.com/cn/support/content/zh-cn15787876/
		match: ["*://consumer.huawei.com/cn/support/content/*"],
		header: "div.header",
		article: ["#jd-content"],
		title: "#knowledgeTitle",
	},
	{
		// https://segmentfault.com/q/1010000043164166/a-1020000043164170
		match: ["*://segmentfault.com/q/*"],
		header: "#sf-header",
		article: [".card-body", ".answer-area"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1.h2 > a.text-body",
	},
	{
		// https://www.gznf.net/story/4049.html
		match: ["*://www.gznf.net/story/*"],
		header: "#header",
		article: ["div.post"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1.title",
	},
	{
		// https://edu.iask.sina.com.cn/jy/2qDBNm37OvB.html
		match: ["*://edu.iask.sina.com.cn/jy/*", "*://iask.sina.com.cn/jxwd/*"],
		header: ".header-search-bar",
		article: [".detail-answer", ".detail-quesion"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1.quesion-title",
	},
	{
		// https://m.qqtn.com/q/93260
		match: ["*://m.qqtn.com/q/*"],
		article: [".g-down-introd"],
	},
	{
		// http://www.kkx.net/soft/10714.html
		match: ["*://www.kkx.net/soft/*"],
		article: [".slidetxtbox"],
		title: ".infobox_centre >h2",
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".fixed,.details_right",
	},
	{
		// https://news.hbtv.com.cn/p/2506327.html
		match: ["*://news.hbtv.com.cn/p/*"],
		article: ["#main_article"],
		header: "#header",
		title: "#article_title",
		float: ".article-sidebar",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://www.jiqizhixin.com/articles/2024-08-12-5
		match: ["*://www.jiqizhixin.com/articles/*"],
		article: ["div.u-container"],
		header: "div.header__container",
		title: ".article__title",
		float: ".article-sidebar",
	},
	{
		// https://xinzhi.wenda.so.com/a/1674098957206346
		match: ["*://xinzhi.wenda.so.com/a/*"],
		article: ["div.article"],
		header: "div.so-nav-container,#login-part,.mod-search",
		title: "h1.art-title",
	},
	{
		// https://m.iask.sina.com.cn/b/newPZUEY7vfB2X.html
		match: ["*://m.iask.sina.com.cn/b/*"],
		article: [".knowledge-list-switch", ".m-b-question"],
		header: ".m-baidu-header",
		title: ".m-b-question-title",
	},
	{
		// https://www.onlinedown.net/soft/621941.htm?t=1567095937624
		match: ["*://www.onlinedown.net/soft/*"],
		article: [".soft-info  "],
		morehide: ".m-con-right",
		noArticleWidth: "",
		noArticlePadding: "",
		header: ".g-header",
	},
	{
		// https://soft.3dmgame.com/down/213325.html
		match: ["*://soft.3dmgame.com/down/*"],
		article: [".inforwarp  "],
		morehide: ".ContR",
		noArticleWidth: "",
		noArticlePadding: "",
		header: "div.header_wrap",
	},
	{
		// https://m.itmop.com/downinfo/307458.html
		match: ["*://m.itmop.com/downinfo/*"],
		article: [".intro  "],
		morehide: ".mainContentRight ",
		header: "header.top,nav",
	},
	{
		// https://patch.ali213.net/showpatch/180241.html
		match: ["*://patch.ali213.net/showpatch/*"],
		article: [".pluginIntroduceContaienr  "],
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".mainContentRight ",
		header: ".ns_t1,.headerPartTopContainer,.headerPartBottomContainer,.gameNavContainer,.softmodclass",
	},
	{
		// https://mydown.yesky.com/pcsoft/413563730.html
		match: ["*://mydown.yesky.com/pcsoft/*"],
		article: [".software_introduction "],
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".main_right",
		header: "header",
		title: "div.name>h1",
	},
	{
		// https://stackoverflow.com/questions/8162837/curl-downloaded-files-always-empty
		match: ["*://stackoverflow.com/questions/*"],
		article: ["#mainbar"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "#question-header>h1>a",
	},
	{
		// http://123.56.139.157:8082/article/23/5375563/detail.html
		match: ["*://123.56.139.157:8082/article/*"],
		article: [".resource "],
		noArticleWidth: "",
		noArticlePadding: "",
		title: ".content-p>h2",
		header: ".nav",
		morehide: ".answer-cont-rig",
	},
	{
		// https://licai.cofool.com/ask/qa_3456365.html
		match: ["*://licai.cofool.com/ask/*"],
		article: [".question-result-tab"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: ".answer-detail-title",
		header: ".new-header,#fixPara",
		morehide: ".answer-cont-rig",
	},
	{
		// https://www.360docs.net/doc/8814029631.html
		match: ["*://www.360docs.net/doc/*"],
		article: [".doc-bg"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: ".doc-h1",
		header: "#headerbg,div.nav",
		morehide: "#rightcol",
	},
	{
		// https://www.renrendoc.com/paper/203766892.html
		match: ["*://www.renrendoc.com/paper/*", "*://www.renrendoc.com/p-*"],
		article: [".center-wrap"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "div.titletop>h1",
		header: "#header-fixed",
		morehide: ".left-wrap",
	},
	{
		// https://www.saoniuhuo.com/question/detail-2336397.html
		match: "*://www.saoniuhuo.com/question/*",
		article: [".discuss-topic", ".js-comment-list"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1.discuss-title",
		header: ".klg-header",
		morehide: ".klg-right-area",
	},
	{
		// https://ost.51cto.com/posts/1789
		match: "*://ost.51cto.com/posts/*",
		article: ["div.posts-con", "#commentbox"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "div.title>h1",
		header: "div.topbox",
		morehide: "div.right",
	},
	{
		// https://www.5axxw.com/questions/content/bkyx86
		match: "*://www.5axxw.com/questions/*",
		article: [".border-0"],
		noArticleWidth: "",
		noArticlePadding: "",
		title: "h1>a.text-body",
		header: "#question-header",
	},
	{
		// https://www.zhihu.com/pin/1710688506907803648
		match: "*://www.zhihu.com/pin/*",
		article: ["div.RichContent"],
		noArticleWidth: "",
		header: "header",
	},
	{
		// https://www.ximalaya.com/ask/q1535994
		match: "*://www.ximalaya.com/ask/*",
		article: ["div.answer-wrapper"],
		header: "header",
		noArticleWidth: "",
		title: "h1.rL_",
		morehide: ".layout-side.rL_",
	},
	{
		// https://m.ximalaya.com/ask/q6424983
		match: "*://m.ximalaya.com/ask/*",
		article: ["div.answer-wrapper"],
		header: "div.xm-header",
		title: "h1.S_q",
	},
	{
		// https://easylearn.baidu.com/edu-page/tiangong/questiondetail?id=1763409915028681805&fr=search
		match: "*://easylearn.baidu.com/edu-page/*",
		article: ["div.shiti-answer"],
		header: "div#c-header",
		title: "h1.title-info",
		noArticleWidth: "",
		noArticlePadding: "",
		delay: 1000,
		morehide: "div.right",
	},
	{
		// https://m.sohu.com/a/525390351_120176023
		match: "*://m.sohu.com/a/*",
		article: ["div.article-content-wrapper"],
		header: "div.top-header-container",
		title: "h1.title-info",
	},
	{
		// https://liulanmi.com/zt/13557.html
		match: "*://liulanmi.com/zt/*",
		article: ["article.article-content", "header.article-header"],
		header: "header.header",
		title: ".article-title > a",
		noArticleWidth: "",
		morehide: ".sidebar",
	},
	{
		// https://www.xinglinpukang.com/ask/95515667.html
		match: "*://www.xinglinpukang.com/ask/*",
		article: "div.question",
		title: "div.question_detial>.title",
		header: "div.pub-header",
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: "div.right",
	},
	{
		// https://m.weibo.cn/status/J6IkQmAwE
		match: "*://m.weibo.cn/status/*",
		article: "div.main",
		noArticleBg: "",
		noArticleWidth: "",
		noArticlePadding: "",
		delay: 1000,
	},
	{
		// https://www.docin.com/p-1793709372.html
		match: "*://www.docin.com/p-*",
		article: "#contentcontainer",
		title: "span.doc_title",
		header: "div.head_wrapper",
		noArticleBg: "",
		noArticleWidth: "",
		noArticlePadding: "",
		float: ".relative_doc_fixed_sider,.backToTop",
		delay: 1000,
		morehide: ".aside",
	},
	{
		// https://max.book118.com/html/2018/0412/161305776.shtm
		match: "*://max.book118.com/html/*",
		article: "div.preview-bd",
		title: "div.title>h1",
		header: "div.header",
		noArticleWidth: "",
		noArticlePadding: "",
		float: "#sidebar",
		clearBg: ["#footer"],
		morehide: ".side",
	},
	{
		// https://weibo.com/3909143892/J6IkQmAwE
		match: "*://weibo.com/*",
		article: "article",
		noArticleWidth: "",
		noArticlePadding: "",
		delay: 1000,
	},
	{
		// http://m.chynews.cn/jiaoyu/2022/1219/52529.html
		match: "*://m.chynews.cn/*",
		article: "section.ymw-contxt",
		header: "header.ymw-header",
		title: "aside>h1",
	},
	{
		// https://www.thepaper.cn/newsDetail_forward_28220107
		match: "*://www.thepaper.cn/newsDetail*",
		article: "div.index_wrapper__L_zqV",
		header: "div.index_headerfixed__GyBYK",
	},
	{
		// https://content-static.cctvnews.cctv.com/snow-book/index.html?item_id=881584799583221388&track_id=7da808cf-38d5-4d85-8d72-46853a41a930
		match: "*://content-static.cctvnews.cctv.com/*",
		article: "div.container",
		delay: 1000,
	},
	{
		// https://wap.zol.com.cn/ask/x_25323627.html
		match: "*://wap.zol.com.cn/ask/*",
		article: [".discuss-list.page-space", "#main-wrapper"],
		title: "div.header-txt>h1",
		header: "header.global-page-header,body>img:nth-child(1)",
	},
	{
		// https://ask.zol.com.cn/x/15235157.html
		match: "*://ask.zol.com.cn/*",
		article: "div.left",
		title: "div.title",
		header: "div.top-bar,div.nav-headerbox",
		// 相关问题，侧边微信
		hide: "div.standing,.side-weixin-box",
		noArticlePadding: "",
		removeHorCss:".position-inf div.right,.position-inf div.btns",
		widthFitContent:"ans.ans",
	},
	{
		// https://wenda.so.com/q/1694788635218092
		match: "*://wenda.so.com/q/*",
		article: ["div#answer", "div.question"],
		title: "span.question-title-txt",
		header: "div.main-nav,div.search,div.fixed-nav,div.so-nav-container",
		morehide: ".sidebar",
	},
	{
		// https://heb.bendibao.com/live/2019225/51379.shtm
		match: "*://*.bendibao.com/live/*",
		article: ["div.article-content"],
		title: "span.question-title-txt",
		header: "div.main-search,ul.main-nav,div.header",
		// 右侧栏，左侧分享
		hide: ".main-right,.main-catalog.nav-fixed"
	},
	{
		// https://bbs.csdn.net/topics/300125211
		match: ["*://bbs.csdn.net/topics/*"],
		article: ["div.detail-container"],
		title: ".align-items-center>h1",
		header: ".ccloud-tool-bar",
		float: ".user-right-floor",
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".right-box",
	},
	{
		// https://github.com/AiuniAI/Unique3D
		match: "*://github.com/*",
		article: [".iGmlUb", ".comment "],
		noArticleWidth: "",
		noArticlePadding: "",
		noPageBg: "",
	},
	{
		// https://wenku.csdn.net/column/522m4fc9gr
		match: ["*://wenku.csdn.net/column/*"],
		article: ["div.p-r"],
		header: "#csdn-toolbar",
		title: "div.header > .title",
		float: ".column-vote-panel,.right-bar-box,",
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".layout-right,.fixed-bottom",
	},
	{
		// https://ask.csdn.net/questions/8129622/54789053
		match: ["*://ask.csdn.net/questions/*"],
		article: [".question_container", ".answer_item_li"],
		header: "#csdn-toolbar",
		title: ".title-box > h1",
		float: ".detail_right",
		noArticleWidth: "",
		noArticlePadding: "",
	},
	{
		// https://worktile.com/kb/ask/1229207.html
		match: "*://worktile.com/kb/*",
		article: ["div#answer"],
		header: "div.top-news,header.header",
		title: ".q-content .q-title",
		float: ".action.action-pos-1",
		noArticleWidth: "",
		noArticlePadding: "",
		morehide: ".sidebar,div.action",
	},
];
/** 设置项 */
const myPreferenceList = [
	{
		type: "number",
		tooltip: true,
		tooltipText: "设置为 0 时，使用默认值",
		text: "宽度",
		preference: "article_width",
		defaultValue: 0,
	},
	{
		type: "number",
		tooltip: false,
		text: "阴影大小",
		preference: "article_shadow_size",
		defaultValue: 45,
	},
	{
		type: "number",
		tooltip: false,
		text: "标题字体大小",
		preference: "article_title_fontsize",
		defaultValue: 35,
	},
	{
		type: "checkbox",
		tooltip: false,
		text: "隐藏网页顶栏",
		preference: "article_hide_topbar",
		defaultValue: false,
	},
	{
		type: "number",
		tooltip: false,
		text: "文章内边距大小",
		preference: "article_padding_size",
		defaultValue: 40,
	},
	{
		type: "color",
		tooltip: true,
		tooltipText: "设置为 0 时不生效",
		text: "文章背景颜色",
		preference: "article_bg_color",
		defaultValue: "#FFFFFF",
	},
	{
		type: "color",
		tooltip: true,
		tooltipText: "设置为 0 时不生效",
		text: "网页背景颜色",
		preference: "webpage_bg_color",
		defaultValue: "#EDEDED",
	},
	{
		type: "textarea",
		tooltip: false,
		text: "自定义 CSS",
		preference: "page_custom_css",
		defaultValue: "",
	},

];

/** 设置工具类 */
class CandyTekPreferenceUtil {
	/** 是否已向网页添加过设置面板了 */
	isAlreadyAddSettingPanel = false;
	/** 设置面板根元素 */
	rootShadow = null;
	/** 存放设置值的地方。获取 prefValues[key] */
	prefValues;
	/** 源 pref 配置数组 */
	preferenceList;

	constructor(preferenceList) {
		this.preferenceList = preferenceList;
		this.refreshPrefValues();
	}

	/** 刷新设置值 */
	refreshPrefValues() {
		this.prefValues = this.preferenceList.reduce((list, curr) => {
			list[curr.preference] = GM_getValue(curr.preference, curr.defaultValue);
			return list;
		}, {});
	}

	/** 获取设置值 */
	get(key) {
		return this.prefValues.hasOwnProperty(key) ? this.prefValues[key] : GM_getValue(key, "");
	}

	/** 写入设置值，未适配 boolean */
	set(key, value) {
		GM_setValue(key, value);
		this.prefValues[key] = value;
	}

	/** 显示设置面板在网页右上角 */
	show() {
		if (this.isAlreadyAddSettingPanel) {
			this.rootShadow.querySelector(".setting_panel").style.display = "block";
			return;
		}

		if (!document.body.createShadowRoot) {
			console.warn("可能不能创建 ShadowRoot");
			//return;
		}
		// 创建设置面板
		const host = document.createElement('div');
		host.id = "simplify_article_settings_panel";
		document.body.appendChild(host);

		const root = host.attachShadow({ mode: 'open' });
		this.rootShadow = root;
		this.isAlreadyAddSettingPanel = true;
		root.innerHTML = `
	<style>
		.preference_title {
			width: fit-content;
			height: 40px;
			font-size: 20px;
			margin: 0px;
			line-height: 40px;
			padding-left: 16px;
			font-weight: bold;
		}

		.preference_item {
			display: flex;
			padding: 12px 8px;
		}

		.preference_item_title {
			padding: 0px 0px 0px 10px;
			margin: 0px;
			font-size: 15px;
			line-height: 40px;
			letter-spacing: 2px;
			height: 40px;
			width: fit-content;
		}

		.preference_item_edittext {
			font-size: 14px;
			margin-left: auto;
			line-height: 36px;
			height: 36px;
			padding: 0px;
			border: 2px solid #c4c7ce;
			border-radius: 6px;
			text-align: center;
			width: 138px;
		}
		.preference_item_textarea {
			text-align: unset;
			line-height: 20px;
		}

		.preference_item_edittext_color {
			width: 100px;
			border-radius: 6px 0px 0px 6px;
			border-right: 0;
		}

		.hoverbutton {
			background: none;
		}

		.hoverbutton:hover {
			background: #CCC;
			background-size: 80% 80%;
			border-radius: 4px;
		}

		.input_select_color {
			width: 40px;
			height: 40px;
			margin: 0px;
			padding:0px 2px 0px 4px;
			box-sizing: border-box;
			background-color:#ffffff;
			border-width: 2px;
			border-radius: 0px 6px 6px 0px;
			border-left: 0px;
			border-color: #c4c7ce;
		}

		.checkbox_input {
			width: 24px;
			height: 40px;
			margin: 0px 0px 0px auto;
		}


		.setting_panel {
			position: fixed;
			right: 20px;
			top: 20px;
			width: fit-content;
			height: fit-content;
			border-radius: 8px;
			background: #FFFFFF;
			padding: 8px;
			box-shadow: 0 10px 20px rgb(0 0 0 / 15%);
			z-index:9999;
		}

		.container {
			background: #F0F0F0;
			border-radius: 8px;
			margin-top: 0px;
			padding-top: 8px;
			padding-right: 8px;
		}
	</style>

	<div class="setting_panel">
		<div class="preference_item" style="padding-top: 0px;">
			<button id="close" title="关闭并保存" class="hoverbutton" type="submit"
				style="width: 40px;height: 40px;display: flex;align-items: center; justify-content: center; border: unset;">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5f6368"
					viewBox="0 -960 960 960">
					<path
						d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
				</svg>
			</button>
			<p class="preference_title">设置</p>
		</div>
		<div class="container" id="container">

		</div>
	</div>
	`;

		const container = root.querySelector("#container");
		// 动态创建设置项
		for (const index in this.preferenceList) {
			const item = this.preferenceList[index];
			const itemDiv = document.createElement("div");
			itemDiv.className = "preference_item";

			const itemTitle = document.createElement("p");
			itemTitle.className = "preference_item_title";
			itemTitle.innerText = item.text;
			itemDiv.appendChild(itemTitle);

			if (item.type == "number") {
				const input = document.createElement("input");
				input.type = "number";
				input.className = "preference_item_edittext";
				input.id = item.preference;
				input.value = GM_getValue(item.preference, item.defaultValue);
				itemDiv.appendChild(input);
			} else if (item.type == "color") {
				const inputText = document.createElement("input");
				inputText.type = "text";
				inputText.className = "preference_item_edittext preference_item_edittext_color";
				inputText.id = item.preference;
				inputText.value = GM_getValue(item.preference, item.defaultValue);
				inputText.maxLength = 50;
				itemDiv.appendChild(inputText);

				const inputColor = document.createElement("input");
				inputColor.type = "color";
				inputColor.className = "input_select_color";
				if (this.isValidHexColor(inputText.value)) {
					inputColor.value = inputText.value;
				}
				itemDiv.appendChild(inputColor);

				inputText.addEventListener('input', () => this.inputTextAndChangeDisplayColor(inputText, inputColor));
				inputColor.addEventListener('input', () => this.selectColorAndChangeText(inputText, inputColor));
			} else if (item.type == "checkbox") {
				const input = document.createElement("input");
				input.type = "checkbox";
				input.id = item.preference;
				const checkValue = GM_getValue(item.preference, item.defaultValue);
				input.checked = checkValue;
				input.className = "checkbox_input";
				itemDiv.appendChild(input);
			} else if (item.type == "textarea") {
				const input = document.createElement("textarea");
				input.id = item.preference;
				input.value = GM_getValue(item.preference, item.defaultValue);
				input.className = "preference_item_edittext preference_item_textarea";
				itemDiv.appendChild(input);
			}
			container.appendChild(itemDiv);
		}

		root.querySelector("#close").onclick = () => {
			root.querySelector(".setting_panel").style.display = "none";
			// 动态创建设置项
			for (const index in this.preferenceList) {
				const item = this.preferenceList[index];

				if (item.type == "color" || item.type == "textarea") {
					try {
						GM_setValue(item.preference, root.querySelector(`#${item.preference}`).value);
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				} else if (item.type == "number") {
					try {
						GM_setValue(item.preference, parseFloat(root.querySelector(`#${item.preference}`).value));
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				} else if (item.type == "checkbox") {
					try {
						GM_setValue(item.preference, root.querySelector(`#${item.preference}`).checked);
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				}
			}
			this.refreshPrefValues();
		};
	}

	/** input 颜色选择器更改颜色时，同时更改文本框 */
	selectColorAndChangeText(inputText, inputColor) {
		inputText.value = inputColor.value;
	};
	/** 文本框更改值时，同时更改颜色显示 */
	inputTextAndChangeDisplayColor(inputText, inputColor) {
		const color = inputText.value;
		if (this.isValidHexColor(color)) {
			inputColor.value = color;
		}
	};

	/** 用于校验 6 位的十六进制颜色值 */
	isValidHexColor(hex) {
		try {
			const hexPattern = /^#?([a-fA-F0-9]{6})$/;
			return hexPattern.test(hex);
		} catch (error) {
			return false;
		}
	}

}

(() => {
	// 快捷键：Ctrl + Q 打开添加白名单窗口
	document.addEventListener('keydown', (event) => {
		if (event.ctrlKey
			&& event.keyCode == 81
			&& !event.altKey
			&& !event.shiftKey
			&& !event.target.isContentEditable
			&& !["TEXTAREA", "INPUT"].includes(event.target.tagName)
			&& location.hash.includes('#circle')
		   ) {
			clickSettingButton()
			console.info(`执行快捷键，打开添加白名单`);
		}
	});

	// 尝试寻找文章主体元素次数，降到为0就不再寻找了
	let tryGetTheNumberOfBodyTimes = 10;
	let p;

	// 开始匹配网站
	for (const website of myMatchWebsites) {
		let hit = false;
		hit = Array.isArray(website.match) ? website.match.some((s) => matchRule(window.location.href, s)) : matchRule(window.location.href, website.match);

		if (hit) {
			p = new CandyTekPreferenceUtil(myPreferenceList);
			// 添加设置菜单
			GM_registerMenuCommand("布局设置", () => {
				p.show();
			});

			console.info(`匹配成功 ${website.match}，数据库适配数量${myMatchWebsites.length}`);
			if ('delay' in website) {
				openReadMode(website, website.delay / 10)
				//setTimeout(() => openReadMode(website, website.delay / 10), 0);
			} else {
				openReadMode(website, 0);
			}
			break;
		}
	};

	/** match匹配方法 */
	function matchRule(str, rule) {
		const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return new RegExp(`^${rule.split("*").map(escapeRegex).join(".*")}$`).test(str);
	}
	/** 阅读模式主流程 */
	function openReadMode(website, delay) {
		if (tryGetTheNumberOfBodyTimes < 0) {
			console.error("找不到文章主体");
			return;
		}
		// 文章主体元素
		const article = Array.isArray(website.article) ? document.querySelector(website.article[0]) : document.querySelector(website.article);
		if (article) {
			let shouldSetArticleCenter = false;
			try {
				shouldSetArticleCenter = article.getBoundingClientRect().width == document.body.getBoundingClientRect().width;
			} catch { }
			const saveArticleWidth = p.get("article_width");
			const articleWidth = saveArticleWidth == 0 ? 940 : saveArticleWidth;
			// 给文章主体添加样式
			const cssArticle = Array.isArray(website.article) ? Array.from(website.article)
			.filter(text => text.length > 0)
			.join(',') : website.article;
			const shouldAdjustArticleWidth = !('noArticleWidth' in website);
			const tempPageBg = p.get("webpage_bg_color");
			const shouldAdjustPageBg = !('noPageBg' in website) && tempPageBg != 0;

			const shadowSize = p.get("article_shadow_size");
			let css = `
				${cssArticle}{
					box-shadow: 0 ${shadowSize / 2}px ${shadowSize}px rgb(0 0 0 / 15%) !important;
					border: 2px solid #c4c7ce !important;
					border-radius: 6px;
					border-style:solid !important;
					border-color:#c4c7ce !important;
					margin-bottom:16px;
			`;
			const tempArticleBg = p.get("article_bg_color");

			if (!('noArticleBg' in website) && tempArticleBg != 0) {
				css += `background:${tempArticleBg} !important;`;
			}
			if (shouldAdjustArticleWidth || ('morehide' in website)) {
				css += `max-width: 96vw !important;min-width: unset !important;width:${articleWidth}px !important;`;
			}
			if (!('noArticlePadding' in website)) {
				css += `padding: 16px ${p.get("article_padding_size")}px 16px !important;`;
			}
			// 如果文章占满屏幕了，就使其居中
			if (shouldSetArticleCenter) {
				css += `margin:auto !important;`;
			}
			css += `}`;
			// 移除顶栏
			if ('header' in website && p.get("article_hide_topbar")) {
				css += `${website.header}{display:none !important;}`;
			}
			if ('removeHorCss' in website) {
				css += `${website.removeHorCss}{right:unset !important;left:unset !important;float: unset !important;}`;
			}
			if ('widthFitContent' in website) {
				css += `${website.widthFitContent}{width:fit-content !important;}`;
			}

			// 更改标题字体
			if ('title' in website) {
				css += `${website.title}{font-size:${p.get("article_title_fontsize")}px !important;line-height:${p.get("article_title_fontsize") + 10}px !important;font-weight: 700 !important;min-height:fit-content;}`;
			}
			// 移除
			if ('hide' in website) {
				css += `${website.hide}{display:none !important;}`;
			}
			// 移除侧栏
			if ('morehide' in website) {
				css += `${website.morehide}{display:none !important;}`;
			}
			// 去掉悬浮
			if ('float' in website) {
				css += `${website.float}{position:absolute !important;}`;
			}
			if ('customCss' in website) {
				css += website.customCss;
			}
			GM_addStyle(css);
			// 清除指定元素的背景
			if ('clearBg' in website) {
				website.clearBg.forEach(item => clearBackground(document.querySelector(item)));
			}

			// 遍历父布局
			let targetParent = article.parentNode;
			while (targetParent) {
				// 调整父元素宽度
				if (shouldAdjustArticleWidth) {
					try {
						const computedStyle = window.getComputedStyle(targetParent);
						// 检查是否存在 min-width 属性且其值小于 文章宽度
						if (computedStyle.minWidth && parseInt(computedStyle.minWidth) < articleWidth) {
							targetParent.style.minWidth = 'unset';
						}
					} catch { }
				}

				// 更改属性 overflow，忘记是什么作用了
					try {
						const overflowStyle = window.getComputedStyle(targetParent).overflow;
						// 如果 overflow 是 hidden，将其改为 visible
						if (overflowStyle === 'hidden') {
							targetParent.style.overflow = 'visible';
						}
					} catch { }
				// 更改网页背景
				if (shouldAdjustPageBg) {
					if (targetParent == document.body || targetParent == document.documentElement) {
						setBackground(targetParent, tempPageBg);
					} else {
						clearBackground(targetParent);
					}
				}
				targetParent = targetParent.parentNode;
			}
			tryGetTheNumberOfBodyTimes = -1;
			console.info("阅读模式处理完整");
			return;
		}
		if (delay == 0) {
			if (!article) {
				console.error("找不到文章主体");
			}
			return;
		}
		tryGetTheNumberOfBodyTimes--;
		// 不断循环查找，10次，直到找到为止
		setTimeout(() => openReadMode(website, delay), delay);
	}
	/** 清除指定元素背景 */
	function clearBackground(element) {
		try {
			// 获取元素的计算样式
			const computedStyle = window.getComputedStyle(element);
			// 检查背景属性
			const hasBackground = computedStyle.background !== 'none' || computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || computedStyle.backgroundImage !== 'none';
			if (!hasBackground) {
				return;
			}
			// console.warn(`${computedStyle.background}   ${computedStyle.backgroundColor}`);
			// 如果存在背景属性，则清空背景
			element.style.setProperty('background', 'unset', 'important');
			element.style.setProperty('background-color', 'unset', 'important');
			element.style.setProperty('background-image', 'unset', 'important');
		} catch { }
	}
	/** 设置指定元素背景 */
	function setBackground(element, color) {
		element.style.setProperty('background', color, 'important');
		element.style.setProperty('background-color', color, 'important');
		element.style.setProperty('background-image', 'unset', 'important');
	}

	/** 点击 Circle 脚本设置按钮 */
	function clickSettingButton() {
		const targetSelector = "div.toolbar > div > span.anticon-setting";
		const divs = document.querySelectorAll("html > div");
		for (const div of divs) {
			if (div.shadowRoot) {
				const targetElement = div.shadowRoot.querySelector(targetSelector);
				if (targetElement) {
					targetElement.click();
					setTimeout(() => {
						clickBlackListButton(targetElement);
					}, 100);
					break;
				}
			}
		}
	}

	/** 点击 Circle 脚本黑白名单按钮 */
	function clickBlackListButton(el) {
		const targetSelector = "#rc-tabs-0-tab-lists";
		const divs = document.querySelectorAll("html > div");
		for (const div of divs) {
			if (div.shadowRoot) {
				const targetElement = div.shadowRoot.querySelector(targetSelector);
				if (targetElement) {
					targetElement.click();
					setTimeout(() => {
						div.shadowRoot.querySelector("#rc-tabs-0-panel-lists > div > div > div > li:nth-child(2) > button").click();
						el.click();
					}, 50);
					break;
				}
			}
		}
	}

})();

