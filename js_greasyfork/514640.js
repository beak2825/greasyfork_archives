// ==UserScript==
// @name         ZZ16Z OJ UI 美化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  美化 ZZ16Z OJ UI。
// @author       Vistamin, SLIGHTNING
// @match        http://1.192.219.102:5214/*
// @icon         http://1.192.219.102:5214/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514640/ZZ16Z%20OJ%20UI%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/514640/ZZ16Z%20OJ%20UI%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 执行所有的函数
     * @param {Iterable<() => void>} functions 要执行的函数
     * @returns {void}
     */
    function runAllFunctions(functions) {
        for (const _function of functions) {
            try {
                _function()
            } catch (error) {
                console.log(error)
            }
        }
    }

    /**
     * 替换 HTML 节点及其所有子节点中的文本内容
     * @param {Node | Node[]} rootElement 根节点或节点数组
     * @param {RegExp | string} search 搜索正则或字符串
     * @param {string} replace 替换字符串
     * @returns {void}
     */
    function replaceInAllNodes(rootElement, search, replace) {
        if (Array.isArray(rootElement)) {
            for (const element of rootElement) {
                replaceInAllNodes(element, search, replace)
            }
        } else if (rootElement instanceof HTMLElement) {
            for (const child of Array.from(rootElement.childNodes)) {
                replaceInAllNodes(child, search, replace)
            }
        } else if (rootElement.textContent != null) {
            rootElement.textContent = rootElement.textContent.replace(search, replace)
        }
    }

    /**
     * 替换题目标题中的格式
     * @returns {void}
     */
    function replaceProblemSubtitle() {
        const replaceArray = [
            { search: /(?<!样例)输出/, replace: "输出格式" },
            { search: /(?<!样例)输入/, replace: "输入格式" },
            { search: /提示/, replace: "提示/说明" }
        ]
        const elementArray = Array.from(document.querySelectorAll(".ui.top.attached.block.header"))
        for (const item of replaceArray) {
            replaceInAllNodes(elementArray, item.search, item.replace)
        }
    }

    /**
     * 美化题目页面
     * @returns {void}
     */
    function beautifyProblemPage() {
        runAllFunctions([
            beautifyProblemPageGrid,
            raiseProblemSubtitleLevel,
            unsetProblemPartElementsStyle,
            removeProblemPageBottomButtons
        ])
    }

    /**
     * 美化问题内容元素
     * @returns {void}
     */
    function beautifyProblemPageGrid() {
        const gridElement = document.querySelectorAll(".ui.grid")[1]
        if (gridElement == null) {
            throw new Error("找不到问题描述元素")
        }
        if (!(gridElement instanceof HTMLElement)) {
            throw new Error("问题描述元素不是 HTML 元素")
        }
        Object.assign(gridElement.style, {
            backgroundColor: "#FCFCFC",
            paddingBlock: "8px",
            paddingLeft: "24px",
            borderRadius: "4px",
            boxShadow: "#C0C0C0 0px 0px 6px"
        })
    }

    /**
     * 提升问题内容描述小标题的级别
     * @returns {void}
     */
    function raiseProblemSubtitleLevel() {
        const partElementArray = Array.from(document.querySelectorAll(".column")).slice(1)
        runAllFunctions(partElementArray.map((partElement) => () => {
            const titleElement = partElement.querySelector(".ui.top.attached.block.header")
            if (titleElement == null) {
                throw new Error("找不到小标题元素")
            }
            if (!(titleElement instanceof HTMLElement)) {
                throw new Error("小标题元素不是 HTML 元素")
            }
            const newTitleElement = document.createElement("h2")
            newTitleElement.innerHTML = titleElement.innerHTML
            newTitleElement.className = titleElement.className
            partElement.insertBefore(newTitleElement, titleElement)
            titleElement.remove()
        }))
    }

    /**
     * 取消问题部分元素的样式
     * @returns {void}
     */
    function unsetProblemPartElementsStyle() {
        const partElementArray = Array.from(document.querySelectorAll(".column")).slice(1)
        runAllFunctions(partElementArray.map((partElement) => () => {
            runAllFunctions(Array.from(partElement.children).map((child) => () => {
                if (!(child instanceof HTMLElement)) {
                    throw new Error("问题部分元素的子元素不是 HTML 元素")
                }
                Object.assign(child.style, {
                    border: "unset",
                    background: "unset"
                })
            }))
        }))
    }

    /**
     * 移除问题页面底部按钮
     * @returns {void}
     */
    function removeProblemPageBottomButtons() {
        Array.from(document.querySelectorAll(".ui.buttons")).slice(-1)[0]?.remove()
    }

    /**
     * 设置头部导航栏亚克力效果
     * @returns {void}
     */
    function setAcrylicHeader() {
        Object.assign(document.documentElement.style, {
            position: "unset",
            overflow: "unset"
        })
        Object.assign(document.body.style, {
            position: "unset",
            marginTop: "unset",
            height: "unset"
        })
        const headerElement = document.querySelector("div#page-header")
        if (headerElement == null) {
            throw new Error("找不到头部导航栏元素")
        }
        if (!(headerElement instanceof HTMLElement)) {
            throw new Error("头部导航栏元素不是 HTML 元素")
        }
        Object.assign(headerElement.style, {
            position: "sticky",
            backgroundColor: "#FFFFFFC0",
            backdropFilter: "blur(8px)"
        })
    }

    /**
     * 功能数组
     */
    const functionArray = [
        {
            march: /.*/g,
            function: setAcrylicHeader
        }, {
            march: /\/problem.php.*/g,
            function: replaceProblemSubtitle
        }, {
            march: /\/problem.php.*/g,
            function: beautifyProblemPage
        }
    ]

    /**
     * 加载所有功能
     * @returns {void}
     */
    function loadAllFunctions() {
        runAllFunctions(functionArray.map((_function) => () => {
            if (_function.march.test(location.pathname)) {
                _function.function()
            }
        }))
    }

    loadAllFunctions()
})();