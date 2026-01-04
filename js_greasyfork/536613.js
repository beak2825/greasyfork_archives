// ==UserScript==
// @name         LinuxDoReadBooster
// @namespace    https://www.klaio.top/
// @version      1.0.0
// @description  自动为Linux.do的帖子和评论标记已读，快速提升账号等级。
// @author       NianBroken
// @match        *://*.linux.do/*
// @grant        none
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @copyright    Copyright © 2025 NianBroken. All rights reserved.
// @license      Apache-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/536613/LinuxDoReadBooster.user.js
// @updateURL https://update.greasyfork.org/scripts/536613/LinuxDoReadBooster.meta.js
// ==/UserScript==

(function () {
	'use strict'; // 启用 JavaScript 严格模式，以获得更优的代码质量和错误检查

	// =================================================================================
	// I. 全局常量与脚本标识符 (Global Constants & Script Identifiers)
	// =================================================================================

	/**
	 * @constant {string} SCRIPT_ID_PREFIX
	 * @description 用于生成脚本相关的 DOM 元素 ID 和 CSS 类名的统一前缀。
	 * 这有助于确保脚本生成的元素具有唯一性，避免与页面原有元素或其他脚本产生冲突。
	 */
	const SCRIPT_ID_PREFIX = 'linuxdo-reader-pro';

	/**
	 * @constant {string} CONFIG_STORAGE_KEY
	 * @description 脚本配置信息在浏览器 LocalStorage 中存储时所使用的键名。
	 * 通过版本化命名 (例如 "-v1")，可以在未来脚本升级时平滑过渡或区分不同版本的配置。
	 */
	const CONFIG_STORAGE_KEY = 'linuxdo-reader-pro-settings-v1';

	/**
	 * @constant {object} DEFAULT_CONFIG
	 * @description 脚本的默认配置对象。
	 * 当用户首次运行脚本，或当存储的配置信息丢失/损坏，或用户选择重置配置时，将使用此对象中的值。
	 * 每个配置项都有详细注释说明其用途。
	 */
	const DEFAULT_CONFIG = {
		delayBase: 1000, // 每轮标记操作的基础延迟时间（单位：毫秒）。实际延迟会在此基础上叠加一个随机值。
		delayRandom: 500, // 每轮标记操作的随机延迟范围（单位：毫秒）。最终延迟 = delayBase + getRandomInt(0, delayRandom)。
		minFloor: 20, // 处理帖子楼层时，每批次最少处理的楼层数。
		maxFloor: 50, // 处理帖子楼层时，每批次最多处理的楼层数。实际数量会在此范围内随机选取。
		minPostReadTime: 30000, // 模拟阅读一篇完整帖子的最短时间（单位：毫秒）。此值用于API参数 `topic_time`。
		maxPostReadTime: 60000, // 模拟阅读一篇完整帖子的最长时间（单位：毫秒）。此值用于API参数 `topic_time`。
		minCommentReadTime: 30000, // 模拟阅读一条评论的最短时间（单位：毫秒）。此值用于API参数 `timings[post_number]`。
		maxCommentReadTime: 60000, // 模拟阅读一条评论的最长时间（单位：毫秒）。此值用于API参数 `timings[post_number]`。
		maxRetriesPerBatch: 3, // 单个楼层批次标记失败时，允许的最大自动重试次数（指首次尝试失败后的额外重试机会）。
		bulkReadStartTopicId: 1, // “批量阅读”功能启动时，默认开始处理的帖子ID。
		bulkReadDirection: 'forward', // “批量阅读”功能默认的帖子遍历方向。'forward' 表示正序（ID递增），'reverse' 表示倒序（ID递减）。
		requestTimeout: 15000 // 执行网络请求（如API调用）的超时时间（单位：毫秒）。超过此时间未收到响应，则请求被视为失败。
	};

	// =================================================================================
	// II. 全局状态管理变量 (Global State Management Variables)
	// =================================================================================

	/**
	 * @type {object} currentScriptConfig
	 * @description 存储当前脚本正在使用的配置。
	 * 在脚本初始化时，会尝试从 LocalStorage 加载用户保存的配置；
	 * 如果加载失败或无配置，则使用 `DEFAULT_CONFIG`。
	 */
	let currentScriptConfig = {};

	/**
	 * @type {boolean} isBulkReadingSessionActive
	 * @description 标记“批量阅读”功能当前是否处于活动状态。
	 * `true` 表示正在运行，`false` 表示未运行或已手动停止。
	 */
	let isBulkReadingSessionActive = false;

	/**
	 * @type {number} currentBulkReadTopicIdInProgress
	 * @description 在“批量阅读”会话期间，记录当前正在处理或即将处理的帖子的ID。
	 * 默认为1，在批量阅读启动时会根据用户设置或已保存的断点进行更新。
	 */
	let currentBulkReadTopicIdInProgress = 1;

	// =================================================================================
	// III. 通用工具函数模块 (Utility Functions Module)
	// =================================================================================

	/**
	 * @function getRandomInt
	 * @description 生成一个介于最小值 `min` 和最大值 `max` 之间（包含两者）的随机整数。
	 * @param {number} min - 随机数区间的最小值。
	 * @param {number} max - 随机数区间的最大值。
	 * @returns {number} 返回生成的随机整数。
	 */
	function getRandomInt(min, max) {
		min = Math.ceil(min); // 确保 `min` 是整数，向上取整
		max = Math.floor(max); // 确保 `max` 是整数，向下取整
		return Math.floor(Math.random() * (max - min + 1)) + min; // 计算并返回随机数
	}

	/**
	 * @async
	 * @function interruptibleDelay
	 * @description 创建一个可被外部条件中断的异步延迟。
	 * 在延迟期间，会周期性地检查 `stopConditionFn` 的返回值。
	 * @param {number} durationMs - 需要延迟的总时长（单位：毫秒）。
	 * @param {function} stopConditionFn - 一个无参数的函数，在延迟的每个检查间隔被调用。
	 * 如果此函数返回 `true`，则延迟会提前结束。
	 * @returns {Promise<boolean>} 返回一个 Promise。如果延迟被中断，Promise 解析为 `true`；
	 * 如果延迟正常完成，Promise 解析为 `false`。
	 */
	async function interruptibleDelay(durationMs, stopConditionFn) {
		const endTime = Date.now() + durationMs; // 计算延迟结束的精确时间戳
		while (Date.now() < endTime) { // 循环直到当前时间达到或超过结束时间
			if (stopConditionFn && stopConditionFn()) { // 如果提供了停止条件函数，并且其返回值为true
				return true; // 表示延迟被中断
			}
			// 等待一个较短的时间间隔（100毫秒或剩余的延迟时间中的较小者）
			// 这样做是为了允许中断条件检查，并避免长时间阻塞JavaScript主线程
			await new Promise(resolve => setTimeout(resolve, Math.min(100, endTime - Date.now())));
		}
		return false; // 延迟正常完成，未被中断
	}

	/**
	 * @async
	 * @function fetchWithTimeout
	 * @description 执行一个带有超时机制的 `Workspace` 网络请求。
	 * @param {RequestInfo} resource - 要请求的资源，可以是 URL 字符串或一个 `Request` 对象。
	 * @param {RequestInit} [options={}] - `Workspace` 请求的选项对象 (例如 method, headers, body 等)。
	 * @param {number} [timeout] - 本次请求特定的超时时间（单位：毫秒）。
	 * 如果未提供，则使用全局配置中的 `requestTimeout`。
	 * @returns {Promise<Response>} 成功时，返回 `Workspace` API 的 `Response` 对象。
	 * @throws {Error} 如果请求超时（`AbortError`）或发生其他网络错误，则抛出错误。
	 */
	async function fetchWithTimeout(resource, options = {}, timeout) {
		// 决定本次请求实际使用的超时时间
		const effectiveTimeout = timeout || currentScriptConfig.requestTimeout || DEFAULT_CONFIG.requestTimeout;
		const controller = new AbortController(); // 创建 AbortController 实例以控制请求的取消
		const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout); // 设置超时计时器，到时自动中止请求

		try {
			// 发起 fetch 请求，并将 AbortController 的 signal 关联到请求选项中
			const response = await fetch(resource, {
				...options, // 合并用户传入的 options
				signal: controller.signal // 关键：允许通过 controller.abort() 中止此 fetch 请求
			});
			clearTimeout(timeoutId); // 如果请求成功或失败（非超时原因），清除超时计时器
			return response;
		} catch (error) {
			clearTimeout(timeoutId); // 确保在发生任何错误时都清除超时计时器
			if (error.name === 'AbortError') {
				// 如果错误是由于 AbortController 中止请求（通常意味着超时）
				const resourceUrl = typeof resource === 'string' ? resource : resource.url;
				console.warn(`网络请求 ${resourceUrl} 因超时 (${effectiveTimeout / 1000}秒) 而被中止。`);
			}
			// 重新抛出错误，以便上层调用代码可以捕获和处理
			throw error;
		}
	}

	/**
	 * @function waitForCondition
	 * @description 周期性地检查某个条件（`conditionFn`）是否满足。
	 * 一旦条件满足，执行回调函数 `callbackFn`。
	 * 主要用于等待页面上某些异步加载的 DOM 元素出现。
	 * @param {function} conditionFn - 条件检查函数。该函数应返回一个布尔值，`true` 表示条件已满足。
	 * @param {function} callbackFn - 当条件满足后要执行的回调函数。
	 * @param {number} [intervalMs=500] - 检查条件的间隔时间（单位：毫秒）。
	 * @param {number} [timeoutMs=Infinity] - 总的等待超时时间（单位：毫秒）。
	 * 若设为 `Infinity`，则会无限期等待直到条件满足。
	 * 如果超过此时间条件仍未满足，则停止检查并打印警告。
	 */
	function waitForCondition(conditionFn, callbackFn, intervalMs = 500, timeoutMs = Infinity) {
		const startTime = Date.now(); // 记录开始等待的时间点
		const timer = setInterval(() => { // 设置一个定时器，周期性执行检查
			if (conditionFn()) { // 调用条件函数，检查条件是否满足
				clearInterval(timer); // 条件满足，清除定时器
				callbackFn(); // 执行回调函数
			} else if (Date.now() - startTime > timeoutMs) { // 检查是否已超过总等待时间
				clearInterval(timer); // 超时，清除定时器
				console.warn(`waitForCondition 等待超时 (超过 ${timeoutMs / 1000} 秒)，条件未满足。`); // 打印超时警告
			}
		}, intervalMs);
	}

	/**
	 * @function getCsrfToken
	 * @description 从当前页面的 `<meta>` 标签中获取 CSRF (Cross-Site Request Forgery) Token。
	 * 此 Token 通常用于验证 POST 等修改性请求的合法性，以防止 CSRF 攻击。
	 * @returns {string|null} 如果找到 CSRF Token，则返回其字符串值；
	 * 否则返回 `null`，并在控制台打印错误信息。
	 */
	function getCsrfToken() {
		// 尝试查找 name 属性为 "csrf-token" 的 meta 标签
		const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
		if (csrfTokenElement && csrfTokenElement.content) {
			// 如果找到该元素并且其 content 属性有值，则返回该 Token
			return csrfTokenElement.content;
		}
		// 如果未找到 CSRF Token，打印错误日志
		console.error("严重错误：无法在页面中找到 CSRF Token。部分操作可能因此失败。");
		return null;
	}

	// =================================================================================
	// IV. 配置管理模块 (Configuration Management Module)
	// =================================================================================

	/**
	 * @function loadConfiguration
	 * @description 加载脚本的配置信息。
	 * 首先尝试从浏览器的 LocalStorage 中读取之前保存的配置。
	 * 如果 LocalStorage 中没有配置、配置格式错误或解析失败，则使用 `DEFAULT_CONFIG` 中定义的默认配置。
	 * 加载后，会对各项配置值进行类型检查和有效性校验与修正。
	 */
	function loadConfiguration() {
		let storedConfigJson; // 用于存储从 LocalStorage 读取到的原始 JSON 字符串
		try {
			storedConfigJson = localStorage.getItem(CONFIG_STORAGE_KEY); // 从 LocalStorage 读取配置字符串
			if (storedConfigJson) {
				// 如果存在已存储的配置，则尝试解析 JSON
				currentScriptConfig = JSON.parse(storedConfigJson);
			} else {
				// 如果没有存储的配置，则直接使用默认配置
				currentScriptConfig = {
					...DEFAULT_CONFIG
				};
			}
		} catch (error) {
			// 如果解析 JSON 字符串时发生错误，打印错误信息并回退到默认配置
			console.error("错误：解析存储在 LocalStorage 中的配置信息失败。将使用默认配置。错误详情：", error);
			currentScriptConfig = {
				...DEFAULT_CONFIG
			};
		}

		// 合并默认配置和已加载的配置，确保所有配置项都存在，优先使用已加载（或已存储）的值
		// 这一步也确保了如果 DEFAULT_CONFIG 新增了字段，而已存配置没有，则新字段会被正确初始化
		const config = {
			...DEFAULT_CONFIG,
			...currentScriptConfig // 用户存储的配置会覆盖默认值
		};

		// 定义需要进行数值类型和非负数校验的配置项字段名列表
		const numericFields = [
			'delayBase', 'delayRandom', 'minFloor', 'maxFloor',
			'minPostReadTime', 'maxPostReadTime', 'minCommentReadTime', 'maxCommentReadTime',
			'maxRetriesPerBatch', 'bulkReadStartTopicId', 'requestTimeout'
		];

		numericFields.forEach(field => {
			// 校验每个字段是否为数字、非 NaN、且非负
			if (typeof config[field] !== 'number' || isNaN(config[field]) || config[field] < 0) {
				const defaultValue = DEFAULT_CONFIG[field]; // 获取该字段的默认值
				// 如果校验失败，打印警告，并将该字段的值重置为其默认值
				console.warn(`配置警告：配置项 "${field}" 的值 (${config[field]}) 无效或非数字/非负数，已重置为默认值: ${defaultValue}`);
				config[field] = defaultValue;
			}
		});

		// 对特定配置项进行额外的范围或格式校验
		if (config.bulkReadStartTopicId < 1) { // “批量阅读”的起始帖子ID必须至少为1
			console.warn(`配置警告：配置项 "bulkReadStartTopicId" 的值 (${config.bulkReadStartTopicId}) 小于1，已重置为默认值: ${DEFAULT_CONFIG.bulkReadStartTopicId}`);
			config.bulkReadStartTopicId = DEFAULT_CONFIG.bulkReadStartTopicId;
		}
		if (config.requestTimeout < 1000) { // 网络请求超时时间建议至少为1000毫秒（1秒）
			console.warn(`配置警告：配置项 "requestTimeout" 的值 (${config.requestTimeout}) 小于1000ms，已重置为默认值: ${DEFAULT_CONFIG.requestTimeout}`);
			config.requestTimeout = DEFAULT_CONFIG.requestTimeout;
		}
		if (!['forward', 'reverse'].includes(config.bulkReadDirection)) { // “批量阅读”方向必须是 'forward' 或 'reverse'
			console.warn(`配置警告：配置项 "bulkReadDirection" 的值 (${config.bulkReadDirection}) 无效，已重置为默认值: ${DEFAULT_CONFIG.bulkReadDirection}`);
			config.bulkReadDirection = DEFAULT_CONFIG.bulkReadDirection;
		}

		// 校验各种 min/max 对，确保 min 值不超过对应的 max 值
		if (config.minFloor > config.maxFloor) {
			console.warn(`配置警告："minFloor" (${config.minFloor}) 不能大于 "maxFloor" (${config.maxFloor})。已将 "minFloor" 调整为 "maxFloor" 的值: ${config.maxFloor}`);
			config.minFloor = config.maxFloor;
		}
		if (config.minPostReadTime > config.maxPostReadTime) {
			console.warn(`配置警告："minPostReadTime" (${config.minPostReadTime}) 不能大于 "maxPostReadTime" (${config.maxPostReadTime})。已将 "minPostReadTime" 调整为 "maxPostReadTime" 的值: ${config.maxPostReadTime}`);
			config.minPostReadTime = config.maxPostReadTime;
		}
		if (config.minCommentReadTime > config.maxCommentReadTime) {
			console.warn(`配置警告："minCommentReadTime" (${config.minCommentReadTime}) 不能大于 "maxCommentReadTime" (${config.maxCommentReadTime})。已将 "minCommentReadTime" 调整为 "maxCommentReadTime" 的值: ${config.maxCommentReadTime}`);
			config.minCommentReadTime = config.maxCommentReadTime;
		}

		// 将最终校验和修正后的配置对象赋值给全局的 currentScriptConfig 变量
		currentScriptConfig = config;
	}

	/**
	 * @function saveConfiguration
	 * @description 将当前脚本的配置（存储在全局变量 `currentScriptConfig` 中）保存到浏览器的 LocalStorage。
	 * 这样即使用户关闭浏览器或刷新页面，配置也能被持久化。
	 */
	function saveConfiguration() {
		try {
			// 将 `currentScriptConfig` 对象序列化为 JSON 字符串，并存储到 LocalStorage
			localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(currentScriptConfig));
		} catch (error) {
			// 如果存储过程中发生错误（例如 LocalStorage 已满或禁止写入），打印错误信息
			console.error("严重错误：保存配置到 LocalStorage 失败。配置可能不会被持久化。错误详情：", error);
		}
	}

	/**
	 * @function resetConfiguration
	 * @description 将脚本的配置重置为 `DEFAULT_CONFIG` 中定义的默认设置。
	 * 它会从 LocalStorage 中移除已保存的配置项，然后重新调用 `loadConfiguration` 函数，
	 * 这将导致 `DEFAULT_CONFIG` 被加载到 `currentScriptConfig` 中，并自动保存一次。
	 */
	function resetConfiguration() {
		// 从 LocalStorage中移除与此脚本相关的配置项
		localStorage.removeItem(CONFIG_STORAGE_KEY);
		// 重新加载配置，此时由于 LocalStorage 中没有相关项，将加载默认配置
		loadConfiguration(); // loadConfiguration 内部会处理默认值的应用
		saveConfiguration(); // 重置后立即保存一次，确保默认配置被持久化
		// 提示用户配置已重置（此日志主要用于UI操作后的反馈，或直接调用此函数时的确认）
		console.log("操作提示：所有配置已成功重置为默认值。");
	}

	// =================================================================================
	// V. 论坛 API 交互模块 (Forum API Interaction Module)
	// =================================================================================

	/**
	 * @constant {string} BASE_URL
	 * @description Linux.do 论坛的基础 URL，用于构建所有 API 请求的完整地址。
	 */
	const BASE_URL = 'https://linux.do';

	/**
	 * @async
	 * @function checkTopicExists
	 * @description 异步检查具有指定 ID 的帖子是否存在且当前用户是否可以访问。
	 * 它通过请求该帖子的 JSON 数据接口 (`/t/{topicId}.json`) 来实现。
	 * @param {string|number} topicId - 需要检查其存在性的帖子的 ID。
	 * @returns {Promise<boolean>} 如果帖子存在且可访问（HTTP 状态码为 2xx），则 Promise 解析为 `true`。
	 * 如果帖子不存在（HTTP 404）或由于其他原因不可访问（非 2xx 状态码，或网络错误），
	 * 则 Promise 解析为 `false`，并在控制台打印相应信息。
	 */
	async function checkTopicExists(topicId) {
		try {
			// 使用带超时的 fetch 函数请求帖子的 .json 接口
			const response = await fetchWithTimeout(`${BASE_URL}/t/${topicId}.json`);
			if (!response.ok) { // 如果 HTTP 响应状态码不是成功 (即非 2xx 范围)
				if (response.status === 404) {
					// 状态码 404 通常明确表示帖子不存在
					console.log(`API提示：检查帖子 ID ${topicId} 时，服务器返回 404 (未找到)。`);
				} else {
					// 对于其他非 2xx 的错误状态码，打印警告
					console.warn(`API警告：检查帖子 ID ${topicId} 可访问性时，服务器返回了非预期的状态码：${response.status}`);
				}
				return false; // 视为帖子不可访问
			}
			// 响应状态码为 2xx，表示帖子存在且可访问
			return true;
		} catch (err) {
			// fetchWithTimeout 内部已经处理了超时并打印了相关信息
			// 此处仅处理非 AbortError (即非超时) 的其他网络错误
			if (err.name !== 'AbortError') {
				console.error(`网络错误：在检查帖子 ID ${topicId} 是否存在时发生通讯错误。错误详情：`, err);
			}
			// 任何网络层面的错误（包括超时）都视为帖子不可访问
			return false;
		}
	}

	/**
	 * @async
	 * @function fetchTopicDetails
	 * @description 异步获取指定 ID 帖子的详细信息。
	 * 主要目的是获取帖子的总楼层数 (`highest_post_number`)，但也返回完整的帖子数据对象。
	 * @param {string|number} topicId - 需要获取详情的帖子的 ID。
	 * @returns {Promise<object|null>} 如果成功获取并解析了帖子信息，并且信息中包含有效的楼层数，
	 * 则 Promise 解析为一个包含帖子数据的对象。
	 * 如果获取失败（网络错误、帖子不存在、无权访问、数据格式不正确等），
	 * 则 Promise 解析为 `null`，并在控制台打印相关错误或提示信息。
	 */
	async function fetchTopicDetails(topicId) {
		try {
			// 请求帖子的 .json 接口以获取详细数据
			const response = await fetchWithTimeout(`${BASE_URL}/t/${topicId}.json`);
			if (!response.ok) {
				console.error(`API错误：获取帖子 ID ${topicId} 的数据失败，HTTP状态码：${response.status}。可能原因：帖子不存在、无权访问或服务器内部错误。`);
				return null;
			}
			const json = await response.json(); // 解析响应体为 JSON 对象

			// 校验获取到的数据中是否包含有效的 `highest_post_number` (总楼层数)
			if (typeof json.highest_post_number !== 'number' || json.highest_post_number <= 0) {
				// 如果帖子没有评论或者 `highest_post_number` 无效，则打印提示并认为无法处理
				console.log(`数据提示：帖子 ID ${topicId} 的评论数 (highest_post_number: ${json.highest_post_number}) 无效或数据格式不正确，将跳过此帖子的标记处理。`);
				return null;
			}
			return json; // 返回包含帖子详情的完整 JSON 对象
		} catch (err) {
			// 如果在 fetch 或 JSON 解析过程中发生错误 (fetchWithTimeout 已处理超时)
			if (err.name !== 'AbortError') { // 非超时错误
				console.error(`网络或解析错误：获取帖子 ID ${topicId} 的详细数据时发生错误。错误详情：`, err);
			}
			return null; // 出错则返回 null
		}
	}

	/**
	 * @async
	 * @function submitTimingsBatch
	 * @description 向服务器提交一批楼层的已读信息（模拟阅读时间）。
	 * 这是实现“标记已读”功能的核心 API 调用。
	 * @param {string|number} topicId - 目标帖子的 ID。此参数主要用于错误日志和调试信息。
	 * @param {number} startFloor - 本次提交批次中的起始楼层号。
	 * @param {number} endFloor - 本次提交批次中的结束楼层号。
	 * @param {string} csrfToken - 用于请求验证的 CSRF Token。
	 * @returns {Promise<boolean>} 如果 API 请求成功（HTTP 状态码 2xx），则 Promise 解析为 `true`，表示标记成功。
	 * 否则解析为 `false`，表示标记失败，并在控制台打印相关错误信息。
	 */
	async function submitTimingsBatch(topicId, startFloor, endFloor, csrfToken) {
		// 生成一个随机的帖子总阅读时间，模拟用户在该帖子上的总停留时间
		const topicTime = getRandomInt(currentScriptConfig.minPostReadTime, currentScriptConfig.maxPostReadTime);
		const params = new URLSearchParams(); // 用于构建 x-www-form-urlencoded 格式的请求体
		const loggedParams = { // 创建一个对象，用于在控制台以更易读的格式记录将要发送的参数
			topic_id: topicId.toString(),
			topic_time: topicTime.toString(),
			timings: {}
		};

		// 日志：准备标记指定范围的楼层
		console.log(`准备将 ${startFloor} ~ ${endFloor} 楼标记为已读...`);

		// 为本批次中的每一个楼层生成一个随机的阅读时间，并添加到请求参数中
		for (let postNumber = startFloor; postNumber <= endFloor; postNumber++) {
			const commentReadTime = getRandomInt(currentScriptConfig.minCommentReadTime, currentScriptConfig.maxCommentReadTime);
			params.append(`timings[${postNumber}]`, commentReadTime.toString()); // 添加到 URLSearchParams
			loggedParams.timings[postNumber.toString()] = commentReadTime; // 记录到日志对象
		}

		// 将帖子 ID 和总阅读时间添加到请求参数
		params.append("topic_id", topicId.toString());
		params.append("topic_time", topicTime.toString());

		// 在控制台以折叠组的形式输出详细的请求参数，方便调试，默认折叠以保持日志简洁
		console.groupCollapsed(`请求参数 (帖子ID: ${topicId}, 楼层: ${startFloor}-${endFloor})`);
		console.log(loggedParams);
		console.groupEnd();

		try {
			// 发送 POST 请求到论坛的 timings 接口
			const response = await fetchWithTimeout(`${BASE_URL}/topics/timings`, {
				method: "POST",
				credentials: "include", // 关键：确保请求时携带 cookies，用于用户身份验证
				headers: {
					"accept": "*/*", // 表示客户端接受任意类型的响应
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8", // 指定请求体格式
					"x-csrf-token": csrfToken, // CSRF Token，用于安全验证
					"x-requested-with": "XMLHttpRequest" // 标记此请求为 AJAX (异步JavaScript和XML) 请求
				},
				body: params.toString() // 将 URLSearchParams 对象转换为字符串作为请求体
			});

			if (response.ok) { // HTTP 状态码为 2xx 表示请求成功
				console.log(`响应状态为 ${response.status}，成功将 ${startFloor} ~ ${endFloor} 楼标记为已读`);
				return true;
			} else {
				// 如果请求失败（例如服务器错误 5xx，或权限问题 4xx），获取响应体文本（可能包含错误信息）
				const responseBody = await response.text();
				console.error(`API错误：标记帖子 ID ${topicId} 的 ${startFloor} ~ ${endFloor} 楼失败，HTTP状态码：${response.status}`);
				console.error(`服务器响应内容 (前500字符): ${responseBody.substring(0, 500)}`); // 输出部分响应体
				return false;
			}
		} catch (err) {
			// 处理网络通信层面发生的错误 (fetchWithTimeout 已处理超时并打印相应信息)
			if (err.name !== 'AbortError') { // 非超时错误
				console.error(`网络错误：发送“标记帖子 ID ${topicId} 的 ${startFloor} ~ ${endFloor} 楼为已读”请求时发生通讯错误。错误详情：`, err);
			}
			return false; // 任何此类错误（包括超时）都应视为提交失败
		}
	}

	// =================================================================================
	// VI. 核心业务逻辑模块 (Core Business Logic Module)
	// =================================================================================

	/**
	 * @async
	 * @function processSingleTopic
	 * @description 核心功能函数，负责完整处理单个帖子的所有楼层，将它们分批次标记为已读。
	 * 它会首先获取帖子详情（如总楼层数），然后循环调用 `submitTimingsBatch` 来向服务器提交已读信息。
	 * 函数内部包含了错误重试机制、操作间的智能延迟，以及在“批量阅读”模式下的可中断检查。
	 * @param {string|number} topicId - 需要处理的帖子的 ID。
	 * @param {boolean} [isBulkMode=false] - 一个布尔值，指示当前是否在“批量阅读”模式下运行。
	 * 在此模式下 (true)，函数会检查全局的 `isBulkReadingSessionActive` 状态，
	 * 以允许用户从外部中断长时间运行的批量处理任务。
	 */
	async function processSingleTopic(topicId, isBulkMode = false) {
		// `operationConcludedForTopic` 标记此主题的处理是否因任何原因（成功、失败、跳过、中止）已经结束。
		// 用于确保在 `finally` 块中能正确打印主题处理结束后的分隔符 "---"。
		let operationConcludedForTopic = false;

		try {
			// 步骤 1: 获取帖子详细信息 (主要是总楼层数 `highest_post_number`)
			// `WorkspaceTopicDetails` 内部已包含针对 `topicId` 的日志记录
			const topicDetails = await fetchTopicDetails(topicId);
			if (!topicDetails) {
				// 如果获取详情失败或帖子数据无效（例如无评论），则无法继续处理此帖子。
				// `WorkspaceTopicDetails` 内部已打印相关的错误或提示信息。
				operationConcludedForTopic = true;
				return; // 终止此帖子的处理流程
			}

			const totalPosts = topicDetails.highest_post_number; // 从帖子详情中获取总楼层（评论）数
			// 日志：报告当前帖子的基本信息
			console.log(`ID 为 ${topicId} 的帖子共有 ${totalPosts} 条评论`);

			// 步骤 2: 获取 CSRF Token，这是执行后续 API（如标记已读）请求所必需的
			const csrfToken = getCsrfToken();
			if (!csrfToken) {
				// 如果无法获取 CSRF Token，则无法发送标记请求。`getCsrfToken` 内部已打印错误。
				console.error("操作中止：由于未能获取 CSRF Token，无法继续自动标记已读功能。");
				operationConcludedForTopic = true;
				return; // 终止此帖子的处理流程
			}

			let currentFloor = 1; // 初始化当前处理到的楼层号，从第一楼开始
			let roundCounter = 0; // 记录已执行的处理轮次（即批次提交的次数）
			const configuredRetries = currentScriptConfig.maxRetriesPerBatch; // 从配置中获取允许的额外重试次数
			const totalAttemptsPerBatch = 1 + configuredRetries; // 计算每个批次总的尝试次数（首次尝试 + 配置的重试次数）

			// 定义一个停止条件检查函数。
			// 在“批量阅读”模式 (`isBulkMode`为true)下，它会检查全局的 `isBulkReadingSessionActive` 状态。
			// 在单帖模式下，它始终返回 `false`，意味着除非页面卸载或发生不可恢复错误，否则不会主动中断。
			const stopConditionChecker = () => isBulkMode && !isBulkReadingSessionActive;

			// 初始延迟：仅在非批量模式（即用户直接打开帖子页面自动触发时）且是从第一楼开始处理时执行。
			// 这是为了模拟用户打开页面后先浏览片刻再开始“阅读”的行为。
			if (!isBulkMode && currentFloor === 1) {
				const initialDelay = getRandomInt(currentScriptConfig.delayBase, currentScriptConfig.delayBase + currentScriptConfig.delayRandom);
				console.log(`延迟 ${initialDelay} 毫秒后开始刷已读 (帖子ID: ${topicId})`);
				// 此处的 `interruptibleDelay` 第二个参数是 `() => false`，表示此初始延迟理论上不可被外部信号中断。
				if (await interruptibleDelay(initialDelay, () => false)) {
					// 正常情况下不应进入此分支，因为停止条件是 `false`。作为代码的防御性检查。
					return;
				}
			}

			// 步骤 3: 循环处理帖子的所有楼层，直到 `currentFloor` 超过帖子的总楼层数 `totalPosts`
			while (currentFloor <= totalPosts) {
				roundCounter++; // 增加轮次（批次）计数器

				// 在每轮（处理一个新批次）开始前，检查是否需要中止处理（主要用于“批量阅读”模式下的外部停止信号）
				if (stopConditionChecker()) {
					console.log(`操作中止：帖子 ${topicId} 的标记过程已因全局停止信号而中止。`);
					operationConcludedForTopic = true;
					return; // 中止对此帖子的进一步处理
				}

				// 特殊检查：在“批量阅读”模式下，如果全局“正在处理的帖子ID” (`currentBulkReadTopicIdInProgress`)
				// 已经改变（例如用户在UI上操作，切换到其他帖子），则应中止当前这个帖子的处理，以响应新的指令。
				if (isBulkMode && isBulkReadingSessionActive && currentBulkReadTopicIdInProgress.toString() !== topicId.toString()) {
					console.log(`操作切换：帖子 ${topicId} 的标记过程已中止，因为“批量阅读”功能已切换到处理其他帖子 ID ${currentBulkReadTopicIdInProgress}。`);
					operationConcludedForTopic = true;
					return; // 中止对此帖子的进一步处理
				}

				// 打印轮次间的分隔符：仅在单帖模式（非批量）且不是第一轮时打印，以增强日志可读性。
				if (roundCounter > 1 && !isBulkMode) {
					console.log("---"); // 日志分隔符
				}

				// 构造并打印轮次开始的日志信息
				// 在单帖模式下，包含帖子ID；在批量模式下，不包含，因为上层日志已指明当前帖子ID。
				let roundStartLogMessage = `开始进行第 ${roundCounter} 轮的刷已读`;
				if (!isBulkMode) {
					roundStartLogMessage += ` (帖子ID: ${topicId})`;
				}
				console.log(roundStartLogMessage);

				// 决定本批次实际处理的楼层数量，在配置的 `minFloor` 和 `maxFloor` 之间随机选择
				const batchSize = getRandomInt(currentScriptConfig.minFloor, currentScriptConfig.maxFloor);
				const startFloorInBatch = currentFloor; // 本批次的起始楼层号
				// 计算本批次的结束楼层号，确保不超过帖子的总楼层数
				const endFloorInBatch = Math.min(currentFloor + batchSize - 1, totalPosts);

				let batchSuccess = false; // 标记本批次是否已成功提交
				let attemptsMadeThisBatch = 0; // 记录本批次已进行的尝试次数 (从1开始计数)

				// 步骤 4: 尝试提交本批次的已读信息，包含重试机制
				// 循环 `totalAttemptsPerBatch` 次 (即首次尝试 + `configuredRetries` 次重试)
				while (attemptsMadeThisBatch < totalAttemptsPerBatch && !batchSuccess) {
					attemptsMadeThisBatch++; // 增加本批次的尝试次数计数
					const currentAttemptNumber = attemptsMadeThisBatch; // 当前是第几次尝试 (例如，1, 2, ...)
					const currentRetryNumber = currentAttemptNumber - 1; // 当前是第几次重试 (0表示首次尝试，1表示第1次重试, ...)

					// 在每次尝试（包括首次和重试）前，再次检查是否需要中止
					if (stopConditionChecker()) {
						console.log(`操作中止：在尝试标记批次（楼层 ${startFloorInBatch}-${endFloorInBatch}）时，帖子 ${topicId} 的操作因全局停止信号而中止。`);
						operationConcludedForTopic = true;
						return;
					}

					// 仅在进行重试时（即非首次尝试）打印特定的重试提示信息
					if (currentRetryNumber > 0) { // `currentRetryNumber > 0` 意味着这是至少第1次重试
						console.log(`正在对楼层 ${startFloorInBatch} ~ ${endFloorInBatch} 进行第 ${currentRetryNumber} 次重试... (共 ${configuredRetries} 次重试机会)`);
					}
					// 对于首次尝试 (`currentRetryNumber === 0`)，不在此处打印额外信息，
					// 因为 `submitTimingsBatch` 函数内部会打印 "准备将..." 的初始操作日志。

					// 调用 API 函数提交本批次的已读数据
					batchSuccess = await submitTimingsBatch(topicId, startFloorInBatch, endFloorInBatch, csrfToken);

					if (!batchSuccess) { // 如果本次尝试（首次或重试）失败
						if (currentAttemptNumber < totalAttemptsPerBatch) { // 如果还未达到最大尝试次数（即还有重试机会）
							const retryDelay = currentScriptConfig.delayBase + getRandomInt(0, currentScriptConfig.delayRandom);
							// 打印失败和即将重试的提示信息
							console.log(`标记楼层 ${startFloorInBatch}-${endFloorInBatch} 失败。第 ${currentRetryNumber + 1} 次重试将在 ${retryDelay}ms 后开始 (共 ${configuredRetries} 次重试机会)。`);
							// 等待一段时间后进行下一次重试，此延迟同样可被 `stopConditionChecker` 中断
							if (await interruptibleDelay(retryDelay, stopConditionChecker)) {
								console.log(`操作中止：在等待重试（楼层 ${startFloorInBatch}-${endFloorInBatch}）期间，帖子 ${topicId} 的操作因全局停止信号而中止。`);
								operationConcludedForTopic = true;
								return;
							}
						} else { // 已达到最大尝试次数（首次尝试 +所有配置的重试次数），仍失败
							const failMessage = `错误：标记帖子 ID ${topicId} 的楼层 ${startFloorInBatch}-${endFloorInBatch} 彻底失败。已完成首次尝试及所有 ${configuredRetries} 次重试 (共 ${totalAttemptsPerBatch} 次尝试)。此帖子的自动标记流程已终止。`;
							console.error(failMessage); // 在控制台打印严重错误
							alert(failMessage); // 通过弹窗提示用户
							operationConcludedForTopic = true;
							return; // 终止对此帖子的进一步处理
						}
					}
				} // 单个楼层批次的尝试循环结束

				// 理论上，如果上面的循环结束而 `batchSuccess` 仍为 false，说明所有尝试都失败了，
				// 并且相应的 return 语句已经执行。此处的检查作为最后一道防线，以防逻辑意外。
				if (!batchSuccess) {
					const criticalFailMessage = `严重错误（逻辑意外）：标记帖子 ID ${topicId} 的楼层 ${startFloorInBatch}-${endFloorInBatch} 在所有尝试后仍未成功，且未按预期中止。此帖子的自动标记流程已终止。`;
					console.error(criticalFailMessage);
					alert(criticalFailMessage);
					operationConcludedForTopic = true;
					return;
				}

				// 本批次成功处理，更新 `currentFloor` 到下一批次的起始楼层
				currentFloor = endFloorInBatch + 1;

				// 步骤 5: 如果还有楼层未处理，则在处理下一批次前进行一次延迟
				if (currentFloor <= totalPosts) {
					const delayBetweenBatches = currentScriptConfig.delayBase + getRandomInt(0, currentScriptConfig.delayRandom);
					// 批次间的延迟日志不加帖子ID，因为轮次开始时上下文已明确
					console.log(`延迟 ${delayBetweenBatches} 毫秒后继续处理下一批`);
					// 此延迟也可被 `stopConditionChecker` 中断
					if (await interruptibleDelay(delayBetweenBatches, stopConditionChecker)) {
						console.log(`操作中止：在批次间延迟期间，帖子 ${topicId} 的操作因全局停止信号而中止。`);
						operationConcludedForTopic = true;
						return;
					}
				}
			} // 所有楼层处理循环结束 (当 `currentFloor > totalPosts`)

			// 步骤 6: 处理完成或中止后的总结性日志
			if (currentFloor > totalPosts) {
				// 所有楼层均已成功标记
				console.log(`帖子 ID 为 ${topicId} 的所有 ${totalPosts} 个评论已全部成功标记为已读，总共用了 ${roundCounter} 轮`);
			} else {
				// 如果循环因其他原因（例如未预期的中断逻辑，或非批量模式下的特殊情况）提前退出，
				// 且尚未通过 `return` 语句结束函数，则打印当前状态。
				// 正常情况下，此分支通常由 `stopConditionChecker` 或错误处理中的 `return` 覆盖。
				console.log(`操作提示：帖子 ${topicId} 的处理在 ${currentFloor - 1} 楼后结束 (总楼层: ${totalPosts})，可能被用户中止或因其他条件提前结束。`);
			}
			operationConcludedForTopic = true; // 标记此主题处理正常结束（或按预期中止）

		} catch (error) {
			// 捕获在 `processSingleTopic` 函数内部发生的任何未被明确处理的同步或异步错误
			console.error(`严重错误：在处理帖子ID ${topicId} 的过程中发生未预料的错误。错误详情：`, error);
			operationConcludedForTopic = true; // 标记因不可预料的错误而结束
		} finally {
			// 无论此帖子的处理是成功、失败、被跳过还是被中止，
			// 只要其处理流程告一段落 (`operationConcludedForTopic` 为 true)，就打印分隔符。
			// 这是为了确保在控制台日志中，每个帖子的处理记录在视觉上是独立的。
			if (operationConcludedForTopic) {
				console.log("---"); // 主题处理日志的结束分隔符
			}
		}
	}

	/**
	 * @async
	 * @function startBulkReadingSession
	 * @description 启动“批量阅读”功能。
	 * 此功能会根据用户在设置中配置的起始帖子ID和读取顺序（正序/倒序），
	 * 来依次自动处理一系列帖子，调用 `processSingleTopic` 对每个帖子进行标记。
	 * @param {number|string} startId - 用户在UI上指定的起始帖子ID。如果无效，会使用配置中的默认值。
	 */
	async function startBulkReadingSession(startId) {
		// 解析和验证传入的起始ID
		let parsedStartId = parseInt(startId, 10);
		if (isNaN(parsedStartId) || parsedStartId < 1) {
			// 如果输入ID无效，弹窗提示并使用配置中的起始ID
			alert("起始帖子ID无效，请输入一个大于0的数字。将使用配置中已保存或默认的起始ID。");
			parsedStartId = currentScriptConfig.bulkReadStartTopicId;
		}
		currentBulkReadTopicIdInProgress = parsedStartId; // 设置当前批量阅读会话中正在处理的帖子ID
		const direction = currentScriptConfig.bulkReadDirection; // 获取配置的读取方向（正序/倒序）

		isBulkReadingSessionActive = true; // 激活全局的“批量阅读”会话状态标志
		UIManager.updateBulkReadControls(true); // 更新UI控件状态（例如，禁用输入框，更改按钮文本为“停止运行”）

		const directionText = direction === 'forward' ? '正序' : '倒序';
		console.log(`“批量阅读”功能已启动。`); // 日志：批量阅读启动
		console.log(`当前起始帖子 ID 为 ${currentBulkReadTopicIdInProgress}`); // 日志：报告起始ID
		console.log(`读取顺序为 ${directionText}`); // 日志：报告读取方向
		// 更新UI面板上的状态显示文本
		UIManager.setBulkReadStatus(`运行中... (${directionText}) 正在准备处理帖子ID: ${currentBulkReadTopicIdInProgress}`);

		// 主循环：持续处理帖子，直到 `isBulkReadingSessionActive` 变为 `false` (用户停止) 或满足其他退出条件
		while (isBulkReadingSessionActive) {
			// 退出条件 1: 如果是倒序读取，并且当前帖子ID已小于1，则停止
			if (direction === 'reverse' && currentBulkReadTopicIdInProgress < 1) {
				console.log(`“批量阅读” (${directionText}): 当前帖子 ID (${currentBulkReadTopicIdInProgress}) 已小于1，批量操作结束。`);
				break; // 退出主循环
			}

			// 实时保存断点：在处理每个帖子之前，将当前帖子ID更新到配置中并保存。
			// 这样即使用户意外关闭页面，下次启动也能从中断处继续。
			currentScriptConfig.bulkReadStartTopicId = currentBulkReadTopicIdInProgress;
			saveConfiguration(); // 保存当前配置（包含最新的起始ID）到 LocalStorage
			// 更新UI状态，显示当前正在尝试处理的ID
			UIManager.setBulkReadStatus(`运行中... (${directionText}) 当前尝试ID: ${currentBulkReadTopicIdInProgress}`);

			// 每次循环迭代开始时，再次检查会话是否仍然激活 (可能在之前的异步操作或延迟中被用户停止)
			if (!isBulkReadingSessionActive) break;

			// 步骤 1: 检查当前帖子ID是否存在且当前用户可访问
			// `checkTopicExists` 内部会打印相关日志（如404或访问错误）
			const topicAccessible = await checkTopicExists(currentBulkReadTopicIdInProgress);

			// 在异步操作 `checkTopicExists` 后，再次检查会话激活状态
			if (!isBulkReadingSessionActive) break;

			if (topicAccessible) {
				// 如果帖子可访问，打印提示并调用 `processSingleTopic` 进行处理
				console.log(`“批量阅读”检测到 ID 为 ${currentBulkReadTopicIdInProgress} 的帖子可读，准备处理...`);
				// 调用核心处理函数，并传入 `true` 表示当前是批量模式
				// `processSingleTopic` 内部会处理其自身的日志分隔符 "---"
				await processSingleTopic(currentBulkReadTopicIdInProgress.toString(), true);
			} else {
				// 如果帖子不存在或不可访问，打印跳过信息
				console.log(`“批量阅读”检测到 ID 为 ${currentBulkReadTopicIdInProgress} 的帖子不存在或无法访问，已跳过。`);
				console.log("---"); // 为保持日志格式一致性，跳过帖子后也打印分隔符
			}

			// 处理完一个帖子（无论成功、失败还是跳过）后，再次检查会话激活状态
			if (!isBulkReadingSessionActive) break;

			// 步骤 2: 更新到下一个帖子ID，根据配置的读取方向（正序或倒序）
			if (direction === 'forward') {
				currentBulkReadTopicIdInProgress++; // 正序：帖子ID递增
			} else { // 'reverse'
				currentBulkReadTopicIdInProgress--; // 倒序：帖子ID递减
				if (currentBulkReadTopicIdInProgress < 1) {
					// 如果倒序读取使得下一个ID将小于1，打印提示信息预告即将结束
					console.log(`“批量阅读” (${directionText}): 下一个帖子 ID 将是 ${currentBulkReadTopicIdInProgress}，即将结束批量操作。`);
				}
			}

			// 步骤 3: 帖子间延迟
			// 仅当会话仍活动，并且（如果是倒序读取）下一个ID仍然有效（不小于1）时执行。
			if (isBulkReadingSessionActive && !(direction === 'reverse' && currentBulkReadTopicIdInProgress < 1)) {
				const delayBetweenTopics = getRandomInt(1000, 3000); // 设置一个固定的主题间延迟范围 (例如1-3秒)
				// 更新UI状态，显示等待信息和下一个待处理的ID
				UIManager.setBulkReadStatus(`等待 ${delayBetweenTopics}ms 后处理ID: ${currentBulkReadTopicIdInProgress} (${directionText})`);

				// 使用可中断延迟，允许用户在此期间通过UI停止批量阅读
				if (await interruptibleDelay(delayBetweenTopics, () => !isBulkReadingSessionActive)) {
					console.log("操作提示：“批量阅读”在帖子间延迟时被用户中止。");
					break; // 中断延迟，并退出主循环
				}
			}
		} // “批量阅读”主循环结束 (当 `isBulkReadingSessionActive` 为 false 或 `break` 被执行)

		// “批量阅读”会话结束后的清理和日志记录
		const finalMessage = isBulkReadingSessionActive ? '已完成所有可处理帖子（或达到末端条件）' : '已被用户或程序内部逻辑停止';
		// 获取最后保存的（即最近尝试处理或已处理完成的）帖子ID，作为下次可能的起点
		const lastProcessedOrAttemptedId = currentScriptConfig.bulkReadStartTopicId;

		console.log(`“批量阅读”功能已${finalMessage}。最后保存的起始帖子 ID 为: ${lastProcessedOrAttemptedId} (当前读取方向配置: ${currentScriptConfig.bulkReadDirection === 'forward' ? '正序' : '倒序'})`);
		console.log("---"); // 整个批量操作结束后的最终分隔符

		// 更新UI状态面板的文本，以反映最终状态和下次启动的配置
		UIManager.setBulkReadStatus(`已${finalMessage.includes("停止") ? "停止" : "结束"}。下次将从ID ${lastProcessedOrAttemptedId} (${currentScriptConfig.bulkReadDirection === 'forward' ? '正序' : '倒序'}) 开始。`);
		// 调用 `stopBulkReadingSession` 来确保所有相关的全局状态和UI控件都正确更新，
		// 即使循环是自然结束（例如倒序读取到0），也执行此操作以保持一致性。
		stopBulkReadingSession();
	}

	/**
	 * @function stopBulkReadingSession
	 * @description 停止当前正在运行的“批量阅读”会话。
	 * 它通过设置全局标志 `isBulkReadingSessionActive` 为 `false` 来实现，
	 * 这将导致 `startBulkReadingSession` 中的主循环在下次迭代检查时中止。
	 * 同时，它还会更新UI上相关控件的状态（例如，重新启用输入框，将按钮文本改回“开始运行”）。
	 */
	function stopBulkReadingSession() {
		const wasActive = isBulkReadingSessionActive; // 记录调用此函数前批量阅读会话是否处于活动状态
		isBulkReadingSessionActive = false; // 设置全局停止标记，这将有效地中止批量阅读循环
		UIManager.updateBulkReadControls(false); // 更新UI控件，反映批量阅读已停止的状态

		// 更新UI状态面板的文本。仅当之前确实在运行时，才明确显示“已停止”的状态。
		const statusElement = document.getElementById(`${SCRIPT_ID_PREFIX}-bulk-read-status`);
		if (statusElement && wasActive) { // 确保状态元素存在，并且之前会话是活动的
			// 如果状态文本以“运行中”或“等待”开头，则更新为停止后的状态
			if (statusElement.textContent.startsWith("运行中") || statusElement.textContent.startsWith("等待")) {
				statusElement.textContent = `已停止。下次将从ID ${currentScriptConfig.bulkReadStartTopicId} (${currentScriptConfig.bulkReadDirection === 'forward' ? '正序' : '倒序'}) 开始。`;
			}
		}
		// 相关的停止操作日志主要由 `startBulkReadingSession` 函数的结束部分统一处理，此处不再重复打印，
		// 避免在控制台产生冗余信息。此函数主要负责状态变更和UI更新。
	}


	// =================================================================================
	// VIII. 用户界面管理模块 (User Interface Management Module)
	// =================================================================================

	/**
	 * @object UIManager
	 * @description 这是一个包含了所有与用户界面（UI）创建、管理和交互相关方法的对象。
	 * 它封装了DOM操作、样式注入、面板渲染和事件处理等UI逻辑。
	 */
	const UIManager = {
		/**
		 * @type {HTMLElement|null} panelContainer
		 * @description 指向当前显示在页面上的设置面板的顶层覆盖容器 (overlay DOM element)。
		 * 初始值为 `null`，在面板创建时被赋值，在面板移除时重置为 `null`。
		 * @memberof UIManager
		 */
		panelContainer: null,

		/**
		 * @function injectStyles
		 * @memberof UIManager
		 * @description 向当前页面的 `<head>` 部分注入脚本所需的CSS样式。
		 * 这些样式定义了设置面板（包括遮罩层、面板本身、输入框、按钮等）的外观和布局。
		 * 此函数通常只在脚本初始化时调用一次。
		 */
		injectStyles: function () {
			const css = `
                /* 脚本UI遮罩层样式：固定定位，覆盖整个视口，半透明背景，内容居中 */
                .${SCRIPT_ID_PREFIX}-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.6);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 10000; /* 确保在页面顶层显示 */
                }
                /* 设置面板主体样式：背景色，内边距，圆角，宽度，最大宽高，溢出滚动，阴影，字体 */
                .${SCRIPT_ID_PREFIX}-panel {
                    background: #f9f9f9; padding: 25px; border-radius: 12px;
                    width: 420px; max-width: 90vw; max-height: 90vh;
                    overflow-y: auto; /* 内容超出时显示垂直滚动条 */
                    box-shadow: 0 6px 25px rgba(0,0,0,0.3);
                    font-family: "Segoe UI", Roboto, sans-serif;
                    scrollbar-width: thin; /* Firefox 滚动条样式 */
                    scrollbar-color: rgba(150,150,150,0.5) transparent; /* Firefox 滚动条颜色 */
                }
                /* Webkit (Chrome, Safari) 浏览器滚动条样式 */
                .${SCRIPT_ID_PREFIX}-panel::-webkit-scrollbar { width: 8px; }
                .${SCRIPT_ID_PREFIX}-panel::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
                .${SCRIPT_ID_PREFIX}-panel::-webkit-scrollbar-thumb {
                    background: rgba(150,150,150,0.4); border-radius: 10px;
                    border: 2px solid transparent; background-clip: padding-box;
                }
                /* 面板标题样式 */
                .${SCRIPT_ID_PREFIX}-panel h2 {
                    font-size: 20px; margin-top:0; margin-bottom: 20px;
                    color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;
                }
                /* 输入组（标签 + 输入框）样式 */
                .${SCRIPT_ID_PREFIX}-input-group { margin-bottom: 15px; }
                /* 标签样式 */
                .${SCRIPT_ID_PREFIX}-label {
                    font-size: 14px; margin-bottom: 6px; display: block;
                    color: #555; font-weight: 500;
                }
                /* 输入框和选择框通用样式 */
                .${SCRIPT_ID_PREFIX}-input, .${SCRIPT_ID_PREFIX}-select {
                    width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;
                    font-size: 14px; box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s; /* 过渡效果 */
                }
                /* 输入框和选择框获取焦点时的样式 */
                .${SCRIPT_ID_PREFIX}-input:focus, .${SCRIPT_ID_PREFIX}-select:focus {
                    border-color: #4CAF50; /* 边框高亮颜色 */
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2); /* 外发光效果 */
                    outline: none; /* 移除默认的outline */
                }
                /* 禁用的输入框和选择框样式 */
                .${SCRIPT_ID_PREFIX}-input:disabled, .${SCRIPT_ID_PREFIX}-select:disabled {
                    background-color: #eee; cursor: not-allowed;
                }
                /* 按钮容器样式：Flex布局，自动换行，间距，上边距 */
                .${SCRIPT_ID_PREFIX}-buttons {
                    display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px;
                }
                /* 按钮通用样式 */
                .${SCRIPT_ID_PREFIX}-button {
                    flex: 1; /* Flex项目等分布局 */
                    padding: 10px 15px; border: none; border-radius: 6px;
                    font-size: 14px !important; font-family: "Segoe UI", Roboto, sans-serif !important;
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.1s; /* 过渡效果 */
                    text-align: center;
                }
                /* 按钮悬停效果（未禁用时）*/
                .${SCRIPT_ID_PREFIX}-button:hover:not(:disabled) { opacity: 0.9; }
                /* 按钮激活（点击时）效果（未禁用时）*/
                .${SCRIPT_ID_PREFIX}-button:active:not(:disabled) { transform: translateY(1px); }
                /* 禁用按钮样式 */
                .${SCRIPT_ID_PREFIX}-button:disabled {
                    background-color: #ccc !important; color: #777 !important; cursor: not-allowed;
                }
                /* 特定功能按钮的颜色样式 */
                .${SCRIPT_ID_PREFIX}-button.save { background: #4caf50; color: white; } /* 保存按钮 */
                .${SCRIPT_ID_PREFIX}-button.reset { background: #ff9800; color: white; } /* 重置按钮 */
                .${SCRIPT_ID_PREFIX}-button.run { background: #4caf50; color: white; } /* 开始运行按钮 */
                .${SCRIPT_ID_PREFIX}-button.stop { background: #f44336; color: white; } /* 停止运行按钮 */
                .${SCRIPT_ID_PREFIX}-button.close { background: #9e9e9e; color: white; } /* 关闭按钮 */
                .${SCRIPT_ID_PREFIX}-button.fullread { /* 进入批量阅读设置按钮 */
                    background: #2196f3; color: white;
                    width: 100%; margin-top: 15px; flex-basis: 100%;
                }
                /* 批量阅读状态显示区域样式 */
                #${SCRIPT_ID_PREFIX}-bulk-read-status {
                    font-size: 13px; color: #333; margin-top: 12px; min-height: 1.3em;
                    word-wrap: break-word; background-color: #f0f0f0;
                    padding: 8px; border-radius: 4px; text-align: center;
                }
            `;
			const styleElement = document.createElement('style'); // 创建 `<style>` 元素
			styleElement.id = `${SCRIPT_ID_PREFIX}-styles`; // 为样式元素设置ID，方便管理或移除
			styleElement.textContent = css; // 将CSS文本内容赋值给 `<style>` 元素
			document.head.appendChild(styleElement); // 将 `<style>` 元素添加到文档的 `<head>` 部分
		},

		/**
		 * @function createInputField
		 * @memberof UIManager
		 * @description 创建一个包含标签（`<label>`）和输入框（`<input>`）的 DOM 结构，用于设置面板中的配置项。
		 * @param {string} labelText - 显示在输入框上方的标签文本。
		 * @param {string} configKey - 此输入框对应的配置项在 `currentScriptConfig` 对象中的键名。
		 * 也用于生成输入框的 `id` 属性。
		 * @param {any} currentValue - 输入框的当前值（通常从 `currentScriptConfig` 获取）。
		 * @param {string} [inputType='number'] - HTML `<input>` 元素的 `type` 属性 (例如 'number', 'text')。
		 * @returns {HTMLElement} 返回一个 `<div>` 元素，其中包含了创建的标签和输入框。
		 */
		createInputField: function (labelText, configKey, currentValue, inputType = 'number') {
			const groupDiv = document.createElement('div'); // 创建外层 `<div>` 容器
			groupDiv.className = `${SCRIPT_ID_PREFIX}-input-group`; // 设置CSS类

			const label = document.createElement('label'); // 创建 `<label>` 元素
			label.textContent = labelText; // 设置标签显示的文本
			label.className = `${SCRIPT_ID_PREFIX}-label`; // 设置CSS类
			label.htmlFor = `${SCRIPT_ID_PREFIX}-config-input-${configKey}`; // 关联 `label` 和 `input`，提高可访问性

			const input = document.createElement('input'); // 创建 `<input>` 元素
			input.type = inputType; // 设置输入类型
			// 设置输入框的初始值，处理 `null` 或 `undefined` 的情况，确保 `value` 属性是字符串
			input.value = (currentValue === null || typeof currentValue === 'undefined') ? '' : currentValue.toString();
			input.className = `${SCRIPT_ID_PREFIX}-input`; // 设置CSS类
			input.id = `${SCRIPT_ID_PREFIX}-config-input-${configKey}`; // 设置ID，用于 `label` 关联和后续通过ID获取值

			if (inputType === 'number') {
				// 为数字类型的输入框设置合理的 `min` 属性值
				input.min = (configKey === 'requestTimeout') ? "1000" : "0"; // 例如，requestTimeout 最低1000ms
				if (configKey === 'bulkReadStartTopicId') input.min = "1"; // 起始帖子ID至少为1
				// 添加事件监听器，以阻止数字输入框在获得焦点时响应鼠标滚轮事件，
				// 这可以防止用户在滚动页面时意外修改输入框中的数值。
				input.addEventListener('wheel', (event) => {
					if (document.activeElement === input) { // 仅当输入框本身是活动元素时阻止
						event.preventDefault();
					}
				});
			}
			groupDiv.append(label, input); // 将标签和输入框添加到 `<div>` 容器中
			return groupDiv; // 返回创建的 DOM 元素组
		},

		/**
		 * @function getInputValue
		 * @memberof UIManager
		 * @description 从UI设置面板上的指定输入框获取其当前值，并进行基本的类型转换和校验。
		 * @param {string} configKey - 对应配置项的键名，用于构造输入框的ID以定位元素。
		 * @param {boolean} [isNumeric=true] - 一个布尔值，指示该输入值是否应被视为数字并进行相应转换和校验。
		 * 如果为 `false`，则按字符串处理。
		 * @returns {any} 如果获取和转换成功，返回用户输入的值（数字或字符串）。
		 * 如果输入框元素不存在、输入值无效（例如非数字的数字输入）或（对于数字）小于设定的最小值，
		 * 则会进行修正（通常修正为默认值或允许的最小值），更新UI显示，并返回修正后的值。
		 */
		getInputValue: function (configKey, isNumeric = true) {
			const inputElement = document.getElementById(`${SCRIPT_ID_PREFIX}-config-input-${configKey}`);
			if (!inputElement) {
				// 如果输入框元素在DOM中未找到，返回该配置项在 DEFAULT_CONFIG 中的默认值
				console.warn(`UI警告：未能找到ID为 "${SCRIPT_ID_PREFIX}-config-input-${configKey}" 的输入框元素。将使用默认值。`);
				return DEFAULT_CONFIG[configKey];
			}

			let value = inputElement.value; // 获取输入框的原始字符串值

			if (isNumeric) {
				const originalStringValue = value; // 保存原始字符串值，用于日志
				value = Number(value); // 尝试将值转换为数字

				// 为数字类型的值确定允许的最小业务逻辑值
				let minValue = 0; // 默认最小值为0
				if (configKey === 'bulkReadStartTopicId') minValue = 1; // 起始帖子ID最小为1
				if (configKey === 'requestTimeout') minValue = 1000; // 网络请求超时最小为1000ms

				// 校验转换后的数字是否有效 (非NaN 且不小于业务逻辑要求的 minValue)
				if (isNaN(value) || value < minValue) {
					const defaultValue = DEFAULT_CONFIG[configKey]; // 获取该配置项的默认值
					// 警告用户输入无效，并准备修正
					console.warn(`UI校验警告：输入框 "${configKey}" 的值 "${originalStringValue}" 无效或小于允许的最小值 (${minValue})。将使用默认值或修正后的值。`);
					// 将值修正为 minValue 和 defaultValue 中的较大者，确保不低于业务要求的最小下限，也考虑了默认值可能高于minValue的情况
					value = Math.max(minValue, defaultValue);
					inputElement.value = value.toString(); // 更新UI输入框中显示的值为修正后的值
				}
			}
			return value; // 返回获取或修正后的值
		},

		/**
		 * @function createButton
		 * @memberof UIManager
		 * @description 创建一个标准化的按钮 (`<button>`) 元素，并为其绑定点击事件。
		 * @param {string} label - 按钮上显示的文本内容。
		 * @param {string} typeClass - 应用于按钮的额外CSS类名，通常用于定义按钮的特定样式
		 * (例如 'save', 'run', 'close'，对应 `injectStyles` 中定义的类)。
		 * @param {function} onClickAction - 当按钮被点击时需要执行的回调函数。
		 * @returns {HTMLButtonElement} 返回创建并配置好的 `<button>` 元素。
		 */
		createButton: function (label, typeClass, onClickAction) {
			const button = document.createElement('button'); // 创建 `<button>` 元素
			// 设置按钮的CSS类，包括一个基础类和传入的特定类型类
			button.className = `${SCRIPT_ID_PREFIX}-button ${typeClass}`;
			button.textContent = label; // 设置按钮上显示的文本
			button.onclick = onClickAction; // 绑定点击事件处理函数
			return button; // 返回创建的按钮
		},

		/**
		 * @function renderGeneralSettingsPanel
		 * @memberof UIManager
		 * @description 渲染并显示脚本的“通用设置”面板。
		 * 如果页面上已存在由此脚本创建的任何面板，会先将其移除，以确保每次只显示一个面板。
		 * @param {number} [scrollTop=0] - （可选）面板重新渲染后，其内容区域的滚动条应恢复到的垂直滚动位置。
		 * 这主要用于在重置配置等操作后，保持用户之前的视图位置，提升体验。
		 * @param {function} [callback=null] - （可选）一个回调函数，在面板的DOM元素完全添加到页面并渲染完成后执行。
		 */
		renderGeneralSettingsPanel: function (scrollTop = 0, callback = null) {
			this.removeExistingPanel(); // 确保移除任何已存在的面板，防止重复渲染或叠加

			// 创建半透明的遮罩层 (overlay)，用于覆盖整个页面，突出显示设置面板
			this.panelContainer = document.createElement('div');
			this.panelContainer.className = `${SCRIPT_ID_PREFIX}-overlay`;
			// 注意：点击遮罩层本身不关闭面板，关闭操作必须通过面板内部的“关闭”按钮进行。

			// 创建设置面板的主体 `<div>` 元素
			const panel = document.createElement('div');
			panel.className = `${SCRIPT_ID_PREFIX}-panel`;
			// 阻止面板内部的点击事件冒泡到遮罩层，以防止意外关闭面板
			panel.onclick = (event) => event.stopPropagation();

			panel.innerHTML = `<h2>脚本通用设置</h2>`; // 设置面板的标题

			// 定义通用设置中的各个配置项及其在UI上显示的标签文本
			// 格式：[标签文本, 配置项在currentScriptConfig中的键名]
			const generalFields = [
				['每轮基础延迟(ms)', 'delayBase'],
				['每轮随机延迟范围(ms)', 'delayRandom'],
				['每轮最小请求楼层数', 'minFloor'],
				['每轮最大请求楼层数', 'maxFloor'],
				['每篇帖子最小阅读时间(ms)', 'minPostReadTime'],
				['每篇帖子最大阅读时间(ms)', 'maxPostReadTime'],
				['每条评论最小阅读时间(ms)', 'minCommentReadTime'],
				['每条评论最大阅读时间(ms)', 'maxCommentReadTime'],
				['失败后额外重试次数', 'maxRetriesPerBatch'],
				['网络请求超时(ms)', 'requestTimeout']
			];

			try {
				// 遍历配置项定义，为每一项创建对应的输入字段并将其添加到面板中
				generalFields.forEach(([labelText, configKey]) => {
					// 使用 `currentScriptConfig` 中的值作为输入框的当前值，
					// 如果 `currentScriptConfig` 中某项未定义（理论上不太可能，因为 `loadConfiguration` 会填充），
					// 则回退到 `DEFAULT_CONFIG` 中的值作为备用。
					const currentValue = currentScriptConfig[configKey] !== undefined ?
						currentScriptConfig[configKey] : DEFAULT_CONFIG[configKey];
					panel.appendChild(this.createInputField(labelText, configKey, currentValue));
				});
			} catch (error) {
				// 如果在创建设置字段的过程中发生任何错误，记录到控制台，并在面板上显示错误提示
				console.error("UI错误：创建通用设置面板的输入字段时出错。错误详情：", error);
				panel.innerHTML += `<p style="color:red; font-weight:bold;">创建设置字段时发生错误，部分设置可能无法显示或操作。请检查浏览器控制台获取详细信息。</p>`;
			}

			const buttonRow = document.createElement('div'); // 创建用于容纳按钮的 `<div>` 行
			buttonRow.className = `${SCRIPT_ID_PREFIX}-buttons`; // 应用按钮容器的样式

			// 创建“保存通用配置”按钮
			const saveBtn = this.createButton('保存通用配置', 'save', () => {
				// 从UI输入框收集所有通用配置项的当前值
				generalFields.forEach(([_, configKey]) => {
					currentScriptConfig[configKey] = this.getInputValue(configKey); // getInputValue内部包含校验
				});
				// 此处可以再次进行一些跨字段的逻辑校验，例如确保min不超过max等，
				// 不过 getInputValue 和 loadConfiguration 中已有部分校验。
				// 为确保稳健，重新校验依赖关系（已在loadConfiguration和getInputValue中处理大部分）
				if (currentScriptConfig.minFloor > currentScriptConfig.maxFloor) currentScriptConfig.minFloor = currentScriptConfig.maxFloor;
				if (currentScriptConfig.minPostReadTime > currentScriptConfig.maxPostReadTime) currentScriptConfig.minPostReadTime = currentScriptConfig.maxPostReadTime;
				if (currentScriptConfig.minCommentReadTime > currentScriptConfig.maxCommentReadTime) currentScriptConfig.minCommentReadTime = currentScriptConfig.maxCommentReadTime;
				if (currentScriptConfig.requestTimeout < 1000) currentScriptConfig.requestTimeout = DEFAULT_CONFIG.requestTimeout;
				if (currentScriptConfig.maxRetriesPerBatch < 0) currentScriptConfig.maxRetriesPerBatch = DEFAULT_CONFIG.maxRetriesPerBatch;


				saveConfiguration(); // 调用保存配置到 LocalStorage 的函数
				alert('通用配置已成功保存！'); // 弹窗提示用户
				console.log("UI操作提示：通用配置已更新并成功保存到LocalStorage。");
			});
			saveBtn.style.flexBasis = '100%'; // 使“保存”按钮占据按钮行的整行宽度，更醒目

			// 创建“重置所有配置”按钮
			const resetBtn = this.createButton('重置所有配置', 'reset', () => {
				if (confirm("您确定要将所有配置（包括“批量阅读”的设置）恢复到初始默认值吗？此操作不可撤销。")) {
					const currentPanelScrollTop = panel.scrollTop; // 记录当前面板的滚动位置
					resetConfiguration(); // 调用重置配置的函数（会加载默认配置并保存）
					this.removeExistingPanel(); // 移除当前面板
					// 重新渲染通用设置面板，并传入之前的滚动位置，以及一个回调函数来在面板渲染后显示提示
					this.renderGeneralSettingsPanel(currentPanelScrollTop, () => {
						// 使用 setTimeout 确保 alert 在面板完全渲染后执行，避免阻塞UI
						setTimeout(() => alert('所有配置已成功重置为默认值！'), 0);
					});
				}
			});

			// 创建“关闭”按钮
			const closeBtn = this.createButton('关闭', 'close', () => this.removeExistingPanel());

			buttonRow.append(saveBtn, resetBtn, closeBtn); // 将按钮添加到按钮行
			panel.appendChild(buttonRow); // 将按钮行添加到面板

			// 创建进入“批量阅读设置”面板的入口按钮
			const bulkReadEntryBtn = this.createButton('进入“批量阅读”设置', 'fullread', () => {
				const currentPanelScrollTop = panel.scrollTop; // 记录当前通用设置面板的滚动位置
				this.removeExistingPanel(); // 移除当前通用设置面板
				// 渲染“批量阅读”设置面板，并传递之前记录的滚动位置，
				// 以便从批量阅读面板返回时能恢复通用面板的视图。
				this.renderBulkReadPanel(currentPanelScrollTop);
			});
			panel.appendChild(bulkReadEntryBtn); // 将入口按钮添加到面板

			this.panelContainer.appendChild(panel); // 将设置面板主体添加到遮罩层容器
			document.body.appendChild(this.panelContainer); // 将遮罩层（及其包含的面板）添加到文档的 `<body>`
			if (scrollTop > 0) panel.scrollTop = scrollTop; // 如果传入了 `scrollTop` 值，则恢复面板内容的滚动位置
			if (typeof callback === 'function') callback(); // 如果传入了回调函数，则执行它
		},

		/**
		 * @function renderBulkReadPanel
		 * @memberof UIManager
		 * @description 渲染并显示“批量阅读”功能的专属设置面板。
		 * 同样，如果已存在面板，会先移除。
		 * @param {number} [restoreScrollOnReturn=0] - （可选）一个数值，表示当从这个“批量阅读”面板
		 * 返回到“通用设置”面板时，通用面板内容区域应恢复到的滚动位置。
		 */
		renderBulkReadPanel: function (restoreScrollOnReturn = 0) {
			this.removeExistingPanel(); // 移除任何已存在的面板

			this.panelContainer = document.createElement('div'); // 创建遮罩层
			this.panelContainer.className = `${SCRIPT_ID_PREFIX}-overlay`;

			const panel = document.createElement('div'); // 创建“批量阅读”面板主体
			panel.className = `${SCRIPT_ID_PREFIX}-panel`;
			panel.id = `${SCRIPT_ID_PREFIX}-bulk-read-panel`; // 为面板设置特定ID，用于区分和控制
			panel.onclick = (event) => event.stopPropagation(); // 阻止点击穿透
			panel.innerHTML = `<h2>批量阅读 设置</h2>`; // 面板标题

			// 创建“起始帖子ID”输入字段
			panel.appendChild(this.createInputField(
				'起始帖子ID',
				'bulkReadStartTopicId',
				currentScriptConfig.bulkReadStartTopicId
			));

			// 创建“读取顺序”选择框 (`<select>`)
			const directionGroup = document.createElement('div');
			directionGroup.className = `${SCRIPT_ID_PREFIX}-input-group`;
			const directionLabel = document.createElement('label');
			directionLabel.textContent = '读取顺序:';
			directionLabel.className = `${SCRIPT_ID_PREFIX}-label`;
			directionLabel.htmlFor = `${SCRIPT_ID_PREFIX}-config-select-bulkReadDirection`;
			const directionSelect = document.createElement('select');
			directionSelect.id = `${SCRIPT_ID_PREFIX}-config-select-bulkReadDirection`;
			directionSelect.className = `${SCRIPT_ID_PREFIX}-select`; // 复用输入框的样式
			// 添加选项：'forward' (正序) 和 'reverse' (倒序)
			['forward', 'reverse'].forEach(directionValue => {
				const option = document.createElement('option');
				option.value = directionValue;
				option.textContent = directionValue === 'forward' ? '正序 (ID 递增)' : '倒序 (ID 递减)';
				directionSelect.appendChild(option);
			});
			// 设置选择框的当前选中值，基于 `currentScriptConfig` 或默认值
			directionSelect.value = currentScriptConfig.bulkReadDirection || DEFAULT_CONFIG.bulkReadDirection;
			directionGroup.append(directionLabel, directionSelect);
			panel.appendChild(directionGroup);

			// 创建操作按钮行（保存当前设置、开始/停止运行）
			const bulkReadButtonRow = document.createElement('div');
			bulkReadButtonRow.className = `${SCRIPT_ID_PREFIX}-buttons`;

			// 创建“保存当前（批量阅读）设置”按钮
			const saveBulkConfigBtn = this.createButton('保存当前设置', 'save', () => {
				// 获取UI上输入的起始ID和选择的读取顺序
				const newStartId = this.getInputValue('bulkReadStartTopicId');
				const newDirection = document.getElementById(`${SCRIPT_ID_PREFIX}-config-select-bulkReadDirection`).value;
				// 更新全局配置对象中的相应值
				currentScriptConfig.bulkReadStartTopicId = newStartId;
				currentScriptConfig.bulkReadDirection = newDirection;
				saveConfiguration(); // 保存更新后的配置到 LocalStorage
				const directionText = newDirection === 'forward' ? '正序' : '倒序';
				alert(`“批量阅读”设置已保存：起始ID ${newStartId}, 读取顺序 ${directionText}`);
				console.log(`UI操作提示：“批量阅读”的特定设置已手动保存。起始ID: ${newStartId}, 读取顺序: ${directionText}`);
				// 如果 `getInputValue` 对起始ID进行了校验修正，同步更新UI输入框的显示值
				const idInputElement = document.getElementById(`${SCRIPT_ID_PREFIX}-config-input-bulkReadStartTopicId`);
				if (idInputElement) idInputElement.value = currentScriptConfig.bulkReadStartTopicId.toString();
			});
			saveBulkConfigBtn.id = `${SCRIPT_ID_PREFIX}-bulk-save-button`; // 为按钮设置ID，便于后续控制

			// 创建“开始运行”/“停止运行”按钮（状态动态变化）
			const runStopBtn = this.createButton(
				isBulkReadingSessionActive ? '停止运行' : '开始运行', // 根据当前运行状态决定按钮文本
				isBulkReadingSessionActive ? 'stop' : 'run', // 根据当前运行状态决定按钮样式类
				() => { // 点击事件处理函数
					if (isBulkReadingSessionActive) {
						// 如果当前正在运行，则调用停止函数
						stopBulkReadingSession();
					} else {
						// 如果当前未运行，则获取面板上的最新设置，保存，然后启动批量阅读
						const startIdFromInput = this.getInputValue('bulkReadStartTopicId');
						const directionFromSelect = document.getElementById(`${SCRIPT_ID_PREFIX}-config-select-bulkReadDirection`).value;
						currentScriptConfig.bulkReadStartTopicId = startIdFromInput;
						currentScriptConfig.bulkReadDirection = directionFromSelect;
						saveConfiguration(); // 在启动前，确保当前面板上的设置被保存
						startBulkReadingSession(currentScriptConfig.bulkReadStartTopicId); // 调用全局的批量阅读启动函数
					}
				}
			);
			runStopBtn.id = `${SCRIPT_ID_PREFIX}-bulk-runstop-button`; // 为按钮设置ID
			bulkReadButtonRow.append(saveBulkConfigBtn, runStopBtn);
			panel.appendChild(bulkReadButtonRow);

			// 创建状态显示区域的 `<div>`
			const statusDiv = document.createElement('div');
			statusDiv.id = `${SCRIPT_ID_PREFIX}-bulk-read-status`;
			this.setBulkReadStatus(); // 初始化状态显示区域的文本（会根据 `isBulkReadingSessionActive` 自动判断）
			panel.appendChild(statusDiv);

			// 创建“返回通用设置”按钮
			const backBtn = this.createButton('返回通用设置', 'close', () => {
				if (isBulkReadingSessionActive) { // 如果“批量阅读”功能正在运行中
					// 提示用户是否要停止运行中的任务，并确认
					if (!confirm("“批量阅读”功能当前正在运行中。确定要停止该功能并返回到通用设置页面吗？")) {
						return; // 用户取消操作，则不执行任何后续动作
					}
					stopBulkReadingSession(); // 用户确认，则先停止批量阅读
				}
				this.removeExistingPanel(); // 移除当前“批量阅读”面板
				// 渲染“通用设置”面板，并传递 `restoreScrollOnReturn` 值，以便恢复其滚动条位置
				this.renderGeneralSettingsPanel(restoreScrollOnReturn);
			});
			backBtn.style.flexBasis = '100%'; // 使返回按钮占据整行宽度
			backBtn.style.marginTop = '20px'; // 添加一些上边距，与其他按钮组分隔

			const backButtonRow = document.createElement('div'); // 为返回按钮创建一个单独的行容器
			backButtonRow.className = `${SCRIPT_ID_PREFIX}-buttons`;
			backButtonRow.appendChild(backBtn);
			panel.appendChild(backButtonRow);

			this.panelContainer.appendChild(panel); // 将面板添加到遮罩层
			document.body.appendChild(this.panelContainer); // 将遮罩层添加到文档主体
			// 根据当前是否正在运行批量阅读，初始化面板上各控件的启用/禁用状态
			this.updateBulkReadControls(isBulkReadingSessionActive);
		},

		/**
		 * @function updateBulkReadControls
		 * @memberof UIManager
		 * @description 更新“批量阅读”设置面板中各个交互控件（如输入框、选择框、按钮）的启用/禁用状态和文本内容。
		 * 此函数通常在“批量阅读”功能开始或停止时被调用，以反映当前的操作状态。
		 * @param {boolean} isRunning - 一个布尔值，指示“批量阅读”功能当前是否正在运行 (`true` 为正在运行)。
		 */
		updateBulkReadControls: function (isRunning) {
			// 获取相关的UI元素
			const startIdInput = document.getElementById(`${SCRIPT_ID_PREFIX}-config-input-bulkReadStartTopicId`);
			const directionSelect = document.getElementById(`${SCRIPT_ID_PREFIX}-config-select-bulkReadDirection`);
			const saveButton = document.getElementById(`${SCRIPT_ID_PREFIX}-bulk-save-button`);
			const runStopButton = document.getElementById(`${SCRIPT_ID_PREFIX}-bulk-runstop-button`);

			// 如果正在运行，则禁用起始ID输入框、读取顺序选择框和“保存当前设置”按钮
			if (startIdInput) {
				startIdInput.disabled = isRunning;
				// 如果不是在运行状态，确保输入框显示的是最新的配置值 (可能在后台被其他逻辑修改过，例如批量读取自动更新断点)
				if (!isRunning) startIdInput.value = currentScriptConfig.bulkReadStartTopicId.toString();
			}
			if (directionSelect) {
				directionSelect.disabled = isRunning;
				// 同理，更新选择框的显示值
				if (!isRunning) directionSelect.value = currentScriptConfig.bulkReadDirection;
			}
			if (saveButton) {
				saveButton.disabled = isRunning;
			}

			// 更新“开始运行”/“停止运行”按钮的文本和样式类
			if (runStopButton) {
				runStopButton.textContent = isRunning ? '停止运行' : '开始运行';
				runStopButton.className = `${SCRIPT_ID_PREFIX}-button ${isRunning ? 'stop' : 'run'}`;
			}
			// 注意：状态显示区域的文本 (`bulk-read-status`) 由 `setBulkReadStatus` 函数独立负责更新，
			// 此处不直接修改，以保持逻辑分离。
		},

		/**
		 * @function setBulkReadStatus
		 * @memberof UIManager
		 * @description 设置“批量阅读”面板中状态显示区域 (`#${SCRIPT_ID_PREFIX}-bulk-read-status`) 的文本内容。
		 * @param {string} [statusText=null] - （可选）需要直接显示的状态文本。
		 * 如果提供此参数，则直接使用它。
		 * 如果为 `null` (默认)，则函数会根据全局的 `isBulkReadingSessionActive`
		 * 和相关的配置信息自动生成合适的状态文本。
		 */
		setBulkReadStatus: function (statusText = null) {
			const statusElement = document.getElementById(`${SCRIPT_ID_PREFIX}-bulk-read-status`);
			if (statusElement) { // 确保状态显示元素存在于DOM中
				if (statusText !== null) { // 如果直接提供了状态文本，则使用该文本
					statusElement.textContent = statusText;
				} else {
					// 如果未提供 `statusText`，则根据当前脚本的运行状态自动生成状态文本
					const directionText = currentScriptConfig.bulkReadDirection === 'forward' ? '正序' : '倒序';
					if (isBulkReadingSessionActive) {
						// 如果“批量阅读”正在运行，通常状态文本会由 `startBulkReadingSession` 函数动态更新。
						// 此处提供一个备用的/初始的文本，以防万一在 `startBulkReadingSession` 更新前被调用。
						// 检查当前状态文本是否已是运行中的信息，避免不必要的重复设置。
						if (!statusElement.textContent.startsWith("运行中") && !statusElement.textContent.startsWith("等待")) {
							statusElement.textContent = `运行中... (${directionText}) 当前尝试ID: ${currentBulkReadTopicIdInProgress}`;
						}
					} else {
						// 如果“批量阅读”未运行，显示准备状态和下次启动时将使用的配置信息
						statusElement.textContent = `未运行。下次将从ID ${currentScriptConfig.bulkReadStartTopicId} (${directionText}) 开始。`;
					}
				}
			}
		},

		/**
		 * @function removeExistingPanel
		 * @memberof UIManager
		 * @description 从 DOM 中移除当前显示的设置面板（如果存在的话）。
		 * 它会查找并移除 `this.panelContainer` 指向的元素，并将其重置为 `null`。
		 */
		removeExistingPanel: function () {
			if (this.panelContainer && this.panelContainer.parentNode) {
				// 如果 `panelContainer` 存在并且它有一个父节点，则安全地从其父节点中移除它
				this.panelContainer.parentNode.removeChild(this.panelContainer);
			}
			this.panelContainer = null; // 重置引用，表示当前没有活动的面板
		},

		/**
		 * @function insertSettingsButton
		 * @memberof UIManager
		 * @description 在页面的头部图标区域（通常是 Discourse 论坛右上角的 `.d-header-icons` 容器）
		 * 插入一个用于打开本脚本设置面板的按钮。
		 * 此函数会无限期等待目标容器加载完成，确保按钮能被正确插入。
		 */
		insertSettingsButton: function () {
			// 使用 `waitForCondition` 来等待 Discourse 论坛的头部图标容器 `.d-header-icons` 加载完成。
			// `Infinity` 表示无限期等待，确保即使在网络缓慢或页面结构复杂的情况下也能成功插入。
			waitForCondition(
				() => document.querySelector('.d-header-icons'), // 条件函数：检查目标容器是否存在
				() => { // 回调函数：当目标容器加载完成后执行此处的逻辑
					console.log("UI提示：目标容器 '.d-header-icons' 已成功加载。准备插入脚本设置按钮。");
					const headerIconsContainer = document.querySelector('.d-header-icons');

					// 防止重复添加按钮（例如，在SPA页面切换或脚本被意外多次执行时）
					if (headerIconsContainer.querySelector(`.${SCRIPT_ID_PREFIX}-settings-button-container`)) {
						console.log("UI提示：脚本设置按钮似乎已存在，跳过重复插入。");
						return;
					}

					const listItem = document.createElement('li'); // 创建一个 `<li>` 元素来容纳按钮，以匹配论坛头部图标的列表结构
					// 沿用 Discourse 头部图标项的现有 CSS 类，使其在外观上与原生图标按钮保持一致，
					// 并添加一个脚本特定的类名用于标识和可能的进一步样式控制。
					listItem.className = `header-dropdown-toggle ${SCRIPT_ID_PREFIX}-settings-button-container`;

					const button = document.createElement('button'); // 创建按钮元素
					// 沿用 Discourse 图标按钮的 CSS 类，如 'btn', 'no-text', 'btn-icon', 'icon', 'btn-flat'
					button.className = 'btn no-text btn-icon icon btn-flat';
					button.title = `脚本设置 (${GM_info.script.name})`; // 设置鼠标悬停时的提示文本
					button.setAttribute('aria-label', `脚本设置 (${GM_info.script.name})`); // 设置 ARIA 标签，增强可访问性
					button.type = 'button'; // 明确按钮类型，避免在表单中意外触发表单提交

					// 创建并使用 SVG 图标 (通常是一个齿轮图标，代表“设置”)
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					// 应用 Discourse 用于 SVG 图标的类名
					svgIcon.classList.add('fa', 'd-icon', 'd-icon-gear', 'svg-icon', 'svg-string');
					svgIcon.setAttribute('aria-hidden', 'true'); // 对辅助技术隐藏装饰性图标
					const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
					// 引用 Discourse 内置的 `#gear` SVG 定义（通常在页面的某个地方定义了所有图标）
					useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#gear');
					svgIcon.appendChild(useElement);
					button.appendChild(svgIcon); // 将 SVG 图标添加到按钮中

					// 为设置按钮添加点击事件监听器
					button.addEventListener('click', (event) => {
						event.preventDefault(); // 阻止可能的默认行为（例如，如果按钮在链接内）
						event.stopPropagation(); // 阻止事件冒泡，避免触发父元素上可能存在的点击事件

						// 检查设置面板是否已打开
						const existingPanel = document.querySelector(`.${SCRIPT_ID_PREFIX}-overlay`);

						if (isBulkReadingSessionActive) { // 如果“批量阅读”功能当前正在运行
							// 如果“批量阅读”面板已打开且正在运行，提示用户应在面板内操作
							if (existingPanel && existingPanel.querySelector(`#${SCRIPT_ID_PREFIX}-bulk-read-panel`)) {
								alert("“批量阅读”功能正在运行中。请使用面板内的“停止运行”按钮，或通过“返回通用设置”按钮（将提示您停止运行）来管理。");
								return;
							}
							// 如果“批量阅读”正在后台运行，但当前面板未打开，或者打开的是通用设置面板
							// 提示用户是否需要切换到“批量阅读”面板进行管理
							if (confirm("“批量阅读”功能当前正在后台运行中。\n\n要打开设置，建议先通过“批量阅读”面板停止该功能，或直接在此处打开面板进行管理。\n\n是否现在打开/切换到“批量阅读”设置面板？")) {
								this.renderBulkReadPanel(); // 渲染并显示“批量阅读”面板
							}
						} else {
							// 如果“批量阅读”未运行，则正常切换/打开设置面板
							if (existingPanel) {
								this.removeExistingPanel(); // 如果面板已打开，则关闭它（实现点击按钮切换显示/隐藏）
							} else {
								this.renderGeneralSettingsPanel(); // 如果面板未打开，则打开“通用设置”面板
							}
						}
					});

					listItem.appendChild(button); // 将按钮添加到 `<li>` 元素中

					// 尝试将设置按钮插入到搜索图标 (`.search-dropdown`) 之前，如果搜索图标存在且是容器的直接子元素。
					// 这是为了让脚本按钮尽可能地融入原生UI的布局顺序。
					const searchIconLi = headerIconsContainer.querySelector('.search-dropdown');
					if (searchIconLi && searchIconLi.parentNode === headerIconsContainer) {
						headerIconsContainer.insertBefore(listItem, searchIconLi);
					} else {
						// 否则（例如搜索图标不存在或结构不同），将设置按钮插入到头部图标容器的开头
						headerIconsContainer.insertBefore(listItem, headerIconsContainer.firstChild);
					}
					console.log("UI提示：脚本设置按钮已成功添加到页面头部。");
				},
				500, // 检查间隔：每500毫秒检查一次目标容器是否加载
				Infinity // 总等待超时：Infinity 表示无限期等待，直到容器加载完成
			);
		}
	};

	// =================================================================================
	// IX. 初始化与主执行逻辑 (Initialization & Main Execution Logic)
	// =================================================================================

	/**
	 * @function isTopicPage
	 * @description 判断当前浏览器的 URL 是否指向一个论坛的帖子详情页面。
	 * Discourse 论坛的帖子 URL 通常具有 `/t/topic-slug/topic-id` 这样的结构，
	 * 后面可能还跟着楼层号或分页参数等。
	 * @returns {boolean} 如果当前 URL 符合帖子详情页的模式，则返回 `true`；否则返回 `false`。
	 */
	function isTopicPage() {
		// 正则表达式解析：
		// `^/t/`     : 路径以 `/t/` 开头 (Discourse 帖子路径的标志)
		// `[^/]+`    : 后面跟着至少一个非斜杠字符 (通常是帖子的 slug，即标题的 URL友好版本)
		// `/\d+`     : 再后面跟着一个斜杠和至少一个数字 (这是帖子的 ID)
		// `(?:\/.*|\?.*)?`: 这是一个可选的非捕获组，匹配以下任一情况：
		//    `\/.*`  : 斜杠后跟任意字符 (例如 `/楼层号` 或 `/楼层号/编辑`)
		//    `|\?.*` : 或者问号后跟任意字符 (例如 `?page=2`)
		//    `?`     : 使整个非捕获组可选
		// 此正则旨在更准确地识别帖子页面，同时允许 URL末尾有其他参数或路径段。
		return /^\/t\/[^/]+\/\d+(?:\/.*|\?.*)?$/.test(window.location.pathname + window.location.search);
	}

	/**
	 * @function extractTopicIdFromUrl
	 * @description 从当前浏览器的 URL 中提取帖子的 ID。
	 * @returns {string|null} 如果成功从 URL (路径部分) 中提取到帖子 ID (一串数字)，则返回该 ID 字符串。
	 * 如果 URL 不符合预期的帖子详情页格式或无法提取 ID，则返回 `null`。
	 */
	function extractTopicIdFromUrl() {
		// 正则表达式解析：
		// `\/t\/`   : 匹配路径中的 `/t/` 部分。
		// `[^/]+`  : 匹配帖子 slug (至少一个非斜杠字符)。
		// `\/(\d+)`: 匹配一个斜杠，然后捕获 (`()`) 后面跟着的至少一个数字 (`\d+`)，这就是帖子 ID。
		const match = window.location.pathname.match(/\/t\/[^/]+\/(\d+)/);
		// 如果匹配成功，`match` 是一个数组，其中 `match[1]` 包含捕获到的帖子 ID。
		return match ? match[1] : null;
	}

	/**
	 * @function initializeScript
	 * @description 脚本的总入口和初始化函数。
	 * 它负责执行脚本启动时需要进行的所有设置和检查：
	 * 1. 加载用户配置（或默认配置）。
	 * 2. 在控制台打印脚本加载信息和当前生效的配置，方便用户调试。
	 * 3. 向页面注入 UI 所需的 CSS 样式。
	 * 4. 在页面头部（如果找到合适位置）创建并插入设置按钮。
	 * 5. 检查当前页面是否为帖子详情页：
	 * 如果是，并且“批量阅读”功能未在后台运行，则自动开始处理当前页面的帖子，将其标记为已读。
	 */
	function initializeScript() {
		// 步骤 1: 加载脚本配置
		loadConfiguration();

		// 步骤 2: 在控制台打印脚本加载信息和当前生效的各项配置值
		console.log(`脚本 ${GM_info.script.name} 已加载，版本 ${GM_info.script.version}。下面是当前配置信息：`);
		console.log(`  每轮基础延迟(ms)：${currentScriptConfig.delayBase}`);
		console.log(`  每轮随机延迟范围(ms)：${currentScriptConfig.delayRandom}`);
		console.log(`  每轮最小请求楼层数：${currentScriptConfig.minFloor}`);
		console.log(`  每轮最大请求楼层数：${currentScriptConfig.maxFloor}`);
		console.log(`  每篇帖子最小阅读时间(ms)：${currentScriptConfig.minPostReadTime}`);
		console.log(`  每篇帖子最大阅读时间(ms)：${currentScriptConfig.maxPostReadTime}`);
		console.log(`  每条评论最小阅读时间(ms)：${currentScriptConfig.minCommentReadTime}`);
		console.log(`  每条评论最大阅读时间(ms)：${currentScriptConfig.maxCommentReadTime}`);
		console.log(`  失败后额外重试次数：${currentScriptConfig.maxRetriesPerBatch} (总尝试次数为 1 + 重试次数)`);
		console.log(`  网络请求超时(ms)：${currentScriptConfig.requestTimeout}`);
		console.log(`  批量阅读起始帖子ID：${currentScriptConfig.bulkReadStartTopicId}`);
		console.log(`  批量阅读读取方向：${currentScriptConfig.bulkReadDirection === 'forward' ? '正序 (ID递增)' : '倒序 (ID递减)'}`);
		console.log("---"); // 日志分隔符，使配置信息与后续操作日志分开

		// 步骤 3: 注入脚本 UI (设置面板等) 所需的 CSS 样式
		UIManager.injectStyles();

		// 步骤 4: 在页面上创建并插入用于打开设置面板的按钮
		UIManager.insertSettingsButton();

		// 步骤 5: 检查当前是否处于一个帖子详情页面，并据此决定是否自动开始标记
		if (isTopicPage()) { // 判断当前页面是否为帖子详情页
			const topicId = extractTopicIdFromUrl(); // 尝试从 URL 中提取帖子 ID
			if (topicId) { // 如果成功提取到帖子 ID
				// 如果“批量阅读”功能当前正在后台运行，则不应自动处理当前页面的帖子，以避免冲突或混乱。
				if (isBulkReadingSessionActive) {
					console.log("操作提示：“批量阅读”任务当前正在后台运行，脚本将暂时不自动标记当前打开的帖子页面，以避免冲突。");
				} else {
					// 如果“批量阅读”未运行，则开始处理当前页面的帖子
					console.log("页面检测：检测到已进入帖子详情页面。"); // 明确指出进入了详情页
					// `processSingleTopic` 函数内部会在开始处理时打印更详细的帖子信息（如总楼层数）
					// 此处不再重复打印 "当前帖子 ID 为..."
					processSingleTopic(topicId, false); // 调用核心处理函数，`isBulkMode` 参数为 `false` 表示非批量模式
				}
			} else {
				// 虽然 `isTopicPage` 判断为真，但未能成功提取到帖子 ID，这通常不应发生，但作为健壮性考虑，打印警告。
				console.warn("逻辑警告：当前页面被识别为帖子详情页，但未能从 URL 中成功提取帖子 ID。自动标记功能可能因此无法针对此页面启动。");
			}
		} else {
			// 如果当前页面不是帖子详情页，则脚本不执行自动标记操作，仅提供设置入口。
			console.log("页面检测：当前页面非帖子详情页，脚本不自动执行标记操作。您可以通过设置按钮进行配置或启动批量阅读。");
		}
	}

	// 监听浏览器窗口或标签页即将被关闭或刷新的事件 (`beforeunload`)
	// 这提供了一个机会，在用户离开页面前执行一些清理操作或给出提示。
	window.addEventListener('beforeunload', () => {
		// 如果“批量阅读”功能正在运行中，当用户尝试关闭页面时，
		// 打印一条提示信息，告知用户其进度（即下一个要处理的帖子ID）通常已在每次处理帖子前被保存。
		// 这是为了让用户放心，即使意外关闭页面，下次启动时通常也能从中断的地方继续。
		if (isBulkReadingSessionActive) {
			// `currentScriptConfig.bulkReadStartTopicId` 会在 `startBulkReadingSession` 循环中实时更新并保存到 LocalStorage。
			console.log("操作提示：页面即将关闭或刷新。如果“批量阅读”功能正在运行，其进度（下一个待处理帖子ID）已在处理每个帖子前自动保存。");
		}
	});

	// =================================================================================
	// 脚本启动执行点 (Script Execution Start Point)
	// =================================================================================
	initializeScript(); // 调用初始化函数，启动脚本的全部功能

})();