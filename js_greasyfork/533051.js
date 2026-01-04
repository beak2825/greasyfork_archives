// ==UserScript==
// @name                修改YouTube首页布局
// @name:zh-CN          修改YouTube首页布局
// @name:zh-TW          修改YouTube首頁佈局
// @name:en             Modify YouTube Homepage Layout
// @name:ja             YouTubeホームレイアウトカスタマイズ
// @description         修改YouTube首页每行推荐视频数量
// @description:zh-CN   修改YouTube首页每行推荐视频数量
// @description:zh-TW   修改YouTube首頁每行推薦視頻數量
// @description:en      Change the number of recommended videos per row on the YouTube homepage
// @description:ja      YouTubeのホームページで1行に表示されるおすすめ動画の数を変更します
// @version             1.6
// @author              爆菊大师
// @match               https://www.youtube.com/*
// @icon                https://www.youtube.com/favicon.ico
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @license             MIT
// @namespace https://greasyfork.org/users/929164
// @downloadURL https://update.greasyfork.org/scripts/533051/%E4%BF%AE%E6%94%B9YouTube%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/533051/%E4%BF%AE%E6%94%B9YouTube%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const CONFIG = {
        columns: 'ytd-items-per-row',
        shorts: 'ytd-shorts-blocked',
        portraitColumns: 'ytd-portrait-columns'
    };
    const state = {
        columns: Math.min(10, Math.max(1,
            parseInt(localStorage.getItem(CONFIG.columns)) || 5)),
        shorts: localStorage.getItem(CONFIG.shorts) === 'true',
        portraitColumns: parseInt(localStorage.getItem(CONFIG.portraitColumns)) || null
    };
    const handleResize = () => {
        if (state.portraitColumns !== null) {
            const { innerWidth: width, innerHeight: height } = window;
            const original = Math.min(10, Math.max(1,
                parseInt(localStorage.getItem(CONFIG.columns)) || 5));
            state.columns = width > height ? original : state.portraitColumns;
        }
        updateStyle();
    };
    const updateStyle = () => {
        GM_addStyle(`
            .style-scope.ytd-two-column-browse-results-renderer {
                --ytd-rich-grid-items-per-row: ${state.columns} !important;
                --ytd-rich-grid-gutter-margin: 0px !important;
            }
        `);
        if (state.shorts) {
            GM_addStyle(`
                ytd-rich-section-renderer,
                ytd-reel-shelf-renderer {
                    display: none !important;
                }
            `);
        }
    };
    GM_registerMenuCommand('🖥️ 设置每行显示数量', () => {
        const input = prompt('请输入每行显示的视频数量（1-10）:', state.columns);
        if (input === null) return;
        const value = Math.min(10, Math.max(1, parseInt(input) || state.columns));
        localStorage.setItem(CONFIG.columns, value);
        state.columns = value;
        handleResize();
        alert(`当前设置：每行显示 ${value} 个视频`);
    });
    GM_registerMenuCommand('📱 竖屏显示数量', () => {
        const input = prompt(`设置竖屏显示数量（1-10，当前：${state.portraitColumns || '未设置'}）:`, state.portraitColumns || 3);
        if (input === null) return;
        const value = Math.min(10, Math.max(1, parseInt(input) || 3));
        localStorage.setItem(CONFIG.portraitColumns, value);
        state.portraitColumns = value;
        handleResize();
        alert(`竖屏当前设置：每行显示 ${value} 个视频`);
    });
    if (state.portraitColumns !== null) {
        GM_registerMenuCommand('清除竖屏设置', () => {
            if (!confirm('确定要清除竖屏设置吗？')) return;
            localStorage.removeItem(CONFIG.portraitColumns);
            state.portraitColumns = null;
            state.columns = Math.min(10, Math.max(1,
                parseInt(localStorage.getItem(CONFIG.columns)) || 5));
            updateStyle();
            alert('已清除竖屏设置');
        });
    }
    GM_registerMenuCommand(state.shorts ? '显示Shorts' : '隐藏Shorts', () => {
        state.shorts = !state.shorts;
        localStorage.setItem(CONFIG.shorts, state.shorts);
        window.location.reload();
    });
    window.addEventListener('resize', handleResize);
    handleResize();
})();