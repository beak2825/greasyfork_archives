// ==UserScript==
// @name         沉浸阅读（for微信读书）
// @version      0.5.0
// @author       GinWU
// @contributor  !Sylas;SimonDW;Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife;yehuda
// @namespace    https://screw-hand.com/
// @description  微信读书的阅读字体修改为苍耳今楷，加减宽度，鼠标离开显示隐藏导航栏、功能栏、滚动条，多档滚动速度，自动翻页，自定义宽度和主题（与原生深/浅主题互斥），仅适配weread.qq.com站点
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536846/%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%EF%BC%88for%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536846/%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%EF%BC%88for%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%EF%BC%89.meta.js
// ==/UserScript==

/**
 * fork from https://greasyfork.org/zh-CN/scripts/490065-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6weread%E9%98%85%E8%AF%BB%E7%BB%BC%E5%90%88%E5%8A%9F%E8%83%BD%E7%89%88
 * and so as https://greasyfork.org/zh-CN/scripts/458095-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%8F%AF%E8%A7%86%E8%8C%83%E5%9B%B4%E5%92%8C%E5%87%A0%E4%B8%AA%E7%99%BD%E8%89%B2%E4%B8%BB%E9%A2%98%E7%9A%84%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F
 */

GM_addStyle(`
* {
  font-family: SourceHanSerifCN-Bold !important;
}

.readerControls {
  height: 433px; margin-left: 0; left: initial; right: 20px; display: flex; flex-wrap: wrap; flex-direction: column; width: initial; right: 10px; bottom: 20px; padding-left: 200px;
}

.readerTopBar, .readerControls {
  opacity: 0; transition: opacity 1s;
}

.readerControls_item, .readerControls_fontSize {
  margin-top: 25px; margin-right: 10px; color:#6a6c6c; cursor:pointer;
}

.readerChapterContent { margin-left: 30px !important; margin-right: 30px !important; }

.readerControls:hover, .readerTopBar:hover {
  opacity: 1;
}
.readerCatalog {
  right: 125px; left: initial;
}
.readerAIChatPanel {
  right: 125px; left: initial;
}

.readerAIChatPanel_header {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: auto auto;
	grid-template-areas:
		"title    button_full"
		"subtitle button_close";
	align-items: center;
	column-gap: 15px;
    padding: 8px 15px;
}
.readerAIChatPanel_header_title {
	grid-area: title;
	justify-self: start;
}
.readerAIChatPanel_header_subtitle {
	grid-area: subtitle;
	justify-self: start;
}

.readerAIChatPanel_header_btn_full,
.readerAIChatPanel_header_btn_close {
	margin: 4px 0;
	padding: 0 20px;
	background: #3a3a3a;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.readerAIChatPanel_header_btn_full {
	grid-area: button_full;
}

.readerAIChatPanel_header_btn_close {
	grid-area: button_close;
}

.readerAIChatPanel_fullscreen {
	z-index: 9999 !important;
	left: 0 !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	width: 100vw !important;
	height: 100vh !important;
	margin: 0 !important;
	border-radius: 0 !important;
	max-width: 100vw !important;
	max-height: 100vh !important;
}
`);

const colors = [
    { bg: 'rgba(236, 217, 172, 0.4)', rbg: 'rgba(243, 227, 188, 1)', bgb: 'rgba(251, 239, 209, 0.5)', bgbBar: '#dbdbdb', white: true },
    {
        bg: 'rgba(102, 128, 102, 0.1)',
        rbg: 'rgba(65, 94, 62, 1)',
        bgb: 'rgba(102, 128, 102, 0.25)',
        bgbBar: '#dbdbdb',
        white: true
    },
    { bg: '#b5b5b5', rbg: '#c5c5c5', bgb: '#dbdbdb', bgbBar: '#dbdbdb', white: true }
];

