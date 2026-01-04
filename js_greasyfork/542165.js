// ==UserScript==
// @name         YJ-速卖通草稿不包邮和半托管定价
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  YJ-速卖通草稿填入不包邮和半托管相关定价和属性。
// @author       glk
// @match        http://39.104.68.206:1688/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0ibGF5ZXIiPjx0ZXh0IGZpbGw9IiNlZWIyMTEiIGZvbnQtZmFtaWx5PSJTZXJpZiIgZm9udC1zaXplPSI2MDAuMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjM0IiB5PSI0NTYuMzEiPkc8L3RleHQ+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDUwZjI1IiBzdHJva2Utd2lkdGg9IjQwIiBkPSJNMTg4LjUgMTM3djIyNC4wNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwOTkyNSIgc3Ryb2tlLXdpZHRoPSIzMCIgZD0iTTIwOC41IDI1M2g2Ni42Ii8+PHBhdGggZD0iTTMwOC4xNCAxNjAuMDlMMjgyIDI1MS4zOGwyNyA3MS41MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2OWU4IiBzdHJva2Utd2lkdGg9IjMyIi8+PC9nPjwvc3ZnPg==
// @grant        none
// @license      Copyright glk
// @downloadURL https://update.greasyfork.org/scripts/542165/YJ-%E9%80%9F%E5%8D%96%E9%80%9A%E8%8D%89%E7%A8%BF%E4%B8%8D%E5%8C%85%E9%82%AE%E5%92%8C%E5%8D%8A%E6%89%98%E7%AE%A1%E5%AE%9A%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542165/YJ-%E9%80%9F%E5%8D%96%E9%80%9A%E8%8D%89%E7%A8%BF%E4%B8%8D%E5%8C%85%E9%82%AE%E5%92%8C%E5%8D%8A%E6%89%98%E7%AE%A1%E5%AE%9A%E4%BB%B7.meta.js
// ==/UserScript==


function createFormData(data) {
  const formData = new FormData();

  if (typeof data === "string") {
    // 处理查询字符串
    const params = new URLSearchParams(data);
    for (const [key, value] of params) {
      formData.append(key, value);
    }
  } else if (typeof data === "object" && data !== null) {
    // 处理对象
    Object.keys(data).forEach((key) => {
      const value = data[key];
      // 处理不同类型的值
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // 数组：每个元素单独添加
          value.forEach((item) => formData.append(key, item));
        } else if (value instanceof File || value instanceof Blob) {
          // 文件或Blob直接添加
          formData.append(key, value);
        } else {
          // 其他类型转为字符串
          formData.append(key, String(value));
        }
      } else {
        // null 或 undefined 转为空字符串
        formData.append(key, "");
      }
    });
  }

  return formData;
}

function createAsyncTask(
  checkFun = () => {},
  initFun = () => {},
  duration = 1
) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      const res = checkFun();
      if (res) {
        clearInterval(timer);
        const res2 = await initFun(res);
        resolve(res2);
      }
    }, duration * 1000);
  });
}


/**
 * @function - 根据百分比返回小数
 * @param {String | Number} num - 百分数或小数
 * @returns 一个小数
 */
function getDecimal(num) {
  let numStr = num.toString();
  if (numStr.includes("%")) {
    return Number(num.replace("%", "")) / 100;
  } else {
    return Number(numStr);
  }
}

/**
 * 添加自定义CSS
 * @param {String} styStr 
 */
function addStyle(styStr = "") {
  let _style = document.createElement("style");
  _style.innerHTML = styStr;
  document.getElementsByTagName("head")[0].appendChild(_style);
}

/**
 * 初始化一个带有本地存储和默认值的输入框
 * @param {*} eleSelector - 选择器
 * @param {*} localStorageKey - 本地存储的key
 * @param {*} defaultValue - 默认值
 */
function initInputWithLocalStorage(eleSelector, localStorageKey, defaultValue="") {
  const ele = $(eleSelector);
  const localValue = localStorage.getItem(localStorageKey);
  if (localValue) {
    ele.val(localValue);
  } else {
    ele.val(defaultValue);
    localStorage.setItem(localStorageKey, defaultValue);
  }
  ele.on('change', (e) => {
    localStorage.setItem(localStorageKey, e.target.value);
  })
}

