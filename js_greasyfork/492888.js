// ==UserScript==
// @name         24.4.17旺销王订单统计&导出
// @version      1.2
// @description  统计旺销王订单，自定义属性导出
// @author       menkeng
// @match        https://www.wxwerp.com/erp/order/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jsonpath@1.1.1/jsonpath.min.js
// @namespace    https://greasyfork.org/users/935835
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @downloadURL https://update.greasyfork.org/scripts/492888/24417%E6%97%BA%E9%94%80%E7%8E%8B%E8%AE%A2%E5%8D%95%E7%BB%9F%E8%AE%A1%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/492888/24417%E6%97%BA%E9%94%80%E7%8E%8B%E8%AE%A2%E5%8D%95%E7%BB%9F%E8%AE%A1%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==


var counts = {};
var pagesize = 500

var button_box = createButtonBox(0, 514)
createButton("获取", processPages, button_box)
setInterval(update, 10000);
skuid_list = [];
skucode_list = [];

async function processPages() {
  var maxsize = document.querySelector("div.bottom_container_p.noscroll > div > div.right > dl.pageview > dd:nth-child(2) > a").textContent;
  maxsize = RegExp(/\d+/).exec(maxsize)[0];
  var maxpage = Math.ceil(maxsize / pagesize);
  // maxpage = 1
  var pages = Array.from({ length: maxpage }, (_, i) => i + 1);

  try {
    await batchProcess(pages, 1, fetchDataAndProcess, 1000);
    localStorage.setItem('skuCounts', JSON.stringify(counts));
    setTimeout(() => {
      document.querySelector('.js_fixed-button').textContent = '获取完成';
      exportCSV();
    }, 3000);

  } catch (error) {
    document.querySelector('.js_fixed-button').textContent = '获取失败';
    console.error('Batch processing failed:', error);
  }
}

