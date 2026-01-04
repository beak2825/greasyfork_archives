// ==UserScript==
// @name         飞向未来
// @namespace    http://tampermonkey.net/
// @description  自动砍树，自动升级建筑脚本
// @version      1.0.1
// @author       zhowiny
// @match        http://182.43.19.5:9999/
// @match        https://www.tiancai9.click/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=19.5
// @grant        GM_addElement
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517485/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/517485/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = 250
    const CONFIG = {
        '自动砍树': '一只大树',
        '升级采集': '采集小屋',
        '升级伐木': '伐木小屋',
        '升级居所': '简陋居所',
        '升级打猎': '打猎小屋',
    }

    GM_addStyle('.tool_hidden{display: none!important;} .tools {width: 50px;height: 50px;position: fixed;z-index:999;bottom: 20px;right: 20px;display: flex;justify-content: center;align-items: center;border-radius: 50%;background: #fff;box-shadow: 0 0 5px #999;} .tools .el-button:first-child {margin-left: 14px;}')
    const toolsBox = GM_addElement(document.body, 'div', {class: 'tools'})
    const toolsContainer = GM_addElement(toolsBox, 'div', {style: 'padding: 8px; font-size: 14px;position: absolute; left: 0;bottom: 0;transform: translateX(-100%);width:240px;height: 400px;max-height: calc(100vh - 40px);overflow-y: auto;background: #fff;border: 1px solid #999;border-radius: 8px;'});
    const addIcon = GM_addElement(toolsBox, 'span', {textContent: '🧰', style: 'width: 100%;text-align: center;cursor: pointer;'});
    addIcon.addEventListener('click', () => {
        toolsContainer.classList.toggle('tool_hidden');
    })

    const sleep = async (time) => new Promise(resolve => setTimeout(resolve, time))
    const waitUntil = async (condition) => new Promise((resolve) => {
        const raf = () => condition() ? resolve() : requestAnimationFrame(raf)
        requestAnimationFrame(raf)
    })

    const taskList = new Map()

    const rafFn = async () => {
        taskList.forEach(task => {
            if (!task.running) return
            task.callback?.()
        })
        await sleep(interval)
        requestAnimationFrame(rafFn)
    }

    const addTool = (toolName = '自动砍树', ele) => {
        if (!ele) return
        taskList.set(toolName, {
            running: false,
            element: ele,
            callback: () => !ele.classList.contains('disabled') && ele?.click()
        })


        const div = GM_addElement(GM_addElement(toolsContainer, 'div', {
            textContent: toolName,
            style: 'padding: 2px 0;',
        }), 'div', {
            textContent: '开启自动点击',
            class: 'el-button el-button--small',
        })
        div.addEventListener('click', () => {
            const task = taskList.get(toolName)
            task.running = !task.running
            div.classList.toggle('el-button--primary')
            div.innerText = `${task.running ? '关闭自动点击' : '开启自动点击'}`
        })
    }

    const init = async (tools) => {
        rafFn()
        await waitUntil(() => document.querySelector('.building-box'))
        await sleep(300)

        const buildings = [...document.querySelectorAll('.building')]
        buildings.forEach((building) => {
            if (!building.innerText) return
            addTool(building.dataset.name || building.textContent, building)
        })
    }

    init(CONFIG)
})();