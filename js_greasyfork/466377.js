// ==UserScript==
// @name arca.live page mover
// @match https://arca.live/*
// @grant GM_setValue
// @grant GM_getValue
// @version 2.1.1
// @author 7r
// @license MIT
// @description 2024. 5. 30. 오후 4:58:27
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/466377/arcalive%20page%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/466377/arcalive%20page%20mover.meta.js
// ==/UserScript==
 
(() => {
    const CACHE_KEY = 'arca_live_page_cache';
    const cache = GM_getValue(CACHE_KEY, {});
    
    const isInputElement = ({target}) => 
        ['INPUT', 'TEXTAREA'].includes(target.nodeName) || 
        target.classList.contains('fr-element');
    
    const removeRepeatedSubstring = (str, substr) => 
        str.replace(new RegExp(`/${substr}`, 'g'), '');
 
    const getMovedPage = (url, isLeftArrow) => {
        if (url.includes("/write")) return;
 
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const isPostDetail = pathParts.length > 2;
 
        const currentPage = parseInt(urlObj.searchParams.get('p')) || 1;
        
        if (!currentPage && !isPostDetail && !isLeftArrow) return;
 
        const newPage = isLeftArrow 
            ? Math.max(currentPage - 1, 1) 
            : (isPostDetail ? currentPage : currentPage + 1);
 
        const params = new URLSearchParams();
        params.set('p', newPage);
        urlObj.hash = '';
        urlObj.search = params.toString();
 
        const newUrl = isPostDetail 
            ? removeRepeatedSubstring(urlObj.toString(), pathParts.at(-1)) 
            : urlObj.toString();
            
        cache[newUrl] = newPage;
        location.href = newUrl;
    };
 
    window.addEventListener('keydown', e => {
        if (isInputElement(e) || 
            e.altKey || 
            e.ctrlKey || 
            e.shiftKey || 
            [16, 17, 18].includes(e.keyCode)) return;
 
        const isLeftArrow = e.keyCode === 37;
        const isRightArrow = e.keyCode === 39;
 
        if (isLeftArrow || isRightArrow) {
            getMovedPage(document.location.href, isLeftArrow);
            e.preventDefault();
        }
    });
 
    GM_setValue(CACHE_KEY, cache);
})();