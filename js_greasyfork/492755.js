// ==UserScript==
// @name         导出采购订单信息
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  实现和1688导出功能一样格式的导出
// @author       You
// @match        https://air.1688.com/app/ctf-page/trade-order-list/buyer-order-list.html*
// @match        https://trade.1688.com/order/buyer_order_list.htm*
// @match        https://trade.1688.com/order/buyer_order_list.htm?oldBuyerOrderList=y&spm=a360q.8274423%2Fnew.return.old
// @match        https://work.1688.com/?_path_=/purchasemanagement/buyList*
// @match        https://distributor.taobao.global/apps/order/list?*
// @match        https://order.1688.com/order/smart_make_order.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/492755/%E5%AF%BC%E5%87%BA%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/492755/%E5%AF%BC%E5%87%BA%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

// src/config.ts
var siteConfigs = [
  {
    name: "1688新版-采购单列表",
    match: (url) => url.hostname === "air.1688.com" && url.pathname.startsWith("/app/ctf-page/trade-order-list"),
    config: { type: "1688-air", page: "buyer-order-list" }
  },
  {
    name: "1688新版-trade域名",
    match: (url) => url.hostname === "trade.1688.com" && url.pathname === "/order/buyer_order_list.htm" && !url.searchParams.has("oldBuyerOrderList") && !url.searchParams.has("old_buyer_order_list"),
    config: { type: "1688-air", page: "buyer-order-list" }
  },
  {
    name: "1688新版-work域名",
    match: (url) => url.hostname === "work.1688.com" && url.searchParams.get("_path_") === "/purchasemanagement/buyList",
    config: { type: "1688-air", page: "buyer-order-list" }
  },
  {
    name: "1688旧版",
    match: (url) => url.hostname === "trade.1688.com" && url.pathname === "/order/buyer_order_list.htm" && (url.searchParams.get("oldBuyerOrderList") === "y" || url.searchParams.get("old_buyer_order_list") === "y"),
    config: { type: "1688-old", page: "buyer-order-list" }
  },
  {
    name: "taoworld订单列表",
    match: (url) => url.hostname === "distributor.taobao.global" && url.pathname.startsWith("/apps/order/list"),
    config: { type: "taoworld", page: "order-list" }
  },
  {
    name: "1688确认订单页",
    match: (url) => url.hostname === "order.1688.com" && url.pathname === "/order/smart_make_order.htm",
    config: { type: "1688-order", page: "buyer-order-list" }
  }
];
function getConfig(currentUrl = window.location.href) {
  const url = new URL(currentUrl);
  for (const site of siteConfigs) {
    if (site.match(url))
      return site.config;
  }
  return null;
}

// util/computeNum.ts
function computeNum(a, type, b) {
  function getDecimalLength(n) {
    const decimal = n.toString().split(".")[1];
    return decimal ? decimal.length : 0;
  }
  a = Number(a);
  b = Number(b);
  const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;
  a = amend(a * power);
  b = amend(b * power);
  switch (type) {
    case "+":
      result = (a + b) / power;
      break;
    case "-":
      result = (a - b) / power;
      break;
    case "*":
      result = a * b / (power * power);
      break;
    case "/":
      result = a / b;
      break;
  }
  result = amend(result);
  return {
    result,
    next(nextType, nextValue) {
      return computeNum(result, nextType, nextValue);
    }
  };
}

