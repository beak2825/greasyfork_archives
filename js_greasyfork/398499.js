// ==UserScript==
// @name         Bilibili AntiBV
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://moe.best/
// @version      1.9.6
// @description  自动在地址栏中将 bv 还原为 av，非重定向，不会导致页面刷新，顺便清除 search string 中所有无用参数
// @author       神代绮凛
// @include      /^https:\/\/www\.bilibili\.com\/(s\/)?video\/[BbAa][Vv]/
// @require      https://code.bdstatic.com/npm/simple-query-string@1.3.2/src/simplequerystring.min.js
// @license      WTFPL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398499/Bilibili%20AntiBV.user.js
// @updateURL https://update.greasyfork.org/scripts/398499/Bilibili%20AntiBV.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let REDIRECT_S_LINK = GM_getValue('redirect_s_link', true);
  GM_registerMenuCommand('自动重定向 /s/video/xxx', () => {
    REDIRECT_S_LINK = confirm(`自动将 /s/video/xxx 重定向至 /video/xxx
“确定”开启，“取消”关闭
当前：${REDIRECT_S_LINK ? '开启' : '关闭'}`);
    GM_setValue('redirect_s_link', REDIRECT_S_LINK);
  });

  if (REDIRECT_S_LINK && location.pathname.startsWith('/s/video/')) {
    location.pathname = location.pathname.replace(/^\/s/, '');
    return;
  }

  const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

  const last = arr => arr[arr.length - 1];

  const wrapHistory = method => {
    const fn = win.history[method];
    const e = new Event(method);
    return function () {
      setTimeout(() => window.dispatchEvent(e));
      return fn.apply(this, arguments);
    };
  };
  win.history.pushState = wrapHistory('pushState');

  win.history.replaceState = (() => {
    const fn = win.history.replaceState;
    return function (state, unused, url, isMe) {
      if (isMe) return fn.apply(this, [state, unused, url]);
      try {
        state = { ...history.state, ...state };
        const urlObj = new URL(url.startsWith('/') ? `${location.origin}${url}` : url);
        urlObj.search = purgeSearchString(urlObj.search);
        const bvid = getBvidFromUrl(urlObj.pathname);
        if (bvid) urlObj.pathname = location.pathname;
        url = urlObj.href.replace(urlObj.origin, '');
      } catch (e) {
        console.error(e);
      }
      return fn.apply(this, [state, unused, url]);
    };
  })();

  const getBvidFromUrl = pathname => {
    const lastPath = last(pathname.split('/').filter(v => v));
    return /^bv/i.test(lastPath) ? lastPath : null;
  };
  const getUrl = id => `/video/${id}/${purgeSearchString(location.search)}${location.hash}`;

  // https://github.com/mrhso/IshisashiWebsite/blob/master/%E4%B9%B1%E5%86%99%E7%A8%8B%E5%BC%8F/BV%20%E5%8F%B7%E8%B7%8B%E6%89%88%E3%80%80%EF%BD%9E%20Who%20done%20it!.js
  const bv2av = (() => {
    const charset = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const bvReg = new RegExp(`^[Bb][Vv]1[${charset}]{9}$`);
    const base = BigInt(charset.length);
    const table = {};
    for (let i = 0; i < charset.length; i++) table[charset[i]] = i;
    const xor = 23442827791579n;
    const rangeLeft = 1n;
    const rangeRight = 2n ** 51n;

    /**
     * @param {string} bv
     */
    return bv => {
      if (!bvReg.test(bv)) {
        throw new Error(`Unexpected bv: ${bv}`);
      }

      const chars = bv.split('');
      [chars[3], chars[9]] = [chars[9], chars[3]];
      [chars[4], chars[7]] = [chars[7], chars[4]];

      let result = 0n;
      for (let i = 3; i < 12; i++) {
        result = result * base + BigInt(table[chars[i]]);
      }
      if (result < rangeRight || result >= rangeRight * 2n) {
        throw new RangeError(`Unexpected av result: ${result}`);
      }
      result = result % rangeRight ^ xor;
      if (result < rangeLeft) {
        throw new RangeError(`Unexpected av result: ${result}`);
      }

      return result;
    };
  })();

  const purgeSearchString = search => {
    const { p, t } = simpleQueryString.parse(search);
    const result = simpleQueryString.stringify({ p, t });
    return result ? `?${result}` : '';
  };

  const replaceUrl = () => {
    const bvid = getBvidFromUrl(location.pathname);
    const aid = bv2av(bvid);
    if (!aid) return;
    const avUrl = getUrl(`av${aid}`);
    const BABKey = `BAB-${avUrl}`;
    if (sessionStorage.getItem(BABKey)) {
      console.warn('[Bilibili AntiBV] abort');
      return;
    }
    sessionStorage.setItem(BABKey, 1);
    setTimeout(() => sessionStorage.removeItem(BABKey), 1000);
    history.replaceState({ ...history.state, aid, bvid }, '', avUrl, true);
  };

  const replaceBack = ({ state }) => {
    const { aid, bvid } = state;
    if (!bvid) return;
    history.replaceState(state, '', getUrl(bvid), true);
    setTimeout(() => history.replaceState(state, '', getUrl(`av${aid}`), true));
  };

  window.addEventListener('load', replaceUrl, { once: true });
  window.addEventListener('pushState', replaceUrl);
  window.addEventListener('popstate', replaceBack);
})();
