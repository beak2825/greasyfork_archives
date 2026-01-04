// ==UserScript==
// @name         [私人用]巨量百应&补单
// @namespace    -
// @version      0.3
// @description  增加补单能力
// @author       windeng
// @match        https://buyin.jinritemai.com/dashboard/live/list
// @match        https://buyin.jinritemai.com/dashboard/live/control
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/429437/%5B%E7%A7%81%E4%BA%BA%E7%94%A8%5D%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E8%A1%A5%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429437/%5B%E7%A7%81%E4%BA%BA%E7%94%A8%5D%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E8%A1%A5%E5%8D%95.meta.js
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

async function GetGoodsTaskCount(shopName, goodsIdList) {
    let resp = await Get(`http://8.129.106.241:15496/api/goods_task_count?shop_name=${shopName}&goods_id_list=${goodsIdList.join(',')}`)
    let d = {}
    for (let i=0; i<resp.data.length; ++i) {
        d[resp.data[i].goods_id] = resp.data[i].sum_count
    }
    return d
}

async function HandleAddGoodsDrawer() { // 处理“添加商品”的侧边栏

    await WaitUntil(() => {
        return !!document.querySelector('div.btn-item-role-exchange-name span:first-of-type')
    })
    let shopName = document.querySelector('div.btn-item-role-exchange-name span:first-of-type').innerText

    let fillTableDoing = false

    async function FillTable() {
        if (fillTableDoing) return
        fillTableDoing = true
        try {
            await _FillTable()
        } catch (e) {
            console.error('_FillTable error', e)
        } finally {
            fillTableDoing = false
        }
        return
    }

    async function _FillTable() {
        // 给表格填充上“已刷单数”
        let trList = document.querySelectorAll('div.ant-drawer-content table tr')
        if (!trList[0].querySelector('th[_cid="count"]')) {
            // add th
            let th = document.createElement('th')
            th.setAttribute('class', 'ant-table-cell')
            th.setAttribute('_cid', 'count')
            th.innerText = '已刷单数'
            trList[0].appendChild(th)
        }

        let goodsIdList = []
        for (let i=1; i<trList.length; ++i) {
            let tr = trList[i]
            if (!tr.getAttribute('data-row-key')) continue
            if (tr.querySelector('td[_cid="count"]')) continue
            let goodsId = tr.getAttribute('data-row-key').split(',')[0]
            goodsIdList.push(goodsId)
        }
        let goodsIdCount = await GetGoodsTaskCount(shopName, goodsIdList)

        // add td
        for (let i=1; i<trList.length; ++i) {
            let tr = trList[i]
            if (!tr.getAttribute('data-row-key')) continue
            if (tr.querySelector('td[_cid="count"]')) continue
            // console.log(tr, tr.getAttribute('data-row-key'))
            let goodsId = tr.getAttribute('data-row-key').split(',')[0]
            let td = document.createElement('td')
            td.setAttribute('class', 'ant-table-cell')
            td.setAttribute('_cid', 'count')
            let count = goodsIdCount[goodsId] || '-'
            td.innerText = '' + count
            tr.appendChild(td)
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('element change', mutation)
        })
        FillTable()
    })

    await WaitUntil(() => {
        let elem = document.querySelector('div.ant-drawer-content')
        // console.log('in WaitUntil', elem, !!elem)
        return !!elem
    })

    let elem = document.querySelector('div.ant-drawer-content table')
    console.log('elem exists', elem)
    await FillTable()
    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function HandleGoodsTable() {
    await WaitUntil(() => {
        return !!document.querySelector('div.btn-item-role-exchange-name span:first-of-type')
    })
    let shopName = document.querySelector('div.btn-item-role-exchange-name span:first-of-type').innerText

    let fillTableDoing = false

    async function FillTable() {
        if (fillTableDoing) return
        fillTableDoing = true
        try {
            await _FillTable()
        } catch (e) {
            console.error('_FillTable error', e)
        } finally {
            fillTableDoing = false
        }
        return
    }

    async function _FillTable() {
        // 给表格填充上“已刷单数”

        let theadTr = document.querySelector('div.goods-table-wrapper .ant-table-header table tr')
        if (!theadTr.querySelector('th[_cid="count"]')) {
            // add th
            let th = document.createElement('th')
            th.setAttribute('class', 'ant-table-cell')
            th.setAttribute('_cid', 'count')
            th.innerText = '已刷单数'
            theadTr.insertBefore(th, theadTr.querySelector('th:nth-of-type(1)'))
        }

        let trList = document.querySelectorAll('div.goods-table-wrapper .ant-table-body table tr')
        let goodsIdList = []
        for (let i=1; i<trList.length; ++i) {
            let tr = trList[i]
            if (tr.querySelector('td[_cid="count"]')) {
                continue
            }
            let goodsId = tr.getAttribute('data-row-key').split(',')[0]
            goodsIdList.push(goodsId)
        }
        let goodsIdCount = await GetGoodsTaskCount(shopName, goodsIdList)

        for (let i=1; i<trList.length; ++i) {
            let tr = trList[i]
            if (tr.querySelector('td[_cid="count"]')) {
                continue
            }
            let goodsId = tr.getAttribute('data-row-key').split(',')[0]
            let td = document.createElement('td')
            td.setAttribute('class', 'ant-table-cell')
            td.setAttribute('_cid', 'count')
            let count = goodsIdCount[goodsId] || '-'
            td.innerText = '' + count
            tr.insertBefore(td, tr.querySelector('td:nth-of-type(1)'))
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('element change', mutation)
        })
        FillTable()
    })

    await WaitUntil(() => {
        let elem = document.querySelector('div.goods-table-wrapper')
        // console.log('in WaitUntil', elem, !!elem)
        return !!elem
    })

    let elem = document.querySelector('div.goods-table-wrapper')
    console.log('elem exists', elem)
    await FillTable()
    observer.observe(elem, {
        childList: true,
        subtree: true
    })

}

