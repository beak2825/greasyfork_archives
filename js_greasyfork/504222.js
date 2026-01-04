// ==UserScript==
// @name         天眼查列表界面公司名称复制
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  天眼查搜索列表-公司名称复制按钮
// @author       hongzhi
// @match        https://www.tianyancha.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianyancha.com
// @require      https://cdn.jsdelivr.net/npm/coco-message@2.0.3/coco-message.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504222/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%88%97%E8%A1%A8%E7%95%8C%E9%9D%A2%E5%85%AC%E5%8F%B8%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504222/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%88%97%E8%A1%A8%E7%95%8C%E9%9D%A2%E5%85%AC%E5%8F%B8%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    // Your code here...

    function initCopyBtn() {
        const domList = document.querySelectorAll('div[class^="index_search-box"] div[class^="index_header"]')
        for (let index = 0; index < domList.length; index++) {
            const domItem = domList[index]
            const companyNameDom = domItem.querySelector('div[class^="index_name"]')
            const detailUrl = companyNameDom.querySelector('a').attributes.getNamedItem('href').value
            const companyId = _.last(detailUrl.split('/'))
            addCopyBtn(domItem, '复制', companyNameDom.innerText)
            addCopyBtn(domItem, '复制id', `${companyNameDom.innerText}@${companyId}`)
        }
    }

    function addCopyBtn(targeDom, textVal, copyVal) {
        const copyDom = document.createElement('a')
        copyDom.innerText = textVal
        copyDom.addEventListener('click', (e) => {
            navigator.clipboard.writeText(copyVal).then(() => cocoMessage.success('复制成功'))
        })
        copyDom.addEventListener('mousemove', (e) => {
            e.target.style.color = '#927ffa'
        })
        copyDom.addEventListener('mouseout', (e) => {
            e.target.style.color = '#6553EE'
        })
        copyDom.classList = 'copyBtn'
        copyDom.style =
            'font-size: 16px;font-weight: 400;color:#6553EE;height: 22px;text-align: center;white-space: nowrap;vertical-align: middle;margin-left: 8px;'
        targeDom.append(copyDom)
    }

    function watchListChange() {
        const targetNode = document.querySelector('div[class^="index_search-main"] div[class^="index_search-list-wrap"]')
        const targetNode1 = document.querySelector('div[class^="index_search-main"] div[class^="index_content-wraper"]')
        const config = { attributes: false, childList: true, subtree: false }
        const callback = _.debounce((mutationsList, observer) => {
            console.log('mutationsList', mutationsList)
            initCopyBtn()
        }, 150)
        const observer = new MutationObserver(callback)
        observer.observe(!_.isEmpty(targetNode) ? targetNode : targetNode1, config)
    }

    initCopyBtn()
    watchListChange()
})()
