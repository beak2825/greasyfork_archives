// ==UserScript==
// @name         Temu显示店铺信息
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Temu搜索页面信息显示,商品ID,商家名称
// @author       menkeng
// @license      GPLv3
// @match        https://www.temu.com/search_result.html*
// @match        https://www.temu.com/*-m-*
// @match        https://www.temu.com/*page_name=category*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501688/Temu%E6%98%BE%E7%A4%BA%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/501688/Temu%E6%98%BE%E7%A4%BA%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
// this.$ = this.jQuery = jQuery.noConflict(true)
console.log("Temu显示店铺信息已加载")
var shop_count = {}
var reg_shop_href = /www.temu.com\/.*-m-\d{13}/
var reg_search_href = /https:\/\/www\.temu\.com\/search_result\.html\?search_key=/
// 监听 popstate 事件
window.addEventListener("popstate", function (event) {
    checkUrl()
})
window.addEventListener("hashchange", function () {
    checkUrl()
})
window.onload = function () {
    checkUrl()
}
GM_registerMenuCommand("清除商品数据", function () {
    localStorage.removeItem("shopData")
})
function checkUrl() {
    var url = window.location.href
    console.log("当前页面：" + url)
    if (reg_shop_href.test(url)) {
        console.log("店铺页面")
        shop_page()
    } else if (reg_search_href.test(url)) {
        console.log("搜索页面")
        setTimeout(() => {
            search_page()
        }, 2000)
    } else if (url.includes("category")) {
        console.log("分类页面")
        setTimeout(() => {
            search_page()
        }, 2000)
    }
}

function shop_page() {
    var product_list_inner
    var shopData = localStorage_getStorage("shopData")
    var product_list = document.querySelectorAll("._3wENoqiV .EKDT7a3v")
    var shop_name = document.querySelector("h1").innerText
    product_list.forEach(async (product) => {
        var id_dom = product.querySelectorAll("div")[1]
        var product_id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        addData(shopData, shop_name, product_id)
    })
    if (document.querySelectorAll(".splide__list").length > 1) {
        console.log("有多个商品列表")
        var product_dom = document.querySelectorAll(".splide__list")
        for (var i = 0; i < product_dom.length; i++) {
            if (product_dom[i].children.length > 5) {
                product_list_inner = product_dom[i].querySelectorAll(".splide__slide")
            }
        }
        product_list_inner.forEach(function (product) {
            var id = product.querySelector("a").attributes.href.value
            var reg_g = /\d{15}/g
            id = id.match(reg_g)[0]
            addData(shopData, shop_name, id)
        })
    }

    localStorage.setItem("shopData", JSON.stringify(shopData))
    console.log("已记录店铺数据")
}
async function search_page() {
    var item_count = 0
    var product_list = document.querySelectorAll(".EKDT7a3v")
    var shop_data = localStorage_getStorage("shopData")
    product_list.forEach(async (product) => {
        item_count++
        if (item_count > 12) {
            await sleep(item_count * 10)
        }
        var id_dom = product.querySelectorAll("div")[1]
        var id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        var shop_name = findKeyByName(shop_data, id)
        if (!shop_count[shop_name]) {
            shop_count[shop_name] = 0
        }
        shop_count[shop_name]++
        updateShopCountDisplay(shop_count)
        var button = document.createElement("button")
        button.innerText = shop_name
        button.classList.add("shop_name")
        button.id = shop_name
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
        button.style.cssText = "padding: 10px 15px; border: none; cursor: pointer;z-index: 99999;color:black"
        button.onclick = function () {
            event.stopPropagation()
        }
        id_dom.appendChild(button)
    })
}
function updateShopCountDisplay(shop_count) {
    var shopCountContainer = document.querySelector(".shop-count-container")
    if (!shopCountContainer) {
        shopCountContainer = document.createElement("div")
        shopCountContainer.classList.add("shop-count-container")
        shopCountContainer.style.cssText = "position: fixed; top: 0; right: 0; background-color: white; padding: 10px; z-index: 100000;"
        document.body.appendChild(shopCountContainer)
    }
    shopCountContainer.innerHTML = ""

    for (var shop_name in shop_count) {
        var shopCountElement = document.createElement("div")
        shopCountElement.innerText = `${shop_name}: ${shop_count[shop_name]}`
        shopCountContainer.appendChild(shopCountElement)
    }
}
// ---------------------------------------------------工具类---------------------------------------------------
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
function localStorage_getStorage(name) {
    var data = localStorage.getItem(name)
    return data ? JSON.parse(data) : {}
}
// 创建反向映射
function createReverseMap(data) {
    const reverseMap = new Map()
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            data[key].forEach((item) => {
                reverseMap.set(item, key)
            })
        }
    }
    return reverseMap
}

function findKeyByItem(reverseMap, itemToFind) {
    return reverseMap.get(itemToFind) || null
}

function findKeyByName(data, itemToFind) {
    const reverseMap = createReverseMap(data)
    return findKeyByItem(reverseMap, itemToFind)
}
function addData(storage, key, value) {
    if (!storage[key]) {
        storage[key] = []
    }
    if (!storage[key].includes(value)) {
        storage[key].push(value)
    }
}
// upgrade
// 自动记录搜索关键字

// 店铺计数排序
// 销量统计(合并)
// 手动清空数据按钮
// (可选店铺清空数据按钮)

// 预计增加价格变化曲线
