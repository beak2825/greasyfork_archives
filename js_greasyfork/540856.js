// ==UserScript==
// @name         Yj办公自动化
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Yj办公自动化工具
// @author       glk
// @match        http://39.104.68.206:1688/*
// @match        https://erp.91miaoshou.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0ibGF5ZXIiPjx0ZXh0IGZpbGw9IiNlZWIyMTEiIGZvbnQtZmFtaWx5PSJTZXJpZiIgZm9udC1zaXplPSI2MDAuMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjM0IiB5PSI0NTYuMzEiPkc8L3RleHQ+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDUwZjI1IiBzdHJva2Utd2lkdGg9IjQwIiBkPSJNMTg4LjUgMTM3djIyNC4wNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwOTkyNSIgc3Ryb2tlLXdpZHRoPSIzMCIgZD0iTTIwOC41IDI1M2g2Ni42Ii8+PHBhdGggZD0iTTMwOC4xNCAxNjAuMDlMMjgyIDI1MS4zOGwyNyA3MS41MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2OWU4IiBzdHJva2Utd2lkdGg9IjMyIi8+PC9nPjwvc3ZnPg==
// @grant        none
// @license      Copyright glk
// @downloadURL https://update.greasyfork.org/scripts/540856/Yj%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/540856/Yj%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

/**
 * IndexDB 封装
 */
class SimpleIndexedDB {
  constructor(dbName = 'SimpleDB') {
    this.dbName = dbName;
    this.db = null;
  }

  // 初始化数据库
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      };
    });
  }

  // 保存数组
  async save(key, array) {
    await this.init();
    
    const transaction = this.db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    
    const data = {
      key: key,
      value: array,
      timestamp: formatDate('YYYY-MM-DD HH:mm:ss'),
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // 读取数组
  async load(key) {
    await this.init();
    
    const transaction = this.db.transaction(['data'], 'readonly');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除数据
  async remove(key) {
    await this.init();
    
    const transaction = this.db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * 格式化日期
 * @param {*} format
 * @returns
 */
function formatDate(format) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 格式化单个数字
  const pad = (num) => num.toString().padStart(2, "0");

  // 替换格式字符串中的年月日时分秒
  return format
    .replace(/YYYY/g, year)
    .replace(/MM/g, pad(month))
    .replace(/DD/g, pad(day))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds));
}

/**
 * 找出第一个数组中第二个数组没有的元素
 * @param {*} arr1 
 * @param {*} arr2 
 * @returns 
 */
function findMissing(arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item));
}

function createFormData(data) {
  const formData = new FormData();
  
  if (typeof data === 'string') {
    // 处理查询字符串
    const params = new URLSearchParams(data);
    for (const [key, value] of params) {
      formData.append(key, value);
    }
  } else if (typeof data === 'object' && data !== null) {
    // 处理对象
    Object.keys(data).forEach(key => {
      const value = data[key];
      // 处理不同类型的值
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // 数组：每个元素单独添加
          value.forEach(item => formData.append(key, item));
        } else if (value instanceof File || value instanceof Blob) {
          // 文件或Blob直接添加
          formData.append(key, value);
        } else {
          // 其他类型转为字符串
          formData.append(key, String(value));
        }
      } else {
        // null 或 undefined 转为空字符串
        formData.append(key, '');
      }
    });
  }
  
  return formData;
}

/**
 * 保留几位小数但不四舍五入
 * @param {*} num 
 * @returns 
 */
function truncateToTwoDecimals(num) {
  return Math.floor(num * 100) / 100;
}

/**
 * 复制JSON到剪贴板
 * @param {*} data - 要复制的数据
 * @returns {Promise<boolean>} - 返回是否成功
 */
