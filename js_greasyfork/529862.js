// ==UserScript==
// @name         GitHub 增强套件
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  融合 GitHub 增强功能：新窗口打开链接、MD 文件目录化、固定页面头部
// @author       lecoler & contributors
// @match        *://github.com/*
// @match        *://gitee.com/*/*
// @match        *://npmjs.com/*/*
// @include      *.md
// @icon         https://github.com/favicon.ico
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529862/GitHub%20%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529862/GitHub%20%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 通用工具和配置 ===
    const githubRegex = /^https?:\/\/(www\.)?github\.com\//i; // GitHub 链接正则
    const processedLinks = new WeakSet(); // 缓存已处理的链接
    const log = (...args) => console.log('[GitHub 增强套件]', ...args); // 简化的日志函数

    // ===========================================================================
    // === 功能1：强制在新窗口打开 GitHub 链接 ===
    // ===========================================================================

    function handleNewWindowClick(e) {
        const link = e.target.closest('a');
        if (!link || processedLinks.has(link)) return;

        const href = link.href;
        if (!href || !githubRegex.test(href) || href.includes('mailto:') || href.includes('#') || link.target === '_blank') return;

        e.preventDefault();
        e.stopPropagation();
        window.open(href, '_blank');
        processedLinks.add(link);
    }

    document.addEventListener('click', handleNewWindowClick, { capture: true, passive: false });

    // ===========================================================================
    // === 功能2：MD 文件目录化 ===
    // ===========================================================================

    let $main, $menu, $button, lastPathName = '', moveStatus = false, titleHeight = 0;

    function createMdDom() {
        const css = document.createElement('style');
        css.innerHTML = `
            .le-md { position: fixed; top: 16%; left: 90%; z-index: 999; }
            .le-md-btn { width: 60px; height: 60px; border-radius: 50%; color: #fff; background: hsla(230,50%,50%,0.6); text-align: center; line-height: 60px; cursor: move; }
            .le-md-btn:hover { background: hsla(220,50%,47%,1); }
            .le-md-btn-hidden { display: none; }
            .hidden { height: 0 !important; min-height: 0 !important; border: 0 !important; }
            .le-md-left { right: 0; margin-right: 100px; } .le-md-right { left: 0; margin-left: 100px; }
            .le-md-top { bottom: 0; } .le-md-bottom { top: 0; }
            .le-md > ul { width: 200px; max-height: 700px; list-style: none; position: absolute; overflow: auto; padding-right: 10px; }
            .le-md > ul a { text-decoration: none; color: #909399; display: block; padding: 5px 10px; background: #f4f4f5; }
            .le-md li.le-md-title-active a { background: linear-gradient(-135deg, #ffcccc 0.6em, #fff 0); }
            .le-md li.le-md-title-active.le-md-title-active-first a { background: linear-gradient(-135deg, #ff9999 0.6em, #fff 0); color: #000; font-weight: 700; }
        `;
        document.head.appendChild(css);

        $main = document.createElement('div');
        $button = document.createElement('div');
        $menu = document.createElement('ul');
        $button.innerHTML = '目录';
        $button.title = '右键返回顶部';
        $button.addEventListener('click', toggleMenu);
        $button.oncontextmenu = e => { scrollTo(0, 0); return false; };
        $main.appendChild($button);
        $main.appendChild($menu);
        $main.className = 'le-md';
        document.body.appendChild($main);

        $button.onmousedown = e => {
            const eleX = e.offsetX, eleY = e.offsetY;
            let count = 0;
            document.onmousemove = ev => {
                if (count++ > 9) moveStatus = true;
                const x = ev.clientX - eleX, y = ev.clientY - eleY;
                const winWidth = document.documentElement.clientWidth, winHeight = document.documentElement.clientHeight;
                $main.style.left = `${(x / winWidth * 100).toFixed(3)}%`;
                $main.style.top = `${(y / winHeight * 100).toFixed(3)}%`;
            };
            $button.onmouseup = $button.onmouseout = () => document.onmousemove = null;
        };

        window.onresize = () => { if (!$menu.className.match(/hidden/)) $menu.className += ' hidden'; };
    }

    function toggleMenu(e) {
        if (moveStatus) { moveStatus = false; return; }
        if ($menu.className.match(/hidden/)) {
            if (lastPathName !== location.pathname) generateMdMenu(true);
            const winWidth = document.documentElement.clientWidth, winHeight = document.documentElement.clientHeight;
            const x = e.clientX, y = e.clientY;
            $menu.className = `${winWidth / 2 - x > 0 ? 'le-md-right' : 'le-md-left'} ${winHeight / 2 - y > 0 ? 'le-md-bottom' : 'le-md-top'}`;
        } else {
            $menu.className += ' hidden';
        }
    }

    function generateMdMenu(flag) {
        lastPathName = location.pathname;
        let $content, list = [];
        const host = location.host;

        if (host === 'github.com') {
            const $parent = document.getElementById('readme') || document.getElementById('wiki-body');
            $content = $parent?.getElementsByClassName('markdown-body')[0];
            titleHeight = ($parent?.parentElement?.getElementsByClassName('js-sticky')[0]?.offsetHeight || 0) + 2;
            !$menu && window.addEventListener('pjax:complete', generateMdMenu);
        } else if (host === 'gitee.com') {
            $content = document.getElementById('tree-content-holder')?.getElementsByClassName('markdown-body')[0];
        } else if (host === 'www.npmjs.com') {
            $content = document.getElementById('readme');
        } else {
            $content = detectMdContent();
        }

        const $children = $content?.children || [];
        for (let $dom of $children) {
            const tag = $dom.tagName;
            if (tag.length === 2 && tag.startsWith('H') && !isNaN(+tag[1])) {
                const value = $dom.innerText.trim();
                const $a = $dom.getElementsByTagName('a')[0];
                if ($a) list.push({ type: +tag[1], value, href: $a.getAttribute('href'), offsetTop: getOffsetTop($a) });
            }
        }

        if ($menu) $menu.innerHTML = '';
        else createMdDom();
        if (!flag) $menu.className = 'hidden';

        if (list.length) {
            list.forEach(i => {
                const li = document.createElement('li');
                li.setAttribute('data-offsetTop', i.offsetTop);
                const a = document.createElement('a');
                a.href = i.href;
                a.title = i.value;
                a.style = `font-size:${1.3 - i.type * 0.1}em;margin-left:${i.type - 1}em;border-left:0.5em groove hsla(200,80%,${45 + i.type * 10}%,0.8);`;
                a.innerText = i.value;
                li.appendChild(a);
                $menu.appendChild(li);
            });
            $button.className = 'le-md-btn';
        } else {
            $button.className = 'le-md-btn le-md-btn-hidden';
        }

        initScrollHighlight();
    }

    function detectMdContent() {
        let tmp = [];
        for (let i = 1; i < 7; i++) {
            const list = document.body.getElementsByTagName(`h${i}`);
            for (let j of list) {
                const parent = j.parentElement;
                const item = tmp.find(k => k.ele.isEqualNode(parent));
                if (item) item.count++; else tmp.push({ ele: parent, count: 1 });
            }
        }
        return tmp.sort((a, b) => b.count - a.count)[0]?.ele || null;
    }

    function getOffsetTop($dom, val = 0) {
        return $dom ? getOffsetTop($dom.offsetParent, ($dom.offsetTop || 0) + val) : val;
    }

    function initScrollHighlight() {
        const update = debounce(() => {
            const scrollTop = (document.documentElement.scrollTop || document.body.scrollTop || 0) + titleHeight;
            const offsetHeight = document.documentElement.clientHeight || document.body.clientHeight || 0;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
            if ($menu) {
                Array.from($menu.children).forEach((li, i) => {
                    const val = +li.getAttribute('data-offsetTop');
                    const nextVal = $menu.children[i + 1] ? +$menu.children[i + 1].getAttribute('data-offsetTop') : scrollHeight;
                    li.className = '';
                    if (scrollTop <= val && val <= offsetHeight + scrollTop) li.className = 'le-md-title-active';
                    if (scrollTop >= val && nextVal > scrollTop) li.className = 'le-md-title-active le-md-title-active-first';
                });
            }
        }, 500);
        window.onscroll = window.onscroll ? function() { window.onscroll.call(this); update(); } : update;
    }

    function debounce(func, time) {
        let timeId;
        return function() {
            clearTimeout(timeId);
            timeId = setTimeout(() => func.apply(this, arguments), time);
        };
    }

    // ===========================================================================
    // === 功能3：固定页面头部 ===
    // ===========================================================================

    // 固定 GitHub 页面头部
    function fixPageHeader() {
        // 使用更健壮的选择器定位 GitHub 头部（兼容不同页面）
        const header = document.querySelector('.AppHeader, header[role="banner"]');
        if (!header) {
            log('未找到页面头部元素');
            return;
        }

        // 注入固定样式的 CSS
        const css = document.createElement('style');
        css.id = 'fixed-header-style'; // 添加 ID 以便后续更新
        css.innerHTML = `
            .AppHeader, header[role="banner"] {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 10000 !important; /* 高优先级，避免被覆盖 */
                background-color: #24292e !important; /* GitHub 默认头部背景色 */
                box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加阴影，提升视觉效果 */
            }
            body {
                padding-top: ${header.offsetHeight}px !important; /* 根据头部高度调整内容偏移 */
            }
        `;
        document.head.appendChild(css);

        // 监听 PJAX 事件，确保动态加载后更新样式
        window.addEventListener('pjax:complete', () => {
            const newHeader = document.querySelector('.AppHeader, header[role="banner"]');
            if (newHeader) {
                document.body.style.paddingTop = `${newHeader.offsetHeight}px`;
            }
        });

        // 使用 MutationObserver 监听 DOM 变化，确保头部始终固定
        const observer = new MutationObserver(() => {
            const currentHeader = document.querySelector('.AppHeader, header[role="banner"]');
            if (currentHeader && !currentHeader.style.position) {
                document.body.style.paddingTop = `${currentHeader.offsetHeight}px`;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ===========================================================================
    // === 初始化脚本 ===
    // ===========================================================================

    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            generateMdMenu(); // 初始化 MD 目录
            fixPageHeader();  // 初始化固定页面头部
            log('已加载');
        }
    };
})();