// ==UserScript==
// @name         文献小助手（Literature Assistant）
// @version      0.0.1
// @author       occasional15
// @homepage     https://github.com/occasional15/Literature-Assistant
// @namespace    https://github.com/occasional15/Literature-Assistant
// @description  一个油猴脚本，支持提取当前文献页面的标题或DOI并一键跳转到其他网页进行搜索，目前支持网站：Sci Hub、ResearchGate、PubPeer、Google Scholar和Web of Science。
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529156/%E6%96%87%E7%8C%AE%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88Literature%20Assistant%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529156/%E6%96%87%E7%8C%AE%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88Literature%20Assistant%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式增强版
    const style = document.createElement('style');
    style.textContent = `
        .qs-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            font-family: Arial, sans-serif;
        }
        .qs-main-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #4285f4;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .qs-main-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 12px rgba(66,133,244,0.3);
        }
        .qs-menu {
            display: none;
            position: absolute;
            bottom: 50px;
            right: 0;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            border-radius: 10px;
            min-width: 180px;
            padding: 8px 0;
        }
        .qs-container.active .qs-menu {
            display: block;
            animation: fadeIn 0.2s ease-out;
        }
        .qs-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            color: #2c3e50;
            font-size: 14px;
            transition: background 0.2s;
        }
        .qs-item:hover {
            background: #f8f9fa;
        }
        .qs-item::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 12px;
            background-size: contain;
        }
        /* 各平台图标 */
        .qs-item[data-search-engine="scihub"]::before {
            background-image: url('https://sci-hub.se/favicon.ico');
        }
        .qs-item[data-search-engine="scholar"]::before {
            background-image: url('https://scholar.google.com/favicon.ico');
        }
        .qs-item[data-search-engine="researchgate"]::before {
            background-image: url('https://www.researchgate.net/favicon.ico');
        }
        .qs-item[data-search-engine="pubpeer"]::before {
            background-image: url('https://pubpeer.com/favicon.ico');
        }
        .qs-item[data-search-engine="wos"]::before {
            background-image: url('https://www.webofscience.com/favicon.ico');
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 创建按钮结构
    const container = document.createElement('div');
    container.className = 'qs-container';
    container.innerHTML = `
        <button class="qs-main-btn">🔍</button>
        <div class="qs-menu">
            <button class="qs-item" data-search-engine="scihub">Sci Hub</button>
            <button class="qs-item" data-search-engine="researchgate">ResearchGate</button>
            <button class="qs-item" data-search-engine="pubpeer">PubPeer</button>
            <button class="qs-item" data-search-engine="scholar">Google Scholar</button>
            <button class="qs-item" data-search-engine="wos">Web of Science</button>
        </div>
    `;
    document.body.appendChild(container);

    // 主按钮交互
    container.querySelector('.qs-main-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.toggle('active');
    });

    // 点击页面其他区域关闭
    document.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // 精准标题提取
    function getArticleTitle() {
        const metaTags = [
            'citation_title',
            'og:title',
            'DC.Title',
            'title'
        ].map(name =>
            document.querySelector(`meta[name="${name}"], meta[property="${name}"]`))
        .find(tag => tag);

        if (metaTags?.content) {
            return metaTags.content.replace(/\s*\-\s*.+$/, ''); // 移除网站后缀
        }

        const headings = Array.from(document.querySelectorAll('h1')).find(h1 => {
            const text = h1.textContent.trim();
            return text.length > 10 && !text.includes('404');
        });

        if (headings) {
            return headings.textContent
                .replace(/[\n\r\t]/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();
        }

        return document.title
            .replace(/( - PubMed)?( - ScienceDirect)?( \| SpringerLink)?$/, '')
            .replace(/^[\s\S]{120}[\s\S]*/, m => m.slice(0, 120) + '...');
    }

    // 提取 DOI
    function getArticleDOI() {
        const metaTags = [
            'citation_doi',
            'dc.identifier',
            'dc.identifier.doi'
        ].map(name =>
            document.querySelector(`meta[name="${name}"], meta[property="${name}"]`))
        .find(tag => tag);

        return metaTags ? metaTags.content : null;
    }

    // 智能搜索URL生成器
    const searchEngines = {
        scihub: doi => {
            if (doi) {
                return `https://sci-hub.sidesgame.com/${doi}`;
            }
            return null;
        },
        scholar: title => `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}&hl=en`,
        researchgate: title => `https://www.researchgate.net/search?q=${encodeURIComponent(title)}`,
        pubpeer: title => `https://pubpeer.com/search?q=${encodeURIComponent(title)}&type=publication`,
        wos: title => `https://webofscience.clarivate.cn/wos/alldb/advanced-search`
    };

    // 事件委托处理点击
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('qs-item')) return;

        const engine = e.target.dataset.searchEngine;
        const title = getArticleTitle();
        const doi = getArticleDOI();

        // 生成目标URL
        const generator = searchEngines[engine];
        if (!generator) return;
        let targetURL;
        if (engine === 'scihub') {
            targetURL = generator(doi);
            if (!targetURL) {
                console.error('未找到文章的 DOI，无法跳转到 Sci Hub 搜索。');
                return;
            }
        } else {
            targetURL = generator(title);
        }

        window.open(targetURL, '_blank');
    });
})();
