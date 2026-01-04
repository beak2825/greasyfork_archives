// ==UserScript==
// @name        i Search Engines
// @namespace   https://greasyfork.org/users/756764
// @version     2025.3.13
// @author      ivysrono
// @license     MIT
// @description 优化搜索引擎

// @include     https://www.bing.com/search*
// @include     https://cn.bing.com/search*
// @include     https://lite.qwant.com/?*

// @run-at      document-start
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424769/i%20Search%20Engines.user.js
// @updateURL https://update.greasyfork.org/scripts/424769/i%20Search%20Engines.meta.js
// ==/UserScript==

/**
 * 给搜索结果计数
 * https://developer.mozilla.org/docs/Web/Guide/CSS/Counters
 */

if (location.host.endsWith('.bing.com')) {
  const css = `
  body {
    counter-reset: section;
  }
  #b_results > li.b_algo:before {
    counter-increment: section;
    content: counter(section)
  }

  /* 对搜索结果链接分别着色 */
  #b_results a[href^='https://'] {background-color: #c4ffc4 !important;}
  #b_results a[href^='http://'] {background-color: #ffd6dc !important;}
  `;

  const css_PC = `
  /* 包括所有搜索结果的主体 */
  #b_content,
  #b_results {
    /* 避免底部出现拖动条 */
    width: auto !important;
    /**
     * 避免时间选项卡与上方搜索类型选项卡重叠
     * https://developer.mozilla.org/docs/Web/CSS/padding
     */
    padding: 1.5% 0px !important;
  }

  /* 单个搜索结果 */
  #b_results > li {
    /* 不能加 !important 否则与去广告部分冲突 */
    display: inline-block;
    /* 显示栏数随之改变 */
    width: 50% !important;
    /* https://developer.mozilla.org/docs/Web/CSS/box-sizing */
    box-sizing: border-box !important;
  }

  /* 去除右侧和底部“相关搜索”，部分结果未予显示的提示 */
  #b_context,
  .b_ad,
  .b_ans,
  .b_msg {
    display: none !important;
  }
  `;

  const css_Mobile = `
  /* 国际版底部 APP 推广 */
  .opal_serpftrc {display: none !important;}
  `;

  GM.addStyle(css);

  navigator.userAgent.includes('Mobile') ? GM.addStyle(css_Mobile) : GM.addStyle(css_PC);
}

/**
 * https://www.30secondsofcode.org/js/s/array-includes-all-values/
 * Safe search level
 * Theme
 * Open outgoing links in a new tab
 */
if (location.host === 'lite.qwant.com') {
  const includesAll = (arr, values) => values.every((v) => arr.includes(v));
  if (!includesAll(location.href, ['&s=0', '&theme=1', '&b=1'])) {
    location.href += '&s=0&theme=1&b=1';
  }
}
