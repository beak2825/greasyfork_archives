// ==UserScript==
// @name              Cookie & Storage & IndexedDB 助手
// @namespace         https://github.com/tampermonkey-helper
// @version           3.0.2
// @author            Hacker
// @description       一键导入导出 Cookie / LocalStorage / SessionStorage / IndexedDB
// @license           MIT
// @homepage          https://greasyfork.org/zh-CN/scripts/466889
// @supportURL        https://greasyfork.org/zh-CN/scripts/466889/feedback
// @match             *://*/*
// @include           *
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource          toastrStyle https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @connect           *
// @noframes
// @run-at            document-idle
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @grant             GM_setClipboard
// @grant             GM_cookie
// @grant             GM_download
// @icon              data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxwYXRoIGQ9Ik0xMjMuNjQ4IDE3OC4zNDdDMzYxLjY0My05OC42MDMgODAyLjk4Ny00My45NDcgOTY3LjkzNiAyNzkuNjhINTcxLjQzNWMtNzEuNDI0IDAtMTE3LjU0Ny0xLjYyMS0xNjcuNTEgMjQuNjYxLTU4LjcwOSAzMC45MzQtMTAyLjk5NyA4OC4yMzUtMTE4LjQ4NSAxNTUuNTJMMTIzLjY0OCAxNzguMzl6IiBmaWxsPSIjRUE0MzM1Ii8+PHBhdGggZD0iTTM0MS42NzUgNTEyYzAgOTMuODY3IDc2LjMzIDE3MC4yNCAxNzAuMTU0IDE3MC4yNCA5My44NjcgMCAxNzAuMTU1LTc2LjM3MyAxNzAuMTU1LTE3MC4yNHMtNzYuMzMtMTcwLjI0LTE3MC4xNTUtMTcwLjI0Yy05My44NjYgMC0xNzAuMTU0IDc2LjM3My0xNzAuMTU0IDE3MC4yNHoiIGZpbGw9IiM0Mjg1RjQiLz48cGF0aCBkPSJNNTc3Ljg3NyA3MzQuODQ4Yy05NS41MyAyOC4zNzMtMjA3LjI3NC0zLjExNS0yNjguNTAxLTEwOC44LTQ2Ljc2My04MC42NC0xNzAuMjQtMjk1Ljc2NS0yMjYuMzQ3LTM5My41NTctMTk2LjU2NSAzMDEuMjI2LTI3LjEzNiA3MTEuODA4IDMyOS42ODYgNzgxLjg2NmwxNjUuMTItMjc5LjUwOXoiIGZpbGw9IiMzNEE4NTMiLz48cGF0aCBkPSJNNjY5Ljg2NyAzNDEuNzZhMjMzLjEzIDIzMy4xMyAwIDAgMSA0My4wMDggMjg2LjYzNWMtNDAuNTc2IDY5Ljk3My0xNzAuMTU1IDI4OC42ODItMjMyLjk2IDM5NC41ODEgMzY3LjY1OCAyMi42NTYgNjM1LjczMy0zMzcuNjY0IDUxNC42NDUtNjgxLjI1OUg2NjkuODY3eiIgZmlsbD0iI0ZCQkMwNSIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/466889/Cookie%20%20Storage%20%20IndexedDB%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466889/Cookie%20%20Storage%20%20IndexedDB%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const customClass = {
    popup: 'log-popup',
    header: 'log-header',
    title: 'log-title',
    closeButton: 'log-close',
    content: 'log-content',
    footer: 'log-footer'
  };

  const domain = location.hostname;

  let toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  let main = {
    addStyle() {
      GM_addStyle(`
          .log-popup {font-size: 16px}
          #tm-hide-control {background: #0D9488; color:#fff; cursor: pointer; position: absolute; top: 50%; transform: translateY(-50%); user-select: none; width: 16px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 12px;}
          #tm-btn-box.tm-position-right #tm-hide-control {left: -16px; border-radius: 4px 0 0 4px; box-shadow: -2px 0 6px rgba(13,148,136,0.3);}
          #tm-btn-box.tm-position-left #tm-hide-control {right: -16px; border-radius: 0 4px 4px 0; box-shadow: 2px 0 6px rgba(13,148,136,0.3);}
          #tm-hide-control:hover { background: #0f766e; }
          .tm-hide {display: none !important; }
          #tm-btn-box { z-index:999999999; position: fixed; top: 50%; transform: translateY(-50%); font-size:12px; }
          #tm-btn-box.tm-position-right { right: 0; }
          #tm-btn-box.tm-position-left { left: 0; }
          #tm-content { background: #fff; padding: 10px; box-shadow: -3px 0 15px rgba(0,0,0,0.12); min-width: 120px;}
          #tm-btn-box.tm-position-right #tm-content { border-radius: 10px 0 0 10px; box-shadow: -3px 0 15px rgba(0,0,0,0.12); }
          #tm-btn-box.tm-position-left #tm-content { border-radius: 0 10px 10px 0; box-shadow: 3px 0 15px rgba(0,0,0,0.12); }
          .tm-btn { cursor: pointer; padding: 7px 10px; background: #0D9488; margin: 4px 0; color: #fff; border-radius: 6px; text-align: center; font-size: 12px;}
          .tm-btn:hover { background: #0f766e; }
          .tm-btn-oneclick { background: #f59e0b; }
          .tm-btn-oneclick:hover { background: #d97706; border-color: #b45309; }
          .tm-task { display: inline-block; padding: 4px 8px; margin: 2px; line-height: 1.3; position: relative; color: #444; border-radius: 4px; background: #f0fdfa; font-size: 11px;}
          .tm-task:hover { background: #ccfbf1; }
          .task-list { padding: 6px 4px; margin-top: 6px; border-radius: 6px; text-align: center; background: #f0fdfa;}
          .tm-btn-row { display: flex; gap: 4px; }
          .tm-btn-row .tm-btn { flex: 1; margin: 4px 0; }
          #inputImportCookies,#inputImportLocalStorages,#inputImportSessionStorages,#inputImportIndexedDB,#inputImportAll{ position: absolute; left:0; top:0; overflow: hidden; height: 100%; width: 100%; opacity: 0; cursor: pointer; }
        `);
      GM_addStyle(GM_getResourceText('toastrStyle'));
    },

    initValue() {
      let value = [{ name: 'show', value: true }, { name: 'position', value: 'right' }];
      value.forEach((v) => {
        util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
      });
    },

    addButton() {
      const position = util.getValue('position') || 'right';
      let button = $(`
          <div id="tm-btn-box" class="tm-position-${position}">
            <div id="tm-hide-control">${util.getValue('show') ? (position === 'right' ? '›' : '‹') : (position === 'right' ? '‹' : '›')}</div>
            <div id="tm-content" class="${util.getValue('show') ? '' : 'tm-hide'}">
  
              <div class="tm-btn">🍪 Cookie
                <div class="task-list">
                  <div class="tm-task task-import-cookie-string">📥 导入字符串</div>
                  <div class="tm-task task-export-cookie-string">📤 导出字符串</div><br>
                  <div class="tm-task task-import-cookie"><input type="file" id="inputImportCookies" accept=".txt,.json">📁 导入</div>
                  <div class="tm-task task-export-cookie">💾 导出</div>
                </div>
              </div>
  
              <div class="tm-btn">📦 LocalStorage
                <div class="task-list">
                  <div class="tm-task task-import-localstorage"><input type="file" id="inputImportLocalStorages" accept=".txt,.json">📁 导入</div>
                  <div class="tm-task task-export-localstorage">💾 导出</div>
                </div>
              </div>

              <div class="tm-btn">⏱️ SessionStorage
                <div class="task-list">
                  <div class="tm-task task-import-sessionstorage"><input type="file" id="inputImportSessionStorages" accept=".txt,.json">📁 导入</div>
                  <div class="tm-task task-export-sessionstorage">💾 导出</div>
                </div>
              </div>
  
              <div class="tm-btn">🗄️ IndexedDB
                <div class="task-list">
                  <div class="tm-task task-import-indexeddb"><input type="file" id="inputImportIndexedDB" accept=".txt,.json">📁 导入</div>
                  <div class="tm-task task-export-indexeddb">💾 导出</div>
                </div>
              </div>
  
              <div class="tm-btn tm-btn-oneclick">🚀 一键操作
                <div class="task-list">
                  <div class="tm-task task-import-all"><input type="file" id="inputImportAll" accept=".json">📁 导入全部</div>
                  <div class="tm-task task-export-all">💾 导出全部</div>
                </div>
              </div>

              <div class="tm-btn-row">
                <div class="tm-btn" onclick="history.go(0)">🔄 刷新</div>
                <div class="tm-btn task-toggle-position">📍 切换</div>
              </div>
            </div>
          </div>
        `);
      $('body').append(button);
    },

    addPageListener() {
      $('body').on('click', '#tm-hide-control', () => {
        util.setValue('show', !util.getValue('show'));
        const show = util.getValue('show');
        const position = util.getValue('position') || 'right';
        show ? $('#tm-content').removeClass('tm-hide') : $('#tm-content').addClass('tm-hide');
        $('#tm-hide-control').text(show ? (position === 'right' ? '›' : '‹') : (position === 'right' ? '‹' : '›'));
      });

      $('body').on('click', '.task-toggle-position', () => {
        const currentPosition = util.getValue('position') || 'right';
        const newPosition = currentPosition === 'right' ? 'left' : 'right';
        util.setValue('position', newPosition);
        $('#tm-btn-box').removeClass('tm-position-right tm-position-left').addClass(`tm-position-${newPosition}`);
        const show = util.getValue('show');
        $('#tm-hide-control').text(show ? (newPosition === 'right' ? '›' : '‹') : (newPosition === 'right' ? '‹' : '›'));
        toastr.success(`面板已切换到${newPosition === 'right' ? '右侧' : '左侧'}`);
      });

      // ================= Cookie String：导入（host-only，保持不补点） =================
      $('body').on('click', '.task-import-cookie-string', async () => {
        Swal.fire({
          title: '输入Cookie',
          width: '600px',
          html: `<textarea style="width: 100%; height: 200px;" id="cookieString"></textarea>`,
          confirmButtonText: '确定',
          showLoaderOnConfirm: true,
          customClass
        }).then((result) => {
          if (!result.isConfirmed) return;

          let cookieString = $('#cookieString').val();
          if (!cookieString || !cookieString.trim()) return;
          let cookiesArray = cookieString.split(';');
          let count = 0;
          for (const item of cookiesArray) {
            const idx = item.indexOf('=');
            if (idx === -1) continue;
            let val = {
              name: item.slice(0, idx).trim(),
              value: item.slice(idx + 1).trim(),
              url: location.origin,
              path: '/',
              expires: 2147483647,
              httpOnly: false,
              secure: false,
              session: false,
              hostOnly: true
            };
            util.importCookie(val);
            count++;
          }
          if (count > 0) toastr.success(`已导入 ${count} 个Cookie`);
        });
      });

      // ================= Cookie String：导出 =================
      $('body').on('click', '.task-export-cookie-string', async () => {
        let cookies = await util.exportCookie();
        if (!cookies || !cookies.length) {
          toastr.warning('当前页面没有Cookie');
          return;
        }
        let cookieValue = cookies.map((item) => item.name + '=' + item.value).join('; ');
        Swal.fire({
          title: '当前Cookie',
          width: '600px',
          html: `<textarea style="width: 100%; height: 200px;">${cookieValue}</textarea>`,
          confirmButtonText: '复制',
          showLoaderOnConfirm: true,
          customClass
        }).then(async (result) => {
          if (result.isConfirmed) GM_setClipboard(cookieValue);
        });
      });

      // 导入Cookie 文件（避免每次 click 重复绑定 change）
      util.bindFileOnce('#inputImportCookies', async (text) => {
        let cookies;
        try {
          cookies = JSON.parse(text);
        } catch (e) {
          toastr.error('JSON解析失败');
          return;
        }
        if (!Array.isArray(cookies)) {
          toastr.error('Cookie文件格式错误');
          return;
        }
        for (const cookie of cookies) {
          util.importCookie(cookie);
        }
        toastr.success('Cookie 导入完成');
      });
      $('body').on('click', '.task-import-cookie', (event) => event.stopPropagation());

      // 导出Cookie
      $('body').on('click', '.task-export-cookie', async (event) => {
        event.stopPropagation();
        let cookies = await util.exportCookie();
        if (!cookies || !cookies.length) {
          toastr.warning('当前页面没有Cookie');
          return;
        }
        // ✅ 为了再次导入时 host-only 更稳，补上 url（不改变原 cookie 内容，只是导出文件更友好）
        cookies = (cookies || []).map(c => {
          if (!c.url) c.url = location.origin;
          return c;
        });

        let text = JSON.stringify(cookies, null, 2);
        util.downloadText(text, `[${domain}]_cookie.json`);
        toastr.success('Cookie 导出成功');
      });

      // ================= LocalStorage：导入 =================
      util.bindFileOnce('#inputImportLocalStorages', async (text) => {
        let localStorages;
        try {
          localStorages = JSON.parse(text);
        } catch (e) {
          toastr.error('JSON解析失败');
          return;
        }
        if (typeof localStorages !== 'object' || Array.isArray(localStorages)) {
          toastr.error('LocalStorage文件格式错误');
          return;
        }
        for (let key in localStorages) {
          if (localStorages.hasOwnProperty(key)) {
            window.localStorage.setItem(key, localStorages[key]);
          }
        }
        toastr.success('LocalStorage 导入成功');
      });
      $('body').on('click', '.task-import-localstorage', (event) => event.stopPropagation());

      // ================= LocalStorage：导出 =================
      $('body').on('click', '.task-export-localstorage', async (event) => {
        event.stopPropagation();
        const localObj = {};
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          localObj[key] = window.localStorage.getItem(key);
        }
        if (!Object.keys(localObj).length) {
          toastr.warning('当前页面没有LocalStorage数据');
          return;
        }
        let text = JSON.stringify(localObj, null, 2);
        util.downloadText(text, `[${domain}]_localstorage.json`);
        toastr.success('LocalStorage 导出成功');
      });

      // ================= SessionStorage：导入 =================
      util.bindFileOnce('#inputImportSessionStorages', async (text) => {
        let sessionStorages;
        try {
          sessionStorages = JSON.parse(text);
        } catch (e) {
          toastr.error('JSON解析失败');
          return;
        }
        if (typeof sessionStorages !== 'object' || Array.isArray(sessionStorages)) {
          toastr.error('SessionStorage文件格式错误');
          return;
        }
        for (let key in sessionStorages) {
          if (sessionStorages.hasOwnProperty(key)) {
            window.sessionStorage.setItem(key, sessionStorages[key]);
          }
        }
        toastr.success('SessionStorage 导入成功');
      });
      $('body').on('click', '.task-import-sessionstorage', (event) => event.stopPropagation());

      // ================= SessionStorage：导出 =================
      $('body').on('click', '.task-export-sessionstorage', async (event) => {
        event.stopPropagation();
        const sessionObj = {};
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          sessionObj[key] = window.sessionStorage.getItem(key);
        }
        if (!Object.keys(sessionObj).length) {
          toastr.warning('当前页面没有SessionStorage数据');
          return;
        }
        let text = JSON.stringify(sessionObj, null, 2);
        util.downloadText(text, `[${domain}]_sessionstorage.json`);
        toastr.success('SessionStorage 导出成功');
      });

      // ========= IndexedDB：导入 =========
      util.bindFileOnce('#inputImportIndexedDB', async (text) => {
        let payload;
        try {
          payload = JSON.parse(text);
        } catch (e) {
          toastr.error('JSON解析失败');
          return;
        }

        // 兼容数组格式和对象格式
        const databases = Array.isArray(payload) ? payload : (payload.databases || []);
        if (!databases.length) {
          util.message.error('IndexedDB 文件格式不正确');
          return;
        }

        const confirm = await Swal.fire({
          title: '确认导入 IndexedDB？',
          html: `<div style="text-align:left;font-size:13px;line-height:18px;">
                    <div>将以 <b>覆盖模式</b> 导入（会先删除同名 DB 再重建）。</div>
                    <div style="margin-top:6px;color:#a00;">注意：这可能导致站点登录态/缓存变化，必要时导入后刷新页面。</div>
                  </div>`,
          showCancelButton: true,
          confirmButtonText: '确认覆盖导入',
          cancelButtonText: '取消',
          customClass
        });

        if (!confirm.isConfirmed) return;

        for (const dbDump of databases) {
          try {
            await util.idbImportDatabaseOverwrite(dbDump);
            toastr.success(dbDump.name, 'IndexedDB 导入成功');
          } catch (e) {
            console.error(e);
            toastr.error(dbDump.name, 'IndexedDB 导入失败');
          }
        }
      });
      $('body').on('click', '.task-import-indexeddb', (event) => event.stopPropagation());

      // ========= IndexedDB：导出 =========
      $('body').on('click', '.task-export-indexeddb', async (event) => {
        event.stopPropagation();

        try {
          const dump = await util.idbExportAllDatabases();
          if (!dump || !dump.length) {
            toastr.warning('当前页面没有IndexedDB数据');
            return;
          }
          const text = JSON.stringify(dump, null, 2);
          util.downloadText(text, `[${domain}]_indexeddb.json`);
          util.message.success('IndexedDB 导出完成');
        } catch (e) {
          console.error(e);
          util.message.error('IndexedDB 导出失败：' + (e?.message || e));
        }
      });

      // ========= 一键导入 =========
      util.bindFileOnce('#inputImportAll', async (text) => {
        let payload;
        try {
          payload = JSON.parse(text);
        } catch (e) {
          util.message.error('JSON 解析失败');
          return;
        }

        const types = [];
        if (payload.cookies) types.push('Cookie');
        if (payload.localStorage) types.push('LocalStorage');
        if (payload.sessionStorage) types.push('SessionStorage');
        const idbData = Array.isArray(payload.indexedDB) ? payload.indexedDB : (payload.indexedDB?.databases || []);
        if (idbData.length) types.push('IndexedDB');

        if (!types.length) {
          util.message.error('文件中无可导入数据');
          return;
        }

        const confirm = await Swal.fire({
          title: '确认一键导入？',
          html: `<div style="text-align:left;font-size:13px;">将导入: <b>${types.join(', ')}</b></div>`,
          showCancelButton: true,
          confirmButtonText: '确认导入',
          cancelButtonText: '取消',
          customClass
        });
        if (!confirm.isConfirmed) return;

        // Cookie
        if (payload.cookies && Array.isArray(payload.cookies)) {
          for (const c of payload.cookies) {
            util.importCookie(c);
          }
          toastr.success('Cookie 导入完成');
        }

        // LocalStorage
        if (payload.localStorage && typeof payload.localStorage === 'object') {
          for (const key in payload.localStorage) {
            if (payload.localStorage.hasOwnProperty(key)) {
              window.localStorage.setItem(key, payload.localStorage[key]);
            }
          }
          toastr.success('LocalStorage 导入成功');
        }

        // SessionStorage
        if (payload.sessionStorage && typeof payload.sessionStorage === 'object') {
          for (const key in payload.sessionStorage) {
            if (payload.sessionStorage.hasOwnProperty(key)) {
              window.sessionStorage.setItem(key, payload.sessionStorage[key]);
            }
          }
          toastr.success('SessionStorage 导入成功');
        }

        // IndexedDB
        if (idbData.length) {
          for (const dbDump of idbData) {
            try {
              await util.idbImportDatabaseOverwrite(dbDump);
              toastr.success(dbDump.name, 'IndexedDB 导入成功');
            } catch (e) {
              console.error(e);
              toastr.error(dbDump.name, 'IndexedDB 导入失败');
            }
          }
        }

        util.message.success('一键导入完成');
      });
      $('body').on('click', '.task-import-all', (event) => event.stopPropagation());

      // ========= 一键导出 =========
      $('body').on('click', '.task-export-all', async (event) => {
        event.stopPropagation();

        const result = {
          cookies: null,
          localStorage: null,
          sessionStorage: null,
          indexedDB: null
        };

        try {
          // Cookie
          const cookies = await util.exportCookie();
          result.cookies = (cookies || []).map(c => {
            if (!c.url) c.url = location.origin;
            return c;
          });

          // LocalStorage
          const localObj = {};
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            localObj[key] = window.localStorage.getItem(key);
          }
          result.localStorage = localObj;

          // SessionStorage
          const sessionObj = {};
          for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            sessionObj[key] = window.sessionStorage.getItem(key);
          }
          result.sessionStorage = sessionObj;

          // IndexedDB
          result.indexedDB = await util.idbExportAllDatabases();

          const text = JSON.stringify(result, null, 2);
          util.downloadText(text, `[${domain}]_all.json`);
          util.message.success('一键导出完成');
        } catch (e) {
          console.error(e);
          util.message.error('一键导出失败：' + (e?.message || e));
        }
      });
    },

    async init() {
      this.initValue();
      this.addStyle();
      this.addButton();
      this.addPageListener();
    }
  };

  let util = {
    getValue(name) {
      return GM_getValue(name);
    },
    setValue(name, value) {
      GM_setValue(name, value);
    },

    downloadText(text, filename) {
      let blob = new Blob([text], { type: 'application/json' });
      let url = URL.createObjectURL(blob);
      GM_download({ url, name: filename, onload: () => URL.revokeObjectURL(url), onerror: () => URL.revokeObjectURL(url) });
    },

    // 避免每次 click 重复绑定 change：只绑定一次
    bindFileOnce(selector, onText) {
      const input = document.querySelector(selector);
      if (!input || input.__tm_bound__) return;
      input.__tm_bound__ = true;

      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            await onText(reader.result);
          } catch (e) {
            console.error(e);
            toastr.error('文件解析失败', '导入失败');
          } finally {
            // 允许再次选择同一个文件
            input.value = '';
          }
        };
        reader.readAsText(file);
      });
    },

    /**
     * 导入Cookie（保持 domain 原样：带点就带、不带就不带）
     * - hostOnly（或传了 url 且没有 domain）=> 用 url 方式写入，不传 domain，避免前导点被补上
     * - 非 hostOnly => 使用 domain 原样写入（例如 ".xx.com" 继续保持）
     */
    importCookie(value) {
      if (!GM_cookie) return;

      const isHostOnly = value.hostOnly === true || (!!value.url && !value.domain);

      // 删除参数要跟设置方式匹配
      const delDetail = isHostOnly
        ? { name: value.name, url: value.url || location.origin }
        : { name: value.name, domain: value.domain, path: value.path || '/' };

      GM_cookie.delete(delDetail, () => {
        if (value.name === 'bt_sessionid') value.httpOnly = true;

        const setDetail = {
          name: value.name,
          value: value.value,
          path: value.path || '/',
          expires: value.expires,
          httpOnly: !!value.httpOnly,
          secure: !!value.secure,
          session: !!value.session
        };

        if (isHostOnly) {
          setDetail.url = value.url || location.origin; // ✅ 不传 domain => 不补点
        } else {
          setDetail.domain = value.domain;              // ✅ 原样保留（带点就带）
        }

        GM_cookie.set(setDetail, () => {
          // 移除单个成功提示，避免批量导入时刷屏
        });
      });
    },

    exportCookie() {
      return new Promise((resolve, reject) => {
        if (!GM_cookie) return resolve([]);
        GM_cookie('list', { url: location.origin }, (cookies, error) => {
          if (!error) return resolve(cookies);
          reject(error);
        });
      });
    },

    // =========================
    // IndexedDB Export / Import
    // =========================
    async idbGetDatabaseNames() {
      if (indexedDB.databases) {
        const list = await indexedDB.databases();
        const names = (list || []).map(x => x && x.name).filter(Boolean);
        return Array.from(new Set(names));
      }

      const res = await Swal.fire({
        title: '当前浏览器不支持 indexedDB.databases()',
        width: '650px',
        html: `
            <div style="text-align:left;font-size:13px;line-height:18px;">
              <div>请手动输入要导出的数据库名称（多个用逗号分隔）。</div>
              <div style="margin-top:6px;color:#555;">提示：可在 DevTools -> Application -> IndexedDB 查看名称。</div>
              <textarea id="idbNames" style="margin-top:8px;width:100%;height:90px;"></textarea>
            </div>
          `,
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        customClass
      });
      if (!res.isConfirmed) return [];
      const raw = (document.getElementById('idbNames')?.value || '').trim();
      if (!raw) return [];
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    },

    idbDeleteDatabase(name) {
      return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(name);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(true);
        req.onblocked = () => resolve(true);
      });
    },

    idbTxDone(tx) {
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
      });
    },

    async idbExportDatabase(dbName) {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
      });

      const dump = { name: db.name, version: db.version, stores: [] };
      const storeNames = Array.from(db.objectStoreNames || []);

      for (const storeName of storeNames) {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        const storeInfo = {
          name: store.name,
          keyPath: store.keyPath ?? null,
          autoIncrement: !!store.autoIncrement,
          indexes: [],
          records: []
        };

        for (let i = 0; i < store.indexNames.length; i++) {
          const idxName = store.indexNames[i];
          const idx = store.index(idxName);
          storeInfo.indexes.push({
            name: idx.name,
            keyPath: idx.keyPath ?? null,
            unique: !!idx.unique,
            multiEntry: !!idx.multiEntry
          });
        }

        await new Promise((resolve, reject) => {
          const req = store.openCursor();
          req.onerror = () => reject(req.error);
          req.onsuccess = () => {
            const cursor = req.result;
            if (!cursor) return resolve(true);
            storeInfo.records.push({ key: cursor.key, value: cursor.value });
            cursor.continue();
          };
        });

        await util.idbTxDone(tx);
        dump.stores.push(storeInfo);
      }

      db.close();
      return dump;
    },

    async idbExportAllDatabases() {
      const names = await util.idbGetDatabaseNames();
      const databases = [];

      for (const name of names) {
        try {
          const dbDump = await util.idbExportDatabase(name);
          databases.push(dbDump);
        } catch (e) {
          console.warn('Export DB failed:', name, e);
          toastr.error(name, 'IndexedDB 导出失败(可能含不可序列化数据)');
        }
      }
      return databases;
    },

    async idbImportDatabaseOverwrite(dbDump) {
      if (!dbDump?.name) throw new Error('Invalid db dump');

      await util.idbDeleteDatabase(dbDump.name);

      await new Promise((resolve, reject) => {
        const req = indexedDB.open(dbDump.name, dbDump.version || 1);

        req.onerror = () => reject(req.error);

        req.onupgradeneeded = () => {
          const db = req.result;

          for (const s of (dbDump.stores || [])) {
            const options = {};
            if (s.keyPath !== null && s.keyPath !== undefined) options.keyPath = s.keyPath;
            if (s.autoIncrement) options.autoIncrement = true;

            const store = db.createObjectStore(s.name, options);

            for (const idx of (s.indexes || [])) {
              store.createIndex(idx.name, idx.keyPath, {
                unique: !!idx.unique,
                multiEntry: !!idx.multiEntry
              });
            }
          }
        };

        req.onsuccess = async () => {
          const db = req.result;

          try {
            for (const s of (dbDump.stores || [])) {
              const tx = db.transaction(s.name, 'readwrite');
              const store = tx.objectStore(s.name);

              for (const r of (s.records || [])) {
                try {
                  if (s.keyPath !== null && s.keyPath !== undefined) {
                    store.put(r.value);
                  } else {
                    store.put(r.value, r.key);
                  }
                } catch (e) {
                  console.warn('put failed', dbDump.name, s.name, r?.key, e);
                }
              }

              await util.idbTxDone(tx);
            }

            db.close();
            resolve(true);
          } catch (e) {
            db.close();
            reject(e);
          }
        };
      });
    },

    message: {
      success(text) { toast.fire({ title: text, icon: 'success' }); },
      error(text) { toast.fire({ title: text, icon: 'error' }); }
    }
  };

  main.init();
})();
