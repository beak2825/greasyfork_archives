// ==UserScript==
// @name         批量剪辑-批量创建标题文案
// @namespace    http://tampermonkey.net/
// @version      2024-11-29
// @description  批量创建标题文案
// @author       You
// @match        https://duanshipin.bdsaas.top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bdsaas.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519257/%E6%89%B9%E9%87%8F%E5%89%AA%E8%BE%91-%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E6%A0%87%E9%A2%98%E6%96%87%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519257/%E6%89%B9%E9%87%8F%E5%89%AA%E8%BE%91-%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E6%A0%87%E9%A2%98%E6%96%87%E6%A1%88.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	// 保存原始的 XMLHttpRequest
	const originalXHR = window.XMLHttpRequest

	// 创建新的 XMLHttpRequest 构造函数
	window.XMLHttpRequest = function () {
		const xhr = new originalXHR()
		const originalOpen = xhr.open
		const originalSend = xhr.send

		// 重写 open 方法
		xhr.open = function () {
			const method = arguments[0]
			const url = arguments[1]

			// 存储 URL 供后续使用
			xhr._url = url
			return originalOpen.apply(this, arguments)
		}

		// 重写 send 方法
		xhr.send = function () {
			const originalData = arguments[0]

			// 检查是否是目标请求
			if (xhr._url === 'https://api.tool.duanshipin.com/api/company/videoPublish/addTemplate') {
        try {
					// 解析原始数据
					let data = JSON.parse(originalData)
					// 在这里修改数据
					// 获取所有 myInput 元素
					const inputs = document.getElementsByClassName('myInput')
					// 将元素集合转换为数组并获取值
					const inputValues = Array.from(inputs).map(input => input.value)
          // 修改请求数据
          // 创建新的场景数组
          let newTitles = [];
          // 遍历每个输入值
          inputValues.forEach((count, index) => {
            // 如果有对应的场景
            if (data.top_config.titles[index]) {
              // 重复场景 count 次
              for (let i = 0; i < count; i++) {
                newTitles.push({...data.top_config.titles[index]});
              }
            }
          });
          // 用新的场景数组替换原数组
          data.top_config.titles = newTitles;
          console.log(data)
					// 将修改后的数据转回字符串
					arguments[0] = JSON.stringify(data)
				} catch (e) {
					console.error('修改请求数据时出错:', e)
				}
			}

			return originalSend.apply(this, arguments)
		}

		return xhr
	}

	function findBtnAddInput() {
		// 检查当前URL是否匹配目标页面
		if (window.location.href !== 'https://duanshipin.bdsaas.top/#/seniorEditor/index' && !window.location.href.startsWith('https://duanshipin.bdsaas.top/#/seniorEditor/index?')) {
			return
		}
		// 获取所有 class 为 material-btn 的元素
		const elements = document.getElementsByClassName('material-btn')
		// 转换为数组并过滤
		const matchedElements = Array.from(elements).filter(element => {
			return element.textContent.includes('标题：')
		})
		// 为每个匹配的元素添加 input
		matchedElements.forEach(element => {
			// 检查是否已经存在 class 为 myInput 的子元素
			if (element.querySelector('.myInput')) return
			// 创建包装div
			const wrapperDiv = document.createElement('div')
			wrapperDiv.style.cssText = `
                display: flex;
                align-items: center;
                margin-top: 10px;
            `
			// 创建标题span
			const titleSpan = document.createElement('span')
			titleSpan.textContent = '复制：'
			titleSpan.style.cssText = `
                margin-right: 8px;
                color: #606266;
                font-size: 14px;
            `
			wrapperDiv.appendChild(titleSpan)
			element.appendChild(wrapperDiv)
			// 创建新的 input 元素
			const input = document.createElement('input')
      input.type = 'number'
			input.value = 1
			input.min = 1
			input.style.cssText = `
                width: 100px;
                height: 24px;
                padding: 2px 6px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                color: #606266;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            `
			input.addEventListener('focus', () => {
				input.style.borderColor = '#409eff'
			})
			input.addEventListener('blur', () => {
				input.style.borderColor = '#dcdfe6'
			})
			input.className = 'myInput'
			// 将 input 添加到元素中
			wrapperDiv.appendChild(input)
			// 阻止点击事件冒泡
			input.addEventListener('click', e => {
				e.stopPropagation()
			})
			// 设置父元素高度为自动
			element.style.height = 'auto'
		})
	}
	// 每300ms调用一次findBtnAddInput
	setInterval(findBtnAddInput, 300)
})()
