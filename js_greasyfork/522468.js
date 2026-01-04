// ==UserScript==
// @name         西南医科大学教务处教学评价半自动处理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  西南医科大学教务处教学评价，配合连点器使用更佳，觉得好用的话给作者qq（2260016667）点个赞呗
// @author       Siven
// @match        http://ea.swmu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522468/%E8%A5%BF%E5%8D%97%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/522468/%E8%A5%BF%E5%8D%97%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tbodies = document.querySelectorAll('tbody');
    let hasOpenedPage = false; 

    tbodies.forEach(tbody => {
        const rows = tbody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');

            if (cells.length >= 3) {
                
                handleThreeOrMoreCells(row);
            } else if (cells.length === 2) {
                
                handleTwoCells(row);
            }
        });
    });

    function handleThreeOrMoreCells(row) {
        let totalCount = 0;
        let evaluationLinks = [];

        const text = row.innerText;

        
        const count = (text.match(/(?<!学生)评价/g) || []).length;
        totalCount += count;

        
        const links = row.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.textContent.includes('评价')) {
                const href = link.getAttribute('href');
                const match = href.match(/'([^']+)'/);
                if (match) {
                    evaluationLinks.push(match[1]);
                }
            }
        });

        
        const resultElement = document.createElement('div');
        resultElement.style.position = 'fixed';
        resultElement.style.bottom = '10px';
        resultElement.style.right = '10px';
        resultElement.style.backgroundColor = 'yellow';
        resultElement.style.padding = '10px';
        resultElement.style.borderRadius = '5px';
        resultElement.style.zIndex = '9999';

        
        const randomLinkContent = evaluationLinks.length > 0 ? evaluationLinks[Math.floor(Math.random() * evaluationLinks.length)] : '无';
        const newUrl = randomLinkContent !== '无' ? `http://ea.swmu.edu.cn${randomLinkContent}` : '无';

        resultElement.innerText = `未完成个数：${totalCount}`;

        
        document.body.appendChild(resultElement);

        
        if (newUrl !== '无' && !hasOpenedPage) {
            window.open(newUrl, '_blank');
            hasOpenedPage = true; 
        }
    }

    function handleTwoCells(row) {
        const secondCell = row.querySelector('td:nth-child(2)');
        const input = secondCell.querySelector('input[id*="_2"]');

        if (input) {
            input.click();
        }
    }

    
    tbodies.forEach(tbody => {
        const submitInput = tbody.querySelector('input[value="提  交"]');
        if (submitInput) {
            submitInput.click();
        }
    });

    
    const completionElement = document.createElement('div');
    completionElement.style.position = 'fixed';
    completionElement.style.bottom = '50px';
    completionElement.style.right = '10px';
    completionElement.style.padding = '10px';
    completionElement.style.borderRadius = '5px';
    completionElement.style.zIndex = '9999';

    
    document.body.appendChild(completionElement);
})();
