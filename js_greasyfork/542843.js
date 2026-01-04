// ==UserScript==
// @name         轻小说文库极简阅读器
// @namespace    https://github.com/cresstoo/wenku8-reader
// @version      1.0.1
// @description  对轻小说文库阅读页面进行极简美化，支持多种字体大小主题配色
// @author       cress
// @match        https://www.wenku8.net/novel/*/*/*.htm
// @exclude      https://www.wenku8.net/novel/*/*/index.htm
// @icon         https://www.wenku8.net/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542843/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E6%9E%81%E7%AE%80%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542843/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E6%9E%81%E7%AE%80%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        html, body { background-color: #f8f9fa !important; font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important; color: #333 !important; line-height: 1.8 !important; margin: 0 !important; padding: 0 !important; width: 100% !important; overflow-x: hidden !important; scroll-behavior: smooth; }
        * { box-shadow: none !important; text-shadow: none !important; border-radius: 0 !important; font-family: inherit !important; }
        a { text-decoration: none !important; color: #1890ff; transition: color 0.2s, background-color 0.2s; }
        #header, #adv1, #adtop, #adv900, #adv300, #adv5, #adv4, #footer, #adbottom, #footlink, #content > ul, #GB_BIG { display: none !important; }
        body { padding-top: 0; padding-bottom: 20px; }
        #headlink { width: 100% !important; max-width: 100% !important; margin: 0 0 20px 0 !important; padding: 0 !important; background-color: #fff !important; box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important; border-bottom: 1px solid #e8e8e8 !important; display: flex !important; justify-content: space-between !important; align-items: center !important; height: 50px; box-sizing: border-box; }
        #linkleft, #linkright { font-size: 14px; white-space: nowrap; }
        #linkleft { color: #8c8c8c; overflow: hidden; text-overflow: ellipsis; padding-right: 20px; }
        #linkleft a { color: #595959 !important; }
        #linkleft a:hover { color: #1890ff !important; }
        #linkright a { color: #595959 !important; margin: 0 4px !important; padding: 5px 5px; border-radius: 4px; }
        #linkright a:hover { background-color: #f0f0f0; color: #1890ff !important; }
        #contentmain { width: 800px !important; max-width: 800px !important; margin: 0 auto !important; background-color: #fff !important; box-shadow: 0 2px 12px rgba(0,0,0,0.05) !important; border: none !important; padding: 0 40px !important; border-radius: 8px; }
        .wk8-header { padding: 25px 40px !important; text-align: center !important; }
        .wk8-title { font-size: 24px !important; font-weight: 500 !important; color: #262626 !important; border-bottom: 1px dashed #e0e0e0; padding-bottom: 25px; }
        .wk8-content { padding: 35px 40px !important; text-align: left !important; font-size: 18px !important; line-height: 2 !important; color: #2c3e50 !important; letter-spacing: 0.02em !important; }
        .wk8-nav-container { padding: 25px 40px !important; border-top: 1px solid #E0E0E0 !important; }
        .wk8-page-nav { text-align: center; }
        .wk8-nav-link { display: inline-block !important; padding: 8px 20px !important; background-color: #f8f9fa !important; border: 1px solid #e0e0e0 !important; border-radius: 4px !important; color: #444 !important; font-size: 14px !important; transition: all 0.3s ease !important; margin: 5px !important; }
        .wk8-nav-link:hover { background-color: #e8f0fe !important; color: #0d66d0 !important; border-color: #c0d7fe !important; }
        .wk8-page-nav .wk8-nav-link { font-weight: 500; padding: 10px 30px; }
        .wk8-back-to-top, .wk8-toolbar-trigger { display: flex !important; align-items: center !important; justify-content: center !important; position: fixed !important; right: 30px !important; width: 40px !important; height: 40px !important; background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-radius: 50% !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important; cursor: pointer !important; z-index: 9999 !important; transition: all 0.2s ease !important; }
        .wk8-back-to-top { bottom: 30px !important; font-size: 20px !important; color: #666 !important; display: none; }
        .wk8-toolbar-trigger { top: 50% !important; transform: translateY(-50%) !important; color: #666666 !important; }
        .wk8-toolbar { position: fixed !important; top: 50% !important; right: 80px !important; transform: translateY(-50%) !important; width: 240px !important; display: flex !important; flex-direction: column !important; gap: 12px !important; padding: 15px !important; background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-radius: 12px !important; z-index: 9998 !important; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important; transition: all 0.3s ease !important; opacity: 0 !important; visibility: hidden !important; transform: translate(10px, -50%) !important; }
        .wk8-toolbar.expanded { opacity: 1 !important; visibility: visible !important; transform: translate(0, -50%) !important; }
        .wk8-toolbar-group { padding: 8px; background-color: rgba(0,0,0,0.03); border-radius: 8px; }
        .wk8-toolbar-title { font-size: 13px !important; font-weight: 500 !important; color: #8c8c8c !important; margin-bottom: 8px !important; text-align: center !important; }
        .wk8-font-family-group, .wk8-font-size-buttons, .wk8-scroll-buttons, .wk8-simple-button-row { display: flex !important; gap: 6px !important; }
        .wk8-font-family-btn, .wk8-font-size-btn, .wk8-scroll-btn, .wk8-simple-button { flex: 1; padding: 6px 12px !important; border: none !important; background: rgba(0,0,0,0.06) !important; color: #666 !important; cursor: pointer !important; font-size: 14px !important; border-radius: 4px !important; transition: all 0.2s ease !important; }
        .wk8-font-family-btn.active, .wk8-simple-button.active { background: #fff !important; color: #333 !important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important; }
        .wk8-font-size-dots, .wk8-scroll-dots { display: flex !important; justify-content: center !important; gap: 4px !important; margin-top: 8px; }
        .wk8-font-size-dot, .wk8-scroll-dot { width: 6px !important; height: 6px !important; border-radius: 50% !important; background-color: rgba(0, 0, 0, 0.1) !important; transition: all 0.2s ease !important; }
        .wk8-font-size-dot.active, .wk8-scroll-dot.active { background-color: #1e88e5 !important; }
        .wk8-theme-group { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
        .wk8-theme-card { position: relative !important; aspect-ratio: 16/9 !important; border-radius: 6px !important; cursor: pointer !important; transition: all 0.2s ease !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; font-weight: 500 !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; }
        .wk8-theme-card.active { border: 2px solid #1e88e5 !important; }
        .wk8-theme-card:hover { border-color: #1e88e5 !important; }
        .wk8-theme-preview { width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; }
        /* ==================== 主题样式 ==================== */
        .theme-default body { background-color: #E5E5E5 !important; }
        .theme-default #headlink { background-color: #fff !important; border-color: #e8e8e8 !important; }
        .theme-default #contentmain, .theme-default .wk8-nav-container { background-color: #EEEDED !important; }
        .theme-default #content { color: #333333 !important; }
        .theme-default .wk8-nav-container { border-color: #D0D0D0 !important; }

        .theme-eye-care body { background-color: #D8E5C0 !important; }
        .theme-eye-care #headlink { background-color: #e6efd5 !important; border-color: #d1d8c5 !important; }
        .theme-eye-care #linkleft { color: #52677A !important; }
        .theme-eye-care #headlink a { color: #3d5063 !important; }
        .theme-eye-care #linkleft a:hover { color: #1890ff !important; }
        .theme-eye-care #linkright a:hover { background-color: #d9e0ce !important; }
        .theme-eye-care #contentmain, .theme-eye-care .wk8-nav-container { background-color: #E6EFD5 !important; }
        .theme-eye-care #content { color: #2C3E50 !important; }
        .theme-eye-care .wk8-nav-container { border-color: #B8C7A0 !important; }

        .theme-focus body { background-color: #F5ECD8 !important; }
        .theme-focus #headlink { background-color: #fffcf4 !important; border-color: #e6d5b8 !important; }
        .theme-focus #linkleft { color: #5C5C5C !important; }
        .theme-focus #headlink a { color: #4C4C4C !important; }
        .theme-focus #linkleft a:hover { color: #1890ff !important; }
        .theme-focus #linkright a:hover { background-color: #f2eade !important; }
        .theme-focus #contentmain, .theme-focus .wk8-nav-container { background-color: #FFFCF4 !important; }
        .theme-focus #content { color: #3C3C3C !important; }
        .theme-focus .wk8-nav-container { border-color: #D9C8A7 !important; }

        .theme-dark body { background-color: #2D2D30 !important; }
        .theme-dark #headlink { background-color: #3A3A3D !important; border-color: rgba(255, 255, 255, 0.1) !important; }
        .theme-dark #linkleft { color: #b0b0b0 !important; }
        .theme-dark #headlink a { color: #d1d1d1 !important; }
        .theme-dark #linkleft a:hover { color: #FFFFFF !important; }
        .theme-dark #linkright a:hover { background-color: rgba(255,255,255,0.1); }
        .theme-dark #contentmain, .theme-dark .wk8-nav-container { background-color: #4A4A4D !important; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important; }
        .theme-dark #content { color: #EAEAEA !important; }
        .theme-dark .wk8-nav-container { border-color: rgba(255, 255, 255, 0.1) !important; }
        .theme-dark #title { color: #FFFFFF !important; }
        .theme-dark .wk8-nav-link { background-color: #5A5A5D !important; border-color: #666666 !important; color: #FFFFFF !important; }
        .theme-dark .wk8-nav-link:hover { background-color: #666666 !important; }
        .theme-dark .wk8-toolbar-trigger, .theme-dark .wk8-back-to-top { background-color: rgba(74, 74, 77, 0.95) !important; color: #FFFFFF !important; }
        .theme-dark .wk8-toolbar { background-color: rgba(74, 74, 77, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .theme-dark .wk8-toolbar-group { background-color: rgba(255,255,255,0.05) !important; }
        .theme-dark .wk8-toolbar-title { color: #a0a0a0 !important; }
        .theme-dark .wk8-font-size-btn, .theme-dark .wk8-font-family-btn, .theme-dark .wk8-scroll-btn, .theme-dark .wk8-simple-button { color: #FFFFFF !important; background: rgba(255,255,255,0.1) !important; }
        .theme-dark .wk8-font-size-btn:hover, .theme-dark .wk8-font-family-btn:hover, .theme-dark .wk8-scroll-btn:hover, .theme-dark .wk8-simple-button:hover { background: rgba(255, 255, 255, 0.15) !important; }
        .theme-dark .wk8-font-size-dot, .theme-dark .wk8-scroll-dot { background-color: rgba(255, 255, 255, 0.2) !important; }
        .theme-dark .wk8-font-size-dot.active, .theme-dark .wk8-scroll-dot.active { background-color: #FFFFFF !important; }
    `;
    if (document.head) document.head.appendChild(style);
    else document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));

    // ====================================================================================================
    //                                         主逻辑开始
    // ====================================================================================================

    function initializeScript() {
        const gbBigButton = document.querySelector('#GB_BIG');
        if (gbBigButton) {
            const separatorNode = gbBigButton.previousSibling;
            if (separatorNode && separatorNode.nodeType === 3) {
                separatorNode.parentNode.removeChild(separatorNode);
            }
        }

        const linkleft = document.querySelector('#linkleft');
        if (linkleft) {
            linkleft.childNodes.forEach(node => {
                if (node.nodeType === 3 && node.textContent.includes('->')) {
                    node.textContent = node.textContent.replace(/->/g, ' / ');
                }
            });
        }

        const adInContent = document.querySelector('#content ul');
        if (adInContent) adInContent.remove();

        const contentMain = document.querySelector('#contentmain');
        if (contentMain) {
            const titleEl = document.querySelector('#title');
            const newHeader = document.createElement('div');
            newHeader.className = 'wk8-header';
            if (titleEl) newHeader.appendChild(titleEl);
            contentMain.prepend(newHeader);

            const originalFootlink = document.querySelector('#footlink');
            const navContainer = document.createElement('div');
            navContainer.className = 'wk8-nav-container';
            const pageNav = document.createElement('div');
            pageNav.className = 'wk8-page-nav';

            if (originalFootlink) {
                originalFootlink.querySelectorAll('a').forEach(link => {
                    if (link.href.includes('game.php')) return;
                    const newLink = link.cloneNode(true);
                    newLink.className = 'wk8-nav-link';
                    pageNav.appendChild(newLink);
                });
            }

            navContainer.appendChild(pageNav);
            contentMain.appendChild(navContainer);
        }

        createToolbar();
        createBackToTopButton();
        initializeSettings();
        initScrollFeature();
    }

    function createToolbar() {
        const trigger = document.createElement('div'); trigger.className = 'wk8-toolbar-trigger';
        trigger.innerHTML = `<div style="font-family: PingFang SC, sans-serif; display: flex; align-items: baseline; line-height: 1;"><span style="font-size: 16px; font-weight: 500;">A</span><span style="font-size: 12px; font-weight: 500;">A</span></div>`;
        const toolbar = document.createElement('div'); toolbar.className = 'wk8-toolbar';
        toolbar.innerHTML = `
            <div class="wk8-toolbar-group">
                <div class="wk8-simple-button-row"><button id="wk8-translate-btn" class="wk8-simple-button">简繁切换</button></div>
            </div>
            <div class="wk8-toolbar-group">
                <div class="wk8-toolbar-title">文字大小</div>
                <div class="wk8-font-size-buttons"><button class="wk8-font-size-btn" data-action="decrease">小</button><button class="wk8-font-size-btn" data-action="increase">大</button></div>
                <div class="wk8-font-size-dots">${Array(10).fill('<div class="wk8-font-size-dot"></div>').join('')}</div>
            </div>
            <div class="wk8-toolbar-group">
                <div class="wk8-toolbar-title">滚屏速度 (双击页面启停)</div>
                <div class="wk8-scroll-buttons"><button class="wk8-scroll-btn" data-action="decrease">慢</button><button class="wk8-scroll-btn" data-action="increase">快</button></div>
                <div class="wk8-scroll-dots">${Array(10).fill('<div class="wk8-scroll-dot"></div>').join('')}</div>
            </div>
            <div class="wk8-toolbar-group">
                <div class="wk8-toolbar-title">字体选择</div>
                <div class="wk8-font-family-group">
                    <button class="wk8-font-family-btn" data-font='"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'>黑体</button>
                    <button class="wk8-font-family-btn" data-font='"Songti SC", SimSun, "宋体", serif'>宋体</button>
                </div>
            </div>
            <div class="wk8-toolbar-group">
                <div class="wk8-toolbar-title">阅读主题</div>
                <div class="wk8-theme-group">
                    <div class="wk8-theme-card" data-theme="default"><div class="wk8-theme-preview" style="background-color: #EEEDED; color: #333333;">纸张</div></div>
                    <div class="wk8-theme-card" data-theme="eye-care"><div class="wk8-theme-preview" style="background-color: #E6EFD5; color: #2C3E50;">护眼</div></div>
                    <div class="wk8-theme-card" data-theme="focus"><div class="wk8-theme-preview" style="background-color: #FFFCF4; color: #3C3C3C;">专注</div></div>
                    <div class="wk8-theme-card" data-theme="dark"><div class="wk8-theme-preview" style="background-color: #4A4A4D; color: #FFFFFF;">夜间</div></div>
                </div>
            </div>
        `;
        document.body.append(trigger, toolbar);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toolbar.classList.toggle('expanded');
        });

        document.addEventListener('click', (e) => {
            if (!toolbar.contains(e.target) && !trigger.contains(e.target)) {
                toolbar.classList.remove('expanded');
            }
        });

        toolbar.addEventListener('dblclick', (e) => e.stopPropagation());

        toolbar.querySelector('.wk8-font-size-btn[data-action="decrease"]').onclick = () => adjustFontSize(-1);
        toolbar.querySelector('.wk8-font-size-btn[data-action="increase"]').onclick = () => adjustFontSize(1);
        toolbar.querySelectorAll('.wk8-font-family-btn').forEach(btn => btn.onclick = () => setFontFamily(btn.dataset.font));
        toolbar.querySelectorAll('.wk8-theme-card').forEach(card => card.onclick = () => setTheme(card.dataset.theme));
        toolbar.querySelector('#wk8-translate-btn').onclick = () => { if (typeof window.translatePage === 'function') window.translatePage(); };
        toolbar.querySelector('.wk8-scroll-btn[data-action="decrease"]').onclick = () => adjustScrollSpeed(-1);
        toolbar.querySelector('.wk8-scroll-btn[data-action="increase"]').onclick = () => adjustScrollSpeed(1);
    }

    function createBackToTopButton() { const btn = document.createElement('div'); btn.className = 'wk8-back-to-top'; btn.innerHTML = '↑'; document.body.appendChild(btn); window.addEventListener('scroll', () => { btn.style.display = window.scrollY > 200 ? 'flex' : 'none'; }); btn.addEventListener('click', () => { window.isScrolling = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
    function adjustFontSize(delta) { const content = document.querySelector('#content'); if (!content) return; let currentSize = parseInt(getComputedStyle(content).fontSize); const newSize = Math.max(14, Math.min(32, currentSize + delta)); content.style.setProperty('font-size', `${newSize}px`, 'important'); localStorage.setItem('wk8-font-size', newSize); updateFontSizeUI(newSize); }
    function updateFontSizeUI(size) { const dots = document.querySelectorAll('.wk8-font-size-dot'); if(dots.length === 0) return; const step = (32 - 14) / (dots.length - 1); const activeIndex = Math.round((size - 14) / step); dots.forEach((dot, index) => dot.classList.toggle('active', index <= activeIndex)); document.querySelector('.wk8-font-size-btn[data-action="decrease"]').disabled = size <= 14; document.querySelector('.wk8-font-size-btn[data-action="increase"]').disabled = size >= 32; }

    let scrollInterval = null;
    window.isScrolling = false;
    function startScrolling() { if (window.isScrolling) return; window.isScrolling = true; const speed = parseInt(localStorage.getItem('wk8-scroll-speed') || 3); scrollInterval = setInterval(() => { window.scrollBy(0, 1); if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) { stopScrolling(); } }, 120 - (speed * 10)); }
    function stopScrolling() { window.isScrolling = false; clearInterval(scrollInterval); }
    function adjustScrollSpeed(delta) { let currentSpeed = parseInt(localStorage.getItem('wk8-scroll-speed') || 3); const newSpeed = Math.max(1, Math.min(10, currentSpeed + delta)); localStorage.setItem('wk8-scroll-speed', newSpeed); updateScrollSpeedUI(newSpeed); if (window.isScrolling) { stopScrolling(); startScrolling(); } }
    function updateScrollSpeedUI(speed) { const dots = document.querySelectorAll('.wk8-scroll-dot'); if (dots.length === 0) return; dots.forEach((dot, index) => dot.classList.toggle('active', index < speed)); document.querySelector('.wk8-scroll-btn[data-action="decrease"]').disabled = speed <= 1; document.querySelector('.wk8-scroll-btn[data-action="increase"]').disabled = speed >= 10; }
    function initScrollFeature() { document.body.addEventListener('dblclick', (e) => { if(e.target.closest('.wk8-toolbar')) return; window.isScrolling ? stopScrolling() : startScrolling(); }); }

    function setTheme(theme) { document.documentElement.className = `theme-${theme}`; localStorage.setItem('wk8-theme', theme); document.querySelectorAll('.wk8-theme-card').forEach(card => card.classList.toggle('active', card.dataset.theme === theme)); }
    function setFontFamily(font) { const content = document.querySelector('#content'); if(content) content.style.setProperty('font-family', font, 'important'); localStorage.setItem('wk8-font-family', font); document.querySelectorAll('.wk8-font-family-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.font === font)); }
    function initializeSettings() { const theme = localStorage.getItem('wk8-theme') || 'default'; const fontFamily = localStorage.getItem('wk8-font-family') || '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'; const fontSize = localStorage.getItem('wk8-font-size') || '18'; const scrollSpeed = localStorage.getItem('wk8-scroll-speed') || 3; setTheme(theme); setFontFamily(fontFamily); const content = document.querySelector('#content'); if(content) content.style.setProperty('font-size', `${fontSize}px`, 'important'); updateFontSizeUI(parseInt(fontSize)); updateScrollSpeedUI(parseInt(scrollSpeed)); }

    // 脚本入口
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();