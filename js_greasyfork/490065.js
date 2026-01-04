// ==UserScript==
// @name         微信读书Weread阅读综合功能版
// @version      0.3.8
// @author       !Sylas
// @contributor  SimonDW;Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @namespace    http://tampermonkey.net/
// @description  微信读书的阅读字体修改为苍耳今楷，加减宽度，鼠标离开显示隐藏导航栏、功能栏、滚动条，多档滚动速度，自动翻页，仅适配weread.qq.com站点
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490065/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6Weread%E9%98%85%E8%AF%BB%E7%BB%BC%E5%90%88%E5%8A%9F%E8%83%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/490065/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6Weread%E9%98%85%E8%AF%BB%E7%BB%BC%E5%90%88%E5%8A%9F%E8%83%BD%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle(`
* {
  font-family: SourceHanSerifCN-Bold !important;
}

body {
  overflow: hidden;
}

.readerControls {
  width: 120px; margin-left: calc(50% - 120px); display: flex; flex-wrap: wrap; flex-direction: row; 
}

.readerTopBar, .readerControls {
  opacity: 0; transition: opacity 1s;
}

.readerControls_item, .readerControls_fontSize {
  margin-right: 10px; color:#6a6c6c; cursor:pointer;
}

.readerChapterContent { margin-left: 30px !important; margin-right: 30px !important; }

.readerControls:hover, .readerTopBar:hover {
  opacity: 1;
}

body:hover {
  overflow: auto;
}
`);

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
let div_controls = $css(".readerControls");
let div_top_bar = $css(".readerTopBar");
let btn_width_add = $css("#width-add");
let btn_width_dev = $css("#width-dev");
let btn_scroll_on = $css("#scroll-on");
let btn_scroll_off = $css("#scroll-off");
let btn_turn_tips = $css("#turn-page-tips");
let scroll_speed = 0;

(async function () {
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

  //   // 顶部导航栏优化
  //   let last_scroll_top = getScrollTop();
  //   let opacity = 1;
  //   window.onscroll = () => {
  //     let curr_scroll_top = getScrollTop();
  //     if (curr_scroll_top < last_scroll_top) {
  //       // 上划显示
  //       opacity = opacity + 0.05 >= 1 ? 1 : opacity + 0.05;
  //     } else {
  //       // 上划隐藏
  //       opacity = opacity - 0.03 <= 0 ? 0 : opacity - 0.03;
  //     }
  //     div_top_bar.cssSet("opacity", opacity);
  //     div_controls.cssSet("opacity", opacity);
  //     last_scroll_top = curr_scroll_top;
  //   };
})();

function changeWidth(isAdd, step) {
  step = typeof step === "undefined" ? 60 : step;
  let div_content = $css(".app_content");
  let width = Number(div_content.cssGet("max-width").replace("px", ""));

  if (isAdd) {
    width += step;
  } else {
    width -= step;
  }
  div_content.cssSet("max-width", width + "px");
  div_top_bar.cssSet("max-width", width + "px");
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
