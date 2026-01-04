// ==UserScript==
// @name         B站|bilibili 分P视频详情页优化
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAyZJREFUaEPtWlFy2jAQ3XXof5pewJkpmekpAidJ+IQeAnKIwifkJDin6EzoTNwDlOYA4O2sVIEsFFuSkQdm8CfI0r6VdvftkxHO/MEQ+7/8eH3cJtvsffgtD3nf9s71bNV7H3Yz3/m8AdzMVmMgmPBCBW5um4K4nv1MkTpzBOgBwmQ97D75gPAHMH19A8BULdIEBBufUOdtbzDl69HdbVQActGrZVMQh8bzjkLf9xh57wB7xwYCiQZ/vt8tXLx3LON5rSAATUBwsCYESx1oiOfV+8EAQkAcGk95gTjwPTY6+AMAYhHAByJKEWgXrNVHYx/Uchx9kF7NcXIsAdamY0TICtg8m1mvBODzdLUU6eyEHzPWdgDOwfidX7V6IQDoxemEnV827T8ItKW0cwHBRRQ/8j6fNeY7pwGmkyZEc714ihpANMCb2a85ED2WDfUv6bGB2uoHIC7QGrwBpCo2ABGr0xXp6xBAdgHQhufVGpcdqPK2T5fGqRugkwJscp+G6Gg7wMYKFpMk90BFT6U3V0qtp24ORJESBdeBlypQwQBEsYNPY91Y624gLtbDr4O6uKiv/JLgEW4G+g41A1Bq/ewmsjf/jrr9OgCuvGu96pbIZjAAmYPLvXDJSMQF02Is6LdLVyYpO9wTQU9SdjvNNvvjZgBExS56gEmGRfGyTZjD+wVh1c4cgBLHsaxQNAJQdyza+P8CoA0vV61x2YGQHeCi55KZXOaOvgMmnVAFS5cfFY0IkVKiAmDjCXEu6gHBk6QZWqOEMOE6IceECcNRAezFATZaFSbKuW6YFMSVM5nHKjoAXlAVJPa2ukNQvwnPW8Qpl/N/6chcvRRzXCtHqE0AImFYZRVHXh/TWHNuqwDHmW2f/kqCRV7gtu/T7sUGY22CGEAV1xe6C9ZL37GNl1K/qZpL8e38xV3lPbvEGNu3YfPrrWu557TqpGGLxHrL7LutV0xIMG73poavpA77YiW5sDM4FgugZ5MEOl3yWZVhOJ6Cbc2EjgKzEwBbpmpyNWo7Xqbq4foFgDMARdSuCkqP/aGHnJvFs86DTgJd4sgLgMuEbY/5B0Ybna/xpe4TAAAAAElFTkSuQmCC
// @namespace    https://sumver.cn
// @version      1.5.0
// @description  调整bilibili 分P视频合集列表，支持合集高度调整（可自适应，也可手动），支持合集标题、视频标题换行显示，支持宽屏显示更多，支持竖屏超长合集显示等等
// @author       lonelylizard
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490676/B%E7%AB%99%7Cbilibili%20%E5%88%86P%E8%A7%86%E9%A2%91%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/490676/B%E7%AB%99%7Cbilibili%20%E5%88%86P%E8%A7%86%E9%A2%91%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 样式处理
const setStyle = function (css) {
	let css_list = css.split("}")
	css_list.forEach((item, index, array) => {
		GM_addStyle(item + "}")
	});
}

// 使用次数统计功能
let usageCount = GM_getValue("usage_count", 0);

// 增加使用次数并保存
function incrementUsageCount() {
    usageCount++;
    GM_setValue("usage_count", usageCount);
}

// 控制菜单

// 使用次数统计菜单
const menu_usage_count = GM_registerMenuCommand("使用次数："+usageCount, function () {
    alert(`该脚本被使用次数: ${usageCount}次`, function() {
    });
});

