// ==UserScript==
// @name         抖店商品上传
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  抖店商品上传，本版本只搞列表
// @author       windeng
// @match        https://fxg.jinritemai.com/ffa/*
// @exclude      https://fxg.jinritemai.com/ffa/g/create
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @connect      8.129.106.241
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/429426/%E6%8A%96%E5%BA%97%E5%95%86%E5%93%81%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/429426/%E6%8A%96%E5%BA%97%E5%95%86%E5%93%81%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

async function Sleep(sleepSecs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, sleepSecs * 1000)
    })
}

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

async function GetGoodsList(page) {
    return Get(`https://fxg.jinritemai.com/product/tproduct/list?page=${page}&sort=desc&order_field=audit_time&pageSize=20&draft_status=0&presell_type=&comment_percent=&group_id=&pay_type=&is_channel=-1&business_type=4&is_online=1&check_status=3&status=0&supply_status=&appid=1`)
}

async function GetGoodsDetail(goodsId) {
    return Get(`https://fxg.jinritemai.com/product/tproduct/previewDetail?product_id=${goodsId}`)
}

async function GetShopInfo() {
    let nowMsTimestamp = new Date().getTime()
    return Get(`https://fxg.jinritemai.com/common/index/index?_=${nowMsTimestamp}&appid=1`)
}

async function UploadDoudianGoods(shopInfo, goodsDetail) {
    return Post(`http://8.129.106.241:15496/api/upload/doudian/goods`, {
        data: JSON.stringify({
            shop: shopInfo,
            goods: goodsDetail
        })
    })
}

async function UploadDoudianSimpleGoods(shopInfo, goods) {
    console.log('UploadDoudianSimpleGoods', shopInfo, goods)
    return Post(`http://8.129.106.241:15496/api/upload/doudian/simplegoods`, {
        data: JSON.stringify({
            shop: shopInfo,
            goods: goods
        })
    })
}

function showToast(msg, doNotFade) {
    let style = `position: fixed; right: 10px; top: 80px; width: 300px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

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


(async function() {
    'use strict';

    // Your code here...
    window.onload = async () => {
        console.log('抖店商品上传启动')
        showToast('抖店商品上传启动，刷新会重新触发流程')
        let shopInfo = await GetShopInfo()
        console.log('shopInfo', shopInfo)
        /*
        setTimeout(() => {
            showToast(`获取 ${shopInfo.data.shop_name} 店铺信息成功`)
        }, 500)
        */

        await Sleep(1)

        let total = 0
        let fail = 0

        for (let page = 0; page < 10000; page ++) {
            let goodsList = await GetGoodsList(page)
            console.log('GetGoodsList', page, goodsList)
            showToast(`正在获取第 ${page + 1} 页商品，共 ${goodsList.data.length} 条`)
            for (let goods of goodsList.data) {
                await UploadDoudianSimpleGoods(shopInfo, goods).catch(err => {
                    console.error('UploadDoudianSimpleGoods error', err)
                    fail++
                })
                total++
                /*
            await Sleep(0.1)
            let goodsDetail = await GetGoodsDetail(goods.product_id)
            console.log('GetGoodsDetail', goods.product_id, goodsDetail)
            UploadDoudianGoods(shopInfo, goodsDetail)
            */
            }
            if (goodsList.data.length < goodsList.size) {
                break
            }
            await Sleep(3)
        }

        showToast(`商品上传已完成，共计 ${total} 条，失败 ${fail} 条`, true)
    }
})();