// ==UserScript==
// @name         妙手-上传商品复制历史
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2
// @description  用来获得抖店商品跟pdd的对应
// @author       widneng
// @match        https://dd.chengji-inc.com/move/batch/history
// @icon         https://www.google.com/s2/favicons?domain=chengji-inc.com
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/431745/%E5%A6%99%E6%89%8B-%E4%B8%8A%E4%BC%A0%E5%95%86%E5%93%81%E5%A4%8D%E5%88%B6%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/431745/%E5%A6%99%E6%89%8B-%E4%B8%8A%E4%BC%A0%E5%95%86%E5%93%81%E5%A4%8D%E5%88%B6%E5%8E%86%E5%8F%B2.meta.js
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

function UploadHistory(shopName, list) { // todo 改一下
    return Post(`http://8.129.106.241:15496/api/upload/miaoshou/history`, {
        data: JSON.stringify({
            shopName: shopName,
            list: list
        })
    })
}

async function GetShopName() {
    await WaitUntil(() => {
        return !!document.querySelector('div.navbar-notify > ul.list-unstyled > li:first-of-type')
    })

    let elem = document.querySelector('div.navbar-notify > ul.list-unstyled > li:first-of-type')
    return elem.innerText.match(/【(.*?)】/)[1]
}

async function GetHistoryProductList(page, pageSize) {
    let now = parseInt(new Date().getTime())
    let html = await Get(`https://dd.chengji-inc.com/move/batch/history_product_list?pageSize=${pageSize}&page=${page}&status=all&_=${now}`)
    let elem = document.createElement('html')
    elem.innerHTML = html.html
    // console.log('GetHistoryProductList', elem)

    let resp = {
        list: [],
        pagination: {}
    }

    resp.pagination.total = parseInt(elem.querySelector('div.zc-total > b:first-of-type').innerText)
    resp.pagination.totalPage = parseInt(elem.querySelector('div.zc-total > b:last-of-type').innerText)
    resp.pagination.pageSize = pageSize
    resp.pagination.current = parseInt(elem.querySelector('ul.zc-inline > li.active > span.zc-current').innerText)

    let trList = elem.querySelectorAll('table.data-table > tbody > tr.J_taskDetailTr')
    // console.log(trList)
    for (let tr of trList) {
        // console.log(tr)
        if (tr.querySelector('td[data-status="fail"]')) continue

        let d = {}
        d.sourceUrl = tr.querySelector('td:nth-of-type(1) > a.J_taskProductImgBox').getAttribute('href')
        d.sourceImg = tr.querySelector('td:nth-of-type(1) > a.J_taskProductImgBox > img').getAttribute('src')
        d.title = tr.querySelector('td:nth-of-type(2) > div:nth-of-type(1) > a').innerText.trim()
        d.category = tr.querySelector('td:nth-of-type(2) > div:nth-of-type(2) > span.text-muted').innerText.trim()
        d.source = tr.querySelector('td:nth-of-type(3) > strong > span').innerText.trim() // 来源
        d.sourceId = tr.querySelector('td:nth-of-type(3) > div.mt_5 > a').innerText.trim() // 源ID
        d.addTime = parseInt(new Date(tr.querySelector('td:nth-of-type(5)').innerText.match(/\d{2,4}-\d{1,2}-\d{1,2}\s*\d{1,2}:\d{1,2}/)[0]).getTime() / 1000)
        d.targetUrl = tr.querySelector('td:nth-of-type(5) > div:first-of-type > span.text-muted > a').getAttribute('href')
        d.targetId = tr.querySelector('td:nth-of-type(5) > div:first-of-type > span.text-muted > a').innerText.trim()
        resp.list.push(d)
    }

    // console.log(resp)
    return resp
}

async function LoopGetHistoryProductList(page, pageSize) {
    while (true) {
        try {
            let resp = await GetHistoryProductList(page, pageSize)
            return resp
        } catch (err) {
            console.error('GetHistoryProductList fail', err)
            showToast(`获取第${page}页商品历史失败，即将自动重试`)
            await Sleep(1)
        }
    }
}

(function() {
    'use strict';

    // Your code here...
    window.onload = async () => {
        const pageSize = 20
        await Sleep(1)
        let shopName = await GetShopName()
        console.log('shopName', shopName)
        try {
            let resp = await LoopGetHistoryProductList(1, pageSize)
            showToast(`获取第1页商品历史成功，共 ${resp.list.length} 条`)
            await UploadHistory(shopName, resp.list)
            for (let page = 2; page <= resp.pagination.totalPage; ++page) {
                await Sleep(1)
                let resp = await LoopGetHistoryProductList(page, pageSize)
                showToast(`获取第${page}页商品历史成功，共 ${resp.list.length} 条`)
                await UploadHistory(shopName, resp.list)
            }
        } catch (err) {
            console.error('LoopGetHistoryProductList fail', err)
            showToast(`获取商品历史失败`)
        }
    }
})();