// util/util.ts
function timestampToTime(date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function safeStringToNumber(str) {
  if (typeof str !== "string")
    return null;
  const cleaned = str.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
function getShadowElement(selOpt, startElement = document.body) {
  let current = startElement;
  for (let i = 0;i < selOpt.shadowPath.length; i++) {
    const selector = selOpt.shadowPath[i];
    if (!current)
      return null;
    const host = current.querySelector(selector);
    if (!host) {
      console.warn(`找不到 Shadow DOM 宿主元素。层级：第 ${i + 1} 层，选择器："${selector}"`);
      return null;
    }
    if (!host.shadowRoot) {
      console.warn(`找到的宿主元素没有 ShadowRoot。层级：第 ${i + 1} 层，宿主选择器："${selector}"`);
      return null;
    }
    current = host.shadowRoot;
  }
  return current?.querySelector(selOpt.finalSelector);
}

// util/exceljs.ts
var exportExcel = (dataList, fileName = "ExcelJS.xlsx") => {
  const _workbook = new ExcelJS.Workbook;
  const _sheet1 = _workbook.addWorksheet("sheet1");
  _sheet1.columns = [
    { header: "订单编号", key: "po", width: 20 },
    { header: "买家公司名", key: "buyerCompanyName", width: 11 },
    { header: "买家会员名", key: "buyerMemberName", width: 11 },
    { header: "卖家公司名", key: "sellerCompanyName", width: 11 },
    { header: "卖家会员名", key: "sellerMemberName", width: 11 },
    { header: "货品总价(元)", key: "totalPriceOfGoods", width: 15 },
    { header: "运费", key: "freight", width: 11 },
    { header: "涨价或折扣(元)", width: 15 },
    { header: "实付款", key: "actualPayment", width: 11 },
    { header: "订单状态", key: "orderStatus", width: 11 },
    { header: "订单创建时间", key: "orderCreationTime", width: 25 },
    { header: "订单付款时间", key: "orderPaymentTime", width: 25 },
    { header: "发货方", width: 10 },
    { header: "收货人姓名", key: "consigneeName", width: 10 },
    { header: "收货地址", key: "address", width: 60 },
    { header: "邮编", key: "postalCode" },
    { header: "联系电话" },
    { header: "联系手机", key: "contactMobilePhone", width: 15 },
    { header: "货品标题", key: "itemTitle", width: 70 },
    { header: "单价(元)", key: "price" },
    { header: "数量", key: "quantity" },
    { header: "单位" },
    { header: "货号" },
    { header: "型号" },
    { header: "Offer ID", key: "offerID", width: 15 },
    { header: "SKU ID" },
    { header: "物料编号" },
    { header: "单品货号" },
    { header: "货品种类", key: "productType" },
    { header: "买家留言" },
    { header: "物流公司", key: "logisticsName", width: 18 },
    { header: "运单号", key: "logisticsNum", width: 15 }
  ];
  _sheet1.columns.forEach((col, index) => {
    col.style = {
      alignment: {
        vertical: "top"
      }
    };
    if (index == 18 || index == 15) {
      col.style.alignment.wrapText = true;
    }
  });
  const _titleCell = _sheet1.getRow(1);
  _titleCell.height = 14;
  _titleCell.font = {
    name: "宋体",
    bold: true,
    size: 11
  };
  let startRow = 2;
  let mergeColumns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "AC", "AD", "AE", "AF"];
  dataList.forEach((e) => {
    let isFirst = true;
    e.itemsList.forEach((item) => {
      let row = _sheet1.addRow({
        po: e.po,
        buyerCompanyName: e.buyerCompanyName,
        buyerMemberName: e.buyerMemberName,
        sellerCompanyName: e.sellerCompanyName,
        sellerMemberName: e.sellerMemberName,
        totalPriceOfGoods: safeStringToNumber(e.totalPriceOfGoods),
        freight: safeStringToNumber(e.freight),
        actualPayment: safeStringToNumber(e.actualPayment),
        orderStatus: e.orderStatus,
        orderCreationTime: e.orderCreationTime,
        orderPaymentTime: e.orderPaymentTime,
        consigneeName: e.consigneeName,
        address: e.address,
        contactMobilePhone: e.contactMobilePhone,
        postalCode: e.postalCode,
        itemTitle: item.itemTitle,
        price: safeStringToNumber(item.price),
        quantity: safeStringToNumber(item.quantity),
        offerID: item.offerID,
        productType: e.itemsList.length,
        logisticsName: e.logisticsName,
        logisticsNum: e.logisticsNum
      });
      row.height = 27;
    });
    if (e.itemsList.length > 1) {
      mergeColumns.forEach((colName) => {
        _sheet1.mergeCells(`${colName}${startRow}:${colName}${startRow + e.itemsList.length - 1}`);
      });
    }
    startRow += e.itemsList.length;
  });
  _workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: "application/octet-stream"
    });
    saveAs(_file, `${fileName}.xlsx`);
  });
};