// 视频列表标题换行开关
const menu_title_wrap_status = GM_registerMenuCommand("【1】视频列表标题换行开关", function () {
	let cur_choose = window.confirm("使得右侧视频合集支持标题换行显示\n当前状态:\n" + (GM_getValue("title_wrap_status") === true ? "已开启" : "已关闭") +
		"\n\n按【确认】修改状态，按【取消】保持设置不变\n\n设置后请手动刷新一次网页");
	if (cur_choose) {
		if (GM_getValue("title_wrap_status")) {
			GM_setValue("title_wrap_status", false)
		} else {
			GM_setValue("title_wrap_status", true)
		}
	}
});

// 宽屏适配开关
const menu_widescreen_status = GM_registerMenuCommand("【2】宽屏适配开关", function () {
	let cur_choose = window.confirm("当前宽屏适配状态:\n" + (GM_getValue("widescreen_status") === true ? "已开启" : "已关闭") +
		"\n\n按【确认】修改状态，按【取消】保持设置不变\n注：只有在【视频合集宽度调整】未开启或设置为0时，宽屏模式才会生效\n设置后请手动刷新一次网页\n 开启该功能后，与B站视频播放器右下角的【宽屏模式】【网页全屏】会有冲突导致画面展示有可能混乱，请不要同时使用");
	if (cur_choose) {
		if (GM_getValue("widescreen_status")) {
			GM_setValue("widescreen_status", false)
		} else {
			GM_setValue("widescreen_status", true)
		}
	}
});

// 视频合集列表比例调整开关
const menu_area_ratio = GM_registerMenuCommand("【3】视频合集列表宽度调整", function () {
	let area_ratio_prompt = window.prompt("输入0.5表示视频列表占屏幕一半，输入0.25表示占屏幕1/4，\n当前比率:\n" + (GM_getValue("area_ratio") != 0 && typeof (GM_getValue(
		"area_ratio")) != 'undefined' ? GM_getValue("area_ratio") : "未设置") +
		"\n\n按【确认】修改状态，按【取消】保持设置不变\n如设置导致页面混乱，请输入0还原页面\n\n注意：该功能开启时，宽屏模式会自动关闭\n设置后请手动刷新一次网页\n 开启该功能后，与B站视频播放器右下角的【宽屏模式】【网页全屏】会有冲突导致画面展示有可能混乱，请不要同时使用");
	if (typeof (Number(area_ratio_prompt)) === 'number') {
		if (area_ratio_prompt.toString()
			.split('.')
			.pop()
			.length <= 2) {
			GM_setValue("area_ratio", area_ratio_prompt)
		}
	}
});

// 自定义视频合集列表高度
const menu_right_content_height = GM_registerMenuCommand("【4】自定义视频合集列表高度", function () {
	let area_height_ratio_prompt = window.prompt("输入0.5表示占列表区域高度占屏幕高度一半，输入0.8表示占屏幕高度80%，\n当前比率:\n" + (GM_getValue("area_height_ratio") != 0 && typeof (GM_getValue(
		"area_height_ratio")) != 'undefined' ? GM_getValue("area_height_ratio") : "未设置") +
		"\n\n按【确认】修改状态，按【取消】保持设置不变\n如设置导致页面混乱，请输入0还原页面\n\n注意：设置的高度不包含标题，所以假如你希望右侧高度有一半用来显示推荐视频，那么设置值大概为0.3");
	if (typeof (Number(area_height_ratio_prompt)) === 'number') {
		if (area_height_ratio_prompt.toString()
			.split('.')
			.pop()
			.length <= 2) {
			GM_setValue("area_height_ratio", area_height_ratio_prompt)
		}
	}
});

// 小窗尺寸设置开关
const miniwin_status = GM_registerMenuCommand("【5】小窗尺寸设置", function () {
	window.prompt("小窗功能已从本脚本移除，升级为全站小窗设置脚本，如有需要请手动复制以下的链接前往查看","https://greasyfork.org/zh-CN/scripts/494837")
});

