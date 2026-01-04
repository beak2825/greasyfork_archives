// ==UserScript==
// @name         24.01.02工品最低价
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  爬取工品一号的最低价数据
// @author       menkeng
// @license      GPL-3.0
// @run-at       context-menu
// @match        https://www.gpyh.com/quickbuy/goodsSearchPage?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpyh.com
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484841/240102%E5%B7%A5%E5%93%81%E6%9C%80%E4%BD%8E%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/484841/240102%E5%B7%A5%E5%93%81%E6%9C%80%E4%BD%8E%E4%BB%B7.meta.js
// ==/UserScript==


var productData = {};

async function scrapeCurrentPage() {
  console.time("第 " + pagenum + " 页爬取耗时");
  $(".goods-table-body > tr.section-item").each(function () {
    var dom = $(this);
    var productNameDom = dom.find("p.goods-txt-name");
    var productName = clearText(productNameDom.text());
    var model = clearText(dom.children("td").eq(1).text());
    var parts = model.split('*');
    if (parts.length > 1) {
      var model1 = parts[0]; // 提取星号前的文本
      var model2 = parts[1];  // 提取星号后的文本
    } else {
      var model1 = model2 = ''
      console.log("No star found in the string.");
    }
    var brand = clearText(dom.children("td").eq(2).text())
    var warehouse = clearText(dom.children("td").eq(3).text())
    var pack = clearText(dom.children("td").eq(4).text())
    var store = clearText(dom.children("td").eq(5).text())
    // var minquantity = clearText(dom.children("td").eq(6).text())
    var minquantity = 1000
    var price = clearText(dom.find("td .price_hover").eq(0).text())
    // var bag = clearText(dom.find(".num-selector").text())
    var bag_dom = dom.children("td").eq(-1)
    var bag_a = bag_dom.find("input").eq(0).val()
    var bag_b = bag_dom.find("select").val()
    var bag_c = bag_dom.find("input").eq(1).val()
    var bag_d = clearText(bag_dom.find(".num-selector div").eq(1).text())
    var bag = bag_a + bag_b + bag_c + bag_d
    var id = dom.find("dt[goodsid]").attr("goodsid");
    var url = "https://www.gpyh.com/quickbuy/detail?barcode=" + id
    // console.log(`Product Name: ${productName}`, `Model: ${model}`, `Brand: ${brand}`, `Warehouse: ${warehouse}`, `Pack: ${pack}`, `Store: ${store}`, `Minimum Quantity: ${minquantity}`, `Price: ${price}`, `Bag: ${bag}`, `URL: ${url}`);

    // 如果是永年自营仓，直接跳过不存储
    if (warehouse.includes('永年自营仓')) {
      // console.log("Skipping product (永年自营仓):", productName, model);
      return true;
    }

    var uniqueKey = `${productName}_${model}`;

    // 如果不存在或者存在但价格更低，则更新或添加信息
    var priceNumber = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    if (!productData[uniqueKey] || (productData[uniqueKey].price > priceNumber)) {
      productData[uniqueKey] = {
        productName,
        model1,
        model2,
        brand,
        warehouse,
        pack,
        store,
        minquantity,
        priceNumber,
        bag,
        url
      };
      return true;

    }
  });
  console.timeEnd("第 " + pagenum + " 页爬取耗时");
}

function exportToCSV(productData) {
  let csvContent = "商品信息,规格1,规格2,品牌,仓库,包装信息,库存,件数,价格,包装\n"; // 添加标题行

  for (const [key, product] of Object.entries(productData)) {
    let row = `"${product.productName}","${product.model1}","${product.model2}","${product.brand}","${product.warehouse}","${product.pack},"${product.store},"${product.minquantity}","${product.priceNumber}","${product.bag}"`;
    csvContent += row + "\n";
  }

  // 将字符串转换为 Blob
  var encodedUri = encodeURI(csvContent);
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // 创建一个下载链接并点击它以触发下载
  var link = document.createElement("a");
  if (link.download !== undefined) { // 检查浏览器是否支持下载属性
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "product_data.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
var pagenum = 1
var catchtime = 0
// 使用这个函数来处理数据爬取和导出
async function startScraping() {
  console.time("总执行时间");
  // 翻页和后续处理逻辑
  var maxpage = document.querySelector(".gp-pagination-w ul li:nth-last-child(3)").innerText
  var nextpage = document.querySelector(".gp-pagination-w ul li:nth-last-child(2)")

  while (!$(nextpage).hasClass("disabled") && pagenum <= maxpage) {
    console.log("最大页数、当前页数：" + maxpage + "/" + pagenum);
    await scrapeCurrentPage();
    await delay(2000);
    // 点击下一页并增加页码
    $(nextpage).click();
    pagenum += 1;
  }
  exportToCSV(productData);
  console.timeEnd("总执行时间");
}

// 初始化爬虫
startScraping();


// ---------------------工具类---------------------
function clearText(text, ...additionalWordsToRemove) {
  // 固定需要去掉的字符数组
  const fixedWordsToRemove = ["图纸", "自营", "现货", "免拆零费：满...", "(", ")", "，平台直发", "￥", ","];
  const allWordsToRemove = fixedWordsToRemove.concat(additionalWordsToRemove);

  let result = text.replace(/\s+/g, '');

  allWordsToRemove.forEach(word => {
    let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex = new RegExp(escapedWord, 'g');
    result = result.replace(regex, '');
  });

  return result;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function waitForTextChange(selector, timeout) {
  return new Promise((resolve, reject) => {
    // 设置超时
    const timer = setTimeout(() => {
      observer.disconnect(); 
      reject(new Error('Timeout waiting for text change'));
    }, timeout);

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          clearTimeout(timer); // 如果发生变化，清除定时器
          observer.disconnect(); 
          resolve(); 
          break;
        }
      }
    });

    const targetNode = document.querySelector(selector);
    if (!targetNode) {
      clearTimeout(timer);
      reject(new Error('Target node not found'));
      return;
    }

    const config = { childList: true, subtree: true, characterData: true };

    observer.observe(targetNode, config);
  });
}


function getDirectTextNodes(element) {
  var textNodes = [];
  var childNodes = element.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType === 3) { // 3 代表文本节点
      textNodes.push(childNodes[i]);
    }
  }

  return textNodes;
}
// ---------------------工具类---------------------