async function copyJsonToClipboard(data) {
  try {
    // 转换为JSON字符串
    const jsonString = JSON.stringify(data);
    
    // 优先使用现代Clipboard API
    if (navigator.clipboard && (window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost')) {
      await navigator.clipboard.writeText(jsonString);
      return true;
    }
    
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}


/** =======================================================XMLHttpRequest */
// 保存原始的 XMLHttpRequest
const OriginalXMLHttpRequest = window.XMLHttpRequest;

// 拦截规则配置
let interceptRules = [];

// 检查URL是否匹配拦截规则
function findMatchingRule(url) {
  return interceptRules.find(rule => url.includes(rule.url));
}

// 重写 XMLHttpRequest
window.XMLHttpRequest = function() {
  const xhr = new OriginalXMLHttpRequest();
  let requestUrl = '';
  // 保存原始的 open 方法
  const originalOpen = xhr.open;
  xhr.open = function(method, url, async, user, password) {
    requestUrl = url;
    return originalOpen.call(this, method, url, async, user, password);
  };
  
  // 保存原始的 send 方法
  const originalSend = xhr.send;
  xhr.send = function(body) {
    // 查找匹配的拦截规则
    const matchingRule = findMatchingRule(requestUrl);
    
    if (!matchingRule) {
      // 没有匹配的规则，直接执行原始请求
      return originalSend.call(this, body);
    }
    
    // 保存原始的 onreadystatechange
    const originalOnReadyStateChange = xhr.onreadystatechange;
    
    xhr.onreadystatechange = async function() {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        try {
          // 解析原始响应
          const originalData = JSON.parse(xhr.responseText);
          
          // 使用回调函数处理响应数据
          const modifiedData = await matchingRule.responseCallback(originalData);
          
          // 重写响应属性
          Object.defineProperty(xhr, 'responseText', {
            writable: true,
            value: JSON.stringify(modifiedData)
          });
          
          Object.defineProperty(xhr, 'response', {
            writable: true,
            value: JSON.stringify(modifiedData)
          });
          
        } catch (error) {
          console.error('XHR拦截器处理失败:', error);
          // 出错时保持原始响应
        }
      }
      
      // 调用原始的 onreadystatechange
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.call(this);
      }
    };
    
    return originalSend.call(this, body);
  };
  
  return xhr;
};

// 继承原始 XMLHttpRequest 的静态属性
Object.setPrototypeOf(window.XMLHttpRequest, OriginalXMLHttpRequest);
window.XMLHttpRequest.prototype = OriginalXMLHttpRequest.prototype;

// 配置拦截规则的函数
function setInterceptRules(rules) {
  interceptRules = rules;
  console.log('XHR已设置拦截规则:', rules.map(r => r.url));
}

// 添加单个拦截规则
function addInterceptRule(url, responseCallback) {
  interceptRules.push({ url, responseCallback });
  console.log(`XHR已添加拦截规则: ${url}`);
}

// 清除所有拦截规则
function clearInterceptRules() {
  interceptRules = [];
  console.log('XHR已清除所有拦截规则');
}

// 恢复原始XMLHttpRequest
function restoreXHR() {
  window.XMLHttpRequest = OriginalXMLHttpRequest;
  console.log('已恢复原始XMLHttpRequest');
}

// 导出API
window.xhrInterceptor = {
  setRules: setInterceptRules,
  addRule: addInterceptRule,
  clearRules: clearInterceptRules,
  restore: restoreXHR
};
/** =======================================================XMLHttpRequest */

const globalLoading = (msg="加载中...", style) => {
  const Container_Id = "glk-global-loading-container";
  const prevLoading = document.getElementById(Container_Id);
  !!prevLoading && document.body.removeChild(prevLoading);
  const ele = document.createElement("div");
  ele.id = Container_Id;
  ele.innerHTML = `
    <div class="mask"></div>
    <div class="message">${msg}</div>
  `
  const styleEle = document.createElement("style");
  styleEle.innerHTML = `
    #${Container_Id} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      transition: opacity 0.3s;
    }
    #${Container_Id} .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.45);
    }
    #${Container_Id} .message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }

    ${style}
  `  
  document.head.appendChild(styleEle)
  document.body.append(ele);
  return {
    close: () => {
      document.body.removeChild(ele);
    },
    updateMsg: (msg) => {
      ele.querySelector(".message").innerHTML = msg
    }
  }
}

