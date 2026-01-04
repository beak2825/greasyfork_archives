// ==UserScript==
// @name         履歴の最初に戻る
// @namespace    https://bsky.app/profile/neon-ai.art
// @homepage     https://bsky.app/profile/neon-ai.art
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄️</text></svg>
// @version      4.3
// @description  右クリックメニューやショートカットでブラウザ履歴の最初に戻る。
// @author       ねおん
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/546323/%E5%B1%A5%E6%AD%B4%E3%81%AE%E6%9C%80%E5%88%9D%E3%81%AB%E6%88%BB%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546323/%E5%B1%A5%E6%AD%B4%E3%81%AE%E6%9C%80%E5%88%9D%E3%81%AB%E6%88%BB%E3%82%8B.meta.js
// ==/UserScript==

// Ctrl+Shift+Aなど一部の予約済みのショートカットキーは設定できません

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

(function() {
    'use strict';

    const SCRIPT_VERSION = '4.3';
    const STORE_KEY = 'historyGoFirst__shortcut';
    let userShortcut = GM_getValue(STORE_KEY, 'Ctrl+Shift+H');
    let menuId = null;
    let settingsId = null;


    // ========= 履歴の最初に戻る =========
    function goBackToHistoryStart() {
        if (history.length <= 1) {
            showToast('既に最初のページにいるよ！', true);
            return;
        }

        const uniqueId = Date.now();
        history.replaceState({ ...history.state, 'hgf_marker': uniqueId }, '');

        showToast('履歴を探索中だよ...', null);

        let delta = 1 - history.length;

        function checkAndGo() {
            const isSuccessful = !history.state || history.state.hgf_marker !== uniqueId;

            // 履歴の最初に戻れた場合
            if (isSuccessful) {
                showToast('履歴の最初に戻ったよ！', true);
                return;
            }

            // 探索を終えたのに、まだマーカーが残っている場合は「既に最初のページにいる」と判断する
            if (delta >= 0) {
                 // 終了前にマーカーをきれいに削除するよ！
                 history.replaceState({ ...history.state, 'hgf_marker': undefined }, '');
                 showToast('既に最初のページにいるよ！', true);
                 return;
            }

            history.go(delta);
            delta++;
            setTimeout(checkAndGo, 500);
        }

        setTimeout(checkAndGo, 100);
    }

    // ========= ショートカット処理 =========
    function normalizeShortcutString(s) {
        if (!s) return 'Ctrl+Shift+H';
        s = String(s).trim().replace(/\s+/g, '');
        const parts = s.split('+').map(p => p.toLowerCase());
        const mods = new Set();
        let main = '';
        for (const p of parts) {
            if (['ctrl','control'].includes(p)) mods.add('Ctrl');
            else if (['alt','option'].includes(p)) mods.add('Alt');
            else if (['shift'].includes(p)) mods.add('Shift');
            else if (['meta','cmd','command','⌘'].includes(p)) mods.add('Meta');
            else main = p;
        }
        if (!main) main = 'H';
        if (/^key[a-z]$/i.test(main)) main = main.slice(3);
        if (/^digit[0-9]$/i.test(main)) main = main.slice(5);
        if (/^[a-z]$/.test(main)) main = main.toUpperCase();
        if (/^f([1-9]|1[0-2])$/i.test(main)) main = main.toUpperCase();
        const order = ['Ctrl','Alt','Shift','Meta'];
        const modStr = order.filter(m => mods.has(m)).join('+');
        return (modStr ? modStr+'+' : '') + main;
    }

    function eventMatchesShortcut(e, shortcut) {
        const norm = normalizeShortcutString(shortcut);
        const parts = norm.split('+');
        const mods = new Set(parts.slice(0,-1));
        const keyPart = parts[parts.length-1];
        const need = { Ctrl: mods.has('Ctrl'), Alt: mods.has('Alt'), Shift: mods.has('Shift'), Meta: mods.has('Meta') };
        if (need.Ctrl !== e.ctrlKey) return false;
        if (need.Alt !== e.altKey) return false;
        if (need.Shift !== e.shiftKey) return false;
        if (need.Meta !== e.metaKey) return false;

        let pressed = '';
        if (e.code.startsWith('Key')) pressed = e.code.slice(3).toUpperCase();
        else if (e.code.startsWith('Digit')) pressed = e.code.slice(5);
        else pressed = e.key.length===1?e.key.toUpperCase():e.key;
        return pressed === keyPart;
    }

    function handleKeyDown(event) {
        const tag = (event.target && event.target.tagName) || '';
        if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
        const overlay = document.querySelector('.hgf-overlay');
        if (overlay) return;
        if (eventMatchesShortcut(event, userShortcut)) {
            event.preventDefault();
            goBackToHistoryStart();
        }
    }

    // ========= 設定UI =========
    function ensureStyle() {
        if (document.getElementById('hgf-style')) return;
        const style = document.createElement('style');
        style.id = 'hgf-style';
        style.textContent = `
        .hgf-overlay {position: fixed; top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,0.7); z-index:100000; display:flex;justify-content:center;align-items:center;}
        .hgf-panel {background:#212529;color:#f0f0f0;width:90%;max-width:400px;border-radius:12px;box-shadow:0 8px 16px rgba(0,0,0,0.5);border:1px solid #333; font-family:'Inter',sans-serif; overflow:hidden;}
        .hgf-title {padding:15px 20px; display:flex;justify-content:space-between; align-items:center; font-size:1.25rem; font-weight:600; border-bottom:1px solid #333;}
        .hgf-close {background:none;border:none;cursor:pointer;font-size:24px;color:#f0f0f0;opacity:0.7;padding:0;}
        .hgf-close:hover {opacity:1;}
        .hgf-section {padding:20px;}
        .hgf-label {font-size:1rem;font-weight:500;color:#e0e0e0;display:block;margin-bottom:8px;}
        .hgf-input {width:100%;padding:8px 12px;background:#343a40;color:#f0f0f0;border:1px solid #333;border-radius:6px;cursor:text;box-sizing:border-box;}
        .hgf-input:focus {border-color:#007bff; box-shadow:0 0 4px #007bff;}
        .hgf-bottom {padding:15px 20px;border-top:1px solid #333;display:flex;justify-content:space-between;align-items:center;}
        .hgf-version {font-size:0.8rem;color:#aaa;}
        .hgf-button {padding:10px 20px;border:none;border-radius:6px;font-weight:bold;cursor:pointer;transition:all 0.2s ease;background:#007bff;color:white;}
        .hgf-button:hover {background:#0056b3;}
        `;
        document.head.appendChild(style);
    }

    // ========= トーストメッセージを表示する関数だよ =========
    // @param {string} msg - 表示するメッセージ
    // @param {boolean|null} isSuccess - 成功したかどうかのフラグ (nullの場合は探索中)
    function showToast(msg, isSuccess) {
        console.log(`[TOAST] ${msg}`);
        const existingToast = document.querySelector('.hgf-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.classList.add('hgf-toast');

        let bgColor;
        if (isSuccess === true) {
            bgColor = '#007bff';
        } else if (isSuccess === false) {
            bgColor = '#dc3545';
        } else {
            bgColor = '#6c757d';
        }

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 100000;
            font-size: 14px;
            transition: opacity 1.0s ease, transform 1.0s ease;
            opacity: 0;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -20px)';
        }, 10);

        if (isSuccess !== null) {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, 0)';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        toast.remove();
                    }
                }, 1000);
            }, 3000);
        }
    }

    function openSettings() {
        ensureStyle();
        const overlay = document.createElement('div'); overlay.className='hgf-overlay';

        const onEsc = (e) => {
            if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); }
        };
        document.addEventListener('keydown', onEsc);

        const panel = document.createElement('div'); panel.className='hgf-panel';
        const closeBtn = document.createElement('span'); closeBtn.className='hgf-close'; closeBtn.textContent='×'; closeBtn.title='閉じる';
        closeBtn.addEventListener('click',()=>document.body.removeChild(overlay));
        const title = document.createElement('div'); title.className='hgf-title'; title.textContent='設定'; title.appendChild(closeBtn);

        const section = document.createElement('div'); section.className='hgf-section';
        const label = document.createElement('div'); label.className='hgf-label'; label.textContent='ショートカットキー';
        const input = document.createElement('input'); input.type='text'; input.className='hgf-input';
        input.placeholder='例: Ctrl+Shift+H'; input.readOnly=true;
        input.value = normalizeShortcutString(userShortcut);

        input.addEventListener('keydown',e=>{
            e.preventDefault();
            const mods=[];
            if(e.ctrlKey) mods.push('Ctrl'); if(e.altKey) mods.push('Alt'); if(e.shiftKey) mods.push('Shift'); if(e.metaKey) mods.push('Meta');
            let main='';
            if(e.code.startsWith('Key')) main=e.code.slice(3).toUpperCase();
            else if(e.code.startsWith('Digit')) main=e.code.slice(5);
            else if(/^F([1-9]|1[0-2])$/.test(e.key)) main=e.key.toUpperCase();
            else if(e.key && e.key.length===1) main=e.key.toUpperCase();
            input.value = (mods.length ? mods.join('+')+'+' : '') + main;
        });

        section.appendChild(label); section.appendChild(input);

        const bottom=document.createElement('div'); bottom.className='hgf-bottom';
        const version=document.createElement('div'); version.className='hgf-version'; version.textContent='('+SCRIPT_VERSION+')';
        const saveBtn=document.createElement('button'); saveBtn.className='hgf-button'; saveBtn.textContent='保存';
        saveBtn.addEventListener('click',()=>{
            const norm = normalizeShortcutString(input.value);
            userShortcut = norm;
            GM_setValue(STORE_KEY,userShortcut);
            addContextMenu();
            document.body.removeChild(overlay);
            showToast('設定を保存したよ！');
        });
        bottom.appendChild(version); bottom.appendChild(saveBtn);

        overlay.addEventListener('click',e=>{if(e.target===overlay) overlay.remove();});
        panel.appendChild(title); panel.appendChild(section); panel.appendChild(bottom);
        overlay.appendChild(panel); document.body.appendChild(overlay);
        input.focus();
    }

    // ========= 右クリックメニュー =========
    function addContextMenu() {
        if(menuId) GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand('最初に戻る ['+userShortcut+']', goBackToHistoryStart);
        if(settingsId) GM_unregisterMenuCommand(settingsId);
        settingsId = GM_registerMenuCommand('設定', openSettings);
    }

    // ========= 初期化 =========
    function init() {
        document.removeEventListener('keydown',handleKeyDown);
        document.addEventListener('keydown',handleKeyDown);
        addContextMenu();
    }

    init();

})();