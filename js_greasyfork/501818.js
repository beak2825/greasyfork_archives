// ==UserScript==
// @name         速卖通违背发货承诺订单导出
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  x
// @author       csz
// @match        https://csp.aliexpress.com/m_apps/store-assessment-new/assessment*
// @icon         https://ae01.alicdn.com/kf/S319fd8b965e247a28c70363f8c91d7c9i.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501818/%E9%80%9F%E5%8D%96%E9%80%9A%E8%BF%9D%E8%83%8C%E5%8F%91%E8%B4%A7%E6%89%BF%E8%AF%BA%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/501818/%E9%80%9F%E5%8D%96%E9%80%9A%E8%BF%9D%E8%83%8C%E5%8F%91%E8%B4%A7%E6%89%BF%E8%AF%BA%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
// 创建 iframe 并插入页面
var iframe = document.createElement('iframe');


// 设置 iframe 的内容
iframe.srcdoc =`<div>
    <script  type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
    <script type="text/javascript">
    debugger;
    alert("Debugger reached");
    console.log("Debugger reached");
    window.addEventListener("message", function(event) {
    if (event.data.action === "exportOrders") {
      var orders = event.data.orders;

      // 将数据转换为工作表
      var worksheet = XLSX.utils.json_to_sheet(orders);

      // 创建一个新的工作簿
      var workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // 将工作簿导出为 Excel 文件
      XLSX.writeFile(workbook, "orders_data.xlsx");
    }
    });
    </script>
    </div>`
document.body.appendChild(iframe);

// 加载必要的脚本
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  script.onload = function() {
    if (typeof(callback) === 'function') {
      callback();
    }
  };

  document.head.appendChild(script);
}

loadScript("https://code.jquery.com/jquery-3.6.0.min.js");

// 创建导出按钮
var button = document.createElement("button");
button.innerHTML = "导出";  // 设置按钮文本
button.style.position = "fixed";
button.style.right = "20px";
button.style.bottom = "20px";
button.style.zIndex = "1000";

// 绑定点击事件
button.onclick = function() {
  var orders = [];

  $(".next-table-row").each(function() {
    var orderNumber = $(this).find("p:contains('订单号：')").next().find("span").text()?.trim();
    var orderTime = $(this).find("p:contains('下单时间')").next()?.text()?.trim();
    var productTitle = $(this).find("div[title]").attr("title")?.trim();
    var productSKU = $(this).find("span:contains('SKU ID:')").text()?.trim()?.replace('SKU ID:', '');
    var productQuantity = $(this).find("div.next-table-cell-wrapper:contains('x')").text()?.trim();
    var productPrice = $(this).find("div.next-table-cell-wrapper:contains('CNY')").text()?.replace('CNY','')?.trim();
    var reason1 = $(this).find("span:contains('虚假发货')").text()?.trim();
    var reason2 = $(this).find("span:contains('物流上网超时')").text()?.trim();

    // 提取剩余时间
    var remainingTime = $(this).find("span:contains('剩余时间')").next().text()?.trim();

    var data = {
      "订单号": orderNumber,
      "下单时间": orderTime,
      "商品标题": productTitle,
      "商品SKU": productSKU,
      "商品数量": productQuantity,
      "商品价格": productPrice,
      "虚假发货": reason1,
      "物流上网超时": reason2,
      "剩余时间": remainingTime,
    };

    orders.push(data);
  });

  // 将数据发送到 iframe 进行处理
  iframe.contentWindow.postMessage({ action: "exportOrders", orders: orders }, "*");
};

// 将按钮添加到页面
document.body.appendChild(button);

