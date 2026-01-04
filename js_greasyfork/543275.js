// ==UserScript==
// @name         tmall_brand_id_finder
// @name:zh-CN   天猫品牌ID查找器
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2.5
// @description  Finds the first 'Brand' field and ID from Tmall detail pages (incl. tmall.hk), displays them in a copy-friendly table. Click any cell to copy all info.
// @description:zh-CN  从天猫详情页(支持tmall.com, tmall.hk等)查找第一个“品牌”字段和ID，并将其显示在包含平台的、便于复制的表格中。点击任一单元格即可复制所有信息。
// @author       Gemini/yhuang2yipit
// @match        https://detail.tmall.com/item.htm*
// @match        https://detail.tmall.hk/item.htm*
// @match        https://detail.tmall.hk/hk/item.htm*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543275/tmall_brand_id_finder.user.js
// @updateURL https://update.greasyfork.org/scripts/543275/tmall_brand_id_finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 创建并显示包含可复制表格的信息框
     * @param {string} brandName - 找到的品牌名称
     * @param {string} brandId - 找到的品牌ID
     */
    function displayInfo(brandName, brandId) {
        let infoBox = document.getElementById('tmall-brand-info-box');
        if (!infoBox) {
            infoBox = document.createElement('div');
            infoBox.id = 'tmall-brand-info-box';
            // 设置信息框样式
            infoBox.style.position = 'fixed';
            infoBox.style.top = '120px';
            infoBox.style.right = '20px';
            infoBox.style.zIndex = '9999';
            infoBox.style.backgroundColor = 'rgba(247, 247, 247, 0.98)';
            infoBox.style.border = '1px solid #e1e1e1';
            infoBox.style.borderRadius = '8px';
            infoBox.style.padding = '15px';
            infoBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            infoBox.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
            infoBox.style.fontSize = '14px';
            infoBox.style.color = '#333';
            infoBox.style.width = '420px';
            document.body.appendChild(infoBox);
        }

        const brandNameText = brandName;
        const brandIdText = brandId;

        // 使用表格进行输出
        infoBox.innerHTML = `
            <h3 style="margin: 0 0 12px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 8px; color: #000;">天猫品牌信息 (点击表格复制)</h3>
            <table id="tmall-brand-copy-table" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="text-align: left; font-size: 12px; color: #555;">
                  <th style="padding: 4px 8px; width: 25%;">品牌 ID</th>
                  <th style="padding: 4px 8px; width: 45%;">品牌名称</th>
                  <th style="padding: 4px 8px; width: 30%;">平台</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td id="brand-id-cell" title="点击复制所有信息" style="border: 1px solid #ccc; padding: 8px; background: #fff; cursor: pointer; word-break: break-all;">${brandIdText}</td>
                  <td id="brand-name-cell" title="点击复制所有信息" style="border: 1px solid #ccc; padding: 8px; background: #fff; cursor: pointer; word-break: break-all;">${brandNameText}</td>
                  <td id="platform-cell" title="点击复制所有信息" style="border: 1px solid #ccc; padding: 8px; background: #fff; cursor: pointer; word-break: break-all;">Tmall</td>
                </tr>
              </tbody>
            </table>
            <div id="copy-feedback" style="margin-top: 10px; font-size: 12px; color: #28a745; text-align: center; height: 16px; opacity: 0; transition: opacity 0.5s ease-in-out;"></div>
        `;

        // -- 点击复制功能 --
        const idCell = document.getElementById('brand-id-cell');
        const nameCell = document.getElementById('brand-name-cell');
        const platformCell = document.getElementById('platform-cell');
        const feedbackDiv = document.getElementById('copy-feedback');

        const copyAllCells = () => {
            const idText = idCell.textContent;
            const nameText = nameCell.textContent;
            const platformText = platformCell.textContent;

            if (idText.includes('未找到') || idText.includes('寻找中') || nameText.includes('未找到')) {
                feedbackDiv.textContent = '数据不完整，无法复制';
                feedbackDiv.style.color = '#dc3545';
                feedbackDiv.style.opacity = '1';
                setTimeout(() => { feedbackDiv.style.opacity = '0'; }, 2000);
                return;
            }

            // 使用 Tab (\t) 分隔，方便直接粘贴到Excel等表格软件
            const combinedText = `${idText}\t${nameText}\t${platformText}`;

            navigator.clipboard.writeText(combinedText).then(() => {
                feedbackDiv.textContent = `已复制: ${idText} | ${nameText} | ${platformText}`;
                feedbackDiv.style.color = '#28a745';
                feedbackDiv.style.opacity = '1';
                setTimeout(() => { feedbackDiv.style.opacity = '0'; }, 2500);
            }, () => {
                feedbackDiv.textContent = '复制失败，请手动复制';
                feedbackDiv.style.color = '#dc3545';
                feedbackDiv.style.opacity = '1';
                setTimeout(() => { feedbackDiv.style.opacity = '0'; }, 2000);
            });
        };

        // 将同一个复制函数绑定到所有单元格上
        idCell.addEventListener('click', copyAllCells);
        nameCell.addEventListener('click', copyAllCells);
        platformCell.addEventListener('click', copyAllCells);
    }

    /**
     * 查找第一个品牌名称
     * @returns {string} 品牌名称或提示信息
     */
    function findBrandName() {
        const xPath = "//div[contains(@class, 'Title') and contains(text(), '品牌')]/following-sibling::div[contains(@class, 'Content')]";
        // 使用 FIRST_ORDERED_NODE_TYPE 直接获取第一个匹配的节点
        const resultNode = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (resultNode && resultNode.textContent) {
            return resultNode.textContent.trim();
        }

        return '<span style="color: #f0ad4e;">寻找中...</span>';
    }

    /**
     * 从页面HTML中查找品牌ID
     * @returns {string} 品牌ID或等待提示
     */
    function findBrandId() {
        const htmlContent = document.documentElement.innerHTML;
        const regex = /_brand=(\d+)&/;
        const match = htmlContent.match(regex);
        return match && match[1] ? match[1] : '<span style="color: #f0ad4e;">寻找中...</span>';
    }

    // --- 主执行逻辑 ---
    const maxAttempts = 50;
    let attempts = 0;

    const finderInterval = setInterval(() => {
        const brandName = findBrandName();
        const brandId = findBrandId();

        const isBrandNameFound = !brandName.includes('寻找中');
        const isBrandIdFound = !brandId.includes('寻找中');

        if ((isBrandNameFound && isBrandIdFound) || attempts >= maxAttempts) {
            clearInterval(finderInterval);
            const finalBrandId = isBrandIdFound ? brandId : '未找到 (Not Found)';
            const finalBrandName = isBrandNameFound ? brandName : '未找到 (Not Found)';
            displayInfo(finalBrandName, finalBrandId);
        }
        attempts++;
    }, 500);

})();