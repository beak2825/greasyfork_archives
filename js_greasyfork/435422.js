// ==UserScript==
// @name         导出订单最新版
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version     1.35
// @description  快速导出抖店订单
// @author       spper
// @match        https://fxg.jinritemai.com/ffa/morder/order/list
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/435422/%E5%AF%BC%E5%87%BA%E8%AE%A2%E5%8D%95%E6%9C%80%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435422/%E5%AF%BC%E5%87%BA%E8%AE%A2%E5%8D%95%E6%9C%80%E6%96%B0%E7%89%88.meta.js
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

async function getShopName() {
    await WaitUntil(() => {
        return !!document.querySelector('div.headerShopName')
    })

    return document.querySelector('div.headerShopName').innerText
}

function toCsvString(headers, dataList) {
    let rows = []
    rows.push(headers)
    for (let d of dataList) {
        let row = []
        for (let h of headers) {
            row.push(d[h])
        }
        rows.push(row)
    }
    rows = rows.map(row => {
        return row.map(s => `"${s}"`).join(',')
    }).join('\n')
    return 'data:text/csv;charset=utf-8,\ufeff' + rows
}

function extractOrderDiv(div) { // 将div里的内容搞成object
    let resp = {}
    let header = div.querySelector('div[class^="index_rowHeader"] > div[class^="index_RowHeader"] > div[class^="index_leftWrapper"]')
    let spanList = header.querySelectorAll('span')
    if (spanList.length >= 1) {
        // console.log(spanList[0].innerText)
    }
    if (spanList.length >= 2) {
        // console.log(spanList[1].innerText)
        resp.orderTime = spanList[1].innerText.match(/下单时间：\s*([\d\/ :]+)/)[1]
    }
    if (spanList.length >= 3) {
        // console.log(spanList[1].innerText)
        resp.sourceType = spanList[2].innerText.match(/推广类型：\s*(.*)/)[1]
    }

    // content
    let content = div.querySelector('div:nth-of-type(2)')
    let product = content.querySelector('div[class^="style_productItem"] > div[class^="style_content"]')
    resp.image = product.querySelector('img').getAttribute('src')
    resp.title = product.querySelector('div[class^="style_detail"] > div[class^="style_name"]').innerText
    resp.sku = product.querySelector('div[class^="style_property"] > div[class^="style_desc"]').innerText

    resp.unitPrice = content.querySelector('div[class^="index_cellRow"] > div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboAmount"]').innerText
    resp.number = content.querySelector('div[class^="index_cellRow"] > div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboNum"]').innerText

    resp.payAmount = content.querySelector('div[class^="index_payAmount"]').innerText

    resp.nickname = content.querySelector('a[class^="table_nickname"]').innerText
    resp.contact = content.querySelector('div[class^="index_locationDetail"]').innerText
    let contactList = resp.contact.split('，')
    if (contactList.length >= 3) {
        resp.contactName = contactList[0]
        resp.contactPhone = contactList[1]
        resp.contactAddress = contactList[2]
    }

    resp.status = div.querySelector('div:nth-of-type(2) > div[class^="index_cell"]:nth-of-type(4) > div:first-of-type').innerText

    return resp
}

async function downloadCurrentPage() {
    let divList = document.querySelectorAll('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')
    let dataList = []
    let headers = ['orderId', 'orderTime', 'sourceType', 'title', 'sku', 'unitPrice', 'number', 'payAmount', 'nickname', 'contactName', 'contactPhone', 'contactAddress', 'contact', 'status', 'image']
    for (let div of divList) {
        let data = extractOrderDiv(div)
        console.log(data)
        dataList.push(data)
    }
    const csvString = toCsvString(headers, dataList)
    console.log('csvString', csvString)

    let shopName = await getShopName()

    let link = document.createElement('a')
    link.setAttribute('href', csvString)
    let filename = `${shopName}-订单`
    link.setAttribute('download', filename + '.csv')
    link.click()
}

async function addDownloadButton() {
    await WaitUntil(() => {
        return !!document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] div[class^="index_buttonGroup"]')
    })

    let div = document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] div[class^="index_buttonGroup"]')
    let btn = div.querySelector('button').cloneNode(true)
    btn.setAttribute('data-id', '下载订单')
    btn.setAttribute('_cid', 'export-orders')
    btn.innerHTML = `<span>下载订单</span>`
    div.appendChild(btn)

    btn.onclick = (e) => {
        console.log('btn.onclick', e)
        downloadCurrentPage()
    }
}

(async function() {
    'use strict';

    // Your code here...
    await addDownloadButton()
})();