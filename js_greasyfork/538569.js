// ==UserScript==
// @name         幕客网课程抓取工具（导出CSV本地下载）
// @namespace    http://tampermonkey.net/
// @version      2.51
// @description  抓取课程信息并导出CSV，无需发送后端
// @match        https://coding.imooc.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538569/%E5%B9%95%E5%AE%A2%E7%BD%91%E8%AF%BE%E7%A8%8B%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88%E5%AF%BC%E5%87%BACSV%E6%9C%AC%E5%9C%B0%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538569/%E5%B9%95%E5%AE%A2%E7%BD%91%E8%AF%BE%E7%A8%8B%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88%E5%AF%BC%E5%87%BACSV%E6%9C%AC%E5%9C%B0%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const allCourses = [];

    function showLoading() {
        const loading = document.createElement('div');
        loading.id = 'imooc-loading-overlay';
        loading.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9998;
            font-size: 20px;
            color: white;
            font-weight: bold;
        `;
        loading.innerHTML = '⏳ 正在抓取课程数据，请稍候...';
        document.body.appendChild(loading);
    }

    function hideLoading() {
        const loading = document.getElementById('imooc-loading-overlay');
        if (loading) document.body.removeChild(loading);
    }

    function getTotalPages() {
        const pageLinks = document.querySelectorAll('.page a[href*="page="]');
        const pages = Array.from(pageLinks)
            .map(a => {
                const match = a.href.match(/page=(\d+)/);
                return match ? parseInt(match[1]) : null;
            })
            .filter(n => n !== null);
        return pages.length ? Math.max(...pages) : 1;
    }

    function getBaseUrlAndParam() {
        const url = new URL(window.location.href);
        const base = url.origin + url.pathname;
        const searchParams = new URLSearchParams(url.search);
        searchParams.delete('page');
        const paramStr = searchParams.toString();
        return {
            baseUrl: base,
            paramPrefix: paramStr ? `${paramStr}&` : ''
        };
    }

    function parseHTML(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const cards = doc.querySelectorAll('li.course-card');
        const pageCourses = [];

        cards.forEach(card => {
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price') + '元';

            const numbersText = card.querySelector('p.one .numbers')?.innerText || '';
            const [level, applyRaw] = numbersText.split('·').map(s => s.trim());
            const apply = applyRaw?.replace('人报名', '') || '';

            const imgDiv = card.querySelector('.img');
            let image = '';
            if (imgDiv) {
                const style = imgDiv.getAttribute('style') || '';
                const match = style.match(/url\((.*?)\)/);
                if (match && match[1]) {
                    image = match[1].startsWith('//') ? 'https:' + match[1] : match[1];
                }
            }

            pageCourses.push({
                name,
                level,
                apply,
                price,
                image
            });
        });

        return pageCourses;
    }

    function exportCSV(dataArray, filename = 'imooc_courses.csv') {
        const headers = ['课程名称', '等级', '报名人数', '价格', '图片地址'];
        const rows = dataArray.map(d => [d.name, d.level, d.apply, d.price, d.image]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    async function fetchAllPages() {
        allCourses.length = 0;
        showLoading();

        const totalPages = getTotalPages();
        const { baseUrl, paramPrefix } = getBaseUrlAndParam();

        for (let page = 1; page <= totalPages; page++) {
            const url = `${baseUrl}?${paramPrefix}page=${page}`;
            console.log(`📄 抓取第 ${page} 页：${url}`);

            try {
                const res = await fetch(url, { credentials: 'include' });
                const html = await res.text();
                const courses = parseHTML(html);
                allCourses.push(...courses);
            } catch (err) {
                console.error(`❌ 第 ${page} 页请求失败：`, err);
                break;
            }
        }

        console.log('✅ 抓取完成，共', allCourses.length, '条课程');
        hideLoading();

        if (allCourses.length > 0) {
            exportCSV(allCourses);
        } else {
            alert('未抓取到任何课程信息。');
        }
    }

    function addGrabButton() {
        const btn = document.createElement('button');
        btn.textContent = '📦 导出课程CSV';
        btn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background-color: #28a745;
            color: white;
            padding: 10px 16px;
            font-size: 14px;
            border: none;
            border-radius: 6px;
            box-shadow: 0 0 6px rgba(0,0,0,0.2);
            cursor: pointer;
        `;
        btn.onclick = fetchAllPages;
        document.body.appendChild(btn);
    }

    window.addEventListener('load', () => {
        setTimeout(addGrabButton, 1000);
    });
})();