const ElementUtils = {
	cssGet: (tar_elm, property) => {
		/**
     * 获取 css 属性
     *
     * tar_elm: elementNode
     * property: string
     */
		return window.getComputedStyle(tar_elm).getPropertyValue(property);
	},
	cssSet: (tar_elm, property, value, priority) => {
		/**
     * 设置 css 属性
     *
     * tar_elm: node
     * property: string
     * value: string | number | null
     * priority: string | null
     */
		return tar_elm.style.setProperty(property, value, priority);
	},
	htmlGet: (tar_elm, is_out) => {
		/**
     * 获取 HTML 代码
     *
     * tar_elm: node
     * is_in: bool
     */
		if (is_out) {
			return tar_elm.outerHTML;
		}
		return tar_elm.innerHTML;
	},
	insertHtml: (tar_elm, ins_html, position) => {
		/**
     * 在目标元素指定位置插入 HTML 代码
     *
     * tar_elm: node
     * ins_html: string
     * position: string -> 可选项：beforeBegin、afterBegin、beforeEnd、afterEnd
     */
		position = typeof position === "undefined" ? "beforeEnd" : position;

		tar_elm.insertAdjacentHTML(position, ins_html);
	},
	insertElement: (tar_elm, ins_elm, position) => {
		/**
     * 在目标元素指定位置插入元素
     *
     * tar_elm: node
     * ins_elm: node
     * position: string -> 可选项：beforeBegin、afterBegin、beforeEnd、afterEnd
     */
		position = typeof position === "undefined" ? "beforeEnd" : position;
		tar_elm.insertAdjacentElement(position, ins_elm);
	},
};

let div_body = $css("body");
let div_content = $css(".app_content");
let div_controls = $css(".readerControls");
let div_top_bar = $css(".readerTopBar");
let btn_width_add = $css("#width-add");
let btn_width_dev = $css("#width-dev");
let btn_scroll_on = $css("#scroll-on");
let btn_scroll_off = $css("#scroll-off");
let btn_turn_tips = $css("#turn-page-tips");
let scroll_speed = 0;

let styleElementForCustomTheme = null;

function getStyleStr_customTheme() {
    let style = `
    /* 通用样式覆盖，确保在任何情况下均优先显示自定义主题 */
    html body.wr-mode-0, html body.wr-mode-1, html body.wr-mode-2 {
        transition: background-color 0.3s ease-in-out !important;
    }
    `;

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        style += `
          html body.wr-mode-${i} {
              background-color:${color.bg} !important;
          }
          html body.wr-mode-${i} .readerTopBar {
              background-color:${color.rbg} !important;
          }
          html body.wr-mode-${i} .readerControls_item,
          html body.wr-mode-${i} .readerControls_fontSize,
          html body.wr-mode-${i} .app_content,
          html body.wr-mode-${i} #custom-theme-toggle-btn /* 确保自定义按钮也应用背景 */
          {
              background-color:${color.bgb} !important;
          }
          html body.wr-mode-${i} .readerCatalog {
            background-color:${color.bgbBar} !important;
          }
          html body.wr-mode-${i} .chapterItem_link {
              border: dashed #2a2a2a !important;
              border-width: 0 0 2px !important;
          }
          html body.wr-mode-${i} .chapterItem_text {
              font-size: 18px !important;
          }
          html body.wr-mode-${i} .readerNotePanel {
            background-color:${color.bgbBar} !important;
          }
          html body.wr-mode-${i} .sectionListItem_divider {
              border: dashed #2a2a2a !important;
              border-width: 0 0 2px !important;
          }
          html body.wr-mode-${i} .readerNotePanelBottomBar {
              border: solid ${color.bgbBar} !important;
              border-width: 0 0 2px !important;
              background-color:${color.rbg} !important;
          }

          /* 阅读区域内容样式 */
          html body.wr-mode-${i} .readerChapterContent {
              color: ${color.white ? '#333333' : '#e8e8e8'} !important;
          }

          /* 章节标题样式 */
          html body.wr-mode-${i} .readerChapterContent .chapterTitle {
              color: ${color.white ? '#000000' : '#ffffff'} !important;
          }
        `;
        if (color.white) {
            style += `
              html body.wr-mode-${i} .readerFooter_button,
              html body.wr-mode-${i} .readerFooter_button:hover,
              html body.wr-mode-${i} #custom-theme-toggle-btn /* 自定义按钮文字颜色 */
              {
                  color:#2a2a2a !important;
              }
              html body.wr-mode-${i} .readerFooter_button {
                  background-color:${color.bg} !important;
              }
            `;
        } else {
             style += `
              html body.wr-mode-${i} #custom-theme-toggle-btn /* 自定义按钮文字颜色 */
              {
                  color:#b9b9ba !important;
              }
            `;
        }
    }
    return style;
}

