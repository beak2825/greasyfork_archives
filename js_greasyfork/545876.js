// ==UserScript==
// @name         HTML Source Downloader
// @namespace    https://bsky.app/profile/neon-ai.art
// @homepage     https://bsky.app/profile/neon-ai.art
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄️</text></svg>
// @description  現在のページのHTMLをUTF-8で保存。
// @author       ねおん
// @version      3.9
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/545876/HTML%20Source%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545876/HTML%20Source%20Downloader.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2024 ねおん (Neon)
 * Released under the CC BY-NC 4.0 License.
 * * [EN] Unauthorized re-uploading, modification of authorship, or removal of 
 * author credits is strictly prohibited. If you fork this project, you MUST 
 * retain the original credits.
 * * [JP] 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布する場合は、必ず元の作者名（ねおん）を明記してください。
 * ==============================================================================
 */

(function () {
  'use strict';

  const VERSION = 'v3.9';
  if (window.top !== window.self) return; // サブフレームでは動かさない

  // ========= 設定 =========
  const STORE_KEY = 'html_source_dl__shortcut';
  let userShortcut = GM_getValue(STORE_KEY, 'Alt+Shift+S'); // 全ドメイン共通

  // ========= ユーティリティ =========
  // 整形処理を削除したため、VOID_REは不要になった
  // const VOID_RE = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)\b/i;

  function normalizeShortcutString(s) {
    if (!s) return 'Alt+Shift+S';
    s = String(s).trim().replace(/\s+/g, '');
    // 分解（+区切り、修飾キーは大小不問）
    const parts = s.split('+').map(p => p.toLowerCase());
    const mods = new Set();
    let main = '';
    for (const p of parts) {
      if (['ctrl', 'control'].includes(p)) mods.add('Ctrl');
      else if (['alt', 'option'].includes(p)) mods.add('Alt');
      else if (['shift'].includes(p)) mods.add('Shift');
      else if (['meta', 'cmd', 'command', '⌘'].includes(p)) mods.add('Meta');
      else main = p;
    }
    // メインキーを大文字1文字 or F1.. の形に
    if (!main) main = 'S';
    if (/^key[a-z]$/i.test(main)) main = main.slice(3); // "KeyK"
    if (/^digit[0-9]$/i.test(main)) main = main.slice(5); // "Digit1"
    if (/^[a-z]$/.test(main)) main = main.toUpperCase();
    if (/^f([1-9]|1[0-2])$/i.test(main)) main = main.toUpperCase();
    // 記号などはそのまま（例: Slash, Backquote などの code 名）
    const order = ['Ctrl', 'Alt', 'Shift', 'Meta'];
    const modStr = order.filter(m => mods.has(m)).join('+');
    return (modStr ? modStr + '+' : '') + main;
  }

  function eventMatchesShortcut(e, shortcut) {
    const norm = normalizeShortcutString(shortcut);
    const parts = norm.split('+');
    const mods = new Set(parts.slice(0, -1));
    const keyPart = parts[parts.length - 1];

    const need = {
      Ctrl: mods.has('Ctrl'),
      Alt: mods.has('Alt'),
      Shift: mods.has('Shift'),
      Meta: mods.has('Meta'),
    };
    if (need.Ctrl !== e.ctrlKey) return false;
    if (need.Alt !== e.altKey) return false;
    if (need.Shift !== e.shiftKey) return false;
    if (need.Meta !== e.metaKey) return false;

    // メインキー判定（英数字は e.code 基準）
    const main = keyPart;
    let pressed = '';
    if (e.code.startsWith('Key')) pressed = e.code.slice(3).toUpperCase();
    else if (e.code.startsWith('Digit')) pressed = e.code.slice(5);
    else pressed = e.key.length === 1 ? e.key.toUpperCase() : e.key; // F1 などは e.key

    return pressed === main;
  }

  // ========= ダウンロード本体 =========
  function downloadHTML() {
    try {
      const d = document;
      const dt = d.doctype
        ? `<!DOCTYPE ${d.doctype.name}${
            d.doctype.publicId ? ` PUBLIC "${d.doctype.publicId}"` : ''
          }${!d.doctype.publicId && d.doctype.systemId ? ' SYSTEM' : ''}${
            d.doctype.systemId ? ` "${d.doctype.systemId}"` : ''
          }>\n`
        : '';

      // 元のDOMからouterHTMLを取得
      let html = dt + d.documentElement.outerHTML;

      // meta charset を UTF-8 に統一
      if (/<meta[^>]*charset\s*=\s*["']?[^"'>\s]+["']?[^>]*>/i.test(html)) {
        html = html.replace(
          /<meta[^>]*charset\s*=\s*["']?[^"'>\s]+["']?[^>]*>/i,
          '<meta charset="UTF-8">'
        );
      } else if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, '$&<meta charset="UTF-8">');
      } else {
        html = '<meta charset="UTF-8">' + html;
      }

      /* 📝 v3.9: 巨大ファイルによるクラッシュ/ファイル巨大化リスクを避けるため、整形処理を完全に削除
      html = (p => {
        let i = 0;
        return p
          .replace(/>\s*</g, '><')
          .replace(/></g, '>\n<')
          .split('\n')
          .map(l => {
            // タグ閉じのインデントを減らす
            if (/^<\//u.test(l) && !/.*<\/.+>.*<.+>/u.test(l)) i = Math.max(i - 1, 0);
            // インデントを挿入
            const r = '  '.repeat(Math.max(i, 0)) + l;
            // タグ開きのインデントを増やす（自己終了タグや空要素タグは除く）
            if (
              /^<[^!?/]/u.test(l) &&   // <タグ...
              !/<.+<\/.+>/u.test(l) && // <p>...</p> のようなインラインではない
              !/\/>$/u.test(l) &&      // <br /> のような自己終了ではない
              !VOID_RE.test(l)         // br, img, input などの空要素タグではない
            ){
            i++;
            } return r;
          })
          .join('\n');
      })(html);
      */

      // ファイル名
      const pad = n => String(n).padStart(2, '0');
      const now = new Date();
      const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
        now.getSeconds()
      )}`;
      const path =
        (location.pathname || '/')
          .replace(/\/+/g, '/')
          .replace(/[^a-z0-9\-_.\/]/gi, '_')
          .replace(/^\/|\/$/g, '')
          .replace(/\//g, '_') || 'index';
      const name = (location.hostname || 'page') + '_' + path + '_' + ts + '.html';

      // ダウンロード (Plan A: Blobによる標準ダウンロード)
      try {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const a = d.createElement('a');
        a.download = name;
        a.href = URL.createObjectURL(blob);
        (d.body || d.documentElement).appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 1000);
      } catch (err) {
        // Plan B: フォールバック処理 (サイズチェック付きで互換性を回復)

        // 巨大ファイルによるRangeErrorを防ぐため、安全圏を2500万文字に設定
        const MAX_SAFE_CHARS = 25000000; 

        console.error('Download attempt failed (Plan A):', err);

        if (html.length < MAX_SAFE_CHARS) {
            // 💡 安全なサイズであれば、data:URLフォールバックを実行
            try {
                const url='data:text/html;charset=utf-8,'+encodeURIComponent(html);
                const w=window.open(url);
                if (w) {
                    showToast('別タブでソースを開きました。ブラウザの機能で保存してください。');
                } else {
                    showToast('ポップアップブロックを解除して、再度実行してください。');
                }
            } catch (innerErr) {
                // data:URL処理自体が失敗した場合
                console.error('Data URL fallback failed:', innerErr);
                showToast('ファイルのダウンロードに失敗しました😢\n（フォールバック処理中にエラーが発生しました）');
            }

        } else {
            // ⚠️ 巨大ファイル (SD 314MBなど) の場合は危険な処理をスキップ
            showToast('ファイルのダウンロードに失敗しました😢\n（ファイルサイズが大きすぎるため、互換処理をスキップしました）');
        }
      }
    } catch (e) {
      alert('Failed: ' + e);
    }
  }

  // ========= 設定UI =========
function ensureStyle() {
    if (document.getElementById('hsd-style')) return;
    const style = document.createElement('style');
    style.id = 'hsd-style';
    style.textContent = `
    :root {
      --bg-color: #1a1a1a;
      --text-color: #f0f0f0;
      --border-color: #333;
      --primary-color: #007bff;
      --primary-hover: #0056b3;
      --secondary-color: #343a40;
      --modal-bg: #212529;
      --shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
      --border-radius: 12px;
    }
    .hsd-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 100000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hsd-panel {
      background-color: var(--modal-bg);
      color: var(--text-color);
      width: 90%;
      max-width: 400px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }
    .hsd-title {
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    .hsd-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      color: var(--text-color);
      opacity: 0.7;
      padding: 0;
    }
    .hsd-close:hover {
      opacity: 1;
    }
    .hsd-section {
      padding: 20px;
    }
    .hsd-label {
      font-size: 1rem;
      font-weight: 500;
      color: #e0e0e0;
      display: block;
      margin-bottom: 8px;
    }
    .hsd-input {
      width: 100%;
      padding: 8px 12px;
      background-color: var(--secondary-color);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: text;
      box-sizing: border-box;
    }
    .hsd-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 4px var(--primary-color);
    }
    .hsd-bottom {
      padding: 15px 20px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hsd-bottom .hsd-version {
      font-size: 0.8rem;
      font-weight: 400;
      color: #aaa;
    }
    .hsd-button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: var(--primary-color);
      color: white;
    }
    .hsd-button:hover {
      background-color: var(--primary-hover);
    }
    `;
    document.head.appendChild(style);
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 20px; left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: white; padding: 10px 20px;
      border-radius: 6px;
      z-index: 100000;
      font-size: 14px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function openSettings() {
    ensureStyle();

    // モーダル背景
    const overlay = document.createElement('div');
    overlay.className = 'hsd-overlay';

    // ESCキーで閉じる（任意のキーで消えないように once を使わない）
    const onEsc = (e) => {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); }
    };
    document.addEventListener('keydown', onEsc);

    // モーダル本体
    const panel = document.createElement('div');
    panel.className = 'hsd-panel';

    // 閉じるボタン
    const closeBtn = document.createElement('span');
    closeBtn.className = 'hsd-close';
    closeBtn.textContent = '×';
    closeBtn.title = '閉じる';
    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

    // タイトルバー
    const title = document.createElement('div');
    title.className = 'hsd-title';
    title.textContent = '設定';
    title.appendChild(closeBtn);

    // 設定セクション
    const section = document.createElement('div');
    section.className = 'hsd-section';

    const label = document.createElement('div');
    label.className = 'hsd-label';
    label.textContent = 'ショートカットキー';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'hsd-input';
    input.placeholder = '例: Alt+Shift+S';
    input.setAttribute("inputmode", "latin");
    input.setAttribute("lang", "en");
    input.inputMode = 'latin';
    input.style.imeMode = "disabled";
    input.readOnly = true;
    input.addEventListener('input', () => {
      // 全角英数字→半角英数字に変換
      input.value = input.value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
      );
      // 全角記号や日本語を削除
      input.value = input.value.replace(/[^\x00-\x7F]/g, '');
    });
    input.value = normalizeShortcutString(userShortcut);

    // キーキャプチャ（小文字入力でも大文字表示）
    input.addEventListener('keydown', e => {
      e.preventDefault(); // IME入力や全角候補を完全ブロック

      const mods = [];
      if (e.ctrlKey) mods.push('Ctrl');
      if (e.altKey) mods.push('Alt');
      if (e.shiftKey) mods.push('Shift');
      if (e.metaKey) mods.push('Meta');

      let main = '';
      if (e.code.startsWith('Key')) main = e.code.slice(3).toUpperCase();
      else if (e.code.startsWith('Digit')) main = e.code.slice(5);
      else if (/^F[1-9]|F1[0-2]$/.test(e.key)) main = e.key.toUpperCase();
      else if (e.key && e.key.length === 1) main = e.key.toUpperCase();

      // ここで value を上書き
      input.value = (mods.length ? mods.join('+') + '+' : '') + main;
    });

    section.appendChild(label);
    section.appendChild(input);

    // フッター（バージョン & 保存ボタン）
    const bottom = document.createElement('div');
    bottom.className = 'hsd-bottom';

    const version = document.createElement('div');
    version.className = 'hsd-version';
    version.textContent = '(' + VERSION + ')';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'hsd-button';
    saveBtn.textContent = '保存';
    saveBtn.addEventListener('click', () => {
      const norm = normalizeShortcutString(input.value);
      userShortcut = norm;
      GM_setValue(STORE_KEY, userShortcut); // 全ドメイン共通保存
      addContextMenu();
      document.body.removeChild(overlay);
      showToast('設定を保存したよ！');
    });

    bottom.appendChild(version);
    bottom.appendChild(saveBtn);

    // モーダル背景クリックで閉じる
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    // 組み立て
    panel.appendChild(title);
    panel.appendChild(section);
    panel.appendChild(bottom);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    input.focus();
  }

  // ========= イベント / メニュー =========
  // メニュー（実行 & 設定）
  let menuId = null;
  let settingsId = null;
  function addContextMenu() {
      if(menuId) GM_unregisterMenuCommand(menuId);
      menuId = GM_registerMenuCommand('HTMLをダウンロード ['+userShortcut+']', downloadHTML);
      if(settingsId) GM_unregisterMenuCommand(settingsId);
      settingsId = GM_registerMenuCommand('設定', openSettings);
  }
  addContextMenu();

  // ショートカット実行
  document.addEventListener('keydown', e => {
    // 入力欄でのタイプは無視（フォーム操作の邪魔をしない）
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;

    // 設定画面が開いてるときは無効化
    const overlay = document.querySelector('.hsd-overlay');
    if (overlay) return;

    // ショートカット判定
    if (eventMatchesShortcut(e, userShortcut)) {
      e.preventDefault();
      downloadHTML();
    }
  });
})();
