// ==UserScript==
// @name         iconfont.cn 自动添加购物车到项目
// @namespace    https://jira.taipingtongren.com/
// @version      25.1.13.0
// @description  在 iconfont.cn 网站上快速将图标添加到指定项目中。支持一键添加到"同人商家版"和"同人换电"项目。
// @author       Yunser
// @match        https://www.iconfont.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524515/iconfontcn%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%88%B0%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/524515/iconfontcn%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%88%B0%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

/**
 * 项目说明：
 * 这是一个用于 iconfont.cn 的油猴脚本，可以自动将选中的图标添加到指定的项目中。
 * 
 * 功能特点：
 * 1. 支持多个项目的快速添加
 * 2. 自动点击购物车按钮
 * 3. 自动选择指定项目
 * 4. 自动确认添加
 * 
 * 使用说明：
 * 1. 在 iconfont.cn 网站上找到需要的图标
 * 2. 点击油猴扩展图标，在菜单中选择要添加到的项目
 * 3. 脚本会自动完成添加过程
 * 
 * 配置说明：
 * - PROJECTS 数组用于配置支持的项目列表
 * - 要添加新项目，直接在数组中添加项目名称即可
 * - 项目名称必须与 iconfont 网站上的项目名称完全匹配
 * 
 * 注意事项：
 * - 请确保在使用脚本时已登录 iconfont.cn
 * - 请确保要添加的项目已在项目列表中存在
 */

// 支持的项目列表
const PROJECTS = [
    '同人商家版',
    '同人换电',
]

// 初始化脚本，注册菜单命令
function init() {
    'use strict'

    PROJECTS.forEach(projectName => {
        GM_registerMenuCommand(`添加到${projectName}`, () => main(projectName))
    })
}

init()

/**
 * 主要处理函数
 * @param {string} projectName - 目标项目名称
 */
async function main(projectName) {
    // 检查是否在 iconfont.cn
    if (!location.href.includes('iconfont.cn')) {
        alert('请在 iconfont.cn 网站使用此脚本')
        return
    }

    // 获取当前页面的购物车按钮
    const cartButtons = document.querySelectorAll('li[mx-click="toggleCar()"]')
    if (!cartButtons.length) {
        alert('未找到购物车按钮')
        return
    }

    // 点击所有购物车按钮，将图标添加到购物车
    for (const button of cartButtons) {
        button.click()
        await new Promise(resolve => setTimeout(resolve, 500)) // 等待动画完成
    }

    // 等待购物车弹窗完全显示
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 点击添加到项目按钮，打开项目选择弹窗
    const addToProjectButtons = document.querySelectorAll('span[mx-click="showProject()"]')
    if (addToProjectButtons.length) {
        addToProjectButtons[0].click()
        
        // 等待项目列表加载完成
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 在项目列表中查找并选择目标项目
        const projectItems = document.querySelectorAll('.car-project-item')
        const targetProject = Array.from(projectItems).find(item => 
            item.textContent.includes(projectName)
        )
        
        if (targetProject) {
            targetProject.click()
            
            // 等待选择动画完成
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // 点击确认按钮，完成添加
            const confirmButton = document.querySelector('span[mx-click="submitProject()"]')
            if (confirmButton) {
                confirmButton.click()
            } else {
                alert('未找到确认按钮')
            }
        } else {
            alert(`未找到${projectName}项目`)
        }
    } else {
        alert('未找到项目按钮')
    }
}
