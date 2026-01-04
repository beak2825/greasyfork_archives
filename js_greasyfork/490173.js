// ==UserScript==
// @name         Download_tm_Page_Data as CSV
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download page data as CSV file with additional details and proper encoding
// @author       ethan
// @match        https://seller.kuajingmaihuo.com/main/sale-manage/main
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/490173/Download_tm_Page_Data%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/490173/Download_tm_Page_Data%20as%20CSV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '下载CSV';
        downloadBtn.style = 'margin-left: 10px;';

        const observer = new MutationObserver((mutations, obs) => {
            const targetBtn = document.evaluate("//button[@data-tracking-id='fPSpCC7DpL4qyT6I']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (targetBtn) {
                targetBtn.parentNode.insertBefore(downloadBtn, targetBtn.nextSibling);
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        downloadBtn.addEventListener('click', function() {
            let allData = [['店铺名称', '日期', 'SKU属性', 'SKU货号', '申报价格', 'SKC', '评分数量', '评分值'].join(',')]; // CSV header
            let lastValidSKC = '';
            let lastValidRatingCount = '';
            let lastValidRatingValue = '';


            const shopNameXPathResult = document.evaluate("//div[contains(@style,'weight')]//span[contains(@class,'elli_outerWrapper')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const shopName = shopNameXPathResult.singleNodeValue ? shopNameXPathResult.singleNodeValue.textContent.trim() : '';
            const currentDate = new Date().toISOString().split('T')[0];

            // Function to change the number of items per page to 40
            function setItemsPerPage() {
                const itemsPerPageDropdown = document.evaluate("//ul[@data-testid='beast-core-pagination']//input[@data-testid='beast-core-select-htmlInput']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (itemsPerPageDropdown) {
                    itemsPerPageDropdown.click(); // Open the dropdown
                    // Select the option for 40 items per page. This part might need to be adjusted based on how the dropdown options are structured.
                    const optionFor40 = document.evaluate("//span[contains(text(), '40')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (optionFor40) {
                        optionFor40.click();
                    }
                }
            }

            function fetchDataFromPage() {
                // Use XPath to select all rows on the page
                const rowsXPathResult =document.evaluate("//tr[@data-testid='beast-core-table-body-tr']", document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                let row = rowsXPathResult.iterateNext();
                while (row) {
                    // Check if the SKC field exists in the current row
                    const SKCNode = document.evaluate(".//p[contains(text(),'SKC：')]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    let SKC, ratingCount, ratingValue;

                    if (SKCNode) {
                        // Normal logic to fetch SKC and ratings
                        SKC = SKCNode.textContent.replace('SKC：', '').trim();
                        const rateInfo = document.evaluate(".//div[contains(@class,'spu-rate_item')]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ? document.evaluate(".//div[contains(@class,'spu-rate_item')]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim() : '';
                        [ratingCount, ratingValue] = parseRatingInfo(rateInfo);

                        // Update last valid values
                        lastValidSKC = SKC;
                        lastValidRatingCount = ratingCount;
                        lastValidRatingValue = ratingValue;
                    } else {
                        // Use last valid values if SKC does not exist
                        SKC = lastValidSKC;
                        ratingCount = lastValidRatingCount;
                        ratingValue = lastValidRatingValue;
                    }

                    // Fetch additional fields only if the row is not to be skipped
                    let skuAttribute, skuNumber, declaredPriceCNY;

                    const skuAttributeNode = document.evaluate(".//td[@class='TB_td_5-109-0 TB_cellTextAlignLeft_5-109-0 TB_cellVerticalAlignMiddle_5-109-0 TB_leftSticky_5-109-0' and not(@rowspan)]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (skuAttributeNode && skuAttributeNode.textContent.trim() !== "合计") {
                        skuAttribute = skuAttributeNode.textContent.trim();

                        // Fetch SKU货号 and 申报价格 normally
                        const skuNumberNode = document.evaluate(".//td[@class='TB_td_5-109-0 TB_cellTextAlignLeft_5-109-0 TB_cellVerticalAlignMiddle_5-109-0' and not(@rowspan)][1]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        skuNumber = skuNumberNode ? skuNumberNode.textContent.trim() : '';

                        const declaredPriceCNYNode = document.evaluate(".//td[@class='TB_td_5-109-0 TB_cellTextAlignRight_5-109-0 TB_cellVerticalAlignMiddle_5-109-0 TB_leftSticky_5-109-0 TB_leftStickyLast_5-109-0' and not(@rowspan)]", row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        declaredPriceCNY = declaredPriceCNYNode ? declaredPriceCNYNode.textContent.trim() : '';

                        // Add row to CSV
                        allData.push([`"${shopName}"`, `"${currentDate}"`, `"${skuAttribute}"`, `"${skuNumber}"`, `"${declaredPriceCNY}"`, `"${SKC}"`, `"${ratingCount}"`, `"${ratingValue}"`].join(','));
                    }

                    row = rowsXPathResult.iterateNext();
                }
                const nextPageBtnXPathResult = document.evaluate("//li[@data-testid='beast-core-pagination-next' and not(contains(@class, 'disabled'))]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const nextPageBtn = nextPageBtnXPathResult.singleNodeValue;
                if (nextPageBtn) {
                    nextPageBtn.click();
                    //alert('点击')
                    setTimeout(fetchDataFromPage, 3000); // Wait for the next page to load
                } else {
                    downloadData(); // No more pages, download data
                }
            }

            function parseRatingInfo(rateInfo) {
                if (rateInfo === "暂无评分") {
                    return ['', '']; // Return empty strings if no rating
                } else {
                    const parts = rateInfo.split('评论数:');
                    const ratingValue = parts[0].trim();
                    const ratingCount = parts[1].trim();
                    return [ratingCount, ratingValue];
                }
            }

            function downloadData() {
                // Prepare the CSV content with a UTF-8 Byte Order Mark (BOM) for Excel compatibility
                const csvContent = '\uFEFF' + allData.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);

                // Use the shop name and the current date-time for the file name
                const currentTime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
                const fileName = `${shopName.replace(/[\s/]/g, '_')}_${currentDate}-${currentTime}.csv`;

                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setItemsPerPage();
            setTimeout(fetchDataFromPage, 3000);
        });
    });
})();
