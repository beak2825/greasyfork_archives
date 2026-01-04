// ==UserScript==
// @name         待出库自动备注虚拟手机号
// @namespace    https://porder.shop.jd.com/
// @version      3.4
// @description  对于京东手机号脱敏的解决方式之一 - 性能优化版
// @author       YOU
// @match        *
// @match        https://shop.jd.com/jdm/trade/orders/order-list?tabType=waitOut
// @icon         https://www.jd.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/508394/1447419/crypto.js
// @require      https://update.greasyfork.org/scripts/448906/1077566/htmp.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441758/%E5%BE%85%E5%87%BA%E5%BA%93%E8%87%AA%E5%8A%A8%E5%A4%87%E6%B3%A8%E8%99%9A%E6%8B%9F%E6%89%8B%E6%9C%BA%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441758/%E5%BE%85%E5%87%BA%E5%BA%93%E8%87%AA%E5%8A%A8%E5%A4%87%E6%B3%A8%E8%99%9A%E6%8B%9F%E6%89%8B%E6%9C%BA%E5%8F%B7.meta.js
// ==/UserScript==

// 全局配置
const CONFIG = {
    BATCH_SIZE: 20,           // 批量处理订单数量
    RETRY_TIMES: 3,           // API调用重试次数
    RETRY_DELAY: 1000,        // 重试延迟(ms)
    API_DELAY: 500,           // API调用间隔(ms)
    AUTO_REFRESH: 60000,      // 自动刷新间隔(ms)
    MAX_CONCURRENT: 5         // 最大并发请求数
};

// 正则表达式
const REGEX = {
    真实手机号: /真[[0-9]{12}]/g,
    虚拟手机号: /虚[[0-9]{12}-[0-9]{4}]/g
};

// 状态管理
const State = {
    running: false,
    订单总量: 0,
    处理计数: 0,
    失败计数: 0,
    备注真实号码: false,
    备注虚拟号码: false,
    循环执行备注手机号: null
};

var AccountInfo;

// API请求限流器
class RateLimiter {
    constructor(maxConcurrent) {
        this.queue = [];
        this.running = 0;
        this.maxConcurrent = maxConcurrent;
    }

    async add(fn) {
        if (this.running >= this.maxConcurrent) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        this.running++;
        try {
            return await fn();
        } finally {
            this.running--;
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                next();
            }
        }
    }
}

const rateLimiter = new RateLimiter(CONFIG.MAX_CONCURRENT);

// 工具函数
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const retry = async (fn, times = CONFIG.RETRY_TIMES) => {
    for (let i = 0; i < times; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === times - 1) throw err;
            await sleep(CONFIG.RETRY_DELAY);
        }
    }
};

// UI更新函数
function updateUI() {
    const button = document.getElementById("yijiansjh");
    if (!button) return;
    
    button.innerHTML = State.running ? 
        `停止备注 (${State.处理计数}/${State.订单总量}, 失败: ${State.失败计数})` : 
        "开始自动备注客户手机号";
}

// 批量处理订单
async function processBatch(orders) {
    // 首先批量获取所有订单的备注信息
    const orderIds = orders.map(order => order.orderId);
    const remarkInfos = await retry(() => 批量获取订单备注(orderIds));
    
    // 将备注信息转换为Map以便快速查找
    const remarkMap = new Map(
        remarkInfos.map(info => [info.orderId, info.remark || ""])
    );

    const tasks = orders.map(order => {
        return rateLimiter.add(async () => {
            try {
                await processOrder(order, remarkMap.get(order.orderId));
                State.处理计数++;
            } catch (err) {
                console.error(`处理订单失败 ${order.orderId}:`, err);
                State.失败计数++;
            } finally {
                updateUI();
            }
        });
    });

    await Promise.all(tasks);
}

// 处理单个订单
async function processOrder(order, currentRemark = "") {
    const { orderId, userPin } = order;
    let newRemark = currentRemark;
    let needsUpdate = false;

    // 检查虚拟号
    if (State.备注虚拟号码) {
        const virtualPhone = await retry(() => 获取虚拟手机号(userPin, orderId));
        if (virtualPhone) {
            const virtualTag = `虚[${virtualPhone}]`;
            // 检查是否已经包含这个虚拟号
            if (!currentRemark.includes(virtualTag)) {
                newRemark += ` ${virtualTag}`;
                needsUpdate = true;
            }
        }
    }

    // 检查真实号
    if (State.备注真实号码) {
        const realPhone = await retry(() => 获取真实手机号(userPin, orderId));
        if (realPhone) {
            const realTag = `真[${realPhone}]`;
            // 检查是否已经包含这个真实号
            if (!currentRemark.includes(realTag)) {
                newRemark += ` ${realTag}`;
                needsUpdate = true;
            }
        }
    }

    if (needsUpdate) {
        // 清理可能的多余空格
        newRemark = newRemark.trim().replace(/\s+/g, ' ');
        await retry(() => 备注手机号(orderId, newRemark));
    }
}