async function PageLiveGoodsManager() { // 直播商品管理，这页面好似打算下线
    if (window.location.href !== 'https://buyin.jinritemai.com/dashboard/live/list') return
    HandleAddGoodsDrawer()
    HandleGoodsTable()
}

async function PageLiveControlHandleAddGoodsDrawer() { // 处理“添加商品”的侧边栏

    await WaitUntil(() => {
        return !!document.querySelector('div.btn-item-role-exchange-name span:first-of-type')
    })
    let shopName = document.querySelector('div.btn-item-role-exchange-name span:first-of-type').innerText

    let fillTableDoing = false

    async function FillTable() {
        if (fillTableDoing) return
        fillTableDoing = true
        try {
            await _FillTable()
        } catch (e) {
            console.error('_FillTable error', e)
        } finally {
            fillTableDoing = false
        }
        return
    }

    async function _FillTable() {
        // 给表格填充上“已刷单数”

        function GetPriceElem(div) { // 拿到那个有商品id的span元素
            let spanList = div.querySelectorAll('span')
            for (let i=0; i<spanList.length; ++i) {
                if (spanList[i].innerText.search('售价') === 0) return spanList[i]
            }
        }

        let divList = document.querySelectorAll('div.ant-tabs-tabpane.ant-tabs-tabpane-active[aria-hidden="false"][id^="rc-tabs-0"] .ant-checkbox-group > div')
        let goodsIdList = []
        for (let i=0; i<divList.length; ++i) {
            let div = divList[i]
            if (div.querySelector('span[_cid="count"]')) continue
            let input = div.querySelector('input.ant-checkbox-input')
            if (!input) continue
            let goodsId = input.getAttribute('value')
            goodsIdList.push(goodsId)
        }
        let goodsIdCount = await GetGoodsTaskCount(shopName, goodsIdList)
        console.log('PageLiveControlHandleAddGoodsDrawer goodsIdCount', goodsIdCount)

        for (let i=0; i<divList.length; ++i) {
            let div = divList[i]
            if (div.querySelector('span[_cid="count"]')) continue
            let input = div.querySelector('input.ant-checkbox-input')
            if (!input) continue
            let goodsId = input.getAttribute('value')

            let priceSpan = GetPriceElem(div)
            let span = document.createElement('span')
            span.setAttribute('_cid', 'count')
            span.setAttribute('style', 'margin-left: 10px;')
            let count = goodsIdCount[goodsId] || '-'
            span.setAttribute('brush', goodsIdCount[goodsId] || 0)
            span.innerHTML = `已刷: <span style="color: red; font-weight: bold;">${count}</span>`
            priceSpan.parentNode.appendChild(span)
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('element change', mutation)
        })
        FillTable()
    })

    await WaitUntil(() => {
        let elem = document.querySelector('div.ant-tabs-content-holder')
        // console.log('in WaitUntil', elem, !!elem)
        return !!elem
    })

    let elem = document.querySelector('div.ant-tabs-content-holder')
    console.log('elem exists', elem)
    await FillTable()
    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function PageLiveControlHandleGoodsTable() {
    await WaitUntil(() => {
        return !!document.querySelector('div.btn-item-role-exchange-name span:first-of-type')
    })
    let shopName = document.querySelector('div.btn-item-role-exchange-name span:first-of-type').innerText

    let fillTableDoing = false

    async function FillTable() {
        if (fillTableDoing) return
        fillTableDoing = true
        try {
            await _FillTable()
        } catch (e) {
            console.error('_FillTable error', e)
        } finally {
            fillTableDoing = false
        }
        return
    }

    async function _FillTable() {
        // 给表格填充上“已刷单数”

        function GetGoodsIdElem(div) { // 拿到那个有商品id的span元素
            let spanList = div.querySelectorAll('span')
            for (let i=0; i<spanList.length; ++i) {
                if (spanList[i].innerText.match(/ID:\s*\d+/)) return spanList[i]
            }
        }

        let divList = document.querySelectorAll('div[data-rbd-droppable-id="list"] > div')
        let goodsIdList = []
        for (let i=0; i<divList.length; ++i) {
            let div = divList[i]
            if (div.querySelector('span[_cid="count"]')) continue

            let goodsIdElem = GetGoodsIdElem(div)
            if (!goodsIdElem) continue
            let goodsId = goodsIdElem.innerText.match(/ID:\s*(\d+)/)[1]
            goodsIdList.push(goodsId)
        }
        let goodsIdCount = await GetGoodsTaskCount(shopName, goodsIdList)
        for (let i=0; i<divList.length; ++i) {
            let div = divList[i]
            if (div.querySelector('span[_cid="count"]')) continue

            let goodsIdElem = GetGoodsIdElem(div)
            if (!goodsIdElem) continue
            let goodsId = goodsIdElem.innerText.match(/ID:\s*(\d+)/)[1]
            // console.log(goodsIdElem, goodsId)
            let span = document.createElement('span')
            span.setAttribute('_cid', 'count')
            span.setAttribute('style', 'margin-left: 10px;')
            let count = goodsIdCount[goodsId] || '-'
            span.setAttribute('brush', goodsIdCount[goodsId] || 0)
            span.innerHTML = `已刷: <span style="color: red; font-weight: bold;">${count}</span>`
            goodsIdElem.parentNode.appendChild(span)
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('element change', mutation)
        })
        FillTable()
    })

    await WaitUntil(() => {
        let elem = document.querySelector('div[data-rbd-droppable-id="list"]')
        // console.log('in WaitUntil', elem, !!elem)
        return !!elem
    })

    let elem = document.querySelector('div[data-rbd-droppable-id="list"]')
    console.log('elem exists', elem)
    await FillTable()
    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function PageLiveControlAddEasySelector() { // 一键选中已刷小于xx的商品

    await WaitUntil(() => {
        return !!document.querySelector('body')
    })

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
    function selectGoods() {
      let inputElem = document.querySelector('input#filter-select')
      let value = inputElem.value
      console.log('!!!!!!', value)
    }`
    document.querySelector('body').appendChild(script)

    function AddSelector() {
        function GetAllSelectElem() { // 拿到那个全选按钮的span
            let spanList = document.querySelectorAll('div.ant-tabs-content-holder span')
            for (let i=0; i<spanList.length; ++i) {
                // console.log(spanList[i], spanList[i].innerText)
                if (spanList[i].innerText.trim() === '全选') return spanList[i]
            }
        }

        let div = document.querySelector('div.ant-tabs-content-holder')
        if (!div.querySelector('span[_cid="filter-select"]')) {
            let allSelectElem = GetAllSelectElem()
            let span = document.createElement('span')
            span.setAttribute('_cid', 'filter-select')
            span.innerHTML = `
            <span>选择已刷小于</span>
            <span class="ant-input-affix-wrapper" style="max-width: 50px;">
              <input class="ant-input" type="text" id="filter-select"/>
            </span>
            <button type="button" class="ant-btn ant-btn-dashed" ant-click-animating-without-extra-node="false" onclick="selectGoods">
              <span>勾选</span>
            </button>`
            allSelectElem.parentNode.parentNode.insertBefore(span, allSelectElem.parentNode.nextSibling)
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log('element change', mutation)
        })
        AddSelector()
    })

    await WaitUntil(() => {
        let elem = document.querySelector('div.ant-tabs-content-holder')
        // console.log('in WaitUntil', elem, !!elem)
        return !!elem
    })

    let elem = document.querySelector('div.ant-tabs-content-holder')
    console.log('elem exists', elem)
    await AddSelector()
    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function PageLiveControl() { // 直播中控台
    if (window.location.href !== 'https://buyin.jinritemai.com/dashboard/live/control') return
    PageLiveControlHandleAddGoodsDrawer()
    PageLiveControlHandleGoodsTable()
    PageLiveControlAddEasySelector()
}

(function() {
    'use strict';

    // Your code here...
    PageLiveGoodsManager()
    PageLiveControl()
})();

