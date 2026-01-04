// ==UserScript==
// @name         bilibili 新动态顶栏简易修改
// @namespace    http://unown.moe
// @version      0.4.2
// @description  修改 bilibili 新动态顶栏, 使其更方便使用
// @author       Unown Hearn
// @license      MIT License
// @match        *://t.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35912/bilibili%20%E6%96%B0%E5%8A%A8%E6%80%81%E9%A1%B6%E6%A0%8F%E7%AE%80%E6%98%93%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/35912/bilibili%20%E6%96%B0%E5%8A%A8%E6%80%81%E9%A1%B6%E6%A0%8F%E7%AE%80%E6%98%93%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

/*
    history:
        [2017.12.1] 0.0 简单地让 bilibili 网页端新版动态的顶栏固定,
   并隐藏原本冒出来的新顶栏

        [2017.12.1] 0.1 让顶栏在小窗口时也完全显示, 顶栏的左部分可以自动折叠

        [2017.12.1] 0.2 顶栏的搜索栏在聚焦时会伸长到 2.5 倍

        [2017.12.2] 0.3 右边栏也可以自动折叠了, 顶栏左部分的主站项不会消失

        [2017.12.2] 0.3.1 完善文档

        [2017.12.2] 0.3.2 偷了个懒, 让收进去的项横着显示, 规避了错位问题,
   另外解决了一个初始化时变成 2 行的 bug

        [2017.12.2] 0.3.3 修复了一行可能会变成两行的 bug
   (除了尺寸非常小的情况之外)

        [2017.12.2] 0.4 暴力解决了网络不好时需要等待网页加载而无法执行脚本的问题

        [2017.12.2] 0.4.1 修复 bug, 改进浏览器支持(chrome, safari)

        [2017.12.2] 0.4.1 正式发布于
   greasyfork(https://greasyfork.org/zh-CN/scripts/35912-bilibili-%E6%96%B0%E5%8A%A8%E6%80%81%E9%A1%B6%E6%A0%8F%E7%AE%80%E6%98%93%E4%BF%AE%E6%94%B9)

        [2017.12.2] 0.4.2 添加遗漏掉的协议

    TODO:
        * 点击省略号后, 使面板保持开启, 直到点击其他位置或再点一次省略号

        * 要不要解决宽度过小时会发生的问题? 那并不是应该算是正常使用...

*/