// 批量获取订单备注信息
async function 批量获取订单备注(orderIds) {
    const url = "https://sff.jd.com/api?v=1.0&appId=COCX0HBWR4BA7RDVDBIQ&api=dsm.order.manage.orderlist.getVenderRemarkList";
    const bodyData = {
        orderIds: orderIds,
        accessContext: { source: "web" }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            "dsm-platform": "pc"
        },
        body: JSON.stringify(bodyData),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('批量获取备注信息失败');
    }

    const data = await response.json();
    return data.data || [];
}

// 主函数优化
async function main() {
    if (!State.running) return;
    
    try {
        let page = 1;
        const pageSize = CONFIG.BATCH_SIZE;
        State.处理计数 = 0;
        State.失败计数 = 0;
        
        do {
            const response = await retry(() => 获取订单列表(page, pageSize));
            if (!response?.data?.results) break;
            
            const orders = response.data.results;
            State.订单总量 = response.data.total;
            
            await processBatch(orders);
            await sleep(CONFIG.API_DELAY);
            
            page++;
        } while (page <= Math.ceil(State.订单总量 / pageSize) && State.running);
        
    } catch (err) {
        console.error('执行失败:', err);
        State.running = false;
    } finally {
        updateUI();
    }
}

// 初始化函数
function init() {
    // 添加UI元素
    addbut();
    
    // 定时检查页面URL
    setInterval(() => {
        const matchesUrl = window.location.href.includes('waitOut');
        if (matchesUrl && !document.getElementById("yijiansjh")) {
            addbut();
        }
    }, 1000);
}

// 启动脚本
init();

function addbut() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .batch-operate-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }

        .custom-container {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-left: 8px;
            padding-left: 8px;
            position: relative;
        }

        .custom-container::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 16px;
            width: 1px;
            background-color: #dcdee2;
        }

        .custom-button {
            background: #fff;
            border: 1px solid #3768fa;
            color: #3768fa;
            border-radius: 4px;
            height: 32px;
            padding: 0 15px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 200px;
        }

        .custom-button:hover {
            background: #3768fa;
            color: #fff;
        }

        .custom-button.running {
            background: #ff4d4f;
            border-color: #ff4d4f;
            color: #fff;
        }

        .custom-checkbox-wrapper {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }

        .custom-checkbox {
            appearance: none;
            width: 16px;
            height: 16px;
            border: 1px solid #dcdee2;
            border-radius: 2px;
            margin-right: 6px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
        }

        .custom-checkbox:checked {
            background: #3768fa;
            border-color: #3768fa;
        }

        .custom-checkbox:checked::after {
            content: '';
            position: absolute;
            left: 4px;
            top: 1px;
            width: 6px;
            height: 9px;
            border: 2px solid #fff;
            border-top: 0;
            border-left: 0;
            transform: rotate(45deg);
        }

        .custom-label {
            color: #515a6e;
            font-size: 14px;
            user-select: none;
        }

        .progress-info {
            font-size: 12px;
            color: #666;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);

    // 创建容器
    const container = document.createElement("div");
    container.className = "custom-container";

    // 创建按钮
    const button = document.createElement("button");
    button.id = "yijiansjh";
    button.className = "custom-button";
    button.innerHTML = "开始自动备注客户手机号";

    // 创建真实号选择框
    const realNumberWrapper = document.createElement("label");
    realNumberWrapper.className = "custom-checkbox-wrapper";

    const realNumberCheckbox = document.createElement("input");
    realNumberCheckbox.type = "checkbox";
    realNumberCheckbox.id = "realNumber";
    realNumberCheckbox.className = "custom-checkbox";

    const realNumberLabel = document.createElement("span");
    realNumberLabel.className = "custom-label";
    realNumberLabel.innerText = "备注真实号";

    // 创建虚拟号选择框
    const virtualNumberWrapper = document.createElement("label");
    virtualNumberWrapper.className = "custom-checkbox-wrapper";

    const virtualNumberCheckbox = document.createElement("input");
    virtualNumberCheckbox.type = "checkbox";
    virtualNumberCheckbox.id = "virtualNumber";
    virtualNumberCheckbox.className = "custom-checkbox";

    const virtualNumberLabel = document.createElement("span");
    virtualNumberLabel.className = "custom-label";
    virtualNumberLabel.innerText = "备注虚拟号";

    // 创建进度信息
    const progressInfo = document.createElement("span");
    progressInfo.className = "progress-info";
    progressInfo.id = "progressInfo";

    // 组装DOM
    realNumberWrapper.appendChild(realNumberCheckbox);
    realNumberWrapper.appendChild(realNumberLabel);
    virtualNumberWrapper.appendChild(virtualNumberCheckbox);
    virtualNumberWrapper.appendChild(virtualNumberLabel);

    container.appendChild(button);
    container.appendChild(realNumberWrapper);
    container.appendChild(virtualNumberWrapper);
    container.appendChild(progressInfo);

    // 添加到页面
    const targetElement = document.getElementsByClassName("batch-operate-buttons")[0];
    if (targetElement) {
        targetElement.appendChild(container);
    }

    // 添加按钮点击事件
    button.onclick = async function () {
        if (!State.running) {
            if (!realNumberCheckbox.checked && !virtualNumberCheckbox.checked) {
                alert('请至少选择一种备注方式（真实号或虚拟号）');
                return;
            }
            
            State.running = true;
            State.备注真实号码 = realNumberCheckbox.checked;
            State.备注虚拟号码 = virtualNumberCheckbox.checked;
            button.classList.add('running');
            
            // 禁用复选框
            realNumberCheckbox.disabled = true;
            virtualNumberCheckbox.disabled = true;
            
            AccountInfo = await GetAccountInfo();//获取店铺信息

            main();
            State.循环执行备注手机号 = setInterval(main, CONFIG.AUTO_REFRESH);
        } else {
            State.running = false;
            button.classList.remove('running');
            
            // 启用复选框
            realNumberCheckbox.disabled = false;
            virtualNumberCheckbox.disabled = false;
            
            if (State.循环执行备注手机号) {
                clearInterval(State.循环执行备注手机号);
                State.循环执行备注手机号 = null;
            }
        }
        updateUI();
    };
}