const showTip = (message, duration = 2, pos) => {
  return new Promise((resolve) => {
    let show_tip = document.getElementById("show_tip");
    if (show_tip) {
      document.body.removeChild(show_tip);
    }

    if (window.show_tip_timer) {
      clearTimeout(window.show_tip_timer);
    }

    let tipDom = document.createElement("div");
    document.body.appendChild(tipDom);
    tipDom.id = "show_tip";
    Object.assign(tipDom.style, {
      position: "fixed",
      maxWidth: "80vw",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      lineHeight: "20px",
      zIndex: 9999,
      color: "#fff",
      backgroundColor: "#303133",
      borderRadius: " 4px",
      padding: "10px",
      textAlign: "center",
      opacity: 0.9,
      fontSize: "1em",
    });
    if (pos) {
      const { left, top, offsetX = 0, offsetY = 0 } = pos;
      Object.assign(tipDom.style, {
        top: top + offsetY + "px",
        left: left + offsetX + "px",
        transform: "none",
      });
    }
    tipDom.innerText = message;
    window.show_tip_timer = setTimeout(() => {
      let show_tip = document.getElementById("show_tip");
      if (show_tip) {
        document.body.removeChild(show_tip);
        resolve();
      }
    }, duration * 1000 - 100);
  });
};

const addStyleStr = (styStr = "") => {
  let _style = document.createElement("style");
  _style.innerHTML = styStr;
  document.getElementsByTagName("head")[0].appendChild(_style);
  return _style;
};

 function createAsyncTask (
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
  })
};

/** ==========================================以上全为工具========================== */
/** ==========================================以上全为工具========================== */
/** ==========================================以上全为工具========================== */

/**
 * 获取token
 * @returns 
 */
function getToken () {
  return window.Token || window.parent.Token
}

/**
 * 根据ItemId查询商品列表
 * @returns 
 */
