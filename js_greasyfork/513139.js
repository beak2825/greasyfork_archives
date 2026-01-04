// ==UserScript==
// @name         爬蓝湖原型目录结构
// @namespace    https://ihopefulchina.github.io/
// @version      1.0.5
// @description  爬蓝湖原型目录结构，导出Excel文件，适用于飞书等开发项目在线文档
// @author       huangpengfei
// @match        https://lanhuapp.com/web/*
// @icon         https://lhcdn.lanhuapp.com/web/static/favicon.ico
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513139/%E7%88%AC%E8%93%9D%E6%B9%96%E5%8E%9F%E5%9E%8B%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/513139/%E7%88%AC%E8%93%9D%E6%B9%96%E5%8E%9F%E5%9E%8B%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.meta.js
// ==/UserScript==

function run() {
  'use strict';

 // 将 Base64 数据解析为工作簿对象
 function base64ToWorkbook(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
  }
  return XLSX.read(bytes, { type: 'array' });
}

// 从工作簿提取 CSV 数据
function workbookToCSV(workbook) {
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_csv(worksheet);
}

// 触发下载 CSV 文件
function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  // 非ie浏览器下执行
  const tableToNotIE = (function () {
    // 编码要用utf-8不然默认gbk会出现中文乱码
    const uri = 'data:application/vnd.ms-excel;base64,',
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

    const base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    };

    const format = (s, c) => {
      return s.replace(/{(\w+)}/g, (m, p) => {
        return c[p];
      });
    };


    return (table, name) => {
      const ctx = {
        worksheet: name,
        table
      };

      const excelBase64 = uri + base64(format(template, ctx))

      const workbook = base64ToWorkbook(excelBase64.split(',')[1]);


      const csvContent = workbookToCSV(workbook);

      downloadCSV(csvContent, name);
    };
  })();


  // 导出函数
  const table2excel = (column, data, excelName) => {

    let thead = column.reduce((result, item) => result += `<th>${item.title}</th>`, '');

    thead = `<thead><tr>${thead}</tr></thead>`;

    let tbody = data.reduce((result, row) => {
      for (let rIdx = 0; rIdx < columnOptions.length; rIdx++) {
        const temp = column.reduce((tds, _, colIndex) => {
          if (colIndex === 0) {
            tds += `<td style="text-align: left">${row.name}</td>`;
          } else if (colIndex === 2) {
            tds += `<td>${row.parents[0]}</td>`
          } else if (colIndex === 1) {
            tds += `<td>${columnOptions[rIdx]}</td>`
          }
          return tds;
        }, '');

        result += `<tr>${temp}</tr>`;
      }

      return result;
    }, '');

    tbody = `<tbody>${tbody}</tbody>`;

    const table = thead + tbody;

    // 导出表格
    tableToNotIE(table, excelName);


    function getImageHtml(val, options) {
      options = Object.assign({ width: 40, height: 60 }, options);
      return `<td style="width: ${options.width * 2.5}px; height: ${options.height *
        2.5}px; text-align: left; vertical-align: middle"><img src="${val}" width=${options.width} height=${options.height}></td>`;
    }
  };

  /**
   * 获取DOM树结构列表
   * @param {HTMLElement} dom - 作为起点的DOM元素
   * @param {number} parents - 当前深度，默认为0，表示起点为树的根节点
   * @returns {Array} 返回一个对象列表，每个对象代表一个DOM节点，包含名称和其子节点列表
   */
  function getDomTreeList(dom, parents = []) {
    const treeList = [];
    const list = dom.querySelectorAll('.deepD-' + parents.length);

    if (list) {
      list.forEach(value => {
        const name = value.querySelector('.tree-name').innerText;
        if (ignoreNameReg.test(name)) {
          return
        }
        treeList.push({
          name,
          parents,
          children: getDomTreeList(value, [...parents, name])
        });
      });
    }
    return treeList;
  }

  function validateTree(tree) {
    if (!Array.isArray(tree)) {
      throw new Error('输入必须是一个数组');
    }
    tree.forEach(node => {
      if (typeof node !== 'object' || node === null || !('name' in node)) {
        throw new Error('树节点必须是包含 name 属性的对象');
      }
    });
  }


  function treeToList(tree, deep = 0) {
    validateTree(tree);

    let list = [];

    tree.forEach((value, index) => {
      const isLast = index === tree.length - 1;
      const prefix = isLast ? '┕ ' : '┝ ';
      const nodeName = `${new Array(deep).join('｜')}${prefix}${value.name}`;

      list.push({
        name: deep === 0 ? value.name : nodeName,
        parents: value.parents
      });

      if (value.children) {
        // 使用push结合扩展运算符来代替concat
        list.push(...treeToList(value.children, deep + 1));
      }
    });

    return list;
  }


  // 表格列
  const column = [
    { title: '任务名称', key: 'name', },
    { title: '任务类型', key: 'types', },
    { title: '所属模块', key: 'model', },
    { title: '开发人员', key: 'developer' },
    { title: '进展', key: 'progress' },
    { title: '开始日期', key: 'beginDate' },
    { title: '结束时间', key: 'endDate' },
    { title: '是否延期', key: 'delay' },
    { title: '实际完成日期', key: 'actualDate' },
    { title: '完成情况', key: 'completion' },
    { title: '备注', key: 'note' },
  ];

  const ignoreNameReg = /废弃/ // 忽略的key值
  const columnOptions = ['接口开发', '页面开发', '接口联调'] // 任务类型名称


  const domTree = getDomTreeList(window.document)


  const list = treeToList(domTree).filter(item => !!item.parents.length)

  // 获取 <title> 标签内容
  const title = document.title;

  // 去除包含“蓝湖”的部分
  const cleanedTitle = title.replace(/-蓝湖/g, '');

  table2excel(column, list, `${cleanedTitle}-原型目录导出${getCurrentTimeString()}.csv`);
};



function getCurrentTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 创建按钮元素
const button = document.createElement('button');
button.id = 'dragButton';
button.textContent = '导出原型目录csv';
document.body.appendChild(button);

// 按钮样式
const style = document.createElement('style');
style.textContent = `
      #dragButton {
        position: absolute;
        top: 90px;
        right: 30px;
        padding: 10px 0;
        width: 150px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: grab;
        z-index: 10000;
      }
      #dragButton:active {
        cursor: grabbing;
      }
    `;
document.head.appendChild(style);

// 从 localStorage 读取按钮位置
const savedPosition = JSON.parse(localStorage.getItem('buttonPosition'));
if (savedPosition) {
  button.style.top = savedPosition.top + 'px';
  button.style.left = savedPosition.left + 'px';
}

let offsetX = 0, offsetY = 0, isDragging = false;
let startX = 0, startY = 0; // 记录初始点击位置

// 按下按钮时，记录鼠标的初始位置
button.addEventListener('mousedown', (e) => {
  isDragging = false; // 先假设不是拖动
  startX = e.clientX;
  startY = e.clientY;
  offsetX = e.clientX - button.offsetLeft;
  offsetY = e.clientY - button.offsetTop;
  button.style.cursor = 'grabbing';

  // 监听鼠标移动，判断是否开始拖动
  const onMouseMove = (moveEvent) => {
    const moveX = moveEvent.clientX;
    const moveY = moveEvent.clientY;

    // 如果鼠标移动距离超过一定阈值，则认为是拖动
    if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
      isDragging = true;
      const x = moveX - offsetX;
      const y = moveY - offsetY;
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    }
  };

  // 鼠标松开时，停止拖动并保存位置
  const onMouseUp = () => {
    if (isDragging) {
      const position = {
        top: button.offsetTop,
        left: button.offsetLeft
      };
      localStorage.setItem('buttonPosition', JSON.stringify(position));
    }

    // 移除事件监听器
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    button.style.cursor = 'grab';
  };

  // 添加事件监听器
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// 单击按钮的事件
button.addEventListener('click', () => {
  if (!isDragging) {
    if (confirm('是否需要导出原型目录结构？请确保选择产品原型一栏， 否则会导出空数据')) {
      // 处理点击事件
      run();
    }

  }
});
// 将按钮添加到页面
document.body.appendChild(button);


window.addEventListener('unload', () => {
  localStorage.removeItem('buttonPosition');
});