// API函数
async function 获取订单列表(页码, 获取数量) {
    const url = "/api?v=1.0&appId=COCX0HBWR4BA7RDVDBIQ&api=dsm.order.manage.orderlist.queryOrderPage";
    const obj = {
        "request": {
            "source": "2000",
            "versionNo": 20240830,
            "data": {
                "consumerName": null,
                "consumerMobilePhone": null,
                "logiNo": null,
                "venderRemarkLevels": [],
                "orderCreateDateRange": getDateRange(),
                "remarkFlag": null,
                "userPin": null,
                "itemNum": null,
                "storeId": null,
                "orderTags": [],
                "orderStatusTypes": [
                    "2"
                ],
                "idSopShipmentType": null,
                "paymentType": null,
                "orderCompleteDateRange": null,
                "orderSalType": null,
                "orderBusinessType": null,
                "ouId": null,
                "purchaseOrderNo": null,
                "firstOrderId": null,
                "tradeVendorId": null,
                "supplierId": null,
                "orderId": null,
                "orderIds": null,
                "orderTab": "waitOut",
                "sortMode": "orderDateAsc",
                "current": 页码,
                "pageSize": 获取数量,
                "monthsFlag": "within6months"
            }
        },
        "accessContext": {
            "source": "web"
        }
    };

    const baseUrl = "https://sff.jd.com";
    const signAppId = "0248a";
    const colorParamSign = buildColorParamSign(url, obj);

    const response = await fetch(baseUrl + url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'dsm-platform': 'pc',
            "h5st": await get_h5st(colorParamSign, signAppId)
        },
        body: JSON.stringify(obj),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('获取订单列表失败');
    }

    return await response.json();
}

async function GetAccountInfo(){
      const url = "/api?v=1.0&appId=ZSCUMIUH2ZNF8Z2PVU1J&api=dsm.shop.pageframe.navigation.accountFacade.findAccountInfo";
      const obj = {
        "body": "44136FA355B3678A1146AD16F7E8649E94FB4FC21FE77E8310C060F61CAAFF8A",
        "appId": "ZSCUMIUH2ZNF8Z2PVU1J",
        "api": "dsm.shop.pageframe.navigation.accountFacade.findAccountInfo",
        "v": "1.0"
    };
  
      const baseUrl = "https://sff.jd.com";
      const signAppId = "0248a";
      const colorParamSign = buildColorParamSign(url, obj);
  
      const response = await fetch(baseUrl + url, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json;charset=UTF-8',
              'dsm-platform': 'pc',
              "h5st": await get_h5st(colorParamSign, signAppId)
          },
          body: "{}",
          credentials: 'include'
      });
  
      if (!response.ok) {
          throw new Error('获取店铺信息失败');
      }
  
      return await response.json();
}

