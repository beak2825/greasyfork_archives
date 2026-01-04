// ==UserScript==
// @name         同步pdd订单信息到服务器
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.3
// @description  私人使用，同步pdd订单信息到服务器
// @author       windeng
// @match        https://mms.pinduoduo.com/orders/list
// @match        https://mms.pinduoduo.com/orders/detail*
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/420453/%E5%90%8C%E6%AD%A5pdd%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420453/%E5%90%8C%E6%AD%A5pdd%E8%AE%A2%E5%8D%95%E4%BF%A1%E6%81%AF%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

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

// GM_download
function Download(url, name, opt={}) {
	Object.assign(opt, { url, name })

	return new Promise((resolve, reject) => {
		opt.onerror = reject
		opt.onload = resolve

		GM_download(opt)
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

function SendPddOrders(data) {
    const UPDATE_URL = 'http://8.129.106.241:10086/api/pddorders/update'
    return Post(UPDATE_URL, {
        data: JSON.stringify(data)
    })
}

function GetLatestCompleteOrder(accountId) {
    const GET_URL = `http://8.129.106.241:10086/api/pddorders/get?account_id=${accountId}&type=lastest&get_complete=1`
    return Get(GET_URL)
}

function GetOrderBySn(orderSn) {
    const GET_URL = `http://8.129.106.241:10086/api/pddorders/get?order_sn=${orderSn}`
    return Get(GET_URL)
}

function GetUserInfo() {
    let info = document.getElementsByClassName('user-info-top')[0]
    let userName = info.getElementsByClassName('user-name')[0]
    let name = userName.getElementsByClassName('name')[0]
    let id = userName.getElementsByClassName('id')[0]
    return {
        name: name.innerText.trim(),
        id: id.innerText.trim()
    }
}

function InsertButton(name) {
    let mainDom = document.getElementById('pdd-app-skeleton-main-content')
    let firstChild = mainDom.children[0]
    let button = document.createElement('button')
    button.innerHTML = name
    button.style.setProperty('margin-top', '10px')
    mainDom.insertBefore(button, firstChild)
    return button
}

function GetSingleOrder(orderNode) {
    // console.log('start GetSingleOrder', orderNode)
    let resp = {}

    let head = orderNode.children[0]
    if (true) {
        let left = head.children[0].children[0]
        resp.order_sn = left.innerText.match(/订单编号：\s*([\d-]+)/)[1]
        let right = left.nextElementSibling
        if (right) {
            // console.log('right', right, right.children)
            for (let i=0; i<right.children.length; ++i) {
                let child = right.children[i]
                let match = child.innerText.match(/订单成交时间：\s*([\s\S\d-:]+)/)
                if (match) resp.order_time = match[1]
                match = child.innerText.match(/承诺发货时间：\s*([\s\S\d-:]+)/)
                if (match) resp.promise_shipping_time = match[1]
            }
        }
    }
    // console.log('1', resp)

    let body = orderNode.getElementsByTagName('table')[0]
    let tdList = body.getElementsByTagName('td')

    if (true) {
        let td = tdList[0]
        let thumbImg = td.querySelector('.goods-record-container>img')
        resp.thumb_url = thumbImg.getAttribute('src')
        let rightNode = td.querySelector('.goods-record-container>div')
        resp.goods_name = rightNode.children[0].innerText.trim()
        for (let i=1; i+1<rightNode.children.length; ++i) {
            let child = rightNode.children[i]
            let match = child.innerText.trim().match(/ID:\s*(\d*)/)
            if (match) resp.goods_id = match[1]
            match = child.innerText.trim().match(/商家编码:\s*(\d*)/)
            if (match) resp.goods_id = match[1]
        }
        resp.spec = rightNode.children[rightNode.children.length - 1].innerText.trim() // 商家编码，感觉是sku
    }
    // console.log('2', resp)
    if (true) {
        let td = tdList[1]
        // console.log('tdList[1]', td, td.children, td.childNodes[0])
        let div = td.children[0]
        resp.order_status_str = div.childNodes[0].nodeValue.trim()
    }
    if (true) {
        let td = tdList[2]
        resp.goods_number = parseInt(td.innerText)
    }
    if (true) {
        let td = tdList[3]
        resp.goods_amount = parseInt(parseFloat(td.innerText) * 1e2) // 商品总价
    }
    if (true) {
        let td = tdList[4]
        resp.order_amount = parseInt(parseFloat(td.innerText) * 1e2) // 实收金额
    }
    if (true) {
        let td = tdList[5]
        resp.receive_name = td.innerText.trim()
    }
    if (true) {
        let td = tdList[6]
        let div = td.children[0]
        resp.nickname = div.childNodes[0].nodeValue.trim()
    }
    return resp
}

function GetOrders() {
    console.log('start GetOrders')
    let table = document.getElementsByClassName('package-center-table')[0]
    if (!table) return []
    let children = table.children
    let orders = []
    for (let i=0; i<children.length; ++i) {
        let child = children[i]
        if (child.nodeName.toLowerCase() === 'div') {
            let order = GetSingleOrder(child)
            orders.push(order)
        }
    }
    return orders
}

function SelectFilters() {
    console.log('start SelectFilters')
    document.querySelector('div[label="订单状态"]').nextElementSibling.querySelector('input').click() // 打开订单状态
    document.querySelector('.ST_dropdownPanel_4-103-1>li>div[data-tracking="87025"]').click() // 订单状态 全部
    document.querySelector('div[label="售后状态"]').nextElementSibling.querySelector('input').click() // 打开售后状态
    document.querySelector('.ST_dropdownPanel_4-103-1>li>div[data-tracking="87019"]').click() // 售后状态 全部
    document.querySelector('button.BTN_outerWrapper_4-103-1').click() // 查询
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 5000)
    })
}