// src/1688/new1688Opt.ts
var orderListSelOpt = {
  shadowPath: ['app-root[data-tracker="app-root"]', "order-list"],
  finalSelector: "div.order-list-content"
};
var productSelOpt = {
  shadowPath: ["order-item-entry-product"],
  finalSelector: "div.order-item-entry-product"
};
var unitPriceSelOpt = {
  shadowPath: ["order-item-entry-unit-price"],
  finalSelector: "div.actual-unit-price"
};
var qualitySelOpt = {
  shadowPath: ["order-item-entry-quantity-service-status"],
  finalSelector: "span.quantity-amount"
};
var dialogMemoSelOpt = {
  shadowPath: ["dialog-memo"],
  finalSelector: "q-form[initialvalues]"
};
var btnContainerSelOpt = {
  shadowPath: ["app-root", "order-list", "order-list-wait-buyer-pay-header"],
  finalSelector: "div.left"
};

/* src/1688/新版页面1688导出.ts */
function new1688() {
  const btnContainer = getShadowElement(btnContainerSelOpt);
  if (btnContainer) {
    let btn = document.createElement("q-button");
    btn.textContent = "导出已选订单";
    btn.className = "pc";
    btn.setAttribute("size", "mini");
    btnContainer.insertBefore(btn, btnContainer.children[2]);
    let clickTimer = null;
    btn.addEventListener("click", () => {
      if (clickTimer) {
        return;
      }
      clickTimer = setTimeout(() => {
        exportOrder(false);
        clickTimer = null;
      }, 300);
    });
    btn.addEventListener("dblclick", () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      exportOrder(true);
    });
  }
  function exportOrder(isReverse) {
    const orderList = extractOrderDetails();
    if (orderList.length === 0) {
      alert("未找到已选中的订单，请先选择订单后再尝试导出。");
      return;
    }
    let exportExcelTitle = `${timestampToTime(new Date)} 导出订单`;
    if (isReverse) {
      orderList.reverse();
      exportExcelTitle = `逆序${timestampToTime(new Date)} 导出订单`;
    }
    exportExcel(orderList, exportExcelTitle);
    console.log(orderList);
  }
}
function getOrderElement(shadowSelOption) {
  const orderListContent = getShadowElement(shadowSelOption);
  if (!orderListContent)
    return { validItems: [], errorItems: [] };
  const orderItems = Array.from(orderListContent.querySelectorAll("order-item[data-tracker]"));
  const validItems = [];
  const errorItems = [];
  for (const item of orderItems) {
    const header = item.shadowRoot?.querySelector("div.order-item-header");
    const content = item.shadowRoot?.querySelector("div.order-item-content");
    const checkbox = header?.querySelector("q-checkbox")?.getAttribute("checked");
    if (checkbox !== "true")
      continue;
    if (header && content) {
      validItems.push({ header, content });
    } else {
      errorItems.push({ item, header, content });
    }
  }
  return { validItems, errorItems };
}
function extractOrderDetails() {
  const orderDetailsList = [];
  let orderItems = getOrderElement(orderListSelOpt);
  if (orderItems.errorItems.length) {
    console.warn("部分订单元素未能正确解析，已跳过这些订单。", orderItems.errorItems);
  }
  for (const { header, content } of orderItems.validItems) {
    const headerInfo = extractHeaderInfo(header);
    const contentInfo = extractContentInfo(content);
    orderDetailsList.push({ ...headerInfo, ...contentInfo });
  }
  return orderDetailsList;
}
function extractHeaderInfo(header) {
  const buyerCompanyName = "日贸通";
  let po = "";
  let buyerMemberName = "";
  let orderCreationTime = "";
  let dialogMemo = "";
  const headerLeft = header.querySelector("div.item-header-left");
  if (headerLeft) {
    po = headerLeft.querySelector("span.order-id copy-to-clipboard")?.getAttribute("text")?.trim() || "";
    buyerMemberName = headerLeft.querySelector("span.buyer-account copy-to-clipboard")?.getAttribute("text")?.trim() || "";
    orderCreationTime = headerLeft.querySelector("span.order-time")?.textContent?.trim() || "";
  }
  const headerRight = header.querySelector("div.item-header-right");
  if (headerRight) {
    const dialogMemoEl = getShadowElement(dialogMemoSelOpt, headerRight);
    const memoJSON = dialogMemoEl?.getAttribute("initialvalues")?.trim() || "";
    try {
      const memoObj = JSON.parse(memoJSON);
      dialogMemo = memoObj.remark || "";
    } catch (error) {
      console.warn("解析订单备注时发生错误，可能是 JSON 格式不正确。", error);
    }
  }
  return { po, buyerCompanyName, buyerMemberName, orderCreationTime, dialogMemo };
}
function extractContentInfo(content) {
  const orderItemContainer = content.querySelector("div.order-item-entry-container");
  const itemsList = extractItemInfo(orderItemContainer);
  const totalPriceEl = content.querySelector("order-item-total-price");
  const totalPriceInfo = extractTotalPriceInfo(totalPriceEl, itemsList);
  const sellerInfoEl = content.querySelector("order-item-seller-info");
  const sellerInfo = extractSellerInfo(sellerInfoEl);
  const orderStatusEl = content.querySelector("order-item-status");
  const orderStatus = extractOrderStatus(orderStatusEl);
  return { itemsList, ...totalPriceInfo, ...sellerInfo, ...orderStatus };
}
function extractItemInfo(itemContainer) {
  if (!itemContainer)
    return [];
  const itemList = [];
  const itemElements = Array.from(itemContainer.querySelectorAll("div.order-item-entry"));
  for (const itemEl of itemElements) {
    const item = { price: "", quantity: "", offerID: "", itemTitle: "" };
    const product = getShadowElement(productSelOpt, itemEl);
    const productInfoEl = product?.querySelector("div.product-info");
    if (productInfoEl) {
      let productNameEl = productInfoEl.querySelector("a.product-name");
      item.offerID = productNameEl?.href.split("/").at(4)?.split(".").at(0) || "";
      let productName = productNameEl?.textContent?.trim() || "";
      let skuInfo = Array.from(productInfoEl.querySelectorAll("span.sku-info-item")).map((span) => span.textContent?.trim() || "").filter(Boolean).sort().join(" ");
      item.itemTitle = [productName, skuInfo].filter(Boolean).join(" ");
    }
    const priceEl = getShadowElement(unitPriceSelOpt, itemEl);
    item.price = priceEl?.lastChild?.textContent?.trim() || "";
    const qualityEl = getShadowElement(qualitySelOpt, itemEl);
    item.quantity = qualityEl?.textContent?.trim() || "";
    itemList.push(item);
  }
  return itemList;
}
function extractTotalPriceInfo(totalPriceEL, itemList) {
  let totalPriceOfGoods = "";
  let actualPayment = "";
  let freight = "";
  if (!totalPriceEL)
    return { totalPriceOfGoods, actualPayment, freight };
  const totalPriceShadow = totalPriceEL.shadowRoot;
  if (totalPriceShadow) {
    totalPriceOfGoods = itemList.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseFloat(item.quantity);
      if (isNaN(price) || isNaN(quantity)) {
        console.warn(`Invalid price or quantity for item "${item.itemTitle}" (Offer ID: ${item.offerID})`);
        return total;
      }
      return computeNum(price, "*", quantity).next("+", total).result;
    }, 0).toFixed(2);
    actualPayment = totalPriceShadow.querySelector("div.total-price")?.textContent?.replace("¥", "")?.trim() || "0";
    freight = totalPriceShadow.querySelector("div.carriage")?.textContent?.replace("含运费", "")?.replace("包邮", "0")?.trim() || "0";
  }
  return { totalPriceOfGoods, actualPayment, freight };
}
function extractSellerInfo(sellerInfoEl) {
  let sellerCompanyName = "";
  let sellerMemberName = "";
  if (!sellerInfoEl)
    return { sellerCompanyName, sellerMemberName };
  const sellerInfoShadow = sellerInfoEl.shadowRoot;
  if (sellerInfoShadow) {
    sellerCompanyName = sellerInfoShadow.querySelector("span.company-name")?.textContent?.trim() || "";
    sellerMemberName = sellerInfoShadow.querySelector("span.seller-id-text")?.textContent?.trim() || "";
  }
  return { sellerCompanyName, sellerMemberName };
}
function extractOrderStatus(orderStatusEl) {
  let orderStatus = "";
  let viewDetailLink = "";
  if (!orderStatusEl)
    return { orderStatus, viewDetailLink };
  const orderStatusShadow = orderStatusEl.shadowRoot;
  if (orderStatusShadow) {
    orderStatus = orderStatusShadow.querySelector("div.order-status")?.textContent?.trim() || "";
    const viewDetailEl = orderStatusShadow.querySelector('a.order-detail-action[href^="https://air.1688.com"]');
    if (viewDetailEl) {
      viewDetailLink = viewDetailEl.href.trim();
    }
  }
  return { orderStatus, viewDetailLink };
}

