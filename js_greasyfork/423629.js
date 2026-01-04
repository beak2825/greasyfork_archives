// ==UserScript==
// @name         长河审批 ID 转换
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       fangxianli
// @match        https://ch.sankuai.com/approval-batch/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423629/%E9%95%BF%E6%B2%B3%E5%AE%A1%E6%89%B9%20ID%20%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/423629/%E9%95%BF%E6%B2%B3%E5%AE%A1%E6%89%B9%20ID%20%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isFinished = false
    let count = 0
    const removeUselessItems = () => {
        count++
        console.log({count})
        if (isFinished) return
        const needItemsText = ['首页金刚区角标', '首页功能区角标', '阿拉丁资源位', '美团小程序侧边栏', '美团小程序启动弹窗', '首页领券资源位', '聚合页领券资源位', '美团小程序顶通 banner', '团好货专区', '新客首页单品推荐运营位', '搜索起始页热词资源位', '简版大促通栏']
        const selectItems = [...document.querySelectorAll('.el-select-dropdown__item')]
        const needItems = selectItems.filter((item) => needItemsText.includes(item.innerText))
        const parentElement = needItems?.[0]?.parentElement
        if (!parentElement) {
            if (count < 30) setTimeout(removeUselessItems, 100)
        } else {
            isFinished = true;
            ([...parentElement.children]).forEach(child => {
                if (!needItemsText.includes(child.innerText)) {
                    child.style.display = 'none'
                } else {
                    child.addEventListener('click', () => {
                        document.querySelector('#hfeFormSearchBtnWrap').querySelector('button').click()
                    })
                }
            })
        }
    }
    removeUselessItems()

    // 默认选中 200/页
    const pagination = document.querySelector('div.el-pagination > span.el-pagination__sizes > div > div > input')
    pagination.click()
    const dropdownItems = [...document.querySelectorAll('.el-select-dropdown__item')]
    const pageItem = dropdownItems.find(item => item.innerText === '200条/页')
    pageItem.click()

    // 格式化搜索数据，删除无用数据
    const input = document.querySelector('.el-input__inner')
    const buttons = document.querySelectorAll('.el-button')
    let queryButton
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].innerText === '查询') {
            queryButton = buttons[i]
        }
    }
    input.addEventListener('paste', function (e) {
        window.clipboardData = e.clipboardData
        const updateValue = e.clipboardData.getData('text/plain')
        this.value = updateValue.replace(/[^\d,]/g, ',').split(',').filter(val => val && val.length === 6).join(',')
        const inputEvent = new InputEvent('input')
        this.dispatchEvent(inputEvent)
        this.select()
        document.execCommand('copy')
        queryButton.click()
    })
})();
