// ==UserScript==
// @name         地下探险队小脚本
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  支持自动挖矿，分配任务，开箱,自动科技（只支持从上到下）
// @author       浮世
// @match        http://ta.maougame.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517862/%E5%9C%B0%E4%B8%8B%E6%8E%A2%E9%99%A9%E9%98%9F%E5%B0%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/517862/%E5%9C%B0%E4%B8%8B%E6%8E%A2%E9%99%A9%E9%98%9F%E5%B0%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isButtonClickEnabled = true; 

    let skillClickEnabled = false;
    const targetPattern = /res\/sprites\/UI\/(gem_(1|2|3|4|5)_waste_\d+|chest)\.png/;
    const divImgPattern = /res\/sprites\/UI\/chest\.png/;

    function clickTargetElements() {
        const images = document.querySelectorAll('img[src]');
        images.forEach((img) => {
            if (targetPattern.test(img.src)) {
                const parentElement = img.closest('span, div');
                if (parentElement) {
                    parentElement.click(); 
                }
            }
            if (divImgPattern.test(img.src)) {
                const parentDiv = img.closest('div');
                if (parentDiv) {
                    parentDiv.click(); 
                }
            }
        });

        if (isButtonClickEnabled) {
            const buttons = document.querySelectorAll('div.basicBtn');
            buttons.forEach((button) => {
                if (button.classList.contains('disabled')) {
                } else {
                    if (button.textContent.trim() === '自动分配任务') {
                        button.click();
                    } else {
                    }
                }
            });
        }
        if(skillClickEnabled){
            const rows = document.querySelectorAll('tr.basicBtn');
            rows.forEach((row) => {
                if (!row.classList.contains('disabled')) {
                    row.click();
                } else {
                }
            });
        }

    }

    // 每秒执行一次
    setInterval(() => {
        clickTargetElements();
    }, 1000);

    const controlButton = document.createElement('button');
    controlButton.style.position = 'fixed';
    controlButton.style.top = '10px';
    controlButton.style.right = '10px';
    controlButton.style.padding = '10px 20px';
    controlButton.style.backgroundColor = '#4CAF50';
    controlButton.style.color = 'white';
    controlButton.style.border = 'none';
    controlButton.style.borderRadius = '5px';
    controlButton.style.fontSize = '14px';
    controlButton.textContent = isButtonClickEnabled ? '禁用自动分配' : '启用自动分配';

    controlButton.addEventListener('click', () => {
        isButtonClickEnabled = !isButtonClickEnabled;
        controlButton.textContent = isButtonClickEnabled ? '禁用自动分配' : '启用自动分配';
    });


    const controlButton2 = document.createElement('button');
    controlButton2.style.position = 'fixed';
    controlButton2.style.top = '60px';
    controlButton2.style.right = '10px';
    controlButton2.style.padding = '10px 20px';
    controlButton2.style.backgroundColor = '#4CAF50';
    controlButton2.style.color = 'white';
    controlButton2.style.border = 'none';
    controlButton2.style.borderRadius = '5px';
    controlButton2.style.fontSize = '14px';
    controlButton2.textContent = skillClickEnabled ? '禁用自动科技' : '启用自动科技';

    controlButton2.addEventListener('click', () => {
        skillClickEnabled = !skillClickEnabled;
        controlButton2.textContent = skillClickEnabled ? '禁用自动科技' : '启用自动科技';
    });

    document.body.appendChild(controlButton);
    document.body.appendChild(controlButton2);
})();
