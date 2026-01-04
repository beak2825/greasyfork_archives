// ==UserScript==
// @name         LINUX DO ReadBoost
// @author       hmjz100
// @namespace    github.com/hmjz100
// @version      1.0.1
// @description  基于【LINUXDO ReadBoost】改编，支持了响应式更新内容的论坛；LINUX DO ReadBoost 是一个刷取 LINUX DO 论坛已读帖量脚本，理论上支持所有的 Discourse 论坛
// @icon         data:image/webp;base64,UklGRtQCAABXRUJQVlA4TMcCAAAvH8AHEB8EtbZt18rc9+fosKCwdEX/Jqez23Aiybar9LnkqMCCwrL/VeFyeNeJJNuu0veRo8NmNPtfCe4XFpkzvAu3tm1V1XyCRWTuLh0QQQ1UzKASIjKH73ICEPjFPwJBKbf/EMiQI0GCSrumbWbUczuh287jjJr9vkm34Y/IyG6038M1wD8Ch3//03m0vhZ3DWoTW6yCtHeElhrib+prO+wcwAZVlNDC7O/33b/fH18YYo0MGQm/bZDLX1XzK2ZUWVy93YrNoVHVfy7KN2nyKpI+q/FdRyTSRx385eR9skeqREUqSCTSqBAlGf5KNijKd4G0/A3xuhyUVxWryt9x2c+SiCQSQkISdrOOJCQhCauKJCTh+bJ13089nuZWFQ/HmafzQgLhuOzB93U7KSasKl6uu51DoiTJpm3NtW3btu+zbevatvHpR2vH+4E1vTAR/Z8ACpuWAaC7t78gz7ODEGDTEG06IavPXxwfrK06ObAXvi8LSI8iA+jJPdmKT1ha34BeErflbQ8hI0ImsgdOlxNWdvd2nHOOLYws64Ec8mEykJ9ylLS6t7UZpdtbhUnRlAEgnXLcYeLu9maMAs3OUDqlAQNHet8q9NoIwBnoOUvyW0o9zjVZZN2LS15cUOqtkSxg8MHlzdW1Um3lAROmClNTlIvRuB2bvBug59shHuEAPWOYR4MQtsIBC//3EpRYliCELdgH4RmOJ6YDdHxL40XVVcqtM4Ta+08fPlJsn2ghNN/5++e3YmPuNKODGp7Nv/uilOdtAzoqCU2v5t59VchzRgOVaEN555u595++RSfasO8sRxuAVpSZ1/Pf332OBqyN7SyjVoS2o7zp+c+ZHx/ef/xijPHvHWbsc11O7QjfCtSXvvg8++/Xd621t7OQUkNwiNwGtDQWP375NuQti280QBuireggoKuupqTY6xp2ADqEwgIA
// @license      MIT
// @match        *://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-body
// @require      https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/521566/LINUX%20DO%20ReadBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/521566/LINUX%20DO%20ReadBoost.meta.js
// ==/UserScript==

