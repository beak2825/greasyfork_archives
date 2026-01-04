// ==UserScript==
// @name         Stage1st 临时搜索
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  给S1加个带站点选择的临时搜索框
// @author       Youmiya Hina
// @match        https://stage1st.com/2b/*.html
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/533578/Stage1st%20%E4%B8%B4%E6%97%B6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/533578/Stage1st%20%E4%B8%B4%E6%97%B6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        margin: 20px auto;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 4px;
        max-width: 800px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    `;

    searchContainer.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center">
            <input type="text"
                   id="s1SearchInput"
                   placeholder="全站搜索 (支持回车)"
                   style="flex:2; padding:8px; border:1px solid #ddd; border-radius:3px">
            <select id="s1SiteSelect"
                    style="flex:1; padding:8px; border:1px solid #ddd; border-radius:3px; background:white">
                <option value="stage1st.com">stage1st</option>
                <option value="saraba1st.com">saraba1st</option>
            </select>
            <button id="s1SearchBtn"
                    style="padding:8px 15px; background:#999933; color:white; border:none; border-radius:3px; cursor:pointer">
                搜索
            </button>
        </div>
    `;

    const targetNode = document.querySelector('.bm.wp.cl') || document.body;
    targetNode.insertAdjacentElement('afterbegin', searchContainer);

    const performSearch = () => {
        const keyword = document.getElementById('s1SearchInput').value.trim();
        if (!keyword) return;

        const selectedSite = document.getElementById('s1SiteSelect').value;
        const encodedQuery = encodeURIComponent(`allintitle: ${keyword} site:${selectedSite}`);
        const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        window.open(searchUrl, '_blank');
    };

    document.getElementById('s1SearchBtn').addEventListener('click', performSearch);
    document.getElementById('s1SearchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });
})();