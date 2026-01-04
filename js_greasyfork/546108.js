// ==UserScript==
// @name         autoResForSevenFish
// @namespace    http://tampermonkey.net/
// @version      2025-08-17
// @description  七鱼自动回复
// @author       jonas
// @match        https://mjhlwkjnjyxgs.qiyukf.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiyukf.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546108/autoResForSevenFish.user.js
// @updateURL https://update.greasyfork.org/scripts/546108/autoResForSevenFish.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	const CONFIG = {
		SCAN_INTERVAL: 30000, // 主扫描间隔30秒
		PARENT_CLASS: 'm-chat-sessionlist-item', // 父元素类名
		TARGET_CLASS: 'css-3kxpjb', // 目标元素类名
		MAX_RETRY: 3, // 失败重试次数
	}

	let msg = '稍等'
	let statue = 0
	let hideStatus = 0
	let intervalId
	let listRes = []
	const autoRes = () => {
		let mssage = document.querySelector('.ql-editor p')
		let Sbtn = document.querySelector(
			'.ant-btn.ant-btn-primary.ant-btn-compact-item.ant-btn-compact-first-item'
		)

		if (mssage) {
			mssage.textContent = msg
			setTimeout(() => {
				Sbtn.click()
			}, 1000)
		} else {
			console.log('未收到新消息')
		}
	}
	const performScan = () => {
		const parents = document.getElementsByClassName(CONFIG.PARENT_CLASS)
		console.log('当前回复语：' + msg)
		listRes = []
		// 遍历父元素收集目标
		Array.from(parents).forEach((parent) => {
			const target = parent.querySelector(`.${CONFIG.TARGET_CLASS}`)
			if (target) {
				listRes.push(target)
			} else {
				console.log('不是新消息')
			}
		})
		if (listRes.length != 0) {
			for (let i = 0; i < listRes.length; I++) {
				listRes[i].click()
				setTimeout(() => {
					autoRes()
				}, 1000)
			}
		}
	}

	const module = document.createElement('dev')
	module.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 0px;
        width:120px;
        height:110px;
        border-radius:3px;
        background:#C7CFD4;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 16px;
        transition: all 0.5s;
        border: none;
    `
	const hideBtn = document.createElement('btn')
	hideBtn.style.cssText = `
        position: absolute;
        left:0px;
        top:0px;
        width:20px;
        height:100%;
        border-radius:3px;
        background:#CF293D;
        line-height:100px;
        padding:5px;
        color：#A1A1A1；
        transition: all 1s;

    `
	hideBtn.innerHTML = '▶'
	hideBtn.addEventListener('click', () => {
		if (hideStatus == 0) {
			module.style.width = '20px'
			hideStatus = 1
			hideBtn.innerHTML = '◀'
		} else if (hideStatus == 1) {
			module.style.width = '120px'
			hideBtn.innerHTML = '▶'
			hideStatus = 0
		}
	})
	const input = document.createElement('input')
	input.style.cssText = `
        background: #D7E8F7;
        outline: none;
        border: 0;
        margin-left: 20px;
        width: 95px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 11px;
        transition: all 0.5s;
        border-radius:3px;
        color: #787777;
    `
	input.type = 'text'
	input.value = msg
	input.addEventListener('click', () => {
		input.value = ''
		input.style.color = '#171717'
	})
	const inputBtn = document.createElement('button')
	inputBtn.style.cssText = `
        width: 100px;
        height: 30px;
        background: #2196F3;
        border-radius:7px;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 12px;
        transition: all 0.3s;
        margin-left: 20px;
        margin-top:10px;
    `
	inputBtn.innerHTML = '确认修改'
	inputBtn.addEventListener('click', () => {
		msg = input.value
		input.value = msg
		input.style.color = '#787777'
	})
	const btn = document.createElement('button')

	// 基础样式设置
	btn.style.cssText = `
        width: 80px;
        height: 30px;
        background: #2196F3;
        border-radius:7px;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 12px;
        transition: all 0.3s;
        margin-left: 20px;
        margin-top:10px;
    `

	// 悬停效果
	btn.addEventListener('mouseover', () => {
		btn.style.transform = 'scale(1.1)'
		btn.style.background = '#1976D2'
	})

	btn.addEventListener('mouseout', () => {
		btn.style.transform = 'scale(1)'
		btn.style.background = '#2196F3'
	})

	// 点击事件示例
	btn.addEventListener('click', () => {
		if (statue == 0) {
			btn.innerHTML = '点击停止'
			console.log('开始运行')
			statue = 1
			performScan()
            hideBtn.style.background = "#3DCC8E"
			intervalId = setInterval(performScan, 30000)
		} else {
			clearInterval(intervalId)
			intervalId = null
			statue = 0
			btn.innerHTML = '点击开始'
			console.log('停止运行')
            hideBtn.style.background = "#CF293D"
		}
		//autoRes()
		// 在这里添加你的自定义功能
	})

	// 添加按钮到页面
	document.body.appendChild(module)
	module.appendChild(btn)
	module.appendChild(hideBtn)
	module.appendChild(input)
	module.appendChild(inputBtn)
	// 可选：添加按钮文字/图标
	btn.innerHTML = '点击开始' // 使用闪电符号作为示例
	// Your code here...
})()