function applyCustomThemeStyles() {
    const styleContent = getStyleStr_customTheme();
    if (!styleElementForCustomTheme) {
        styleElementForCustomTheme = document.createElement('style');
        styleElementForCustomTheme.id = 'custom-weread-styles-by-yehuda';
        styleElementForCustomTheme.setAttribute('data-priority', 'highest');
        document.head.appendChild(styleElementForCustomTheme);
    }
    styleElementForCustomTheme.textContent = styleContent;

    document.head.appendChild(styleElementForCustomTheme);

    console.log("自定义主题样式已应用，共计样式规则数量：" +
                (styleElementForCustomTheme.sheet ? styleElementForCustomTheme.sheet.cssRules.length : "未知"));
}

function removeCustomStyles() {
    const body = $css("body");
    if (!body) return;
    colors.forEach((color, index) => {
        body.classList.remove('wr-mode-' + index);
    });
    if (localStorage.getItem('wr-custom-mode')) {
        localStorage.removeItem('wr-custom-mode');
    }
    body.removeAttribute('data-custom-color-mode');

    // 可选：如果想在移除时也移除style标签内容，但通常保留规则让切换回来更快
    if (styleElementForCustomTheme) {
      styleElementForCustomTheme.textContent = '';
    }
}

function changeCustomThemeMode(modeIndexStr, currentModeIndexStr = null) {
    const body = $css("body");
    if(!body) return;
    const modeIndex = parseInt(modeIndexStr);

    colors.forEach((_, index) => body.classList.remove('wr-mode-' + index));

    body.classList.remove('wr_darkTheme');
    if (!isNaN(modeIndex) && colors[modeIndex]) {
        body.classList.add('wr-mode-' + modeIndex);
        body.setAttribute('data-custom-color-mode', modeIndex.toString());
        localStorage.setItem('wr-custom-mode', modeIndex.toString());

        console.log(`已应用自定义主题 ${modeIndex}，当前body类: ${body.classList.toString()}`);

        document.documentElement.style.display = 'none';
        void document.documentElement.offsetHeight;
        document.documentElement.style.display = '';
    } else {
        console.warn(`微信读书脚本：无效的自定义模式索引: ${modeIndexStr}`);
        removeCustomStyles();
    }
}

function loadCustomThemeFeature() {
    if (!div_controls) {
        console.warn("微信读书脚本：.readerControls 未找到，无法添加自定义主题按钮。");
        return;
    }

    applyCustomThemeStyles();

    const customThemeButton = createElement('button', {
        title: '切换自定义主题',
        id: 'custom-theme-toggle-btn',
        class: 'readerControls_item'
    });
    customThemeButton.textContent = '主题';

    const NATIVE_WHITE_THEME_CLASS = 'wr_whiteTheme';

    customThemeButton.onclick = async () => {
        const body = $css("body");
        if (!body) {
            console.warn("微信读书脚本：未找到 body 元素。");
            return;
        }

        customThemeButton.style.transform = "scale(1.1)";
        customThemeButton.style.transition = "transform 0.2s";
        setTimeout(() => {
            customThemeButton.style.transform = "";
        }, 200);

        if (!body.classList.contains(NATIVE_WHITE_THEME_CLASS)) {
            console.log(`深色主题不支持自定义主题切换。当前类: ${body.classList.toString()}`);
            alert("请先手动切换为原生浅色主题，再使用自定义主题功能。");
            return;
        }

        let nextCustomModeIndex = 0;
        const currentAppliedCustomModeStr = body.getAttribute('data-custom-color-mode');
        if (currentAppliedCustomModeStr !== null) {
            const currentAppliedIndex = parseInt(currentAppliedCustomModeStr);
            if (!isNaN(currentAppliedIndex) && currentAppliedIndex >= 0 && currentAppliedIndex < colors.length) {
                nextCustomModeIndex = (currentAppliedIndex + 1) % colors.length;
            } else {
                console.warn(`Invalid 'data-custom-color-mode' value: ${currentAppliedCustomModeStr}. Resetting to first custom theme.`);
                nextCustomModeIndex = 0;
            }
        } else {
            console.log("No prior custom theme applied (data-custom-color-mode is null). Applying first custom theme.");
            nextCustomModeIndex = 0;
        }

        applyCustomThemeStyles();

        changeCustomThemeMode(nextCustomModeIndex.toString(), currentAppliedCustomModeStr);
    };

    div_controls.appendChild(customThemeButton);

    // 定义统一的原生主题按钮点击处理函数，以便复用和移除/添加监听器
    const nativeThemeButtonClickHandler = () => {
        console.log("原生主题按钮点击，移除自定义主题样式。");
        removeCustomStyles();
    };

    setTimeout(() => {
        const initialNativeDarkButton = document.querySelector('[title="深色"]');
        const initialNativeLightButton = document.querySelector('[title="浅色"]');

        // 当原生"切换到深色"按钮被点击（即从浅色变为深色）时，移除自定义主题
        if (initialNativeDarkButton) {
            initialNativeDarkButton.addEventListener('click', nativeThemeButtonClickHandler);
            console.log("Added click listener to initialNativeDarkButton");
        }
        // 当原生"切换到浅色"按钮被点击（即从深色变为浅色）时，移除自定义主题
        if (initialNativeLightButton) {
            initialNativeLightButton.addEventListener('click', nativeThemeButtonClickHandler);
            console.log("Added click listener to initialNativeLightButton");
        }
    }, 500);

    // 从 localStorage 初始化主题
    const localMode = localStorage.getItem('wr-custom-mode');
    if (localMode !== null && colors[parseInt(localMode)]) {
        changeCustomThemeMode(localMode);
    }
}

