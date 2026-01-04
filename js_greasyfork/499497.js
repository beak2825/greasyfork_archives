// ==UserScript==
// @name         Export Apple Purchase History
// @namespace    https://zhuzi.dev
// @version      v0.2
// @description  Export Purchase History from Apple to a csv file
// @author       Bambooom
// @homepageURL  https://zhuzi.dev
// @supportURL   https://zhuzi.dev
// @license      MIT
// @match        https://reportaproblem.apple.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499497/Export%20Apple%20Purchase%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/499497/Export%20Apple%20Purchase%20History.meta.js
// ==/UserScript==

(function () {
  ('use strict');

  let count = 0;
  let timer = setInterval(() => {
    if (document.querySelector('.purchase.loaded.collapsed') || count > 50) {
      clearInterval(timer);
      init()
    }
    count++
  }, 200);

  let count2 = 0; // no loading-indicator count
  function waitLoading() {
    setTimeout(() => {
      if (document.querySelector('.purchases > .loading-indicator')) {
        console.log('still need loading: ');
        waitLoading();
      } else {
        autoScroll();
      }
    }, 100);
  }

  function autoScroll() {
    window.scrollTo(0, document.body.scrollHeight);

    setTimeout(() => {
      if (document.querySelector('.purchases > .loading-indicator')) {
        count2 = 0;
        console.log('wait for loading');
        waitLoading();
      } else {
        count2++;

        if (count2 < 5) {
          console.log('going to scroll again');
          autoScroll();
        } else {
          alert('All history loaded.');
        }
      }
    }, 100);
  }

  function getRows() {
    const blocks = Array.from(
      document.querySelectorAll('.purchase.loaded.collapsed')
    );
    const rows = [];

    for (const block of blocks) {
      const date = block
        .querySelector('.purchase-header .invoice-date')
        .textContent.trim(); // '22 Jun 2024'
      const webOrderId = block
        .querySelector('.purchase-header .second-element')
        .textContent.trim(); // 'R24Q46T28S16ZB'
      // const price = block
      //   .querySelector('.purchase-header .third-element span span')
      //   .textContent.trim(); //  total: '¥0.00'

      const list = Array.from(
        block.querySelectorAll('.pli-list.applicable-items .pli')
      );
      list.forEach((li) => {
        const orderId = li.querySelector('label').attributes.for.value; // '76084983461860'
        const name = li
          .querySelector('.pli-data-fields .pli-title')
          .textContent.trim();
        const publisher = li.querySelector('.pli-publisher')
          ? li.querySelector('.pli-publisher').textContent.trim()
          : '';
        const priceText = li.querySelector('.pli-price').textContent.trim();
        const price = priceText === 'Free' ? '0' : priceText;
        const icon = li.querySelector('.pli-artwork img').src;
        rows.push({
          date,
          webOrderId,
          orderId,
          name,
          publisher,
          price,
          icon,
          price,
        });
      });
    }

    return rows;
  }

  function exportData() {
    const rows = getRows();
    JsonToCSV.exportToCSV(
      rows,
      [
        { title: 'Name', key: 'name' },
        { title: 'Date', key: 'date' },
        { title: 'Web Order Id', key: 'webOrderId' },
        { title: 'Order Id', key: 'orderId' },
        { title: 'Publisher', key: 'publisher' },
        { title: 'Price', key: 'price' },
        { title: 'Icon', key: 'icon' },
      ],
      'purchase-history-' +
        new Date().toISOString().split('T')[0].replaceAll('-', '')
    );
  }

  function init() {
    const div1 = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    btn1.textContent = 'Load all';
    btn2.textContent = 'Export to csv';
    btn1.classList.add('button', 'button-block', 'load-all-btn');
    btn2.classList.add('button', 'button-block', 'load-all-btn');
    btn2.style.marginLeft = '10px';
    div1.appendChild(btn1);
    div1.appendChild(btn2);
    document.querySelector('.search-bar').after(div1);
    const div2 = div1.cloneNode(true);
    document.querySelector('.purchases').after(div2);

    btn1.onclick = autoScroll;
    btn2.onclick = exportData;
  }

  // https://github.com/liqingzheng/export-to-CSV/blob/master/export-to-CSV/export-to-CSV.js
  var JsonToCSV = {
    /*
     * exportToCSV 导出CSV
     * @ param  {Array} data 导出数据 必填项
     * @ param  {Array} columns 导出表头 必填项
     * @ param  {String} fileName 导出文件名称
     */
    exportToCSV(data = [], columns = [], fileName = 'userExportToCSV') {
      if (!data.length && !columns.length) {
        console.error(
          '\u5bfc\u51fa\u6570\u636e\u548c\u8868\u5934\u4e0d\u4e3a\u7a7a'
        );
        return this;
      }
      const bw = this.browser();
      if (bw.ie < 9) return this;
      let CSV = '',
        arr = [],
        colKey,
        curvalue;
      columns.forEach(function (item) {
        arr.push(item.title || item.key);
      });
      CSV = CSV + arr.join(',') + '\r\n';
      data.forEach(function (item) {
        arr = [];
        curvalue = '';
        columns.forEach(function (col) {
          colKey = col.key;
          if (
            typeof item[colKey] == 'string' ||
            typeof item[colKey] === 'number'
          ) {
            curvalue =
              typeof col.formatter === 'function'
                ? col.formatter(item, col, colKey)
                : item[colKey];
            curvalue = typeof curvalue === 'function' ? '' : curvalue + '';
            curvalue = curvalue.replace(/\,/gi, '');
          }
          arr.push(curvalue);
        });
        CSV = CSV + arr.join(',') + '\r\n';
      });
      this.SaveAs(fileName, CSV);
    },
    SaveAs(fileName = '', csvData = '') {
      const bw = this.browser();
      if (!bw.edge || !bw.ie) {
        let alink = document.createElement('a');
        alink.id = 'linkDwnldLink';
        alink.href = this.getDownloadUrl(csvData);
        document.body.appendChild(alink);
        let linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
      } else if (bw.ie >= 10 || bw.edge == 'edge') {
        let _utf = '\uFEFF';
        let _csvData = new Blob([_utf + csvData], {
          type: 'text/csv',
        });
        navigator.msSaveBlob(_csvData, fileName);
      } else {
        let oWin = window.top.open('about:blank', '_blank');
        oWin.document.write('sep=,\r\n' + csvData);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
      }
    },
    getDownloadUrl(csvStr = '') {
      let _utf = '\uFEFF'; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
        let csvData = new Blob([_utf + csvStr], {
          type: 'text/csv',
        });
        return URL.createObjectURL(csvData);
      }
    },
    browser() {
      const Sys = {};
      const ua = navigator.userAgent.toLowerCase();
      let s;
      (s =
        ua.indexOf('edge') !== -1
          ? (Sys.edge = 'edge')
          : ua.match(/rv:([\d.]+)\) like gecko/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/msie ([\d.]+)/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/firefox\/([\d.]+)/))
        ? (Sys.firefox = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
        ? (Sys.chrome = s[1])
        : (s = ua.match(/opera.([\d.]+)/))
        ? (Sys.opera = s[1])
        : (s = ua.match(/version\/([\d.]+).*safari/))
        ? (Sys.safari = s[1])
        : 0;
      return Sys;
    },
  };
})();