async function batchProcess(array, batchSize, processFunc, delay) {
  var progressTextElement = document.querySelector('.js_fixed-button');
  var updateProgressText = (progress) => {
    if (progressTextElement) {
      progressTextElement.textContent = `进度: ${progress.toFixed(2)}%`;
    }
  };
  var batchPromises = [];
  for (let i = 0; i < array.length; i += batchSize) {
    var batch = array.slice(i, i + batchSize)
    batchPromises.push(
      Promise.all(batch.map(item => processFunc(item)))
    )
    var progress = ((i + batchSize) / array.length) * 100
    updateProgressText(progress)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  if (array.length % batchSize !== 0) {
    var lastBatch = array.slice(array.length - (array.length % batchSize));
    batchPromises.push(
      Promise.all(lastBatch.map(item => processFunc(item)))
    );
    updateProgressText(100);
  }
  return batchPromises.reduce(async (acc, batchPromise) => {
    await acc;
    return batchPromise;
  }, Promise.resolve());
}

async function fetchDataAndProcess(page) {
  try {
    var response = await fetch(`https://www.wxwerp.com/erp/Order/panel/OrderListPanel.aspx`, {
      headers: {
        "accept": "text/plain, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      body: "otherstatus=all_order&include_ids=&isfuzzy=false&module=1&page=" + page + "&sort_direct=down&type=trad&pagesize=" + pagesize + "&frompanel=true",
      method: "POST",
      mode: "cors",
      credentials: "include"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const jsonScript1 = doc.querySelector('script.json')
    const jsonScript2 = doc.querySelector('script.json_matched_product')
    if (jsonScript1) {
      const jsonData = JSON.parse(jsonScript1.innerText)
      const jsonRemark = JSON.parse(jsonScript2.innerText)
      findSkuCodes(jsonData)
      exportOrders(jsonData, jsonRemark)

    } else {
      console.log("JSON data not found in the HTML")
    }
  } catch (error) {
    console.error('Error:', error)
    document.querySelector('.js_fixed-button').textContent = '获取失败';
  }
}
const uniqueOrders = {};
const processedCombinations = {};
let skuMap = {};

function exportOrders(data, jsonRemark) {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);
  // Iterate over each item in the data array
  for (let i = 0; i < data.length; i++) {
    let matchsku
    const item = data[i];
    const skuids = jsonpath.query(item, '$..skucode')
    const skucodes = jsonpath.query(item, '$..skucode')
    // skuid_list.push(skuids)
    // skucode_list.push(skucodes)
    const shopnames = jsonpath.query(item, '$..shopname')
    const countries = jsonpath.query(item, '$..country')
    const paytimes = jsonpath.query(item, '$..pay').map(paytime => new Date(paytime))
    if (skuids.length > 0 && shopnames.length > 0) {
      const shop = shopnames[0]

      for (let j = 0; j < skuids.length; j++) {
        let skuid = skuids[j]
        // 去除空格
        try {
          skuid = skuid.replace(/\s/g, '');
          skuid = skuid.replace(/x\d$/, '')
          matchsku = skuid.replace(/[^\d\w]/g, '');
        } catch (error) {
        }
        // skuid = skuid.replace(/\s/g, '');

        const country = countries[0] || 'Unknown'; // 处理无国家信息的情况
        const paytime = paytimes[j];
        const combinationKey = `${shop}_${skuid}`;

        if (!uniqueOrders.hasOwnProperty(combinationKey)) {
          uniqueOrders[combinationKey] = {
            shopname: shop,
            skuid: skuid,
            // skucode: skucode,
            matchsku: matchsku,
            total_count: 0,
            count_30days: 0,
            count_60days: 0,
            countries: {}
          };
        }
        uniqueOrders[combinationKey].total_count++;
        if (paytime >= thirtyDaysAgo) {
          uniqueOrders[combinationKey].count_30days++;
        }
        if (paytime >= sixtyDaysAgo) {
          uniqueOrders[combinationKey].count_60days++;
        }

        if (uniqueOrders[combinationKey].countries.hasOwnProperty(country)) {
          uniqueOrders[combinationKey].countries[country]++;
        } else {
          uniqueOrders[combinationKey].countries[country] = 1;
        }
      }
    }
  }

  for (let k = 0; k < jsonRemark.length; k++) {
    const jsonRemarkItem = jsonRemark[k];
    let skuid = jsonpath.query(jsonRemarkItem, '$..skucode')[0];
    skuid = skuid.replace(/\s/g, '');
    matchsku = skuid.replace(/[^\d\w]/g, '');
    const sku_zh = jsonpath.query(jsonRemarkItem, '$..name_zh')[0];

    if (matchsku in skuMap) {
      skuMap[matchsku] = sku_zh;
    } else {

      skuMap[matchsku] = sku_zh;
    }

    Object.keys(uniqueOrders).forEach(combinationKey => {
      if (uniqueOrders[combinationKey].matchsku === matchsku) {
        uniqueOrders[combinationKey].skuname = skuMap[matchsku];
      }
    });
  }
}

function exportCSV() {
  console.log(uniqueOrders);
  console.log(skuMap)
  console.log(skuid_list);
  console.log(skucode_list);
  const headers = ['店铺', 'SKU', '名称', '90天销量', '30天销量', '60天销量', '90天销量1国家', '90天销量2国家', '90天销量3国家'];
  let csvContent = headers.join(',') + '\n';

  for (const key in uniqueOrders) {
    const order = uniqueOrders[key];
    const countries = Object.entries(order.countries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => `${entry[0]}: ${entry[1]}`);

    const row = [
      order.shopname,
      order.skuid,
      order.skuname,
      order.total_count,
      order.count_30days,
      order.count_60days,
      countries[0] || '',
      countries[1] || '',
      countries[2] || ''
    ];

    csvContent += row.join(',') + '\n';
  }

  // 下载csv文件
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sales_data.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}



function findSkuCodes(data) {
  if (Array.isArray(data)) {
    data.forEach(item => findSkuCodes(item));
  } else if (typeof data === 'object' && data !== null) {
    if ('skucode' in data) {
      let skuCode = data.skucode;
      skuCode = skuCode.replace(/\s+/g, '');
      counts[skuCode] = (counts[skuCode] || 0) + 1;
    }
    Object.values(data).forEach(value => {
      if (typeof value === 'object') findSkuCodes(value);
    });
  }
}

function update() {
  var storedCounts = JSON.parse(localStorage.getItem('skuCounts') || '{}');
  var pElements = document.querySelectorAll('#pro_cnt p');

  pElements.forEach(p => {
    let itemText = p.textContent.trim().replace(/\s+/g, '');
    var count = storedCounts[itemText];

    if (count) {
      var textNode = document.createTextNode(` 90天订单数(${count})`);
      var span = document.createElement('span');
      span.style.fontSize = '1.3em';
      span.style.color = '#0081ff';
      span.appendChild(textNode);
      p.appendChild(span);
    }
  });
}




//   工具-----------------------

function createButtonBox(top, left) {
  var existingBox = document.getElementById('js_buttonbox');
  if (existingBox) {
    return existingBox;
  }
  var box = document.createElement('div');
  box.className = 'js_buttonbox';
  box.id = 'js_buttonbox';
  box.style.position = 'fixed';
  box.style.top = top + 'px';
  box.style.left = left + 'px';
  box.style.zIndex = '9999';
  box.style.display = 'flex';
  box.style.flexDirection = 'row';
  box.style.alignItems = 'center';
  box.style.borderRadius = '5px';
  document.body.appendChild(box);
  return box;
}

function createButton(text, executeFunction, box) {
  var button = document.createElement('button');
  button.classList.add('fixed-button');
  button.textContent = text;
  button.classList.add('js_fixed-button');
  button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  button.style.color = 'black';
  button.style.padding = '10px 15px';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.addEventListener('click', executeFunction);
  box.appendChild(button);
}