(function() {
//'use strict';
//< 不然 safari 会报错

// 此脚本只管动态首页
if (!/^(\/|\/\?.*)$/.test(window.location.pathname)) {
  return;
}

console.log('启用了 userscript \'固定 bilibili 新动态的顶栏 1.0\'');

/**
 * 本 userscript 是否成功初始化
 *
 * @type boolean
 */
var initialized = false;

/**
 * 顶栏
 *
 * @type {HTMLElement}
 */
var bili_wrapper;
/**
 * 顶栏的左导航栏
 *
 * @type {HTMLElement}
 */
var nav_con_fl;
/**
 * 顶栏的右导航栏 (不包含右导航栏)
 *
 * @type {HTMLElement}
 */
var nav_con_fr;
/**
 * 顶栏的投稿栏
 *
 * @type {HTMLElement}
 */
var nav_upload;
/**
 * 顶栏的搜索栏 (从右导航栏分离)
 *
 * @type {HTMLElement}
 */
var nav_search;

/**
 * 是否在使用备选方案. 换句话说, 是否顶栏右部分被挤压了
 *
 * @type boolean
 */
var in_plan_b = false;

/**
 * 获取窗口宽度
 *
 * @returns {number} 窗口宽度
 */
function getWindowWidth() {
  return $(window).width();
}

/**
 * 获取元素的真实大小
 *
 * @param {HTMLElement} elem
 */
function getRealWidth(elem) {
  var width;

  if (elem.style.display === 'none') {
    var old_position = elem.style.position;
    var old_visibility = elem.style.visibility;
    elem.style.position = 'absolute';
    elem.style.visibility = 'hidden';
    elem.style.display = 'inline';
    width = elem.offsetWidth;
    elem.style.position = old_position;
    elem.style.display = 'none';
    elem.style.visibility = old_visibility;
    return width;
  }
  return elem.offsetWidth;
}

/**
 *  调整顶栏的某一部分导航栏
 *
 *  @param {HTMLElement} nav 导航栏
 *  @param {number} max_width 外部认为容许的最大宽度
 *  @param {HashMap} [options] 更多的选项, 包括:
 *  @param {HTMLElement} [options.plan_b] 备选可调整的导航栏
 *  @param {number} [options.nav_search_width_for_plan_b] 搜索框的最终长度, 在计算备选方案的长度时要用到
 *  @param {boolean} [options.is_left] 如果为真, 则代表正在调整的是左部分
 *
 *  @returns {number} 隐藏项的数量
 */
function __adjustNav(
    nav, max_width, options /*plan_b, nav_search_width_for_plan_b*/) {
  //< plan_b 为 undefined 代表只要管好自己就行了
  // console.log(["max width:", max_width]);
  options = options || {};

  // console.log(nav, nav.querySelector(".ul"));
  // querySelectorAll 蠢爆了, 不能限定到仅自己的子元素...
  // 包含外部项的 ul
  var nav_ul = nav.querySelector('ul');
  // "更多"的面板
  var more_panel = nav_ul.querySelector('.more-panel');
  // 外部项
  var outside_items = Array.prototype.slice.call(nav_ul.children);
  // 包含"更多"按钮的项, 位于外部项的最末尾. 可能会不 display, 但位置依旧不变
  var more_button_item = outside_items[outside_items.length - 1];



  var min_width = getRealWidth(more_button_item);
  if (options.is_left) {
    min_width += outside_items[0].offsetWidth;
    // 外部项的数组要忽略掉"第一项"和"更多"按钮
    outside_items = outside_items.slice(1, outside_items.length - 1);
  } else {
    // 外部项的数组要忽略掉"更多"按钮
    outside_items = outside_items.slice(0, outside_items.length - 1);
  }

  if (options.plan_b) {  // 有备用计划
    var max_width_for_plan_b = getWindowWidth() - min_width -
        nav_upload.offsetWidth - options.nav_search_width_for_plan_b;
    if (in_plan_b) {  //< 代表目前要先调整右部分
      if (__adjustNav(options.plan_b, max_width_for_plan_b) ===
          0) {  //< 右边没有隐藏项了, 代表可以试着调整左边了
        in_plan_b = false;

        var max_width = getWindowWidth() - nav_con_fr.offsetWidth -
            nav_upload.offsetWidth - options.nav_search_width_for_plan_b;
        __adjustNav(nav, max_width, {is_left: true});
        return;
      } else {  // 右边还没调整完, 不能调整左边, 所以直接返回
        return;
      }
    } else if (max_width < min_width) {  //< 左边不能再压榨空间了
      if (nav.offsetWidth > min_width) {
        __adjustNav(nav, min_width, {is_left: true});  //< 先把左边调整好
        // console.log([min_width, nav.offsetWidth]);
      }
      in_plan_b = true;
      console.log([nav_con_fr.offsetWidth, max_width_for_plan_b]);
      __adjustNav(options.plan_b, max_width_for_plan_b);
      return;
    }
  }

  nav.style.maxWidth = (max_width).toString() + 'px';
  // 包含隐藏项的 ul
  var more_panel_ul = more_panel.querySelector('ul');
  // 隐藏项
  var hidden_items = Array.prototype.slice.call((more_panel_ul.children));

  // 外部项的总长度
  var sum_width = 0;

  // 第一个隐藏的项(或 undefined), 用于插入新的隐藏项
  let first_hidden_item = hidden_items[0] || undefined;

  // 记录隐藏项的数量, 会在判定是否计算"更多"按钮时使用
  var hidden_count = hidden_items.length;

  // 如果为真, 则代表外边已经容不下更多项了
  var overflowed = false;

  // 将会溢出的项放入"更多"面板中
  for (var i = 0; i < outside_items.length; i++) {
    if (!overflowed) {
      sum_width += outside_items[i].offsetWidth;
      var actual_width =
          ((i === outside_items.length - 1) && hidden_count === 0) ?
          sum_width + min_width - getRealWidth(more_button_item) :
          sum_width + min_width;
      // console.log([sum_width, actual_width, getRealWidth(more_button_item),
      // more_button_item]);
      if (actual_width > max_width) {
        overflowed = true;
      }
    }

    if (overflowed) {
      // console.log(["hide:", i, outside_items[i]]);
      hidden_count++;
      if (first_hidden_item) {
        // console.log(["insert before", outside_items[i], first_hidden_item]);
        more_panel_ul.insertBefore(outside_items[i], first_hidden_item);
      } else {
        // console.log(["append child", outside_items[i]]);
        more_panel_ul.appendChild(outside_items[i]);
      }
    }
  }

  // 如果没有溢出, 试着将"更多"面板中的项取回顶栏的此半部分, 直到会溢出
  if (!overflowed) {
    for (var i = 0; i < hidden_items.length; i++) {
      sum_width += hidden_items[i].offsetWidth;

      var actual_width = (i === hidden_items.length - 1) ?
          sum_width + min_width - getRealWidth(more_button_item) :
          sum_width + min_width;
      if (actual_width > max_width) {
        overflowed = true;
        break;
      }

      hidden_count--;
      nav_ul.insertBefore(hidden_items[i], more_button_item);
    }
  }

  if (overflowed) {
    more_button_item.style.display = 'list-item';
  } else {
    more_button_item.style.display = 'none';
  }

  return hidden_count;
}

/**
 * 是否正在调整顶栏的导航栏
 *
 * @type boolean
 */
var in_adjusting = false;

/**
 * 调整顶栏
 *
 * @param {number} window_width 窗口的大小
 * @param {number} [nav_search_width] 搜索栏的最终大小
 *
 * @returns {void}
 */
function adjustNav(window_width, nav_search_width) {
  if (in_adjusting) {
    return;
  }
  in_adjusting = true;

  if (!nav_search_width) {
    nav_search_width = nav_search.offsetWidth;
  }

  var max_width = window_width - nav_con_fr.offsetWidth -
      nav_upload.offsetWidth - nav_search_width;

  __adjustNav(nav_con_fl, max_width, {
    plan_b: nav_con_fr,
    nav_search_width_for_plan_b: nav_search_width,
    is_left: true
  });

  in_adjusting = false;
}

/**
 *
 * @param {*} selector 选择器
 * @param {*} inv 尝试间隔
 * @param {*} callback 回调函数, 以毫秒为单位
 *
 * @returns {void}
 */
function waitUntilLoaded(selectors, inv, callback) {
  for (var i = 0; i < selectors.length; i++) {
    if (!document.querySelector(selectors[i])) {
      setTimeout(function() {
        waitUntilLoaded(selectors, inv, callback);
      }, inv);
      return;
    }
  }
  callback();
}

// 在页面加载后初始化本 userscript
function initialize() {
  // 让 home-container 能在正确的位置显示
  {
    var home_container = document.querySelector('.home-container');
    if (home_container) {
      home_container.style = 'position: absolute; top:42px;';
    } else {
      console.log('home-container 不存在!');
    }
  }

  // 使顶栏固定
  {
    var header = document.querySelector('.bili-header-m');
    if (header) {
      header.style = 'position: fixed; top:0; width: 100%;';
    } else {
      console.log('bili-header-m 不存在!');
      return;
    }
  }

  // ~~让顶栏的内容能正常显示~~
  {
    bili_wrapper = document.querySelector('.bili-wrapper');
    nav_con_fl = bili_wrapper.querySelector('.nav-con.fl');
    nav_con_fr = bili_wrapper.querySelector('.nav-con.fr');
    nav_upload = bili_wrapper.querySelector('.up-load');

    if (!bili_wrapper || !nav_con_fl || !nav_con_fr || !nav_upload) {
      console.log(
          '.bili-wrapper 或 .nav-con.fl 或 .nav-con.fr 或 .up-load.fr 不存在!');
      console.log([bili_wrapper, nav_con_fl, nav_con_fr, nav_upload]);
      return;
    } else {
      // nav_con_fl.style = "font-size: 0.8em; text-indent: -5px;";
      // nav_con_fr.style = "float: left;";
      // nav_upload.style = "float: left;";
      // bili_wrapper.appendChild(nav_upload);
      // nav_con_fl.style = "overflow: hidden;";
      // nav_con_fl_ul = nav_con_fl.querySelector("ul");
    }
  }

  // 把搜索栏挪出来
  {
    nav_search = bili_wrapper.querySelector('.nav-search');
    if (nav_search) {
      bili_wrapper.appendChild(nav_search);
    } else {
      console.log('.nav-search 不存在');
    }
    nav_search.style.marginRight = '0';
  }

  // 添加"更多"的按钮
  function addButtonMore(nav, is_right) {
    var ul = nav.querySelector('ul');

    var item_more = document.createElement('li');
    item_more.classList.add('nav-item');
    item_more.classList.add('more');
    item_more.style.paddingLeft = '11px';
    item_more.style.paddingRight = '11px';
    if (is_right) {
      item_more.style.display = 'none';
    }


    var button_area = document.createElement('div');
    button_area.classList.add('button-area');
    button_area.classList.add('c-pointer');  // 照猫画虎

    var more_button = document.createElement('div');
    more_button.classList.add('icon-font');
    more_button.classList.add('icon-more-1');

    var more_panel = document.createElement('div');
    more_panel.classList.add('more-panel');
    // more_panel.style = "position: absolute; display: none; left:";
    more_panel.style = 'position: absolute;';

    var more_panel_ul = document.createElement('ul');

    button_area.appendChild(more_button);
    item_more.appendChild(button_area);
    ul.appendChild(item_more);
    more_panel.appendChild(more_panel_ul);
    button_area.appendChild(more_panel);
  }

  addButtonMore(nav_con_fl);
  addButtonMore(nav_con_fr, true);

  // 让搜索框可以伸缩
  {
    var search_input = document.querySelector('.nav-search input');
    search_input.addEventListener('focusin', function() {
      // console.log(["focusin"]);
      adjustNav(window_width, 142);  // workaround
      search_input.style.width = '100px';
    });
    search_input.addEventListener('focusout', function() {
      search_input.style.width = '40px';
      setTimeout(function() {
        adjustNav(window_width);
      }, 250);  // workaround
    });
  }

  // css 相关
  {
    var sheet = document.createElement('style');

    sheet.innerHTML =
        // 抄自网站自己的 css, 用来显示面板
        '.nav-con .more-panel {' +
        'position: absolute;' +
        //'width: 94px;' +
        'text-align: center;' +
        'top: 45px;' +
        'left: -4px;' +
        //"right: 5px;"+
        'background: #fff;' +
        'border: 1px solid #e5e9ef;' +
        '-webkit-box-shadow: 0 11px 12px 0 rgba(106,115,133,0.12);' +
        'box-shadow: 0 11px 12px 0 rgba(106,115,133,0.12);' +
        'border-radius: 8px;' +
        'color: #222;' +
        'z-index: 10;' +
        // 适应大小
        'width: -moz-max-content;' +     // firefox
        'width: max-content;' +          // chrome
        'width: -webkit-max-content;' +  // safari
        '}\n' +
        // 右边
        '.nav-con.fr .more-panel {' +
        'right: 4px;' +
        'left: auto;' +
        '}\n' +
        // 抄自网站自己的 css, 用来显示面板的角
        '.nav-con .more-panel:after {' +
        'content: "";' +
        'display: block;' +
        'border-top: 1px solid #e5e9ef;' +
        'border-left: 1px solid #e5e9ef;' +
        '-webkit-transform: rotate(45deg);' +
        'transform: rotate(45deg);' +
        'width: 8px;' +
        'height: 8px;' +
        'position: absolute;' +
        'top: -5px;' +
        'left: 12px;' +
        'background: #fff;' +
        '}\n' +
        // 右边
        '.nav-con.fr .more-panel:after {' +
        'right: 12px;' +
        'left: auto;' +
        '}\n' +
        // ~~让更多面板上的项居中~~ 与面板中的项有关的样式
        '.more-panel .nav-item {' +
        //'float: none!important;' +
        'transition: none!important;' +
        //"clear: both;" +
        '}\n' +
        // 自适应宽度
        '@media screen and (max-width: 980px) {' +
        '.bili-header-m .bili-wrapper {' +
        'width: 100%;' +
        '}' +
        '}\n' +
        // 悬浮显示面板
        '.nav-item.more .more-panel {' +
        'visibility: hidden;' +
        'transition-duration: 0.1s;' +
        'transition-delay: 0.1s;' +
        '}\n' +
        '.nav-item.more:hover .more-panel {' +
        'visibility: visible;' +
        'transition-duration: 0.1s;' +
        'transition-delay: 0s;' +
        '}\n' +
        // 让 home 的位置好看些
        '.nav-item.home { ' +
        'margin-left: 0!important;' +
        'transition-duration: 0s;' +
        'transition-delay: 0s;' +
        '}\n';


    document.head.appendChild(sheet);
  }

  // setTimeout(function() {
  adjustNav(getWindowWidth());
  initialized = true;
  //}, 1000);



  // 隐藏会冒出来的新顶栏
  {
    var sticky_bar = document.querySelector('.sticky-bar');
    if (sticky_bar) {
      sticky_bar.style = 'visibility: hidden;';
    } else {
      console.log('sticky-bar 不存在!');
    }
  }
}

waitUntilLoaded(['.nav-con.fl', '.nav-con.fr', '.up-load.fr'], 50, initialize);

/**
 * 用于检测是否是窗口的宽度发生了变化
 *
 * @type {number}
 */
var window_width = getWindowWidth();

// 监视窗口调整大小
window.addEventListener('resize', function() {

  if (!initialized) {
    return;
  }

  var new_width = getWindowWidth();
  if (window_width === new_width) {
    return;
  }

  window_width = new_width;

  // nav_con_fl, nav_con_fr, nav_upload;

  adjustNav(window_width);

  // console.log(nav_con_fl.style.maxWidth);

});

})();