async function init() {
	"use strict";

	// 最多等待 30 秒页面加载完成
	let book = await waitElement(".wr_canvasContainer canvas", 30000);
	if (!book) {
		alert("书本内容加载失败，请手动刷新页面！");
		return;
	}

	div_body = $css("body");
	div_controls = $css(".readerControls");
	div_top_bar = $css(".readerTopBar");
	// 添加功能按键;
	div_controls.insertHtml(`
<button title="等待翻页" id='turn-page-tips' class='readerControls_item'>等待翻页</button>
<button title="加宽" id='width-add' class='readerControls_item'>加宽</button>
<button title="减宽" id='width-dev' class='readerControls_item'>减宽</button>
<button title="播放X0" id='scroll-on' class='readerControls_item'>播放X0</button>
<button title="停止播放" id='scroll-off' class='readerControls_item'>停止播放</button>
`);
	btn_width_add = $css("#width-add");
	btn_width_dev = $css("#width-dev");
	btn_scroll_on = $css("#scroll-on");
	btn_scroll_off = $css("#scroll-off");
	btn_turn_tips = $css("#turn-page-tips");

	// 额外功能按钮功能实现
	btn_width_add.onclick = () => changeWidth(true);
	btn_width_dev.onclick = () => changeWidth(false);
	btn_scroll_on.onclick = () => {
		scroll_speed++;
		if (scroll_speed == 1) {
			autoScroll();
		}
		btn_scroll_on.innerHTML = "播放X" + scroll_speed;
	};
	btn_scroll_off.onclick = () => {
		scroll_speed = 0;
		btn_scroll_on.innerHTML = "播放X0";
	};

    // 应用localStorage中的宽度设置
    setWidth(window.localStorage.getItem('setWidth'));

    // 加载自定义主题相关功能
    loadCustomThemeFeature();

	let header = await waitElement(".readerAIChatPanel_header", 30000);
	if (!header) {
		console.warn('.readerAIChatPanel_header" not found, cannot add buttons.');
	}

	// 全屏按钮
	let btnFull = createElement('button');
	btnFull.innerText = '全屏';
	btnFull.className = 'readerAIChatPanel_header_btn_full'; // 类名用于grid-area
	btnFull.onclick = function() {
		let panel = $css('.readerAIChatPanel .readerAIChatPanel');
		if(panel) {
			panel.classList.toggle('readerAIChatPanel_fullscreen');
			if(panel.classList.contains('readerAIChatPanel_fullscreen')) {
				btnFull.innerText = '还原';
			} else {
				btnFull.innerText = '全屏';
			}
		}
	};

	// 关闭按钮
	let btnClose = createElement('button');
	btnClose.innerText = '关闭';
	btnClose.className = 'readerAIChatPanel_header_btn_close'; // 类名用于grid-area
	btnClose.onclick = function() {
		let mask = $css('.wr_mask.wr_mask_Show');
		if(mask) mask.click();
	};

  // 只有当 header 存在时才添加按钮
  if (header) {
    header.appendChild(btnFull);
    header.appendChild(btnClose);
  }
}; // init 函数结束括号
init();

function changeWidth(isAdd, step) {
	step = typeof step === "undefined" ? 60 : step
	let currentMaxWidth = $css(".app_content").cssGet("max-width");
    let width = 0;
    if (currentMaxWidth && currentMaxWidth !== "none" && currentMaxWidth.endsWith("px")) {
        width = Number(currentMaxWidth.replace("px", ""));
    } else {
        const appContentDiv = $css(".app_content");
        if (appContentDiv) {
             width = appContentDiv.clientWidth;
        }
        if (!width || width <=0) width = 1000;
    }

	if (isAdd) {
		width += step;
	} else {
		width -= step;
	}
	setWidth(width);
}

