// ==UserScript==
// @name         体彩大乐透历史开奖信息下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  爬取体彩大乐透历史开奖信息并导出Excel
// @author       白虎万岁
// @match        https://www.lottery.gov.cn/kj/kjlb.html?dlt
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.lottery.gov.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/523605/%E4%BD%93%E5%BD%A9%E5%A4%A7%E4%B9%90%E9%80%8F%E5%8E%86%E5%8F%B2%E5%BC%80%E5%A5%96%E4%BF%A1%E6%81%AF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523605/%E4%BD%93%E5%BD%A9%E5%A4%A7%E4%B9%90%E9%80%8F%E5%8E%86%E5%8F%B2%E5%BC%80%E5%A5%96%E4%BF%A1%E6%81%AF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
        .lottery-btn {
            position: fixed;
            right: 160px;
            top: 290px;
            width: 40px;
            height: 32px;
            background: linear-gradient(145deg, #e74c3c, #c0392b);
            border-radius: 4px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            font-family: "Microsoft YaHei", sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .lottery-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .date-picker {
            position: fixed;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            display: none;
            z-index: 9999;
            font-family: "Microsoft YaHei", sans-serif;
        }
        .date-picker .title {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        .date-picker input {
            margin: 5px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: calc(100% - 26px);
            font-size: 14px;
        }
        .date-picker input:focus {
            border-color: #3498db;
            outline: none;
        }
        .date-picker button {
            margin: 5px;
            padding: 8px 15px;
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: calc(100% - 10px);
            font-size: 14px;
            transition: all 0.3s;
        }
        .date-picker button:hover {
            background: linear-gradient(145deg, #2980b9, #2471a3);
            transform: translateY(-1px);
        }
        .status-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 4px;
            display: none;
            z-index: 10000;
            font-family: "Microsoft YaHei", sans-serif;
        }
    `);

  // 创建DOM元素
  function createElements () {
    // 创建按钮
    const btn = document.createElement('div');
    btn.className = 'lottery-btn';
    btn.innerHTML = '奖';
    document.body.appendChild(btn);

    // 创建日期选择器
    const datePicker = document.createElement('div');
    datePicker.className = 'date-picker';
    datePicker.innerHTML = `
            <div class="title">选择日期范围</div>
            <input type="date" id="startDate" placeholder="开始日期">
            <input type="date" id="endDate" placeholder="结束日期">
            <button id="fetchBtn">获取数据</button>
            <button id="fetch30Btn">获取近30期</button>
        `;
    document.body.appendChild(datePicker);

    // 创建状态消息
    const statusMsg = document.createElement('div');
    statusMsg.className = 'status-message';
    document.body.appendChild(statusMsg);

    return { btn, datePicker, statusMsg };
  }

  // 显示状态消息
  function showStatus (message, duration = 3000) {
    const statusMsg = document.querySelector('.status-message');
    statusMsg.textContent = message;
    statusMsg.style.display = 'block';
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, duration);
  }

  // 数据处理函数
  async function fetchLotteryData (startDate, endDate) {
    try {
      showStatus('正在获取数据...');

      // 获取表格数据
      const table = document.querySelector('.result_table');
      if (!table) {
        throw new Error('未找到数据表格');
      }

      const rows = Array.from(table.querySelectorAll('tr')).slice(1); // 跳过表头
      const data = [];
      let count = 0;

      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          const rowDate = cells[1].textContent.trim();

          // 日期筛选
          if ((!startDate || !endDate || (rowDate >= startDate && rowDate <= endDate)) && count < 30) {
            // 获取开奖号码
            const frontNumbers = Array.from(cells[2].querySelectorAll('.blue_ball')).map(num => num.textContent.trim());
            const backNumbers = Array.from(cells[2].querySelectorAll('.red_ball')).map(num => num.textContent.trim());

            data.push({
              '期号': cells[0].textContent.trim(),
              '开奖日期': rowDate,
              '前区号码': frontNumbers.join(' '),
              '后区号码': backNumbers.join(' '),
              '一等奖基本注数': cells[3].textContent.trim() || '0',
              '一等奖基本奖金(元)': cells[4].textContent.trim() || '0',
              '一等奖追加注数': cells[5].textContent.trim() || '0',
              '一等奖追加奖金(元)': cells[6].textContent.trim() || '0',
              '二等奖基本注数': cells[7].textContent.trim() || '0',
              '二等奖基本奖金(元)': cells[8].textContent.trim() || '0',
              '二等奖追加注数': cells[9].textContent.trim() || '0',
              '二等奖追加奖金(元)': cells[10].textContent.trim() || '0',
              '销售额(元)': cells[11].textContent.trim() || '0',
              '奖池奖金(元)': cells[12].textContent.trim() || '0'
            });
            count++;
          }
        }
      }

      if (data.length === 0) {
        showStatus('未找到符合条件的数据');
        return;
      }

      showStatus('正在生成Excel文件...');

      // 导出Excel
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "大乐透开奖数据");

      // 设置列宽
      const colWidths = [10, 12, 15, 15, 12, 15, 12, 15, 12, 15, 12, 15, 15, 15];
      ws['!cols'] = colWidths.map(w => ({ wch: w }));

      // 下载文件
      const fileName = `大乐透开奖数据_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      showStatus('数据导出成功！');

    } catch (error) {
      console.error('获取数据失败:', error);
      showStatus('获取数据失败: ' + error.message);
    }
  }

  // 添加等待表格加载的函数
  function waitForTable () {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        const table = document.querySelector('.result_table');
        if (table) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('加载超时，未找到数据表格'));
        }
        attempts++;
      }, 500);
    });
  }

  // 初始化函数
  function init () {
    const { btn, datePicker } = createElements();

    // 事件监听
    btn.addEventListener('click', () => {
      datePicker.style.display = datePicker.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('fetchBtn').addEventListener('click', async () => {
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      if (!startDate || !endDate) {
        showStatus('请选择开始和结束日期');
        return;
      }

      if (startDate > endDate) {
        showStatus('开始日期不能大于结束日期');
        return;
      }

      try {
        await waitForTable();
        await fetchLotteryData(startDate, endDate);
        datePicker.style.display = 'none';
      } catch (error) {
        showStatus(error.message);
      }
    });

    document.getElementById('fetch30Btn').addEventListener('click', async () => {
      try {
        await waitForTable();
        await fetchLotteryData();
        datePicker.style.display = 'none';
      } catch (error) {
        showStatus(error.message);
      }
    });

    // 点击其他区域关闭日期选择器
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !datePicker.contains(e.target)) {
        datePicker.style.display = 'none';
      }
    });
  }

  // 启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 