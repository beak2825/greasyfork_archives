// ==UserScript==
// @name         评论数过滤
// @namespace    mce-v2ex-filter
// @version      0.1
// @description  v2ex 过滤评论数过低的帖子
// @author       GPT
// @match        https://www.v2ex.com/?tab*
// @match        https://www.v2ex.com/recent
// @match        https://www.v2ex.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503655/%E8%AF%84%E8%AE%BA%E6%95%B0%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/503655/%E8%AF%84%E8%AE%BA%E6%95%B0%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        #filterContainer {
            position: fixed;
            top: 20px;
            left: 60px;
            padding: 10px;
            background-color: #ffffff;
            border: 1px solid #d3d3d3;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: 'Arial', sans-serif;
            transition: all 0.3s ease;
        }
        #toggleIcon {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #ffffff;
            border: 1px solid #d3d3d3;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 20px;
            cursor: pointer;
            z-index: 1001;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        #toggleIcon:hover {
            background-color: #f0f0f0;
            transform: scale(1.1);
        }
        .filter-input {
            width: 60px;
            margin-right: 10px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: border-color 0.2s ease-in-out;
        }
        .filter-input:focus {
            border-color: #007bff;
            outline: none;
        }
        .filter-button {
            padding: 6px 12px;
            background-color: #007bff;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .filter-button:hover {
            background-color: #0056b3;
        }
    `;

    // Inject CSS
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    function getStoredMinComments() {
        return parseInt(localStorage.getItem('minComments')) || 10;
    }

    function storeMinComments(value) {
        localStorage.setItem('minComments', value.toString());
    }

    function filterPosts(minComments) {
        const postItems = document.querySelectorAll('.item');
        postItems.forEach(item => {
            const commentCountElement = item.querySelector('.count_livid');
            const commentCount = parseInt(commentCountElement?.innerText.trim() || "0");
            item.style.display = commentCount < minComments ? 'none' : '';
        });
    }

    let minComments = getStoredMinComments();

    // Create UI
    const filterContainer = document.createElement('div');
    filterContainer.id = 'filterContainer';
    filterContainer.innerHTML = `
        <label>最小评论数: <input class="filter-input" type="number" value="${minComments}" id="inputMinComments"></label>
        <button class="filter-button" id="filterButton">筛选</button>
        <button class="filter-button" id="showAllButton" style="background-color: #28a745;">显示全部</button>
    `;

    const toggleIcon = document.createElement('div');
    toggleIcon.id = 'toggleIcon';
    toggleIcon.innerHTML = '<i class="fas fa-chevron-left"></i>';

    // Append to document
    document.body.appendChild(filterContainer);
    document.body.appendChild(toggleIcon);

    document.getElementById('inputMinComments').addEventListener('input', function() {
        minComments = parseInt(this.value);
        storeMinComments(minComments);
        filterPosts(minComments);
    });

    document.getElementById('filterButton').addEventListener('click', () => filterPosts(minComments));
    document.getElementById('showAllButton').addEventListener('click', () => filterPosts(0));

    toggleIcon.addEventListener('click', () => {
        const isHidden = filterContainer.style.display === 'none';
        filterContainer.style.display = isHidden ? 'block' : 'none';
        toggleIcon.innerHTML = isHidden ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';
        localStorage.setItem('filterState', isHidden ? 'expanded' : 'collapsed');
    });

    if (localStorage.getItem('filterState') === 'collapsed') {
        filterContainer.style.display = 'none';
        toggleIcon.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }

    filterPosts(minComments);
})();