function setWidth(width) {
	if (!width) {
		return;
	}
  const numericWidth = parseFloat(width);
  if (isNaN(numericWidth) || numericWidth <= 0) {
      console.warn("setWidth: 无效的宽度值", width);
      return;
  }

  let div_content_el = $css(".app_content");
  let div_top_bar_el = $css(".readerTopBar");

  if (div_content_el) {
    div_content_el.cssSet("max-width", numericWidth + "px");
  }
  if (div_top_bar_el) {
	  div_top_bar_el.cssSet("max-width", numericWidth + "px");
  }
	window.localStorage.setItem('setWidth', numericWidth.toString());
	let resize_event = new Event("resize");
	window.dispatchEvent(resize_event);
}

// 滑动屏幕，滚至页面底部
async function autoScroll(step, delay) {
	step = typeof step === "undefined" ? 1 : step;
	delay = typeof delay === "undefined" ? 1000 : delay;
	while (scroll_speed > 0) {
		window.scrollBy(0, step);
		if (isPageBottom()) {
			await nextPage();
		}
		await sleep(delay / scroll_speed / scroll_speed);
		if (isShowInView($css(".readerFooter_ending"))) {
			scroll_speed = 0;
			btn_scroll_on.innerHTML = "播放X0";
		}
	}
}

async function nextPage(sleep_time) {
	sleep_time = typeof sleep_time === "undefined" ? 6000 : sleep_time;
	let btn_turn = document.querySelector(".readerFooter_button");
	while (true) {
		if (isShowInView(btn_turn) && scroll_speed > 0) {
			console.log(`wait ${sleep_time / 1000} seconds. turn page.`);
			let last_time = sleep_time / 1000;
			while (last_time > 0) {
				btn_turn_tips.innerHTML = `${last_time}s翻页`;
				last_time--;
				await sleep(1000);
			}
			pressKey("right");
			await sleep(3000);
			btn_turn_tips.innerHTML = `等待翻页`;
			break;
		}
	}
}

/** ------ 常用函数 ------ **/

function initElement(elements) {
	/**
   * 初始化元素属性和函数
   *
   * element: elementNode
   */
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	for (let element of elements) {
		for (let fn_name in ElementUtils) {
			element[fn_name] = (...args) => {
				return ElementUtils[fn_name](element, ...args);
			};
		}
	}
}

function $css(query) {
	/**
   * css 选择器，单元素
   *
   * query: string
   */
	let elm = document.querySelector(query);
	if (!elm) {
		return;
	}
	initElement(elm);
	return elm;
}

function $cssAll(query) {
	/**
   * css 选择器，单元素
   *
   * query: string
   */
	let elms = Array.apply(null, document.querySelectorAll(query));
	if (elms.length === 0) {
		return;
	}
	initElement(elms);
	return elms;
}

function $xpa(query, node) {
	/**
   * xpath 选择器，单元素
   *
   * query: string
   * node: elementNode
   */
	node = typeof node === "undefined" ? document : node;
	let elm = document.evaluate(query, node).iterateNext();
	if (!elm) {
		return;
	}
	initElement(elm);
	return elm;
}

function $xpaAll(query, node) {
	/**
   * xpath 选择器，多元素
   *
   * query: string
   * node: elementNode
   */
	node = typeof node === "undefined" ? document : node;
	let elm_list = [];
	let elm_box = document.evaluate(query, document);
	let elm = elm_box.iterateNext();
	if (!elm) {
		return;
	}
	while (elm) {
		elm_list.push(elm);
		elm = elm_box.iterateNext();
	}
	initElement(elm_list);
	return elm_list;
}

