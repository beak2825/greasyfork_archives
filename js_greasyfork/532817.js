// ==UserScript==
// @name         今日数独数字高亮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在今日数独网站上高亮用户填入的数字
// @author       coccvo
// @match        https://cn.sudoku.today/*.html
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlklEQVQ4jV3TO2sUYRQG4GfHmV3RQNa4ixdEBYmJimCjpVUk4AUVRQQt/CU2dlrb+AdMICLeSivBTrGyEBQLFRTMinjdTVgL38ExBz6YOd+cc97LmRbu4D3eYBPaOI8H+OZvTOAUlrCSM4UdkixwDpdT8BAd/6KDe/6PSSwWGGEXLmAP1gVFF2VOFxU25L5Mg1aRxCdcwWesBuL3Btz6+cea+3EZ+PuTXMY0NmIm7y1sjg6zGIbCVg2IJzN9iLPo4XjojVKwLUKupOkkeiV+43og1XEAr3AsTjzCM9xofNPGpSLdeg00E+jjCR5n0plwn4pmJ3AfCwXGmdIU7CsO4lCavsvU5Vh6Nchv1iLuxcd8tD62dbNgL/E6dHbjJwZ4gcNl/J3Hl9Apsxc7I2wbR6P6fGg9xTUswGJsa8bdNK6jbGzi9oi5BUu1iP0UVBGxE2HrXD9IqlAeRrdxGXUHDb9H+LUmN0hu1HBjBkW903P4kO6d/BNzUV0KpnEEbyPmaVQtXMS+dC4anFdjcR1VhL6NW3iO2T+OVmYHsHGmcAAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532817/%E4%BB%8A%E6%97%A5%E6%95%B0%E7%8B%AC%E6%95%B0%E5%AD%97%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/532817/%E4%BB%8A%E6%97%A5%E6%95%B0%E7%8B%AC%E6%95%B0%E5%AD%97%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.getElementById('sudoku-highlighter-container')) return;

    const style = document.createElement('style');
    style.textContent = `
        #sudoku-highlighter-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.9);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            cursor: move;
            display: flex;
            gap: 4px;
            user-select: none;
            -webkit-user-select: none;
        }
        #sudoku-highlighter-container button {
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
        }
        #sudoku-highlighter-container button.active {
            background: #ffeb3b;
        }
        .highlight-number {
            background: #ffeb3b !important;
            border: 2px solid #f44336 !important;
        }
    `;
    document.head.appendChild(style);

    let isDragging = false;
    let offsetX, offsetY;
    const toolbar = document.createElement('div');
    toolbar.id = 'sudoku-highlighter-container';

    for(let i=0; i<=9; i++){
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.onclick = function() {
            document.querySelectorAll('.pcell').forEach(cell => {
                cell.classList.remove('highlight-number');
                if(cell.value.includes(i.toString())) {
                    cell.classList.add('highlight-number');
                }
            });
            toolbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        };
        toolbar.appendChild(btn);
    }

    toolbar.addEventListener('mousedown', function(e) {
        if(e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - toolbar.offsetLeft;
        offsetY = e.clientY - toolbar.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if(!isDragging) return;
        toolbar.style.left = (e.clientX - offsetX) + 'px';
        toolbar.style.top = (e.clientY - offsetY) + 'px';
        toolbar.style.transform = 'none';
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => isDragging = false);
    document.body.appendChild(toolbar);
})();