function ChangePageSize() { // pageSize = 50
    console.log('start ChangePageSize')
    document.querySelector('div.PGT_sizeSelect_4-103-1').click()
    document.querySelector('ul.ST_dropdownPanel_4-103-1>li:last-of-type').click()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 5000)
    })
}

function HasNextPage() {
    console.log('start HasNextPage')
    let btn = document.querySelector('li[data-testid="beast-core-pagination-next"]')
    if (btn.className.search('disabled') === -1) return true
    return false
}

function NextPage() {
    console.log('start NextPage')
    let btn = document.querySelector('li[data-testid="beast-core-pagination-next"]')
    if (btn.className.search('disabled') !== -1) return
    btn.click()
    return new Promise((resolve, reject) => {
        console.log('已翻页，缓一缓，等10s')
        setTimeout(() => {
            resolve()
        }, 10000)
    })
}

function GetListDataAndSend() {
    console.log('start GetListDataAndSend')
    let GetData = () => {
        let userInfo = GetUserInfo()
        console.log('userInfo', userInfo)
        let orders = GetOrders()
        return {
            user_info: userInfo,
            orders: orders
        }
    }
    let data = GetData()
    console.log('GetData', data)
    return SendPddOrders(data).then(res => {
        console.log('SendPddOrders succ', res)
        // 打开详情页
        data.orders.forEach(order => {
            GetOrderBySn(order.order_sn).then(oldOrder => {
                // console.log('GetOrderBySn', order.order_sn, oldOrder)
                if (oldOrder.data.detail_receiver_phone) { // 有phone
                    if (oldOrder.data.detail_receiver_phone.search('查看手机号') === -1) { // phone里没有“查看手机号”
                        // 不需要再去详情
                        return
                    }
                }
                // 不能瞎点，就不跳了
                /*
                console.log('即将打开新页面', order.order_sn)
                let tab = GM_openInTab(`https://mms.pinduoduo.com/orders/detail?sn=${order.order_sn}`, true)
                */
            })
        })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data)
            }, 10000) // 缓一缓
        })
    }, err => {
        console.error('SendPddOrders fail', err)
    })
}

function JumpToFirstPage() {
    console.log('start JumpToFirstPage')
    document.querySelector('li.PGT_pagerItem_4-103-1').click()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
}