async function 获取虚拟手机号(userPin, orderId) {
    const url = "https://api.m.jd.com/client.action";

    const signAppId = "62ed1";
    var obj = JSON.stringify({
        skuId: "0",
        customer: encryptPin(userPin),
        orderId: orderId,
        params: {
            "appid": "im.customer",
            "BPOPmpin": "",
            "BPOPvid": "",
            "BPOPcustomer": "",
            "BPOPstoreId": ""
        },
        encryptNew: "true",
        authType: 4,
        ddAuthUUid: {
            "appId": "im.waiter",
            "pin": AccountInfo.data.pin,
            "aid": "jm_OcZ0hBbI",
            "client": "pc",
            "venderId": AccountInfo.data.venderId
        },
        customerInfo: {
            "appId": "im.customer"
        }
    })
    const colorParamSign = {
        functionId: "halleyOrderDetail",
        body: Sha256ToStr(obj),
        appid: "customerAssistant",
        clientVersion: "normal",
        lang: "zh_CN"
    };
    
    const params = {
        appid: "customerAssistant",
        functionId: "halleyOrderDetail",
        body: obj,
        h5st: await get_h5st(colorParamSign, signAppId),
        clientVersion: "20230720",
        client: "assistant_web",
        lang: "zh_CN"
    };

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('获取虚拟手机号失败');
    }

    const data = await response.json();
    let tel = data.data.tel;
    
    if (tel.includes('*')) {
        const addressKey = data.data.addressEncryptKey;
        const customerKey = data.data.customerEncryptKey;
        const telKey = data.data.telEncryptKey;
        const obj = await 解密虚拟手机号(addressKey, customerKey, telKey, orderId);
        tel = obj.data.secretNo;
    }
    
    return tel;
}

async function 获取真实手机号(userPin, orderId) {
    const url = "https://api.m.jd.com/client.action";

    const signAppId = "62ed1";
    var obj = JSON.stringify({
        skuId: "0",
        customer: encryptPin(userPin),
        orderId: orderId,
        params: {
            "appid": "im.customer",
            "BPOPmpin": "",
            "BPOPvid": "",
            "BPOPcustomer": "",
            "BPOPstoreId": ""
        },
        encryptNew: "true",
        authType: 4,
        ddAuthUUid: {
            "appId": "im.waiter",
            "pin": AccountInfo.data.pin,
            "aid": "jm_OcZ0hBbI",
            "client": "pc",
            "venderId": AccountInfo.data.venderId
        },
        customerInfo: {
            "appId": "im.customer"
        }
    })
    const colorParamSign = {
        functionId: "halleyOrderDetail",
        body: Sha256ToStr(obj),
        appid: "customerAssistant",
        clientVersion: "normal",
        lang: "zh_CN"
    };
    
    const params = {
        appid: "customerAssistant",
        functionId: "halleyOrderDetail",
        body: obj,
        h5st: await get_h5st(colorParamSign, signAppId),
        clientVersion: "20230720",
        client: "assistant_web",
        lang: "zh_CN"
    };

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('获取虚拟手机号失败');
    }

    const data = await response.json();
    let tel = data.data.tel;
    
    if (tel.includes('*')) {
        const addressKey = data.data.addressEncryptKey;
        const customerKey = data.data.customerEncryptKey;
        const telKey = data.data.telEncryptKey;
        const obj = await 解密虚拟手机号(addressKey, customerKey, telKey, orderId);
        tel = obj.data.secretNo;
    }
    
    return tel;
}

async function 获取真实手机号(userPin, orderId) {
    const url = "https://api.m.jd.com/client.action";
    const params = {
        functionId: "halleyOrderDetail",
        body: JSON.stringify({
            skuId: "0",
            customer: encryptPin(userPin),
            orderId: orderId,
            encryptNew: "true",
            authType: 4
        }),
        appid: "customerAssistant",
        clientVersion: "normal",
        lang: "zh_CN"
    };
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('获取真实手机号失败');
    }

    const data = await response.json();
    let tel = data.data.tel;
    
    if (tel.includes('*')) {
        const addressKey = data.data.addressEncryptKey;
        const customerKey = data.data.customerEncryptKey;
        const telKey = data.data.telEncryptKey;
        const obj = await 解密真实手机号(addressKey, customerKey, telKey);
        tel = obj.data[telKey];
    }
    
    return tel;
}