function getGoodsListData (ItemId="1005008682109550") {
  const SearchConfig = {
    Event: 94520,
    JsonValue: JSON.stringify({ ItemId }),
    Token: getToken(),
  };
  const urlSearchParams = new URLSearchParams(SearchConfig);
  const url = `${YjBaseUrl}/getdata?${urlSearchParams.toString()}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 有的情况下 originalSku是""
        data.goodsList = (data.goodsList || []).map(i => ({ ...i, originalSku: i.originalSku || i.sku }));
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 通过某个系列产品SKU查询所属产品的 ProductId
 * @param {*} sku 
 * @returns 
 * @description 获取 ProductId
 */
function getProductIdBySKU (sku="YJ8992703") {
  const SearchConfig = {
    Event: 20165,
    JsonValue: JSON.stringify({ 
      keyword: sku,
      IsSale: ""
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
          resolve("")
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 通过某个系列产品SKU查询所属产品的 ProductId
 * @param {*} sku 
 * @returns 
 * @description 获取 ProductId
 */
function getProductIdBySKU2 (sku="YJ8992703") {
  const token = getToken();
  const params = {
    onListing: 0,
    isMatchSku: 'N',
    matchType: 1,
    productStatus: '',
    productRegisterType: '',
    AutoPublish: '',
    NoSavePlatform: '',
    HadSavePlatform: '',
    platformId: '',
    distributionProductStatus: '',
    isContainPlatform: 'N',
    containPlatform: '',
    containPlatformType: 'A',
    isNotContainPlatform: 'N',
    notContainPlatform: '',
    categoryText: '',
    categoryId: '',
    platform: '',
    devUserId: '',
    IsSalesAccess: '',
    searchText: sku,
    type: 'own',
    page: 1,
    rows: 20
  };
  const formData = createFormData(params)
  const url = `${YjBaseUrl}/GetPublishSaleProductList?token=${token}`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.total === 1) {
          resolve(res.rows[0].dbProductId);
        } else {
          console.log(`没有找到sku为${sku}的ProductId`);
          resolve("")
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
function getProductListByProductId (productId="f5f072f4625d4cf3a06d62806317330a") {
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

/**
 * 获取妙手采集箱所有产品的基本信息
 * @param {*} pageNo 
 * @param {*} pageSize 
 * @returns 
 * @description 这里主要是获取到 platformItemId 和 collectBoxDetailId
 */
function getCollectBoxDetailList (pageNo=1, pageSize=500) {
  const url = `${MSBaseUrl}/aliexpress_fc/move/collect_box/searchCollectBoxDetail`;
  const formData = new FormData();
  formData.append("pageNo", pageNo);
  formData.append("pageSize", pageSize);
  
  const curFetchLinkStatus = document.querySelector(".fetch_link_status")
  // notPublished-未发布状态； published-已发布状态； ""-全部
  formData.append("status", curFetchLinkStatus ? curFetchLinkStatus.value : ""); 

  // 其他参数
  formData.append("sortField", "");
  formData.append("sortType", "");
  formData.append("source", "");
  formData.append("authShopId", "");
  formData.append("minPrice", "");
  formData.append("maxPrice", "");
  formData.append("titleKeyword", "");
  formData.append("sourceItemIdKeyword", "");
  formData.append("remarkKeyword", "");
  formData.append("ownerAccountIds", "");
  formData.append("groupIds", "");
  formData.append("createStartTime", "");
  formData.append("createEndTime", "");
  formData.append("itemNumKeyword", "");
  formData.append("siteCidRange", "");

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 根据 detailId 获取妙手采集箱产品的详细信息
 * @param {*} detailId 
 * @returns 
 * @description 再配合数据拦截
 */
function getSiteCollectItemInfoByDetailId (detailId="1786665079") {
  const url = `${MSBaseUrl}/aliexpress_fc/move/collect_box/getSiteCollectItemInfo`;
  const formData = new FormData();
  formData.append("detailId", detailId);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      reject(error);
    })
  })
}

/**
 * 保存一条aliexpress完整数据
 * @param {*} ItemId 
 * @description 里面有该产品链接下所有款式（包括最低价）的SKU、库存、重量、成本价格
 */
async function saveAliexpressData (ItemId) {
  const data = await getGoodsListData(ItemId)
  const goodsList = data.goodsList;
  for (let i = 0; i < goodsList.length; i++) {
    const item = goodsList[i];
    // 已经获取过物流重量
    if (item.ShippingWeight) {
      continue;
    }
    const productId = await getProductIdBySKU2(item.originalSku)
    if (!productId) {
      if (!window.SaveErrorData[ItemId]) {
        window.SaveErrorData[ItemId] = []
      }
      window.SaveErrorData[ItemId].push(item.originalSku)
      continue;
    }
    const productsDetail = await getProductListByProductId(productId)
    goodsList.forEach(k => {
      // 删除无用的数据
      delete k.configurationData

      const j = productsDetail.find(j => j.SkuValue === k.originalSku);
      if(j) {
        k.Price = j.Price;
        k.ShippingWeight = j.ShippingWeight;
      }
    }) 
  }
  window.yjAliexpressData[ItemId] = goodsList;
  console.log(`%c ${ItemId} goodsList->`, `color: green; font-size: 12px; font-weight: bold;`, goodsList);
}

/**
 * 获取妙手绑定的所有店铺id信息
 * @returns 
 */
function getMsRsyncWarehouse () {
  const url = `${MSBaseUrl}/aliexpress_fc/move/collect_box/rsyncWarehouse`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      "method": "POST",
    })
    .then((response) => response.json())
    .then((data) => {
      resolve(data.successShopIds);
    })
    .catch((error) => {
      reject(error);
    })
  })
}

/**
 * 获取妙手绑定的所有店铺库存信息
 * @returns 
 */
function getMsShopWarehouseInfoList () {
  const url = `${MSBaseUrl}/aliexpress_fc/move/collect_box/getShopWarehouseInfoList`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      "method": "POST",
    })
    .then((response) => response.json())
    .then((data) => {
      resolve(data.shopWarehouseInfoList);
    })
    .catch((error) => {
      reject(error);
    })
  })
}

/**
 * 创建妙手页面UI
 */
function createMsPageUi () {
  addStyleStr(`
    .profit_ratio_input {
      border: none;
      font-size: 10px;
      text-align: center;
    }

    .fetch_link_status {
      font-size: 10px;
    }
  `)
  let copyEle = document.createElement("div")
  copyEle.className  = "side-tool-item" // 原页面的某个样式
  copyEle.innerText = "✌️"
  copyEle.onclick = async () => {
    const db = new SimpleIndexedDB(IndexDbName);
    const data = await db.load(ExpressDataIndexDbKey);
    const localPlatformItemIds = Object.keys(data || {})
    getCollectBoxDetailList().then(async res => {
      const platformItemIds = res.detailList.map(i => i.platformItemId)
      const finalPlatformItemIds = findMissing(platformItemIds, localPlatformItemIds)
      if (!finalPlatformItemIds.length) {
        showTip("没有需要去OA采集的数据，可直接编辑😂", 3)
      } else {
        await copyJsonToClipboard({
          resource: "msPage",
          msPlatformItemIds: finalPlatformItemIds
        })
        showTip("复制成功，去OA吧~")
      }
    })
  }

  let profitRatioele = document.createElement("input")
  profitRatioele.setAttribute("placeholder", "盈利比")
  profitRatioele.setAttribute("type", "number")
  profitRatioele.setAttribute("step", "0.01")
  profitRatioele.className = "profit_ratio_input side-tool-item";
  profitRatioele.value = window.localStorage.getItem("profitRatio")
  profitRatioele.onchange = () => {
    const profitRatio = profitRatioele.value
    window.localStorage.setItem("profitRatio", profitRatio)
  }

  // 可选择此次请求的链接状态
  let statusSelect = document.createElement("select")
  statusSelect.className = "fetch_link_status side-tool-item";
  statusSelect.innerHTML = `
    <option value="notPublished">未发布</option>
    <option value="published">已发布</option>
    <option value="">全部</option>
  `
  const fetchLinkStatusKey = `${window.APP_KEYWORD}-fetch-link-status`
  const savedValue = window.localStorage.getItem(fetchLinkStatusKey)
  if (savedValue !== null) {
    statusSelect.value = savedValue;
  } else {
    statusSelect.value = "notPublished";
  }
  statusSelect.onchange = () => {
    window.localStorage.setItem(fetchLinkStatusKey, statusSelect.value)
  }
  createAsyncTask(() => !!document.querySelector(".basic-layout-tools"), async () => {
    document.querySelector(".basic-layout-tools").appendChild(copyEle)
    document.querySelector(".basic-layout-tools").appendChild(profitRatioele)
    document.querySelector(".basic-layout-tools").appendChild(statusSelect)
  })
}

/**
 * 创建叶嘉页面UI
 */
function createYjPageUi () {
  let ele = document.createElement("div")
  Object.assign(ele.style, {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    color: 'red',
    background: '#0000003d',
    borderRadius: '5px',
    padding: '3px'
  })
  ele.innerText = "✌️"
  document.body.appendChild(ele)
  ele.onclick = () => {
    if(!window.yjAliexpressData) {
      return
    }
    copyJsonToClipboard({
      resource: "yjPage",
      aliexpressData: window.yjAliexpressData
    }).then(() => {
      showTip("复制成功，去妙手吧~")
    })
  }
}

/**
 * 计算最终价格
 * @param {*} price 
 * @returns 
 */
function formatFinalPrice (price) {
  const profitRatio = Number(localStorage.getItem("profitRatio"))
  return ((Number(price) + 1.1) / (1 - 0.08 - profitRatio)).toFixed(2)
}

const YjHost = "http://39.104.68.206:1688";
const YjRootPageUrl = `${YjHost}/default.html`;
const YjBaseUrl = `${YjHost}/api/cloudapi`;

const MsHost = "https://erp.91miaoshou.com";
const MSBaseUrl = `${MsHost}/api/platform`;

const ExpressDataIndexDbKey = "Aliexpress_Data";
const ExpressDataSKUIndexDbKey = "Aliexpress_Data_SKU";
const IndexDbName = "MsErp_App";

(function() {
  'use strict';
  window.APP_KEYWORD = "glk-妙手自动化工具"
  const isYjRootPage = document.URL.startsWith(YjRootPageUrl);
  const isMsPage = document.URL.startsWith(MsHost);
  window.yjAliexpressData = {};
  window.msAliexpressData = {};
  window.msExpressSKUData = [];

  // 检测粘贴事件
  document.addEventListener("paste", async function(event) {
    const data = (event.clipboardData || window.clipboardData).getData("text");
    try {
      const jsonData = JSON.parse(data);
      console.log("剪贴板数据", jsonData)
      if (jsonData.resource === "msPage") {
        const loading = globalLoading("数据采集中...", `
          #glk-global-loading-container {
            height: 20px;
            bottom: 0;
            top: revert;
            pointer-events: none;
          }  
        `)
        window.SaveErrorData = {};
        const { msPlatformItemIds } = jsonData;
        for (let i = 0; i < msPlatformItemIds.length; i++) {
          console.log(`开始执行 ${msPlatformItemIds[i]} 的数据`);
          loading.updateMsg(`数据采集中... ${i + 1}/${msPlatformItemIds.length}`)
          await saveAliexpressData(msPlatformItemIds[i])
        }
        
        // Promise.all 方式，但服务器不支持！！！
        // const tasks = msPlatformItemIds.map((id, index) => {
        //   console.log(`开始执行 ${id} 的数据`);
        //   loading.updateMsg(`数据采集中... ${index + 1}/${msPlatformItemIds.length}`);
        //   return saveAliexpressData(id);
        // });
        // await Promise.all(tasks);

        loading.close();
        await showTip("数据采集成功，点击✌️复制数据~")
        const saveErrorDataLength = Object.keys(window.SaveErrorData).length
        if (saveErrorDataLength) {
          await showTip(`有${saveErrorDataLength}条产品下部分SKU采集失败，可在控制台查看~`, 3)
          console.log(`%c 部分SKU采集失败数据：`, `color: #ff2f2f; font-size: 15px; font-weight: bold;`, window.SaveErrorData);
        }
        console.log(`%c 数据采集任务完成！共${msPlatformItemIds.length}个产品数据，有异常情况${saveErrorDataLength}个！`, `color: hotpink; font-size: 15px; font-weight: bold;`, window.aliexpressData);
      }

      if (jsonData.resource === "yjPage") {
        showTip("正在保存😁")
        window.msAliexpressData = jsonData.aliexpressData;
        const db = new SimpleIndexedDB(IndexDbName);
        const data1 = await db.load(ExpressDataIndexDbKey) || {};

        // 追加到本地 
        Object.keys(jsonData.aliexpressData).forEach(i => {
          data1[i] = jsonData.aliexpressData[i];
        }) 
        // 保存key为商品链接ID，值为该链接ID下的所有产品信息的数据
        await db.save(ExpressDataIndexDbKey, data1);

        // 加载旧的本地数据
        const data2 = await db.load(ExpressDataSKUIndexDbKey) || [];
        // 扁平化最新获取的数据
        let arr = [];
        Object.keys(data1).forEach(i => arr.push(...data1[i]))
        // 先把 data2 变成 map 结构，便于查找和替换
        const map = new Map(data2.map(item => [item.originalSku, item]));
        // 用 arr 替换或添加内容
        for (const item of arr) {
          map.set(item.originalSku, { ...item });
        }
        // 把 map 转回数组
        const updatedArr = Array.from(map.values());
        // 再更新到本地
        await db.save(ExpressDataSKUIndexDbKey, updatedArr);

        showTip("完事了🤣")
      }
    } catch (error) {
      console.log(`%c 采集出错`, `color: red; font-size: 20px; font-weight: bold;`, error);
    }
  })
  
  if (isYjRootPage) {
    console.log(`%c 叶嘉平台`, `color: cyan; font-size: 20px; font-weight: bold;`, );
    createYjPageUi();
  }

  if (isMsPage) {
    console.log(`%c 妙手平台`, `color: cyan; font-size: 20px; font-weight: bold;`, );

    // 提前准备好数据，因为对拦截数据格式化的函数是异步的话虽然看起来能将数据格式化，
    // 但是XMLHttpRequest 的响应处理是同步的，一旦 readyState 变为 4，响应就被"冻结"了，导致页面数据没有被更改。
    const db = new SimpleIndexedDB(IndexDbName);
    db.load(ExpressDataIndexDbKey).then(res => {
      window.msAliexpressData = res || {}
    })
    db.load(ExpressDataSKUIndexDbKey).then(res => {
      window.msExpressSKUData = res || []
    })

    createMsPageUi();

    getMsShopWarehouseInfoList().then(data => {
      // 为库存数据格式化提供基础数据（会列出所有绑定的店铺数据）
      window.warehouseBaseInfoList = data.map(i => {
        const firstWarehouse = i.warehouseList[0]
        return {
          shopId: i.shopId,
          warehouseCode: firstWarehouse.warehouseCode,
          warehouseName: firstWarehouse.warehouseName
        }
      })
    })

    window.xhrInterceptor.addRule("/collect_box/getSiteCollectItemInfo", (res) => {
      const { siteCollectItemInfo: { skuMap, sourceItemMetaInfo, skuPropertyList } } = res;

      // 通过此数组找到对应sku
      const attrValueList = skuPropertyList[0].attrValueList;

      // 此次请求的 sourceItemId
      const curSourceItemId = sourceItemMetaInfo.sourceItemId;

      // 已经编辑并保存过一次的情况直接跳过处理
      const firstItem = skuMap[Object.keys(skuMap)[0]]
      if (firstItem.packageLength && firstItem.packageWidth && firstItem.packageHeight) {
        showTip(`${curSourceItemId} 已经被修改保存过了。此次操作将会跳过！`, 3)
        console.log(`%c ${curSourceItemId} skuMap 已经保存过不需要修改。`, `color: blue; font-size: 10px; font-weight: bold;`, firstItem);
        return res
      } else {
        console.log(`%c ${curSourceItemId} skuMap 还得继续`, `color: blue; font-size: 10px; font-weight: bold;`, window.msAliexpressData);
      }

      Object.keys(skuMap).forEach(i => {
        // 当前处理的SKU对象
        const curItem = skuMap[i];

        const targetSrcSkuKey = curItem.srcSkuKey.slice(1, -1); // 去除首位的 ;
        const skuKey = i.slice(1, -1);
        const curSkuAttrValueId = skuKey.split(":")[1]

        // 找到当前处理的SKU对应表格的哪一行
        const curSkuRowIdx = attrValueList.findIndex(j => j.attrValueId === curSkuAttrValueId);

        // 当前对应的YJ的数据
        const target = window.msAliexpressData[curSourceItemId].find(j => j.aliexpressId === targetSrcSkuKey);
        if (target) {
          // 长宽高
          curItem.packageLength = "20";
          curItem.packageWidth = "20";
          curItem.packageHeight = "10";

          // SKU
          curItem.itemNum = target.originalSku;

          // 成本价格 TODO 根据公式来 =(成本+1.1)/(1-盈利比-8%)
          curItem.price = formatFinalPrice(target.Price);
          console.log("原价 最终价",target.Price, curItem.price)

          // 重量
          curItem.weight = (target.ShippingWeight / 1000).toFixed(3);
          console.log(`target`, target, target.quantity);

          // 设置库存方法1
          curItem.warehouseList = (window.warehouseBaseInfoList || []).map(i => ({
            ...i,
            sellableQuantity: target.quantity
          }))

          // ========================== 设置库存方法2(还有些对应关系混乱问题，需要测试) start
          // createAsyncTask(() => {
          //   const kucunTableColumnIdx = Array.from(document.querySelectorAll(".sku-list-container .jx-pro-virtual-table__header .jx-pro-virtual-table__header-cell")).findIndex(i => i.innerText.includes("库存"))
          //   const tableRows = document.querySelectorAll(".sku-list-container .vue-recycle-scroller__item-view")
          //   if (tableRows.length) {
          //     const hasInput = tableRows[0].getElementsByClassName("jx-pro-virtual-table__row-cell")[kucunTableColumnIdx].getElementsByClassName("el-input__inner").length
          //     if (hasInput) {
          //       return {
          //         kucunTableColumnIdx,
          //         tableRows
          //       }
          //     }
          //   }
          // }, async ({ kucunTableColumnIdx, tableRows }) => {
          //   // 当前需要处理的行
          //   const curTableRow = tableRows[curSkuRowIdx]
          //   console.log(`${curSkuRowIdx}行DOM`, curTableRow);
          //   // 当前行上库存单元格
          //   const kucunCell = curTableRow.getElementsByClassName("jx-pro-virtual-table__row-cell")[kucunTableColumnIdx]

          //   // 库存单元格里面所有的input
          //   const curRowKuncunInputs = kucunCell.getElementsByClassName("el-input__inner")

          //   // 设置为同一库存值
          //   for(let j of curRowKuncunInputs) {
          //     j.value = target.quantity;
          //   }
          // })
          // ========================== 设置库存方法2 end

        }
      })
      return res
    })

    // 设置在线产品SKU对应的库存
    window.xhrInterceptor.addRule("/aliexpress_fc/item/item/getItemDetail", (res) => {
      const { itemDetail: { skuMap } } = res;
      Object.keys(skuMap).forEach(i => {
        const item = skuMap[i];
        const find = window.msExpressSKUData.find(j => j.originalSku === item.itemNum);
        if (find) {
          item.warehouseList.forEach(k => {
            console.log(`%c sku: ${item.itemNum},将库存为:${k.sellableQuantity}同步为:${find.quantity}`, `color: hotpink; font-size: 20px; font-weight: bold;`, find.quantity);
            k.sellableQuantity = find.quantity
          })
        }
      })
      return res
    })

  }
})();