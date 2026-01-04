// ==UserScript==
// @name         cdwswb
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为收藏的题目添加评分
// @author       cww
// @match        https://codeforces.com/favourite/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511567/cdwswb.user.js
// @updateURL https://update.greasyfork.org/scripts/511567/cdwswb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getUserFavorites() {
        let g = [];
        let table = document.querySelector('.problems');
        let rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i];

            var s = row.children[0].querySelector('a').textContent.replace(/\s+/g, '');
            var num = "";
            var c = "";
            var j = 0;
            while (j < s.length && s[j] >= '0' && s[j] <= '9') {
                j += 1;
            }
            num = s.substr(0, j);
            c = s.substr(j);
            g.push({ contestId: parseInt(num), index: c });
        }
        return g;
    }

    async function getFilteredProblems(favoriteIds) {
        const url = "https://codeforces.com/api/problemset.problems";

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                const problems = data.result.problems;
                const problemMap = {};
                problems.forEach(problem => {
                    problemMap[`${problem.contestId}${problem.index}`] = problem;
                });

                return favoriteIds.map(favorite => {
                    const problem = problemMap[`${favorite.contestId}${favorite.index}`];
                    if (problem) {
                        return { ...problem, rating: problem.rating || Infinity };
                    }
                    return { ...favorite, rating: Infinity };
                });
            } else {
                console.error("Error fetching problems:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
        return [];
    }

    // 主程序
    getUserFavorites().then(favoriteIds => {
        getFilteredProblems(favoriteIds).then(filteredProblems => {
            console.log(filteredProblems);
            let table = document.querySelector('.problems');
            let rows = table.querySelectorAll('tr');

            // 动态创建 <th> 和按钮
            const newTh = document.createElement('th');
            const sortButton = document.createElement('button');
            sortButton.textContent = 'ASC'; // 设置按钮文本
            sortButton.id = 'sortButton'; // 设置按钮 ID
            newTh.appendChild(sortButton);
            rows[0].insertBefore(newTh, rows[0].children[2]);
            let g = [];
            // 更新表格
            filteredProblems.forEach((problem, index) => {
                if (index + 1 < rows.length) {
                    const rating = problem.rating;
                    console.log(`题目名称: ${problem.name}, 比赛ID: ${problem.contestId}, 难度: ${rating}`);

                    let row = rows[index + 1];
                    let newTd = document.createElement('td');
                    if (index % 2 == 0) newTd.style.backgroundColor = "#F0F0F0";

                    // 根据 rating 设置字体颜色
                    if (rating < 1200) {
                        newTd.style.color = 'gray';
                    } else if (rating < 1400) {
                        newTd.style.color = 'green';
                    } else if (rating < 1600) {
                        newTd.style.color = 'cyan';
                    } else if (rating < 1900) {
                        newTd.style.color = 'blue';
                    } else if (rating < 2100) {
                        newTd.style.color = 'orange';
                    } else if (rating < 2300) {
                        newTd.style.color = '#FF8C00';
                    } else if (rating < 2600) {
                        newTd.style.color = 'lightcoral';
                    } else if (rating < 3000) {
                        newTd.style.color = 'red';
                    } else {
                        newTd.style.color = '#8B0000';
                    }
                    newTd.textContent = rating === Infinity ? '***' : rating;
                    row.insertBefore(newTd, row.children[2]);
                    g.push({ row : row, rating : rating });
                }
            });
            console.log(g);
            // 按钮点击事件逻辑
            let ascending = false; // 用于跟踪排序顺序
            sortButton.addEventListener('click', function() {
                let head = rows[0];
                console.log(head);
                // 对 g 数组按 rating 进行排序
                const sortedG = g.sort((a, b) => ascending ? a.rating - b.rating : b.rating - a.rating);

                // 更新表格，保留表头
                const tbody = table.querySelector('tbody');
                // 清空 tbody 中的行，但保留表头
                tbody.innerHTML = '';
                tbody.appendChild(head);
                // 重新插入排序后的行
                sortedG.forEach(item => {
                    tbody.appendChild(item.row);
                });
                console.log(g);
                ascending = !ascending; // 切换排序状态
                sortButton.textContent = ascending ? 'DESC' : 'AESC'; // 更新按钮文本
            });
        });
    })();
})();