// ==UserScript==
// @name         [考古加]榜单增强
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  榜单+拼多多搜索页跳转、筛选转化率、自然流量比例
// @author       windeng
// @match        https://www.kaogujia.com/detect/deepDetect
// @match        https://www.kaogujia.com/productDetails/linkDaren*
// @icon         https://www.google.com/s2/favicons?domain=kaogujia.com
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/433877-%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0-%E5%8B%BF%E5%AE%89%E8%A3%85/code/%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8B%BF%E5%AE%89%E8%A3%85.js?version=978987
// @downloadURL https://update.greasyfork.org/scripts/434243/%5B%E8%80%83%E5%8F%A4%E5%8A%A0%5D%E6%A6%9C%E5%8D%95%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/434243/%5B%E8%80%83%E5%8F%A4%E5%8A%A0%5D%E6%A6%9C%E5%8D%95%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver


async function adExtLink() {
    await WaitUntil(() => {
        return !!document.querySelector('.container')
    })

    function run() {
        let itemList = document.querySelectorAll('.container .item-wrap')
        for (let item of itemList) {
            if (item.querySelector('a[_cid]')) continue

            let titleTagElem = item.querySelector('.title-tag')
            let titleElem = titleTagElem.querySelector('a.title')
            let title = titleElem.innerText

            titleElem.setAttribute('style', 'display: inline;')

            let a = document.createElement('a')
            a.setAttribute('_cid', 'pdd-link')
            a.setAttribute('target', '_blank')
            a.setAttribute('href', `https://yangkeduo.com/search_result.html?search_key=${title}&search_type=goods`)
            a.setAttribute('class', 'title multi-ellipsis--l2')
            a.setAttribute('style', 'display: inline; margin-right: 3px;')
            a.innerText = '前往拼多多'

            titleTagElem.insertBefore(a, titleElem)

            let pid = titleElem.getAttribute('href').match(/id=(\S+)/)[1]

            a = document.createElement('a')
            a.setAttribute('_cid', 'daren-link')
            a.setAttribute('target', '_blank')
            a.setAttribute('href', `https://www.kaogujia.com/productDetails/linkDaren?id=${pid}`)
            a.setAttribute('class', 'title multi-ellipsis--l2')
            a.setAttribute('style', 'display: inline; margin-right: 3px;')
            a.innerText = '前往达人页'
            titleTagElem.insertBefore(a, titleElem)
        }
    }

    run()

    let observer = new MutationObserver(function(mutations) {
        // TODO do sth.
        run()
    })

    let container = document.querySelector('.container')
    console.log('container exists', container)
    observer.observe(container, {
        childList: true,
        subtree: true
    })
}

async function deepDetectMain () {
    adExtLink()
}

function parseNumber (s) {
    s = s.toLowerCase()
    if (s.endsWith('w')) return parseInt(parseFloat(s.substr(0, s.length - 1) * 10000))
    else return parseInt(s)
}

async function calcDarenRate () {
    await WaitUntil(() => {
        return !!document.querySelector('.right > .module_block')
    })

    let hasClicked = false

    async function run () {
        if (!hasClicked) {
            hasClicked = true
            let sortTh = await GetElementByText(document.querySelector('thead.has-gutter'), 'div.cell', '直播销量', true)
            // console.log('sortTh', sortTh)
            sortTh.click()
            await Sleep(2)
        }
        let trList = document.querySelectorAll('tbody > tr')
        let cnt = 0
        for (let tr of trList) {
            let td = tr.querySelector('td:nth-of-type(4)')
            // console.log(td)
            cnt += parseInt(td.innerText)
        }
        console.log('达人带货销量', cnt)

        // 30日销量
        let e = await GetElementByText(document.querySelector('#fl-3'), 'div', '商品销量', true)
        // console.log(e, e.previousSibling)
        let sells = parseNumber(e.previousSibling.innerText)

        let natureRate = parseFloat(((sells - cnt) / sells) * 100).toFixed(2) + '%'

        let container = document.querySelector('.right > .module_block')
        let containerSon = container.querySelector('div')
        let div = document.createElement('div')
        div.innerHTML = `<p style="margin-bottom: 3px;">达人带货销量：${cnt}</p>
        <p style="margin-bottom: 3px;">30日销量：${sells}</p>
        <p style="margin-bottom: 3px;">自然流量比例：${natureRate}</p>`
        container.insertBefore(div, containerSon)
        console.log('container', container)
        console.log('containerSon', containerSon)
        console.log('div', div)
    }

    run()

    /*
    let observer = new MutationObserver(function(mutations) {
        // TODO do sth.
        run()
    })

    let container = document.querySelector('.module_block')
    console.log('container exists', container)
    observer.observe(container, {
        childList: true,
        subtree: true
    })
    */
}

async function linkDarenMain () {
    calcDarenRate()
}


(function() {
    'use strict';

    // Your code here...
    console.log(window.location.href)
    if (window.location.href === 'https://www.kaogujia.com/detect/deepDetect') {
        deepDetectMain()
    } else if (window.location.href.search('linkDaren') !== -1) {
        linkDarenMain()
    }
})();