// src/taoWorld/taoWorld.ts
function taoWorld() {
  let loading_wrap = document.querySelector(".Content--loading--g0hLiP5");
  let buttonRow = document.querySelector(".Filter--taskLine--HOIeyXP");
  if (loading_wrap && buttonRow) {
    let btn = document.createElement("button");
    btn.type = "button";
    btn.style.height = "36px";
    btn.textContent = "导出当前页订单";
    btn.addEventListener("click", () => {
      let moreBtn = document.querySelector("div.Content--loadMore--n54XRx1 button");
      if (moreBtn) {
        setObserver(loading_wrap);
        moreBtn.click();
      } else {
        let dataList = groupOrders(document.querySelector(".next-loading-wrap"));
        if (dataList && dataList.length >= 1) {
          exportExcel(dataList, `taobaoWorld ${timestampToTime(new Date)} 导出订单`);
        }
      }
    });
    buttonRow.append(btn);
  }
  function setObserver(loading_wrap2) {
    let observer = new MutationObserver(obseverCallback);
    observer.observe(loading_wrap2, { attributes: true });
    console.log("已添加DOM监听");
  }
  function obseverCallback(mutationList, observer) {
    for (let mutation of mutationList) {
      if (mutation.type == "attributes" && mutation.target.className == "next-loading next-loading-inline Content--loading--g0hLiP5") {
        let moreBtn = document.querySelector("div.Content--loadMore--n54XRx1 button");
        if (moreBtn) {
          moreBtn.click();
        } else {
          observer.disconnect();
          console.log("已解除DOM监听");
          let dataList = groupOrders(document.querySelector(".next-loading-wrap"));
          if (dataList && dataList.length >= 1) {
            exportExcel(dataList, `taobaoWorld ${timestampToTime(new Date)} 导出订单`);
          }
        }
      }
    }
  }
  function groupOrders(wrap) {
    let noData = document.querySelector(".NoData--title--ILagHI5");
    if (noData) {
      return;
    }
    let dataList = [];
    let tableList = Array.from(wrap.querySelectorAll(".Table--orderItemWraper--vfIxDrh"));
    let regex = new RegExp(/\b[a-zA-Z0-9]+_!![0-9]+\b/);
    tableList.forEach((table) => {
      let divList = Array.from(table.querySelectorAll("div"));
      divList.forEach((div) => {
        if (div.className === "Header--wrapper--iCYgfyU") {
          let orderDetail = {};
          orderDetail.orderCreationTime = div.children[2].children[1].lastChild?.textContent ?? "";
          orderDetail.buyerMemberName = div.children[3].children[1].children[1].textContent ?? "";
          orderDetail.consigneeName = div.children[4].children[0].lastChild?.textContent ?? "";
          dataList.push(orderDetail);
        }
        if (div.className === "Content--listWraper--SWlDcAG") {
          let current = dataList[dataList.length - 1];
          if (!current.po) {
            let currenPo = Array.from(div.querySelectorAll(".ProductCard--proDes--fMqofqf"))[3]?.textContent?.split(": ").at(-1) ?? "";
            current.po = currenPo;
          }
          let seller = div.querySelectorAll(".ProductCard--flexCenter--tXn9Ezl");
          current.sellerCompanyName = seller[0]?.children[0].textContent?.split(": ").at(-1) ?? "";
          current.sellerMemberName = seller[1]?.children[0].textContent?.split(": ").at(-1) ?? "";
          current.orderStatus = div.querySelector(".Content--orderStatus--Pu_LvPp")?.textContent ?? "";
          let itemDivList = div.querySelectorAll(".Content--colStatus--F9DfIjZ");
          itemDivList.forEach((itemDiv) => {
            let img = itemDiv.querySelector("img");
            let imgId = "";
            if (img?.src.match(regex)) {
              imgId = img.src.match(regex)[0] ?? "";
            }
            let itemText = itemDiv.querySelectorAll(".chc-ellipsis-container")[1]?.getAttribute("title")?.replaceAll(":", ": ") ?? "";
            let itemTitle = itemDiv.querySelector(".ProductCard--imgName--w54cJpP")?.textContent ?? "";
            itemTitle = itemTitle + itemText;
            let quantity = `${itemDiv.querySelector(".Content--quantityContent--c0HrZdA")?.textContent ?? ""}`;
            let thisItemtotalPriceOfGoods = "";
            itemDiv.querySelectorAll("div").forEach((value) => {
              if (value.textContent && value.textContent?.includes("货品金额: CNY")) {
                const textContent = value.textContent?.trim() ?? "";
                const match = textContent.match(/CNY\s*([\d.]+)/);
                if (match && match[1]) {
                  thisItemtotalPriceOfGoods = match[1];
                }
              }
            });
            let item = {
              price: `0`,
              offerID: imgId,
              quantity: `${quantity}`,
              itemTitle,
              totalPrice: thisItemtotalPriceOfGoods
            };
            if (current.itemsList) {
              current.itemsList.push(item);
            } else {
              current.itemsList = [item];
            }
          });
        }
        if (div.className === "Footer--wrapper--r55Y5uU") {
          let current = dataList[dataList.length - 1];
          Array.from(div.querySelectorAll("div.Footer--col--DFf56Lm")).forEach((div2) => {
            const text = div2.textContent?.trim() ?? "";
            if (text?.includes("货品金额总计")) {
              current.totalPriceOfGoods = text.replace("货品金额总计(CNY)", "").trim();
            }
            if (text?.includes("大陆段运费总计")) {
              current.freight = text.replace("大陆段运费总计(CNY)", "").trim();
            }
            if (text?.includes("金额总计")) {
              current.actualPayment = text.replace("金额总计(CNY)", "").trim();
            }
          });
          const { adjustedItems, adjustedFreight } = adjustUnitPrices(current.itemsList, Number(current.freight ?? 0));
          current.freight = `${adjustedFreight}`;
          current.itemsList = adjustedItems;
        }
      });
    });
    console.log("当前页面订单列表", dataList);
    return dataList;
  }
}
function adjustUnitPrices(items, freight) {
  let totalDiff = 0;
  const freightCents = Math.round(freight * 100);
  const adjustedItems = items.map((item) => {
    const qty = parseFloat(item.quantity) || 0;
    const totalCents = Math.round(parseFloat(item.totalPrice) * 100) || 0;
    if (qty <= 0)
      return { ...item, price: "0.00" };
    const remainderCents = totalCents % qty;
    const adjustedTotalCents = totalCents - remainderCents;
    const unitPriceCents = adjustedTotalCents / qty;
    totalDiff += remainderCents;
    const adjustedPrice = (unitPriceCents / 100).toFixed(2);
    return {
      ...item,
      price: adjustedPrice
    };
  });
  const adjustedFreightCents = freightCents + totalDiff;
  const adjustedFreight = +(adjustedFreightCents / 100).toFixed(2);
  return { adjustedItems, adjustedFreight };
}