function sleep(ms) {
	ms = typeof ms === "undefined" ? 1000 : ms;
	/**
   * 休眠函数，单位：ms
   * 使用方法：
   * sleep(500).then(() => { Do something after the sleep! });
   * 或者
   * await sleep(500); Do something after the sleep!
   */
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function isShowInView(element) {
	/**
   * 判断元素是否出现在视窗中
   */
	if (element === null || element === undefined) {
		return false;
	}
	let documentHeight = Math.max(
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
	let screenHeight = window.innerHeight || documentHeight;
	let screenWidth = window.innerWidth || document.documentElement.clientWidth;
	let { top, right, bottom, left } = element.getBoundingClientRect();
	return (
		top >= 0 && left >= 0 && right <= screenWidth && bottom <= screenHeight
	);
}

function isExistElement(css_selector) {
	/**
   * 判断指定元素是否存在页面中
   */
	if ($css(css_selector)) {
		return true;
	}
	return false;
}

function createElement(tagName, attributes) {
	const elm = document.createElement(tagName);
	for (const attr in attributes) {
		elm.setAttribute(attr, attributes[attr]);
	}
	return elm;
}

async function waitElement(css_selector, max_wait_ms) {
	/**
   * 等待指定元素出现
   */
	max_wait_ms = typeof max_wait_ms === "undefined" ? 3000 : max_wait_ms;
	let start_time = new Date().getTime();
	let elm = $css(css_selector);
	while (!elm && start_time + max_wait_ms >= new Date().getTime()) {
		await sleep(300);
		elm = $css(css_selector);
		if (elm) {
			break;
		}
	}
	return elm;
}

function getScrollTop() {
	/**
   * 滚动条在Y轴上已经滚动的距离
   */
	return document.documentElement.scrollTop || document.body.scrollTop;
}

function getScrollHeight() {
	/**
   * 整个页面的高度
   */
	return document.documentElement.scrollHeight || document.body.scrollHeight;
}

function getWindowHeight() {
	/**
   * 浏览器可视窗口高度
   */
	return document.documentElement.clientHeight || document.body.clientHeight;
}

function isPageBottom(deviation_value) {
	/**
   * 判断页面是否滚动到底，默认允许3个像素的误差，大部分情况下总是会差0.3-0.8像素
   */
	deviation_value =
		typeof deviation_value === "undefined" ? 3 : deviation_value;
	if (
		getScrollHeight() - getScrollTop() - getWindowHeight() <
		deviation_value
	) {
		return true;
	}
	return false;
}

function pressKeyByCode(code) {
	/**
   * 按键触发，根据传入的按键编号
   *
   * code: Number
   */
	return document.dispatchEvent(
		new KeyboardEvent("keydown", {
			bubbles: true,
			cancelable: true,
			keyCode: code,
		})
	);
}

function pressKey(name) {
	/**
   * 按键触发，根据传入的按键名
   *
   * name: string
   */
	const KeyNameToCode = {
		back: 8,
		tab: 9,
		clear: 12,
		enter: 13,
		shift: 16,
		ctrl: 17,
		alt: 18,
		capelock: 20,
		esc: 27,
		space: 32,
		pageup: 33,
		pagedown: 34,
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		insert: 45,
		delete: 46,
		0: 48,
		1: 49,
		2: 50,
		3: 51,
		4: 52,
		5: 53,
		6: 54,
		7: 55,
		8: 56,
		9: 57,
		a: 65,
		b: 66,
		c: 67,
		d: 68,
		e: 69,
		f: 70,
		g: 71,
		h: 72,
		i: 73,
		j: 74,
		k: 75,
		l: 76,
		m: 77,
		n: 78,
		o: 79,
		p: 80,
		q: 81,
		r: 82,
		s: 83,
		t: 84,
		u: 85,
		v: 86,
		w: 87,
		x: 88,
		y: 89,
		z: 90,
		f1: 112,
		f2: 113,
		f3: 114,
		f4: 115,
		f5: 116,
		f6: 117,
		f7: 118,
		f8: 119,
		f9: 120,
		f10: 121,
		f11: 122,
		f12: 123,

		// 数字小键盘部分
		n0: 96,
		n1: 97,
		n2: 98,
		n3: 99,
		n4: 100,
		n5: 101,
		n6: 102,
		n7: 103,
		n8: 104,
		n9: 105,
		"n*": 106,
		"n+": 107,
		nenter: 108,
		"n-": 109,
		"n.": 110,
		"n/": 111,

		numlock: 144,
		";": 186,
		":": 186,
		"=": 187,
		"+": 187,
		",": 188,
		"<": 188,
		"-": 189,
		_: 189,
		".": 190,
		">": 190,
		"/": 191,
		"?": 191,
		"`": 192,
		"~": 192,
		"[": 219,
		"{": 219,
		"\\": 220,
		"|": 220,
		"]": 221,
		"}": 221,
		"'": 222,
		'"': 222,
	};

	return pressKeyByCode(KeyNameToCode[name.toLowerCase()]);
}
