// ==UserScript==
// @name         Amazon AdId and campaignid Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @description  Extract adId and ASIN from Amazon sponsored products and display them in a table at the top of the page
// @author       Xiafancat and Chatgpt
// @match        https://*.amazon.com/s*
// @match        https://*.amazon.co.uk/s*
// @match        https://*.amazon.de/s*
// @match        https://*.amazon.fr/s*
// @match        https://*.amazon.it/s*
// @match        https://*.amazon.es/s*
// @match        https://*.amazon.co.jp/s*
// @grant        GM_download
// @license      Zlib/Libpng License
// @downloadURL https://update.greasyfork.org/scripts/463815/Amazon%20AdId%20and%20campaignid%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/463815/Amazon%20AdId%20and%20campaignid%20Extractor.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建一个表格来存储 adId 和 ASIN
  const table = document.createElement('table');
  table.style.position = 'sticky';
  table.style.top = '0';
  table.style.background = '#fff';
  table.style.zIndex = '1000';
  table.border = '1';
  const tr = document.createElement('tr');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');

  th1.textContent = 'Title';
  th2.textContent = 'AdId';
  th3.textContent = 'ASIN';
  th4.textContent = 'CampaignId';
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  table.appendChild(tr);

  // 添加下载按钮
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download as CSV';
  downloadBtn.style.position = 'sticky';
  downloadBtn.style.top = '0';
  downloadBtn.style.marginLeft = '10px';
  downloadBtn.style.zIndex = '1000';
  downloadBtn.addEventListener('click', function() {
    downloadTableAsCSV(table, 'Amazon_AdId_Extractor');
  });

  // 下载表格为CSV文件的函数
  function downloadTableAsCSV(table, filename) {
    let csvContent = '';
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      cols.forEach((col, index) => {
        let cellText = col.textContent;
        if (cellText.includes('"')) {
          cellText = cellText.replace(/"/g, '""');
        }
        if (cellText.includes(',') || cellText.includes('"')) {
          cellText = '"' + cellText + '"';
        }
        csvContent += cellText;
        if (index < cols.length - 1) {
          csvContent += ',';
        }
      });
      csvContent += '\r\n';
    });

    const csvBlob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
    const csvURL = URL.createObjectURL(csvBlob);

    GM_download({
      url: csvURL,
      name: filename + '.csv',
      onload: function() {
        URL.revokeObjectURL(csvURL);
      }
    });
  }

  // 获取所有 sponsored product 的父元素
  const sponsoredProducts = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');

  // 遍历每个 sponsored product，并添加 adId 和 ASIN
 sponsoredProducts.forEach((product, index) => {
  console.log('Processing product #' + (index + 1));

  const adAsinParent = product.querySelector('.a-popover-preload .a-declarative');
  if (adAsinParent && adAsinParent.dataset && adAsinParent.dataset.sSafeAjaxModalTrigger) {
    const data = adAsinParent.dataset.sSafeAjaxModalTrigger;
    console.log('data:', data);

    try {
      const jsonData = JSON.parse(data);
      if (jsonData && jsonData.ajaxUrl) {
        const decodedData = decodeURIComponent(jsonData.ajaxUrl);
        const dataJsonString = decodedData.match(/{.+}/);
        if (dataJsonString) {
          try {
            const dataJsonObject = JSON.parse(dataJsonString[0]);

            if (dataJsonObject && dataJsonObject.adCreativeMetaData && dataJsonObject.adCreativeMetaData.adCreativeDetails && dataJsonObject.adCreativeMetaData.adCreativeDetails.length > 0) {
              const adId = dataJsonObject.adCreativeMetaData.adCreativeDetails[0].adId;
              const asin = dataJsonObject.adCreativeMetaData.adCreativeDetails[0].asin;
              const campaignId = dataJsonObject.adCreativeMetaData.adCreativeDetails[0].campaignId;


              const titleElement = product.querySelector(`h2 > a[href*="${asin}"]`);
              if (titleElement) {
                const title = titleElement.textContent.trim();
                console.log('title:', title);

                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                td1.textContent = title;
                td2.textContent = adId;
                td3.textContent = asin;
                td4.textContent = campaignId;

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                table.appendChild(tr);
              } else {
                console.log('Title element not found');
              }
            } else {
              console.log('AdId or ASIN not found in jsonData.ajaxUrl');
            }
          } catch (error) {
            console.log('Error parsing JSON:', error);
          }
        } else {
          console.log('jsonData is not defined or jsonData.ajaxUrl is not found');
        }
      }
    } catch (error) {
      console.log('Error parsing JSON:', error);
    }
  } else {
    console.log('AdAsinParent not found');
  }
});




  // 插入表格和下载按钮到页面中
  const sgColInner = document.querySelector('.sg-col-inner .s-main-slot');
  if (sgColInner) {
    sgColInner.insertBefore(table, sgColInner.firstChild);
    sgColInner.insertBefore(downloadBtn, table.nextSibling);
  }
})();

