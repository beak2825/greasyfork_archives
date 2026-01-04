// ==UserScript==
// @name         百度翻译结果自动格式化为大小驼峰，下划线命名等多种命名方式，程序员命名必备
// @namespace    https://github.com/lan-he/baidu-translate-tampermonkey
// @version      1.0
// @description  百度翻译结果自动格式化为小驼峰大驼峰下划线命名等多种命名方式，点击即可复制，长按可改变位置，提供六种命名方式，程序员命名必备
// @author       lan-he
// @match        https://fanyi.baidu.com/*
// @icon         https://fanyi.baidu.com/favicon.ico
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/523744/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%B8%BA%E5%A4%A7%E5%B0%8F%E9%A9%BC%E5%B3%B0%EF%BC%8C%E4%B8%8B%E5%88%92%E7%BA%BF%E5%91%BD%E5%90%8D%E7%AD%89%E5%A4%9A%E7%A7%8D%E5%91%BD%E5%90%8D%E6%96%B9%E5%BC%8F%EF%BC%8C%E7%A8%8B%E5%BA%8F%E5%91%98%E5%91%BD%E5%90%8D%E5%BF%85%E5%A4%87.user.js
// @updateURL https://update.greasyfork.org/scripts/523744/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%B8%BA%E5%A4%A7%E5%B0%8F%E9%A9%BC%E5%B3%B0%EF%BC%8C%E4%B8%8B%E5%88%92%E7%BA%BF%E5%91%BD%E5%90%8D%E7%AD%89%E5%A4%9A%E7%A7%8D%E5%91%BD%E5%90%8D%E6%96%B9%E5%BC%8F%EF%BC%8C%E7%A8%8B%E5%BA%8F%E5%91%98%E5%91%BD%E5%90%8D%E5%BF%85%E5%A4%87.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    const positionDisplayBox = document.createElement('div')
    positionDisplayBox.style.position = 'absolute'
    positionDisplayBox.style.top = '420px'
    positionDisplayBox.style.left = '20px'
    positionDisplayBox.style.padding = '16px'
    positionDisplayBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
    positionDisplayBox.style.borderRadius = '10px'
    positionDisplayBox.style.backdropFilter = 'blur(4px)'
    positionDisplayBox.style.boxShadow =
        'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    positionDisplayBox.style.zIndex = '999'
    positionDisplayBox.style.cursor = 'move'
    positionDisplayBox.id = 'positionDisplayBox'
    document.body.appendChild(positionDisplayBox)

    const gridBox = document.createElement('div')
    gridBox.style.display = 'grid'
    gridBox.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))'
    gridBox.style.gap = '10px'
    positionDisplayBox.appendChild(gridBox)

    let isDragging = false // 标识是否正在拖拽
    let startX, startY, initialLeft, initialTop

    // 监听 mousedown 事件，开始拖拽
    positionDisplayBox.addEventListener('mousedown', (e) => {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        initialLeft = positionDisplayBox.offsetLeft
        initialTop = positionDisplayBox.offsetTop
        positionDisplayBox.style.cursor = 'grabbing'
        // 监听 mousemove 和 mouseup 事件
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    })

    // 鼠标移动时更新位置
    function onMouseMove(e) {
        if (!isDragging) return
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        positionDisplayBox.style.left = `${initialLeft + dx}px`
        positionDisplayBox.style.top = `${initialTop + dy}px`
    }

    // 鼠标抬起时停止拖拽
    function onMouseUp() {
        isDragging = false
        positionDisplayBox.style.cursor = 'grab'
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
    function createItemDOM() {
        let positionDisplay = document.createElement('div')
        positionDisplay.textContent = 'not found'
        positionDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        positionDisplay.style.textAlign = 'center'
        positionDisplay.style.color = '#000'
        positionDisplay.style.cursor = 'pointer'
        positionDisplay.style.padding = '5px 10px'
        positionDisplay.style.borderRadius = '5px'
        positionDisplay.style.zIndex = '9999'
        positionDisplay.style.fontSize = '14px'
        positionDisplay.style.boxShadow =
            'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
        return positionDisplay
    }
    const positionDisplay1 = createItemDOM()
    const positionDisplay2 = createItemDOM()
    const positionDisplay3 = createItemDOM()
    const positionDisplay4 = createItemDOM()
    const positionDisplay5 = createItemDOM()
    const positionDisplay6 = createItemDOM()
    gridBox.appendChild(positionDisplay1)
    gridBox.appendChild(positionDisplay2)
    gridBox.appendChild(positionDisplay3)
    gridBox.appendChild(positionDisplay4)
    gridBox.appendChild(positionDisplay5)
    gridBox.appendChild(positionDisplay6)

    const describeBox = document.createElement('div')
    describeBox.textContent = '点击可复制, 长按可拖拽'
    describeBox.style.textAlign = 'center'
    describeBox.style.color = 'rgba(0, 0, 0, .85)'
    describeBox.style.fontSize = '12px'
    describeBox.style.marginTop = '10px'
    const describeEnBox = document.createElement('div')
    describeEnBox.textContent = 'Tap to copy, long press to drag'
    describeEnBox.style.textAlign = 'center'
    describeEnBox.style.color = 'rgba(0, 0, 0, .85)'
    describeEnBox.style.fontSize = '12px'
    // describeEnBox.style.color = '#fff'
    positionDisplayBox.appendChild(describeBox)
    positionDisplayBox.appendChild(describeEnBox)
    // 点击复制功能
    positionDisplay1.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    positionDisplay2.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    positionDisplay3.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    positionDisplay4.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    positionDisplay5.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    positionDisplay6.addEventListener('click', (event) => {
        CopyAndMessage(event)
    })
    function CopyAndMessage(eventThis) {
        // 复制方法
        console.log(eventThis, 'eventThiseventThiseventThis')
        const textToCopy = eventThis.target.innerText
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                const successMessage = document.createElement('div')
                successMessage.textContent = 'Copied successfully'
                successMessage.style.position = 'fixed'
                successMessage.style.backgroundColor = '#4d85ff'
                successMessage.style.color = '#fff'
                successMessage.style.padding = '5px 10px'
                successMessage.style.borderRadius = '5px'
                successMessage.style.zIndex = '10000'
                successMessage.style.fontSize = '14px'
                successMessage.style.transform = 'translate(-50%, -100%)'
                successMessage.style.pointerEvents = 'none' // 防止阻挡点击
                // 设置提示位置：在点击位置的中间上方
                successMessage.style.left = `${eventThis.clientX}px`
                successMessage.style.top = `${eventThis.clientY - 20}px`
                document.body.appendChild(successMessage)
                // 2 秒后移除提示
                setTimeout(() => {
                    document.body.removeChild(successMessage)
                }, 2000)
            })
            .catch((err) => {
                console.error('复制失败:', err)
            })
    }
    function transformString(input) {
        // 去除非字母数字字符并用空格分割单词
        const words = input.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/)

        // 转为首字母小写的小驼峰命名
        const camelCase = words
            .map((word, index) =>
                index === 0
                    ? word.toLowerCase()
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('')

        // 转为首字母大写的大驼峰命名
        const pascalCase = words
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('')

        // 转为中划线分割形式
        const kebabCase = words.map((word) => word.toLowerCase()).join('-')

        // 转为下划线分割形式
        const snakeCase = words.map((word) => word.toLowerCase()).join('_')

        // 转为全大写的下划线分割形式
        const upperSnakeCase = words.map((word) => word.toUpperCase()).join('_')

        // 转为首字母大写的下划线分割形式
        const titleSnakeCase = words
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('_')

        return {
            camelCase,
            pascalCase,
            kebabCase,
            snakeCase,
            upperSnakeCase,
            titleSnakeCase,
        }
    }

    function name() {
        const element = document.querySelector('.sentId')
        if (element) {
            let transformStringText = transformString(element.innerHTML)
            positionDisplay1.textContent =
                transformStringText.camelCase || 'empty'
            positionDisplay2.textContent =
                transformStringText.pascalCase || 'empty'
            positionDisplay3.textContent =
                transformStringText.kebabCase || 'empty'
            positionDisplay4.textContent =
                transformStringText.snakeCase || 'empty'
            positionDisplay5.textContent =
                transformStringText.upperSnakeCase || 'empty'
            positionDisplay6.textContent =
                transformStringText.titleSnakeCase || 'empty'
        } else {
            positionDisplay1.textContent = 'not found'
            positionDisplay2.textContent = 'not found'
            positionDisplay3.textContent = 'not found'
            positionDisplay4.textContent = 'not found'
            positionDisplay5.textContent = 'not found'
            positionDisplay6.textContent = 'not found'
        }
        setTimeout(() => {
            name()
        }, 1000)
    }
    name()
})()
