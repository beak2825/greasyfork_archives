// ==UserScript==
// @name         OverseaScript
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  三方授权后自动同步库存和、商品，自动配对
// @author       LP
// @match        *://*/*amzup-web-main/*
// @include      http://192.168.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meiyunji.net
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507740/OverseaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/507740/OverseaScript.meta.js
// ==/UserScript==

(function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url; // 存储请求的URL
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = async function (body) {

        if (this._url.includes('overseaAuth/save')) {
            const params = JSON.parse(body)
            const agentId = params.agentId
            const nickname = params.nickname
            const warehouseIdList = params.warehouseIdList
            this.addEventListener('load', function () {
                const res = JSON.parse(this.responseText);
                if (res.code === 0) {
                    try {
                        overseaSetPair(agentId, nickname, warehouseIdList);
                        showToast('正在同步库存与配对！')
                        toast.style.color = 'red'
                    } catch (error) {
                        toast.textContent = '执行脚本失败！！！';
                        setTimeout(() => {
                            toast.remove();
                        }, 1500);

                    }
                }
            });

        }
        if (this._url.includes('api/account/user.json')) {
            this.addEventListener('load', function () {
                window.puid = JSON.parse(this.responseText).data.user.puid;
            });
        }

        return originalSend.apply(this, arguments);
    };
})();

function showToast(message) {
    window.toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '10%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.backgroundColor = 'white';
    toast.style.color = 'red';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    toast.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    toast.style.fontSize = '16px';
    toast.style.fontWeight = 'bold';
    document.body.appendChild(toast);
};

async function eventDispatch(dom, event = 'input', value = null, time = 1) {
    if (typeof dom === 'string') {
        dom = document.querySelector(dom);
    }
    if (dom) {
        if (event === 'input') {
            dom.value = value;
        }
        dom.dispatchEvent(new Event(event));
        await new Promise(resolve => setTimeout(resolve, 50 * time));

    }

};


async function clickDom(dom, time = 1) {
    if (typeof dom === 'string') {
        dom = document.querySelector(dom);

    }
    if (dom) {
        dom.click();
        await new Promise(resolve => setTimeout(resolve, 100 * time));
    }

};