function GetAllListData(doNotSkip) {
    if (doNotSkip === undefined) doNotSkip = false
    console.log('start GetAllListData', doNotSkip)
    let userInfo = GetUserInfo()

    let timestamp = parseInt(new Date().getTime() / 1000) - 14 * 86400 // 14天前
    return GetListDataAndSend().then(data => {
        let ok = false
        if (!doNotSkip) { // skip
            for (let i=0; i<data.orders.length; ++i) { // 判断是否要skip掉老的数据
                if (data.orders[i].order_time) {
                    let orderTimestamp = parseInt(new Date(data.orders[i].order_time).getTime() / 1000)
                    if (orderTimestamp < timestamp) {
                        console.log('订单', data.orders[i], `早于14天前 ${timestamp}，不需继续更新了`, new Date(timestamp * 1e3))
                        ok = true
                        break
                    }
                }
            }
        }
        console.log('HasNextPage', HasNextPage(), 'ok', ok, 'doNotSkip', doNotSkip)
        if(HasNextPage() && !ok) {
            return NextPage().then(() => {
                return GetAllListData(doNotSkip)
            })
        }
    })

}

function ProcessList(doNotSkip) {
    if (doNotSkip === undefined) doNotSkip = false
    console.log('start ProcessList', doNotSkip)
    return SelectFilters().then(() => {
        return JumpToFirstPage().then(() => {
            //return ChangePageSize().then(() => {
                return GetAllListData(doNotSkip)
            //})
        })
    })
}

function LoopProcessList(doNotSkip) {
    if (doNotSkip === undefined) doNotSkip = false
    console.log('start LoopProcessList', doNotSkip)
    // 先执行一次
    ProcessList(doNotSkip)
    let interval = setInterval(() => {
        ProcessList(doNotSkip)
    }, 1000 * 60 * 10)
}

function CheckDetailReceiverInfo() {
    // 获取详细信息
    console.log('start CheckDetailReceiverInfo')
    let checkPhoneBtn = document.querySelector('a[data-tracking="86996"]')
    if (checkPhoneBtn) checkPhoneBtn.click()
    let checkNameAndAddr = document.querySelector('a[data-tracking="84302"]')
    if (checkNameAndAddr) checkNameAndAddr.click()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
}

function IsDetailPageLoaded() {
    let receiver = document.querySelector('div.buyer-receive-info>div:first-of-type>div:last-of-type')
    if (receiver) {
        return true
    }
    return false
}

function GetDetailOrder() {
    console.log('start GetDetailOrder')
    let resp = {}
    let receiver = document.querySelector('div.buyer-receive-info>div:first-of-type>div:last-of-type')
    let receiverList = receiver.innerText.split(' ')
    resp.detail_receiver_phone = receiverList.pop()
    resp.detail_receiver_name = receiverList.join(' ')

    let addr = document.querySelector('div.buyer-receive-info>div:last-of-type>div:last-of-type')
    resp.detail_receiver_addr = addr.innerText.trim()

    resp.order_sn = document.querySelector('#mf-mms-orders-container').innerText.match(/订单号：\s*([\d-]+)/)[1]
    return resp
}

function ProcessDetail() {
    let GetData = () => {
        let userInfo = GetUserInfo()
        console.log('userInfo', userInfo)
        let order = GetDetailOrder()
        return {
            user_info: userInfo,
            orders: [order]
        }
    }
    return CheckDetailReceiverInfo().then(() => {
        let data = GetData()
        console.log('GetData', data)
        return SendPddOrders(data).then(res => {
            console.log('SendPddOrders succ', res)
        }, err => {
            console.error('SendPddOrders fail', err)
        })
    })
}

(function() {
    'use strict';

    // Your code here...
    if (window.location.href.search('/orders/list') !== -1) {
        window.onload = () => {
            GM_setValue("start", false)
            let button = InsertButton("开始定时同步订单")
            button.onclick = () => {
                GM_setValue("start", true)
                LoopProcessList()
                button.setAttribute('disabled', 'true')
            }
            let button2 = InsertButton("同步全部订单")
            button2.onclick = () => {
                GM_setValue("start", true)
                ProcessList(true)
                button2.setAttribute('disabled', 'true')
            }
        }
    } else if (window.location.href.search('/orders/detail') !== -1) {
        let isStart = GM_getValue("start", false)
        if (isStart) {
            window.onload = () => {
                WaitUntil(IsDetailPageLoaded).then(() => {
                    setTimeout(() => {
                        ProcessDetail().then(() => {
                            window.close()
                        })
                    }, 3000) // load完主元素后再等一等
                })
            }
        }
    }
})();