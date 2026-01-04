// ==UserScript==
// @name           游戏库检测-gog
// @name:en        Gog Game Library Check
// @namespace      gog-game-library-check
// @version        1.0.9
// @description    检测gog游戏是否已拥有。
// @description:en Check if the game of GOG is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://www.gog.com/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @include        *
// @exclude        *://www.gog.com/*
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @connect        www.gog.com
// @run-at         document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405171/%E6%B8%B8%E6%88%8F%E5%BA%93%E6%A3%80%E6%B5%8B-gog.user.js
// @updateURL https://update.greasyfork.org/scripts/405171/%E6%B8%B8%E6%88%8F%E5%BA%93%E6%A3%80%E6%B5%8B-gog.meta.js
// ==/UserScript==

(function () {
  const whiteList = GM_getValue('whiteList') || [];
  const blackList = GM_getValue('blackList') || [];
  const url = window.location.href;
  let enable = true;
  let loadTimes = 0;

  if (whiteList.length > 0) {
    enable = false;
    for (const e of whiteList) {
      if (url.includes(e)) {
        enable = true;
        break;
      }
    }
  } else if (blackList.length > 0) {
    enable = true;
    for (const e of blackList) {
      if (url.includes(e)) {
        enable = false;
        break;
      }
    }
  }

  if (!enable) return;

  if (getGogGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到gog游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value) updateGogGameLibrary();
    });
  } else {
    checkGogGame();
  }

  const observer = new MutationObserver(() => { checkGogGame(false, true); });
  observer.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  async function checkGogGame(first = true, again = false) {
    loadTimes++;
    if (loadTimes > 1000) {
      observer.disconnect();
      return;
    }
    const gogGames = getGogGameLibrary();
    const gogLink = again ?
      $('a[href*="www.gog.com/"]:not(".gog-game-checked")') :
      $('a[href*="www.gog.com/"]:not(".gog-game-link-owned")');
    if (gogLink.length === 0) return;
    if (first) updateGogGameLibrary(false);
    gogLink.map((i, e) => {
      const $this = $(e);
      $this.addClass('gog-game-checked');
      let href = $this.attr('href');
      if (!/\/$/.test(href)) href += '/';
      const gogGameLink = href.match(/https?:\/\/www.gog.com\/([\w]+?\/)game\/([\d\w_]+)/i)?.[2];
      if (gogGameLink && gogGames.includes(gogGameLink.toLowerCase())) {
        $this.addClass('gog-game-link-owned');
      }
      return e;
    });
  }
  function getGogGameLibrary() {
    return GM_getValue('gogGames') || [];
  }
  function updateGogGameLibrary(loop = true, i = 1, games = []) {
    if (!loop && i !== 1) {
      GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])]);
      checkGogGame(false);
      return;
    }
    return new Promise((resolve, reject) => {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新gog游戏库数据...',
          text: `第 ${i} 页`,
          icon: 'info'
        });
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${i}&sortBy=date_purchased`,
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then(async (response) => {
      if (/openlogin/i.test(response.finalUrl)) {
        if (loop) {
          Swal.fire({
            title: '获取gog游戏库数据失败！',
            text: '请先登录',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: '登录',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            if (value) GM_openInTab('https://www.gog.com/#openlogin', { active: true, insert: true, setParent: true });
          });
        } else {
          $('body').overhang({
            type: 'error',
            message: 'GOG登录凭证已过期，请重新登录<a href="https://www.gog.com/#openlogin" target="_blank">https://www.gog.com/#openlogin</a>',
            html: true,
            closeConfirm: true
          });
        }
        return false;
      } else if (response.response?.products?.length) {
        games = [...games, ...response.response.products.map((e) => (e?.slug || e?.url?.split('/')?.[e?.url?.split('/').length - 1]))]; // eslint-disable-line

        if (response.response?.totalPages > i) {
          return await updateGogGameLibrary(loop, ++i, games); // eslint-disable-line
        } else if (loop) {
          GM_setValue('gogGames', [...new Set(games)].filter((e) => e));
          return Swal.update({
            icon: 'success',
            title: 'gog游戏库数据更新完成',
            text: ''
          });
        }
        GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])].filter((e) => e));
        checkGogGame(false);
        return true;
      } else if (response.response?.products?.length !== 0) {
        console.error(response);
        return Swal.update({
          icon: 'error',
          title: 'gog游戏库数据更新失败',
          text: '详情请查看控制台'
        });
      }
    })
      .catch((error) => {
        console.error(error);
        return Swal.update({
          icon: 'error',
          title: 'gog游戏库数据更新失败',
          text: '详情请查看控制台'
        });
      });
  }
  function addWhiteList() {
    const whiteList = GM_getValue('whiteList') || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', []);
    });
  }
  function addBlackList() {
    const blackList = GM_getValue('blackList') || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', []);
    });
  }
  function setting() {
    Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '白名单网站',
      denyButtonText: '黑名单网站',
      cancelButtonText: '关闭'
    }).then(({ isConfirmed, isDenied }) => {
      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }
  GM_registerMenuCommand('更新gog游戏库', updateGogGameLibrary);
  GM_registerMenuCommand('设置', setting);

  GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
  GM_addStyle(GM_getResourceText('overhang'));
}());
