// ==UserScript==
// @name         各大网页元素优化
// @namespace    https://viayoo.com/
// @version      1.0
// @description  手机、电脑全平台通用:自动拦截或删除`下载弹窗`、`悬浮按钮`等影响用户体验的元素;长期维护:CSDN、简书、知乎、百家号、百度贴吧、百度文库、百度新闻、新浪新闻、腾讯视频、优酷视频、爱奇艺、好看视频、百度搜索、哔哩哔哩、丁香园、微博、新浪财经、抖音、电子发烧友、人民网、新京报、观察者网、澎湃新闻、凤凰新闻、网易新闻、虎嗅、虎扑、豆瓣、太平洋电脑、汽车之家、taptap、it之家、360doc、开源中国、36氪、小红书、半月谈
// @author       
// @run-at       document-body
// @match        *://*.toutiao.com/*
// @match        *://*.banyuetan.org/*
// @match        *://*.dongchedi.com/*
// @match        *://*.dcdapp.com/*
// @match        *://*.baidu.com/*
// @match        *://*.csdn.net/*
// @match      	 *://*.jianshu.com/*
// @match        *://juejin.cn/*
// @match        *://*.zhihu.com/*
// @exclude      *://www.zhihu.com/signin*
// @match        *://tieba.baidu.com/*
// @match        *://*.tieba.baidu.com/*
// @match        *://baijiahao.baidu.com/s*
// @match        *://mbd.baidu.com/newspage/data/*
// @match        *://news.baidu.com/news*
// @match        *://m.baidu.com/sf_baijiahao/*
// @match        *://view.inews.qq.com/*
// @match        *://xw.qq.com/*
// @match        *://*.v.qq.com/*
// @match        *://youku.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://haokan.baidu.com/*
// @match        *://m.baidu.com/*
// @match        *://*.bilibili.com/*
// @match        *://3g.dxy.cn/*
// @match        *://*.sina.cn/*
// @match        *://sina.cn/*
// @match        *://m.weibo.cn/*
// @match        *://finance.sina.cn/*
// @match        *://cj.sina.cn/*
// @match        *://*.cj.sina.cn/*
// @match        *://*.ixigua.com/*
// @match        *://www.douyin.com/*
// @match        *://m.elecfans.com/*
// @match        *://app.people.cn/*
// @match        *://m.bjnews.com.cn/detail/*
// @match        *://*.guancha.cn/*
// @match        *://m.thepaper.cn/newsDetail_forward*
// @match        *://*.ifeng.com/*
// @match        *://c.m.163.com/*
// @match        *://m.163.com/*
// @match        *://3g.163.com/*
// @match        *://3g.163.com/*/article/*
// @match        *://3g.163.com/v/video/*
// @match        *://m.huxiu.com/*
// @match        *://m.hupu.com/*
// @match        *://m.douban.com/movie/subject/*
// @match        *://m.douban.com/*
// @match        *://g.pconline.com.cn/*
// @match        *://m.zol.com.cn/*
// @match        *://wap.zol.com.cn/*
// @match        *://www.autohome.com.cn/*
// @match        *://*.m.autohome.com.cn/*
// @match        *://m.autohome.com.cn/*
// @match        *://www.taptap.cn/*
// @match        *://m.taptap.cn/*
// @match        *://m.ithome.com/*
// @match        *://*.quark.cn/*
//// @match        *://quark.sm.cn/*
// @match        *://www.360doc.com/content/*
// @match        *://www.oschina.net/*
// @match        *://m.36kr.com/p/*
// @match        *://www.xiaohongshu.com/*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://*.jkcsjd.com/*
// @match        *://*.taobao.com/*
// @match        *://*.taobao.hk/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.liangxinyao.com/*
// @match             *://*.yiyaojd.com/*
// @exclude       *://login.taobao.com/*
// @exclude       *://pages.tmall.com/*
// @exclude       *://uland.taobao.com/*
// @exclude       *://m.baidu.com/s?*

// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/516406/%E5%90%84%E5%A4%A7%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/516406/%E5%90%84%E5%A4%A7%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	"use strict";
	/**
	 * 规则列表
	 * @type {name/url/items}
	 */
	const websites = [
		{
			name: "CSDN",
			url: "csdn.net",
			items: [
				//下载弹窗
				".weixin-shadowbox",
				//悬浮按钮:APP内打开+登录/打开注册(主页)
				".feed-Sign-span",
				//登录弹窗
				".passport-login-container",
				//PC端:弹窗:学生认证
				"#csdn-highschool-window",
				//PC端:登录弹窗(固定)
				"#csdn-toolbar-profile-nologin",
				//PC端:登录弹窗(悬浮)
				//".passport-login-container",
			],
			fun: function () {
				/**
				 * PC端:屏蔽登录弹窗
				 * @param      {<list>}  mutationsList  The mutations list
				 * @param      {<observer>}  observer       The observer
				 */
				let removeLoginNotice = function (mutationsList, observer) {
					for (let mutation of mutationsList) {
						for (let node of mutation.addedNodes) {
							if (document.querySelector(".passport-login-container")) {
								//有登陆弹窗1时:模拟点击关闭按钮
								let button = node.querySelector("span");
								if (button) {
									if (LoginFlag == true) {
										button.click();
										return (LoginFlag = false);
									}
								}
							}
						}
					}
				};

				//是否拦截:默认拦截
				let LoginFlag = true;
				document.onreadystatechange = function () {
					if (document.readyState === "interactive") {
						let loginBtn = document.querySelector(".toolbar-btn-login>.toolbar-btn-loginfun");
						if (loginBtn) {
							//未登录:
							//添加事件,不拦截
							loginBtn.addEventListener("click", function () {
								LoginFlag = false;
							});
							//执行监听
							let observer = new MutationObserver(removeLoginNotice);
							observer.observe(document, { childList: true, subtree: true });
						}
					}
				};
			},
		},
		{
			name: "懂车帝",
			url: "dongchedi.com",
			items: [
				//顶部打开app
				".mui-btn-box.mui-btn-style_yellow_solid.mui-btn-S",
				//悬浮打开app
				".tw-flex.tw-items-center.tw-bg-color-primary.tw-text-color-gray-900.index_float-bar__lRIBk",
				//微信小程序打开
				".index_content__2KQhc",
			],
		},
		{
			name: "懂车帝",
			url: "dcdapp.com",
			items: [
				//悬浮打开app
				".new-open-app",
			],
		},
		{
			name: "今日头条",
			url: "toutiao.com",
			items: [
				".open",
				".top-banner-container-1709217739140",
				//悬浮打开app
				".float-activate-button",
			],
		},
		{
			name: "简书",
			url: "jianshu.com",
			items: [
				//下载弹窗
				".download-app-guidance",
				//悬浮按钮:打开App,看更多相似好文
				".call-app-btn",
				//悬浮按钮:打开App,看更多好文(首页)
				".index_call-app-btn",
			],
		},
		{
			name: "掘金",
			url: "juejin.cn",
			items: [
				//悬浮按钮:APP内打开
				".open-button",
				//下载弹窗
				".byte-drawer",
				//PC端:下方拓展弹窗
				".recommend-box",
			],
			overflow: true,
		},
		{
			name: "知乎手机版",
			url: "m.zhihu.com",
			items: [
				//悬浮按钮:打开知乎(主页),打开
				".OpenInAppButton",			],
		},
		{
			name: "知乎PC版",
			url: "www.zhihu.com/question",
			fun: function () {
				/**
				 * PC端:屏蔽登录弹窗
				 * @param      {<list>}  mutationsList  The mutations list
				 * @param      {<observer>}  observer       The observer
				 */
				let removeLoginNotice = function (mutationsList, observer) {
					for (let mutation of mutationsList) {
						for (let node of mutation.addedNodes) {
							if (node.querySelector(".signFlowModal")) {
								//有登陆弹窗1时:模拟点击关闭按钮
								let button = node.querySelector(".Button.Modal-closeButton.Button--plain");
								console.log(button);
								if (button) {
									if (LoginFlag == true) {
										button.click();
										return (LoginFlag = false);
									}
								}
							} else if (getXpath('//button[text()="立即登录/注册"]', node)) {
								//没有登录弹窗1时会出现弹窗2
								getXpath('//button[text()="立即登录/注册"]', node).parentElement.parentElement.remove();
							}
						}
					}
				};

				//是否拦截:默认拦截
				let LoginFlag = true;
				document.onreadystatechange = function () {
					if (document.readyState === "interactive") {
						let loginBtn = document.querySelector(".AppHeader-profile button");
						let loginCls = loginBtn.getAttribute("class").includes("Button");

						if (loginCls) {
							//未登录:添加事件,不拦截
							loginBtn.addEventListener("click", function () {
								LoginFlag = false;
							});
							//未登录:执行监听
							let observer = new MutationObserver(removeLoginNotice);
							observer.observe(document, { childList: true, subtree: true });
						}
					}
				};
			},
		},
		{
			name: "知乎专栏",
			url: "zhuanlan.zhihu.com/p/",
			fun: function () {
				/**
				 * PC端:屏蔽登录弹窗
				 * @param      {<list>}  mutationsList  The mutations list
				 * @param      {<observer>}  observer       The observer
				 */
				let removeLoginNotice = function (mutationsList, observer) {
					for (let mutation of mutationsList) {
						for (let node of mutation.addedNodes) {
							if (node.querySelector(".signFlowModal")) {
								//有登陆弹窗1时:模拟点击关闭按钮
								let button = node.querySelector(".Button.Modal-closeButton.Button--plain");
								console.log(button);
								if (button) {
									if (LoginFlag == true) {
										button.click();
										return (LoginFlag = false);
									}
								}
							} else if (getXpath('//button[text()="立即登录/注册"]', node)) {
								//没有登录弹窗1时会出现弹窗2
								getXpath('//button[text()="立即登录/注册"]', node).parentElement.parentElement.remove();
							}
						}
					}
				};

				//是否拦截:默认拦截
				let LoginFlag = true;
				document.onreadystatechange = function () {
					if (document.readyState === "interactive") {
						let loginBtn = document.querySelector(".ColumnPageHeader-profile button");
						let loginCls = loginBtn.getAttribute("class").includes("Button");

						if (loginCls) {
							//未登录:添加事件,不拦截
							loginBtn.addEventListener("click", function () {
								LoginFlag = false;
							});
							//未登录:执行监听
							let observer = new MutationObserver(removeLoginNotice);
							observer.observe(document, { childList: true, subtree: true });
						}
					}
				};
			},
		},
        {
			name: "百度",
			url: "www.baidu.com",
			items: [
				//搜索框下方信息流
				".tab_news",
			],
		},
		{
			name: "百度贴吧",
			url: "tieba.baidu.com",
			items: [
				//悬浮按钮:打开百度贴吧
				".nav-bar-bottom",
				".open-app",
				".tb-forum-user__join-btn",
				".nav-bar-bottom",
				".more-btn-desc",
				".more-image-desc-text",
				".more-image-desc",
				".only-lz",
				".recommend-title-open-app",
				".comment-box-content,DIV.comment-box",
				".btn-text",
				".btn-bg",
				".download-btn",
                ".nav-bar-wrap-defensive",
                ".fixed-nav-bar-defensive",
				".fix-nav-bar-bottom",
				".fix-nav-guide-bar",
				".tb-backflow-defensive__content",
				".post-page-entry-btn",
				".tb-backflow-defensive__mask",
			],
		},
		{
			name: "百度文库1",
			url: "/wk.baidu.com/view/",
			items: [
				//悬浮按钮(上方):百度文库
				".wk-student-defense",
			],
		},
		{
			name: "百度文库2",
			url: "tanbi.baidu.com/h5apptopic/browse/",
			items: [
				//悬浮按钮(上方):百度文库
				".wk-student-limit-jump",
				".bartop",
				//悬浮按钮(下方):下载App,继续阅读
				".wk-bottom-btn"
			],
		},
		{
			name: "百家号",
			url: "baijiahao.baidu.com/s",
			items: [
				//下载弹窗
				".layer-wrap",
				//悬浮按钮:xxx独家语音
				".undefined",
			],
		},
		{
			name: "百度资讯",
			url: "m.baidu.com/sf_baijiahao",
			items: [
				//悬浮按钮:xxx独家语音
				".undefined",
			],
		},
		{
			name: "百度资讯2",
			url: "mbd.baidu.com/newspage/data",
			items: [
				//悬浮按钮:百度APP内播放
				".drag-bottom",
			],
		},
		{
			name: "腾讯新闻文章查看",
			url: "view.inews.qq.com/",
			items: [
				//悬浮按钮:返回首页
				"[class^=downloader-floating-bar_floatingRight__]",
				"[class^=video-bottom-bar_newsOpen__]",
				//视频下方打开腾讯新闻app
				".main-video_downloaderMainVideo__tziBm",
                //打开腾讯新闻参与讨论
                ".new-hot-comment_subText__1v0fG",
				".title_subText__WQw8D",
                //顶部打开app
                ".slider-top-bar_sliderWrapper__1q9sd",
                //新闻下方打开app
                ".normal_buttonWrap__3xBdo",
				".normal_buttonWrap__S7gLr",
				".bottom-bar_buttonWrap__NXBe-",
                //相关推荐右边打开腾讯新闻查看更多
                ".article-recommend_subText__9pIl4",
				".new-recommend_subText__6dYXv",
			],
		},
		{
			name: "腾讯新闻首页",
			url: "xw.qq.com/",
			items: [
				//顶部广告
				".jsx-4292684899",
			],
		},
		{
			name: "腾讯视频",
			url: "v.qq.com",
			items: [
				//下载弹窗
				".at-app-banner",
				//打开APP查看高清内容
				".open_app_bottom",
				//底部打开APP看海量高清内容
				".at-app-banner__main-btn.at-app-banner--button",
				//右上角打开app
				".open-app",
			],
		},
		{
			name: "优酷视频",
			url: "youku.com",
			items: [
				//下载弹窗
				".callEnd_box",
				//悬浮按钮(主页):打开优酷APP更流畅
				".callEnd_fixed_box",
				//悬浮按钮:打开优酷APP更流畅
				".undefined",
				//悬浮按钮:红包
				".Corner-container",
				//预览播放中
				".clipboard",
			],
		},
		{
			name: "爱奇艺",
			url: "iqiyi.com/",
			items: [
				//下载弹窗
				".m-iqyGuide-layer",
				//打开爱奇艺APP,看精彩视频
				"[class^=ChannelHomeBanner]",
				//PC端:登录提示上侧
				".pl__1",
			],
		},
		{
			name: "好看视频",
			url: "haokan.baidu.com/",
			items: [
				//悬浮按钮:打开好看app(中间)
				".open-app-button",
				//固定文字:打开APP(多)
				".top-video-card-img-app",
				//固定按钮:下载APP(视频播放时)
				".video-player-download-tips",
				//固定按钮:打开(底部)
				".open-app-bottom",
				//PC端固定按钮:下载APP(视频暂停时)
				".player-lefttip-inner",
				//PC端登录提示:登录提示
				"#passport-login-pop",
				//PC端登录提示:朦胧背板
				".pop-mask",
			],
		},
		{
			name: "百度搜索",
			url: "m.baidu.com",
			items: [
				//搜索结果:小程序
				"[srcid=xcx_multi]",
				//搜索结果:百度手机助手
				"[srcid=app_mobile_simple]",
				//搜索结果:百度手机助手:安全下载
				"[srcid=app_mobile_simple_safety]",
				//搜索结果:百度应用搜索(IOS)
				"[srcid=app_mobile_ios]",
			],
		},
		{
			name: "哔哩哔哩",
			url: "bilibili.com",
			items: [
				//悬浮按钮:打开app,看你感兴趣的内容(主页)
				".m-home-float-openapp",
				//悬浮按钮:bilibili内打开
				".m-float-openapp",
				//悬浮弹窗:打开
				".openapp-dialog",
				//固定按钮：播放时下载
				".mplayer-widescreen-callapp",
				//顶部下载app
				".launch-app-btn.m-nav-openapp",
				//打开app
				".container",
				".launch-app-btn.m-video-main-launchapp.visible-open-app-btn natural-margin",
				//视频下方打开app
				".m-video2-awaken-btn",
				".launch-app-btn.m-video-main-launchapp.visible-open-app-btn.natural-margin",
				//播放页打开app
				".mplayer-widescreen-callapp",
				//播放页发弹幕
				".mplayer-comment-text-callapp.mplayer-comment-text",
				//播放页清晰度
				".mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-quality",
				//播放页倍速
				".mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-speed",
//播放页打开APP
".mplayer-widescreen-callapp",
				//PC端:登录提示(右下角)
				".lt-row",
				//PC端:登录提示(右上角)
				".login-panel-popover:has(.login-tip-content)",
				//pc端:播放器登录提示
				".bilibili-player-video-toast-bottom",
			],
		},
		{
			name: "B站文章",
			url: "bilibili.com/read/",
			items: [
				//悬浮按钮:打开App,看更多精彩内容
				".float-btn",
				//PC端:登录提示
				"div:has(.unlogin-popover-avatar)",
			],
		},
		{
			name: "丁香园",
			url: "3g.dxy.cn",
			items: [
				//悬浮按钮:APP内打开
				"[class^=fixedBtn]",
				//悬浮按钮:App内打开(主页)
				".wrap",
			],
		},
		{
			name: "微博",
			url: "m.weibo.cn",
			items: [
				//悬浮按钮:在微博内打开(百度热议)
				".app-btn-box",
				".to-weibo-btn",
				//悬浮按钮:登录/注册
				".login-btn",
				//小程序
				".wrap",
                //打开app
                ".m-banner m-panel",
                //顶部滚动
                ".woo-box--flex.is-align-center.news-item",
                ".woo-panel.woo-panel--bottom.module.news-banner",
				//顶部去下载微博
				".to-weibo-btn.to-weibo-btn2",
			],
		},
		{
			name: "新浪新闻",
			url: "sina.cn",
			items: [
				//悬浮按钮:打开APP
				".callApp_fl_btn",
				//顶部广告
				".j_sax",
				//中间广告
				".s_card_white_m",
				".s_card_sp_da",
                //图片下方打开app
                ".art_img_callUp.j_callST",
                //文章下方打开app
                ".ldy_art_bottom_button_boxj_callST",
                ".BUTTON.ldy_art_bottom_button",
			],
		},
		{
			name: "新浪财经主页",
			url: "finance.sina.cn",
			items: [
				//悬浮按钮:打开APP(主页)
				".m-sentiment-blk",
				//底部悬浮广告
				".m-client-call3",
				//顶部按钮：APP下载
				".client-down",
				".topLogoBar",
				".m-client-call2",
				//炒股开户（去除会影响其它网页图片加载）
				".link.link-optionalstock2",
			],
		},
		{
			name: "新浪财经",
			url: "cj.sina.cn",
			items: [
				//悬浮按钮:打开APP(顶部)
				//".m-sentiment-blk",
				//悬浮按钮:打开APP(底部)
				".m-guss-caijing",
				//悬浮按钮:去APP听语音播报
				".broadcast",
				//固定按钮:立即体验(底部)
				"#norm_qrcode_link_auto",
				//顶部悬浮广告
				".module-finance-client3",
				//顶部按钮：APP下载
				".client-down",
				//文章底部按钮：打开APP看更多精彩内容
				".unfold-words",
				//7x24小时快讯底部按钮：打开app，开启疫情速报
				".m-callup-client2",
				".m-callup-client-mask",
				//打开app看热榜话题
				".u-hot-news-name1",
				//热门评论上面广告
				".pic",
				// //固定按钮:打开APP,看最新信息(2)
				// "[class^=m-hot-subject]",
                //右上角APP下载
                ".hd_app_down",
                "#subPage_bottom_callup_btn",
				//".sw_c3",
				//".u-article-jump2",
				".broad44cast.js-voice",
			],
		},
		{
			name: "西瓜视频",
			url: "ixigua.com",
			items: [
				//打开弹窗:打开
				".landing_guide",
				//PC端:登录提示
				".loginBenefitNotification",
				//悬浮按钮:打开西瓜视频,看全网超清视频
				".xigua-download",
			],
		},
		{
			name: "抖音电脑版",
			url: "www.douyin.com",
			items: [
				//PC端:右上角登录提示
				".login-guide-container",
				//PC端:登陆后查看评论
				".recommend-comment-login",
				//PC端:登录提示
				".login-mask-enter-done",
			],
		},
		{
			name: "电子发烧友",
			url: "m.elecfans.com",
			items: [
				//悬浮按钮:主页右侧
				".hm_quick",
				//悬浮按钮:登陆/注册
				".login-reg-fixed",
				//悬浮按钮:上方打开app
				".open_app",
			],
		},
		{
			name: "人民网",
			url: "app.people.cn",
			items: [
				//悬浮按钮:打开(底部)
				".app-bot-wrap",
			],
		},
		{
			name: "新京报",
			url: "m.bjnews.com.cn/detail/",
			items: [
				//悬浮按钮:立即打开(顶部)
				".xjb-top",
			],
		},
		{
			name: "观察者网",
			url: "guancha.cn",
			items: [
				//固定按钮:点击下载(顶部)
				".g_header44",
				//悬浮按钮:APP专享(底部)
				".g_swiper_container",
			],
		},
		{
			name: "澎湃新闻",
			url: "m.thepaper.cn/newsDetail_forward",
			items: [
				//悬浮按钮:新闻滚条(底部)
				"[class^=index_footer_banner]",
				"[.index_footer_banner__Mcr_R]",
			],
		},
		{
			name: "凤凰新闻",
			url: "ifeng.com",
			items: [
				//悬浮按钮:立即打开(主页)
				"[class^=fixSlide-]",
				//悬浮按钮:滚动新闻(底部)
				"[class^=bottom_box-]",
				//固定按钮:立即打开(财经顶部)
				"[class^=header-]",
				//固定按钮:过去24小时...(财经顶部)
				"[class^=headerIn-]",
				//悬浮按钮:滚动新闻(财经底部)
				"[class^=fixBottom-]",
			],
		},
		{
			name: "手机网易新闻",
			url: "m.163.com",
			items: [
				//固定按钮：App内打开(底部)
				".backflow-floating",
				//新闻右侧打开app
				".s-openApp",
				".floatMenu-logo",
				//顶部广告
				".area-card",
				//中间广告
				".app",
				//图片下方打开app
				".s-tip",
				//打开网易新闻体验更加
				".main-openApp",
				//热门跟帖-打开APP发帖
				".js-open-app",
			],
		},
		{
			name: "网易新闻",
			url: "c.m.163.com",
			items: [
				//固定按钮：App内打开(底部)
				".backflow-floating",
				//新闻右侧打开app
				".s-openApp",
				".floatMenu-logo",
				//顶部广告
				".area-card",
				//中间广告
				".app",
				//图片下方打开app
				".s-tip",
				//打开网易新闻体验更加
				".main-openApp",
				//热门跟帖-打开APP发帖
				".js-open-app",
                //悬浮打开APP
                ".fixedOpenNewsapp",
                ".slider-footer.js-bottom-slider.js-open-newsapp",
                //顶部打开APP
                ".js-top-container.logoTop",
                ".logoTop",
                //网易热闻
                ".hotSlider",
                //图片下方打开app
                ".u-tip",
                //文章下方打开app
                ".openNewsapp",
                ".related-foot.js-open-newsapp",
                //文章下方赞数
                ".action",
                //讨论
                ".comment-footer-btn.js-open-newsapp",
                //文章下方广告
                ".comment-top.js-comment-top-box",
                ".ad.js-ad",
                //底部logo
                ".logoBottom.js-bottom-container",
                //网易热搜-打开应用，查看全部
                ".s-more",
                //打开应用查看
                ".js-operation",
                ".js-open-newsapp",
                //底部打开app
                ".widget-slider.widget-slider-article.bottom",
			],
		},
		{
			name: "网易新闻",
			url: "3g.163.com",
			items: [
				//固定按钮：App内打开(底部)
				".backflow-floating",
				//新闻右侧打开app
				".s-openApp",
				".floatMenu-logo",
				//顶部广告
				".area-card",
				//中间广告
				".app",
				//图片下方打开app
				".s-tip",
				//打开网易新闻体验更加
				".main-openApp",
				//热门跟帖-打开APP发帖
				".js-open-app",
			],
		},
		{
			name: "虎嗅",
			url: "m.huxiu.com",
			items: [
				//悬浮按钮:go!(主页)
				".guide-wrap",
				//悬浮按钮:打开(顶部)
				".js-top-fixed",
			],
		},
		{
			name: "虎扑",
			url: "m.hupu.com",
			items: [
				//悬浮按钮:App内打开
				".open-hupu",
				".hupu-footer-btn",
				".tabs-component-search-app",
			],
		},
		{
			name: "豆瓣",
			url: "m.douban.com/",
			items: [
				//固定按钮:用App打开(电影详情页)
				".subject-banner",
				//打开app
				".baidu-openapp",
				//打开app写短评
				".write-comment",
				//打开app查看全部预告片
				".app-link",
			],
		},
		{
			name: "太平洋电脑",
			url: "g.pconline.com.cn",
			items: [
				//悬浮按钮:打开app(底部)
				".btnForAppOpenImg",
				//悬浮按钮:打开知科技App
				".btnForAppOpenA",
				//固定按钮:立即打开(底部)
				".WakeUptop",
			],
		},
		{
			name: "中关村在线",
			url: "m.zol.com.cn",
			items: [
				//悬浮按钮:打开APP
				".cover-back_s",
				//悬浮按钮:APP内打开
				"#bottom-fixed-wrapper > span",
                //手机页面上方京东广告
                ".dingtong",
                //打开APP
                ".app-open",
			],
		},
		{
			name: "中关村在线2(报价+论坛)",
			url: "wap.zol.com.cn",
			items: [
				//悬浮按钮:打开APP
				".cover-back_s",
				//悬浮按钮:APP内打开
				"#bottom-fixed-wrapper > span",
                ".sg_hide_element",
                ".dingtong",
                ".app-open",
			],
		},
		{
			name: "汽车之家PC版",
			url: "www.autohome.com.cn",
			items: [
				//悬浮按钮:登录提示(PC端)
				"#loginGuide",
			],
		},
		{
			name: "汽车之家移动版",
			url: "m.autohome.com.cn",
			items: [
				//悬浮按钮: App内打开
				"#float_new_button",
			],
		},
		{
			//www.taptap.com
			name: "taptap",
			url: "www.taptap.cn",
			items: [
				//悬浮按钮:打开taptap
				".open-app-button",
			],
		},
		{
			//m.taptap.com
			name: "taptap",
			url: "m.taptap.cn",
			items: [
				//悬浮按钮:打开taptap查看更多精彩内容
				".app-download__wrapper",
				//苹果端:悬浮按钮:添加到桌面
				".show-add-to-screen",
				//苹果端:固定按钮:添加到桌面
				".add-to-screen-wrap",
			],
		},
		{
			name: "半月谈",
			url: "m.banyuetan.org",
			items: [
				".footer:nth-child(5) > p.link:first-child > a:nth-child(3)",
				".top-bar",
				".float-layer",
			],
		},
		{
			//https://m.ithome.com/
			name: "it之家",
			url: "m.ithome.com",
			items: [
				//固定按钮(底部):立即打开
				".open-app-banner",
				".open-app-banner",
				".op",
				".open-app-a",
				".grade",
				".grade-assess",
				".bdsharebuttonbox.get-codes-bdshare.bdshare-button-style0-32",
				".hot-app",
				".bdsharebuttonbox.get-codes-bdshare",
				".close",
				".no-show-comment",
                //辣品
                ".brand-column-item.brand-column-lapin",
			],
		},
		{
			//https://*.quark.cn/
			name: "夸克专题",
			url: "quark.cn",
			items: [
				//固定按钮(底部):立即打开
				".reflow-img",
                ".btn",
			],
		},
        {
			//https://quark.sm.cn/
			name: "夸克搜索广告",
			url: "quark.sm.cn",
			items: [
				//固定按钮(底部):立即打开
				//".cpc-card",
                //".com-cpc-card",
			],
		},
		{
			//PC版:http://www.360doc.com/content/20/0717/15/60244337_924865821.shtml
			name: "360docPC版",
			url: "www.360doc.com/content/",
			items: [
				//登录弹窗
				"iframe",
				//登录弹窗:朦胧模板
				"iframe~div",
			],
		},
		{
			name: "开源中国",
			url: "www.oschina.net",
			items: [
				//悬浮按钮(底部):立即打开
				".app-download-banner-box",
			],
		},
		{
			//https://m.36kr.com/p/1964588951470856
			name: "36氪",
			url: "m.36kr.com/p/",
			items: [
				//悬浮按钮(顶部):打开
				".article-top-swiper-goapp",
			],
		},
		{
			//https://www.xiaohongshu.com/discovery/item/636cbbc1000000001c03c332
			name: "小红书",
			url: "www.xiaohongshu.com",
			items: [
                ".cube-z-bottom-bar",
                //文章下方打开APP
                ".reds-box.block.button-bottom-bar.widen-bar",
                //顶部打开APP
                ".reds-box.y-middle.flex.block.winkblank-padding.nav-bar",
            ],
        },
	];

	/**
	 * 主体部分
	 */
	for (let website of websites) {
		if (location.href.indexOf(website.url) != -1) {
			//隐藏/拦截骚扰元素
			if (website.items) {
				for (let item of website.items) {
					let css = document.createElement("style");
					css.innerText += item + "{display: none !important}";
					document.head.appendChild(css);
				}
			}
			//修复移动版页面不允许滑动
			if (website.overflow) {
				let cssVlaue = document.createElement("style");
				cssVlaue.innerText = "body{overflow: unset !important}";
				document.head.appendChild(cssVlaue);
			}
			//执行额外方案
			if (website.fun) {
				website.fun();
			}
		}
	}

	/**
	 * 通过内容(xpath)获取节点
	 *
	 * @param      {<string>}  xpath   内容
	 * @param      {<Node>}  parent  父元素
	 * @return     {<Node>}  元素
	 */
	function getXpath(xpath, parent) {
		let xpathResult = document.evaluate(xpath, parent || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		return xpathResult.singleNodeValue;
	}

    //附加执行功能，执行下方removeAds()功能
    window.addEventListener("scroll", function() {
    	removeAds();
    })

})();


function removeAds() {
	//it之家去广告条目
	var spans = $("span[class='tip-suggest']");
	spans.each(function() {
		$(this).closest("div.placeholder").remove();
	});
	var spans2 = $("span[class='tip tip-gray']");
	spans2.each(function() {
		$(this).closest("div.placeholder").remove();
	});
	//新浪财经去广告条目
	var spans3= $("span[class='sign']");
	spans3.each(function() {
		$(this).closest("span[class='sign']").remove();
	});
}