async function 解密虚拟手机号(addressKey, customerKey, telKey, orderId) {
    const url = "https://api.m.jd.com/client.action";
    const params = {
        functionId: "decryptBindPhone",
        body: JSON.stringify({
            sceneType: "forward",
            expiration: 30,
            orderId: orderId,
            phoneNoEncryptKey: telKey,
            chargingId: orderId,
            params: {
                "appid": "im.customer",
                "BPOPmpin": "",
                "BPOPvid": "",
                "BPOPcustomer": "",
                "BPOPstoreId": ""
            },
            encryptNew: "true",
            authType: 4
        }),
        appid: "customerAssistant",
        clientVersion: 20230720,
        client: "assistant_web",
        lang: "zh_CN"
    };
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('解密虚拟手机号失败');
    }

    return await response.json();
}

async function 解密真实手机号(addressKey, customerKey, telKey) {
    const url = "https://api.m.jd.com/client.action";
    const params = {
        functionId: "batchDecrypt",
        body: JSON.stringify({
            params: {
                appid: "im.customer",
                BPOPmpin: "",
                BPOPvid: "",
                BPOPcustomer: "",
                BPOPstoreId: ""
            },
            encryKeys: [
                addressKey,
                customerKey,
                telKey
            ],
            encryptNew: "true",
            authType: 4
        }),
        appid: "customerAssistant",
        clientVersion: "normal",
        lang: "zh_CN"
    };
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('解密真实手机号失败');
    }

    return await response.json();
}

async function 备注手机号(订单号, 备注内容) {
    const url = "/api?v=1.0&appId=COCX0HBWR4BA7RDVDBIQ&api=dsm.order.manage.orderlist.batchSubmitVenderRemark";
    const obj = {
        param: {
            level: 0,
            levelDesc: "",
            remark: 备注内容,
            orderIds: [订单号],
            accessContext: { source: "web" }
        }
    };
    const baseUrl = "https://sff.jd.com";
    const signAppId = "0248a";
    const colorParamSign = buildColorParamSign(url, obj);

    const response = await fetch(baseUrl + url, {
        method: 'POST',
        headers: {
            'accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json;charset=UTF-8',
            'dsm-platform': 'pc',
            "h5st": await get_h5st(colorParamSign, signAppId)
        },
        body: JSON.stringify(obj),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('备注手机号失败');
    }

    return await response.json();
}

// 辅助函数
function getDateRange() {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 6);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return [
        `${formatDate(startDate)} 00:00:00`,
        `${formatDate(endDate)} 23:59:59`
    ];
}

function encryptPin(e) {
    const key = CryptoJS.enc.Utf8.parse("#1*x3zp_");
    const blockSize = 8;
    let result = '';

    for (let i = 0; i < e.length; i += blockSize) {
        const block = e.substr(i, blockSize);
        const encryptedBlock = CryptoJS.DES.encrypt(block, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        }).ciphertext.toString();
        result += encryptedBlock.toUpperCase();
    }

    const encrypted = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(result));
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted));
}

function Sha256ToStr(e) {
    const context = window.__MICRO_APP_PROXY_WINDOW__ || window;
    return context.CryptoJS.SHA256(JSON.stringify(e)).toString().toUpperCase();
}

function parseSearchParams(e) {
    void 0 === e && (e = "");
    const t = e.split("?")[1] || e;
    return t.split("&").reduce((e, t) => {
        const [r, o] = t.split("=").map(decodeURIComponent);
        e[r] = o;
        return e;
    }, {});
}

function buildColorParamSign(url, data) {
    const s = Sha256ToStr(data);
    const c = parseSearchParams(url);
    const { v, appId, api } = c;

    return {
        body: s,
        appId,
        api,
        v
    };
}

function initPSign(appId, options = {}) {
    if (!appId) {
        throw new Error('appId is required');
    }

    const defaultOptions = {
        preRequest: false,
        debug: false,
        onSign: function(e) {}
    };

    const context = window.__MICRO_APP_PROXY_WINDOW__ || window;
    return new context.ParamsSign({
        appId,
        ...defaultOptions,
        ...options
    });
}

async function get_h5st(colorParamSign, signAppId) {
    try {
        const pSign = initPSign(signAppId);
        const signedParams = await pSign.sign(colorParamSign);
        return encodeURI(signedParams.h5st);
    } catch (error) {
        console.error('获取h5st失败:', error);
        throw error;
    }
}