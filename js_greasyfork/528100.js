// ==UserScript==
// @name         不可说种子页面颜色标记
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在种子页面表格对不同条件的行进行背景色标记:1、深灰色，白字，条件：中性或可替代，或种子数大于3倍完成数  2、1～10g，浅蓝色  3、10～20g，浅黄色
// @author       softOS
// @match        https://springsunday.net/torrents.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528100/%E4%B8%8D%E5%8F%AF%E8%AF%B4%E7%A7%8D%E5%AD%90%E9%A1%B5%E9%9D%A2%E9%A2%9C%E8%89%B2%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/528100/%E4%B8%8D%E5%8F%AF%E8%AF%B4%E7%A7%8D%E5%AD%90%E9%A1%B5%E9%9D%A2%E9%A2%9C%E8%89%B2%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .row-deepgray {
            background-color: #444444 !important;
            color: #FFFFFF !important;
        }
        .row-lightblue {
            background-color: #D4F1F9 !important;
        }
        .row-lightyellow {
            background-color: #FFFFCC !important;
        }
    `;
    document.head.appendChild(style);

    // 主函数
    function highlightRows() {
        // 找到种子表格
        const table = document.querySelector('table.torrents');
        if (!table) return;

        // 获取所有行（跳过表头）
        const rows = table.querySelectorAll('tr:not(.colhead)');

        for (let row of rows) {
            // 跳过可能的特殊行
            if (row.classList.contains('colhead')) continue;

            // 获取种子数和完成数
            const seedersCell = row.querySelector('td:nth-child(6)');
            const completedCell = row.querySelector('td:nth-child(8)');

            if (!seedersCell || !completedCell) continue;

            // 提取数字
            const seedersText = seedersCell.textContent.trim();
            const completedText = completedCell.textContent.trim();
            const seedersCount = parseInt(seedersText) || 0;
            const completedCount = parseInt(completedText) || 0;

            // 检查种子标题中是否包含"中性"或"可替代"（检查小标题部分）
            const smallDescr = row.querySelector('.torrent-smalldescr');
            let isNeutralOrSubstitutable = false;

            if (smallDescr) {
                const descrText = smallDescr.textContent.toLowerCase();
                isNeutralOrSubstitutable = descrText.includes('中性') || descrText.includes('可替代');
            }

            // 获取种子的标题元素用于查找Free标签
            const torrentTitle = row.querySelector('.torrent-title');
            let gValue = 0;

            if (torrentTitle) {
                // 寻找Free标签，并判断是否有时间限制信息
                const freeTag = torrentTitle.querySelector('.torrent-pro-free');
                    // 这里需要计算g值，根据实际情况可能需要调整
                    const sizeCell = row.querySelector('td:nth-child(5)');
                    if (sizeCell) {
                        // 获取单元格内容
                        const content = sizeCell.innerHTML;
                        console.log("content：", content);
                        // 使用正则表达式提取数值
                        const sizeMatch = content.match(/(\d+\.\d+)<br>/);
                        //console.log("sizeMatch：", sizeMatch);
                        //const sizeText = sizeCell.textContent.trim();
                        //let sizeValue = parseFloat(sizeText) || 0;
                        gValue =  parseFloat(sizeMatch[1]) || 0
                       //console.log("gValue：", gValue);
                        // 如果是GB单位
                        if (sizeMatch[0].includes('PB')) {
                            gValue = gValue*1024;
                        }
                        // 如果是MB单位，转换为GB
                        else if (sizeMatch[0].includes('MB')) {
                            gValue = gValue / 1024;
                        }

                    }

            }

            // 应用规则
            // 规则1：深灰色，白字，条件：中性或可替代，或种子数大于3倍完成数
            if (isNeutralOrSubstitutable || (completedCount > 0 && seedersCount > completedCount * 3)) {
                row.classList.add('row-deepgray');
            }
            // 规则2：1～10g，浅蓝色
            else if (gValue >= 1 && gValue < 10) {
                row.classList.add('row-lightblue');
            }
            // 规则3：10～20g，浅黄色
            else if (gValue >= 10 && gValue <= 20) {
                row.classList.add('row-lightyellow');
            }
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', highlightRows);

    // 如果页面使用了AJAX加载内容，可能需要定期检查表格变化
    // 每2秒检查一次（可根据需要调整）
    setInterval(highlightRows, 2000);
})();
