// ==UserScript==
// @name         直播中控台增加刷单
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  刷单增强
// @author       windeng
// @match        https://buyin.jinritemai.com/dashboard/*
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/429767/%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0%E5%A2%9E%E5%8A%A0%E5%88%B7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429767/%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0%E5%A2%9E%E5%8A%A0%E5%88%B7%E5%8D%95.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

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

async function GetLiveGoodsIdList() {
    await WaitUntil(() => {
        return !!document.querySelector('div[data-rbd-droppable-id="list"]')
    })

    let elemList = document.querySelectorAll('div[data-rbd-droppable-id="list"] > div[data-rbd-draggable-id]')
    let idList = []
    for (let i=0; i<elemList.length; ++i) {
        let elem = elemList[i]
        let goodsId = elem.getAttribute('data-rbd-draggable-id')
        idList.push(goodsId)
    }

    return idList
}

async function GetShopName() {
    await WaitUntil(() => {
        return !!document.querySelector('div.btn-item-role-exchange-name span:first-of-type')
    })
    let shopName = document.querySelector('div.btn-item-role-exchange-name span:first-of-type').innerText
    return shopName
}

async function GetGoodsSellNum(shopName, goodsIdList) {
    let goodsIdListStr = goodsIdList.join(',')
    return Get(`http://8.129.106.241:15496/api/goods_sell_num?shop_name=${shopName}&goods_id_list=${goodsIdListStr}`)
}

async function AddSellNumElement(goodsSellNum) {
    // 将累计已售添加到页面中
    let goodsIdToSell = {}
    for (let i = 0; i < goodsSellNum.data.length; ++i) {
        goodsIdToSell[goodsSellNum.data[i].goods_id] = goodsSellNum.data[i]
    }
    let divList = document.querySelectorAll('div[data-rbd-droppable-id="list"] > div[data-rbd-draggable-id] > div:nth-of-type(3) > div:nth-of-type(2)') // 售价那一行的div
    for (let i = 0; i < divList.length; ++i) {
        let div = divList[i]
        if (div.querySelector('span[_cid="total-sell"]')) continue // 已有

        let goodsId = div.parentNode.parentNode.getAttribute('data-rbd-drag-handle-draggable-id')
        let sellNum = '-'
        if (goodsIdToSell[goodsId]) {
            sellNum = goodsIdToSell[goodsId].sell_num
        }

        // console.log('?', div, div.querySelector('span:nth-last-child(2)'))

        let dividerSpan = div.querySelector('span:nth-last-child(2)').cloneNode(true)
        div.appendChild(dividerSpan)

        let span = document.createElement('span')
        span.setAttribute('_cid', 'total-sell')
        span.setAttribute('class', 'spanClass')
        span.innerHTML = `累计已售: <span style="color: red; font-weight: bold;">${sellNum}</span>`
        div.appendChild(span)
    }
}

function GetElementByText(selector, text, exist) {
    /*
    selector: 选择器
    text: 内容
    exist: 是否只要存在就ojbk
    */
    exist = exist || false
    let elemList = document.querySelectorAll(selector)
    for (let i = 0; i < elemList.length; ++i) {
        let elem = elemList[i]
        if (exist) {
            if (elem.innerText.search(text) !== -1) return elem
        } else {
            if (elem.innerText === text) return elem
        }
    }
}

async function GetBrushArrangement (shopName, items, target) {
    return Get(`http://8.129.106.241:15496/api/brush_arrangement?shop_name=${shopName}&items=${items}&target=${target}`)
}

