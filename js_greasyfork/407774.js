// ==UserScript==
// @name         Bilibili AntiBV
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://github.com/sevtdy/bilibili-antibv
// @version      1.0
// @description  将搜索结果、观看视频页面地址栏中的 bv还原成 av
// @author       sevtdy
// @include      /^https:\/\/www\.bilibili\.com\/video\/[Bb][Vv]/
// @include      /^https:\/\/search\.bilibili\.com\/(all|video)\?/
// @require      https://cdn.jsdelivr.net/npm/simple-query-string@1.3.2/src/simplequerystring.min.js
// @license      WTFPL
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407774/Bilibili%20AntiBV.user.js
// @updateURL https://update.greasyfork.org/scripts/407774/Bilibili%20AntiBV.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // https://www.zhihu.com/question/381784377/answer/1099438784
  const bv2av = (bv) => {
    if (!bv) return;

    const pos = [11, 10, 3, 8, 4, 6];
    const base = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
    const table = {};
    for (let i = 0; i < base.length; i++) table[base[i]] = i;

    let r = 0;
    for (let i = 0; i < pos.length; i++) r += table[bv[pos[i]]] * 58 ** i;
    return (r - 8728348608) ^ 177451812;
  };
  const purgeSearchString = (searchString = location.search) => {
    const { p, t } = simpleQueryString.parse(searchString);
    const result = simpleQueryString.stringify({ p, t });
    return result ? `?${result}` : '';
  };
  const get = (key) => {
    const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    const is = win.__INITIAL_STATE__ || {};
    return is[key] || (is.videoData && is.videoData[key]) || win[key];
  };

  const href = window.location.href;
  if (href.match(/^https:\/\/search\.bilibili\.com\/(all|video)\?/)) {
    const convertURL = () => {
      Array.prototype.forEach.call($('.video-item a[class=title],a[class=img-anchor]'), (item) => {
        const bv = item.href.match(/bilibili.com\/video\/(BV\S+)\?/);
        if (!bv) return;
        item.href = `//www.bilibili.com/video/av${bv2av(bv[1])}${purgeSearchString(item.search)}`;
      });
    };
    convertURL();
    new MutationObserver((mutations, self) => {
      mutations.forEach(({ target, addedNodes }, index) => {
        // 翻页
        if (target.className.includes('flow-loader')) {
          addedNodes.forEach((node) => {
            if (node.nodeName === 'UL' && node.className.includes('video-list')) {
              // 后面还会有相关 a 标签修改 attribute 的监听，
              // convertURL 放在最后更新 dom 前操作
              // 或者改为监听 attributes 变化再修改？
              requestAnimationFrame(() => {
                convertURL();
              });
            }
          });
        }
        // tab 切换
        if (target.className.includes('body-contain')) {
          addedNodes.forEach((node) => {
            if (node.nodeName === 'DIV' && ['video-list', 'all-list'].includes(node.id)) {
              requestAnimationFrame(() => {
                convertURL();
              });
            }
          });
        }
      });
    }).observe($('.body-contain')[0], { childList: true, subtree: true });
  }
  if (href.match(/^https:\/\/www\.bilibili\.com\/video\/[Bb][Vv]/)) {
    const av = get('aid') || bv2av(get('bvid'));
    if (av)
      history.replaceState(
        null,
        '',
        `https://www.bilibili.com/video/av${av}${purgeSearchString()}${window.location.hash}`
      );
  }
})();
