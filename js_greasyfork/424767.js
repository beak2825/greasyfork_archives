// ==UserScript==
// @name        i Go Player
// @namespace   https://greasyfork.org/users/756764
// @version     2025.3.13
// @author      ivysrono
// @license     MIT
// @description 优化星阵、弈客等围棋网站
// @match       *://m.19x19.com/*
// @match       *://*.yikeweiqi.com/*
// @require     https://unpkg.com/vm.shortcut
// @run-at      document-start
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424767/i%20Go%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/424767/i%20Go%20Player.meta.js
// ==/UserScript==

/**
 * 星阵
 * https://m.19x19.com/engine/index
 * 去除顶部和底部APP推广
 */
if (location.host === 'm.19x19.com') {
  GM.addStyle(`.open-app-box {display: none !important;}`);
  const observer = new MutationObserver(() => {
    if (document.getElementsByClassName('van-icon-close').length > 0) {
      for (let i of document.getElementsByClassName('van-icon-close')) i.click();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

window.addEventListener('load', () => {
  /**
   * 仅在 Firefox 下测试通过。
   * &type=0 和 &type=1 对应的棋谱居然不一样，如：
   * https://share.yikeweiqi.com/sgf/dtl?id=5000000&type=1
   * 这两条不适合通过插入 CSS 实现，会有副作用。
   * 通过 JS 对特定元素进行处理较为妥当。
   * */
  if (location.href.startsWith('https://share.yikeweiqi.com/sgf/dtl?id=')) {
    // 修正畸形的底栏 https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes
    document.getElementsByClassName('board-menu')[0].style.display = 'inline-flex';
    // 使白方信息完全显示
    document.getElementsByClassName('gls-board-name')[1].style.width = 'auto';
  }
  // 自动隐藏“关于我们”
  const foot_box = document.getElementsByClassName('foot_box');
  const hide_foot = document.getElementsByClassName('hide_foot');
  if (foot_box[0].style === '') {
    hide_foot[0].click();
  }
});

/**
 * 弈客已原生支持左右方向键和翻页键，但缺失跳到开头和末尾的快捷键。
 * 快捷键库来自 https://github.com/violentmonkey/vm-shortcut
 */
if (
  !navigator.userAgent.includes('Mobile') &&
  location.href.startsWith('https://home.yikeweiqi.com/#/live/')
) {
  GM.addStyle(`#explain_box {height: auto !important}`); // 解说框自动调整高度避免解说显示不全。评论框默认状态下不适合自动高度，需要弹幕化。
  VM.registerShortcut('Home', () => {
    document.getElementsByClassName('btn_icon')[0].click();
  });
  VM.registerShortcut('End', () => {
    document.getElementsByClassName('btn_icon')[5].click();
  });
  VM.registerShortcut(' ', () => {
    const playIcon = document.getElementsByClassName('play_icon');
    const stopIcon = document.getElementsByClassName('stop_icon');
    if (playIcon.length === 1) {
      playIcon[0].click();
    } else if (stopIcon.length === 1) {
      stopIcon[0].click();
    }
  });
}

/**
 * 原新闻转新棋闻
 * https://share.yikeweiqi.com/gonews/detail/id/19932/
 * https://home.yikeweiqi.com/#/gonews/detail/19932
 */
if (location.href.startsWith('https://share.yikeweiqi.com/gonews/detail/id/')) {
  location.href = location.href.replace(
    'https://share.yikeweiqi.com/gonews/detail/id/',
    'https://home.yikeweiqi.com/#/gonews/detail/'
  );
}

/**
 * 选择最合适的直播间
 * 新桌面版直播列表：https://home.yikeweiqi.com/#/live
 * 直播室：可用于移动版但操作不便。
 * https://home.yikeweiqi.com/#/live/board/11105
 * https://home.yikeweiqi.com/#/live/board/16084
 * 历史遗留（含roomid）：
 * https://home.yikeweiqi.com/#/live/room/11105/          404，跳转至列表
 * https://home.yikeweiqi.com/#/live/room/11105/1/6638088 服务器重定向去除尾部 roomid 。
 * 新移动版直播列表：https://home.yikeweiqi.com/mobile#/golive/list
 * 直播室：
 * https://home.yikeweiqi.com/mobile#/golive/detail/16084
 * 含roomid：
 * https://home.yikeweiqi.com/mobile#/golive/room/16084/1/12472062
 * https://home.yikeweiqi.com/mobile.html#/golive/room/16084/1/12472062
 * 旧桌面版直播列表：https://portal.yikeweiqi.com/online/golive
 * 好直播室：
 * https://portal.yikeweiqi.com/online/golive/detail?id=11105
 * https://portal.yikeweiqi.com/online/golive/detail?id=11105&hall=1&room=6638088
 * 坏直播室：
 * https://portal.yikeweiqi.com/online/golive/livedetail?id=11105
 * https://portal.yikeweiqi.com/online/golive/livedetail?id=11105&hall=1&room=6638088
 * 以上旧桌面版地址被服务器重定向到不新不旧的无效页面：
 * https://home.yikeweiqi.com/online/golive#/game
 * https://home.yikeweiqi.com/online/golive/detail?id=11105#/game
 * https://home.yikeweiqi.com/online/golive/detail?id=11105&hall=1&room=6638088#/game
 * https://home.yikeweiqi.com/online/golive/livedetail?id=11105#/game
 * https://home.yikeweiqi.com/online/golive/livedetail?id=11105&hall=1&room=6638088#/game
 * 旧移动版直播列表：https://share.yikeweiqi.com/golive/lists
 * 好直播室：
 * https://share.yikeweiqi.com/golive/detail/id/11105#
 * https://share.yikeweiqi.com/golive/detail?id=1#
 * https://share.yikeweiqi.com/golive/detail?id=11105#
 * https://share.yikeweiqi.com/golive/detail?id=11105&hall=1&room=6638088#
 * 坏直播室：
 * https://share.yikeweiqi.com/golive/livedtl?id=11105
 * https://share.yikeweiqi.com/golive/livedtl?id=11105&hall=1&room=6638088
 */

let m = null;
if (navigator.userAgent.includes('Mobile')) {
  /**
   * 隐藏 app下载 底栏
   * https://share.yikeweiqi.com/gonews/detail/id/24024
   * 移动版直播间解说窗口图片宽度溢出
   * https://home.yikeweiqi.com/mobile#/golive/room/115835/1/148497349
   */
  GM.addStyle(`
  #openLaunch, .downloadApp {display: none !important;}
  #chat_view img {max-width: 100% !important;}
  `);
  // -> 新移动版
  // 直播列表
  if (
    location.href.match(
      /^https?:\/\/(home|portal)\.yikeweiqi\.com\/online\/golive#?\/?(index\.html#?)?/i
    ) || // 旧桌面版
    location.href === 'https://home.yikeweiqi.com/#/live' || // 新桌面版
    location.href === 'https://share.yikeweiqi.com/golive/lists' // 旧移动版
  ) {
    location.href = 'https://home.yikeweiqi.com/mobile#/golive/list';
  }
  // 新桌面版直播间含历史遗留
  if (
    (m = location.href.match(/^https?:\/\/home\.yikeweiqi\.com\/#\/live\/(board|room)\/(\d+)/i))
  ) {
    location.href = `https://home.yikeweiqi.com/mobile#/golive/detail/${m[2]}`;
  }
  // 新移动版直播间（含roomid）
  if (
    (m = location.href.match(
      /^https:\/\/home\.yikeweiqi\.com\/mobile.*#(\/golive)?\/room\/(\d+)\/?(1\/\d+\/?)?/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/mobile#/golive/detail/${m[2]}`;
  }
  // 旧桌面版直播间
  if (
    (m = location.href.match(
      /^https?:\/\/(home|portal)\.yikeweiqi\.com\/online\/golive\/(live)?detail\?id=(\d+)/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/mobile#/golive/detail/${m[2]}`;
  }
} else {
  // -> 新桌面版
  // 直播列表
  if (
    location.href.match(
      /^https?:\/\/(home|portal)\.yikeweiqi\.com\/online\/golive#?\/?(index\.html#?)?/i
    ) || // 旧桌面版
    location.href.match(/^https:\/\/home\.yikeweiqi\.com\/mobile.*#\/golive\/list\/?/i) || // 新移动版
    location.href === 'https://share.yikeweiqi.com/golive/lists' // 旧移动版
  ) {
    location.href = 'https://home.yikeweiqi.com/#/live';
  }
  // 新桌面版历史遗留
  if ((m = location.href.match(/^https?:\/\/home\.yikeweiqi\.com\/#\/live\/room\/(\d+)/i))) {
    location.href = `https://home.yikeweiqi.com/#/live/board/${m[1]}`;
  }
  // 新移动版直播间
  if (
    (m = location.href.match(
      /^https:\/\/home\.yikeweiqi\.com\/mobile.*#\/golive\/detail\/(\d+)\/?/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/#/live/board/${m[1]}`;
  }
  // 新移动版直播间（含roomid）
  if (
    (m = location.href.match(
      /^https:\/\/home\.yikeweiqi\.com\/mobile.*#(\/golive)?\/room\/(\d+)\/?(1\/\d+\/?)?/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/#/live/board/${m[2]}`;
  }
  // 旧桌面版直播间
  if (
    (m = location.href.match(
      /^https?:\/\/(home|portal)\.yikeweiqi\.com\/online\/golive\/(live)?detail\?id=(\d+)/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/#/live/board/${m[3]}`;
  }
  // 旧移动版直播间
  if (
    (m = location.href.match(
      /^https?:\/\/share\.yikeweiqi\.com\/golive\/(detail|livedtl)(\?|\/)id(\=|\/)(\d+)/i
    ))
  ) {
    location.href = `https://home.yikeweiqi.com/#/live/board/${m[4]}`;
  }
}