async function AddGenerateBrushResultElement() {
    // 添加生成刷单列表的元素
    let tmpElem = GetElementByText('h3', '直播商品')
    console.log('直播商品elem', tmpElem)
    let tmpElemDad = tmpElem.parentNode
    let tmpElemUncle = tmpElemDad.nextSibling
    let tmpElemGrandDad = tmpElemDad.parentNode

    if (tmpElemGrandDad.querySelector('input[_cid="brush-input"]')) return

    let div = document.createElement('div')
    div.setAttribute('style', 'margin: 10px 0')
    div.innerHTML = `<input _cid="brush-input" placeholder="刷单安排，形如： 1:5|2:7|3:4|1,2:4|..." type="text" class="ant-input" />
    <button _cid="brush-summit" type="button" class="ant-btn ant-btn-dashed">生成</button>`
    tmpElemGrandDad.insertBefore(div, tmpElemUncle)

    await Sleep(0.3)

    // 注册事件，处理回调
    let btn = document.querySelector('button[_cid="brush-summit"]')
    let input = document.querySelector('input[_cid="brush-input"]')
    console.log('获得添加的提交按钮和输入框', btn, input)
    btn.onclick = async (e) => {
        let goodsIdList = await GetLiveGoodsIdList()
        let tmp = []
        for (let i=0; i<goodsIdList.length; ++i) {
            tmp.push(`${i+1},${goodsIdList[i]}`)
        }
        let items = tmp.join(';')
        let target = input.value
        let shopName = await GetShopName()
        console.log(`即将提交刷单生成请求 target ${target}, items ${items}, shop_name ${shopName}`)
        let resp = await GetBrushArrangement(shopName, items, target)
        console.log('GetBrushArrangement resp', resp)

        const blob = new Blob([atob(resp.data.csv)]);
        const fileName = `brush_arrangement.csv`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}

async function DoLiveControlMainLogic() {
    // 处理直播商品列表
    async function run() {
        let goodsIdList = await GetLiveGoodsIdList()
        console.log('goodsIdList', goodsIdList)
        let shopName = await GetShopName()
        let goodsSellNum = await GetGoodsSellNum(shopName, goodsIdList)
        console.log('goodsSellNum', goodsSellNum)
        await AddSellNumElement(goodsSellNum)

        await AddGenerateBrushResultElement()
    }

    await WaitUntil(() => {
        return !!document.querySelector('div[data-rbd-droppable-id="list"]')
    })

    run()

    let observer = new MutationObserver(function(mutations) {
        // TODO do sth.
        run()
    })

    let elem = document.querySelector('div[data-rbd-droppable-id="list"]')
    console.log('elem exists', elem)
    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function GetDrawerGoodsIdList() {
    // 添加商品的弹窗
    console.log('GetDrawerGoodsIdList start')
    await WaitUntil(() => {
        return !!document.querySelector('div.drawer-content')
    })

    let elemList = document.querySelectorAll('div.drawer-content div.ant-tabs-tabpane-active div.ant-checkbox-group > div > label input')
    let idList = []
    for (let i=0; i<elemList.length; ++i) {
        let elem = elemList[i]
        let goodsId = elem.getAttribute('value')
        idList.push(goodsId)
    }

    return idList
}

async function AddDrawerSellNumElement(goodsSellNum) {
    // 将累计已售添加到页面中
    let goodsIdToSell = {}
    for (let i = 0; i < goodsSellNum.data.length; ++i) {
        goodsIdToSell[goodsSellNum.data[i].goods_id] = goodsSellNum.data[i]
    }
    let divList = document.querySelectorAll('div.drawer-content div.ant-tabs-tabpane-active div.ant-checkbox-group > div > div:last-of-type > div:nth-of-type(2) > div:nth-of-type(3)') // 售价那一行的div
    for (let i = 0; i < divList.length; ++i) {
        let div = divList[i]
        if (div.querySelector('span[_cid="total-sell"]')) continue // 已有

        let goodsId = div.parentNode.parentNode.parentNode.querySelector('label input').getAttribute('value')
        let sellNum = '-'
        if (goodsIdToSell[goodsId]) {
            sellNum = goodsIdToSell[goodsId].sell_num
        }

        let span = div.querySelector('span:last-of-type').cloneNode(true)
        console.log('span', span)
        span.setAttribute('_cid', 'total-sell')
        span.innerHTML = `累计已售: <span style="color: red; font-weight: bold;">${sellNum}</span>`
        div.appendChild(span)
    }
}

async function DoDrawerLogic() {
    // 添加商品的弹窗
    async function run() {
        let goodsIdList = await GetDrawerGoodsIdList()
        console.log('DoDrawerLogic goodsIdList', goodsIdList)
        let shopName = await GetShopName()
        let goodsSellNum = await GetGoodsSellNum(shopName, goodsIdList)
        console.log('DoDrawerLogic goodsSellNum', goodsSellNum)
        await AddDrawerSellNumElement(goodsSellNum)
    }

    await WaitUntil(() => {
        return !!GetElementByText('button', '添加商品')
    })

    let btn = GetElementByText('button', '添加商品')
    console.log('添加商品button', btn)
    let _onclick = btn.onclick
    btn.onclick = async function(e) {
        _onclick(e)

        run()

        await WaitUntil(() => {
            return !!document.querySelector('div.drawer-content')
        })

        let observer = new MutationObserver(function(mutations) {
            // TODO do sth.
            run()
        })

        let elem = document.querySelector('div.drawer-content')
        console.log('DoDrawerLogic elem exists', elem)
        observer.observe(elem, {
            childList: true,
            subtree: true
        })
    }
}

async function DoLiveControl() {
    console.log('DoLiveControl start')
    DoLiveControlMainLogic()
    DoDrawerLogic()
}

(async function() {
    'use strict';

    // Your code here...
    function onUrlChange() {
        if (window.location.href === 'https://buyin.jinritemai.com/dashboard/live/control') {
            DoLiveControl()
        }
    }

    window.addEventListener('popstate', function(event) {
        // console.log('???', event, window.location.href)
        onUrlChange()
    })

})();