// ==UserScript==
// @name         Lazada Flash Sale Crawler
// @namespace    https://youpik.com/
// @version      0.2
// @description  Lazada Flash Sale Crawler to youpik
// @author       You
// @license      private
// @match        https://pages.lazada.co.th/wow/i/th/LandingPage/flashsale-h5*
// @icon         http://ypk.ops.catike.com/logo.png
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450777/Lazada%20Flash%20Sale%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/450777/Lazada%20Flash%20Sale%20Crawler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        closeARMS();
        main();
    }, 500);
})();

function closeARMS() {
    let i = 0;
    let interval = setInterval(() => {
        i++;
        if (i > 100) {
            clearInterval(interval);
        }
        try {
            window.__bl._conf.pid = 'dddddd';
            window.__bl.api = function (a, b, c, d) {}
            window.__bl.error = function (e, t) {}
            window.__bl.msg = function (e, t) {}
            window.__bl.session = 'jjjj';
            window.__bl['EagleEye-TraceID'] = '2323';
            clearInterval(interval);
        } catch (e) {}
    }, 1000);
}

/**
 * setTimeout转Promise
 * 
 * @param {*} ms 
 * @returns 
 */
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

const serverUrl = "https://youpik.test.catike.com";
var dingdingLimitMap = new Map();

/**
 * 钉钉通知
 *
 * @param {*} msg
 * @param {*} msgLimitKey 消息发送限制key，如果传了这个参数，则只会发送一次
 * @return {*} 
 */
function dingding(msg, msgLimitKey) {
    if (typeof msgLimitKey === 'string') {
        if (dingdingLimitMap.has(msgLimitKey)) {
            return;
        }
        dingdingLimitMap.set(msgLimitKey, 1);
    }
    let url = serverUrl + "/api-base/notification/forward";
    let dingdingUrl = "https://oapi.dingtalk.com/robot/send?access_token=8ac0c85748a45bbfd0a63f589f269a18fb9cdcd11ebb8100630bae20e532828c";
    axios.post(url, {
        "url": dingdingUrl,
        "body": JSON.stringify({
            "at": {
                "atMobiles": [
                    "18358330290"
                ],
                "isAtAll": false
            },
            "text": {
                "content": "闪购爬虫通知：\n" + msg
            },
            "msgtype": "text"
        })
    });
}

/**
 * 提交商品数据
 * @param {*} productArr 需要提交的商品数据
 * @param {*} sessionTimestamp 场次时间戳
 */
async function submitProduct(productArr, sessionTimestamp) {
    while (true) {
        let submitData = productArr.splice(0, 50);
        if (submitData.length === 0) {
            break;
        }
        const response = await axios.post(serverUrl + '/api-mall/lazada/affiliate/item/batch_flash_sale_sync', {
            sessionTime: sessionTimestamp,
            productData: {
                needRootLink: true,
                items: submitData
            }
        }, {
            timeout: 30000
        });
    }
}

async function main() {
    // 首先获取当前页面所有存在的场次
    let sessionList = await crawlerSession();
    if (sessionList.length > 0) {
        setTimeout(() => {
            // 爬取
            crawler(sessionList);
            // 待机，适时刷新页面
            standby(sessionList);
        }, 600);
    } else {
        // 没有获取到场次信息，异常情况，间隔1分钟，刷新页面
        setTimeout(() => {
            window.location.reload();
        }, 60000);
    }
}

/**
 * 获取场次时间戳
 * @returns 
 */