Number.prototype.toFixed = function (n) {
  if (n > 20 || n < 0) {
    throw new RangeError(
      "toFixed() digits argument must be between 0 and 20"
    );
  }
  const number = this;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof n == "undefined" || n == 0) {
    return Math.round(number).toString();
  }
  let result = number.toString();
  const arr = result.split(".");

  // 整数的情况
  if (arr.length < 2) {
    result += ".";
    for (let i = 0; i < n; i += 1) {
      result += "0";
    }
    return result;
  }
  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += "0";
    }
    return result;
  }
  result = integer + "." + decimal.substr(0, n);
  const last = decimal.substr(n, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = (Math.round(parseFloat(result) * x) + 1) / x;
    result = result.toFixed(n);
  }
  return result;
};

/** ==========================================以上全为工具========================== */
/** ==========================================以上全为工具========================== */
/** ==========================================以上全为工具========================== */

/**
 * 获取token
 * @returns
 */
function getToken() {
  return window.Token || window.parent.Token;
}


/**
 * 【管理员账号】通过某个系列产品SKU查询所属产品的 ProductId
 * @param {*} sku
 * @returns
 * @description 获取 ProductId
 */
function getProductIdBySKU(sku = "YJ8992703") {
  const SearchConfig = {
    Event: 20165,
    JsonValue: JSON.stringify({
      keyword: sku,
      IsSale: "",
    }),
    Token: getToken(),
    _search: false,
    rows: 10,
    page: 1,
    sidx: "CreateDate",
    sord: "desc",
  };
  const urlSearchParams = new URLSearchParams(SearchConfig);
  const url = `${YjBaseUrl}/getpagedata?${urlSearchParams.toString()}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        if (res.total === 1) {
          resolve(res.rows[0].ProductId);
        } else {
          console.log(`没有找到sku为${sku}的ProductId`);
          resolve("");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 【普通账号】通过某个系列产品SKU查询所属产品的 ProductId
 * @param {*} sku
 * @returns
 * @description 获取 ProductId
 */
function getProductIdBySKU2(sku = "YJ8992703") {
  const token = getToken();
  const params = {
    onListing: 0,
    isMatchSku: "N",
    matchType: 1,
    productStatus: "",
    productRegisterType: "",
    AutoPublish: "",
    NoSavePlatform: "",
    HadSavePlatform: "",
    platformId: "",
    distributionProductStatus: "",
    isContainPlatform: "N",
    containPlatform: "",
    containPlatformType: "A",
    isNotContainPlatform: "N",
    notContainPlatform: "",
    categoryText: "",
    categoryId: "",
    platform: "",
    devUserId: "",
    IsSalesAccess: "",
    searchText: sku,
    type: "own",
    page: 1,
    rows: 20,
  };
  const formData = createFormData(params);
  const url = `${YjBaseUrl}/GetPublishSaleProductList?token=${token}`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.total === 1) {
          resolve(res.rows[0].dbProductId);
        } else {
          console.log(`没有找到sku为${sku}的ProductId`);
          resolve("");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 根据产品ID(productId)查询所有子产品的信息(成本价格、重量、SKU描述、状态、SKU、SKU序号、属性图)
 * @param {*} productId
 * @returns
 */
function getProductListByProductId(
  productId = "f5f072f4625d4cf3a06d62806317330a"
) {
  const SearchConfig = {
    Event: 20400,
    JsonValue: JSON.stringify({
      ProductId: productId,
    }),
    Token: getToken(),
  };
  const urlSearchParams = new URLSearchParams(SearchConfig);
  const url = `${YjBaseUrl}/getdata?${urlSearchParams.toString()}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const YjHost = "http://39.104.68.206:1688";
const YjRootPageUrl = `${YjHost}/default.html`;
const YjBaseUrl = `${YjHost}/api/cloudapi`;

/**
 * 包装重量（g）-快递费（美元）映射
 */
const PackageWeightShippingCostMapping = {
  10: 0.19,
  15: 0.28,
  20: 0.37,
  25: 0.47,
  30: 0.56,
  35: 0.65,
  40: 0.75,
  45: 0.84,
  50: 0.93,
  55: 1.03,
  60: 1.12,
  70: 1.28,
  80: 1.49,
  90: 1.68,
  100: 1.87,
  110: 2.05,
  120: 2.24,
  130: 2.43,
  150: 2.8,
  160: 2.99,
  200: 3.57,
  210: 3.75,
  220: 3.93,
  230: 4.11,
};

/**
 * 通过运费、包邮价格、折扣计算出最终价格！！
 * @param {*} parcelPrice 包邮价格
 * @param {*} fare 运费
 * @param {*} discount 折扣（小数，0.7就是70%）
 * @returns
 */
function computeTargetPrice(parcelPrice, fare, discount) {
  return ((parcelPrice - fare) / discount).toFixed(2);
}

/**
 * 计算最终包邮价格
 * @param {Object} params - 计算参数对象
 * @param {number} params.shippingCost - 快递费（单位：人民币或美元）
 * @param {number} params.purchasePrice - 进货价格（单位：人名币）
 * @param {number} params.expectedProfitMargin - 预期盈利比（小数形式，如0.2表示20%）
 * @param {number} params.transactionFee - 成交费（小数形式，如0.03表示3%）
 * @param {number} params.exchangeRate - 汇率（人民币兑换美元的比率）
 * @returns {number} 计算出的销售价格（单位：目标币种）
 */
function computeParcelPrice({
  shippingCost,
  purchasePrice,
  expectedProfitMargin,
  transactionFee,
  exchangeRate,
}) {
  return (
    (shippingCost + purchasePrice) /
    (1 - expectedProfitMargin - transactionFee) /
    exchangeRate
  ).toFixed(2);
}

/**
 * 计算快递费（人民币）
 * @param {*} weight 重量
 * @returns
 */
function computeShippingCostCNY(weight) {
  return weight * 0.125;
}

/**
 * 计算快递费（美元）
 * @param {*} weight 重量
 * @param {*} exchangeRate 汇率
 * @returns
 */
function computeShippingCostUSD(weight, exchangeRate) {
  return computeShippingCostCNY(weight) / exchangeRate;
}

/**
 * 获取页面上输入的包装重量并输出对应的快递费
 * @returns 
 */
function getCurrentPackageWeightShippingCost() {
  const value = $('th:contains("包装重量")').siblings("td").find(".textbox-value").attr("value")
  return PackageWeightShippingCostMapping[value];
}

/**
 * 计算半托管商品价格
 * @param {*} profitRatio - 盈利比 
 * @param {*} price - 成本
 * @param {*} exchangeRate - 汇率
 * @returns 
 * @description 公式 = (成本 + 1.1) / (1 - 盈利比 - 8%) / 汇率
 */
function formatFinalPrice (profitRatio, price, exchangeRate) {
  return ((Number(price) + 1.1) / (1 - profitRatio - 0.08) / exchangeRate).toFixed(2) 
}

/**
 * 通过th表头的文本获取列索引
 * @param {*} thSelect 
 * @param {*} text 
 * @returns 
 * @description 模糊搜索关键字并忽略大小写
 */
function getTableColumnIdxByHeadText(thSelect, text) {
  return $(`${thSelect}`).filter(function(i, el) {
      return $(el).text().trim().toLowerCase().indexOf(text.toLowerCase()) !== -1;
  }).first().index();
}

/**
 * 获取实际SKU值
 * @param {*} sku - 源SKU
 * @param {*} splitStr - 分隔符
 * @returns 
 * @description 默认分隔符为"/"，兼容 `YJ8992703/3` 这种写法的SKU。
 */
function getFinalSuk(sku, splitStr="/") {
  const splitStrIdx = sku.indexOf(splitStr);
  if (splitStrIdx === -1) {
    return sku
  }
  const finalSku = sku.substring(0, splitStrIdx); 
  return finalSku
}

(function () {
  "use strict";
  // 默认汇率
  const DEFAULT_EXCHANGE_RATE = 7;
  
  const APP_KEYWORD_BTY = "glk-smt-不包邮定价";
  const btyExchangeRateStorageKey = `${APP_KEYWORD_BTY}-exchangeRate`;

  const APP_KEYWORD_BTG = "glk-smt-半托管定价";
  const btgExchangeRateStorageKey = `${APP_KEYWORD_BTG}-exchangeRate`;

  // 默认半托管库存 
  const btgDefaultStock = 10;

  createAsyncTask(() => $('th:contains("包装重量")').length, async () => {

    addStyle(`
      #${APP_KEYWORD_BTY} input,
      #${APP_KEYWORD_BTG} input {
        width: 60px;
      }
      
      #${APP_KEYWORD_BTG} {
        margin-left: 10px;
      }
    `)

    let tableMAP = $("tb-list, .goodsTable");
    tableMAP.parent().prepend(`
      <div id="${APP_KEYWORD_BTY}">
        <label>汇率: <input type="number" name="exchange_rate" /></label>
        <label>盈利比: <input type="string" name="profit_margin" value="10%" /></label>
        <label>店铺折扣: <input type="string" name="store_discount" value="70%" /></label>
        <button class="primary submit">提交</button>
      </div>  
    `)

    // 初始化汇率
    initInputWithLocalStorage(`#${APP_KEYWORD_BTY} input[name='exchange_rate']`, btyExchangeRateStorageKey, DEFAULT_EXCHANGE_RATE)
    
    // 获取表格中 sku 列索引
    const skuColumnIndex = getTableColumnIdxByHeadText(".tb-list.goodsTable thead th", "sku")

    // 获取表格中所有行的 sku 
    const skuList = $('.tb-list.goodsTable tbody tr').map(function() {
      return $(this).find(`td:eq(${skuColumnIndex}) input`).val();
    }).get().map(i => ({
      sku: getFinalSuk(i),
      weight: undefined,
      price: undefined
    }))

    // 获取表格中 售价 列索引
    const priceColumnIndex = getTableColumnIdxByHeadText(".tb-list.goodsTable thead th", "售价")

    // 为所有sku产品补充售价和重量
    for (let i = 0; i < skuList.length; i++) {
      const item = skuList[i];
      // 已经获取过物流重量
      if (item.weight) {
        continue;
      }
      const productId = await getProductIdBySKU2(item.sku);
      if (!productId) {
        continue;
      }
      const productsDetail = await getProductListByProductId(productId)
      skuList.forEach(k => {
        const j = productsDetail.find(j => j.SkuValue === k.sku);
        if(j) {
          k.price = Number(j.Price);
          k.weight = Number(j.ShippingWeight);
        }
      }) 
    }
    console.log(`格式化之后 skuList`, skuList);

    $(`#${APP_KEYWORD_BTY} button.submit`).eq(0).on("click", () => {
      // 当前汇率
      const curExchangeRate = Number($(`#${APP_KEYWORD_BTY} input[name='exchange_rate']`).val());

      // 当前店铺折扣
      const curStoreDiscount = getDecimal($(`#${APP_KEYWORD_BTY} input[name='store_discount']`).val());

      // 当前预计盈利比
      const curProfitMargin = getDecimal($(`#${APP_KEYWORD_BTY} input[name='profit_margin']`).val());

      // 当前手动输入的包装重量对应的快递费
      const currentPackageWeightShippingCost = getCurrentPackageWeightShippingCost()
      console.log(`%c 【此次操作】
    包装重量对应快递费：${currentPackageWeightShippingCost}
    汇率：${curExchangeRate}
    店铺折扣：${curStoreDiscount}
    盈利比：${curProfitMargin}
        `, `color: hotpink; font-size: 15px; font-weight: bold;`, );

      skuList.forEach((i, idx) => {
        // 计算最终包邮价格
        const curParcePrice = computeParcelPrice({
          shippingCost: computeShippingCostCNY(i.weight),
          purchasePrice: i.price,
          expectedProfitMargin: curProfitMargin,
          transactionFee: 0.08,
          exchangeRate: curExchangeRate
        })
  
        // 最终销售价格
        let targetPrice;
  
        if (currentPackageWeightShippingCost !== undefined) {
          // 计算最终销售价格
          targetPrice = computeTargetPrice(curParcePrice, currentPackageWeightShippingCost, curStoreDiscount)
        } else {
          // 使用美元的快递费
          const shippingCost = computeShippingCostUSD(i.weight, curExchangeRate)
          // 计算最终销售价格
          targetPrice = computeTargetPrice(curParcePrice, shippingCost, curStoreDiscount)
        }
  
        // 填到表格内对应SKU的对应售价列
        $('.tb-list.goodsTable tbody tr').eq(idx).find(`td:eq(${priceColumnIndex}) input`).val(targetPrice)[0].__v_model.set(targetPrice)
  
        console.log(`不包邮定价 ^_^ sku: ${i.sku} ^_^ 重量: ${i.weight} ^_^ 进货价格: ${i.price} ^_^ 包邮价格: ${curParcePrice} ^_^ 最终售价: ${targetPrice}`);
      })
    });


    /** =========================================以下为半托管功能========================================= */
    const baseEle = $("#rootEle-cc-choice .pdtb5")
    baseEle.prepend(`
      <div id="${APP_KEYWORD_BTG}">
        <label>汇率: <input type="number" name="exchange_rate" /></label>
        <label>盈利比: <input type="string" name="profit_margin" value="34%" /></label>
        <button class="primary submit">提交</button>
      </div>
    `)
    // 初始化汇率
    initInputWithLocalStorage(`#${APP_KEYWORD_BTG} input[name='exchange_rate']`, btgExchangeRateStorageKey, DEFAULT_EXCHANGE_RATE);
    
    $(`#${APP_KEYWORD_BTG} button.submit`).eq(0).on("click", () => {
      if(!$("#rootEle-cc-choice .tb-list").length) {
        console.log(`未打开半托管表格，不需要提交。`);
        return
      }

      /** 半托管信息下第一个表格 重量 列索引 */
      const weightColumnIndex = getTableColumnIdxByHeadText("#rootEle-cc-choice .tb-list:eq(0) tbody tr:first th", "重量");

      /** 半托管信息下第二个表格 商品价格 列索引 */
      const priceColumnIndex = getTableColumnIdxByHeadText("#rootEle-cc-choice .tb-list:eq(1) tbody tr:first th", "商品价格(店铺币种)");

      /** 半托管信息下第二个表格 库存 列索引 */
      const stockColumnIndex = getTableColumnIdxByHeadText("#rootEle-cc-choice .tb-list:eq(1) tbody tr:first th", "库存");  
    
      // 当前盈利比
      const curProfitMargin = getDecimal($(`#${APP_KEYWORD_BTG} input[name='profit_margin']`).val());

      // 当前汇率
      const curExchangeRate = Number($(`#${APP_KEYWORD_BTG} input[name='exchange_rate']`).val());

      skuList.forEach((i, idx) => {
        // 第一个表格填上重量
        const w = (i.weight / 1000).toFixed(3)
        $('#rootEle-cc-choice .tb-list:eq(0) tbody tr').eq(idx + 1).find(`td:eq(${weightColumnIndex}) input`).val(w)[0].__v_model.set(w)

        // 计算最终半托管商品价格
        const curParcePrice = formatFinalPrice(curProfitMargin, i.price, curExchangeRate)
        // 第二个表格填上最终半托管商品价格
        $('#rootEle-cc-choice .tb-list:eq(1) tbody tr').eq(idx + 1).find(`td:eq(${priceColumnIndex}) input`).val(curParcePrice)[0].__v_model.set(curParcePrice)

        // 第二个表格填上默认库存
        $('#rootEle-cc-choice .tb-list:eq(1) tbody tr').eq(idx + 1).find(`td:eq(${stockColumnIndex}) input`).val(btgDefaultStock)[0].__v_model.set(btgDefaultStock)

        console.log(`半托管定价 ^_^ sku: ${i.sku} ^_^ 重量: ${i.weight} ^_^ 进货价格: ${i.price} ^_^ 最终售价: ${curParcePrice}`);
      })
    })
  })
})();