(function ReadBoost() {
	'use strict';

	let reading = [];
	let readed = [];

	let originPushState = history.pushState;
	unsafeWindow.history.pushState = function (state, title, src) {
		setTimeout(() => {
			boost(new URL(src, location.href));
		}, 1500)
		return originPushState.call(unsafeWindow.history, state, title, src);
	};

	let originReplaceState = history.replaceState;
	unsafeWindow.history.replaceState = function (state, title, src) {
		setTimeout(() => {
			boost(new URL(src, location.href));
		}, 1500)
		return originReplaceState.call(unsafeWindow.history, state, title, src);
	};

	let style = $(`<style id="readBoostStyle">
		#readBoost {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 1.3em;
			border-radius: 16px;
			z-index: 1000;
			background: var(--tertiary-medium);
			color: var(--primary);
			box-shadow: 0 8px 32px #0000001a;
		}
		div.readboost {
			padding-top: 10px;
			font-size: 16px;
		}
		label.readboost {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 10px;
			color: var(--primary);
			font-weight: normal;
		}
		label.readboost input {
			margin: 0;
			padding: 3px 5px;
		}
		.readboost.buttonCollection {
			display: flex;
			align-items: center;
			justify-content: space-evenly;
		}

		div.topic-owner .topic-body .contents>.cooked::after {
			color: var(--tertiary-medium);
			content: "题主";
		}
	</style>`)

	let settingsButton = $(`<span class="auth-buttons"><button id="settingsButton" class="btn btn-small btn-icon-text"><svg class="fa svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#gear"></use></svg></button></span>`)
	let statusLabel = $('<span id="statusLabel" style="margin: 0 10px 0">ReadBoost 待命中</span>')
	settingsButton.on('click', showSettingsUI)

	waitForKeyElements('.header-buttons', (element) => {
		element.append(statusLabel)
		element.append(settingsButton)
	}, true)

	waitForKeyElements('body', (element) => {
		element.after(style)
	}, true)

	let defaultConfig = {
		baseDelay: 2500,
		randomDelayRange: 800,
		minReqSize: 8,
		maxReqSize: 20,
		minReadTime: 800,
		maxReadTime: 3000,
		autoStart: false
	}

	let config = { ...defaultConfig, ...getStoredConfig() }
	let csrfToken = $('meta[name=csrf-token]').attr('content')

	function boost(url = (new URL(location.href)), auto = false) {
		console.log(`【LINUX DO ReadBoost】Init\n收到新链接`, `\n链接：${url.href}`)

		// 初始化
		let topicId = url?.pathname?.split("/")?.[3]
		let repliesInfo = $('div[class=timeline-replies]').text().trim()
		if (!topicId || !csrfToken || !repliesInfo) {
			console.log(`【LINUX DO ReadBoost】Init\n缺失关键标识，跳过`)
			return;
		};
		let [currentPosition, totalReplies] = repliesInfo?.split("/")?.map(part => parseInt(part?.trim(), 10))

		// 自启动处理
		if (config.autoStart || auto) {
			startReading(topicId, totalReplies)
		}
	}
	boost()

	/**
	 * 开始刷取已读话题
	 * @param {string} topicId 主题ID
	 * @param {number} totalReplies 总帖子数
	 */
	async function startReading(topicId, totalReplies) {
		if (!reading.includes(topicId)) {
			reading.push(topicId);
		} else {
			console.log(`【LINUX DO ReadBoost】Read\n正在处理此话题，跳过`)
			return;
		}
		if (readed.includes(topicId)) {
			console.log(`【LINUX DO ReadBoost】Read\n已读过此话题，跳过`)
			let index = reading.indexOf(topicId);
			if (index !== -1) {
				reading.splice(index, 1);
			}
			return;
		}
		console.log(`【LINUX DO ReadBoost】Read\n开始阅读……`, `\n话题标识：${topicId}`, `\n帖子数量：${totalReplies}`)

		let baseRequestDelay = config.baseDelay
		let randomDelayRange = config.randomDelayRange
		let minBatchReplyCount = config.minReqSize
		let maxBatchReplyCount = config.maxReqSize
		let minReadTime = config.minReadTime
		let maxReadTime = config.maxReadTime

		// 随机数生成
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		}

		// 发起读帖请求
		async function sendBatch(startId, endId, retryCount = 3) {
			let params = createBatchParams(startId, endId)
			try {
				let response = await fetch("https://linux.do/topics/timings", {
					headers: {
						"accept": "*/*",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"discourse-background": "true",
						"discourse-logged-in": "true",
						"discourse-present": "true",
						"priority": "u=1, i",
						"sec-fetch-dest": "empty",
						"sec-fetch-mode": "cors",
						"sec-fetch-site": "same-origin",
						"x-csrf-token": csrfToken,
						"x-requested-with": "XMLHttpRequest",
						"x-silence-logger": "true"
					},
					referrer: `https://linux.do/`,
					body: params.toString(),
					method: "POST",
					mode: "cors",
					credentials: "include"
				})
				if (!response.ok) {
					throw new Error(`请求失败，状态：${response.status}`)
				}
				console.log(`【LINUX DO ReadBoost】Read\n处理成功`, `\n话题标识：${topicId}`, `\n帖子标识：${startId}~${endId}`)
				updateStatus(`话题 ${topicId} 的帖子 ${startId}~${endId} 处理成功`, "green")
			} catch (error) {
				console.error(`【LINUX DO ReadBoost】Read\n处理失败`, `\n话题标识：${topicId}`, `\n帖子标识：${startId}~${endId}`, `\n错误详情：`, error)

				if (retryCount > 0) {
					console.error(`【LINUX DO ReadBoost】Read\n重新处理`, `\n话题标识：${topicId}`, `\n帖子标识：${startId}~${endId}`)
					updateStatus(`重新处理话题 ${topicId} 的帖子 ${startId}~${endId}（${retryCount}）`, "orange")

					let retryDelay = 2000
					await new Promise(r => setTimeout(r, retryDelay))
					await sendBatch(startId, endId, retryCount - 1)
				} else {
					console.error(`【LINUX DO ReadBoost】Read\n处理失败`, `\n话题标识：${topicId}`, `\n帖子标识：${startId}~${endId}`, `\n错误详情：`, error)
					updateStatus(`话题 ${topicId} 的帖子 ${startId}~${endId} 处理失败`, "red")
				}
			}
			let delay = baseRequestDelay + getRandomInt(0, randomDelayRange)
			await new Promise(r => setTimeout(r, delay))
		}

		function createBatchParams(startId, endId) {
			let params = new URLSearchParams()

			for (let i = startId; i <= endId; i++) {
				params.append(`timings[${i}]`, getRandomInt(minReadTime, maxReadTime).toString())
			}
			let topicTime = getRandomInt(minReadTime * (endId - startId + 1), maxReadTime * (endId - startId + 1)).toString()
			params.append('topic_time', topicTime)
			params.append('topic_id', topicId)
			return params
		}

		// 批量阅读处理
		for (let i = 1; i <= totalReplies;) {
			let batchSize = getRandomInt(minBatchReplyCount, maxBatchReplyCount)
			let startId = i
			let endId = Math.min(i + batchSize - 1, totalReplies)

			await sendBatch(startId, endId)
			i = endId + 1
		}

		console.log(`【LINUX DO ReadBoost】Read\n处理完成`, `\n话题标识：${topicId}`)
		updateStatus(`话题 ${topicId} 处理完成`, "green")

		if (!readed.includes(topicId)) {
			readed.push(topicId);
		}
		let index = reading.indexOf(topicId);
		if (index !== -1) {
			reading.splice(index, 1);
		}

		setTimeout(() => {
			updateStatus("ReadBoost 待命中", "")
		}, 3000)
	}

	/**
	 * 更新状态标签内容
	 */
	function updateStatus(text, color) {
		statusLabel.text(text)
		if (color !== "") {
			statusLabel.css({ 'background-color': color, 'color': '#fff' })
		} else {
			statusLabel.css({ 'background-color': '', 'color': '' })
		}
	}

	/**
	 * 显示设置UI界面
	 */
	function showSettingsUI() {
		if ($('#readBoost').length) return;
		let settingsDiv = $(`<div id="readBoost">
			<h3>ReadBoost 设置</h3>
			<div class="readboost">
				<label class="readboost"><span>基础延迟(ms)</span><input id="baseDelay" type="number" value="${config.baseDelay}"></label>
				<label class="readboost"><span>随机延迟范围(ms)</span><input id="randomDelayRange" type="number" value="${config.randomDelayRange}"></label>
				<label class="readboost"><span>最小请求量</span><input id="minReqSize" type="number" value="${config.minReqSize}"></label>
				<label class="readboost"><span>最大请求量</span><input id="maxReqSize" type="number" value="${config.maxReqSize}"></label>
				<label class="readboost"><span>最小时间(ms)</span><input id="minReadTime" type="number" value="${config.minReadTime}"></label>
				<label class="readboost"><span>最大时间(ms)</span><input id="maxReadTime" type="number" value="${config.maxReadTime}"></label>
				<label class="readboost"><span>解锁参数</span><input type="checkbox" id="advancedMode"></label>
				<label class="readboost"><span>自动运行</span><input type="checkbox" id="autoStart" ${config.autoStart ? "checked" : ""}></label>
			</div>
			<div class="readboost buttonCollection">
				<button class="btn btn-small" id="saveSettings">
					<span class="d-button-label">保存</span>
				</button>
				<button class="btn btn-small" id="resetDefaults">
					<span class="d-button-label">重置</span>
				</button>
				<button class="btn btn-small" id="startManually">
					<span class="d-button-label">运行</span>
				</button>
				<button class="btn btn-small" id="closeSettings">
					<span class="d-button-label">关闭</span>
				</button>
			</div>
		</div>`)

		settingsDiv.find("#saveSettings").on("click", () => {
			config.baseDelay = parseInt(settingsDiv.find("#baseDelay").val(), 10);
			config.randomDelayRange = parseInt(settingsDiv.find("#randomDelayRange").val(), 10);
			config.minReqSize = parseInt(settingsDiv.find("#minReqSize").val(), 10);
			config.maxReqSize = parseInt(settingsDiv.find("#maxReqSize").val(), 10);
			config.minReadTime = parseInt(settingsDiv.find("#minReadTime").val(), 10);
			config.maxReadTime = parseInt(settingsDiv.find("#maxReadTime").val(), 10);
			config.autoStart = settingsDiv.find("#autoStart").prop("checked");

			// 持久化保存设置
			GM_setValue("baseDelay", config.baseDelay);
			GM_setValue("randomDelayRange", config.randomDelayRange);
			GM_setValue("minReqSize", config.minReqSize);
			GM_setValue("maxReqSize", config.maxReqSize);
			GM_setValue("minReadTime", config.minReadTime);
			GM_setValue("maxReadTime", config.maxReadTime);
			GM_setValue("autoStart", config.autoStart);

			settingsDiv.remove();
			location.reload();
		});

		settingsDiv.find("#resetDefaults").on("click", () => {
			let result = confirm("你确定要重置吗？所有自定义数据都将丢失！");
			if (result) {
				config = { ...defaultConfig };

				GM_setValue("baseDelay", defaultConfig.baseDelay);
				GM_setValue("randomDelayRange", defaultConfig.randomDelayRange);
				GM_setValue("minReqSize", defaultConfig.minReqSize);
				GM_setValue("maxReqSize", defaultConfig.maxReqSize);
				GM_setValue("minReadTime", defaultConfig.minReadTime);
				GM_setValue("maxReadTime", defaultConfig.maxReadTime);
				GM_setValue("autoStart", defaultConfig.autoStart);

				settingsDiv.remove();
				location.reload();
			}
		});

		settingsDiv.find("#startManually").on("click", () => {
			boost(location, true)
			settingsDiv.remove();
		});

		function toggleSettingsInputs(enabled) {
			let inputs = [
				"baseDelay", "randomDelayRange", "minReqSize",
				"maxReqSize", "minReadTime", "maxReadTime"
			];
			inputs.forEach(inputId => {
				let inputElement = settingsDiv.find(`#${inputId}`);
				if (inputElement.length) {
					inputElement.prop("disabled", !enabled);
				}
			});
		}
		toggleSettingsInputs(false);

		settingsDiv.find("#advancedMode").on("change", (event) => {
			if ($(event.target).prop("checked")) {
				toggleSettingsInputs(true);
			} else {
				toggleSettingsInputs(false);
			}
		});

		settingsDiv.find("#closeSettings").on("click", () => {
			settingsDiv.remove();
		});

		$("body").append(settingsDiv);
	}

	function getStoredConfig() {
		return {
			baseDelay: GM_getValue("baseDelay", defaultConfig.baseDelay),
			randomDelayRange: GM_getValue("randomDelayRange", defaultConfig.randomDelayRange),
			minReqSize: GM_getValue("minReqSize", defaultConfig.minReqSize),
			maxReqSize: GM_getValue("maxReqSize", defaultConfig.maxReqSize),
			minReadTime: GM_getValue("minReadTime", defaultConfig.minReadTime),
			maxReadTime: GM_getValue("maxReadTime", defaultConfig.maxReadTime),
			autoStart: GM_getValue("autoStart", defaultConfig.autoStart)
		}
	}

	function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
		function findInShadowRoots(root, selector) {
			let elements = $(root).find(selector).toArray();
			$(root).find('*').each(function () {
				let shadowRoot = this.shadowRoot;
				if (shadowRoot) {
					elements = elements.concat(findInShadowRoots(shadowRoot, selector));
				}
			});
			return elements;
		}
		var targetElements;
		if (iframeSelector) {
			targetElements = $(iframeSelector).contents();
		} else {
			targetElements = $(document);
		}
		let allElements = findInShadowRoots(targetElements, selectorTxt);
		if (allElements.length > 0) {
			allElements.forEach(function (element) {
				var jThis = $(element);
				var uniqueIdentifier = 'alreadyFound';
				var alreadyFound = jThis.data(uniqueIdentifier) || false;
				if (!alreadyFound) {
					var cancelFound = actionFunction(jThis);
					if (cancelFound) {
						return false;
					} else {
						jThis.data(uniqueIdentifier, true);
					}
				}
			});
		}
		var controlObj = waitForKeyElements.controlObj || {};
		var controlKey = selectorTxt.replace(/[^\w]/g, "_");
		var timeControl = controlObj[controlKey];
		if (allElements.length > 0 && bWaitOnce && timeControl) {
			clearInterval(timeControl);
			delete controlObj[controlKey];
		} else {
			if (!timeControl) {
				timeControl = setInterval(function () {
					waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
				}, 1000);
				controlObj[controlKey] = timeControl;
			}
		}
		waitForKeyElements.controlObj = controlObj;
	}
})();