// util/profill.ts
function profill() {
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, "at", {
      value: function(index) {
        if (index < 0) {
          index = this.length + index;
        }
        if (index < 0 || index >= this.length) {
          return;
        }
        return this[index];
      },
      configurable: true,
      writable: true
    });
  }
}

// src/1688/order.ts
function observeHongbao() {
  const checkAndExecute = () => {
    const hasHongbao = Array.from(document.querySelectorAll("div.list-item-title")).some((el) => el.textContent?.includes("红包"));
    if (!hasHongbao) {
      return false;
    }
    const btnWrapper = document.querySelector("div.button-wrapper");
    if (!btnWrapper) {
      return false;
    }
    const primaryBtn = btnWrapper.querySelector('q-button[type="primary"]');
    const submitBtn = primaryBtn?.shadowRoot?.querySelector("div.q-button");
    if (primaryBtn && submitBtn) {
      primaryBtn.textContent = `（使用红包）${primaryBtn.textContent.trim()}`;
      submitBtn.setAttribute("style", "background: green;");
      console.log("✅ 红包按钮已增强");
      return true;
    }
    return false;
  };
  if (checkAndExecute()) {
    return;
  }
  const observer = new MutationObserver((mutations, obs) => {
    if (checkAndExecute()) {
      obs.disconnect();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  setTimeout(() => {
    observer.disconnect();
    console.warn("⏰ 观察超时，未能找到目标元素");
  }, 1e4);
}

// src/main.ts
profill();
var config = getConfig();
if (config) {
  console.log("匹配到配置:", config);
} else {
  console.log("没有匹配到配置");
}
switch (config?.type) {
  case "1688-air":
    new1688();
    break;
  case "taoworld":
    taoWorld();
    break;
  case "1688-order":
    observeHongbao();
    break;
  default:
    console.warn("未匹配到对应的脚本");
    break;
}
