// ==UserScript==
// @name         小红书广告数据查询与展示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在当前页面插入悬浮元素，点击展开窗口并发送请求，将结果展示在表格中并提供Excel下载按钮
// @author       You
// @match        https://ad.xiaohongshu.com/aurora*
// @grant        GM_xmlhttpRequest
// @connect      ad.xiaohongshu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526290/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B9%BF%E5%91%8A%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2%E4%B8%8E%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/526290/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B9%BF%E5%91%8A%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2%E4%B8%8E%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
   
    // 存储请求返回的数据
    let responseData = [];
   
    // 创建隐藏的小球元素
    const ball = document.createElement('div');
    ball.style.position = 'fixed';
    ball.style.right = '10px';
    ball.style.bottom = '10px';
    ball.style.width = '60px';
    ball.style.height = '60px';
    ball.style.backgroundColor = '#0066CC';
    ball.style.borderRadius = '50%';
    ball.style.cursor = 'pointer';
    ball.style.display = 'none';
    ball.style.color = 'white';
    ball.style.display = 'flex';
    ball.style.alignItems = 'center';
    ball.style.justifyContent = 'center';
    ball.style.fontSize = '12px';
    ball.textContent = '检查链接';
    ball.style.zIndex = '9999'; // 添加z-index 在图层最顶
    document.body.appendChild(ball);
   
    // 创建悬浮窗口元素
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.right = '20px';
    floatingWindow.style.top = '20px';
    floatingWindow.style.width = '50vw';
    floatingWindow.style.height = '80vh';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.border = '1px solid #0066CC';
    floatingWindow.style.borderRadius = '8px';
    floatingWindow.style.display = 'none';
    floatingWindow.style.padding = '20px';
    floatingWindow.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.zIndex = '9999'; // 添加z-index 在图层最顶
    document.body.appendChild(floatingWindow);
   
    // 创建关闭按钮
    const closeButton = document.createElement('div');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '10px';
    closeButton.style.top = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.innerHTML = '×';
    closeButton.style.color = '#0066CC';
    floatingWindow.appendChild(closeButton);
   
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginBottom = '20px';
    floatingWindow.appendChild(buttonContainer);
   
    // 创建检查按钮
    const checkButton = document.createElement('button');
    checkButton.textContent = '检查';
    checkButton.style.marginRight = '10px';
    checkButton.style.padding = '8px 16px';
    checkButton.style.backgroundColor = '#0066CC';
    checkButton.style.color = 'white';
    checkButton.style.border = 'none';
    checkButton.style.borderRadius = '4px';
    checkButton.style.cursor = 'pointer';
    buttonContainer.appendChild(checkButton);
   
    // 创建下载按钮
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '下载Excel';
    downloadButton.style.padding = '8px 16px';
    downloadButton.style.backgroundColor = '#0066CC';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    buttonContainer.appendChild(downloadButton);
   
    // 创建链接统计文本容器
    const linkStatsContainer = document.createElement('div');
    linkStatsContainer.style.marginBottom = '20px';
    linkStatsContainer.style.fontSize = '14px';
    linkStatsContainer.style.color = '#333333';
    floatingWindow.appendChild(linkStatsContainer);
   
    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.style.height = 'calc(100% - 100px)';
    tableContainer.style.overflowY = 'auto';
    tableContainer.style.overflowX = 'auto';
    floatingWindow.appendChild(tableContainer);
   
    // 显示小球
    ball.style.display = 'flex';
   
    // 点击小球展开悬浮窗口
    ball.addEventListener('click', function() {
      floatingWindow.style.display = 'block';
      ball.style.display = 'none';
    });
   
    // 点击关闭按钮
    closeButton.addEventListener('click', function() {
      floatingWindow.style.display = 'none';
      ball.style.display = 'flex';
      tableContainer.innerHTML = '';
      linkStatsContainer.innerHTML = '';
      responseData = []; // 清空存储的数据
    });
   
    // 点击检查按钮发送请求
    checkButton.addEventListener('click', sendRequest);
   
    // 点击下载按钮
    downloadButton.addEventListener('click', function() {
      if (responseData.length > 0) {
        downloadExcel(responseData);
      } else {
        alert('没有可下载的数据！');
      }
    });
   
    // 发送请求
    function sendRequest() {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://ad.xiaohongshu.com/api/leona/rtb/creativity/list',
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-b3-traceid": "a85f1937517fade3"
        },
        data: JSON.stringify({
          "startTime": new Date().toISOString().split('T')[0],
          "endTime": new Date().toISOString().split('T')[0],
          "pageNum": 1,
          "pageSize": 200
        }),
        onload: function(response) {
          try {
            const data = JSON.parse(response.responseText);
            const list = data.data.list;
   
            // 保存响应数据
            responseData = list;
   
            // 统计链接重复次数
            const clickUrlCounts = {};
            const expoUrlCounts = {};
   
            list.forEach(item => {
              if(item.clickUrls && item.clickUrls[0]) {
                const clickUrl = extractUrlParam(item.clickUrls[0]);
                clickUrlCounts[clickUrl] = (clickUrlCounts[clickUrl] || 0) + 1;
              }
              if(item.expoUrls && item.expoUrls[0]) {
                const expoUrl = extractUrlParam(item.expoUrls[0]);
                expoUrlCounts[expoUrl] = (expoUrlCounts[expoUrl] || 0) + 1;
              }
            });
   
            // 显示链接统计信息
            linkStatsContainer.innerHTML = '';
            Object.entries(clickUrlCounts).forEach(([url, count]) => {
              if(url) {
                const div = document.createElement('div');
                div.style.marginBottom = '5px';
                div.textContent = `点击链接：${url} 有${count}条`;
                linkStatsContainer.appendChild(div);
              }
            });
   
            Object.entries(expoUrlCounts).forEach(([url, count]) => {
              if(url) {
                const div = document.createElement('div');
                div.style.marginBottom = '5px';
                div.textContent = `曝光链接：${url} 有${count}条`;
                linkStatsContainer.appendChild(div);
              }
            });
   
            createTable(list);
          } catch (error) {
            console.error('解析响应数据时出错:', error);
          }
        },
        onerror: function(error) {
          console.error('请求出错:', error);
        }
      });
    }
   
    // 提取URL参数
    function extractUrlParam(url) {
      const match = url.match(/https:\/\/magellan.alimama.com\/(.*?)&/);
      return match ? match[1] : '';
    }
   
    // 创建表格
    function createTable(data) {
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.backgroundColor = 'white';
   
      // 创建表头
      const thead = document.createElement('thead');
      thead.style.backgroundColor = '#0066CC';
      const headerRow = document.createElement('tr');
      const headers = ['创建时间', '创意名', '创意ID', '点击链接', '曝光链接'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.style.border = '1px solid #0066CC';
        th.style.padding = '12px';
        th.style.color = 'white';
        th.style.fontWeight = 'bold';
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
   
      // 创建表体
      const tbody = document.createElement('tbody');
      data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#F5F8FA' : 'white';
   
        const createTime = item.creativityCreateTime;
        const creativityName = item.creativityName;
        const creativityId = item.creativityId;
        const clickUrl = item.clickUrls ? JSON.stringify(item.clickUrls.map(extractUrlParam)).replace(/,/g, '\n') : '';
        const expoUrl = item.expoUrls ? JSON.stringify(item.expoUrls.map(extractUrlParam)).replace(/,/g, '\n') : '';
   
        const values = [createTime, creativityName, creativityId, clickUrl, expoUrl];
        values.forEach(value => {
          const td = document.createElement('td');
          td.style.border = '1px solid #E5E5E5';
          td.style.padding = '12px';
          td.style.color = '#333333';
          td.textContent = value;
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
   
      // 清空表格容器并插入新表格
      tableContainer.innerHTML = '';
      tableContainer.appendChild(table);
    }
   
    // 下载Excel
    function downloadExcel(data) {
      // 添加BOM头,解决中文乱码问题
      const BOM = '\uFEFF';
      const headers = ['创建时间', '创意名', '创意ID', '点击链接', '曝光链接'];
      const csvContent = [headers.join(',')];
   
      data.forEach(item => {
        const createTime = item.creativityCreateTime || '';
        const creativityName = item.creativityName || '';
        const creativityId = item.creativityId || '';
        const clickUrl = item.clickUrls && item.clickUrls[0] ? JSON.stringify(item.clickUrls.map(extractUrlParam)).replace(/,/g, '\n') : '';
        const expoUrl = item.expoUrls && item.expoUrls[0] ? JSON.stringify(item.expoUrls.map(extractUrlParam)).replace(/,/g, '\n') : '';
   
        // 处理CSV中的特殊字符
        const escapeCsvValue = (value) => {
          if (typeof value !== 'string') return value;
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        };
   
        const values = [createTime, creativityName, creativityId, clickUrl, expoUrl]
          .map(escapeCsvValue);
        csvContent.push(values.join(','));
      });
   
      const csv = BOM + csvContent.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-');
   
      link.setAttribute('href', url);
      link.setAttribute('download', `data_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  })();