// 重置脚本，删除所有设置，防止先后版本逻辑错误导致的设置不生效或出现错误的问题
const reset_btn = GM_registerMenuCommand("【6】重置脚本全部设置", function () {
	let cur_choose = window.confirm("重置该脚本的所有设置，通常只有在脚本运作发生混乱的情况下使用。\n\n注意：这也会清除使用次数统计！");
	if (cur_choose) {
		const keys = GM_listValues();
		keys.forEach(element => {
			GM_deleteValue(element);
		});
	}
});





(function () {
	'use strict';

    // 修改简介样式，使得其有清晰的边框易于区分、阅读
    let profile_css = function () {
        const style = document.createElement('style');
        style.textContent = `
            /* 弹窗容器 */
            .pod-description-popover {
                background-color: #FFF !important;
                border: 1px solid #bae7ff !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
                padding: 12px !important;
                max-width: 300px !important;
                font-size: 14px !important;
                color: #1890ff !important;
                z-index: 99999 !important;
            }

            /* 弹窗内容文本 */
            .pod-description-dropdown {
                margin: 0 !important;
                padding: 0 !important;
                line-height: 1.5 !important;
                color: #333 !important;
                text-align: left !important;
            }
        `;
        document.head.appendChild(style);
    }
    profile_css()
	// 屏蔽广告
	let no_ad_fn = function () {

		let css =
			`#slide_ad {
            display: none
        }
        /* 去除右侧广告 */
        .ad-report {
            display: none !important;
            min-width: 0px !important;
            min-height: 0px !important
        }
        /* 去除简介下广告 */
        #activity_vote {
            display: none !important
        }
        /* 去除右下角直播窗口 */
        .pop-live-small-mode {
            display: none !important
        }
        /* 去除右侧游戏广告卡片 */
        .video-page-game-card-small {
            display: none !important
        }
        /* 去除视频下方的广播广告 */
        .reply-notice {
            display: none !important
        }`

		setStyle(css)
	}

	no_ad_fn()

    /* 由于GM_addStyle插入处理视频-子视频双重聚焦问题时代码不生效（没细看源代码，基本就是节点是动态插入导致的）
    改为直接全局插入节点，同时处理白天黑夜模式 */
    let add_focus_for_subvideo = function () {
        const style = document.createElement('style');
        style.textContent = `
            .night-mode .simple-base-item.sub:hover {
                background: rgba(101, 120, 124, 1) !important  
            }
            
            html:not(.night-mode) .simple-base-item.sub:hover {
                background: #CFCFCF !important
            }`
        document.head.appendChild(style);
    };

    add_focus_for_subvideo()

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutations) => {
        const targetElement = document.querySelector('.video-pod__body');
        if (targetElement) {
            fn1();
            // 当找到目标元素后停止观察
            // observer.disconnect();
        }
    });

    // 配置观察选项:
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    };

    // 选择需要观察变动的节点
    const targetNode = document.body;

    // 开始观察目标节点
    observer.observe(targetNode, config);

    // 开始之前检查元素是否已经存在
    const existingElement = document.querySelector('.video-pod__body');
    if (existingElement) {
        observer.disconnect(); // 如果元素已经存在，则不需要继续观察
    }

    /* 新增功能：适配B站自己的黑夜模式 */
    function observeHtmlClassChanges() {
        const htmlElement = document.documentElement;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const currentClass = htmlElement.className;
                    const hasNightMode = currentClass.includes('night-mode');

                    // 处理黑夜模式样式，白天模式样式
                    if (hasNightMode) {
                        let css =
                            `
                                /* 普通视频合集、带分类视频合集 */
                                .video-pod .video-pod__header .header-top .left .title{
                                    display:unset !important
                                }
                                .pod-item.simple:hover{
                                    background:rgb(136, 153, 156);
                                    border-radius: 4px !important
                                }
                                /*去除蓝色字体*/
                                .single-p:hover,.title-txt,.single-p:hover .title{
                                    color:#000 !important
                                }

                                /* 分P视频合集 */
                                .simple-base-item.normal:hover{
                                    background: #434d4f;
                                    border-radius: 4px !important
                                }
                                .simple-base-item.normal:hover .title .title-txt{
                                    color:rgb(7, 7, 7) !important
                                }
                                /* 带封面的视频合集、带封面且带分类的视频合集 */
                                .pod-item.normal:hover{
                                    background: #DCE2E3;
                                    border-radius: 4px !important
                                }
                                .simple-base-item.normal.active{
                                    background:#d2d7e1 !important
                                }
                                .simple-base-item .title .title-txt{
                                    color: #fffafa !important
                                }
                                .pod-item.simple:hover .simple-base-item .title .title-txt{
                                    color:rgb(0, 0, 0) !important
                                }
                                .simple-base-item.normal.active .title .title-txt{
                                    color:rgb(0, 0, 0) !important
                                 }
                                /* 黑夜模式下，视频->子视频类型的双重聚焦效果改善 */
                                 .pod-item.simple:hover .simple-base-item.sub.active{
                                    background:rgba(159, 178, 182, 1) !important
                                 }
                                /* 黑夜模式下，自定义视频合集聚焦（如UP主首页-播放全部*/
                                .singlep-list-item-inner:hover{
                                    background: #434D4F;
                                    border-radius: 6px !important;
                                }
                            `
                            setStyle(css)
                    } else {
                        let css =
                        `
                            /* 普通视频合集、带分类视频合集 */
                            .video-pod .video-pod__header .header-top .left .title{
                                display:unset !important
                            }
                            .pod-item.simple:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important
                            }
                            /*去除蓝色字体*/
                            .single-p:hover,.title-txt,.single-p:hover .title{
                                color:#000 !important
                            }

                            /* 分P视频合集 */
                            .simple-base-item.normal:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important

                            }
                            .simple-base-item.normal:hover{
                                color:#000 !important
                            }
                            /* 带封面的视频合集、带封面且带分类的视频合集 */
                            .pod-item.normal:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important
                            }

                            .simple-base-item.normal.active{
                                    background:#FFF !important
                                }
                            .simple-base-item .title .title-txt{
                                color:rgb(7, 7, 7) !important
                            }
                            .pod-item.simple:hover .simple-base-item .title .title-txt{
                                color:rgb(0, 0, 0) !important
                            }
                            .simple-base-item.normal.active .title .title-txt{
                                color:rgb(0, 0, 0) !important
                                }
                            /* 白天模式下，视频->子视频类型的双重聚焦效果改善 */
                            /* 白天模式下的聚焦效果不用额外处理，这里注释只是备忘 *
                        `
                    	setStyle(css)
                    }
                }
            });
        });

        observer.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['class', 'lang'],
            attributeOldValue: true
        });

        return observer;
    }


	// 2024-10月B站对页面逻辑进行了改写，现在不需要区分那么多类型的合集了
	let fn1 = function () {
        
        
        if (document.querySelector(".video-pod")) {
            if (document.querySelector(".video-pod__body")) {

                    // 增加使用次数统计
                    incrementUsageCount()

                    change_title_wrap("fn1")

                    let list_height = document.querySelector(".video-pod__list")
                        .scrollHeight;
                    let res_height = window.innerHeight;
                    let right_content_top_heigt = document.querySelector(".video-pod__body")
                        .offsetTop;
                    let right_content_head = document.querySelector(".video-pod__header").offsetHeight;
                    let dif_height = res_height - right_content_top_heigt -80;

                    // 初始化，如果存在按用户设置的高度值，则优先使用用户设置，否则则给默认值
                    let list_max_height
                    if(GM_getValue("area_height_ratio") && GM_getValue("area_height_ratio") != 0){
                        list_max_height = Math.round(res_height*GM_getValue("area_height_ratio"))
                    }else{
                        list_max_height = 1000
                    }

                    // 判断小节是否展开
                    let viewpoint_status = false
                    if (document.querySelector(".bpx-player-viewpoint")) {
                        if (document.querySelector(".bpx-player-viewpoint")
                            .getAttribute('fold') == 'true') {
                            viewpoint_status = true
                        }
                    }
                    // 没有字幕插件、没有小节，那就正常显示
                    if (!document.querySelector(".transcript-box") && viewpoint_status == false) {
                        if (list_height > dif_height) {
                            // 计算列表高度，如果达不到一屏就不铺满
                            let css =
                                `.video-pod__body {
                                            height: ${dif_height}px !important;
                                            max-height: ${list_max_height}px !important
                                        }`
                            setStyle(css)
                        } else {
                            // 如果高度小于一屏，同时开始换行功能，会导致高度不正确，这里修改为去除高度属性，让其自适应
                            let css =
                                `.video-pod__body {
                                            height: unset !important;
                                            max-height: ${list_max_height}px !important
                                        }`
                            setStyle(css)

                        }
                    } else {
                        // 兼容脚本：在侧边显示 Bilibili 视频字幕/文稿(原始版)
                        // 兼容小节列表
                        if (list_height > res_height) {
                            let css =
                                `.video-pod__body {
                                            height: ${res_height - 280}px !important;
                                            max-height: ${list_max_height}px !important
                                        }`
                            setStyle(css)
                        } else {
                            let css =
                                `.video-pod__body {
                                            height: unset !important;
                                            max-height: ${list_max_height}px !important
                                            border-width:2px !important
                                        }`
                            setStyle(css)
                        }
                    }
                    // 兼容 Bilibili Evolved中的黑夜模式，检测到开启了黑夜模式则禁用样式，避免合集字体一片黑
					// 兼容 bewlybewly插件，如果检测到bewlybewly的样式则禁用自己的样式，不然会出现样式混乱
					if (!document.querySelector("#dark-mode-important") && !document.documentElement.classList.contains("bewly-design")) {
						let css =
                        `
                            /* 普通视频合集、带分类视频合集 */
                            .video-pod .video-pod__header .header-top .left .title{
                                display:unset !important
                            }
                            .pod-item.simple:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important
                            }
                            /*去除蓝色字体*/
                            .single-p:hover,.title-txt,.single-p:hover .title{
                                color:#000 !important
                            }

                            /* 分P视频合集 */
                            .simple-base-item.normal:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important
                            }
                            .simple-base-item.normal:hover{
                                color:#000 !important
                            }
                            /* 带封面的视频合集、带封面且带分类的视频合集 */
                            .pod-item.normal:hover{
                                background: #DCE2E3;
                                border-radius: 4px !important
                            }
                            .normal-base-item.normal{
                                padding: 0px 2px 0px 0px !important;
                            }
                        `
                    	setStyle(css)
					}
            }
        }

	};


	// 宽屏适配+自定义设置比率
	let change_right_width = function (source) {

		// 如果有自定义比率，则优先使用
		if (GM_getValue("area_ratio") && GM_getValue("area_ratio") != 0) {

			let body_width = document.querySelector("#app")
				.offsetWidth;
			let res_width = window.innerWidth;
			var dif_width = Math.round(res_width * GM_getValue("area_ratio"));

			let player_banner_height = document.querySelector(".bpx-player-sending-bar")
				.offsetHeight;

			// 播放全部视频合集和普通无合集视频，一起调整
			if (document.querySelector(".playlist-container--left")) {
                let css =
                    `
                    @media (min-width: 1681px) {
                        .playlist-container .playlist-container--right {
                            width: ${dif_width}px !important;
                        }
                    }
                    .playlist-container .playlist-container--right{
                        width: ${dif_width}px !important;
                    }

                    `
				setStyle(css)

			}
            // 专栏视频合集
            if (document.querySelector(".left-container")) {
                let css =
                    `
                    @media (min-width: 1681px) {
                        .video-container-v1 .right-container {
                            width: ${dif_width}px !important;
                        }
                    }

                    .video-container-v1 .right-container{
                        width: ${dif_width}px !important;
                    }
                    `
				setStyle(css)

			}
		} else if (GM_getValue("widescreen_status")) {
			let body_width = document.querySelector("#app")
				.offsetWidth;
			let res_width = window.innerWidth;

			if (res_width - 100 > body_width) {
				//带鱼屏
				let left_div = document.querySelector(".left-container")
					.offsetWidth;
				let right_div = document.querySelector(".right-container")
					.offsetWidth;
				var dif_width = (body_width - (left_div + right_div)) + right_div - 100;
			} else {
				//非带鱼屏
				let left_div = document.querySelector(".left-container")
					.offsetWidth;
				let right_div = document.querySelector(".right-container")
					.offsetWidth;
				var dif_width = (res_width - (left_div + right_div)) + right_div - 80;
			}

			// 没有参数即为普通视频页
			if (!source) {
				let css = `.right-container {
                            width: ${dif_width}px !important
                            }`
				setStyle(css)
			}
		}

	}

	// 支持自定义视频合集（如UP空间-播放全部、收藏夹-播放全部）
	let no_videos_list_change_right_width = function () {
		if (document.querySelector(".playlist-container--left")) {
            // ; console.log("自定义视频合集-元素存在");
			// 计算列表高度，如果达不到一屏就不铺满
			let list_height = document.querySelector(".action-list-inner")
				.scrollHeight;
            console.log("自定义合集全列表真实高度=",list_height)
			let res_height = window.innerHeight;
			var right_content_top_heigt = document.querySelector(".action-list-container")
				.offsetTop;
			var dif_height = res_height - right_content_top_heigt - 103;

			if (!document.querySelector(".transcript-box")) {
				if (list_height > dif_height) {
					let css =
						`#playlist-video-action-list-body {
                            max-height: 1000px !important
                        }
                        #playlist-video-action-list{
                            max-height:${dif_height}px !important
                        }`
					setStyle(css)
				} else {
					let css =
						`.action-list-container {
                                    height: unset !important;
                                    max-height: 1000px !important
                                }
                                #playlist-video-action-list-body,#playlist-video-action-list{
                                    max-height: 1000px !important
                                }`
					setStyle(css)
				}
			} else {
				// 兼容脚本：在侧边显示 Bilibili 视频字幕/文稿(原始版)
				if (list_height > res_height) {
					let css =
						`.action-list-container {
                                    height: ${res_height - 280}px !important;
                                    max-height: 1000px !important
                                }`
					setStyle(css)
				} else {
					let css =
						`.action-list-container {
                                    height: unset !important;
                                    max-height: 1000px !important
                                }`
					setStyle(css)

				}
			}
			if (!document.querySelector("#dark-mode-important") && !document.documentElement.classList.contains("bewly-design")) {
				let css =
							`
                            /* 2025-11-22发现聚焦失效了，修复代码如下 */
                            .singlep-list-item-inner:hover{
                                background: #DCE2E3;
								border-radius: 6px !important;
                            }
                            .singlep-list-item-inner{
                                padding: 0px 2px 0px 0px !important;
                                border-radius: 6px !important;
                            }
                            .singlep-list-item-inner.siglep-active{
                                background:#FFF !important;
                            }
							.singlep-list-item-inner.siglep-active .main .info .title, .singlep-list-item-inner:hover .main .info .title {
								color: #000
							}
                            `
				setStyle(css)
			}
		}else{
            // ; console.log("非自定义视频合集-元素不存在");
        }
	}

	// 非视频合集的播放页这次自定义比例、宽屏模式
	let support_no_video_list = function () {
		if (GM_getValue("no_videos_list_support_status")) {
			change_right_width()
		}
	}

	// 视频合集换行功能，不限制标题行数
	let change_title_wrap = function (source) {
		if (GM_getValue("title_wrap_status")) {
			if (source == "fn1") {
                let css =
                    `   .simple-base-item .title{
                            height:unset !important;
                            margin:4px
                        }
                        .simple-base-item .title .title-txt {
                            display: block; /* 更改 display 属性以适应自动换行 */
                            overflow: hidden;
                            word-break: normal;
                            line-break: anywhere;
                            line-height: normal;
                            white-space: normal; /* 允许自动换行 */
                        }
                    `
				setStyle(css)
			}
		}
	}

	// 小节处理函数
	let chapter_dispose = function () {
		let res_height = window.innerHeight;
		let css =
			`
            .bpx-player-viewpoint-body{
                max-height:${res_height - 280}px;
                height:min-content !important
            }
            li.bpx-player-viewpoint-menu-item:hover{
                background: #DCE2E3 !important
            }
            li.bpx-player-viewpoint-menu-item:hover .bpx-player-viewpoint-menu-item-content{
                color: #000 !important
            }
            .bpx-player-viewpoint-menu-item-content :has(.bpx-player-viewpoint-menu-item-active{
                color:#00a1d !important
            }
            `
		setStyle(css)
	}

	// 小窗处理函数
	const mini_win_fn = function () {
		// 如果用户使用过小窗，则给予弹窗提醒
		let reg1 = new RegExp(".","g")
		let version_str = GM_info.script.version.replace(reg1,"");
		if(!GM_getValue("mini_status")){
			if (GM_getValue("mini_height") != 0 && typeof (GM_getValue("mini_height"))!= 'undefined' && version_str <= 133) {
				let num = window.prompt("小窗功能已从本脚本移除，升级为全站小窗设置脚本，如有需要请手动复制以下的链接前往查看","https://greasyfork.org/zh-CN/scripts/494837")
			}
			GM_setValue("mini_status",true)
		}

	}

	// 超竖屏支持
	// 竖屏下，阿B原来的最小宽度适配是width=1080px，但是这会在实际1080P分辨率屏幕下内容向右溢出，此处调整为1000px修复该问题
	const support_portrait_fn = function () {
		let css = `#mirror-vdcon{
                        min-width:1000px !important
                    }`
		setStyle(css)
	}

	// 统一调用入口
	let run = function () {
		fn1();
        change_right_width();
		chapter_dispose();
		mini_win_fn();
		support_no_video_list();
		no_videos_list_change_right_width();
		support_portrait_fn()
	}

	run()

	// 窗口大小变化时重新计算
	const getWindowInfo = () => {
		run()
	};
	const debounce = (fn, delay) => {
		let timer;
		return function () {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				fn();
			}, delay);
		}
	};
	const cancalDebounce = debounce(getWindowInfo, 500);
	window.addEventListener('resize', cancalDebounce);

	window.addEventListener('pushState', function (e) {
		run()
	});

	window.addEventListener('replaceState', function (e) {
		run()
	});

	// B站视频详情页的自动播放下一个视频，或者点击其他视频，使用的是pushState不会刷新页面，这里需要重写pushState、replaceState为来实现监听页面视频是否切换
	const bindEventListener = function (type) {
		const historyEvent = history[type];
		return function () {
			const newEvent = historyEvent.apply(this, arguments);
			const e = new Event(type);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return newEvent;
		};
	};
	history.pushState = bindEventListener('pushState');
	history.replaceState = bindEventListener('replaceState');

	// 浏览器前进、后退时，重新计算
	window.onpopstate = function (event) {
		run()
	};

    // 监听b站的黑夜模式切换
    observeHtmlClassChanges();

})();