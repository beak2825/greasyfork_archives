// ==UserScript==
// @name         GVP-Select-Box
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  GVP - Gitee最有价值开源项目 的项目列表按照 star、fork 和编程语言进行筛选排序，增强使用体验
// @author       qdz
// @match        https://gitee.com/gvp/all
// @icon         https://gitee.com/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492304/GVP-Select-Box.user.js
// @updateURL https://update.greasyfork.org/scripts/492304/GVP-Select-Box.meta.js
// ==/UserScript==

(function () {
    "use strict"

    // DOM树构建完成之后触发
    document.addEventListener('DOMContentLoaded', () => {
        main()
    })

    // 排序类型 star | fork
    let sortType = "star"

    // card所包含的编程语言
    let languages = []

    // 选中的编程语言
    let checkedLanguages = []

    // 给没有编程语言标签的项目取一个标签名
    let undefinedLanguage = '无标签'

    // 定位元素
    let positionElement = null

    // card父容器元素
    let cardContainerElement = null

    // card数量元素
    let cardNumberElement = null

    // card原始数据
    let originalCardArray = null

    // 入口函数
    function main() {
        let result = initPageElement()
        if (result) {
            initLanguage()
            renderBox()
            addSelectListener()
        }
    }

    function initPageElement() {
        positionElement = document.querySelector("#open-source-vip-page .gvp-category-container")
        cardContainerElement = document.querySelector("#open-source-vip-page .categorical-project-cards")
        cardNumberElement = document.querySelector('#open-source-vip-page .breadcrumb .text-muted')
        originalCardArray = Array.from(document.querySelectorAll("#open-source-vip-page .categorical-project-cards > div"))

        return positionElement && cardContainerElement && cardNumberElement && originalCardArray.length > 0
    }

    function initLanguage() {
        const languageMap = new Map()

        originalCardArray.forEach((item) => {
            let language = item.querySelector('.project-labels > div')?.innerText
            // 没有编程语言标签的项目给一个默认值
            let key = language === undefined ? undefinedLanguage : language
            // 不存在则设置值为1，存在则+1
            increment(languageMap, key)
        })

        // 将Map按照值的大小进行降序排序后，再获取排序后的键名数组
        languages = Array.from(languageMap).sort((a, b) => b[1] - a[1]).map(item => item[0])
        checkedLanguages = [...languages]
    }

    function renderBox() {
        // 定位元素设置相对定位，方便子元素进行绝对定位
        positionElement.style.position = "relative"

        // 将selectBox追加到定位元素的最后一个子元素之后
        positionElement.insertAdjacentHTML("beforeend", htmlCode)

        // 渲染编程语言checkbox
        let languageElements = ""
        languages.forEach((item) => {
            languageElements += `<label><input type="checkbox" value="${item}" checked /><span>${item}</span></label>`
        })
        document.getElementById("_languageBox").insertAdjacentHTML("beforeend", languageElements)

        // 往head元素追加css
        const styleElement = document.createElement("style")
        styleElement.appendChild(document.createTextNode(cssCode))
        document.head.appendChild(styleElement)
    }

    function renderCard() {
        // 清空card容器中的数据
        cardContainerElement.innerHTML = ""

        // 根据选中的编程语言进行过滤
        const filteredCards = originalCardArray.filter((item) => {
            const language = item.querySelector(".label")?.innerText
            // 没有编程语言标签的项目给一个默认值
            return checkedLanguages.includes(language === undefined ? undefinedLanguage : language)
        })

        // 根据排序类型，降序排序
        filteredCards.sort((a, b) => {
            const countA = convertToNumber(a.querySelector(`.icon-${sortType} + span`)?.innerText)
            const countB = convertToNumber(b.querySelector(`.icon-${sortType} + span`)?.innerText)
            return countB - countA
        })

        // 重新往card容器中添加数据
        filteredCards.forEach((item) => {
            cardContainerElement.appendChild(item)
        })

        // 重新渲染数量
        cardNumberElement.innerText = '(' + cardContainerElement.children.length + ')'
    }

    function addSelectListener() {
        // 排序类型添加监听事件
        const sortTypeElement = document.getElementById("_sortTypeBox")
        sortTypeElement.addEventListener("change", (event) => {
            if (event.target.type === "radio" && event.target.name === "sortType") {
                sortType = event.target.value

                // 重新渲染card
                renderCard()
            }
        })

        // 编程语言添加监听事件
        const languageElement = document.getElementById("_languageBox")
        languageElement.addEventListener("change", (event) => {
            if (event.target.type === "checkbox") {
                // 清空编程语言列表
                checkedLanguages = []

                // 获取所有选中的编程语言元素
                const checkedElements = languageElement.querySelectorAll('input[type="checkbox"]:checked')
                checkedElements.forEach((item) => {
                    checkedLanguages.push(item.value)
                })

                // 重新渲染cards
                renderCard()
            }
        })

        // 编程语言全选按钮添加监听事件
        const checkAllLanguageElement = document.getElementById("_checkAll")
        checkAllLanguageElement.addEventListener("change", (event) => {
            if (event.target.type === "checkbox" && languages.length > 0) {
                // 全选按钮的选中状态
                let state = event.target.checked

                // 全选则赋值所有编程语言，取消全选则清空
                checkedLanguages = state ? languages : []

                // 遍历所有编程语言元素，更改选中状态
                const languageLabelElements = languageElement.querySelectorAll("#_languageBox > label")
                languageLabelElements.forEach((item) => {
                    item.querySelector("input[type='checkbox']").checked = state
                })
            }

            // 重新渲染cards
            renderCard()
        })
    }

    // Map键名不存在则值赋值为1，存在则值自增1
    function increment(map, key) {
        if (map.has(key)) {
            map.set(key, map.get(key) + 1)
        } else {
            map.set(key, 1)
        }
    }

    // 转换具体的数量，1k = 1000，未包含数量的，默认为0
    function convertToNumber(str = '0') {
        return str.includes('K') ? parseFloat(str.replace('K', '')) * 1000 : parseInt(str)
    }

    const htmlCode = `
    <div id="_selectBox">
        <p>排序类型</p>
        <div id="_sortTypeBox">
            <label>
                <input type="radio" name="sortType" value="star" />
                <span>Star</span>
            </label>
            <label>
                <input type="radio" name="sortType" value="fork" />
                <span>Fork</span>
            </label>
        </div>
        <p>编程语言</p>
        <label>
            <input id="_checkAll" type="checkbox" value="checkAll" checked />
            <span>全选</span>
        </label>
        <div id="_languageBox"></div>
    </div>
    `

    const cssCode = `
    #_selectBox {
        position: absolute;
        top: 0px;
        right: -205px;
        width: 205px;
        background-color: #fff;
        padding: 0px 2px 2px 10px;
        border: 1px solid #e3e9ed;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    #_selectBox p {
        display: inline-block;
        margin: 12px 0;
        font-size: 14px;
        font-weight: bold;
    }

    #_languageBox {
        display: flex;
        flex-wrap: wrap;
    }

    #_languageBox label {
        margin-bottom: 8px;
        margin-right: 8px;
    }

    #_sortTypeBox input[type="radio"],
    #_languageBox input[type="checkbox"],
    #_checkAll[type="checkbox"] {
        display: none;
    }

    #_sortTypeBox input[type="radio"]+span,
    #_languageBox input[type="checkbox"]+span,
    #_checkAll+span {
        padding: 3px 6px;
        background-color: #ddd;
        color: #666;
        border-radius: 10px;
        cursor: pointer;
        font-size: 12px;
    }

    #_sortTypeBox input[type="radio"]:checked+span {
        background-color: #4caf50;
        color: #fff;
    }

    #_languageBox input[type="checkbox"]:checked+span {
        background-color: #4caf50;
        color: #fff;
    }

    #_checkAll:checked+span {
        background-color: #4caf50;
        color: #fff;
    }
    `

})()
