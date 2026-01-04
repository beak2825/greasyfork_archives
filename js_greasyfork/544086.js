// ==UserScript==
// @name         E站標籤複製
// @namespace    http://tampermonkey.net/
// @version      1.1 // 更新版本號
// @description  給一個複製當前圖庫頁面標籤按鈕，並區分男女
// @author       Mark
// @match        https://e-hentai.org/g/*/*
// @match        https://exhentai.org/g/*/*
// @match        https://ex.nmbyd3.top/g/*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544086/E%E7%AB%99%E6%A8%99%E7%B1%A4%E8%A4%87%E8%A3%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544086/E%E7%AB%99%E6%A8%99%E7%B1%A4%E8%A4%87%E8%A3%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("E-Hentai Tag Extractor: 腳本已運行。");
    
    // 創建一個結果顯示區域，預設隱藏
    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'eh_tag_extractor_result';
    resultDisplay.style.cssText = `
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #E3E0D1; /* 修改為您指定的顏色 */
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-all;
        position: relative;
        display: none;
    `;
    resultDisplay.innerHTML = `
        <p style="font-size: 1.2em; font-weight: bold;">提取的標籤結果：</p>
        <p>
            <span id="eh_male_tags_display"></span>
            <button class="eh_copy_button" data-target="male_tags">複製 Male 標籤</button>
        </p>
        <p>
            <span id="eh_female_tags_display"></span>
            <button class="eh_copy_button" data-target="female_tags">複製 Female 標籤</button>
        </p>
    `;

    // 創建一個觸發提取的按鈕
    const extractButton = document.createElement('button');
    extractButton.textContent = '提取漫畫標籤';
    extractButton.style.cssText = `
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
        border-radius: 4px;
        margin-right: 10px;
    `;

    // 複製文字到剪貼簿的通用函數
    function copyTextToClipboard(text, buttonElement) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
            console.log('文本已成功複製到剪貼簿 (GM_setClipboard)');
            if (buttonElement) {
                const originalText = buttonElement.textContent;
                const originalColor = buttonElement.style.backgroundColor;
                buttonElement.textContent = '已複製!';
                buttonElement.style.backgroundColor = '#6c757d';
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.style.backgroundColor = originalColor;
                }, 1500);
            }
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('文本已成功複製到剪貼簿 (navigator.clipboard)');
                if (buttonElement) {
                    const originalText = buttonElement.textContent;
                    const originalColor = buttonElement.style.backgroundColor;
                    buttonElement.textContent = '已複製!';
                    buttonElement.style.backgroundColor = '#6c757d';
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                        buttonElement.style.backgroundColor = originalColor;
                    }, 1500);
                }
            }).catch(err => {
                console.error('複製文本失敗:', err);
                alert('複製失敗，請手動複製: ' + text);
            });
        } else {
            alert('您的瀏覽器不支持自動複製，請手動複製:\n\n' + text);
        }
    }
    
    extractButton.addEventListener('click', () => {
        if (resultDisplay.style.display === 'block') {
            resultDisplay.style.display = 'none';
            extractButton.textContent = '提取漫畫標籤';
            console.log("E-Hentai Tag Extractor: 結果區塊已關閉。");
        } else {
            const taglistDiv = document.getElementById('taglist');
            if (!taglistDiv) {
                console.error("E-Hentai Tag Extractor: 找不到標籤列表。");
                document.getElementById('eh_male_tags_display').textContent = '錯誤：找不到標籤列表。';
                document.getElementById('eh_female_tags_display').textContent = '';
                resultDisplay.style.display = 'block';
                return;
            }
            
            console.log("E-Hentai Tag Extractor: 找到標籤列表，開始提取標籤。");

            const maleTags = [];
            const femaleTags = [];

            taglistDiv.querySelectorAll('tr').forEach(row => {
                const categoryTag = row.querySelector('td.tc');
                if (categoryTag) {
                    const categoryText = categoryTag.textContent.trim();
                    if (categoryText === 'male:') {
                        row.querySelectorAll('div.gt, div.gtl, div.gtw').forEach(tagDiv => {
                            const tag = tagDiv.querySelector('a').textContent;
                            maleTags.push(`${tag}`);
                        });
                    } else if (categoryText === 'female:') {
                        row.querySelectorAll('div.gt, div.gtl, div.gtw').forEach(tagDiv => {
                            const tag = tagDiv.querySelector('a').textContent;
                            femaleTags.push(`${tag}`);
                        });
                    }
                }
            });

            const maleTagsWithPrefix = maleTags.map(tag => `male:${tag}`);
            const femaleTagsWithPrefix = femaleTags.map(tag => `female:${tag}`);

            resultDisplay.maleTagsText = maleTagsWithPrefix.join(',');
            resultDisplay.femaleTagsText = femaleTagsWithPrefix.join(',');

            document.getElementById('eh_male_tags_display').textContent = resultDisplay.maleTagsText;
            document.getElementById('eh_female_tags_display').textContent = resultDisplay.femaleTagsText;
            resultDisplay.style.display = 'block';
            extractButton.textContent = '隱藏標籤結果';
            console.log("E-Hentai Tag Extractor: 標籤提取完成並顯示。");
        }
    });

    resultDisplay.querySelectorAll('.eh_copy_button').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetType = event.target.dataset.target;
            let textToCopy = '';
            if (targetType === 'male_tags') {
                textToCopy = resultDisplay.maleTagsText;
            } else if (targetType === 'female_tags') {
                textToCopy = resultDisplay.femaleTagsText;
            }
            if (textToCopy) {
                copyTextToClipboard(textToCopy, event.target);
            }
        });
    });

    const taglistDiv = document.getElementById('taglist');
    if (taglistDiv) {
        console.log("E-Hentai Tag Extractor: 找到 taglist，將按鈕插入其下方。");
        taglistDiv.parentNode.insertBefore(extractButton, taglistDiv.nextSibling);
        taglistDiv.parentNode.insertBefore(resultDisplay, extractButton.nextSibling);
    } else {
        console.error("E-Hentai Tag Extractor: 找不到 taglist 元素，無法插入按鈕。");
    }

})();