async function crawlerSession() {
    let i = 0;
    // 场次时间戳列表
    let sessionList = [];
    try {
        while (true) {
            if (i >= 120) {
                throw new Error("获取场次数据异常\n可能的情况：\n1. 闪购页面结构发生变化，需要重新适配\n2. 网络问题");
            }
            let sessionDoms;
            await wait(500).then(() => {
                sessionDoms = document.querySelectorAll(".J_FSTimeAnchor");
            })
            if (sessionDoms !== null && sessionDoms.length > 0) {
                for (const sessionDom of sessionDoms) {
                    if (isNaN(sessionDom.id) || sessionDom.id < 1662094800000) {
                        throw new Error("闪购页面结构发生变化，需要重新适配\n场次数据获取异常");
                    }
                    sessionList.push(sessionDom.id);
                }
                break;
            }
            i++;
        }
    } catch (e) {
        sessionList = [];
        dingding(e.message);
    }
    return sessionList;
}

/**
 * 爬取
 * @param {*} sessionList 
 */
async function crawler(sessionList) {
    for (const sessionTimestamp of sessionList) {
        // 展开每场的商品，直到满足单场200个商品展示
        let max = 200; // 满足的商品数量
        let boxSelectStr = "#campaign-" + sessionTimestamp + " > .item-list-content";
        let i = 0;
        while (true) {
            let currentProductNum = document.querySelectorAll(boxSelectStr + " > a").length;
            if (i >= Math.ceil(max / 15)) {
                if (currentProductNum === 0) {
                    dingding("获取不到商品DOM，可能的原因：\n1. 页面结构发生变化，需重新适配\n2. 网络问题", "product-dom-error");
                }
                break;
            }
            if (currentProductNum >= max) {
                // 说明满足了爬取的商品数量
                break;
            } else {
                // 触发获取商品
                let productQueryDom = document.querySelector(boxSelectStr + " .J_LoadMoreButton");
                if (productQueryDom !== null) {
                    await wait(300).then(async () => {
                        productQueryDom.click();
                        // 等待结果返回
                        let z = 0;
                        while (true) {
                            if (z >= 60) {
                                dingding("长时间未获取到下一页商品数据\n可能的原因：\n1. 网络问题\n2. 页面结构发生变化");
                                break;
                            }
                            let done = false;
                            await wait(200).then(() => {
                                let loadingDom = document.querySelector(boxSelectStr + " > div.flash-sale-loading.J_FSListLoading");
                                if (loadingDom === null) {
                                    done = true;
                                }
                            });
                            if (done) {
                                break;
                            }
                            z++;
                        }
                    })
                } else if (i === 0) {
                    // 说明第一次循环时，已经获取不到dom了，代表页面结构发生了变化，需要重新适配
                    dingding("页面结构发生变化，需要重新适配\n查询不到获取商品按钮DOM");
                    break;
                }
            }
            i++;
        }
        // 提交单场商品数据
        await crawlerProduct(sessionTimestamp);
    }
}

/**
 * 爬取商品，并提交
 * @param {*} sessionTimestamp 
 */
