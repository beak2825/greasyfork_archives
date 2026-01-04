// ==UserScript==
// @name         自动跳转vpn 公司自用
// @version      2025-7-31
// @description  自动套转 vpn
// @author       joans
// @match        https://supnet.menusifu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=menusifu.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1368348
// @downloadURL https://update.greasyfork.org/scripts/508641/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACvpn%20%E5%85%AC%E5%8F%B8%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508641/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACvpn%20%E5%85%AC%E5%8F%B8%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
	'use strict'

	// 配置选项
	const config = {
		buttonName: '搜索', // 要监控的按钮名称
		checkInterval: 1000, // 检查间隔(毫秒)
		maxChecks: 30, // 最大检查次数(0=无限)
		debug: true, // 显示调试信息
		highlightButton: true, // 高亮显示找到的按钮
		preventDoubleClick: true, // 防止双击
	}

	// 日志函数
	const log = config.debug
		? (...args) => console.log('[搜索监控]', ...args)
		: () => {}

	log(`开始监控名称为"${config.buttonName}"的按钮...`)

	let checkCount = 0
	let clickHandlerAttached = false

	// 创建监控定时器
	const intervalId = setInterval(() => {
		if (config.maxChecks > 0 && checkCount >= config.maxChecks) {
			log(`已达最大检查次数 (${config.maxChecks})，停止监控`)
			clearInterval(intervalId)
			return
		}

		checkCount++
		log(`第 ${checkCount} 次检查`)

		// 查找所有按钮元素
		const buttons = document.querySelectorAll(
			'button, input[type="button"], input[type="submit"], a'
		)
		let targetButton = null

		// 遍历按钮查找目标
		for (const button of buttons) {
			const buttonText = getButtonText(button)

			if (buttonText.includes(config.buttonName)) {
				log(`发现目标按钮: "${buttonText}"`)
				targetButton = button
				break
			}
		}

		// 如果找到按钮
		if (targetButton && !targetButton.dataset.monitored) {
			// 绑定点击事件
			attachClickHandler(targetButton)

			// 标记按钮已处理
			targetButton.dataset.monitored = 'true'

			// 高亮按钮
			if (config.highlightButton) {
				highlightSearchButton(targetButton)
			}

			// 停止监控
			clearInterval(intervalId)
			log('监控结束')
		}
	}, config.checkInterval)

	// 获取按钮文本
	function getButtonText(button) {
		// 不同按钮类型的文本获取方式
		if (button.tagName === 'INPUT') {
			return button.value || ''
		} else if (button.tagName === 'A') {
			return button.innerText || button.textContent || ''
		} else {
			return button.innerText || button.textContent || button.title || ''
		}
	}

	// 绑定点击事件处理函数
	function attachClickHandler(button) {
		log('绑定点击事件处理函数')

		// 自定义点击处理逻辑
		const customClickHandler = function (event) {
			log(`"${config.buttonName}"按钮被点击`)

			// === 在这里添加你的自定义处理逻辑 ===
			var targetNode = document.querySelector('tbody')
			var delay = null
			// 创建一个观察者对象
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (delay) {
						clearTimeout(delay)
					}
					log('2')
					// 检测到数据更新后，执行相应的逻辑
					// 这里可以执行数据更新后的逻辑

                    	const runS = () => {
							console.log('runS')

							var ipAddrs = document.querySelectorAll('[title="复制 IP"]')
							log(ipAddrs)
							var toBtu = document.querySelectorAll('.toLinkbtn')
							for (let j = 0; j < toBtu.length; j++) {
								toBtu[j].remove()
							}
							//ipAddr.insertAdjacentHTML("beforeend", "<p>Hello, World!</p>");
							for (let i = 0; i < ipAddrs.length; i++) {
								console.log(ipAddrs[i].parentElement.textContent)

								console.log(
									ipAddrs[i].classList.contains('toLinkbtn')
								)
								ipAddrs[i].parentElement.insertAdjacentHTML(
									'beforeend',
									"<button class='toLinkbtn'  type='button' style='background: none;border: none;'  ><a href='http://" +
										ipAddrs[i].parentElement.textContent +
										":22080/' target='_blank'><svg t='1729050846044' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4593' width='12' height='12'><path d='M590.665387 86.129778v178.119111c-390.144 0-713.386667 129.649778-544.995556 703.260444-26.396444-358.570667 147.456-471.096889 544.995556-471.096889v174.762667a30.606222 30.606222 0 0 0 52.451555 21.959111l371.768889-291.783111a31.232 31.232 0 0 0 0-44.032l-371.768889-293.205333a30.606222 30.606222 0 1 0-52.451555 22.016z' fill='#666666' p-id='4594'></path></svg><a></button>"
								)
							}
						observer.disconnect()
						}

						delay = setTimeout(runS, 500)
				})
			})

			// 观察者的配置（观察目标节点的子节点的变化）
			const configL = { childList: true, subtree: true }

			// 传入目标节点和观察选项并开始观察
			observer.observe(targetNode, configL)

			// 防止双击
			if (config.preventDoubleClick) {
				button.disabled = true
				setTimeout(() => {
					button.disabled = false
				}, 2000)
			}
		}

		// 绑定事件监听器
		button.addEventListener('click', customClickHandler)
	}

	// 高亮搜索按钮
	function highlightSearchButton(button) {
		button.style.transition = 'all 0.3s ease'
		button.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.5)'
		button.style.border = '2px solid #4285F4'
		button.style.borderRadius = '4px'

		// 添加脉动动画
		let pulseCount = 0
		const pulse = setInterval(() => {
			pulseCount++
			if (pulseCount > 3) {
				clearInterval(pulse)
				return
			}

			button.style.boxShadow = '0 0 0 8px rgba(66, 133, 244, 0.3)'
			setTimeout(() => {
				button.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.5)'
			}, 500)
		}, 1000)

		log('已添加高亮效果')
	}

	// 显示通知
	function showNotification(message) {
		const notification = document.createElement('div')
		notification.textContent = message
		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: #4285F4;
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        `

		// 添加动画样式
		const style = document.createElement('style')
		style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `
		document.head.appendChild(style)
		document.body.appendChild(notification)

		// 3秒后移除通知
		setTimeout(() => {
			notification.remove()
			style.remove()
		}, 3000)
	}
})();