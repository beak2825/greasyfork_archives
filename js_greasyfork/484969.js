// ==UserScript==
// @name         CNKI Vocabulary Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically extract and download vocabulary lists from CNKI books in an Excel format.
// @author       eskimo220
// @match        https://gongjushu.cnki.net/rbook/bookdetail?bookid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484969/CNKI%20Vocabulary%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/484969/CNKI%20Vocabulary%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 显示加载指示器
  function showLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingIndicator';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.innerText = 'Loading...';
    document.body.appendChild(loadingIndicator);
  }

  // 隐藏加载指示器
  function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // 从URL中获取书籍ID
  function getBookIDFromURL() {
    const url = window.location.href;
    const match = url.match(/bookid=(R\d+)/);
    return match ? match[1] : null;
  }

  // 创建并下载Excel文件的函数
  function createAndDownloadXLSX(data, filename) {
    // 创建一个新的Excel工作簿
    var wb = XLSX.utils.book_new();
    // 创建一个Excel工作表，并将数据填充进去
    var ws = XLSX.utils.json_to_sheet(data);
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // 生成Excel文件（xlsx格式）
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    // 创建一个Blob对象，用于生成下载链接
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    // 创建一个临时的a标签，用于下载
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    // 清理工作
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // 将字符串转换为ArrayBuffer的辅助函数
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const MAX_RETRIES = 5;
  const RETRY_INTERVAL = 1000; // 重试间隔（毫秒）

  // 带重试的Fetch函数
  async function fetchWithRetry(url, params) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetchWithGM(url, params);
        return response; // 如果成功则返回响应
      } catch (error) {
        console.warn(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_INTERVAL); // 等待后重试
        } else {
          throw error; // 如果达到最大重试次数则重新抛出错误
        }
      }
    }
  }

  // 延迟函数
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 使用GM_xmlhttpRequest进行Fetch的函数
  function fetchWithGM(url, params) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url + '?' + new URLSearchParams(params).toString(),
        onload: function (response) {
          if (response.status === 200) {
            resolve(JSON.parse(response.responseText));
          } else {
            reject(new Error(`Error fetching data: ${response.status}`));
          }
        },
        onerror: function (error) {
          reject(new Error('Network error:', error));
        },
      });
    });
  }

  // 获取目录数据
  async function fetchCatalogData(code) {
    const baseUrl = `https://t.cnki.net/rbook-api/v1/book/${getBookIDFromURL()}/catalog`;
    let page = 1;
    const size = 500;
    let allData = [];

    while (true) {
      const params = { start: page, size: size, code: code };
      try {
        const data = await fetchWithRetry(baseUrl, params);
        const total = data.data.total;
        allData = allData.concat(data.data.data);

        if (allData.length >= total) {
          break;
        }

        page += size;
      } catch (error) {
        console.error(error.message);
        break;
      }
    }

    return allData;
  }

  // 示例用法
  async function fetchAllCatalogData() {
    try {
      showLoadingIndicator();

      const data = [];

      async function fetchRecursive(no) {
        const currentLevelData = await fetchCatalogData(no);
        for (const item of currentLevelData) {
          if (item.hasChild === 'N') {
            await fetchRecursive(item.no);
          } else {
            console.log(item.title);
            data.push({ Name: item.title });
          }
        }
      }

      await fetchRecursive(''); // 初始调用

      createAndDownloadXLSX(data, `${document.querySelector('.rightTop span').textContent}.xlsx`);
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    } finally {
      hideLoadingIndicator();
    }
  }

  // 在页面上添加按钮的函数
  function addButton() {
    var target = document.querySelector('.rightTop');
    if (target) {
      var button = document.createElement('button');
      button.textContent = '下载所有的词';
      button.addEventListener('click', () => {
        fetchAllCatalogData();
      });
      // 将按钮添加到页面上
      target.parentNode.insertBefore(button, target.nextSibling);
    }
  }

  // 循环检查页面上的特定元素，并在其出现时添加按钮
  (async function () {
    while (true) {
      if (document.querySelector('.rightTop')) {
        addButton();
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  })();
})();