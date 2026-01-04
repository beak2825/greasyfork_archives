// ==UserScript==
// @name         [pdd1688]wuyuzegang订单同步
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  wuyuzegang订单同步到自己服务器
// @author       windeng
// @match        https://wuyuzegang.com/pdd/autobuy/order
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420532/%5Bpdd1688%5Dwuyuzegang%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/420532/%5Bpdd1688%5Dwuyuzegang%E8%AE%A2%E5%8D%95%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

function DoWithInterval(funcList, sleepSecs) {
    sleepSecs = sleepSecs || 1
    let funcIndex = 0
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (funcIndex >= funcList.length) {
                clearInterval(interval)
                resolve()
                return
            }
            funcList[funcIndex]()
            funcIndex++
        }, sleepSecs * 1000)
    })
}

function WaitUntil(conditionFunc, sleepSecs) {
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

function GetOrderList(page, pageSize) {
    console.log('GetOrderList start', page, pageSize)
    return Post('https://wuyuzegang.com/pdd/autobuy/ajaxorder/all', {
        data: JSON.stringify({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: 'asc'
        })
    })
}

function SendOrderList(data) {
    console.log('SendOrderList start', data)
    return Post('http://8.129.106.241:10086/api/zegang/update', {
        data: JSON.stringify({
            type: 'pdd_list',
            data: data
        })
    })
}

function SendOrderRelated1688Orders(data) {
    // console.log('SendOrderRelated1688Orders start', data)
    return Post('http://8.129.106.241:10086/api/zegang/update', {
        data: JSON.stringify({
            type: 'related_1688',
            data: data
        })
    })
}

function GetOrderRelated1688Orders(pddOrderId) {
    // console.log('GetOrderRelated1688Orders start', pddOrderId)
    return Post('https://wuyuzegang.com/pdd/autobuy/ajaxorder/items', {
        data: JSON.stringify({
            myOrderId: pddOrderId
        })
    })
}

function GetOrderListAndSend(page, pageSize) {
    console.log('GetOrderListAndSend start', page, pageSize)
    return GetOrderList(page, pageSize).then(res => {
        return SendOrderList(res).then(() => {
            return res
        })
    })
}

function GetOrderRelated1688OrdersAndSend(pddOrderId) {
    // console.log('GetOrderRelated1688OrdersAndSend start', pddOrderId)
    return GetOrderRelated1688Orders(pddOrderId).then(res => {
        return SendOrderRelated1688Orders({
            pddOrderId: pddOrderId,
            data: res
        }).then(() => {
            return res
        })
    })
}

function GetAllOrderAndSend(page) {
    page = page || 1
    console.log('GetAllOrderAndSend start', page)
    let pageSize = 10
    return GetOrderListAndSend(page, pageSize).then(res => {
        console.log(`GetOrderListAndSend page ${page} pageSize ${pageSize} resp`, res)
        let done = false
        if (res.result_code === -1) { // 结束
            done = true
            return
        }
        if (res.rows.length < pageSize) { // 结束
            done = true
        }

        // do sth.
        let funcList = []
        res.rows.forEach(row => {
            let func = () => {
                GetOrderRelated1688OrdersAndSend(row.OrderId).catch(err => {console.error('ERR:', row.OrderId, err)})
            }
            funcList.push(func)
        })

        DoWithInterval(funcList, 1).then(() => {
            console.log('all GetOrderRelated1688OrdersAndSend done')
            if (!done) {
                setTimeout(() => {
                    GetAllOrderAndSend(page + 1)
                }, 5000) // 2s后翻页
            }
        }).catch(err => {
            console.error('?', err)
        })
    })
}

(function() {
    'use strict';

    // Your code here...
    GetAllOrderAndSend()
    let interval = setInterval(() => {
        GetAllOrderAndSend()
    }, 15 * 60 * 1000)
})();