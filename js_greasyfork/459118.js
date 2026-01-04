// ==UserScript==
// @name         班固米去极端评分
// @namespace    https://bgm.tv
// @version      0.2
// @description  快速查看去除1分10分评分后的分数
// @author       xban
// @match        https://bgm.tv/subject/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459118/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%8E%BB%E6%9E%81%E7%AB%AF%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/459118/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%8E%BB%E6%9E%81%E7%AB%AF%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==
 
(function() {
    let subjectId = getSubjectIdFromUrl();
    let apiUrl = `https://api.bgm.tv/v0/subjects/${subjectId}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let ratings = data.rating;
            let count = ratings.count;

            let totalScore = 0;
            let totalCount = 0;
            Object.entries(count).forEach(([key, value]) => {
                let score = parseInt(key);
                let count = value;
                if (![1, 2, 9, 10].includes(score)) {
                    totalScore += score * count;
                    totalCount += count;
                }
            });
            let avgScore = (totalScore / totalCount).toFixed(2);

            let totalCountEx1and10 = 0;
            let totalScoreEx1and10 = 0;
            Object.entries(count).forEach(([key, value]) => {
                let score = parseInt(key);
                let count = value;
                if (![1, 10].includes(score)) {
                    totalScoreEx1and10 += score * count;
                    totalCountEx1and10 += count;
                }
            });
            let avgScoreEx1and10 = (totalScoreEx1and10 / totalCountEx1and10).toFixed(2);

            let ratingStatistics = document.createElement('div');
            ratingStatistics.innerHTML = `
                <h4>去除两端极端化评分的数据</h4>
                <p>(excluding 1 and 10): ${avgScoreEx1and10}</p>
                <p>(continue excluding 2 and 9): ${avgScore}</p>
            `;
            ratingStatistics.style = `
                font-size: 16px;
            `;

            let sidePanel = document.querySelector('.SidePanel');
            sidePanel.appendChild(ratingStatistics);
        });
 
    function getSubjectIdFromUrl() {
        let subjectIdMatch = window.location.pathname.match(/\/subject\/(\d+)/);
        if (!subjectIdMatch) {
            return null;
        }
        return subjectIdMatch[1];
    }
})();
