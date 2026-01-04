// ==UserScript==
// @name         [private]抖店-上传当前页面订单到服务器
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2
// @description  上传当前页面订单到服务器
// @author       windeng
// @match        https://fxg.jinritemai.com/ffa/morder/order/list*
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/431417/%5Bprivate%5D%E6%8A%96%E5%BA%97-%E4%B8%8A%E4%BC%A0%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%AE%A2%E5%8D%95%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431417/%5Bprivate%5D%E6%8A%96%E5%BA%97-%E4%B8%8A%E4%BC%A0%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%AE%A2%E5%8D%95%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

async function Sleep(sleepSecs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, sleepSecs * 1000)
    })
}

async function WaitUntil(conditionFunc, sleepSecs) {
    sleepSecs = sleepSecs || 1
    return new Promise((resolve, reject) => {
        if (conditionFunc()) resolve()
        let interval = setInterval(() => {
            if (conditionFunc()) {
                clearInterval(interval)
                resolve()
            }
        }, sleepSecs * 1000)
    })
}

// GM_xmlhttpRequest
function Request(url, opt={}) {
	Object.assign(opt, {
		url,
		timeout: 2000,
		responseType: 'json'
	})

	return new Promise((resolve, reject) => {
		/*
		for (let f of ['onerror', 'ontimeout'])
			opt[f] = reject
		*/

		opt.onerror = opt.ontimeout = reject
		opt.onload = resolve

        // console.log('Request', opt)

		GM_xmlhttpRequest(opt)
	}).then(res => {
        if (res.status === 200) return Promise.resolve(res.response)
        else return Promise.reject(res)
    }, err => {
        return Promise.reject(err)
    })
}

function showToast(msg, doNotFade) {
    let width = 300
    let left = document.body.clientWidth / 2 - width / 2
    let style = `position: fixed; left: ${left}px; top: 80px; width: ${width}px; text-align: center; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

    let span = document.createElement('span')
    span.setAttribute('style', style)
    span.innerText = msg
    document.body.appendChild(span)
    if (!doNotFade) {
        setTimeout(() => {
            document.body.removeChild(span)
        }, 5000)
    }
}

function Get(url, opt={}) {
    Object.assign(opt, {
        method: 'GET'
    })
    return Request(url, opt)
}

function Post(url, opt={}) {
    Object.assign(opt, {
        method: 'POST'
    })
    return Request(url, opt)
}

function UploadOrders(shop, orders) {
    return Post(`http://8.129.106.241:15496/api/upload/doudian/orders`, {
        data: JSON.stringify({
            shop: shop,
            orders: orders
        })
    })
}

async function GetShopInfo() {
    let nowMsTimestamp = new Date().getTime()
    return Get(`https://fxg.jinritemai.com/common/index/index?_=${nowMsTimestamp}&appid=1`)
}

async function getShopName() {
    await WaitUntil(() => {
        return !!document.querySelector('div.headerShopName')
    })

    return document.querySelector('div.headerShopName').innerText
}

function getElementByText(element, selector, text) {
    let elems = element.querySelectorAll(selector)
    for (let elem of elems) {
        if (elem.innerText.trim() === text.trim()) return elem
    }
}

function extractOrderDiv(div) { // 将div里的内容搞成object
    let resp = {}
    let header = div.querySelector('div[class^="index_rowHeader"] > div[class^="index_RowHeader"] > div[class^="index_leftWrapper"]')
    let spanList = header.querySelectorAll('span')
    if (spanList.length >= 1) {
        // console.log(spanList[0].innerText)
        resp.orderId = spanList[0].innerText.match(/订单号：\s*(\d+)/)[1].trim()
    }
    if (spanList.length >= 2) {
        // console.log(spanList[1].innerText)
        resp.orderTime = spanList[1].innerText.match(/下单时间：\s*([\d\/ :]+)/)[1].trim()
    }
    if (spanList.length >= 3) {
        // console.log(spanList[1].innerText)
        resp.sourceType = spanList[2].innerText.match(/推广类型：\s*(.*)/)[1].trim()
    }

    // content
    let content = div.querySelector('div:nth-of-type(2)')
    let product = content.querySelector('div[class^="style_productItem"] > div[class^="style_content"]')

    resp.goods = [] // 一单会有多个商品
    let goodsList = content.querySelectorAll('div[class^="index_cellCol"] > div[class^="index_cellRow"]')
    for (let goods of goodsList) {
        let d = {}
        d.image = goods.querySelector('img').getAttribute('src').trim()
        d.title = goods.querySelector('div[class^="style_detail"] > div[class^="style_name"]').innerText.trim()
        d.sku = goods.querySelector('div[class^="style_detail"] > div[class^="style_normalDetail"]').innerText.trim()

        d.unitPrice = goods.querySelector('div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboAmount"]').innerText.trim()
        d.number = goods.querySelector('div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboNum"]').innerText.trim()

        resp.goods.push(d)
    }

    resp.payAmount = content.querySelector('div[class^="index_payAmount"]').innerText.trim()

    resp.nickname = content.querySelector('a[class^="table_nickname"]').innerText.trim()
    resp.contact = content.querySelector('div[class^="index_locationDetail"]').innerText.trim()
    let contactList = resp.contact.split('，')
    if (contactList.length >= 3) {
        resp.contactName = contactList[0].trim()
        resp.contactPhone = contactList[1].trim()
        resp.contactAddress = contactList[2].trim()
    }

    resp.status = div.querySelector('div:nth-of-type(2) > div:nth-of-type(4) > div:first-of-type').innerText.trim()

    let footer = div.querySelector('div[class^="index_footer"] > div[class^="index_footerContent"]')
    if (footer) {
        let bizRemarkElem = getElementByText(footer, 'div[class^="index_title"]', '商家备注')
        if (bizRemarkElem) {
            resp.bizRemark = bizRemarkElem.nextSibling.innerText.trim()
        }
    }

    return resp
}

async function uploadCurrentPage() {
    showToast(`即将上传本页订单`)

    let divList = document.querySelectorAll('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')
    let dataList = []
    let headers = ['orderId', 'orderTime', 'sourceType', 'title', 'sku', 'unitPrice', 'number', 'payAmount', 'nickname', 'contactName', 'contactPhone', 'contactAddress', 'contact', 'status', 'image']
    for (let div of divList) {
        let data = extractOrderDiv(div)
        console.log(data)
        dataList.push(data)
    }
    let shopInfo = await GetShopInfo()
    await UploadOrders(shopInfo, dataList)

    showToast(`上传本页 ${dataList.length} 个订单成功`)
}

async function addUploadButton() {
    await WaitUntil(() => {
        return !!document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] > div[class^="index_buttonGroup"]')
    })

    let div = document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] > div[class^="index_buttonGroup"]')
    let btn = div.querySelector('button').cloneNode(true)
    btn.setAttribute('data-id', '上传订单')
    btn.setAttribute('_cid', 'export-orders')
    btn.innerHTML = `<span>上传订单</span>`
    div.appendChild(btn)

    btn.onclick = (e) => {
        console.log('btn.onclick', e)
        uploadCurrentPage()
    }
}

(async function() {
    'use strict';

    // Your code here...
    await addUploadButton()
})();