async function crawlerProduct(sessionTimestamp) {
    let boxSelectStr = "#campaign-" + sessionTimestamp + " > .item-list-content";
    let allProductDom = document.querySelectorAll(boxSelectStr + " > a");
    let productIndex = 0;
    let submitData = [];
    for (const productDom of allProductDom) {
        let productUrl = new URL(productDom.href);
        // 解析路径获取商品id与skuid
        let product = {
            productId: 0,
            skuId: 0,
            productName: "",
            productImg: "",
            // categoryId: 0,
            // categoryName: "",
            price: 0,
            currency: 'THB',
            sellerName: "",
            currentPrice: "",
            brandName: "",
            productUrl: productUrl.href,
            productCommissionRate: 3 / 100,
            lazadaSku: '',
            sort: 999900000 + productIndex,
            // bestState: document.querySelector("#home-featured").checked === true
        };
        productIndex++;
        let pathArr = productUrl.pathname.toLowerCase().split(".")[0].split("-");
        for (const pathItem of pathArr) {
            switch (pathItem.slice(0, 1)) {
                case "i":
                    // 识别剩余部分是否时数字
                    if (!isNaN(pathItem.slice(1))) {
                        product.productId = Number(pathItem.slice(1));
                    }
                    break;
                case "s":
                    // 识别剩余部分是否时数字
                    if (!isNaN(pathItem.slice(1))) {
                        product.skuId = Number(pathItem.slice(1));
                    }
                    break;
            }
        }
        if (!(product.productId > 0 && product.skuId > 0)) {
            dingding("没有正确获取到product id与sku id\n商品链接结构发生变化，需重新适配\n商品链接：" + productUrl.href, "product-href-error");
        } else {
            // 模拟拼接lazada sku
            product.lazadaSku = product.productId + '_TH-' + product.skuId;
            // 获取商品图片
            let img = productDom.querySelector(".flash-unit-image > img");
            if (img === null) {
                dingding("页面结构发生变化，需重新适配。没有获取到商品图片DOM", "product-img-error");
                continue;
            }
            product.productImg = img.src;
            if (product.productImg === null || product.productImg === '') {
                product.productImg = img.getAttribute("data-ks-lazyload");
            }
            // 获取商品名称
            let productContentDom = productDom.querySelector(".unit-content");
            if (productContentDom === null) {
                dingding("页面结构发生变化，需重新适配。没有获取到商品内容DOM", "product-content-error");
                continue;
            }
            let productNameDom = productContentDom.querySelector('.sale-title');
            if (productNameDom === null) {
                dingding("页面结构发生变化，需重新适配。没有获取到商品名称DOM", "product-name-error");
                continue;
            }
            product.productName = productNameDom.innerText;
            if (product.productName.length === 0) {
                dingding("获取到的商品名称为空，请检查页面结构是否有变化", "product-name-empty");
                continue;
            }
            // 获取商品售价
            let productCurrentPriceDom = productContentDom.querySelector('.sale-price');
            if (productCurrentPriceDom === null) {
                dingding("页面结构发生变化，需重新适配。没有获取到商品售价DOM", "product-current-price-error");
                continue;
            }
            product.currentPrice = productCurrentPriceDom.innerText.replace(/\s*/g, "").substr(1).replace(/,/g, '');
            if (product.currentPrice.length === 0) {
                dingding("获取到的商品售价为空，请检查页面结构是否有变化", "product-current-price-empty");
                continue;
            }
            // 判断是否是进行中的场次
            let inProgress = product.currentPrice.indexOf("?") === -1;
            if (inProgress) {
                // 获取商品市场价
                let productMarketPriceDom = productContentDom.querySelector('.origin-price-value');
                if (productMarketPriceDom === null) {
                    dingding("页面结构发生变化，需重新适配。没有获取到商品市场价DOM", "product-price-error");
                    continue;
                }
                product.price = productMarketPriceDom.innerText.replace(/\s*/g, "").substr(1).replace(/,/g, '');
                if (product.price.length === 0) {
                    // 如果进行中的商品，没有获取到划线价，则默认为售价的1.2倍
                    product.price = product.currentPrice * 1.2;
                    continue;
                }
            } else {
                product.currentPrice = 0;
            }
            submitData.push(product);
        }
    }
    await submitProduct(submitData, sessionTimestamp);
    console.log("完成同步场次：" + dateFormat("YYYY-mm-dd HH:MM", new Date(Number(sessionTimestamp))))
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

/**
 * 进入待机状态
 * 1. 下一场开始后
 * @param {*} sessionList 
 */
async function standby(sessionList) {
    while (true) {
        await wait(2000).then(async () => {
            if (typeof sessionList[1] === 'undefined') {
                // 这种情况属于没有获取到第二场数据，可能未来就没有了，这里兜底每10分钟刷新一次页面
                dingding("没有获取到第二场闪购的场次数据\n可能的原因：\n1. 页面结构发生变化\n2. 闪购功能可能将要下线");
                await wait(600000).then(() => {
                    window.location.reload();
                });
            } else {
                // 增加5秒延迟
                if (new Date().getTime() > (sessionList[1] + 5000)) {
                    window.location.reload();
                }
            }
        });
    }
}