async function overseaSetPair(agentId, nickname, warehouseIdLis) {
    const URL = window.location.origin;
    let request;
    let response;

    const warehouseId = warehouseIdLis[0]
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 拿授权id
    request = await fetch(`${URL}/api/overseaAuth/page.json`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            "type": "authorization",
            "searchType": "commoditySku",
            "warehouseIds": null,
            "authorIdWarehouseIds": [],
            "agentIds": [],
            "authorIds": [],
            "searchContent": "",
            "fullCid": "",
            "devIds": [],
            "varianceAdjustFlag": "",
            "varianceRemindFlag": "",
            "pageNo": 1,
            "pageSize": 20,
            "orderBy": "",
            "desc": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    response = await request.json();
    const authId = response.data.rows.filter(x => x.nickname === nickname)[0].id;

    // 拿到仓库code和仓库名
    request = await fetch(`${URL}/api/overseaAuth/preEdit.json?agentId=${agentId}&authorId=${authId}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    response = await request.json();
    window.agentName = response.data.agentVoList.filter(x => x.agentId === agentId)[0].agentName
    window.warehouseDetail = response.data.warehouseVoList.filter(x => x.id === warehouseId).map(x => {
        return {
            warehouseCode: x.warehouseCode,
            warehouseName: x.warehouseName,
        }
    })[0];

    let syncUrl = null;
    if (window.location.href.includes('alpha')||window.location.href.includes('sellfox')) {
        syncUrl = 'http://10.0.70.63:10038'
    } else {
        syncUrl = URL
    }
    // 同步库存 + 商品
    for (const warehouseIdLi of warehouseIdLis) {
        fetch(`${syncUrl}/crontab/syncInventory.json?puid=${puid}&agentId=${agentId}&authorId=${authId}&warehouseId=${warehouseIdLi}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

    }
    // 同步商品
    fetch(`${syncUrl}/crontab/syncOverseaProduct.json?puid=${window.puid}&agentId=${agentId}&authorId=${authId}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    // 获取三方库存
    let rowList = [];
    let reTryNum = 0;
    while (rowList.length <= 0) {
        request = await fetch(`${URL}/api/oversea/inventory/page.json`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                "type": "details",
                "searchType": "commoditySku",
                "warehouseIds": warehouseId,
                "authorIdWarehouseIds": [],
                "agentIds": [agentId],
                "authorIds": [authId],
                "searchContent": "",
                "fullCid": "",
                "devIds": [],
                "varianceAdjustFlag": "",
                "varianceRemindFlag": "",
                "warehouseList": [warehouseId],
                "pageNo": 1,
                "pageSize": 20,
                "hideZeroStock": 1,
                "hideVarianceStock": 0,
                "orderBy": "availableStock",
                "desc": true
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        response = await request.json();
        rowList = response.data.rows || [];
        if (rowList.length===0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        if (reTryNum > 150) {
            toast.textContent = '同步库存时长超过10分钟，请核对是否无误！'
            setTimeout(() => {
                toast.remove();
            }, 5000);
            break;
        }
        reTryNum++;
    }
    const rowId = rowList[0].id
    const sku = rowList[0].sku
    window.puid === 19 ? commoditySku = 'Mixone' : window.puid === 100 ? commoditySku = 'Mixone' : commoditySku = 'PolarisOne'

    // 拿本地仓库id
    request = await fetch(`${URL}/api/warehouseManage/warehouseList.json?type=&searchValue=${nickname}-${warehouseDetail.warehouseName}&pageSize=20&pageNo=1&orderField=&orderValue=`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",

        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    response = await request.json();
    const localWarehouseId = response.data.page.rows[0].id

    //   拿商品id
    request = await fetch(`${URL}/api/commodity/pageList.json`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `pageNo=1&pageSize=20&fullCid=&isGroup=&devIds=&state=&currency=CNY&searchField=sku&searchValue=${commoditySku}&orderField=updateTime&orderValue=desc&dateType=update`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    response = await request.json();
    const commodityId = response.data.rows[0].id

    // 获取配对三方skuid
    let overseaProductRow = []
    while (overseaProductRow <= 0) {
        request = await fetch(`${URL}/api/oversea/product/page.json`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",

            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                "type": "pairCommodity",
                "searchType": "sku",
                "warehouseIds": warehouseId,
                "authorIdWarehouseIds": [`${authId}_${warehouseId}`],
                "agentIds": [agentId],
                "authorIds": [authId],
                "searchContent": sku,
                "fullCid": "",
                "devIds": [],
                "varianceAdjustFlag": "",
                "varianceRemindFlag": "",
                "warehouseList": [warehouseId],
                "pageNo": 1,
                "pageSize": 20,
                "orderBy": "",
                "desc": ""
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        response = await request.json();
        overseaProductRow = response.data.rows
        if (overseaProductRow.length===0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

    }

    const overseaProductId = overseaProductRow[0].id

    // 配对
    request = await fetch(`${URL}/api/oversea/product/match.json`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            "warehouseId": warehouseId,
            "warehouseIdKey": authId + '_' + warehouseId,
            "sku": sku,
            "skuKey": `${authId}_${sku}`,
            "commoditySku": commoditySku,
            "fnsku": "",
            "agentId": agentId,
            "authorId": authId,
            "id": overseaProductId,
            "puid": puid,
            "agentName": agentName,
            "platformNickname": nickname,
            "nickAndWarehouseName": `${nickname}-${warehouseDetail.warehouseName}`,
            "warehouseCode": warehouseDetail.warehouseCode,
            "warehouseName": warehouseDetail.warehouseName,
            "skuName": null,
            "imgUrl": null,
            "commodityName": null,
            "commodityId": commodityId,
            "pairStatus": 0,
            "localWarehouseId": localWarehouseId,
            "updateTime": null,
            "_XID": "row_744"
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    response = await request.json();
    toast.textContent = '同步库存与配对完成！';
    toast.style.color = 'green'
    setTimeout(() => {
        toast.remove();
    }, 1500);

    await enableOverseaChannel(agentName + '-' + nickname);

}


async function enableOverseaChannel(overseaName) {
    await eventDispatch(document.querySelector("#menu4 > div > span"), 'mouseenter');
    const logisticsConfigDom = Array.from(document.querySelectorAll("div > ul > li > div > a")).filter(x => x.innerText === '物流设置')[0];
    await clickDom(logisticsConfigDom, 10);
    await clickDom(document.querySelector("#tab-oversea"), 3);
    await eventDispatch(document.querySelector("div.logistics_box > div.logistics_search > div > input"), 'input', overseaName, 3);
    await eventDispatch(document.querySelector("div.logistics_box > div.logistics_search > div > input"), 'change', null, 3);
    await clickDom(document.querySelector("div.logistics_box > div.logistics_list > div.logistics_item > div"), 3);
    await eventDispatch(document.querySelector("div.channel_box > div.channel_search > div > input"), 'input', 'FedEx');
}