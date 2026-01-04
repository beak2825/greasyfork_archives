// ==UserScript==
// @name         Blu-ray封面直达
// @version      1.0
// @description  在Blu-ray电影页面添加封面直达按钮
// @match        *://www.blu-ray.com/movies/*/
// @grant        GM_openInTab
// @run-at       document-end
// @namespace https://greasyfork.org/users/454991
// @downloadURL https://update.greasyfork.org/scripts/527940/Blu-ray%E5%B0%81%E9%9D%A2%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527940/Blu-ray%E5%B0%81%E9%9D%A2%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createButton = () => {
        const btn = document.createElement('button');
        btn.textContent = '查看封面';
        btn.style = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            padding: 12px 24px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;

        btn.addEventListener('mouseover', () => {
            btn.style.background = '#006cbd';
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('mouseout', () => {
            btn.style.background = '#0078d4';
            btn.style.transform = 'none';
            btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });

        return btn;
    };

    const extractMovieId = () => {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];
    };

    const main = () => {
        const btn = createButton();

        btn.addEventListener('click', () => {
            const movieId = extractMovieId();
            if (!/^\d+$/.test(movieId)) {
                alert('无法获取有效电影ID');
                return;
            }

            const coverUrl = `https://images.static-bluray.com/movies/covers/${movieId}_front.jpg`;
            GM_openInTab(coverUrl, { active: true });
        });

        document.body.appendChild(btn);
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();