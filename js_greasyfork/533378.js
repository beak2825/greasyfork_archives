// ==UserScript==
// @name         大帝理赔页面优化
// @namespace    https://claim.ccic-net.com.cn
// @icon         https://sso.ccic-net.com.cn/casserver/favicon.ico
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @version      0.8.6.6
// @description  用于2015版大帝理赔页面
// @author       sexjpg
// @match        https://claim.ccic-net.com.cn/claim/synergismOpenClaimController*
// @match        https://claim.ccic-net.com.cn:25075/claim/synergismOpenClaimController*
// @match        https://claim.ccic-net.com.cn*/claim/synergismOpenClaimController*
// @match        https://claim.ccic-net.com.cn*/claim/bpmTaskController.do*
// @match        https://claim.ccic-net.com.cn:25075/claim/casLoginController.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant       GM_notification
// @grant       GM_closeNotification
// @storageName   CCIC_Claim
// @connect      *
// @noframes
// @run-at       document-end


// @downloadURL https://update.greasyfork.org/scripts/533378/%E5%A4%A7%E5%B8%9D%E7%90%86%E8%B5%94%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533378/%E5%A4%A7%E5%B8%9D%E7%90%86%E8%B5%94%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);
/**
 * 改进版的 HTTP 请求函数，使用统一的缓存存储结构
 * @param {string} url - 请求的URL
 * @param {string|URLSearchParams} data - 表单数据
 * @param {Object} json - JSON数据
 * @param {Object} headers - 自定义请求头
 * @param {number} CachexpiryMs - 缓存过期时间,默认5,设为0时不缓存
 * @returns {Promise<Object>} 返回包含响应数据的Promise
 */
async function httpRequest(url, data = "", json = "", headers = {} ,CachexpiryMs = 5) {

	

	// 防止同时传递data和json参数
	if (data && json) {
		throw new Error("Cannot provide both 'data' and 'json' parameters. Choose one.");
	}

	// 缓存相关功能
	const generateCacheKey = () => {
		// 生成唯一的缓存键
		const requestData = {
			url,
			data,
			json,
			headers
		};
		return btoa(encodeURIComponent(JSON.stringify(requestData)));
	};

	// 检查是否有可用缓存
	// 检查是否有可用缓存
	const getCachedResponse = () => {
		try {
			const cacheData = localStorage.getItem('http_cache');
			if (!cacheData) return null;

			const cacheObj = JSON.parse(cacheData);
			const cacheKey = generateCacheKey();
			const cachedItem = cacheObj[cacheKey];

			if (cachedItem) {
				// 检查是否过期 (默认缓存5分钟)
				if (Date.now() - cachedItem.timestamp < cachedItem.expiry) {
					// 重构缓存的数据为mockResponse格式
					const cachedData = cachedItem.data;
					return {
						ok: cachedData.ok,
						status: cachedData.status,
						statusText: cachedData.statusText,
						type: cachedData.type,
						redirected: cachedData.redirected,
						url: cachedData.url,
						text: () => cachedData._text,
						json: () => {
							if (cachedData._contentType && cachedData._contentType.includes('application/json')) {
								return JSON.parse(cachedData._text);
							}
							try {
								return JSON.parse(cachedData._text);
							} catch (e) {
								console.error('Failed to parse JSON:', e);
								return {};
							}
							console.error('Response is not JSON');
							return {};
						},
						html: () => {
							if (cachedData._contentType && cachedData._contentType.includes('text/html')) {
								return new DOMParser().parseFromString(cachedData._text, 'text/html');
							}
							console.error('Response is not HTML');
							return new DOMParser().parseFromString('', 'text/html');
						}
					};
				} else {
					// 删除过期缓存
					delete cacheObj[cacheKey];
					localStorage.setItem('http_cache', JSON.stringify(cacheObj));
				}
			}
		} catch (e) {
			console.warn('Failed to retrieve cached response:', e);
		}
		return null;
	};

	// 缓存响应
	const cacheResponse = (responseData, expiryMs = CachexpiryMs * 60 * 1000) => {
		try {
			const cacheKey = generateCacheKey();
			let cacheObj = {};

			// 获取现有缓存
			const existingCache = localStorage.getItem('http_cache');
			if (existingCache) {
				cacheObj = JSON.parse(existingCache);
			}

			// 添加新缓存项
			cacheObj[cacheKey] = {
				data: responseData,
				timestamp: Date.now(),
				expiry: expiryMs
			};

			localStorage.setItem('http_cache', JSON.stringify(cacheObj));
		} catch (e) {
			console.warn('Failed to cache response:', e);
		}
	};

	// 清理所有过期缓存
	const cleanExpiredCache = () => {
		try {
			const cacheData = localStorage.getItem('http_cache');
			if (!cacheData) return;

			const cacheObj = JSON.parse(cacheData);
			const currentTime = Date.now();
			let hasExpired = false;

			// 删除过期项
			for (const key in cacheObj) {
				if (currentTime - cacheObj[key].timestamp >= cacheObj[key].expiry) {
					delete cacheObj[key];
					hasExpired = true;
				}
			}

			// 如果有删除的项，更新存储
			if (hasExpired) {
				localStorage.setItem('http_cache', JSON.stringify(cacheObj));
			}
		} catch (e) {
			console.warn('Failed to clean expired cache:', e);
		}
	};

	// 清理所有缓存
	const clearAllCache = () => {
		try {
			localStorage.removeItem('http_cache');
		} catch (e) {
			console.warn('Failed to clear cache:', e);
		}
	};

	// 获取缓存统计信息
	const getCacheStats = () => {
		try {
			const cacheData = localStorage.getItem('http_cache');
			if (!cacheData) return { total: 0, valid: 0, expired: 0 };

			const cacheObj = JSON.parse(cacheData);
			const currentTime = Date.now();
			let valid = 0;
			let expired = 0;

			for (const key in cacheObj) {
				if (currentTime - cacheObj[key].timestamp < cacheObj[key].expiry) {
					valid++;
				} else {
					expired++;
				}
			}

			return {
				total: Object.keys(cacheObj).length,
				valid,
				expired
			};
		} catch (e) {
			console.warn('Failed to get cache stats:', e);
			return { total: 0, valid: 0, expired: 0 };
		}
	};

	// 定期清理过期缓存（每10次请求清理一次）
	if (Math.random() < 0.1) {
		cleanExpiredCache();
	}

	// 首先检查缓存
	const cachedResponse = getCachedResponse();
	if (cachedResponse) {
		console.debug(`正在获取缓存... ${url}`);
		return cachedResponse;
	}

	// 保留用户自定义Content-Type，仅在未提供时自动设置
	let contentTypeHeader = headers['Content-Type'] || headers['content-type'];
	if (!contentTypeHeader) {
		if (data) {
			contentTypeHeader = 'application/x-www-form-urlencoded';
		} else if (json) {
			contentTypeHeader = 'application/json;charset=UTF-8';
		} else {
			contentTypeHeader = 'text/html';
		}
	}

	const options = {
		method: data || json ? "POST" : "GET",
		credentials: "include",
		headers: {
			...headers,
			'Content-Type': contentTypeHeader
		},
	};

	if (data) {
		options.body = new URLSearchParams(data).toString();
	}

	if (json) {
		options.body = JSON.stringify(json);
	}

	try {
		console.debug(`httpRequst请求数据 URL,options`, url,options);
		const response = await fetch(url, options);
		// 提前读取响应文本，避免多次读取流
		const text = await response.text();
		// 获取响应的实际Content-Type
		const responseContentType = response.headers.get('Content-Type');

		// 改进错误处理，根据实际响应类型解析错误信息
		if (!response.ok) {
			let errorMessage = `HTTP error! status: ${response.status}`;
			if (responseContentType && responseContentType.includes('application/json')) {
				try {
					const errorData = JSON.parse(text);
					errorMessage += `, message: ${errorData.message || JSON.stringify(errorData)}`;
				} catch (e) {
					// errorMessage += `, message: ${text}`;
				}
			} else {
				// errorMessage += `, message: ${text}`;
			}
			// throw new Error(errorMessage);
            console.error('httpRequest请求错误',errorMessage,{url,options});
		}

		// 按需解析响应，避免提前解析
		const mockResponse = {
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			type: response.type,
			redirected: response.redirected,
			url: response.url,
			body: response.body,
			text: () => text,
			json: () => {
				if (responseContentType && responseContentType.includes('application/json')) {
					return JSON.parse(text);
				}
				try {
					return JSON.parse(text);
				} catch (e) {
					console.error('Failed to parse JSON:', e);
					return {};
				}
				console.error('Response is not JSON');
				return {};
			},
			html: () => {
				if (responseContentType && responseContentType.includes('text/html')) {
					return new DOMParser().parseFromString(text, 'text/html');
				}
				console.error('Response is not HTML');
				return new DOMParser().parseFromString('', 'text/html');
			}
		};

		// 修改缓存成功的响应部分
		// 缓存成功的响应
		if (responseContentType &&
			(responseContentType.includes('text/') ||
				responseContentType.includes('application/json'))) {
			// 创建用于缓存的简化响应对象
			const cacheableResponse = {
				ok: response.ok,
				status: response.status,
				statusText: response.statusText,
				type: response.type,
				redirected: response.redirected,
				url: response.url,
				// 只缓存原始文本数据，而不是函数
				_text: text,
				_contentType: responseContentType
			};

			cacheResponse(cacheableResponse);
		}

		return mockResponse;

	} catch (error) {
		throw error;
	}
}


function HoverTip (context, element, content, id = "") {
  // 判断上下文类型并获取相应的document和window对象
  let contextDocument, contextWindow;

  if (context === window || context === document) {
    // 主窗口环境
    contextDocument = document;
    contextWindow = window;
  } else if (context.contentDocument || context.contentWindow) {
    // iframe环境
    contextDocument = context.contentDocument || context.contentWindow.document;
    contextWindow = context.contentWindow;
  } else {
    // 其他情况，默认使用传入的context作为document
    contextDocument = context;
    contextWindow = context.defaultView || context.parentWindow || window;
  }

  let hoverDiv = null;

  // 创建悬浮提示框
  /**
   * 初始化悬浮框DOM元素
   * 设置基础样式和内容
   * @returns {HTMLDivElement} 创建的悬浮框元素
   */
  const createHoverDiv = () => {
    hoverDiv = contextDocument.createElement("div");
    hoverDiv.style.cssText = `
                display:none;
                position:absolute;
                background:#f9f9f9;
                border:1px solid #ddd;
                padding:5px;
                z-index:1000;
                box-shadow:0 0 3px rgba(0,0,0,0.5);
                pointer-events: auto;
                background-color: #ffff00d3

;
            `;
    hoverDiv.innerHTML = content;
    if (id) hoverDiv.id = id;
    contextDocument.body.appendChild(hoverDiv);
    return hoverDiv;
  };

  hoverDiv = createHoverDiv();

  // 统一事件处理器
  /**
   * 鼠标进入基准元素时的处理逻辑
   * 显示悬浮框并计算定位位置
   */
  const handleElementEnter = (event) => {
    // 显示提示框
    hoverDiv.style.display = "block";

    // 定位逻辑
    if (context === window || context === document) {
      // 主窗口环境定位
      hoverDiv.style.left = `${event.clientX + 15}px`;
      hoverDiv.style.top = `${event.clientY}px`;
    } else {
      // iframe环境定位
      const rect = context.getBoundingClientRect();
      const scrollX = contextWindow.scrollX;
      const scrollY = contextWindow.scrollY;
      hoverDiv.style.left = `${event.clientX + scrollX - rect.left + 15}px`;
      hoverDiv.style.top = `${event.clientY + scrollY - rect.top}px`;
    }
  };

  /**
   * 鼠标离开悬浮框时的处理逻辑
   * 隐藏悬浮框
   */
  const handleHoverDivLeave = () => {
    hoverDiv.style.display = "none";
  };

  // 事件监听优化
  // 使用状态标志位解决鼠标在元素与悬浮框之间的过渡闪烁问题
  let isHoveringDiv = false;

  // 元素鼠标事件绑定
  element.addEventListener("mouseenter", handleElementEnter);
  element.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!isHoveringDiv) {
        handleHoverDivLeave();
      }
    }, 100);
  });

  // 悬浮框自身鼠标事件绑定
  hoverDiv.addEventListener("mouseenter", () => {
    isHoveringDiv = true;
    hoverDiv.style.display = "block";
  });
  hoverDiv.addEventListener("mouseleave", () => {
    isHoveringDiv = false;
    handleHoverDivLeave();
  });

  // 窗口尺寸变化处理
  // 隐藏悬浮框避免定位错误
  contextWindow.addEventListener("resize", () => {
    hoverDiv.style.display = "none";
  });

  return hoverDiv;
}

let 合作维修厂, 配件编码风险, CSV_配件编码
const Tasks = {}
const Cases = {};
const Cars = {};
let myconfig

myconfig = GM_getValue('config') || {}
myconfig.areas = Array.isArray(myconfig.areas) ? myconfig.areas : [] // 类型安全
myconfig.tailNo = Array.isArray(myconfig.tailNo) ? myconfig.tailNo : [] // 类型安全
myconfig.publicNo = Array.isArray(myconfig.publicNo) ? myconfig.publicNo : [] // 类型安全

// 记录已监听的 iframe，避免重复绑定事件
const observedIframes = new WeakSet();

// 这里是全局变量,iframe_names_car是车辆损失相关页面,iframe_name_other是其他页面
const iframe_names_car = ['CarComponent', 'CarLoss']
const iframe_name_other = ['BIClaim', 'PropLoss', 'IntelligentUnwrtAudit', 'CarEstiAdjust']

class Common {


	// 在iframe中添加按钮
	static addinitBTN(iframe) {
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document;

		// 创建小图标
		const minimizeIcon = document.createElement("div");
		minimizeIcon.style.position = "fixed";
		minimizeIcon.style.bottom = "1px";
		minimizeIcon.style.right = "1px";
		minimizeIcon.style.fontSize = "18px";
		minimizeIcon.style.width = "25px";
		minimizeIcon.style.height = "25px";
		minimizeIcon.style.backgroundColor = "#007bff";
		minimizeIcon.style.borderRadius = "50%";
		minimizeIcon.style.cursor = "pointer";
		minimizeIcon.style.display = "flex"; // 初始状态显示
		minimizeIcon.style.alignItems = "center";
		minimizeIcon.style.justifyContent = "center";
		minimizeIcon.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";
		minimizeIcon.style.color = "white";
		minimizeIcon.innerHTML =
			iframe.name && iframe_names_car.some((str) => iframe.name.includes(str))
				? "🚗"
				: "🌏"; // 使用一个图标表示

		iframeDocument.body.appendChild(minimizeIcon);

		// 点击按钮展开对应动作
		minimizeIcon.addEventListener("click", function () {
			if (
				iframe.name &&
				iframe_names_car.some((str) => iframe.name.includes(str))
			) {
				Common.handle_iframe_carloss(iframe);
			} else if (
				iframe.name &&
				iframe_name_other.some((str) => iframe.name.includes(str))
			) {
				Common.handle_iframe_others(iframe);
			}
		});
	}

	// 监控 iframe 的生成和移除
	static monitorIframes() {
		const targetNode = document.body;
		const config = { childList: true, subtree: true };

		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				// 处理新增的节点
				mutation.addedNodes.forEach((node) => {
					if (node.tagName === "IFRAME") {
						console.debug("iframe 被添加:", node);
						this.bindIframeLoadEvent(node);
					} else if (node.querySelector) {
						// 检查子节点中的 iframe（例如动态插入的容器）
						const iframes = $$("iframe", node);
						iframes.forEach((iframe) => {
							console.debug("iframe 被添加（嵌套）:", iframe);
							this.bindIframeLoadEvent(iframe);
						});
					}
				});

				// 处理移除的节点
				mutation.removedNodes.forEach((node) => {
					if (node.tagName === "IFRAME") {
						console.debug("iframe 被移除:", node);
					} else if (node.querySelector) {
						const iframes = $$("iframe", node);
						iframes.forEach((iframe) => {
							console.debug("iframe 被移除（嵌套）:", iframe);
						});
					}
				});
			}
		});

		observer.observe(targetNode, config);

		// ✅ 新增：立即处理页面初始加载时已存在的iframe
		$$("iframe").forEach((iframe) => {
			this.bindIframeLoadEvent(iframe);
		});

		console.log("开始监控 iframe 的动态生成、移除及加载事件...");
	}

	// 监控 iframe 的加载完成事件
	static bindIframeLoadEvent(iframe) {
		if (observedIframes.has(iframe)) return; // 避免重复监听
		observedIframes.add(iframe);

		// 监听 iframe 的 load 事件
		iframe.addEventListener("load", () => {
			console.debug("iframe 加载完成:", iframe);
			//加入处理逻辑

			this.handleifame_events(iframe);

		});

		// 检查 iframe 是否已经加载完成（例如缓存导致立即加载）
		if (iframe.contentDocument?.readyState === "complete") {
			console.debug("iframe 已缓存加载完成:", iframe);
		}
	}

	//处理iframe事件
	static handleifame_events(iframe) {

		// Modules.handleImageLink(iframe);
		// Modules.autuclick_intelligentUnwrt(iframe);
		// Modules.addTransferdiv(iframe);

		const ifamenames = iframe_names_car.concat(iframe_name_other);
		if (ifamenames.some((str) => iframe.name.includes(str))) {

			Common.addinitBTN(iframe);
			Modules.handleImageLink(iframe);
			Modules.autuclick_intelligentUnwrt(iframe);
			const navbar = new Navbar(iframe)
			if (
				iframe.name &&
				iframe_names_car.some((str) => iframe.name.includes(str))
			) {
				Common.handle_iframe_carloss(iframe);
			} else if (
				iframe.name &&
				iframe_name_other.some((str) => iframe.name.includes(str))
			) {
				Common.handle_iframe_others(iframe);
			}
		}
	}


	// toast提示
	static toast() {
		// 创建样式
		const style = document.createElement("style");
		style.textContent = `
            .brmenu-container {
                position: fixed;
                bottom: 10px;
                right: 10px;
                max-width: 35vw;
                max-height: 90vh;
                overflow-y: auto;
                display: flex;
                flex-direction: column-reverse;
                gap: 10px;
                z-index: 9999;
                padding: 10px;
            }

            .brmenu-toast {
                position: relative;
                padding: 15px 35px 15px 20px;
                border-radius: 4px;
                color: #fff;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease-out;
                opacity: 1;
                transition: opacity 0.3s;
                min-width: 200px;
                word-break: break-word;
            }
            
            .brmenu-toast.hide {
                opacity: 0;
            }
            
            .toast-close {
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
                opacity: 0.8;
                background: none;
                border: none;
                color: white;
                padding: 2px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            /* 不同类型颜色 */
            .toast-info { background-color: #3498db; }
            .toast-success { background-color: #27ae60; }
            .toast-warning { background-color: #f39c12; }
            .toast-error { background-color: #e74c3c; }
        `;
		document.head.appendChild(style);

		// 创建容器
		const container = document.createElement("div");
		container.className = "brmenu-container";
		document.body.appendChild(container);

		function createToast(content, type) {
			const toast = document.createElement("div");
			toast.className = `brmenu-toast toast-${type}`;

			// 关闭按钮
			const closeBtn = document.createElement("button");
			closeBtn.className = "toast-close";
			closeBtn.innerHTML = "×";
			closeBtn.onclick = () => removeToast(toast);

			// 内容
			const contentDiv = document.createElement("div");
			contentDiv.innerHTML = content;

			toast.appendChild(closeBtn);
			toast.appendChild(contentDiv);

			// 鼠标交互
			let timeout;
			const startTimeout = () => {
				timeout = setTimeout(() => removeToast(toast), 3000);
			};

			toast.addEventListener("mouseenter", () => clearTimeout(timeout));
			toast.addEventListener("mouseleave", startTimeout);

			return { toast, startTimeout };
		}

		function removeToast(toast) {
			toast.classList.add("hide");
			setTimeout(() => {
				toast.remove();
				// 当没有消息时移除容器
				if (container.children.length === 0) {
					container.remove();
				}
			}, 300);
		}

		function showMessage(type, content) {
			// 确保容器存在
			if (!document.body.contains(container)) {
				document.body.appendChild(container);
			}

			const { toast, startTimeout } = createToast(content, type);
			container.appendChild(toast);
			startTimeout();
		}

		return {
			info: (content) => showMessage("info", content),
			success: (content) => showMessage("success", content),
			warning: (content) => showMessage("warning", content),
			error: (content) => showMessage("error", content),
		};
	}

	// 计算两个日期间隔天数,需要输入两个日期时间函数,返回天数
	static 计算日期差(dateString1, dateString2) {
		// 将日期字符串转换为Date对象
		const date1 = new Date(dateString1);
		const date2 = new Date(dateString2);

		// 计算时间差（毫秒）
		const timeDifference = Math.abs(date2 - date1);

		// 将时间差转换为天数
		const daysDifference = timeDifference / (1000 * 3600 * 24);

		// 返回天数差，保留小数点后一位
		return daysDifference.toFixed(1);
	}

	// 获取小时数
	static 获取小时时段(dateTimeString) {
		// 将日期时间字符串转换为Date对象
		const date = new Date(dateTimeString);

		// 获取小时数
		const hours = date.getHours();

		// 返回小时数
		return hours;
	}

	//风险提示项目合并两个map
	static risksmerge(map1, map2) {
		const newMap = new Map(map1); // 创建一个新的Map，包含map1的所有键值对

		for (const [key, value] of map2) {
			if (newMap.has(key)) {
				// 如果新Map中已经有这个键，则合并列表
				const existingValue = newMap.get(key);
				newMap.set(key, [...existingValue, ...value]);
			} else {
				// 如果新Map中没有这个键，则直接添加
				newMap.set(key, value);
			}
		}
		return newMap;
	}

	//获取车架号年份,返回年份整数
	static getvinyear(vin) {
		// 定义VIN字符集
		const VINSTR = `0123456789ABCDEFGHJKLMNPRSTVWXYZ`
		const VIN10C = VINSTR.split('')


		// 获取VIN码第10位字符
		const charAt9 = vin.charAt(9); // 第10位字符，索引为9

		// 找到该字符在VIN10C中的索引
		const indexInVIN10C = VIN10C.indexOf(charAt9);

		// 计算对应的年份
		const yearnow = new Date().getFullYear();
		let year = 2000 + indexInVIN10C;
		if (year > yearnow) {year = year - VIN10C.length;}

		// 输出结果
		return year;
	}

	// 增加工时表
	static addfeetable(iframe, element, city) {
		function array2html(data) {
			let html = `<table border="1" cellpadding="0" cellspacing="0" >
            <tbody>
                <tr>
                <td rowspan="3" >级别</td>
                <td colspan="7" rowspan="2" align="center">${city}</td>
                </tr>
                <tr></tr>`;
			// 使用 forEach 遍历多维数组的第一层
			data.forEach((row, rowIndex) => {
				html += "<tr>";
				// 使用 forEach 遍历当前行的每个单元格
				row.forEach((cell, cellIndex) => {
					if (cellIndex == 0) {
						html += `<td class="xl74"><span class="font6">${cell}</span></td>`;
					} else {
						html += `<td height="19" class="xl75" align="right">${cell}</td>`;
					}
				});
				html += "</tr>";
			});
			html += `	</tbody></table>`;
			return html;
		}

		const repairfeedict = {};
		repairfeedict["广州、佛山、珠海、汕头、顺德"] = [
			[
				"7万以下",
				"7-15万",
				"15-25万",
				"25-35万",
				"35-50万",
				"50-80万",
				"80万以上",
			],
			[5, 430, 450, 520, 550, 650, 780, 900],
			[4, 400, 430, 480, 520, 580, 730, 800],
			[3, 380, 400, 450, 480, 540, 680, 780],
			[2, 360, 380, 420, 450, 520, 650, 750],
			[1, 330, 360, 390, 420, 480, 600, 680],
			[0, 310, 330, 360, 390, 450, 550, 650],
			[-1, 230, 250, 270, 290, 350, 420, 500],
		];

		repairfeedict["江门、中山、惠州、肇庆、茂名、揭阳、潮州"] = [
			[
				"7万以下",
				"7-15万",
				"15-25万",
				"25-35万",
				"35-50万",
				"50-80万",
				"80万以上",
			],
			[5, 410, 450, 480, 520, 600, 700, 850],
			[4, 380, 410, 440, 480, 550, 650, 750],
			[3, 360, 380, 410, 450, 520, 600, 720],
			[2, 330, 360, 380, 420, 480, 580, 680],
			[1, 310, 330, 360, 380, 450, 550, 650],
			[0, 290, 310, 330, 360, 420, 480, 600],
			[-1, 220, 240, 260, 280, 320, 380, 450],
		];

		repairfeedict["云浮、湛江、阳江、清远、韶关、梅州、河源"] = [
			[
				"7万以下",
				"7-15万",
				"15-25万",
				"25-35万",
				"35-50万",
				"50-80万",
				"80万以上",
			],
			[5, 390, 410, 430, 500, 550, 650, 750],
			[4, 360, 390, 410, 450, 500, 550, 700],
			[3, 330, 360, 390, 410, 480, 520, 680],
			[2, 310, 330, 360, 390, 450, 500, 650],
			[1, 290, 310, 330, 360, 410, 480, 600],
			[0, 270, 290, 310, 330, 380, 450, 580],
			[-1, 220, 240, 260, 280, 320, 380, 450],
		];

		const id = "repairfee";
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document;
		if (iframeDocument.getElementById(id)) {
			return;
		}
		const data = repairfeedict[city];
		const content = array2html(data);
		HoverTip(iframe, element, content, city);
	}




	/**
	 * 风险提示格式化
	 * @param {Map} Taskrisks - 风险项目,MAP数据
	 * @param {element} risk_element - 页面元素,一般这个是td,需要获取里面的文字以匹配对应的key
	 * @param {element} CSS_element - 页面元素,一般这个是tr,用于作用的元素
	 * @param {iframe} iframe - 窗口元素,一般是作用域
	 */
	static handle_Risks_CSS(KTMrisks, risk_element, CSS_element, iframe) {
		// 开始风险提示格式化
		//获取页面的文字,先获取textContent,如果为空可能是input元素,获取其value
		const elementtext = risk_element.textContent.trim() != "" ? risk_element.textContent.trim() : risk_element.value.trim();
		if (
			KTMrisks &&
			KTMrisks.size > 0 &&
			KTMrisks.has(elementtext)
		) {
			CSS_element.style.backgroundColor = "rgb(236 236 49 / 88%)";
			// 添加悬浮提示
			const risks = KTMrisks.get(elementtext);
			let riskmsg = "";
			risks.forEach((risk) => {
				riskmsg += `${risk}<br>`;
			});
			HoverTip(iframe, CSS_element, riskmsg);
		}
	}

	//从cell中获得内容
	static cellGetValue(element) {
		// 如果是单选
		const element_ischeck = $('input[type="radio"]', element);
		if (element_ischeck) {
			if ($("input[checked]", element)) {
				return $("input[checked]", element).value.trim().replace("：", "");
			} else {
				return "0";
			}
		}

		// 如果是select
		const element_isselect = $("select option", element);
		if (element_isselect) {
			return element_isselect.textContent.trim().replace("：", "");
		}

		// 如果是input
		const element_isinput = $("input", element);
		if (element_isinput) {
			return element_isinput.value.trim().replace("：", "");
		}

		// 如果啥都没有
		return element.textContent.trim().replace("：", "");
	}

	/**
	 * 流程化处理车损页面信息
	 * @param {object} iframe - iframe
	 */
	static async handle_iframe_carloss(iframe) {
		if (!(iframe.name && iframe_names_car.some((str) => iframe.name.includes(str)))) {
			return;
		}

		// 在定损页面格式化显示信息
		await this.iframe_CarLoss_formatitems(iframe);

		//获取车辆定核损验车的bpm信息
		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);

		// 获取案件信息
		let Caseinfo = Common.getABSinfos(bpmitems);

		// 弹窗显示备注信息
		Modules.displayRemarks(iframe)

		// 获取凯泰铭提示
		Common.handle_CarLoss_Risks(iframe);

		// 获取车辆信息
		let Carinfo = Common.iframe_CarLoss_getCarinfo(iframe);

		//创建一个表格,显示车辆信息
		createCarLossInfoTable( iframe);

		//检索呈报流程,并显示
		RenderFlowHandler.displayRenderFlow(iframe);


		//追加配件价格查询
		Modules.getpartprice(iframe);

		//提前检索发送给凯泰铭的数据
		Modules.checkKTM(iframe);

		



		return true;
	}

	/**
	 * 流程化处理非车损页面信息
	 * @param {object} iframe - iframe
	 */
	static handle_iframe_others(iframe) {
		// 限定iframe的name,只处理特定的iframe
		if (
			!iframe.name ||
			!iframe_name_other.some((str) => iframe.name.includes(str))
		) {
			return;
		}
		const iframeDocument =iframe.contentDocument || iframe.contentWindow.document;

		//获取车辆定核损验车的bpm信息
		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
		// const businessMainKey = bpmitems.get("businessMainKey");
		// displayRemarks(iframe, businessMainKey);
		Modules.displayRemarks(iframe)
		// 获取案件信息
		let Caseinfo = Common.getABSinfos(bpmitems);
		console.debug("非车损页面的Caseinfo", Caseinfo);
		// if(Caseinfo['CheckInfo']['indemnityDuty'] =="全责"){alert(`注意保险责任: ${Caseinfo['CheckInfo']['indemnityDuty']} `)}

		// 显示案件损失信息


		// 展现案件损失明细信息
		Modules.displaylossitems(iframe)

		//添加查勘信息
		const target_element = $("#approvalInfo, #lossProp_info, #estiAdjustAuditOpinion", iframe.contentDocument);
		if (target_element) {
			const container = createCheckinfoDiv(bpmitems.registNo, iframe);
			target_element.insertBefore(container, target_element.firstChild);
		}
	}

	static handle_iframe_Top_Message(iframe) {
		// 在文件顶部先定义防抖函数
		function debounce(func, wait = 1000) {
			let timeout;
			return function (...args) {
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(this, args), wait);
			};
		}
		// 创建临时监控
		const tempObserver = new MutationObserver((mutations) => {
			// 查找目标iframe
			const targetFrame = $('iframe[src*="preTaskTodo"]', iframe.contentDocument);

			if (targetFrame) {
				// 停止临时监控
				console.log("目标iframe已找到，停止临时监控...开始监控目标iframe的内容加载...");
				tempObserver.disconnect();

				// 监控目标iframe的内容加载
				const checkContentLoaded = () => {
					try {
						const targetDiv = $("#receiveTaskListDIV > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-body ", targetFrame.contentDocument);

						if (targetDiv) {
							// 设置正式监控（带防抖）
							const debouncedHandler = debounce((mutations) => {
								console.debug("待办列表_检测到变化:", mutations);
								// 这里添加你的处理逻辑
								handle_mutations(mutations);
							});

							new MutationObserver(debouncedHandler).observe(targetDiv, {
								childList: true,
								subtree: true,
								// characterData: true
							});
						} else {
							setTimeout(checkContentLoaded, 500);
						}
					} catch (error) {
						console.warn("跨域限制，等待重试...");
						setTimeout(checkContentLoaded, 1000);
					}
				};

				// 开始检测内容加载
				targetFrame.onload = checkContentLoaded;
				if (targetFrame.contentDocument.readyState === "complete") {
					checkContentLoaded();
				}
			}
		});

		// 开始监控iframe添加
		tempObserver.observe(iframe.contentDocument.body, {
			childList: true,
			subtree: true,
		});

		function handle_mutations(mutations) {
			if (mutations.length <= 0) return;
			//只需要第一个
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") {
					const targetDiv = mutation.target;
					const trs = $$("tr", targetDiv);
					trs.forEach((tr) => {
						const $ = (selector, context = tr) => context.querySelector(selector);
						const td_案件号 = $('td[field="registNo"]');
						const td_承保公司 = $('td[field="comCName"]');
						const td_损失金额 = $('td[field="sumLossApproval"]');
						const td_出险时间 = $('td[field="damageStartTime"]');
						const td_流入时间 = $('td[field="createDateBegin"]');

						// 处理案件号列
						if (td_案件号) {
							const caseNumber = td_案件号.textContent.trim();

							// 提取末尾连续数字（假设案件号末尾是数字部分）
							const digits = caseNumber.match(/\d+$/)?.[0] || "";
							const digitArray = [...digits].reverse(); // 转换为倒序数组方便处理

							let shouldHighlight = false;
							let checkPosition = 0;

							while (checkPosition < digitArray.length) {
								const currentDigit = parseInt(digitArray[checkPosition], 10);

								if (myconfig.tailNo.includes(currentDigit)) {
									shouldHighlight = true;
									break;
								}

								if (!myconfig.publicNo.includes(currentDigit)) {
									// 当前数字不在白名单，终止检查
									break;
								}

								// 如果当前数字在publicNo中，继续检查前一位
								checkPosition++;
							}

							// 设置高亮
							if (shouldHighlight) {
								td_案件号.style.backgroundColor = "#ffff00"; // 黄色高亮
								// td_案件号.closest('tr').style.backgroundColor = '#f60';
								td_案件号.closest("tr").style.backgroundColor =
									"rgb(200, 255, 237)";
								// td_案件号.title = `符合尾号规则（检查位数：${checkPosition + 1}）`;
							}
						}

						// 处理承保公司列
						if (td_承保公司) {
							const companyText = td_承保公司.textContent.trim();

							// 检查是否包含配置的地区关键词（按最长优先匹配）
							const matchedArea = myconfig.areas
								.sort((a, b) => b.length - a.length) // 按长度降序排列
								.find((area) => companyText.includes(area));

							if (matchedArea) {
								td_承保公司.style.backgroundColor = "#ffff00"; // 黄色高亮
								td_承保公司.closest("tr").style.backgroundColor =
									"rgb(200, 255, 237)";
								// td_承保公司.closest('tr').style.backgroundColor = '#f60';
							}
						}

						// 处理流入时间列
						if (td_流入时间) {
							try {
								const currentTime = new Date();
								const flowTime = new Date(td_流入时间.textContent.trim());
								const timeDiff = (currentTime - flowTime) / (1000 * 60 * 60); // 计算小时差

								// 定义时间区间阈值
								const GREEN_YELLOW_THRESHOLD = 2; // 2小时
								const YELLOW_RED_THRESHOLD = 12; // 12小时

								// 颜色和透明度计算
								if (timeDiff <= GREEN_YELLOW_THRESHOLD) {
									// 0-2小时：绿色→黄色，透明度100%→50%
									const ratio = timeDiff / GREEN_YELLOW_THRESHOLD;
									const hue = 120 - 60 * ratio; // 120°(绿) → 60°(黄)
									const alpha = 1 - 0.5 * ratio; // 1 → 0.5
									td_流入时间.style.backgroundColor = `hsla(${hue}, 100%, 50%, ${alpha})`;
								} else if (timeDiff <= YELLOW_RED_THRESHOLD) {
									// 2-12小时：黄色→红色，透明度50%→100%
									const ratio =
										(timeDiff - GREEN_YELLOW_THRESHOLD) /
										(YELLOW_RED_THRESHOLD - GREEN_YELLOW_THRESHOLD);
									const hue = 60 - 60 * ratio; // 60°(黄) → 0°(红)
									const alpha = 0.5 + 0.5 * ratio; // 0.5 → 1
									td_流入时间.style.backgroundColor = `hsla(${hue}, 100%, 50%, ${alpha})`;
								} else {
									// 12小时以上：纯红色不透明
									td_流入时间.style.backgroundColor = "hsla(0, 100%, 50%, 1)";
								}

								// 添加悬浮提示
								td_流入时间.title = `已滞留：${Math.round(timeDiff * 10) / 10
									}小时`; // 保留1位小数
							} catch (e) {
								console.warn("时间解析失败：", td_流入时间.textContent);
								td_流入时间.style.backgroundColor = "hsla(0, 0%, 80%, 0.5)"; // 错误时灰色半透明
							}
						}

						// 处理出险时间列
						if (td_出险时间) {
							try {
								const currentTime = new Date(); // 当前时间
								const damageTime = new Date(td_出险时间.textContent.trim());
								const timeDiff =
									(currentTime - damageTime) / (1000 * 60 * 60 * 24); // 计算天数差

								// 定义时间区间阈值
								const FRESH_DAYS = 3; // 3天内
								const OLD_DAYS = 30; // 30天

								// 颜色计算逻辑
								if (timeDiff <= FRESH_DAYS) {
									// 0-3天：绿色渐变透明 (透明度1 → 0)
									const alpha = 1 - timeDiff / FRESH_DAYS;
									td_出险时间.style.backgroundColor = `hsla(120, 100%, 50%, ${alpha})`;
								} else if (timeDiff > OLD_DAYS) {
									// 30天以上：纯红色不透明
									td_出险时间.style.backgroundColor = "hsla(0, 100%, 50%, 1)";
								} else {
									// 3-30天：颜色渐变 + 透明度渐变
									const ratio =
										(timeDiff - FRESH_DAYS) / (OLD_DAYS - FRESH_DAYS);
									// 色相从120°(绿)到0°(红)
									const hue = 120 - 120 * ratio;
									// 透明度从0到1
									const alpha = ratio;
									td_出险时间.style.backgroundColor = `hsla(${hue}, 100%, 50%, ${alpha})`;
								}

								// 添加悬浮提示
								td_出险时间.title = `已出险：${Math.round(timeDiff)}天`;
							} catch (e) {
								console.warn("出险时间解析失败：", td_出险时间.textContent);
								td_出险时间.style.backgroundColor = "hsla(0, 0%, 80%, 0.5)"; // 错误时灰色半透明
							}
						}
					});
				}
			});
		}
	}

	// 异步进程,获取车险页面的凯泰铭,并更新到全局变量Tasks中,键是当前节点id,值是触发的规则(MAP形式)
	static async iframe_CarLoss_getKTM(iframe) {
		//获取车辆定核损验车的bpm信息
		const bpmitems = this.iframe_CarLoss_getbpmitems(iframe);
		const itemId = bpmitems.itemId;
		const taskId = bpmitems.taskId;
		const trackId = bpmitems.trackId;
		const registNo = bpmitems.registNo;

		// 如果不存在或,则发起网络请求刷新
		if (!Tasks[taskId] || Tasks[taskId].size < 1) {
			const url = `/claim/kaiTaiMingController.do?showYMKaiTaiMingResult&itemId=${itemId}&taskId=${taskId}&trackId=${trackId}&registNo=${registNo}`;
			// console.debug('凯泰铭网络请求:',url);
			httpRequest(url)
				.then((response) => response.html())
				.then((html) => {
					let KTMrisks = this.KTM_parser(html);
					return KTMrisks;
				})
				.then((KTMrisks) => {
					// 在总结点集合内新增凯泰铭信息,如果存在了就不再网络请求
					Tasks[taskId]=KTMrisks;
					// this.iframe_CarLoss_formatitems(iframe);
				});
		} else {
			// 否则不发起网络请求
			// this.iframe_CarLoss_formatitems(iframe);
		}
	}

	// 获取当前iframe的车辆定损风险信息,包括KTM,DXM,AXM
	static async handle_CarLoss_Risks(iframe) {
		//获取车辆定核损验车的bpm信息
		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
		const itemId = bpmitems.itemId;
		const taskId = bpmitems.taskId;
		const trackId = bpmitems.trackId;
		const registNo = bpmitems.registNo;
		const taskCatalog = bpmitems.taskCatalog;
		const businessKey = bpmitems.businessKey;
		const businessMainKey = bpmitems.businessMainKey;
		const policyNo = bpmitems.polocyNo;
		const userCode = bpmitems.userCode;
		const taskCarItems = bpmitems.taskCarItems;
		const licenseNo = bpmitems.licenseNo;
		const frameNo = bpmitems.vfield1;

		// 准备请求的url,凯泰铭,大地内置,AXM
		const KTMurl = `/claim/kaiTaiMingController.do?showYMKaiTaiMingResult&itemId=${itemId}&taskId=${taskId}&trackId=${trackId}&registNo=${registNo}`;
		const DXMurl = `/claim/prplriskwarningController.do?goNewRiskWarning&registNo=${registNo}&taskCatalog=${taskCatalog}&lossApprovalId=${businessKey}&taskId=${taskId}&userCode=${userCode}&accidentNo=${businessMainKey}&policyNo=${policyNo}&trackId=${trackId}&itemId=${itemId}&taskCarItems=${taskCarItems}`;
		const AXMurl = `/claim/preApprovalController.do?getCheckReverseLeakageResults&field=licenseNo,insertTimeForHis,isCarAppendLossApproval,overAmount,ruleName,lossName,lossType,&registNo=${registNo}`;

		const queue = [];

		// 准备获取车辆历史记录,跳过非标的车;核对历史出险与本次出险损失部位是否有重复
		if (!Cars[frameNo] && Cars[frameNo] != "C_001") {
			// if (!Cars[frameNo]){
			const car = new CAR("", frameNo);
			Cars[frameNo] = car;
			const historyrisks = car
				.addhistoryloss2Tasks(registNo, taskId)
				.then(() => { })
				.catch((e) => {
					console.error("获取历史记录出错", e);
				});

			queue.push(historyrisks);
		}

		// 凯泰铭风险,Promise流程
		if (!Tasks[taskId] || !Tasks[taskId].has("KTM触发")) {
			// console.debug('KTM风险发起网络请求:',KTMurl)
			const KTMrisks = httpRequest(KTMurl).then((response) => response.html())
				.then((html) => {return Common.KTM_parser(html);})
				.then((risks) => {
					if (!Tasks[taskId]) {Tasks[taskId]=new Map();}
					let taskrisks = Tasks[taskId];
					taskrisks = Common.risksmerge(taskrisks, risks);
					Tasks[taskId]=taskrisks;
					return risks.get("KTM触发");
				})
				.catch((e) => {
					console.error("获取凯泰铭风险错误", e);
				});

			queue.push(KTMrisks);
		}

		// 大地内置系统风险,Promise流程
		// 获取大地内置风险提示
		if (!Tasks[taskId] || !Tasks[taskId].has("DXM触发")) {
			// console.debug('DXM风险发起网络请求:',DXMurl)
			const DXMrisks = await httpRequest(DXMurl)
				.then((response) => response.html())
				.then((html) => {
					return Common.DXM_parser(html);
				})
				.then((risks) => {
					if (!Tasks[taskId]) {Tasks[taskId]=new Map();}
					let taskrisks = Tasks[taskId];
					taskrisks = Common.risksmerge(taskrisks, risks);
					Tasks[taskId]=taskrisks;
					return risks.get("DXM触发");
				})
				.catch((e) => {
					console.error("获取大地内置风险错误", e);
				});

			queue.push(DXMrisks);
		}

		// A项目风险,Promise流程
		if (!Tasks[taskId] || !Tasks[taskId].has("AXM触发")) {
			// console.debug('A项目风险发起网络请求:',AXMurl)
			const AXMrisks = await httpRequest(AXMurl)
				.then((response) => response.json())
				.then((html) => {
					return Common.AXM_parser(html, licenseNo);
				})
				.then((risks) => {
					if (!Tasks[taskId]) {Tasks[taskId]=new Map();}
					let taskrisks = Tasks[taskId];
					taskrisks = Common.risksmerge(taskrisks, risks);
					Tasks[taskId]=taskrisks;
					return risks.get("AXM触发");
				})
				.catch((e) => {
					console.error("获取A项目风险错误", e);
				});

			queue.push(AXMrisks);
		}

		await Promise.allSettled(queue);

		// 获取配件风险信息
		//这里会触发bug,在没有配件项目的时候

		try {
			await Common.PartCodeRisks(iframe, taskId);
			console.debug("获取配件风险信息成功",Tasks);
		} catch (e) {
			console.debug(e);
		}

		Common.iframe_CarLoss_formatitems(iframe);
	}

	// 解析凯泰铭提示的界面,输入html的是网页源码
	static KTM_parser(ktmdoc) {
		const KTMrisks = new Map();
		if (ktmdoc.body.textContent.includes("未触发风险")) {
			KTMrisks.set("KTM触发", 0);
			return KTMrisks;
		}

		const trs = $$("tr", ktmdoc);
		if (trs) {
			trs.forEach((tr) => {
				let 风险描述 = tr.cells[2].textContent;
				let 风险项目 = tr.cells[3].textContent;
				let items =
					风险项目.split("：").length <= 1
						? []
						: 风险项目.split("：")[1].split(",").length <= 1
							? [风险项目.split("：")[1]]
							: 风险项目.split("：")[1].split(",");
				items.forEach((item) => {
					if (!KTMrisks.has(item)) {
						KTMrisks.set(item, []);
					}
					// 获取现有的数组，添加新的描述，然后更新KTMrisks,如果包含则跳过
					if (!KTMrisks.get(item).includes(风险描述)) {
						KTMrisks.get(item).push(风险描述);
					}
				});
				KTMrisks.set("KTM触发", 1);
			});
		}
		return KTMrisks;
	}

	// 解析风险提示的界面,输入html的是网页源码
	static DXM_parser(DXMdoc) {
		const carLeakageRiskInfos = $$("#carLeakageRiskInfo tr.perRow", DXMdoc);
		const LeakageRisk = new Map();
		if (carLeakageRiskInfos.length > 0) {
			carLeakageRiskInfos.forEach((tr) => {
				let 车牌号 = tr.cells[0].textContent;
				let 风险类型 = tr.cells[1].textContent;
				let 风险描述 = tr.cells[2].textContent;
				let 风险项目 = tr.cells[3].textContent;
				// let items = 风险项目.trim().replaceAll("\n", "").split(",");
				let items = 风险项目.trim().replaceAll("\n", "").replaceAll("喷漆", "").split(",");
				items.forEach((item) => {
					if (item.includes("配件") || item.includes("工时")) {
						return;
					}
					// 如果原风险集无触发项目,则新增一个空集
					if (!LeakageRisk.has(item)) {
						LeakageRisk.set(item, []);
					}
					// 获取现有的数组，添加新的描述，然后更新KTMrisks
					// LeakageRisk.set(item,LeakageRisk.get(item).concat([风险描述]))
					if (!LeakageRisk.get(item).includes(风险描述)) {
						LeakageRisk.get(item).push(风险描述);
					}
				});
				LeakageRisk.set("DXM触发", 1);
			});
		} else {
			LeakageRisk.set("DXM触发", 0);
		}
		return LeakageRisk;
	}

	// 解析风险提示的界面,输入html的是json后的dict
	static AXM_parser(html, licenseNo) {
		const items = html.rows;
		const LeakageRisk = new Map();

		for (let item of items) {
			console.debug(
				"item:",
				item,
				item.licenseNo,
				licenseNo,
				item[licenseNo] == licenseNo
			);
			if (item.licenseNo != licenseNo) {
				continue;
			}
			// 如果原风险集无触发项目,则新增一个空集
			if (!LeakageRisk.has(item.lossName)) {
				LeakageRisk.set(item.lossName, []);
			}
			// 获取现有的数组，添加新的描述，然后更新KTMrisks
			LeakageRisk.set(
				item.lossName,
				LeakageRisk.get(item.lossName).concat([item.ruleName])
			);
			if (!LeakageRisk.get(item.lossName).includes(item.ruleName)) {
				LeakageRisk.get(item.lossName).push(item.ruleName);
			}
		}
		LeakageRisk.set("AXM触发", 1);
		// console.debug('AXM:',LeakageRisk)

		return LeakageRisk;
	}

	// 获取定核损页面的carinfo
	static iframe_CarLoss_getCarinfo(iframe) {
		let Carinfo = new Map();
		const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
		const $ = (selector, context = iframeDocument) => context.querySelector(selector);
		const Element_修理厂名称 = $("#prpLrepairChannelPageList\\[0\\]\\.repairNameHidden");
		const Element_是否合作 = $("#prpLrepairChannelPageList\\[0\\]\\.isCoop");
		const Element_维修厂类型 = $("#prpLrepairChannelPageList\\[0\\]\\.is");
		const Element_车牌号 = $("#prplcarhiddenPage_actualLicenseNo");
		const Element_损失方 = $("#prpLcarLossPage_lossSide");
		const NameElement_车型名称 = $("#prpLcarLossApprovalPage_vehCertainName");
		const Element_车架号 = $("#prplcarhiddenPage_frameNo");
		const Element_实际价值 = $("#prpLcarLossApprovalPage_carRrice");
		const Element_初登日期 = $("#prpLcarPage_enrollDate");
		// const 合作等级=合作综修厂[Element_修理厂名称.value] > -1 ? `等级:${合作综修厂[Element_修理厂名称.value]}` : ''
		const 合作等级 = 合作维修厂[Element_修理厂名称.value] == undefined ? "" : `${合作维修厂[Element_修理厂名称.value]}`;
		const 车架年份 = Common.getvinyear(Element_车架号.value);
		const 报案号 = $("#prpLcarPage_registNo").value;
		const 定损方式 = $("#prpLcarLossApprovalPage_lossApprovalMethod option").textContent;
		const 理赔险别 = $("#prpLcarLossApprovalPage\\.lossApprovalKindName").value;
		const 车辆品牌 = $("#tr_0_carBrandName").value;
		const 车主 = $("#prpLcarPage_carOwner") ? $("#prpLcarPage_carOwner").value : "";
		const 是否水淹车 = $("#isWaterLogging_yes") ? $("#isWaterLogging_yes").checked ? "是" : "否" : "否";

		Carinfo.set("修理厂名称", Element_修理厂名称.value);
		Carinfo.set(
			"是否合作",
			Element_是否合作 ? (Element_是否合作.checked ? "合作" : "非合作") : ""
		);
		Carinfo.set(
			"维修厂类型",
			Element_维修厂类型 ? (Element_维修厂类型.checked ? "4S店" : "综修厂") : ""
		);
		Carinfo.set("车牌号", Element_车牌号.value);
		Carinfo.set("损失方", Element_损失方.value);
		Carinfo.set("车型名称", NameElement_车型名称.value);
		Carinfo.set("车架号", Element_车架号.value);
		Carinfo.set("实际价值", Element_实际价值.value);
		Carinfo.set("初登日期", Element_初登日期.value);
		Carinfo.set("合作等级", 合作等级);
		Carinfo.set("车架年份", 车架年份);
		Carinfo.set("报案号", 报案号);
		Carinfo.set("定损方式", 定损方式);
		Carinfo.set("理赔险别", 理赔险别);
		Carinfo.set("车辆品牌", 车辆品牌);
		Carinfo.set("车主", 车主);
		Carinfo.set("是否水淹车", 是否水淹车);

		// console.debug(Carinfo);
		return Carinfo;
	}

	//获取车辆定核损验车的bpm信息
	static iframe_CarLoss_getbpmitems(iframe = undefined, doc = undefined) {
		// 这里假设iframe输入方式有两种,一个是窗口正常的iframe,另一种是被转换的Document
		let iframeDocument = doc;
		if (iframe) {iframeDocument = iframe.contentDocument || iframe.contentWindow.document;} 

		const bpmitems = {}
		const elements = $$('[id^="bpmPage_"]', iframeDocument);

		elements.forEach((element) => {
			const key=element.id.replace("bpmPage_", "");
			bpmitems[key]=element.value;
		});
		console.debug("bpmitems", bpmitems);
		return bpmitems;
	}

	// 格式化定损项目,方便查看
	static async iframe_CarLoss_formatitems(iframe) {
		const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
		const aqs= (selectior) => async_querySelector(selectior,{ parent: iframeDocument })

		//自动点击损失明细界面
		const e_车辆损失信息 = await aqs('a[href="#carLossApproval_div"]');
		if (e_车辆损失信息) {e_车辆损失信息.click();}

		//检测车损明细页面的金额表格是否存在,如果存在就代表已经加载完毕;
		const check_table = await aqs("#prpLcarLossApprovalPage_table");
		if (!check_table) return;

		// 新增复选框,用于标记已阅项目
		function addCheckboxToElement(element) {
			// 检查元素中是否已经存在复选框
			const existingCheckbox = element.querySelector('input[type="checkbox"]');
			if (existingCheckbox) {
				return; // 如果已经存在复选框，则不进行任何操作
			}
			// 创建一个新的复选框元素
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.className = "form-check-input"; // 可以根据需要添加CSS类

			// 创建一个标签来包裹复选框，以便更好地控制布局
			const checkboxLabel = document.createElement("label");
			checkboxLabel.className = "form-check-label";
			checkboxLabel.appendChild(checkbox);

			// 将复选框标签插入到指定元素中
			element.prepend(checkboxLabel); // 使用prepend将复选框添加到元素的开始位置
		}

		// 新增复选框,用于标记已阅项目,并添加事件监听器,勾选时弹窗录入风险信息,element是页面元素的位置,tr是行元素
		function addCheckbox_partrisk(element, tr) {
			// 检查元素中是否已经存在复选框
			const existingCheckbox = $('input[type="checkbox"]', element);
			if (existingCheckbox) {
				// 如果已经存在复选框，则不进行任何操作
				return;
			}
			// 创建一个新的复选框元素
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.className = "form-check-input"; // 可以根据需要添加CSS类

			// 创建一个标签来包裹复选框，以便更好地控制布局
			const checkboxLabel = document.createElement("label");
			checkboxLabel.className = "form-check-label";
			checkboxLabel.appendChild(checkbox);

			// 将复选框标签插入到指定元素中
			element.prepend(checkboxLabel); // 使用prepend将复选框添加到元素的开始位置

			// 添加事件监听器
			checkbox.addEventListener("change", function () {
				if (checkbox.checked) {
					return;
				}
				addpartrisk(bpmitems, iframeDocument, tr);
			});

			function addpartrisk(bpmitems, iframeDocument, tr) {
				// 新增输入div的主function
				function createFormContainer(defaultValues = []) {
					// 辅助函数：创建只读字段
					function createReadOnlyField(label, value) {
						const container = document.createElement("div");
						container.style.flex = "1 1 auto";

						const labelElement = document.createElement("label");
						labelElement.textContent = label + ":";
						labelElement.style.fontWeight = "bold";
						labelElement.style.display = "block";
						labelElement.style.marginBottom = "5px";
						container.appendChild(labelElement);

						const inputElement = document.createElement("input");
						inputElement.type = "text";
						inputElement.value = value;
						inputElement.readOnly = true;
						inputElement.style.width = "100%";
						inputElement.style.padding = "5px";
						inputElement.style.backgroundColor = "#f0f0f0"; // 只读字段的背景色
						inputElement.style.border = "1px solid #ccc";
						container.appendChild(inputElement);

						return container;
					}

					// 创建一个div元素
					const div = document.createElement("div");
					div.id = "formContainer";
					div.style.position = "fixed"; // 固定定位
					div.style.top = "20%"; // 初始位置：页面中间靠上
					div.style.left = "50%"; // 初始位置：水平居中
					div.style.transform = "translateX(-50%)"; // 水平居中
					div.style.border = "1px solid #000";
					div.style.padding = "20px";
					div.style.backgroundColor = "#fff";
					div.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
					div.style.zIndex = "9999"; // 确保悬浮层在所有页面处于最高层
					div.style.width = "600px"; // 设置固定宽度
					div.style.cursor = "move"; // 鼠标悬停时显示可移动光标

					// 拖拽功能实现
					let isDragging = false;
					let offsetX, offsetY;

					div.addEventListener("mousedown", function (e) {
						if (
							e.target.tagName.toLowerCase() !== "input" &&
							e.target.tagName.toLowerCase() !== "button"
						) {
							isDragging = true;
							offsetX = e.clientX - div.offsetLeft;
							offsetY = e.clientY - div.offsetTop;
						}
					});

					document.addEventListener("mousemove", function (e) {
						if (isDragging) {
							div.style.left = `${e.clientX - offsetX}px`;
							div.style.top = `${e.clientY - offsetY}px`;
							div.style.transform = "none"; // 取消水平居中
						}
					});

					document.addEventListener("mouseup", function () {
						isDragging = false;
					});

					// 创建不可编辑的字段
					const readOnlyFields = [
						{ label: "车辆型号", value: defaultValues[4] || "" },
						{ label: "车架号", value: defaultValues[5] || "" },
						{ label: "案件号", value: defaultValues[6] || "" },
						{ label: "车牌", value: defaultValues[7] || "" },
						{ label: "事故号", value: defaultValues[8] || "" },
						{ label: "节点号", value: defaultValues[9] || "" },
					];

					// 创建第一行（车辆型号和车架号）
					const row1 = document.createElement("div");
					row1.style.display = "flex";
					row1.style.gap = "10px";
					row1.style.marginBottom = "10px";

					// 车辆型号
					const vehicleModelField = createReadOnlyField(
						readOnlyFields[0].label,
						readOnlyFields[0].value
					);
					row1.appendChild(vehicleModelField);

					// 车架号
					const vinField = createReadOnlyField(
						readOnlyFields[1].label,
						readOnlyFields[1].value
					);
					row1.appendChild(vinField);

					div.appendChild(row1);

					// 创建第二行（案件号、车牌、事故号、节点号）
					const row2 = document.createElement("div");
					row2.style.display = "flex";
					row2.style.gap = "10px";
					row2.style.marginBottom = "20px";

					// 案件号
					const caseNumberField = createReadOnlyField(
						readOnlyFields[2].label,
						readOnlyFields[2].value
					);
					row2.appendChild(caseNumberField);

					// 车牌
					const licensePlateField = createReadOnlyField(
						readOnlyFields[3].label,
						readOnlyFields[3].value
					);
					row2.appendChild(licensePlateField);

					// 事故号
					const accidentNumberField = createReadOnlyField(
						readOnlyFields[4].label,
						readOnlyFields[4].value
					);
					row2.appendChild(accidentNumberField);

					// 节点号
					const nodeNumberField = createReadOnlyField(
						readOnlyFields[5].label,
						readOnlyFields[5].value
					);
					row2.appendChild(nodeNumberField);

					div.appendChild(row2);

					// 创建可编辑的表单字段
					const fields = [
						{
							label: "零件名称",
							placeholder: "请输入零件名称",
							inline: true,
							defaultValue: defaultValues[0] || "",
						},
						{
							label: "零件编码",
							placeholder: "请输入零件编码",
							inline: true,
							defaultValue: defaultValues[1] || "",
						},
						{
							label: "本地报价",
							placeholder: "请输入本地报价",
							inline: true,
							defaultValue: defaultValues[2] || "",
						},
						{
							label: "配件品质",
							placeholder: "请输入配件品质",
							inline: true,
							defaultValue: defaultValues[3] || "",
						},
						{
							label: "风险规则",
							placeholder: "请输入风险规则",
							inline: false,
							defaultValue: "",
						},
						{
							label: "备注信息",
							placeholder: "请输入备注信息",
							inline: false,
							defaultValue: "",
						},
					];

					// 创建一个容器用于放置前4个输入框（同一行）
					const inlineContainer = document.createElement("div");
					inlineContainer.style.display = "flex";
					inlineContainer.style.flexWrap = "wrap";
					inlineContainer.style.gap = "10px"; // 设置输入框之间的间距
					inlineContainer.style.marginBottom = "20px"; // 与下方输入框的间距
					div.appendChild(inlineContainer);

					// 存储输入框的引用
					const inputs = [];

					// 遍历字段，创建输入框和标签
					fields.forEach((field, index) => {
						// 创建标签
						const label = document.createElement("label");
						label.textContent = field.label + ":";
						label.style.fontWeight = "bold";
						label.style.display = "block";
						label.style.marginBottom = "5px";

						// 创建输入框
						const input = document.createElement("input");
						input.type = "text";
						input.placeholder = field.placeholder;
						input.style.width = "100%";
						input.style.padding = "5px";
						input.value = field.defaultValue; // 设置默认值
						inputs.push(input); // 将输入框引用存入数组

						// 创建字段容器
						const fieldContainer = document.createElement("div");
						fieldContainer.style.flex = field.inline
							? "1 1 calc(25% - 10px)"
							: "1 1 100%"; // 前4个输入框平分宽度，后2个占满一行
						fieldContainer.appendChild(label);
						fieldContainer.appendChild(input);

						// 将字段容器添加到对应的父容器中
						if (field.inline) {
							inlineContainer.appendChild(fieldContainer);
						} else {
							div.appendChild(fieldContainer);
						}
					});

					// 创建提交按钮
					const submitButton = document.createElement("button");
					submitButton.textContent = "提交";
					submitButton.style.marginRight = "10px";
					submitButton.style.padding = "8px 16px";
					submitButton.style.backgroundColor = "#007bff";
					submitButton.style.color = "#fff";
					submitButton.style.border = "none";
					submitButton.style.borderRadius = "4px";
					submitButton.style.cursor = "pointer";
					submitButton.addEventListener("click", function () {
						// 获取输入框的值
						const result = [
							"", // 第一个元素为空
							inputs[0].value, // 零件名称
							inputs[1].value, // 零件编码
							readOnlyFields[0].value, // 车辆型号
							readOnlyFields[1].value, // 车架号
							readOnlyFields[2].value, // 案件号
							readOnlyFields[3].value, // 车牌
							readOnlyFields[4].value, // 事故号
							readOnlyFields[5].value, // 节点号
							"", // 空元素
							inputs[2].value, // 本地报价
							inputs[3].value, // 配件品质
							"", // 空元素
							// inputs[4].value.replace(/[\s\-\/\n\t\\]/g, ''), // 风险规则
							Common.replacEn2Zh(inputs[4].value), // 风险规则,把英文符号改为中文
							// inputs[5].value.replace(/[\s\-\/\n\t\\]/g, '')  // 备注信息
							Common.replacEn2Zh(inputs[5].value),
						];
						console.debug("配件风险框输出", result); // 打印结果到控制台

						CSV_配件编码 = Common.loadGM_Value("CSV_配件编码", []);
						CSV_配件编码.unshift(result);
						GM_setValue("CSV_配件编码", CSV_配件编码);
						GM_notification({
							text: "配件编码风险规则已更新",
							title: "更新成功",
							timeout: 3000,
							highlight: true,
						});
						// alert('提交成功！');
						div.remove(); // 提交后移除div

						// 更新配件风险信息
						配件编码风险 = Common.List2Dict(CSV_配件编码);
						console.debug("配件编码风险:", 配件编码风险);
					});
					div.appendChild(submitButton);

					// 创建取消按钮
					const cancelButton = document.createElement("button");
					cancelButton.textContent = "取消";
					cancelButton.style.padding = "8px 16px";
					cancelButton.style.backgroundColor = "#dc3545";
					cancelButton.style.color = "#fff";
					cancelButton.style.border = "none";
					cancelButton.style.borderRadius = "4px";
					cancelButton.style.cursor = "pointer";
					cancelButton.addEventListener("click", function () {
						div.remove(); // 点击取消按钮后移除div
					});
					div.appendChild(cancelButton);

					// 将div添加到body中
					document.body.appendChild(div);
				}

				const 车架号 = bpmitems.vfield1;
				const 车牌 = bpmitems.licenseNo;
				const 案件号 = bpmitems.registNo;
				const 事故号 = bpmitems.accidentNo;
				const 节点号 = bpmitems.taskId;

				const NameElement_车辆型号 = $("#prpLcarLossApprovalPage_vehCertainName", iframeDocument);
				const 车辆型号 = NameElement_车辆型号.value;

				const 零件名称 = Common.cellGetValue(tr.cells[1]);
				const 配件代码 = Common.cellGetValue(tr.cells[2]);
				const 本地报价 = Common.cellGetValue(tr.cells[10]);
				const 配件品质 = Common.cellGetValue(tr.cells[12]);

				console.log("本地报价元素:", 本地报价);
				const defaultValues = [
					零件名称,
					配件代码,
					本地报价,
					配件品质,
					车辆型号,
					车架号,
					案件号,
					车牌,
					事故号,
					节点号,
				];
				createFormContainer(defaultValues);
			}
		}

		// 获取凯泰铭风险
		const bpmitems = this.iframe_CarLoss_getbpmitems(iframe);
		const taskId = bpmitems.taskId;
		const Taskrisks = Tasks[taskId];

		// 新增功能：检查提醒风险项目
		// 配件项目部分
		const tbody_Component = $("#UIPrpLComponent_add_orderProduct_table", iframeDocument);
		if (tbody_Component) {
			const trs = $$("tr", tbody_Component);
			trs.forEach((tr, rowIndex) => {
				const 序号 = tr.cells[0];
				const 配件名称 = tr.cells[1];
				const 配件代码 = tr.cells[2];
				const 定损管理费率 = tr.cells[4];
				const 核损管理费率 = tr.cells[5];
				const 定损数量 = tr.cells[6];
				const 核损数量 = tr.cells[7];
				const 定损单价 = tr.cells[8];
				const 核损单价 = tr.cells[9];
				const 报价 = tr.cells[10];
				const 配件品质 = tr.cells[12];
				const 参考价格 = tr.cells[13];
				const 残值 = tr.cells[14];
				const 定损总价 = tr.cells[15];
				const 核损总价 = tr.cells[16];
				const 管控配件 = tr.cells[19];
				const 是否自定义 = tr.cells[20];
				const 其他信息 = tr.cells[21];

				// 开始凯泰铭提示格式化(配件风险)
                //这里的'配件名称',在追加页面不知道为什么没有input,所以用这个获取
                const targetElement = 配件名称.querySelector('input') != null ? 配件名称.querySelector('input') : 配件名称;
				Common.handle_Risks_CSS(Taskrisks, targetElement, 配件名称, iframe);

				// 添加复选框,用于标记已阅项目
				addCheckbox_partrisk(其他信息, tr);

				const straightRate = this.cellGetValue(定损管理费率)
					? parseInt(this.cellGetValue(定损管理费率), 10)
					: 0;
				const apprprice = this.cellGetValue(定损单价)
					? parseInt(this.cellGetValue(定损单价), 10)
					: 0;
				const quantity = this.cellGetValue(定损数量)
					? parseInt(this.cellGetValue(定损数量), 10)
					: 0;
				const offerprice = this.cellGetValue(报价)
					? parseInt(this.cellGetValue(报价), 10)
					: 0;
				const initprice = this.cellGetValue(参考价格)
					? parseInt(this.cellGetValue(参考价格), 10)
					: 0;
				const remnant = this.cellGetValue(残值)
					? parseInt(this.cellGetValue(残值), 10)
					: 0;

				if (straightRate >= 15) {
					定损管理费率.style.color = "red"; //配件管理费超15时变成红色
				}

				if (apprprice > initprice) {
					定损单价.style.color = "red"; //超系统价格时变成红色
				}

				if (quantity > 1) {
					定损数量.style.color = "red"; //配件数量超过1时变成红色
				}

				if (offerprice > initprice) {
					报价.style.color = "red"; //报价超过系统价格时变成红色,否则蓝色
				} else {
					报价.style.color = "blue";
				}

				if (remnant > 0 && remnant / (apprprice * quantity) < 0.035) {
					残值.style.color = "red";
				}

				if (
					this.cellGetValue(管控配件).includes("是") ||
					this.cellGetValue(是否自定义).includes("是")
				) {
					配件名称.style.color = "red";
					配件代码.style.color = "red";
					配件名称.style.fontWeight = "bold";
				} else {
					配件名称.style.color = "blue";
					配件代码.style.color = "blue";
				}

				if (
					this.cellGetValue(配件品质) == "大地价" ||
					this.cellGetValue(配件品质) == "原厂价"
				) {
					配件品质.style.color = "red"; //配件品质是大地价时,改为红色
				}
			});
		}

		// 维修费部分
		const tbody_repairFee = $("#UIPrpLrepairFee_add_orderProduct_table", iframeDocument);
		if (tbody_repairFee) {
			const th = $("#prpLcarRepairFeePageList_table tr", iframeDocument);
			Common.addfeetable(iframe, th.cells[2], "广州、佛山、珠海、汕头、顺德");
			Common.addfeetable(iframe, th.cells[5], "江门、中山、惠州、肇庆、茂名、揭阳、潮州");
			Common.addfeetable(iframe, th.cells[8], "云浮、湛江、阳江、清远、韶关、梅州、河源");

			const trs = $$("tr", tbody_repairFee);
			trs.forEach((tr, rowIndex) => {
				const 序号 = tr.cells[0];
				const 维修类型 = tr.cells[1];
				const 维修名称 = tr.cells[2];
				const 维修程度 = tr.cells[3];
				const 定损金额 = tr.cells[4];
				const 核损金额 = tr.cells[5];
				const 参考金额 = tr.cells[6];
				const 定损备注 = tr.cells[7];
				const 核损备注 = tr.cells[8];
				const 是否自定义 = tr.cells[9];

				addCheckboxToElement(核损备注);

				// 开始凯泰铭提示格式化(维修工时风险)
				Common.handle_Risks_CSS(Taskrisks, 维修名称, 维修名称, iframe);

				if (this.cellGetValue(维修类型) == "拆装") {
					维修类型.style.color = "red"; // 将颜色改为红色
				} else if (this.cellGetValue(维修类型) == "喷漆") {
					维修类型.style.color = "blue"; // 将颜色改为蓝色
				} else if (
					this.cellGetValue(维修类型) == "钣金" ||
					this.cellGetValue(维修类型) == "机修"
				) {
					维修类型.style.color = "purple"; // 将颜色改为紫色
				} else {
					维修类型.style.color = "gray"; // 将颜色改为灰色
				}

				if (this.cellGetValue(是否自定义) == "是") {
					维修名称.style.color = "red"; // 将颜色改为红色
					维修名称.style.fontWeight = "bold"; // 加粗
				} else {
					维修名称.style.color = "blue"; // 将颜色改为蓝色
				}

				const initprice = this.cellGetValue(参考金额)
					? parseInt(this.cellGetValue(参考金额))
					: 0; //参考金额如果为空,按0处理
				const apprprice = this.cellGetValue(定损金额)
					? parseInt(this.cellGetValue(定损金额))
					: 0; //参考金额如果为空,按0处理
				if (apprprice > initprice) {
					定损金额.style.color = "red"; // 将颜色改为红色
				} else {
					定损金额.style.color = "blue"; // 将颜色改为蓝色
				}

			});
		}

		// 外修部分
		const tbody_ExternalComponent = $("#UIExternalComponent_body", iframeDocument);
		if (tbody_ExternalComponent) {
			const trs = $$("tr", tbody_ExternalComponent);
			trs.forEach((tr, rowIndex) => {
				const 序号 = tr.cells[0];
				const 配件名称 = tr.cells[1];
				const 配件代码 = tr.cells[2];
				const 定损数量 = tr.cells[3];
				const 核损数量 = tr.cells[4];
				const 定损单价 = tr.cells[5];
				const 核损单价 = tr.cells[6];
				const 服务站原价 = tr.cells[7];
				const 配件品质 = tr.cells[8];
				const 参考价 = tr.cells[9];
				const 外修厂 = tr.cells[10];
				const 外修状态 = tr.cells[11];
				const 管控配件 = tr.cells[12];
				const 是否换件 = tr.cells[14];
				const 定损备注 = tr.cells[15];
				const 核损备注 = tr.cells[16];
				const 是否自定义 = tr.cells[17];

				// 开始凯泰铭提示格式化(外修项目风险)
				Common.handle_Risks_CSS(Taskrisks, 配件名称, 配件名称, iframe);

				// 添加复选框
				addCheckboxToElement(外修状态);

				const initprice = this.cellGetValue(服务站原价)
					? parseInt(this.cellGetValue(服务站原价), 10)
					: 0;
				const apprprice = this.cellGetValue(定损单价)
					? parseInt(this.cellGetValue(定损单价), 10)
					: 0;
				if (apprprice / initprice > 0.3) {
					定损单价.style.color = "red"; //如果上报价格超服务站30%,标注为红色
				}

				if (this.cellGetValue(是否自定义) != "否") {
					配件名称.style.color = "red"; //如果是自定义项目,标注为红色
				}
				if (this.cellGetValue(管控配件) != "否") {
					配件名称.style.fontWeight = "bold"; // 如果是管控配件,加粗
					配件名称.style.color = "red"; //如果是管控配件,标注为红色
				}

				if (this.cellGetValue(外修状态).includes("外修成功")) {
					外修状态.style.color = "blue"; //如果外修成功,标注为蓝色
				} else {
					外修状态.style.color = "red"; //如果外修未成功或未处理,标注未红色
				}
			});
		}

		// 零部件辅料费用清单信息
		const PrpLmaterial = $("#UIPrpLmaterial_add_orderProduct_table", iframeDocument);
		if (PrpLmaterial) {
			const trs = $$("tr", PrpLmaterial);
			trs.forEach((tr, rowIndex) => {
				const 序号 = tr.cells[0];
				const 维修类型 = tr.cells[1];
				const 辅料名称 = tr.cells[2];
				const 参考价 = tr.cells[3];
				const 定损单价 = tr.cells[4];
				const 核损单价 = tr.cells[5];
				const 定损数量 = tr.cells[6];
				const 核损数量 = tr.cells[7];
				const 定损金额 = tr.cells[8];
				const 核损金额 = tr.cells[9];
				const 定损备注 = tr.cells[10];
				const 核损备注 = tr.cells[11];

				// 开始凯泰铭提示格式化(辅料风险)
				Common.handle_Risks_CSS(Taskrisks, 辅料名称, 辅料名称, iframe);

				addCheckboxToElement(核损备注);
			});
		}

		// 施救费录入
		const Rescue_mainRow = iframeDocument.querySelector("#newRescue_mainRow");
		if (Rescue_mainRow) {
			const trs = $$("tr", Rescue_mainRow);
			trs.forEach((tr, rowIndex) => {
				const 定损备注 = tr.cells[13];
				const 总金额 = tr.cells[12];

				const rescueprice = this.cellGetValue(总金额)
					? parseInt(this.cellGetValue(总金额), 10)
					: 0;
				if (rescueprice > 420) {
					tr.style.backgroundColor = "rgb(236 236 49 / 88%)";
				}

				addCheckboxToElement(定损备注);
			});
		}
	}

	static getABSinfos(bpmitems) {
		const registNo = bpmitems.registNo;
		const Case = Cases[registNo] || {};

		// 定义接口端点配置
		const endpoints = [
			{ key: "RegistInfo", url: "getAbsRegistInfo" },
			{ key: "CheckInfo", url: "getAbsCheckInfo" },
			{ key: "LossInfo", url: "getAbsLossInfo" },
			{ key: "PolicyInfo", url: "getAbsPolicyInfo" },
		];

		// 统一的风险处理逻辑
		const handleRiskNotification = (caseData) => {
			const [riskmsg, isrisk] = Common.handle_risks(caseData);
			const notifier = isrisk ? toastr.warning : toastr.info;
			notifier(riskmsg, "报案信息");
			// Common.addMarqueeDiv(riskmsg, 'reginfo');
		};

		// 检查是否需要请求数据
		if (endpoints.some(({ key }) => !Case[key])) {
			// 批量创建请求
			const requests = endpoints.map(({ url }) => httpRequest(`/claim/entireCaseAbstractController.do?${url}`,bpmitems));

			// 处理并行请求
			Promise.all(requests)
				.then((responses) => Promise.all(responses.map((r) => r.json())))
				.then((results) => {
					// 动态赋值Case属性
					endpoints.forEach(({ key }, index) => {
						Case[key] = results[index].obj;
					});

					// 缓存数据并触发通知
					Cases[registNo] = Case;
					handleRiskNotification(Case);
				})
				.catch(console.error);
		} else {
			handleRiskNotification(Case);
		}

		return Case;
	}

	static handle_risks(Caseinfo) {
		// console.debug('Caseinfo', Caseinfo);
		const RegistInfo = Caseinfo.RegistInfo;
		const CheckInfo = Caseinfo.CheckInfo;
		const PolicyInfo = Caseinfo.PolicyInfo;
		let isrisk = false;

		const 报案人 = RegistInfo.reportor;
		const 出险经过 = RegistInfo.damageAbstract
			.replaceAll(" ", "")
			.replaceAll("\r", "")
			.replaceAll("\n", "")
			.split("车牌号码")[1]
			.split("事故造成")[0];
		const 报案驾驶员 = 出险经过.split("由")[1].split("在")[0];
		const 是否现场 = RegistInfo.isOnSpotCalled == "是" ? "现场" : "【非现场】";
		// const 超时报案 = Common.计算日期差(RegistInfo.damageTime, RegistInfo.reportorTime) > 1 ? '【超时】' : ''
		const 超时报案 =
			Common.计算日期差(RegistInfo.damageTime, RegistInfo.reportorTime) > 1
				? '<span style="color: red;"><strong>【超时】</strong></span>'
				: "";
		const 事故原因 = RegistInfo.damageReason;

		const 查勘方式 = CheckInfo.checkType;
		const 查勘员 = CheckInfo.checkUserName;
		const 查勘驾驶员 = CheckInfo.driverName;
		const 事故责任 = CheckInfo.indemnityDuty;
		const 事故责任_ =
			事故责任 == "全责"
				? 事故责任
				: `<span style="color: red;"><strong>【${事故责任}】</strong></span>`;

		const 驾驶员纠正 =
			报案驾驶员 == 查勘驾驶员 ? "" : `<br>实际驾驶员:${查勘驾驶员}`;
		const 报案时间提示 = 超时报案
			? `<br>报案时间: ${RegistInfo.reportorTime} `
			: ``;

		let 起保出险 = "",
			结保出险 = "";
		for (let policyInfoPage of PolicyInfo.policyInfoPages) {
			起保出险 +=
				Common.计算日期差(policyInfoPage.startDate, RegistInfo.damageTime) < 30
					? `<br>【${policyInfoPage.policyType}】起保${Common.计算日期差(
						policyInfoPage.startDate,
						RegistInfo.damageTime
					)}天出险`
					: "";
			结保出险 +=
				Common.计算日期差(policyInfoPage.endDate, RegistInfo.damageTime) < 30
					? `<br>【${policyInfoPage.policyType}】临近到期${Common.计算日期差(
						policyInfoPage.endDate,
						RegistInfo.damageTime
					)}天出险`
					: "";
		}

		// 判断是否夜间出险,标准是夜间8点到早上7点
		const 夜间时段 = [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6].includes(
			Common.获取小时时段(RegistInfo.damageTime)
		)
			? '<span style="color: red;"><strong>【夜间】</strong></span>'
			: "";

		let riskmsg = `[${查勘员}][${查勘方式}] ${报案人}${夜间时段}${是否现场}${超时报案}报案称${出险经过},${事故原因},${事故责任_}${驾驶员纠正}${起保出险}${结保出险}${报案时间提示}`;

		if (夜间时段 || 驾驶员纠正 || 超时报案 || 起保出险 || 结保出险) {
			isrisk = true;
		}
		return [riskmsg, isrisk];
	}

	/**
	 * 查询任务流信息,必须输入一个
	 * @param {str} registNo - 案件号
	 * @param {str} policyNo - 保单号
	 * @param {str} licenseNo - 车牌号
	 * @param {str} insuredName - 被保险人名称
	 * @param {str} frameNo - 车架号
	 * @param {str} engineNo - 发动机号
	 * @param {str} accidentNo - 事故号
	 * @param {str} claimNo - 立案号
	 * @param {str} licenseNo3 - 三者车车牌
	 * @return {json} - 返回json格式
	 */
	static async queryWorkflow(
		registNo = "",
		policyNo = "",
		licenseNo = "",
		insuredName = "",
		frameNo = "",
		engineNo = "",
		accidentNo = "",
		claimNo = "",
		licenseNo3 = ""
	) {
		const postdata = {
			registNo: registNo,
			policyNo: policyNo,
			licenseNo: licenseNo,
			insuredName: insuredName,
			frameNo: frameNo,
			engineNo: engineNo,
			accidentNo: accidentNo,
			claimNo: claimNo,
			licenseNo3: licenseNo3,
		};
		// console.debug(postdata)
		const url =
			"/claim/bpmTaskController.do?queryWorkflow&field=accidentNo,registNo,policyNo,relationPolicyNo,licenseNo,insuredName,datamgetDateStr";
		let result = await httpRequest(url, postdata).then((response) =>response.json());
		return result;
	}

	// // 封装的fetch流程
	// static async Requests(url, data = "", json = "") {
	// 	let options;
	// 	if (data) {
	// 		options = {
	// 			headers: { "Content-Type": "application/x-www-form-urlencoded" },
	// 			method: "POST",
	// 			credentials: "include", // 确保发送请求时包含cookies
	// 			body: new URLSearchParams(data).toString(),
	// 		};
	// 	} else {
	// 		options = {
	// 			method: "GET", // 确保使用GET方法
	// 			credentials: "include", // 确保发送请求时包含cookies
	// 		};
	// 	}
	// 	try {
	// 		const response = await fetch(url, options);
	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! status: ${response.status}`);
	// 		}
	// 		return response;
	// 	} catch (error) {
	// 		throw error; // 抛出错误，可以在调用处捕获
	// 	}
	// }

	static loadGM_Value(key, defaultValue = {}) {
		let value;
		try {
			// 获取存储的值
			value = GM_getValue(key);
			if (value == undefined) {
				value = defaultValue;
			}
		} catch (error) {
			value = defaultValue;
		}
		return value;
	}

	/**
	 * 对比两个字符串是否一致
	 * @param {string} pattern - 正则表达式字符串
	 * @param {string} str - 普通字符串
	 * @returns {boolean} - 对比结果
	 */
	static comparePartCode(pattern, PartCode) {
		// 去除空格和"-"符号
		const cleanedPattern = pattern.replace(/[\s-]/g, "");
		const cleanedStr = PartCode.replace(/[\s-]/g, "");

		// 创建正则表达式对象
		const regex = new RegExp(cleanedPattern);

		// 对比字符串
		return regex.test(cleanedStr);
	}

	/**
	 * 把数组转换为字典
	 * @param {string} rows - CSV数据读取后的数组
	 */
	static List2Dict(rows) {
		// 创建一个空集
		let resultSet = {};
		// 假设 rows 是已经解析的 CSV 数据
		rows.forEach((row) => {
			// 检查子元素 list 的第三个孙元素是否不是空的
			if (row[2] !== "" && row[2] !== undefined) {
				// 去除字符串中的空格、-、/、\ 这些字符
				let key = row[2].replace(/[\s\-\/\n\\]/g, "");
				// 如果 key 不存在于集合中，则初始化为一个空 list
				if (!resultSet[key]) {
					resultSet[key] = [];
				}
				// 将子元素添加到集合中
				resultSet[key].push(row);
			}
		});
		return resultSet;
	}

	// 把英文逗号、句号和问号替换为中文标点
	static replacEn2Zh(str) {
		// 替换英文逗号、句号和问号为中文标点
		// let newstr =  str.replace(/[,.\?!;:(){}<>[\]-/\\]/g, function(match) {
		let newstr = str.replace(/[,\\.!?;:(){}<>[\]\-/\\\\]/g, function (match) {
			switch (match) {
				case ",":
					return "，";
				case ".":
					return "。";
				case "?":
					return "？";
				case "!":
					return "！";
				case ";":
					return "；";
				case ":":
					return "：";
				case "(":
					return "（";
				case ")":
					return "）";
				case "{":
					return "｛";
				case "}":
					return "｝";
				case "<":
					return "《";
				case ">":
					return "》";
				case "[":
					return "【";
				case "]":
					return "】";
				case "-":
					return "－";
				case "/":
					return "／";
				case "\\":
					return "＼";
				case "\n":
					return "";
				case " ":
					return "";
				default:
					return match;
			}
		});
		return newstr;
	}

	static async PartCodeRisks(iframe, taskId) {
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document;
		// const tbody_Component = iframeDocument.querySelector("#UIPrpLComponent_add_orderProduct_table");
		const tbody_Component = await async_querySelector(
			"#UIPrpLComponent_add_orderProduct_table",
			{ parent: iframeDocument }
		);

		if (tbody_Component) {
			const trs = $$("tr", tbody_Component);
			const risks = new Map();
			risks.set("配件风险触发", 1);
			trs.forEach((tr, rowIndex) => {
				const 序号 = tr.cells[0];
				const 配件名称 = tr.cells[1];
				const 配件代码 = tr.cells[2];
				const 定损单价 = tr.cells[8];
				const 核损单价 = tr.cells[9];
				const 报价 = tr.cells[10];
				const 配件品质 = tr.cells[12];
				const 参考价格 = tr.cells[13];
				const 定损总价 = tr.cells[15];
				const 核损总价 = tr.cells[16];

				const partname = Common.cellGetValue(配件名称);
				const partcode = Common.cellGetValue(配件代码).replace(
					/[\s\-\/\n\\]/g,
					""
				);
				const apprprice = Common.cellGetValue(定损单价)
					? parseInt(Common.cellGetValue(定损单价), 10)
					: 0;
				const checkprice = Common.cellGetValue(核损单价)
					? parseInt(Common.cellGetValue(核损单价), 10)
					: 0;
				const price = Common.cellGetValue(报价)
					? parseInt(Common.cellGetValue(报价), 10)
					: 0;
				const quality = Common.cellGetValue(配件品质);
				const referprice = Common.cellGetValue(参考价格)
					? parseInt(Common.cellGetValue(参考价格), 10)
					: 0;
				const apprsum = Common.cellGetValue(定损总价)
					? parseInt(Common.cellGetValue(定损总价), 10)
					: 0;
				const checksum = Common.cellGetValue(核损总价)
					? parseInt(Common.cellGetValue(核损总价), 10)
					: 0;

				if (配件编码风险[partcode]) {
					const partcode_risks = 配件编码风险[partcode];
					let prisks = [];
					partcode_risks.forEach((risk) => {
						// 风险触发
						let riskmsg = `【${partname}】[${risk[2]}] `;
						if (risk[10]) {
							riskmsg += `本地【${risk[11]}】:${risk[10]}`;
						}
						if (risk[13]) {
							riskmsg += `<br>历史触发:${risk[13]}`;
						}
						if (risk[14]) {
							riskmsg += `<br>备注:${risk[14]}`;
						}
						prisks.push(riskmsg);
					});
					risks.set(partname, prisks);
				}
			});
			if (!Tasks[taskId] || !Tasks[taskId].has("配件风险触发")) {
				if (!Tasks[taskId]) {Tasks[taskId]=new Map();}
				let taskrisks = Tasks[taskId];
				taskrisks = Common.risksmerge(taskrisks, risks);
				Tasks[taskId]=taskrisks;
			}
			return risks;
		}
	}

	static async_querySelector(
		selector,
		{ timeout = 5000, parent = document } = {}
	) {
		return new Promise((resolve, reject) => {
			// 立即检查元素是否存在
			const element = parent.querySelector(selector);
			if (element) {
				return resolve(element);
			}

			// 配置 MutationObserver
			const observer = new MutationObserver((mutations, obs) => {
				const foundElement = parent.querySelector(selector);
				if (foundElement) {
					cleanup();
					resolve(foundElement);
				}
			});

			// 超时处理
			const timeoutId = setTimeout(() => {
				cleanup();
				reject(
					new Error(`Element "${selector}" not found within ${timeout}ms`)
				);
			}, timeout);

			// 清理函数
			const cleanup = () => {
				observer.disconnect();
				clearTimeout(timeoutId);
			};

			// 开始观察 DOM 变化
			observer.observe(parent, {
				childList: true,
				subtree: true,
				attributes: false,
				characterData: false,
			});

			// 再次检查防止竞争条件
			const immediateCheck = parent.querySelector(selector);
			if (immediateCheck) {
				cleanup();
				resolve(immediateCheck);
			}
		});
	}
}


/**
 * 车辆案件信息处理类，用于管理车辆相关案件的历史记录、损失项目及工作流查询
 */
class CAR {
	/**
	 * 构造函数，初始化车辆基本信息及历史记录存储结构
	 * @param {string} licenseNo - 车牌号码（必需参数）
	 * @param {string} [frameNo=''] - 车架号/VIN码
	 * @param {string} [engineNo=''] - 发动机号
	 * @param {string} [keyword='标的'] - 用于节点筛选的关键字，默认为'标的'
	 */
	constructor(licenseNo, frameNo = '', engineNo = '', keyword = '标的') {
		// 初始化历史案件存储和损失记录映射
		this.historylosses = new Map()
		// 设置车辆识别信息
		this.licenseNo = licenseNo
		this.frameNo = frameNo
		this.engineNo = engineNo
		this.keyword = keyword
		this.historycasesdict = {}
	}

	/**
	 * 异步初始化方法，根据已有车辆信息查询关联工作流
	 * @async
	 * @returns {Promise<boolean>} 返回初始化完成状态
	 */
	async initialize() {
		/* 初始化流程控制：避免重复初始化 */
		if (this.isinit) { return }
		/* 根据现有车辆信息优先级顺序进行查询（车牌 > 车架 > 发动机） */
		if (this.licenseNo) {
			await this.queryWorkflow('', '', this.licenseNo);
		}
		if (this.frameNo) {
			await this.queryWorkflow('', '', '', '', this.frameNo);
		}
		if (this.engineNo) {
			await this.queryWorkflow('', '', '', '', '', this.engineNo);
		}
		this.isinit = true
		return this.isinit
	}

	/**
	 * 从案件节点列表中获取最后一个完成的车辆定损节点
	 * @param {Array} Nodes - 案件节点列表
	 * @param {string} [keyword=this.keyword] - 节点筛选关键字
	 * @returns {Object|undefined} 返回符合条件的最新节点或undefined
	 */
	getLastCarLossNode(Nodes, keyword = this.keyword) {
		/* 节点筛选逻辑：状态为完成(9)且包含关键字的节点 */
		let tmpid = 0, tmpnode = {}
		for (let Node of Nodes) {
			if (Node.status != '9') { continue }
			if (!Node.nodeName.includes(keyword)) { continue }
			// 保留ID最大的节点（最新节点）
			if (Node.id > tmpid) {
				tmpnode = Node
				tmpid = Node.id
			}
		}
		return tmpnode?.status ? tmpnode : undefined
	}

	/**
	* 解析车辆定损页面中的损失项目
	* @param {Document} doc - 定损页面文档对象
	* @returns {Map} 返回分类损失项目映射（配件/外修/工时/辅料）
	*/
	parser_CarlossItems(doc) {
		/* 表格解析工具函数：从指定表格中提取项目名称 */
		function getItems(Table, offset = 0) {
			if (!Table) { return [] }
			let Items = []
			const trs = $$("tr", Table)
			trs.forEach((tr) => {
				const 项目名称 = Common.cellGetValue(tr.cells[1 + offset])
				if (!Items.includes(项目名称)) { Items.push(项目名称) }
			})
			return Items
		}

		/* 页面元素定位与数据提取 */
		const lossitems = new Map()
		lossitems.set('配件', getItems(doc.querySelector("#UIPrpLComponent_add_orderProduct_table"), 0))
		lossitems.set('外修', getItems(doc.querySelector("#UIExternalComponent_body"), 0))
		lossitems.set('工时', getItems(doc.querySelector("#UIPrpLrepairFee_add_orderProduct_table"), 1))
		lossitems.set('辅料', getItems(doc.querySelector("#UIPrpLmaterial_add_orderProduct_table"), 1))
		return lossitems
	}

	/**
	 * 获取案件的工作流节点数据
	 * @param {Object} caseitem - 案件信息对象
	 * @returns {Promise<Array>} 返回案件节点列表
	 */
	async getCaseNodes(caseitem) {
		/* 通过accidentNo获取案件工作流数据 */
		let Workflowurl = `/claim/bpmTaskController.do?loadWorkflowData&businessMainKey=${caseitem.accidentNo}&showType=1`
		return await httpRequest(Workflowurl).then((response) => response.json())
	}

	/**
	 * 工作流查询方法，收集符合条件的案件信息
	 * @param {string} [registNo] - 报案号
	 * @param {string} [policyNo] - 保单号
	 * @param {string} [licenseNo] - 车牌号
	 * @param {string} [insuredName] - 被保险人
	 * @param {string} [frameNo] - 车架号
	 * @param {string} [engineNo] - 发动机号
	 * @param {string} [accidentNo] - 事故号
	 * @param {string} [claimNo] - 理赔号
	 * @param {string} [licenseNo3] - 三者车牌号
	 * @returns {Promise<Object>} 返回查询结果
	 */
	async queryWorkflow(registNo = '', policyNo = '', licenseNo = '', insuredName = '', frameNo = '', engineNo = '', accidentNo = '', claimNo = '', licenseNo3 = '') {
		/* 构建查询参数并发送请求 */
		const postdata = { registNo, policyNo, licenseNo, insuredName, frameNo, engineNo, accidentNo, claimNo, licenseNo3 }
		const url = '/claim/bpmTaskController.do?queryWorkflow&field=accidentNo,registNo,policyNo,relationPolicyNo,licenseNo,insuredName,datamgetDateStr'

		/* 处理响应数据并更新历史案件记录 */
		return httpRequest(url, postdata)
			.then((response) => response.json())
			.then((result) => {
				const caseitems = result.rows
				caseitems.forEach(caseitem => {
					// if (!this.historycases.includes(caseitem)) {
					if (!this.historycasesdict[caseitem.registNo]) {
						// this.historycases = this.historycases.concat([caseitem])
						this.historycasesdict[caseitem.registNo] = caseitem
					}

				})
				if (Object.values(this.historycasesdict)) {
					console.log('看看检索后的历史记录', this.historycasesdict)
				}
			})
	}

	/**
	 * 获取指定案件的车辆损失明细
	 * @param {Object} caseitem - 案件信息对象
	 * @param {string} [keyword=this.keyword] - 节点筛选关键字
	 */
	async getcarloss(caseitem, keyword = this.keyword) {
		/* 重复检查：已处理案件直接返回 */
		if (this.historylosses.has(caseitem.registNo)) {
			console.warning('案件已处理:', caseitem.registNo, keyword)
			return
		}

        //如果this.keyword不是标的,返回空值
        if(this.keyword != '标的'){
            this.historylosses.set(caseitem.registNo, new Map([["配件", []], ["外修", []], ["工时", []], ["辅料", []]]))
            return 
        }

		/* 多步骤处理流程：节点获取->页面解析->数据存储 */
		let lossitems = await this.getCaseNodes(caseitem)
			.then(Nodes => {
				const node = this.getLastCarLossNode(Nodes, keyword)
				if (!node) {throw '未找到车损节点'}
				return `/claim/bpmTaskController.do?processTask&taskId=${node.id}&taskType=${node.taskType}`
			})
			.then(carinfourl => httpRequest(carinfourl).then(res => res.html()))
			.then(carinfodoc => {
				const commonInfo = {}
				$$('#commonInfo input', carinfodoc).forEach(item => {
					if (item.value) commonInfo[item.id.replace("bpmPage_", "")] = item.value
				})
				return commonInfo
			})
			.then(commonInfo => httpRequest('/claim/carCommonController.do?getLossInfo', commonInfo))
			.then(response => response.html())
			.then(document => this.parser_CarlossItems(document))
			.catch(e => {
				console.error('处理异常:', e)
				return new Map([["配件", []], ["外修", []], ["工时", []], ["辅料", []]])
			})

		/* 存储解析结果 */
		this.historylosses.set(caseitem.registNo, lossitems)
	}

	/**
	 * 批量获取历史案件的损失明细
	 * @param {Array} [caseitems=this.historycases] - 案件列表
	 * @param {string} [keyword=this.keyword] - 节点筛选关键字
	 * @returns {Promise<Array>} 返回所有查询的完成状态
	 */
	// async gethistoryloss(caseitems = this.historycases, keyword = this.keyword) {
	async gethistoryloss(caseitems = Object.values(this.historycasesdict), keyword = this.keyword) {
		/* 创建并行查询队列 */
		let query = []

		caseitems.forEach(caseitem => {
			if (!this.historylosses.has(caseitem.registNo)) {
				query.push(this.getcarloss(caseitem, keyword))
			}
		})
		return await Promise.allSettled(query)
	}

	/**
	 * 对比历史案件找出重复损失项目
	 * @param {string} registNo - 当前报案号
	 * @param {Map} [historylosses=this.historylosses] - 损失记录集合
	 * @returns {Map} 返回重复项目映射（项目名称->关联案件列表）
	 */
	getsameitems(registNo, historylosses = this.historylosses) {
		/* 构建基准项目集合 */
		const baseKey = registNo
		const baseElements = new Set()
		Array.from(historylosses.get(baseKey).values()).flat().forEach(item => baseElements.add(item))

		/* 历史案件对比分析 */
		const Sameitems = new Map()
		historylosses.forEach((损失项目, 案件号) => {
			if (案件号 !== baseKey) {
				损失项目.forEach((items, category) => {
					items.forEach(item => {
						if (baseElements.has(item)) {
							if (!Sameitems.has(item)) Sameitems.set(item, [])
							const link = this.makeCaseLink(案件号)
							if (!Sameitems.get(item).includes(link)) {
								Sameitems.get(item).push(`历史案件出现过此项目:${link}`)
							}
						}
					})
				})
			}
		})
		return Sameitems
	}

	/**
	 * 将历史损失分析结果关联到任务
	 * @param {string} registNo - 当前报案号
	 * @param {string} taskId - 任务ID
	 */
	async addhistoryloss2Tasks(registNo, taskId) {
		/* 前置初始化检查 */
		await this.initialize()
		await this.gethistoryloss()

		/* 风险数据整合与存储 */
		const Sameitems = this.getsameitems(registNo)
		if (!Sameitems || !Tasks[taskId]) return

		let taskrisks = Tasks[taskId]
		Tasks[taskId]=Common.risksmerge(taskrisks, Sameitems)
	}

	/**
	 * 生成案件详情超链接
	 * @param {string} registNo 报案号
	 * @returns {string} HTML超链接字符串
	 */
	makeCaseLink(registNo) {
		const accidentNo = this.historycasesdict[registNo]?.accidentNo;
		if (!accidentNo) return registNo; // 容错处理
		let linkstr = ''
		linkstr += `<a href="/claim/bpmTaskController.do?goShowWorkflow&businessMainKey=${accidentNo}" 
                   target="workflow_${accidentNo}"
                   style="color: #007bff; text-decoration: underline;">
                    ${registNo}
                </a>`;
		linkstr += `  ${this.historycasesdict[registNo]?.datamgetDateStr}  `
		linkstr += `   <a href="/claim/certificateController.do?goImageQuery&imageBusiNo=${accidentNo}" 
                   target="images_${accidentNo}" 
                   style="color: #007bff; text-decoration: underline;">
                    图片
                </a>`;
		return linkstr;
	}

}

// 用于创建悬浮窗口的类
class MultiTabFloater {
	constructor(iframe = document, iconstr = '⚙️', options = {}) {

		// 默认配置
		this.config = {
			title: '悬浮窗',
			x: 50,
			y: 50,
			bx: 1,
			by: 1,
			...options
		};

		// 获取 iframe 的 document 对象
		//iconstr可以用特殊符号⚙️🎛️🦉🌏🚗🏍️🧸🧱
		const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document || document;

		// 创建图标按钮
		this.swastika = iframeDocument.createElement('div');
		this.swastika.innerHTML = iconstr;
		this.swastika.style.fontSize = '18px';
		this.swastika.style.position = 'fixed';
		this.swastika.style.left = `${this.config.bx}px`;
		this.swastika.style.bottom = `${this.config.by}px`;
		this.swastika.style.height = '25px';
		this.swastika.style.width = '25px';
		// this.swastika.style.backgroundColor = '#007bff';
		this.swastika.style.borderRadius = '50%';
		this.swastika.style.display = 'flex';
		this.swastika.style.alignItems = 'center';
		this.swastika.style.justifyContent = 'center';
		this.swastika.style.cursor = 'pointer';
		this.swastika.style.zIndex = '1000';
		this.swastika.style.color = '#333';
		this.swastika.style.userSelect = 'none';
		iframeDocument.body.appendChild(this.swastika);

		// 创建悬浮窗口
		this.modal = iframeDocument.createElement('div');
		this.modal.style.position = 'fixed';
		this.modal.style.left = `${this.config.x}px`;
		this.modal.style.top = `${this.config.y}px`;
		this.modal.style.transform = 'translate(-50%, -50%)';
		// this.modal.style.width = '600px'; // 设置宽度,不设置则自适应
		this.modal.style.maxWidth = '50vw';
		this.modal.style.maxHeight = '80vh';
		this.modal.style.backgroundColor = '#f9f9f9';
		this.modal.style.border = '1px solid #ddd';
		this.modal.style.borderRadius = '8px';
		this.modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
		this.modal.style.zIndex = '1001';
		this.modal.style.display = 'none';
		this.modal.style.overflow = 'auto';
		this.modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
		iframeDocument.body.appendChild(this.modal);

		// 创建标题栏
		this.header = iframeDocument.createElement('div');
		this.header.style.padding = '8px';
		this.header.style.backgroundColor = '#eee';
		this.header.style.borderBottom = '1px solid #ddd';
		this.header.style.cursor = 'move';
		this.header.style.userSelect = 'none';
		this.header.textContent = `${this.config.title}`;  // 标题文字,空格占位，使标题栏高度不为 0
		this.modal.appendChild(this.header);

		// 创建关闭按钮
		this.closeButton = iframeDocument.createElement('div');
		this.closeButton.textContent = '×';
		this.closeButton.style.position = 'absolute';
		this.closeButton.style.right = '10px';
		this.closeButton.style.top = '7px';
		this.closeButton.style.cursor = 'pointer';
		this.closeButton.style.fontSize = '20px';
		this.closeButton.style.color = '#888';
		this.closeButton.style.border = 'none';
		this.closeButton.style.borderRadius = '50%';
		// this.closeButton.style.backgroundColor = '#ff4444';
		this.closeButton.addEventListener('mouseenter', () => {
			this.closeButton.style.color = '#ff4444';
		});
		this.closeButton.addEventListener('mouseleave', () => {
			this.closeButton.style.color = '#888';
		});
		this.header.appendChild(this.closeButton);

		// 创建 Tab 容器
		this.tabContainer = iframeDocument.createElement('div');
		this.tabContainer.style.display = 'flex';
		this.tabContainer.style.justifyContent = 'space-around';
		this.tabContainer.style.gap = '0';
		this.tabContainer.style.backgroundColor = '#f1f1f1';
		this.tabContainer.style.borderBottom = '1px solid #ddd';
		this.modal.appendChild(this.tabContainer);

		// 创建内容容器
		this.contentContainer = iframeDocument.createElement('div');
		this.contentContainer.style.padding = '20px';
		this.contentContainer.style.fontSize = '14px';
		this.contentContainer.style.color = '#333';
		this.modal.appendChild(this.contentContainer);

		// 初始化 Tabs
		this.tabs = [];

		// 保存窗口位置
		this.modalPosition = { left: '5%', top: '20%' };

		// 绑定事件到 iframe 的文档
		const iframeWindow = iframe.contentWindow || iframe.defaultView;
		// const iframeDocument = iframeWindow.document;
		this.swastika.addEventListener('click', this.showModal.bind(this));
		this.closeButton.addEventListener('click', this.closeModal.bind(this));
		this.header.addEventListener('mousedown', this.startDrag.bind(this));
		iframeWindow.addEventListener('mousemove', this.onMouseMove.bind(this));
		iframeWindow.addEventListener('mouseup', this.stopDrag.bind(this));
	}

	// 显示悬浮窗口
	showModal() {
		this.swastika.style.display = 'none'; // 隐藏卍字按钮
		this.modal.style.display = 'block';
		this.modal.style.opacity = '0';
		this.modal.style.transform = 'scale(0.9)';
		this.modal.style.left = this.modalPosition.left;
		this.modal.style.top = this.modalPosition.top;
		setTimeout(() => {
			this.modal.style.opacity = '1';
			this.modal.style.transform = 'scale(1)';
		}, 10);
	}

	// 关闭悬浮窗口
	closeModal() {
		this.modal.style.opacity = '0';
		this.modal.style.transform = 'scale(0.9)';
		setTimeout(() => {
			this.modal.style.display = 'none';
			this.swastika.style.display = 'flex'; // 重新显示卍字按钮
		}, 300);
		this.savePosition();
	}

	// 保存窗口位置
	savePosition() {
		this.modalPosition.left = this.modal.style.left;
		this.modalPosition.top = this.modal.style.top;
	}

	// 开始拖拽
	startDrag(e) {
		const rect = this.modal.getBoundingClientRect();
		this.dragging = {
			isDragging: true,
			offsetX: e.clientX - rect.left,
			offsetY: e.clientY - rect.top
		};
		e.preventDefault();
	}

	// 拖拽过程
	onMouseMove(e) {
		if (!this.dragging?.isDragging) return;

		const newLeft = e.clientX - this.dragging.offsetX;
		const newTop = e.clientY - this.dragging.offsetY;

		const maxLeft = window.innerWidth - this.modal.offsetWidth;
		const maxTop = window.innerHeight - this.modal.offsetHeight;

		this.modal.style.left = `${Math.min(Math.max(newLeft, 0), maxLeft)}px`;
		this.modal.style.top = `${Math.min(Math.max(newTop, 0), maxTop)}px`;
		this.modal.style.transform = 'none';
	}

	// 停止拖拽
	stopDrag() {
		this.dragging = { isDragging: false };
	}

	// 添加 Tab
	addTab(name, contentFunction) {
		if (name && contentFunction) {
			this.tabs.push({ name, content: contentFunction });
			this.updateTabs();
		}
	}

	// 更新 Tab
	updateTabs() {
		// 清空 Tab 容器和内容容器
		this.tabContainer.innerHTML = '';
		this.contentContainer.innerHTML = '';

		if (this.tabs.length === 0) {
			// 默认显示 Tab1 的内容
			this.contentContainer.textContent = '这是 Tab 1 的内容';
			return;
		}

		this.tabs.forEach((tab, index) => {
			const tabButton = this.tabContainer.ownerDocument.createElement('button');
			tabButton.textContent = tab.name;
			tabButton.style.flex = '1';
			tabButton.style.padding = '10px';
			tabButton.style.border = 'none';
			tabButton.style.borderRadius = '0';
			tabButton.style.cursor = 'pointer';
			tabButton.style.backgroundColor = '#ddd';
			tabButton.style.color = '#333';
			tabButton.style.transition = 'background-color 0.3s ease, color 0.3s ease';
			tabButton.style.fontSize = '14px';
			tabButton.style.fontWeight = 'bold';

			tabButton.addEventListener('click', () => this.selectTab(index));

			// tabButton.addEventListener('mouseenter', () => {
			//     if (tabButton.style.backgroundColor !== '#007bff') {
			//         tabButton.style.backgroundColor = '#ccc';
			//     }
			// });

			// tabButton.addEventListener('mouseleave', () => {
			//     if (tabButton.style.backgroundColor !== '#007bff') {
			//         tabButton.style.backgroundColor = '#ddd';
			//     }
			// });

			this.tabContainer.appendChild(tabButton);
		});

		// 默认选中第一个 Tab
		this.selectTab(0);
	}

	// 选择 Tab
	selectTab(index) {

		// 清空容器内容
		this.contentContainer.innerHTML = '';

		if (index >= 0 && index < this.tabs.length) {
			this.tabs.forEach((tab, i) => {
				const tabButtons = this.tabContainer.getElementsByTagName('button');
				if (i === index) {
					tabButtons[i].style.backgroundColor = '#007bff'; // 蓝色
					tabButtons[i].style.color = '#fff'; // 白色
					tab.content(this.contentContainer);
				} else {
					tabButtons[i].style.backgroundColor = '#ddd';
					tabButtons[i].style.color = '#333';
				}
			});
		}
	}
}

// 创建悬浮窗
class myModal {
	constructor(options = {}) {
		// 合并配置
		this.config = {
			miniIcon_text: '🎛️',
			title: '悬浮窗',
			x: 100,
			y: 100,
			bx: 1,
			by: 100,
			content: null,
			element: null,
			iframe: document,
			isdblclick: true,
			...options
		};

		// 初始化状态
		this.isDragging = false;
		this.startX = 0;
		this.startY = 0;
		this.initialX = 0;
		this.initialY = 0;

		// 初始化 DOM 元素
		this.iframe = this.config.iframe || document;
		this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow?.document || document;

		this._createElements();
		this._bindEvents();
	}

	_createElements() {
		// 创建主容器
		this.floatDiv = this.iframeDocument.createElement('div');
		this.floatDiv.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        min-width: 200px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: hidden;
        z-index: 9999;
      `;

		// 创建标题栏
		this.titleBar = this.iframeDocument.createElement('div');
		this.titleBar.style.cssText = `
        background:rgba(1, 158, 248, 0.26);
        padding: 1px;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      `;

		// 标题文字
		this.titleText = this.iframeDocument.createElement('span');
		this.titleText.textContent = this.config.title;

		// 关闭按钮
		this.closeBtn = this.iframeDocument.createElement('button');
		this.closeBtn.textContent = '×';
		this.closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 15px;
        cursor: pointer;
        padding: 0 6px;
        background: rgba(241, 34, 19, 0.72);
        border-radius: 50%;
      `;

		// 内容容器
		this.contentContainer = this.iframeDocument.createElement('div');
		this.contentContainer.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 8px;
      `;

		// 组装元素
		this.titleBar.appendChild(this.titleText);
		this.titleBar.appendChild(this.closeBtn);
		this.floatDiv.appendChild(this.titleBar);
		this.floatDiv.appendChild(this.contentContainer);
		this.iframeDocument.body.appendChild(this.floatDiv);

		// 初始位置
		this.floatDiv.style.left = `${this.config.x}px`;
		this.floatDiv.style.top = `${this.config.y}px`;

		// 创建迷你图标（无 element 时）
		if (!this.config.element) {
			this.miniIcon = this.iframeDocument.createElement('div');
			this.miniIcon.style.cssText = `
          position: fixed;
          left: ${this.config.bx}px;
          top: ${this.config.by}px;
          width: 20px;
          height: 20px;
          font-size: 15px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
			this.miniIcon.textContent = `${this.config.miniIcon_text}`;
			this.iframeDocument.body.appendChild(this.miniIcon);
		}

		// 初始化显示状态
		this.floatDiv.style.display = 'none';
		if (this.miniIcon) this.miniIcon.style.display = 'block';

		// 绑定元素交互
		if (this.config.element) {
			this.config.element.style.cssText = `
          cursor: pointer;
          user-select: none;
        `;
			const isdblclick = this.config.isdblclick ? 'dblclick' : 'click';
			this.config.element.addEventListener(isdblclick, () => this.show());
		}

		// 初始化内容
		if (this.config.content) {
			this.contentContainer.appendChild(this.config.content);
		}
	}

	_bindEvents() {
		// 拖动事件
		this.titleBar.addEventListener('mousedown', (e) => this._startDrag(e));
		this.iframeDocument.addEventListener('mousemove', (e) => this._drag(e));
		this.iframeDocument.addEventListener('mouseup', () => this._endDrag());

		// 关闭按钮
		this.closeBtn.addEventListener('click', () => this.hide());

		// 迷你图标切换
		if (this.miniIcon) {
			this.miniIcon.addEventListener('click', () => this.toggleVisibility());
		}
	}

	// 拖动方法
	_startDrag(e) {
		this.isDragging = true;
		this.startX = e.clientX;
		this.startY = e.clientY;
		this.initialX = parseFloat(this.floatDiv.style.left);
		this.initialY = parseFloat(this.floatDiv.style.top);
	}

	_drag(e) {
		if (!this.isDragging) return;
		const dx = e.clientX - this.startX;
		const dy = e.clientY - this.startY;
		this.floatDiv.style.left = `${this.initialX + dx}px`;
		this.floatDiv.style.top = `${this.initialY + dy}px`;
	}

	_endDrag() {
		this.isDragging = false;
	}

	// 公共方法
	toggleVisibility() {
		const shouldShow = this.floatDiv.style.display === 'none';
		this.floatDiv.style.display = shouldShow ? 'block' : 'none';
		if (this.miniIcon) this.miniIcon.style.display = shouldShow ? 'none' : 'block';
	}

	setContent(element) {
		this.contentContainer.innerHTML = '';
		this.contentContainer.appendChild(element);
	}

	show() {
		this.floatDiv.style.display = 'block';
		if (this.miniIcon) this.miniIcon.style.display = 'none';
	}

	hide() {
		this.floatDiv.style.display = 'none';
		if (this.miniIcon) this.miniIcon.style.display = 'block';
	}

	close() {
		this.floatDiv.remove();
		if (this.miniIcon) this.miniIcon.remove();
		if (this.config.element) {
			this.config.element.style.cssText = '';
			this.config.element.removeEventListener('dblclick', () => this.show());
		}
	}
}


// 优化后的安全版本,合作维修厂, 配件编码风险是全局变量
function initialize() {
	// 1. 加强类型校验
	const 合作维修厂存储值 = GM_getValue('合作维修厂');

	// 验证存储数据结构（必须包含两个元素的数组）
	const is合作维修厂Valid = Array.isArray(合作维修厂存储值) &&
		合作维修厂存储值.length === 2 &&
		typeof 合作维修厂存储值[0] === 'object' &&
		!Array.isArray(合作维修厂存储值[0]);

	// 2. 安全解构（带类型回退）
	const [合作维修厂原始数据, lastModified] = is合作维修厂Valid ?
		合作维修厂存储值 :
		[{}, null]; // 无效数据时使用空对象

	// 3. 增强数据转换（带类型检查）
	合作维修厂 = Object.entries(合作维修厂原始数据).reduce((acc, [key, value]) => {
		// 验证值结构是否为四元素数组
		if (Array.isArray(value) && value.length >= 4) {
			acc[key] = `等级:${value[0]},类型:${value[1] ? '服务站' : '综修厂'},厂方折扣:${value[2]}%,品牌折扣:${value[3]}%`;
		} else {
			console.warn('异常维修厂数据:', key, value);
		}
		return acc;
	}, {});

	// 4. 带类型保护的配件编码处理
	const rawCSV = GM_getValue('CSV_配件编码');
	const CSV_配件编码 = Array.isArray(rawCSV) ? rawCSV : [];
	配件编码风险 = CSV_配件编码.length > 0 ? Common.List2Dict(CSV_配件编码) : {};

	// 5. 统计信息（带数据校验）
	const stats = {
		合作综修厂: Object.keys(合作维修厂).length,
		异常维修厂数据: Object.keys(合作维修厂原始数据).length - Object.keys(合作维修厂).length,
		配件编码风险: Object.keys(配件编码风险).length,
		CSV数据更新时间: lastModified ? new Date(lastModified).toLocaleDateString() : '无'
	};

	console.log('数据初始化报告:', stats);

	// 6. 增强通知信息,关闭弹窗提示
	// GM_notification({
	//     text: `有效合作厂: ${stats.合作综修厂} 
	//     异常数据: ${stats.异常维修厂数据}
	//     风险编码: ${stats.配件编码风险}
	//     最后更新: ${stats.CSV数据更新时间}`
	//         .replace(/\s+/g, ' '),
	//     title: '数据健康状态',
	//     timeout: 8000
	// });
}


// 待测试功能





// 呈报流程检索流程---------------------------------------------------------------

// 呈报流程检索流程处理器,输入iframe



class RenderFlowHandler {


	/**
	 * 获取案件所有呈报流程简要信息
	 * @param {string} businessMainKey - 案件主键
	 * @returns {Promise<Array>} 返回 [actionId, 呈报编号, 发起时间] 数组
	 */
	static async getrenderitems(businessMainKey) {
		const url = `/claim/workflowController.do?getRenderInfo&businessMainKey=${businessMainKey}&_=${new Date().getTime()}`;
		return await httpRequest(url)
			.then((resp) => resp.text())
			.then((html) => {
				const renderitems = [];
				const doc = new DOMParser().parseFromString(html, "text/html");
				const table = doc.querySelector("#caseStatus");
				if (!table) {
					return renderitems;
				}
				const trs = $$("tr", table);
				trs.forEach((tr) => {
					const tds = $$("td", tr);
					if (tds.length <= 1) {
						return renderitems;
					}
					const link = tds[0].querySelector("a");
					if (!link) {
						return renderitems;
					}
					const onclickAttr = link.getAttribute("onclick");
					const actionId = onclickAttr.match(/showRenderInfo\('','(\d+)'\)/)[1];
					//item包含actionId,呈报代码,发起时间
					const item = [actionId, tds[1].innerText, tds[3].innerText];
					renderitems.push(item);
				});
				return renderitems;
			});
	}

	/**
	 * 获取单个呈报流程的详细步骤数据
	 * @param {Array} renderitem - [actionId, 呈报编号, 发起时间]
	 * @returns {Promise<Array>} 返回 [renderflow, flowstatus, renderitem]
	 */
	static async getrenderinfo(renderitem) {
		const actionId = renderitem[0];
		let flowstatus;
		const url = `/claim/workflowController.do?showRenderInfo&actionId=${actionId}&_=${new Date().getTime()}`;
		return await httpRequest(url)
			.then((resp) => resp.text())
			.then((html) => {
				const jsonString = html.match(/jQuery\.parseJSON\('(.*)'\);/)[1];
				// 将提取的文字转化为JSON对象
				var jsonObject = JSON.parse(jsonString);
				// 输出JSON对象
				return jsonObject;
			})
			.then((data) => {
				const lasttask = data[data.length - 1];
				flowstatus = lasttask.status;
				const currentask =
					lasttask.status === "9" ? lasttask : data[data.length - 2];
				return [currentask, lasttask];
			})
			.then((tasks) => {
				const task = tasks[0];
				const url = `/claim/bpmTaskController.do?processTask&taskId=${task["actionId"]
					}&taskType=${task["taskType"]}&_=${new Date().getTime()}`;
				return httpRequest(url).then((resp) => resp.html());
			})
			.then((doc) => {
				const renderflow = [];
				// const doc = new DOMParser().parseFromString(html, "text/html");
				const tbody = doc.querySelector("#RenderTrack tbody");
				if (tbody) {
					const trs = $$("tr", tbody);
					trs.forEach((tr) => {
						const tds = $$("td", tr);
						if (tds.length > 1) {
							const 序号 = tds[0].innerText.replace(/[\s\-\/\n\t\\]/g, "");
							const 处理人 = tds[1].innerText.replace(/[\s\-\/\n\t\\]/g, "");
							const 处理环节 = tds[2].innerText.replace(/[\s\-\/\n\t\\]/g, "");
							const 意见 = tds[3].innerText.replace(/[\s\-\/\n\t\\]/g, "");
							const 意见说明 = tds[4].innerText.replace(/[\s\-\/\n\t\\]/g, "");
							renderflow.push([序号, 处理人, 处理环节, 意见, 意见说明]);
						}
					});
				} else {
					const 意见说明 = doc.querySelector("#reason").textContent;
					renderflow.push(["1", "申请人", "呈报申请", "同意", 意见说明]);
				}
				return [renderflow, flowstatus, renderitem];
			});
	}

	/**
	 * 并行获取所有呈报流程的完整数据
	 * @param {string} businessMainKey - 案件主键
	 * @returns {Promise<Array>} 返回格式化后的流程数据数组
	 */
static async getAllRenderInfo(businessMainKey) {
    // 第一阶段：获取所有待处理的renderitems
    const items = await this.getrenderitems(businessMainKey);

    // 第二阶段：并行处理每个item的详细数据请求
    const results = await Promise.all(
        items.map(async (item) => {
            try {
                // 获取单个item的详细数据 - 注意这里接收4个参数
                const [renderflow, flowstatus, renderitem, tbodyelement] = await this.getrenderinfo(item);
                return {
                    metadata: renderitem, // 原始数据 [actionId, 呈报编号, 发起时间]
                    flowData: renderflow, // 流程步骤二维数组
                    status: flowstatus, // 最终状态码
                    tbodyelement: tbodyelement, // 添加这个属性
                    displayInfo: {
                        // 用于展示的格式化数据
                        actionId: item[0], // actionId
                        code: item[1], // 呈报编号
                        time: item[2], // 发起时间
						tbodyelement: tbodyelement, // 添加这个属性
                    },
                };
            } catch (error) {
                console.error(`处理项目 ${item} 时出错:`, error);
                return {
                    error: true,
                    item: item,
                    message: error.message,
                };
            }
        })
    );

    // 第三阶段：过滤并格式化最终结果
    return results.filter((result) => !result.error);
}

	/**
	 * 将呈报流程数据渲染为可视化组件
	 * @param {Array} flowData - 流程步骤数据
	 * @param {string} flowstatus - 流程状态码
	 * @param {Array} renderitem - 原始数据 [actionId, 呈报编号, 发起时间]
	 * @returns {Array} 包含 [容器, flowstatus, renderitem]
	 */
	static createRenderFlowDisplay([renderflow, flowstatus, renderitem]) {
		// 创建容器div
		const container = document.createElement("div");
		container.style.border = "1px solid #ddd";
		container.style.borderRadius = "4px";
		container.style.margin = "10px";
		container.style.padding = "15px";

		// 创建标题
		const title = document.createElement("h3");
		title.textContent = `发起时间：${renderitem[2]}`;
		title.style.padding = "8px 12px";
		title.style.borderRadius = "4px";
		title.style.backgroundColor = flowstatus === "9" ? "#409EFF" : "#F56C6C"; // 蓝/红
		title.style.color = "white";
		title.style.marginTop = "0";

		// 创建表格
		const table = document.createElement("table");
		table.style.width = "100%";
		table.style.borderCollapse = "collapse";
		table.style.marginTop = "12px";

		// 创建表头
		const thead = document.createElement("thead");
		thead.innerHTML = `
        <tr style="background:#f5f7fa">
            <th style="padding:8px;border:1px solid #ebeef5">序号</th>
            <th style="padding:8px;border:1px solid #ebeef5">处理人</th>
            <th style="padding:8px;border:1px solid #ebeef5">处理环节</th>
            <th style="padding:8px;border:1px solid #ebeef5">意见</th>
            <th style="padding:8px;border:1px solid #ebeef5">意见说明</th>
        </tr>
    `;

		// 创建表格内容
		const tbody = document.createElement("tbody");
		renderflow.forEach((item) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `
            <td style="padding:8px;border:1px solid #ebeef5">${item[0]}</td>
            <td style="padding:8px;border:1px solid #ebeef5">${item[1]}</td>
            <td style="padding:8px;border:1px solid #ebeef5">${item[2]}</td>
            <td style="padding:8px;border:1px solid #ebeef5">${item[3]}</td>
            <td style="padding:8px;border:1px solid #ebeef5">${item[4]}</td>
        `;
			tbody.appendChild(tr);
		});

		// 组装元素
		table.appendChild(thead);
		table.appendChild(tbody);
		container.appendChild(title);
		container.appendChild(table);

		// 返回要求的数组结构
		return [container, flowstatus, renderitem];
	}

	/**
	 * 主流程：检索并展示呈报流程
	 * @param {HTMLIFrameElement} iframe - 要操作的iframe
	 */
	static async displayRenderFlow(iframe) {
		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
		const businessMainKey = bpmitems.accidentNo;

		//集合调用getAllRenderInfo,创建展示的元素;返回值是数组,子元素是[container, flowstatus, renderitem]
		const results = await this.getAllRenderInfo(businessMainKey).then((allRenderData) => {
			const displayResults = allRenderData.map((dataItem) => {
				// 解构需要的数据
				const { flowData, status, metadata } = dataItem;
				// 调用显示创建函数
				return this.createRenderFlowDisplay([
					flowData, // 流程数据二维数组
					status, // 状态码
					metadata, // 原始元数据 [actionId, 呈报编号, 发起时间]
				]);
			});
			return displayResults;
		});

		if (results.length > 0) {
			const box = new MultiTabFloater(iframe, "🧸", { bx: 1, by: 50 });
			results.forEach((elementNode) => {
				console.debug(elementNode);
				const 容器 = elementNode[0];
				const 呈报编号 = elementNode[2][1];
				const 呈报时间 = elementNode[2][2];
				box.addTab(`${呈报编号}`, (contentContainer) => {
					contentContainer.appendChild(容器);
				});
			});
		}
	}
}


// 呈报流程检索流程结束---------------------------------------------------------------


// 增加配件差价计算器---------------------------------------------------------------



/**
 * 
 * 一个配件差价的计算器
 * @class PartsCalculator
 * @param {number} 配件总价 配件总价
 * @param {number} 录入的差价 录入的差价
 * @param {number} 残值 残值
 * 
 * 使用示例
 * const calculator = new PartsCalculator(1000, 200, 50);
 * document.body.appendChild(calculator.getContainer());
 */
class PartsCalculator {
	constructor(配件总价 = 0, 录入的差价 = 0, 残值 = 0) {
		this.配件总价 = 配件总价;
		this.录入的差价 = 录入的差价;
		this.残值 = 残值;

		// 初始化折扣数据
		this.initialDiscounts = [
			{ sysDiscount: 0.75, negDiscount: 0.8 },
			{ sysDiscount: 0.75, negDiscount: 0.85 },
			{ sysDiscount: 0.75, negDiscount: 0.88 },
			{ sysDiscount: 0.75, negDiscount: 0.9 },
			{ sysDiscount: 0.75, negDiscount: 1 },
			{ sysDiscount: 0.833, negDiscount: 0.85 },
			{ sysDiscount: 0.8075, negDiscount: 1 },
			{ sysDiscount: 0.8075, negDiscount: 0.89 },
			{ sysDiscount: 0.833, negDiscount: 0.98 },
			{ sysDiscount: 0.88, negDiscount: 1 },
			{ sysDiscount: 0.933, negDiscount: 1 }
		];

		this.container = this._createContainer();
		this._createTable();
		this._bindEvents();
		this.updateAll();
	}

	_createContainer() {
		const container = document.createElement('div');

		// 添加样式
		const style = document.createElement('style');
		style.textContent = `
        .calculator-table { border-collapse: collapse; margin: 10px; }
        .calculator-table td, .calculator-table th { 
          border: 1px solid #999; padding: 8px; min-width: 80px; 
        }
        .calculator-table input { 
          width: 80px; border: none; outline: none; text-align: right; 
        }
        .calculator-table .output { 
          background: #f0f0f0; padding: 4px; text-align: right; 
        }
      `;
		container.appendChild(style);
		return container;
	}

	_createTable() {
		const table = document.createElement('table');
		table.className = 'calculator-table';

		// 生成表头
		const header = `<tr>
        <th rowspan="${this.initialDiscounts.length}">配件总价</th>
        <th rowspan="${this.initialDiscounts.length}">录入的差价</th>
        <th rowspan="${this.initialDiscounts.length}">残值</th>
        <th>系统折扣</th>
        <th>协商折扣</th>
        <th>原价</th>
        <th>折扣价</th>
        <th>差价</th>
      </tr>`;

		// 生成表格内容
		let tbody = '';
		this.initialDiscounts.forEach((discount, i) => {
			tbody += `<tr>
          ${i === 0 ? `
          <td rowspan="${this.initialDiscounts.length}">
            <input type="number" id="A2" value="${this.配件总价}" step="1">
          </td>
          <td rowspan="${this.initialDiscounts.length}">
            <input type="number" id="B2" value="${this.录入的差价}" step="1">
          </td>
          <td rowspan="${this.initialDiscounts.length}">
            <input type="number" id="C2" value="${this.残值}" step="1">
          </td>` : ''}
          <td><input type="number" class="D" data-row="${i}" 
               step="0.01" value="${discount.sysDiscount}"></td>
          <td><input type="number" class="E" data-row="${i}" 
               step="0.01" value="${discount.negDiscount}"></td>
          <td class="output F"></td>
          <td class="output G"></td>
          <td class="output H"></td>
        </tr>`;
		});

		table.innerHTML = `<thead>${header}</thead><tbody>${tbody}</tbody>`;
		this.container.appendChild(table);

		// 缓存 DOM 元素
		this.inputs = {
			A2: table.querySelector('#A2'),
			B2: table.querySelector('#B2'),
			C2: table.querySelector('#C2'),
			D: [...table.querySelectorAll('.D')],
			E: [...table.querySelectorAll('.E')]
		};

		this.outputs = {
			F: [...table.querySelectorAll('.F')],
			G: [...table.querySelectorAll('.G')],
			H: [...table.querySelectorAll('.H')]
		};
	}

	_bindEvents() {
		// 扁平化输入元素并绑定事件
		[...Object.values(this.inputs).flat()].forEach(input => {
			input.addEventListener('input', () => this.updateAll());
		});
	}

	calculate(row) {
		const A = parseFloat(this.inputs.A2.value) || 0;
		const B = parseFloat(this.inputs.B2.value) || 0;
		const C = parseFloat(this.inputs.C2.value) || 0;
		const D = parseFloat(this.inputs.D[row].value) || 0;
		const E = parseFloat(this.inputs.E[row].value) || 0;

		let F = '';
		let G = '';
		let H = '';

		if (D > 0 && E > 0 && A > 0) {
			F = (A + C - B) / D;
			G = F * E;
			H = G - A - C + B;
		}

		return {
			F: F ? F.toFixed(6) : '',
			G: G ? G.toFixed(6) : '',
			H: H ? H.toFixed(6) : ''
		};
	}

	updateAll() {
		this.inputs.D.forEach((_, row) => {
			const res = this.calculate(row);
			this.outputs.F[row].textContent = res.F;
			this.outputs.G[row].textContent = res.G;
			this.outputs.H[row].textContent = res.H;
		});
	}

	getContainer() {
		return this.container;
	}
}

// 整合创建计算器悬浮框
async function createCalculator(iframe) {

	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
	const tbody_Component = await async_querySelector("#UIPrpLComponent_add_orderProduct_table", { parent: iframeDocument })
	if (!tbody_Component) return;
	let total = 0
	let 差价 = 0
	let remnant = 0   //残值
	if (tbody_Component) {
		const trs = $$("tr", tbody_Component);
		trs.forEach((tr, rowIndex) => {
			const 定损总价 = tr.cells[16];
			const price = parseFloat(定损总价.querySelector("input").value);
			total += price;
			const 配件名称 = tr.cells[1].textContent;
			// const 配件名称 = tr.querySelector('input[id^="partStandard"]').value
			if (配件名称.includes("差价")) { 差价 += price; }

			const 定损残值 = tr.querySelector('input[id$="veriRemnant"]') ? parseFloat(tr.querySelector('input[id$="veriRemnant"]').value) : 0;
			const remnantPrice = parseFloat(定损残值)
			remnant += remnantPrice;

		})
	}

	if (total === 0) { return; }

	const targetElement = iframeDocument.querySelector('#_componentFeeId div.table-responsive')


	const calculator = new PartsCalculator(total, 差价, remnant);
	const floatingWindow = new myModal({ iframe: iframe, title: '差价计算器', element: targetElement, content: calculator.getContainer(), isdblclick: false });

}

// 增加配件差价计算器结束-----------------------------------------------------




// 数据更新函数---------------------------------------



// 创建数据配置面板
function Createconfigdiv() {
	// 添加函数内变量存储Excel数据
	let excelData = null;

	const buttonStyles = {
		display: "none",
		width: "100%",
		padding: "5px",
		backgroundColor: "#007bff",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer"
	};

	const container = document.createElement("div");
	container.style.backgroundColor = "white";
	container.style.padding = "10px";
	container.style.width = "100%"; // 设置div的宽度
	container.style.boxSizing = "border-box"; // 确保padding和border包含在宽度内

	function createExcel_div() {
		const excelDiv = document.createElement("div");
		container.style.backgroundColor = "white";
		container.style.padding = "10px";
		container.style.boxSizing = "border-box"; // 确保padding和border包含在宽度内

		const input_excel = document.createElement("input");
		input_excel.type = "file";
		input_excel.id = "excelFile";
		input_excel.accept = ".csv, .xlsx, .xls";
		input_excel.style.display = "block";
		input_excel.style.width = "100%"; // 设置文件选择控件的宽度为100%

		// 新增信息展示区域
		const excel_infoDiv = document.createElement("div");
		excel_infoDiv.id = "excelInfo";
		excel_infoDiv.style.margin = "10px 0";
		excel_infoDiv.style.padding = "10px";
		excel_infoDiv.style.backgroundColor = "#f8f9fa";
		excel_infoDiv.style.borderRadius = "4px";
		excel_infoDiv.style.display = "none"; // 默认隐藏

		// 创建信息展示元素
		const fileNameEl = document.createElement("div");
		fileNameEl.style.fontSize = "14px";

		const modifyTimeEl = document.createElement("div");
		modifyTimeEl.style.fontSize = "12px";
		modifyTimeEl.style.color = "#6c757d";

		const sheetsEl = document.createElement("div");
		sheetsEl.style.fontSize = "12px";
		sheetsEl.style.color = "#28a745";

		excel_infoDiv.appendChild(fileNameEl);
		excel_infoDiv.appendChild(modifyTimeEl);
		excel_infoDiv.appendChild(sheetsEl);

		// 更新信息显示的函数
		function updateInfoDisplay() {
			if (excelData?.data) {
				fileNameEl.textContent = `文件名：${excelData.filename}`;
				modifyTimeEl.textContent = `最后修改：${new Date(
					excelData.lastModified
				).toLocaleString()}`;
				sheetsEl.textContent = `包含工作表：${Object.keys(excelData.data).join(
					", "
				)}`;
				excel_infoDiv.style.display = "block";
			} else {
				excel_infoDiv.style.display = "none";
			}
		}

		const btn_updatelocal = document.createElement("button");
		Object.assign(btn_updatelocal.style, buttonStyles);
		btn_updatelocal.textContent = "更新本地数据";

		// 修改原有的事件监听，确保数据存储到全局变量
		// 修改事件监听部分（修复核心错误）
		input_excel.addEventListener("change", function () {
			const file = input_excel.files[0]; // 关键修复：获取第一个文件
			file && readExcel(file);
		});

		btn_updatelocal.addEventListener("click", function () {
			const updatedata = handlexcelData(excelData);
			if (updatedata) {
				// 更新本地数据
				// const tempdata = updatedata[0]
				const lastModified = updatedata[1];
				const localdata = GM_getValue("合作维修厂");
				if (!localdata || localdata[1] < lastModified) {
					GM_setValue("合作维修厂", updatedata);
					GM_notification({
						text: `本地数据已更新,数据时间${lastModified}`,
						title: "数据更新",
						timeout: 3000,
					});
				} else {
					GM_notification({
						text: `未更新,修改时间需晚于本地数据时间${lastModified}`,
						title: "数据更新",
						timeout: 3000,
					});
				}
			}
		});

		// 读取Excel函数
		function readExcel(file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				try {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: "binary" });

					// 存储所有工作表数据
					const sheetsData = {};

					// 遍历所有工作表
					workbook.SheetNames.forEach((sheetName) => {
						const worksheet = workbook.Sheets[sheetName];

						// 检查是否为空表
						if (!worksheet["!ref"]) return; // 跳过空表
						const range = XLSX.utils.decode_range(worksheet["!ref"]);
						if (range.e.r - range.s.r < 1) return; // 行数小于1视为空表

						// 转换工作表数据
						sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet, {
							header: 1,
							defval: "", // 处理空单元格
						});
					});

					// 检查是否有有效数据
					if (Object.keys(sheetsData).length === 0) {
						throw new Error("工作簿中没有有效的工作表");
					}

					excelData = {
						filename: file.name,
						lastModified: new Date(file.lastModified).toISOString(),
						data: sheetsData,
					};
					console.log("读取完成", excelData);
					if (excelData) {
						btn_updatelocal.style.display = "block";
						updateInfoDisplay(); // 新增：更新信息显示
					}
				} catch (error) {
					console.error("文件解析失败:", error);
					alert(`文件解析错误: ${error.message}`);
				}
			};

			reader.onerror = function (e) {
				console.error("文件读取失败:", e.target.error);
				alert("文件读取失败，请检查文件格式");
			};

			reader.readAsBinaryString(file);
		}

		// 创建导出按钮
		const btn_Export = document.createElement("button");
		btn_Export.textContent = "导出Excel";
		btn_Export.style.cssText = btn_updatelocal.style.cssText; // 复用读取按钮样式
		btn_Export.style.backgroundColor = "#28a745"; // 使用绿色区分
		btn_Export.addEventListener("click", exportExcel);

		// 导出Excel函数
		function exportExcel() {
			if (!excelData?.data) {
				alert("请先读取有效的Excel文件");
				return;
			}

			// 创建工作簿
			const workbook = XLSX.utils.book_new();

			// 遍历所有工作表
			Object.entries(excelData.data).forEach(([sheetName, sheetData]) => {
				// 将二维数组转换为工作表
				const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

				// 添加工作表到工作簿
				XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
			});

			// 生成文件名（保留原文件名基础）
			const originalName = excelData.filename.replace(/\.[^/.]+$/, ""); // 移除原有扩展名
			const timestamp = new Date()
				.toISOString()
				.replace(/[:.]/g, "-")
				.slice(0, 19);
			const filename = `${originalName}_导出_${timestamp}.xlsx`;

			// 写入文件并下载
			XLSX.writeFile(workbook, filename);
			console.log("导出完成", {
				文件名: filename,
				包含工作表: Object.keys(excelData.data),
			});
		}

		const header = document.createElement("span");
		header.textContent = "维修厂信息Excel文件";

		excelDiv.appendChild(header);
		excelDiv.appendChild(input_excel);
		excelDiv.appendChild(btn_updatelocal);
		excelDiv.appendChild(btn_Export);
		excelDiv.appendChild(excel_infoDiv);

		return excelDiv;
	}

	function createflesh_div() {
		const flesh_div = document.createElement("div");
		container.style.backgroundColor = "white";
		container.style.padding = "10px";
		container.style.boxSizing = "border-box"; // 确保padding和border包含在宽度内

		// 在原有按钮之后添加刷新按钮
		const btn_refresh = document.createElement("button");
		Object.assign(btn_refresh.style, buttonStyles);
		btn_refresh.textContent = "刷新本地数据";
		btn_refresh.style.backgroundColor = "#ffc107"; // 使用黄色区分
		btn_refresh.style.display = "block";
		btn_refresh.addEventListener("click", refreshLocalData);

		// 创建本地数据展示区域
		const localDataInfo = document.createElement("div");
		localDataInfo.id = "localDataInfo";
		localDataInfo.style.margin = "10px 0";
		localDataInfo.style.padding = "10px";
		localDataInfo.style.backgroundColor = "#fff3cd";
		localDataInfo.style.borderRadius = "4px";

		// 创建三个数据展示框
		const dataBox1 = createDataBox("data1");
		const dataBox2 = createDataBox("data2");
		const dataBox3 = createDataBox("data3");

		localDataInfo.appendChild(dataBox1);
		localDataInfo.appendChild(dataBox2);
		localDataInfo.appendChild(dataBox3);

		flesh_div.appendChild(btn_refresh);
		flesh_div.appendChild(localDataInfo);

		// 辅助函数：创建统一样式的数据框
		function createDataBox(id) {
			const box = document.createElement("div");
			box.id = id;
			box.style.padding = "8px";
			box.style.margin = "5px 0";
			box.style.backgroundColor = "white";
			box.style.border = "1px solid #ffeeba";
			box.textContent = "待加载数据..."; // 初始占位文本
			return box;
		}

		// 刷新本地数据函数
		function refreshLocalData() {
			const localData = GM_getValue("合作维修厂");
			initialize();
			if (localData) {
				dataBox1.textContent = `总记录数: ${Object.keys(合作维修厂).length || 0
					}`;
				dataBox2.textContent = `最新时间: ${localData[1] || "未知"}`;
				dataBox3.textContent = `风险配件数: ${Object.keys(配件编码风险).length
					}`;
			} else {
				dataBox1.textContent = "总记录数: 0";
				dataBox2.textContent = "最新时间: 无数据";
				dataBox3.textContent = "数据状态: 未初始化";
			}
		}

		return flesh_div;
	}

	//新增CSV配件风险数据的操作````````````````````````````
	function createCSV_div() {
		// 创建一个div_csv容器
		const div_csv = document.createElement("div");
		//   div_csv.style.backgroundColor = "white";
		div_csv.style.padding = "10px";
		div_csv.style.width = "100%"; // 设置div的宽度
		div_csv.style.boxSizing = "border-box"; // 确保padding和border包含在宽度内

		// 创建文件选择控件
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".csv";
		fileInput.style.display = "block";
		fileInput.style.width = "100%"; // 设置文件选择控件的宽度为100%
		fileInput.style.marginBottom = "10px";

		// 创建读取按钮
		const btn_readcsv = document.createElement("button");
		Object.assign(btn_readcsv.style, buttonStyles);
		btn_readcsv.textContent = "读取CSV";
		btn_readcsv.style.display = "block";

		// 创建导出按钮
		const btn_exportcsv = document.createElement("button");
		Object.assign(btn_exportcsv.style, buttonStyles);
		btn_exportcsv.textContent = "导出CSV";
		btn_exportcsv.style.display = "block";



		/**
	 * 读取并解析CSV文件，过滤空行和空白字段，保存处理后的数据
	 * 
	 * 功能描述：
	 * 1. 使用FileReader读取CSV文件内容
	 * 2. 执行两次过滤：首次过滤全空行，二次过滤兼容不同换行符的残留空行
	 * 3. 分离标题行和数据行，仅保留有效数据行
	 * 4. 使用GM_setValue存储处理后的数据，并发送通知
	 * 
	 * @param {File} file - 要读取的CSV文件对象
	 */
		function readCSV(file) {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function (event) {
				try {
					const csvData = event.target.result;

					/* 核心解析流程：分割行->拆解列->过滤全空行 */
					const rows = csvData.split("\n")
						.map(row => row.split(","))
						.filter(row => !row.every(field => isBlankField(field)));

					/* 结构分离：解构获取标题行和后续数据行 */
					const [headers, ...dataRows] = rows;

					/* 二次过滤：排除单列行和残留空行（处理\r\n换行符情况） */
					const filteredData = dataRows.filter(row =>
						row.length > 1 && !row.every(field => isBlankField(field))
					);

					/* 检查合并数据 */
					const mergeData = mergeCSVData(filteredData)

					/* 持久化存储与用户反馈 */
					GM_setValue("CSV_配件编码", mergeData);
					console.log("CSV数据已处理保存：", mergeData);
					GM_notification("数据处理完成", `有效记录：${mergeData.length}条`);

				} catch (error) {
					console.error("处理失败：", error);
					GM_notification("处理失败", error.message);
				}
			};

			/* 判断字段是否为空：包含空白字符/换行符的视为空 */
			function isBlankField(field) {
				return !field || field.replace(/[\r\n\s]/g, "").trim() === "";
			}

			/* 字段清洗：移除特定符号和空白字符 */
			function cleanField2(field) {
				return (field || "").replace(/[-\/\\\s]/g, "").trim();
			}
			function cleanField(field) {
				if (!field) return "";
				return String(field).replace(/[-\/\\\s\r\n,;.]/g, "").trim();
			}

			/* 安全数值转换：解析失败时返回0 */
			function parseNumber(value) {
				const num = parseInt(value, 10);
				return isNaN(num) ? 0 : num;
			}

			/**
		 * 合并本地存储数据与新解析数据，返回合并后的本地数据
		 * 
		 * 合并逻辑：
		 * 1. 使用配件编码（第3列）作为唯一标识
		 * 2. 对比新旧数据的以下关键列：
		 *    - 第3列（索引2）：配件编码
		 *    - 第11列（索引10）：报价
		 *    - 第14列（索引13）：风险规则
		 *    - 第15列（索引14）：备注信息
		 * 
		 * @param {Array} filteredData - 新解析的CSV数据
		 * @returns {Array} 合并后的本地数据
		 */
			function mergeCSVData2(filteredData) {
				// 获取本地数据并建立编码映射
				const localData = GM_getValue("CSV_配件编码");
				const localMap = new Map(localData.map(row => [cleanField(row[2]), row]));

				// 差异项收集器
				const changes = [];

				filteredData.forEach(newRow => {
					const key = cleanField(newRow[2]);
					const oldRow = localMap.get(key);

					// 新增记录直接标记
					if (!oldRow) {
						changes.push(newRow);
						return;
					}

					// 关键列对比（使用安全取值）
					const criticalFields = [
						[2, 10],   // 编码和报价列
						[13, 14]   // 风险规则和备注信息列
					].some(([col1, col2]) =>
						(newRow[col1] || '').trim() !== (oldRow[col1] || '').trim() ||
						(newRow[col2] || '').trim() !== (oldRow[col2] || '').trim()
					);

					if (criticalFields) {
						changes.push({ ...oldRow, ...newRow }); // 保留旧数据其他字段
					}
				});
				GM_notification("新增数据", `${changes.length}条`);
				console.log("新增数据:", changes);
				return [...localData, ...changes];
			}


			function mergeCSVData(filteredData) {
				// 获取本地数据并建立编码映射
				const localData = GM_getValue("CSV_配件编码") || [];

				// 如果本地没有数据，直接返回新数据
				if (!localData || localData.length === 0) {
					GM_notification("新增数据", `${filteredData.length}条`);
					console.log("新增数据:", filteredData);
					return filteredData;
				}

				const localMap = new Map();
				// 使用配件编码作为键建立映射
				localData.forEach(row => {
					const key = cleanField(row[2]);
					if (key) localMap.set(key, row);
				});

				// 差异项收集器
				const changes = [];
				const updatedData = [...localData]; // 创建本地数据副本

				filteredData.forEach(newRow => {
					const key = cleanField(newRow[2]);
					if (!key) return; // 跳过无效编码

					const oldRow = localMap.get(key);

					// 新增记录直接添加
					if (!oldRow) {
						changes.push(newRow);
						updatedData.push(newRow);
						return;
					}

					// 关键列对比（使用安全取值）
					const hasChanges = [
						[2, 10],   // 编码和报价列
						[13, 14]   // 风险规则和备注信息列
					].some(([col1, col2]) => {
						const oldVal1 = (oldRow[col1] || '').toString().trim();
						const newVal1 = (newRow[col1] || '').toString().trim();
						const oldVal2 = (oldRow[col2] || '').toString().trim();
						const newVal2 = (newRow[col2] || '').toString().trim();

						return oldVal1 !== newVal1 || oldVal2 !== newVal2;
					});

					if (hasChanges) {
						// 创建更新后的行（保持数组结构）
						const updatedRow = [...oldRow];
						// 只更新关键字段
						[2, 10, 13, 14].forEach(idx => {
							if (newRow[idx] !== undefined) {
								updatedRow[idx] = newRow[idx];
							}
						});

						changes.push(updatedRow);

						// 更新本地数据中对应的行
						const index = updatedData.findIndex(row => cleanField(row[2]) === key);
						if (index !== -1) {
							updatedData[index] = updatedRow;
						}
					}
				});

				if (changes.length > 0) {
					GM_notification("更新数据", `${changes.length}条`);
					console.log("更新数据:", changes);
				} else {
					GM_notification("数据检查", "没有新增或更新的数据");
				}

				// 返回更新后的完整数据集
				return updatedData;
			}

		}

		// 为读取按钮添加点击事件
		btn_readcsv.addEventListener("click", function () {
			const file = fileInput.files[0];
			if (file) {
				readCSV(file);
			} else {
				alert("请先选择一个CSV文件");
			}
		});

		function export2CSV(array, filename) {
			function downloadCSV(array, filename = "配件编码.csv") {
				let csvContent = "\uFEFF"; // 添加 BOM

				array.forEach(function (rowArray) {
					let row = rowArray.join(",");
					csvContent += row.replace("\n\n", "") + "\n";
				});

				const blob = new Blob([csvContent], {
					type: "text/csv;charset=utf-8;",
				});
				const link = document.createElement("a");
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				document.body.appendChild(link); // Required for FF

				link.click();
				document.body.removeChild(link);
			}

			const headers = [
				"序号",
				"零件名称",
				"零件编码",
				"车辆型号",
				"车架号",
				"案件号",
				"车牌",
				"事故号",
				"节点号",
				"待定项",
				"本地报价",
				"配件品质",
				"系统参考价",
				"风险规则",
				"备注信息",
			];
			array.unshift(headers);
			downloadCSV(array, filename);
		}

		// 为导出按钮添加点击事件
		btn_exportcsv.addEventListener("click", function () {
			const array = GM_getValue("CSV_配件编码");
			// 获取当前时间并格式化
			const now = new Date();
			const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1)
				.toString()
				.padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
					.getHours()
					.toString()
					.padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
						.getSeconds()
						.toString()
						.padStart(2, "0")}`;

			const filename = `配件编码${formattedDate}.csv`;
			export2CSV(array, filename);
		});

		const header = document.createElement("span");
		header.textContent = "配件代码风险(CSV文件)";

		// 将文件选择控件和读取按钮添加到div中
		div_csv.appendChild(header);
		div_csv.appendChild(fileInput);
		div_csv.appendChild(btn_readcsv);
		div_csv.appendChild(btn_exportcsv);

		return div_csv;
	}

	container.appendChild(createExcel_div());

	container.appendChild(createCSV_div());

	container.appendChild(createflesh_div());

	//```````````````````````````````````````````````

	return container;
}


// 处理修理厂等级数据,传入data是修理厂信息列表sheet的数据;输出是一个字典,键是修理厂名称,值是一个list,[等级,是否4S店,厂方指导价平均折扣系数,品牌件价平均折扣系数]
function handlexcelData(excelData) {
	const data = excelData.data['修理厂信息列表'];
	if (!data) {
		alert('未找到修理厂信息列表');
		return;
	}
	// 处理数据
	if (data[0].includes('修理厂信息列表')) { data.shift(); }

	const header = data[0];
	// 把header里面的元素转化为其对应的序号
	const idx = {};
	header.forEach((item, index) => { idx[item] = index; });
	//从data的第二行开始遍历所有数据
	const lvdict = {}
	// const lvlist = [] // 用于存储等级,子元素分别是[是否4S店,等级,厂方指导价平均折扣系数,品牌件价平均折扣系数]
	for (let i = 1; i < data.length; i++) {
		let level
		const row = data[i];
		// 通过header的序号找到对应的数据
		const 修理厂名称 = row[idx['修理厂名称']];
		const 是否4S店 = parseInt(row[idx['是否4S店']]);
		const 厂方指导价平均折扣系数 = parseInt(row[idx['厂方指导价平均折扣系数']]) ? parseInt(row[idx['厂方指导价平均折扣系数']]) : 0;
		const 品牌件价平均折扣系数 = parseInt(row[idx['品牌件价平均折扣系数']]) ? parseInt(row[idx['品牌件价平均折扣系数']]) : 0;
		if (是否4S店) {
			level = 厂方指导价平均折扣系数
		}
		else {
			if (厂方指导价平均折扣系数 >= 70) { level = 6 }
			else if (厂方指导价平均折扣系数 >= 65) { level = 5 }
			else if (厂方指导价平均折扣系数 >= 60) { level = 4 }
			else if (厂方指导价平均折扣系数 >= 55) { level = 3 }
			else if (品牌件价平均折扣系数 >= 120) { level = 2 }
			else if (品牌件价平均折扣系数 >= 110) { level = 1 }
			else { level = 0 }
		}
		lvdict[修理厂名称] = [level, 是否4S店, 厂方指导价平均折扣系数, 品牌件价平均折扣系数]
		// lvdict[修理厂名称]={"等级":level,"厂方指导价平均折扣系数":厂方指导价平均折扣系数,"品牌件价平均折扣系数":品牌件价平均折扣系数}
	}

	return [lvdict, excelData.lastModified]
}


//车辆损失信息表格
async function createCarLossInfoTable(iframe) {
	const tableId = 'GMcarlossinfo';
	const targetId = '#lossDetInfo';

	const carInfo = Common.iframe_CarLoss_getCarinfo(iframe);



	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	if (iframeDoc.getElementById(tableId)) return;

	try {
		const targetElement = await async_querySelector(targetId, { parent: iframeDoc });
		if (!targetElement) return;

		// 创建表格
		const table = iframeDoc.createElement('table');
		table.id = tableId;
		table.className = 'carloss-table'; // 添加类名
		table.style.cssText = `
            margin: 12px 0;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 13px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            width: 100%; /* 关键：auto宽度自适应 ,100%宽度最大*/
        `;


		// 样式表（避免重复注入）
		if (!iframeDoc.querySelector('#carloss-style')) {
			const style = iframeDoc.createElement('style');
			style.id = 'carloss-style';
			style.textContent = `
                .carloss-table td {
                    padding: 8px 12px;
                    /* border: 1px solid #e0e0e0;*/ /* 添加边框就取消注释 */
                    border: 1px solid #e0e0e0;
                    white-space: nowrap; /* 防止换行 */
                }
                .carloss-table .label {
                    background: rgb(221, 243, 255);
                    font-weight: 500;
                    color: #666;
                }
                .carloss-table .value {
                    color: #333;
                    min-width: 80px; /* 最小宽度保证可读性 */
                }
                .carloss-table .highlight {
                    color: #c00;
                    font-weight: bold;
                }
            `;
			iframeDoc.head.appendChild(style);
		}

		// 表格构建函数
		const createRow = (items) => {
			const tr = iframeDoc.createElement('tr');
			items.forEach(({ label, value, isHighlight }) => {
				const tdLabel = iframeDoc.createElement('td');
				tdLabel.className = 'label';
				tdLabel.textContent = label;

				const tdValue = iframeDoc.createElement('td');
				tdValue.className = `value ${isHighlight ? 'highlight' : ''}`;
				tdValue.textContent = value || '-';

				tr.appendChild(tdLabel);
				tr.appendChild(tdValue);
			});
			return tr;
		};

		// 构建内容

		table.appendChild(createRow([
			{ label: '报案号', value: carInfo.get("报案号") },
			{ label: '理赔险别', value: carInfo.get("理赔险别") },
			{ label: '定损方式', value: carInfo.get("定损方式") },
			// { label: '是否水淹车', value: carInfo.get("是否水淹车") },
		]));


		table.appendChild(createRow([
			{ label: carInfo.get("损失方"), value: carInfo.get("车牌号") },
			{ label: '车主', value: carInfo.get("车主") },

		]));



		// 修改后的代码：
		const vinYear = parseInt(carInfo.get("车架年份"));
		const registerDate = carInfo.get("初登日期");
		const registerYear = new Date(registerDate).getFullYear();
		const dateDisplay = Math.abs(vinYear - registerYear) > 1 ? `${registerDate} (初登日期错误,请核实,车架号年份${vinYear})` : registerDate;

		if (Math.abs(vinYear - registerYear) > 1) {
			// toastr.warn('车架年份与初登日期不一致,，请检查！');
			GM_notification({
				text: `车架年份与初登日期不一致，请检查！`,
				title: '车架年份与初登日期不一致',
				timeout: 3000,
			});
		}

		table.appendChild(createRow([
			{ label: '车架号', value: `${carInfo.get("车架号")} (${carInfo.get("车架年份")})` },
			// { label: '初登日期', value: carInfo.get("初登日期") },
			{ label: '初登日期', value: dateDisplay },
			{ label: '实际价值', value: carInfo.get("实际价值") },
		]));

		table.appendChild(createRow([
			{ label: '车型名称', value: carInfo.get("车型名称") },
			{ label: '车辆品牌', value: carInfo.get("车辆品牌") },
		]));

		// 添加修理厂信息
		const infos = createRow([
			{ label: `${carInfo.get("是否合作")}${carInfo.get("维修厂类型")}`, value: `${carInfo.get("修理厂名称")} ${carInfo.get("合作等级")}` },
		])
		table.appendChild(infos);



		// 插入表格
		targetElement.insertBefore(table, targetElement.firstChild);

		/*********************​ 新增调用 ​*********************/
		// 创建计算器（必须在表格创建后执行）
		createCalculator(iframe);  // <--- 关键调用点
		/****************************************************/


		/*********************​ 新增调用 ​*********************/
		// 创建查勘信息显示框
		const container = createCheckinfoDiv(carInfo.get("报案号"), iframe)
		//把container插入到table的后面
		targetElement.insertBefore(container, targetElement.firstChild);

		/****************************************************/


	} catch (error) {
		console.error('表格创建失败:', error);
	}
}



//创建查勘信息表格
function createCheckinfoDiv(registNo, iframe) {
	const containerId = 'GMCheckinfo';
	const targetId = '#lossDetInfo';

	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	if (iframeDoc.getElementById(containerId)) {
		iframeDoc.getElementById(containerId).remove();
	}

	// 创建容器元素
	const container = iframeDoc.createElement('div');
	container.id = `${containerId}`;
	container.style.cssText = `
        background: white;
        border: 1px solid #ddd;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 10px;
        width: auto;          // 宽度自适应内容
        max-width: 90vw;      // 最大不超过屏幕宽度的90%
        font-size: 12px;
        // box-sizing: border-box; // 包含内边距
        // margin: 0 auto;       // 水平居中（可选）
        overflow-x: hidden;   // 防止内容溢出（可选）
    `;

	// 创建加载提示行（包含标题和 loading）
	const loadingLine = iframeDoc.createElement('div');
	loadingLine.style.display = 'flex';
	loadingLine.style.alignItems = 'center';
	loadingLine.style.gap = '5px';

	// 添加标题
	const title = iframeDoc.createElement('span');
	title.textContent = '查勘信息:';
	title.style.fontWeight = 'bold';

	// 添加 loading 文本
	const loading = iframeDoc.createElement('span');
	loading.textContent = '正在加载查勘信息...';
	loading.style.whiteSpace = 'nowrap';  // 强制不换行

	loadingLine.appendChild(title);
	loadingLine.appendChild(loading);
	container.appendChild(loadingLine);

	// 轮询检测数据
	const startTime = Date.now();
	const checkInterval = setInterval(() => {
		if (Date.now() - startTime > 30000) {
			clearInterval(checkInterval);
			loading.textContent = '数据加载超时';
			return;
		}

		const caseData = Cases[registNo];
		if (caseData && caseData.RegistInfo) {
			clearInterval(checkInterval);
			container.removeChild(loadingLine);  // 移除整个加载行

			try {
				const [riskmsg, isrisk] = Common.handle_risks(caseData);
				console.log("Cases", Cases)
				const table = iframeDoc.createElement('table');
				table.style.borderCollapse = 'collapse';
				table.style.width = '100%';

				// 添加表格标题
				const headerRow = table.insertRow();
				const headerCell = headerRow.insertCell();
				headerCell.textContent = '风险信息';
				headerCell.style.cssText = `
                    padding: 8px;
                    border: 1px solid #ddd;
                    background: rgb(221, 243, 255);
                    font-weight: bold;
                `;

				headerRow.style.cursor = 'pointer';
				headerRow.addEventListener('click', () => {
					Modules.GMopenJsWin(`/claim/certificateController.do?goImageQuery&imageBusiNo=${caseData.RegistInfo.accidentNo}`, jsWinId = 'certifyQueryId')
				})

				// 添加数据行
				const dataRow = table.insertRow();
				const dataCell = dataRow.insertCell();
				dataCell.innerHTML = riskmsg;
				dataCell.style.cssText = `
                    padding: 8px;
                    border: 1px solid #ddd;
                    background: ${isrisk ? 'rgba(255,165,0,0.2)' : 'white'};
                `;

				container.appendChild(table);

			} catch (e) {
				container.innerHTML = `信息解析失败: ${e.message}`;
			}
		}
	}, 500);

	return container;
}



// 异步查询选择器
function async_querySelector(selector, {
	timeout = 15000,
	parent = document
} = {}) {
	return new Promise((resolve, reject) => {
		// 立即检查元素是否存在
		const element = parent.querySelector(selector);
		if (element) {
			return resolve(element);
		}

		// 配置 MutationObserver
		const observer = new MutationObserver((mutations, obs) => {
			const foundElement = parent.querySelector(selector);
			if (foundElement) {
				cleanup();
				resolve(foundElement);
			}
		});

		// 超时处理
		const timeoutId = setTimeout(() => {
			cleanup();
			//取消下面这段,不会出现错误提示
			// reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
			console.error(`async_querySelector :在${timeout}ms内未找到元素 ${selector}`)
		}, timeout);

		// 清理函数
		const cleanup = () => {
			observer.disconnect();
			clearTimeout(timeoutId);
		};

		// 开始观察 DOM 变化
		observer.observe(parent, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});

		// 再次检查防止竞争条件
		const immediateCheck = parent.querySelector(selector);
		if (immediateCheck) {
			cleanup();
			resolve(immediateCheck);
		}
	});
}


//```````````````````测试`````````````

// 新增案件筛选
function filter_BTN(iframe) {
	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;


	// 创建小图标
	const minimizeIcon = document.createElement('div');
	minimizeIcon.style.position = 'fixed';
	minimizeIcon.style.bottom = '100px';
	minimizeIcon.style.right = '1px';
	minimizeIcon.style.fontSize = '18px';
	minimizeIcon.style.width = '25px';
	minimizeIcon.style.height = '25px';
	minimizeIcon.style.backgroundColor = '#007bff';
	minimizeIcon.style.borderRadius = '50%';
	minimizeIcon.style.cursor = 'pointer';
	minimizeIcon.style.display = 'flex'; // 初始状态显示
	minimizeIcon.style.alignItems = 'center';
	minimizeIcon.style.justifyContent = 'center';
	minimizeIcon.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
	minimizeIcon.style.color = 'white';
	// minimizeIcon.innerHTML = (iframe.name && iframe_names_car.some(str => iframe.name.includes(str))) ? '🚗' : '🌏'; // 使用一个图标表示
	minimizeIcon.innerHTML = '🔍'

	iframeDocument.body.appendChild(minimizeIcon);

	// 点击按钮展开对应动作
	minimizeIcon.addEventListener("click", function () {
		filter(iframeDocument)

	});

	function filter(iframeDocument = iframeDocument) {
		// 按字符长度降序排序（避免短关键词优先匹配）
		const sortedAreas = [...myconfig.areas].sort((a, b) => b.length - a.length);
		const target_iframe = iframeDocument.querySelector('iframe[src*="preTaskTodo"]')
		if (!target_iframe) return
		const comCNames = target_iframe.contentDocument.querySelectorAll('#receiveTaskListDIV td[field="comCName"]');
		if (!comCNames) return
		let i = 0
		comCNames.forEach(comCName => {
			// 遍历所有后代元素（包括自身）
			const elements = $$('*', comCName);

			elements.forEach(el => {
				sortedAreas.forEach(area => {
					// 使用正则表达式全局替换
					const regex = new RegExp(area, 'g');
					if (regex.test(el.innerHTML)) {
						const tr = el.closest('tr');
						if (tr) {
							// tr.style.fontWeight = 'bold';
							tr.style.backgroundColor = 'yellow';
							i++
						}
					}
				});
			});

		});

		if (i > 0) {
			toastr.info(i + '个案件')
			// console.log('筛选到',i,'条数据')
		}
		else {
			toastr.success('未筛选到数据')

		}

		// 绑定到iframe文档
		target_iframe.contentDocument.addEventListener('keydown', handleKeyPress);

		// 清理时移除监听
		target_iframe.contentDocument.addEventListener('unload', () => {
			target_iframe.contentDocument.removeEventListener('keydown', handleKeyPress);
			minimizeIcon.style.backgroundColor = 'white';

		});

	}


	// 添加键盘监听
	function handleKeyPress(e) {
		// 检测左Alt + F 组合键
		if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'q') {
			e.preventDefault();
			filter(iframeDocument)
		}
	}

	// 绑定到iframe文档
	iframeDocument.addEventListener('keydown', handleKeyPress);

	// 清理时移除监听
	iframeDocument.addEventListener('unload', () => {
		iframeDocument.removeEventListener('keydown', handleKeyPress);
	});


}



class Modules {
	//自动点击[确认]按钮,点击后关闭窗口,适用于升级后的原版系统
	static startAutoClick(interval = 1000) {
		const keywords = [
			"已提交",
			"金额汇总成功",
			"智能核赔规则信息的核损结论必录",
			"工作流提交成功",
		];
		const clickHandler = () => {
			const button = document.querySelector("input.ui_state_highlight");
			if (button) {
				const ui_content = button
					.closest("tbody")
					.querySelector(".ui_main .ui_content")
					.textContent.trim();
				// if (!keywords.some((keyword) => ui_content.includes(keyword))) {
				setTimeout(() => {
					button.click();
					console.debug("元素已自动点击");
				}, 3000);
				// }
			}
		};
		clickHandler(); // 立即执行第一次检查
		return setInterval(clickHandler, interval);
	}

	//  检查KTM
	static checkKTM(iframe) {
		const iframeDocument = iframe.contentDocument;
		const moddata = {
			// 正在处理的节点
			"bpmPage.nodeType": "ForkSubProcessNode",
			"bpmPage.taskStatus": "1",
			"bpmPage.status": "0",
			"bpmPage.userCode": "", //8000682376
			"bpmPage.userName": "", //郑锦明
			"bpmPage.comCName": "", //广东分公司车物理赔室
			"bpmPage.comLevel": "", //4
			"bpmPage.comCode": "", //44010020
			"bpmPage.inbox": "", //8000682376
			"prpLcarLossApprovalPage.verifyCode": "", //8000682376
			"prpLcarLossApprovalPage.verifyName": "", //郑锦明
			"remarkTextPageList_[#index#].operatorName": "", //郑锦明
			"remarkTextPageList_[#index#].operatorCode": "", //8000682376
			"bpmPage.editType": "ADD",
			"bpmPage.businessStatus": "0",
			"bpmPage.from": "",
			"bpmPage.endTime": "",
			"bpmPage.newInquiryFlag": "",
		};

		function getFormData(formId = "approvllossMainForm") {
			const iframeDOC = iframe.contentDocument;
			const form = iframeDOC.querySelector(
				"#approvllossMainForm,#preApprovalMainForm"
			);
			if (!form) return null;

			return Array.from(new FormData(form)).reduce((obj, [key, value]) => {
				obj[key] = value;
				return obj;
			}, {});
		}

		function sendFormPostRequest(data, moddata = {}, customHeaders = {}) {
			const defaultHeaders = {
				accept: "text/plain, */*; q=0.01",
				"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
				"content-type": "application/x-www-form-urlencoded;charset=UTF-8",
				"sec-ch-ua":
					'"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-requested-with": "XMLHttpRequest",
				...customHeaders,
			};
			const url = "/claim/kaiTaiMingController.do?connectToKaiTaiMing";
			data = { ...data, ...moddata };
			const body = new URLSearchParams(data).toString();
			const options = {
				method: "POST",
				headers: defaultHeaders,
				body: body,
				credentials: "include",
				mode: "cors",
			};

			return fetch(url, options)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Network response was not ok: ${response.status}`);
					}
					return response.json().catch(() => response.text()); // 尝试 JSON 解析，失败则返回文本
				})
				.catch((error) => {
					console.error("Fetch error:", error);
					throw error;
				});
		}

		// 创建缩小图标
		const KtmIcom = document.createElement("div");
		KtmIcom.style.position = "fixed";
		KtmIcom.style.bottom = "100px";
		KtmIcom.style.right = "3px";
		KtmIcom.style.width = "20px";
		KtmIcom.style.height = "20px";
		KtmIcom.style.backgroundColor = "#007bff";
		KtmIcom.style.borderRadius = "50%";
		KtmIcom.style.cursor = "pointer";
		KtmIcom.style.display = "flex"; // 初始状态显示
		KtmIcom.style.alignItems = "center";
		KtmIcom.style.justifyContent = "center";
		KtmIcom.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";
		KtmIcom.style.color = "white";
		KtmIcom.innerHTML = "📋"; // 使用一个图标表示

		// 将悬浮窗和缩小图标添加到 iframe 的 body
		iframeDocument.body.appendChild(KtmIcom);

		KtmIcom.addEventListener("click", () => {
			let data = getFormData();
			data = { ...data, ...moddata };
			console.table(data);
			KtmIcom.disabled = true;
			KtmIcom.style.backgroundColor = "rgba(196, 196, 196, 0.8)";
			sendFormPostRequest(data, moddata)
				.then((response) => {
					if (response.success == true) {
						KtmIcom.style.backgroundColor = "rgba(243, 7, 7, 0.84)";
						alert("触发规则");
						// 这里调用了页面原有的函数getKtmCecheckResult()
						// getKtmCecheckResult()
					} else {
						KtmIcom.style.backgroundColor = "rgba(35, 243, 7, 0.5)";
					}
				})
				.catch((error) => {
					console.error("请求失败:", error);
				})
				.finally(() => {
					KtmIcom.disabled = false;
				});
		});
	}

	//  添加任务改派功能
	static addTransferdiv(iframe) {
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow?.document || document;

		const element_navbar = iframeDocument.querySelector("#navbar ul");
		if (element_navbar) {
			const element_li = iframeDocument.createElement("li");
			const element_a = iframeDocument.createElement("a");
			element_a.href = "#";
			element_a.textContent = "任务改派";
			element_li.appendChild(element_a);

			const element_div = iframeDocument.createElement("div");
			// 设置外层div的尺寸
			element_div.style.width = "80vw"; // 视窗宽度的80%
			element_div.style.height = "80vh"; // 视窗高度的80%

			const element_iframe = iframeDocument.createElement("iframe");
			// 修正iframe的样式
			element_iframe.style.width = "100%"; // 修正width的大写W
			element_iframe.style.height = "100%";
			element_iframe.style.border = "none";
			element_iframe.src =
				"/claim/transferController.do?goTransfer&isIframe&clickFunctionId=74";

			element_div.appendChild(element_iframe);

			const Modal = new myModal({
				iframe: iframe,
				title: "任务改派",
				element: element_li,
				content: element_div,
				isdblclick: false,
			});

			element_navbar.appendChild(element_li);
		}
	}

	// 批量把案件号转化为事故号
	static div_registNo2accidentNo() {
		// 创建容器
		const container = document.createElement("div");
		container.style.display = "flex";
		container.style.gap = "10px";
		container.style.alignItems = "center";

		// 创建文本框
		const createTextarea = () => {
			const ta = document.createElement("textarea");
			ta.rows = 10;
			ta.cols = 40;
			ta.style.fontFamily = "monospace";
			return ta;
		};

		const inputArea = createTextarea();
		inputArea.placeholder =
			"输入内容（每行一条）\n示例：RDFA720250000000893899";

		const outputArea = createTextarea();
		outputArea.readOnly = true;
		outputArea.placeholder = "符合规则的结果";

		// 验证正则表达式
		const RD_REGEX = /^RD[A-Z]{2}[78]\d{4}0{5,}\d+$/;
		const FIXED_LENGTH = 22; // 固定长度20字符

		// 创建转换按钮
		const convertBtn = document.createElement("button");
		convertBtn.innerHTML = "转换 →";
		convertBtn.style.cssText = `
        padding: 8px 16px;
        background: #409eff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
    `;

		// 转换逻辑
		convertBtn.addEventListener("click", () => {
			// 清空输出框
			outputArea.value = "";

			const validLines = inputArea.value
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => {
					// 双重验证：正则匹配 + 固定长度
					return line.length === FIXED_LENGTH && RD_REGEX.test(line);
				});

			// 添加有效结果
			if (validLines.length > 0) {
				outputArea.value = validLines.join("\n");
				outputArea.scrollTop = outputArea.scrollHeight;
			} else {
				outputArea.value = "⚠️ 未找到符合规则的条目";
			}
		});

		// 新增元素
		const resultArea = createTextarea();
		resultArea.placeholder = "转换结果:案件号 事故号 车牌 被保险人 出险时间";
		resultArea.style.width = "300px";

		// 新增查询按钮
		const queryBtn = document.createElement("button");
		queryBtn.innerHTML = "批量查询 ▼";
		queryBtn.style.cssText = convertBtn.style.cssText;
		queryBtn.style.background = "#67c23a";

		// 并发控制配置
		const MAX_CONCURRENT = 5; // 最大并发数
		let isQuerying = false;
		let abortController = new AbortController();

		// 查询逻辑
		queryBtn.addEventListener("click", async () => {
			if (isQuerying) {
				abortController.abort();
				queryBtn.innerHTML = "批量查询 ▼";
				isQuerying = false;
				return;
			}

			const registNos = outputArea.value.split("\n").filter(Boolean);
			if (registNos.length === 0) return;

			isQuerying = true;
			queryBtn.innerHTML = "停止查询 ✖";
			resultArea.value = "开始查询...\n";
			abortController = new AbortController();

			try {
				const results = [];
				const queue = [...registNos];

				// 使用Promise.all进行并发控制
				while (queue.length > 0) {
					const batch = queue.splice(0, MAX_CONCURRENT);
					await Promise.all(
						batch.map(async (registNo, index) => {
							try {
								const result = await Common.queryWorkflow(registNo);
								results.push({ registNo, data: result });

								// 格式化输出逻辑
								const firstRow = result.rows?.[0] || {};
								const outputFields = [
									"registNo",
									"accidentNo",
									"licenseNo",
									"insuredName",
									"datamgetDateStr",
								];
								const outputLine = outputFields
									.map((f) => firstRow[f] || "N/A")
									.join(" ");

								// 实时更新进度
								// resultArea.value += `[成功] ${registNo}\n${outputLine}\n\n`;
								resultArea.value += `${outputLine}\n`;
								resultArea.scrollTop = resultArea.scrollHeight;
							} catch (error) {
								results.push({ registNo, error: error.message });
								resultArea.value += `[失败] ${registNo}\n原因：${error.message}\n\n`;
							}
						})
					);
				}

				resultArea.value += `全部完成！成功：${results.filter((r) => !r.error).length
					} 失败：${results.filter((r) => r.error).length}`;
			} catch (error) {
				if (error.name !== "AbortError") {
					resultArea.value += `\n查询异常：${error.message}`;
				}
			} finally {
				isQuerying = false;
				queryBtn.innerHTML = "批量查询 ▼";
			}
		});

		// 组装元素
		container.appendChild(inputArea);
		container.appendChild(convertBtn);
		container.appendChild(outputArea);
		container.appendChild(queryBtn);
		container.appendChild(resultArea);

		return container;
	}

	//  自动点击智能审核按键并把对应审核表格移动到核损页面
	static async autuclick_intelligentUnwrt(iframe) {
		const iframeDocument =iframe.contentDocument || iframe.contentWindow.document;
		//智能审核标识
		const tag_智能审核表格 = "#intelligentUnwrtRuleInfo";
		const tag_需插入兄弟元素 = "#_componentFeeId";
		try {
			const ce = await async_querySelector(tag_智能审核表格, {
				parent: iframeDocument,
				timeout: 30000,
			});
			// console.debug("找到智能审核按钮", ce);
			// const pe=iframeDocument.querySelector("#lossDetInfo,#lossProp_info,#undwrt_div")
			// const pe = await async_querySelector("#lossDetInfo,#lossProp_info,#approvalInfo",
			const pe = await async_querySelector("#insurfeeReadonly_0,#lossProp_info,#approvalInfo",
				{ parent: iframeDocument }
			);
			// const pe = await async_querySelector("#_componentFeeId,#lossProp_info,#approvalInfo", { parent: iframeDocument })

			if (ce) {
				pe.insertBefore(ce, pe.firstChild);
				const c1 = iframeDocument.querySelector('a[href="#intelligentUnwrtRuleInfo"]');
				const c2 = iframeDocument.querySelector(
					'a[href="#carLossApproval_div"],a[href="#propLossApproval"],a[href="#undwrtnfo"]');
				if (c1) c1.click();
				if (c2) c2.click();
			}
		} catch (e) {
			console.error("智能审核按钮加载失败", e);
		}
	}

	/**
	 * 封装图片链接转换功能
	 * @param {HTMLIFrameElement} iframe - 目标iframe
	 */
	static async handleImageLink(iframe) {
		try {
			const iframeDocument =iframe.contentDocument || iframe.contentWindow.document;
			const targetLink = await async_querySelector(
				'a[href^="javascript:openJsWin("][href$="\'certifyQueryId\')"]',
				{ parent: iframeDocument }
			);

			if (!targetLink) return;

			const originalHref = targetLink.href;
			const regex = /imageBusiNo=([^%']+)/;
			const match = originalHref.match(regex);
			const imageBusiNo = match?.[1];

			if (imageBusiNo) {
				const newHref = `/claim/certificateController.do?goImageQuery&imageBusiNo=${imageBusiNo}`;
				const newLink = document.createElement("a");
				newLink.textContent = "图片链接";
				newLink.href = "#";

				newLink.addEventListener("click", (e) => {
					e.preventDefault();
					Modules.GMopenJsWin(newHref);
				});

				targetLink.parentNode.appendChild(newLink);
				targetLink.remove();
			}


			//创建保单投标情况链接,包括投保时间,转续保情况等等
			const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
			//先请求一个访问权限的链接
			const authurl=`/claim/registController.do?goPolicyInfo&registNo=${bpmitems.registNo}&policyNo=${bpmitems.polocyNo}`
			// console.log('准备访问',authurl)
			const tempresp = await httpRequest(authurl)
			const loginurl = tempresp.json().obj
			// console.log('访问成功,认证地址',loginurl)
			const newLink2 = document.createElement("a");
			newLink2.textContent = "保单详细情况";
			newLink2.href = "#";
			newLink2.style.color = "red";
			newLink2.addEventListener("click", (e) => {
				e.preventDefault();
				Modules.GMopenJsWin(loginurl,'baodan');
			});
			iframeDocument.querySelector('.nav.navbar-nav').appendChild(newLink2);



			// iframe_CarLoss_getbpmitems
		} catch (error) {
			console.error("图片链接处理失败:", error);
		}
	}

	//  案件过滤配置面板
	static filterconfiger(options = {}) {
		const config = {
			columns: 5,
			areas: [
				"广州",
				"佛山",
				"顺德",
				"惠州",
				"云浮",
				"茂名",
				"河源",
				"潮州",
				"汕头",
				"揭阳",
				"湛江",
				"梅州",
				"清远",
				"韶关",
				"肇庆",
				"珠海",
				"阳江",
				"中山",
				"江门",
				"其它",
			],
			checkedareas: Array.isArray(options.checkedareas)
				? options.checkedareas
				: [], // 类型安全
			tailNo: Array.isArray(options.tailNo) ? options.tailNo : [], // 类型安全
			publicNo: Array.isArray(options.publicNo) ? options.publicNo : [], // 类型安全
			...options,
		};

		const container = document.createElement("div");
		container.style.padding = "10px";
		container.style.border = "1px solid #ddd";

		const checkboxContainer = document.createElement("div");
		checkboxContainer.style.display = "flex";
		checkboxContainer.style.flexWrap = "wrap";
		checkboxContainer.style.gap = "10px";

		// 创建文本框元素
		const otherInput = document.createElement("input");
		otherInput.type = "text";
		otherInput.style.width = "120px";
		otherInput.style.marginLeft = "5px";
		otherInput.maxLength = 10;
		otherInput.disabled = true;

		// 动态生成复选框
		const checkboxes = config.areas.map((area) => {
			const wrapper = document.createElement("div");
			wrapper.style.flex = `0 0 calc(${100 / config.columns}% - 10px)`;
			wrapper.style.minWidth = "120px";
			wrapper.style.margin = "2px 0";

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.value = area;
			checkbox.id = `checkbox-${area}`;
			checkbox.checked = config.checkedareas.includes(area);

			// 仅监听"其它"复选框状态变化（用于控制输入框）
			if (area === "其它") {
				checkbox.addEventListener("change", function () {
					otherInput.disabled = !this.checked;
				});

				if (config.checkedareas.some((item) => !config.areas.includes(item))) {
					otherInput.value = config.checkedareas
						.filter((item) => !config.areas.includes(item))
						.join(", ");
					otherInput.disabled = false;
					checkbox.checked = true;
				}
			}

			const label = document.createElement("label");
			label.htmlFor = `checkbox-${area}`;
			label.textContent = area;
			label.style.marginLeft = "4px";

			if (area === "其它") {
				const inputWrapper = document.createElement("div");
				inputWrapper.style.display = "flex";
				inputWrapper.style.alignItems = "center";
				inputWrapper.appendChild(checkbox);
				inputWrapper.appendChild(label);
				inputWrapper.appendChild(otherInput);
				checkboxContainer.appendChild(inputWrapper);
			} else {
				wrapper.appendChild(checkbox);
				wrapper.appendChild(label);
				checkboxContainer.appendChild(wrapper);
			}

			return { checkbox, area };
		});

		// 新增数字输入区域 ↓↓↓
		const numberInputsContainer = document.createElement("div");
		numberInputsContainer.style.display = "flex";
		numberInputsContainer.style.gap = "10px";
		numberInputsContainer.style.margin = "10px 0";

		// 创建数字输入框的函数
		const createNumberInput = (labelText) => {
			const wrapper = document.createElement("div");
			wrapper.style.display = "flex";
			wrapper.style.alignItems = "center";

			const label = document.createElement("span");
			label.textContent = labelText + "：";
			label.style.marginRight = "5px";

			const input = document.createElement("input");
			input.type = "text";
			input.maxLength = 10;
			input.style.width = "100px";
			input.pattern = "[0-9]*";

			// 强制输入数字
			input.addEventListener("input", function () {
				this.value = this.value.replace(/[^0-9]/g, "");
			});

			wrapper.appendChild(label);
			wrapper.appendChild(input);
			return { wrapper, input };
		};

		// 创建尾号和公号输入框
		const tailInput = createNumberInput("尾号");
		const publicInput = createNumberInput("公号");

		// 将数组转换为数字字符串（例如：[1,2,3] → "123"）
		if (Array.isArray(config.tailNo)) {
			tailInput.input.value = config.tailNo.join("");
		}
		if (Array.isArray(config.publicNo)) {
			publicInput.input.value = config.publicNo.join("");
		}

		numberInputsContainer.appendChild(tailInput.wrapper);
		numberInputsContainer.appendChild(publicInput.wrapper);

		function filter() {
			let checkedItems = [];

			checkboxes.forEach(({ checkbox, area }) => {
				if (checkbox.checked) {
					if (area === "其它") {
						const value = otherInput.value.trim();
						if (value) {
							value
								.split(",")
								.map((item) => item.trim()) // 去除每个子项首尾空格
								.filter((item) => item) // 过滤空字符串
								.forEach((item) => checkedItems.push(item));
						}
					} else {
						checkedItems.push(area);
					}
				}
			});

			// 去重处理（使用 Set）
			checkedItems = [...new Set(checkedItems)];

			// 处理数字输入
			const processNumbers = (input) => {
				return [...new Set(input.value.split("").map(Number))];
			};

			const output = {
				areas: [...new Set(checkedItems)],
				tailNo: processNumbers(tailInput.input),
				publicNo: processNumbers(publicInput.input),
			};

			console.log("筛选结果:", output);
			return output;
		}

		const button = document.createElement("button");
		button.textContent = "应用";
		button.style.marginTop = "10px";
		button.style.padding = "8px 16px";
		button.addEventListener("click", () => {
			const output = filter();

			const ccic_config = GM_getValue("config") || {}; // 获取现有配置
			Object.assign(ccic_config, {
				// 合并新旧配置
				areas: output.areas,
				tailNo: output.tailNo,
				publicNo: output.publicNo,
			});

			console.log("应用参数:", ccic_config);
			toastr.success("已应用配置", ccic_config);
			myconfig = ccic_config;
		});

		const button2 = document.createElement("button");
		button2.textContent = "保存并应用";
		button2.style.marginTop = "10px";
		button2.style.padding = "8px 16px";
		button2.addEventListener("click", () => {
			const output = filter();

			// // 保存到config
			const ccic_config = GM_getValue("config") || {}; // 获取现有配置
			Object.assign(ccic_config, {
				// 合并新旧配置
				areas: output.areas,
				tailNo: output.tailNo,
				publicNo: output.publicNo,
			});

			GM_setValue("config", ccic_config); // 保存合并后的配置

			myconfig = ccic_config;
			console.log("已保存到设置:");
			GM_notification("已保存到设置");
		});

		container.appendChild(checkboxContainer);
		container.appendChild(numberInputsContainer); // 添加数字输入区域
		container.appendChild(button);
		container.appendChild(button2);

		return container;
	}

	// 备注信息处理流程
	static async displayRemarks(iframe) {
		// 悬浮窗和缩小图标的 id
		const divid = "floatingDiv_RemarksMSG";
		const minid = "minimizeIcon_RemarksMSG";

		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
		const businessMainKey = bpmitems.accidentNo;

		// 获取备注信息,返回一个 Promise,包含备注信息的数组
		async function getRemarkText(businessMainKey) {
			const url = `/claim/workflowController.do?goPrpLremarkText&businessMainKey=${businessMainKey}&_=${new Date().getTime()}`;
			const msg = httpRequest(url)
				.then((response) => response.text())
				.then((data) => {
					let parser = new DOMParser();
					let doc = parser.parseFromString(data, "text/html");
					let tbody = doc.querySelector("#remarkText_mainRow");
					let trs = $$("tr", tbody);

					let items = [];
					trs.forEach((tr) => {
						const item = {};
						item["序号"] = tr.cells[0].querySelector("input").value;
						item["时间"] = tr.cells[1].querySelector("input").value;
						item["操作员"] = tr.cells[2].querySelector("input").value;
						item["环节"] = tr.cells[3].querySelector("input").value;
						item["内容"] = tr.cells[4].querySelector("input").value;
						items.push(item);
					});
					console.debug(items);
					return items;
				});
			return msg;
		}

		function createFloatingDivInIframe(iframe) {
			// 获取 iframe 的 document
			const iframeDocument =
				iframe.contentDocument || iframe.contentWindow.document;

			// 创建悬浮窗 div
			const floatingDiv = document.createElement("div");
			floatingDiv.id = divid;
			floatingDiv.style.position = "fixed";
			floatingDiv.style.top = "50px";
			floatingDiv.style.left = "50px";
			floatingDiv.style.width = "600px"; // 调整宽度以适应表格
			floatingDiv.style.maxHeight = "80vh"; // 设置最大高度为视口的 80%
			floatingDiv.style.backgroundColor = "white";
			floatingDiv.style.border = "1px solid #ddd";
			floatingDiv.style.borderRadius = "8px";
			floatingDiv.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
			floatingDiv.style.zIndex = "1000";
			floatingDiv.style.display = "none"; // 初始状态不显示
			floatingDiv.style.flexDirection = "column";
			floatingDiv.style.fontFamily = "Arial, sans-serif";
			floatingDiv.style.overflow = "auto"; // 允许垂直滚动

			// 创建标题栏
			const titleBar = document.createElement("div");
			titleBar.style.backgroundColor = "#f8f9fa";
			titleBar.style.padding = "12px 16px";
			titleBar.style.borderBottom = "1px solid #ddd";
			titleBar.style.display = "flex";
			titleBar.style.justifyContent = "space-between";
			titleBar.style.alignItems = "center";
			titleBar.style.borderTopLeftRadius = "8px";
			titleBar.style.borderTopRightRadius = "8px";

			const titleText = document.createElement("span");
			titleText.textContent = "备注信息";
			titleText.style.fontSize = "16px";
			titleText.style.fontWeight = "bold";
			titleText.style.color = "#333";

			const closeButton = document.createElement("button");
			closeButton.textContent = "×"; // 使用叉号表示关闭
			closeButton.style.cursor = "pointer";
			closeButton.style.background = "none";
			closeButton.style.border = "none";
			closeButton.style.fontSize = "20px";
			closeButton.style.color = "#666";
			closeButton.style.padding = "0";
			closeButton.style.margin = "0";
			closeButton.style.lineHeight = "1";

			titleBar.appendChild(titleText);
			titleBar.appendChild(closeButton);

			// 创建内容区域
			const contentArea = document.createElement("div");
			contentArea.style.flex = "1";
			contentArea.style.overflowY = "auto"; // 允许垂直滚动
			contentArea.style.padding = "16px";

			// 创建显示所有按钮
			const showAllButton = document.createElement("button");
			showAllButton.textContent = "显示所有";
			showAllButton.style.marginTop = "10px";
			showAllButton.style.padding = "8px 16px";
			showAllButton.style.backgroundColor = "#007bff";
			showAllButton.style.color = "white";
			showAllButton.style.border = "none";
			showAllButton.style.borderRadius = "4px";
			showAllButton.style.cursor = "pointer";
			showAllButton.style.fontSize = "14px";

			// 将标题栏、内容区域和显示所有按钮添加到悬浮窗
			floatingDiv.appendChild(titleBar);
			floatingDiv.appendChild(contentArea);
			floatingDiv.appendChild(showAllButton);

			// 创建缩小图标
			const minimizeIcon = document.createElement("div");
			minimizeIcon.id = minid;
			minimizeIcon.style.position = "fixed";
			minimizeIcon.style.bottom = "3px";
			minimizeIcon.style.left = "3px";
			minimizeIcon.style.width = "20px";
			minimizeIcon.style.height = "20px";
			minimizeIcon.style.backgroundColor = "#007bff";
			minimizeIcon.style.borderRadius = "50%";
			minimizeIcon.style.cursor = "pointer";
			minimizeIcon.style.display = "flex"; // 初始状态显示
			minimizeIcon.style.alignItems = "center";
			minimizeIcon.style.justifyContent = "center";
			minimizeIcon.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";
			minimizeIcon.style.color = "white";
			minimizeIcon.innerHTML = "📋"; // 使用一个图标表示

			// 将悬浮窗和缩小图标添加到 iframe 的 body
			iframeDocument.body.appendChild(floatingDiv);
			iframeDocument.body.appendChild(minimizeIcon);

			// 缩小图标点击事件：显示悬浮窗
			minimizeIcon.addEventListener("click", () => {
				floatingDiv.style.display = "flex"; // 显示悬浮窗
				minimizeIcon.style.display = "none"; // 隐藏缩小图标
			});

			// 关闭按钮点击事件：隐藏悬浮窗，显示缩小图标
			closeButton.addEventListener("click", () => {
				floatingDiv.style.display = "none"; // 隐藏悬浮窗
				minimizeIcon.style.display = "flex"; // 显示缩小图标
			});

			// 返回悬浮窗和内容区域，以便外部操作
			return { floatingDiv, contentArea, showAllButton };
		}

		async function displayRemarkTextInIframe(iframe, businessMainKey) {
			const items = await getRemarkText(businessMainKey);

			// 在 iframe 中创建悬浮窗
			const { floatingDiv, contentArea, showAllButton } =
				createFloatingDivInIframe(iframe);

			// 创建表格
			const table = document.createElement("table");
			table.style.width = "100%";
			table.style.borderCollapse = "collapse";
			table.style.marginTop = "8px";

			// 创建表头
			const thead = document.createElement("thead");
			const headerRow = document.createElement("tr");
			headerRow.style.backgroundColor = "#f8f9fa";
			headerRow.style.borderBottom = "2px solid #ddd";

			// 表头列
			const headers = ["序号", "时间", "操作员", "环节", "内容"];
			headers.forEach((headerText) => {
				const th = document.createElement("th");
				th.textContent = headerText;
				th.style.padding = "12px";
				th.style.textAlign = "left";
				th.style.fontWeight = "bold";
				th.style.color = "#333";
				headerRow.appendChild(th);
			});
			thead.appendChild(headerRow);
			table.appendChild(thead);

			// 创建表格内容
			const tbody = document.createElement("tbody");
			const hiddenRows = []; // 存储被隐藏的行

			items.forEach((item, index) => {
				const row = document.createElement("tr");
				row.style.borderBottom = "1px solid #ddd";
				row.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f9f9f9";

				// 检查是否需要隐藏该行
				const shouldHide = [
					"已调度",
					"通过移动",
					"申请改派",
					"调度查勘员",
				].some((keyword) =>
					Object.values(item).some((value) => value.includes(keyword))
				);

				if (shouldHide) {
					row.style.display = "none"; // 默认隐藏
					hiddenRows.push(row); // 添加到隐藏行列表
				}

				headers.forEach((header) => {
					const cell = document.createElement("td");
					cell.textContent = item[header] || "-"; // 如果值为空，显示占位符
					cell.style.padding = "12px";
					cell.style.color = "#555";
					row.appendChild(cell);
				});

				tbody.appendChild(row);
			});
			table.appendChild(tbody);

			// 将表格添加到内容区域
			contentArea.appendChild(table);

			// 显示所有按钮点击事件
			showAllButton.addEventListener("click", () => {
				hiddenRows.forEach((row) => {
					row.style.display = ""; // 显示所有被隐藏的行
				});
				showAllButton.style.display = "none"; // 隐藏“显示所有”按钮
			});
		}

		// 如果悬浮窗已经存在，则删除这两个元素
		if (iframe.contentWindow.document.querySelector(`#${divid}`)) {
			// 如果悬浮窗已经存在，则删除这两个元素
			// console.log('删除悬浮窗');
			iframe.contentWindow.document.querySelector(`#${divid}`).remove();
			iframe.contentWindow.document.querySelector(`#${minid}`).remove();
		}
		displayRemarkTextInIframe(iframe, businessMainKey);
	}

	// 展示节点信息,一般在智能审核节点处调用
	static async displaylossitems(iframe) {
		const bpmitems = Common.iframe_CarLoss_getbpmitems(iframe);
		const businessMainKey = bpmitems.accidentNo;

		// 从接口获取节点数据
		async function getCaseNodes(businessMainKey) {
			let Workflowurl = `/claim/bpmTaskController.do?loadWorkflowData&businessMainKey=${businessMainKey}&showType=1`;
			const Nodes = await httpRequest(Workflowurl).then((response) =>
				response.json()
			);
			return Nodes;
		}

		// 整理节点数据，生成所有分支路径
		function organizeNodes(nodes) {
			const nodeDict = {}; // 存储节点信息
			const childrenDict = {}; // 存储每个节点的子节点

			// 初始化节点字典和子节点字典
			nodes.forEach((node) => {
				nodeDict[node.id] = node;
				if (node.preId !== undefined) {
					if (!childrenDict[node.preId]) {
						childrenDict[node.preId] = [];
					}
					childrenDict[node.preId].push(node.id);
				}
			});

			// 找到起点节点（没有 preId 的节点）
			const startNode = nodes.find((node) => node.preId === undefined);
			if (!startNode) {
				throw new Error("未找到起点节点");
			}

			// 递归构建所有分支路径
			function buildPaths(nodeId) {
				const currentNode = nodeDict[nodeId];
				if (!childrenDict[nodeId] || childrenDict[nodeId].length === 0) {
					// 如果当前节点没有子节点，返回当前节点作为一条路径
					return [[currentNode]];
				}

				// 如果当前节点有子节点，递归构建子节点的路径
				const paths = [];
				childrenDict[nodeId].forEach((childId) => {
					const childPaths = buildPaths(childId);
					childPaths.forEach((path) => {
						// 将当前节点添加到每条子路径的开头
						paths.push([currentNode, ...path]);
					});
				});

				return paths;
			}

			// 从起点节点开始构建所有路径
			return buildPaths(startNode.id);
		}

		// 获取每个路径中最大的节点,只提取状态为9的节点,且taskCatalog是CarComponentAudit或者CarLossVerify,或者PropertyComponentAudit或者PropertyLossVerify
		function getmaxnodes(paths) {
			let carnodes = []; //车辆节点
			let pronodes = []; //财产节点
			const taskCatalog2parse = ["CarComponentAudit", "CarLossVerify"];
			const protaskCatalog2parse = ["PropLossVerify"];
			for (let path of paths) {
				const MaxNode = getMaxNode(path);
				// 如果MaxNode['taskCatalog']是taskCatalog2parse里面的一个元素并且状态是9
				if (
					taskCatalog2parse.includes(MaxNode["taskCatalog"]) &&
					MaxNode["status"] == 9
				) {
					carnodes.push(MaxNode);
				}
				if (
					protaskCatalog2parse.includes(MaxNode["taskCatalog"]) &&
					MaxNode["status"] == 9
				) {
					pronodes.push(MaxNode);
				}
			}
			return { carnodes: carnodes, pronodes: pronodes };
		}

		// 获取每个路径中最大的节点
		function getMaxNode(path) {
			return path.reduce((maxNode, currentNode) => {
				return currentNode.nodeLevel > maxNode.nodeLevel
					? currentNode
					: maxNode;
			});
		}

		// 获取节点数据_定损车辆信息和财产损失信息
		async function getcaselossinfo(maxnodes) {
			const carlossPromises = [];
			const propertyPromises = [];

			// 收集车辆损失信息的 Promise
			for (let node of maxnodes["carnodes"]) {
				carlossPromises.push(parse_carloss_node(node));
			}

			// 收集财产损失信息的 Promise
			for (let node of maxnodes["pronodes"]) {
				propertyPromises.push(parse_property_node(node));
			}

			// 等待所有 Promise 完成
			const carlosses = await Promise.all(carlossPromises);
			const properties = await Promise.all(propertyPromises);

			// 合并结果
			return [...carlosses, ...properties];
		}

		// 获取节点数据_定损车辆基本信息,获取到的数据是一个对象,后续通过这个数据获取定损项目明细
		async function getCarinfo(node) {
			const url = `/claim/bpmTaskController.do?processTask&taskId=${node.id}&taskType=${node.taskType}`;
			const carinfo = httpRequest(url)
				.then((response) => response.html())
				// .then((doc) => {
				// 	// let parser = new DOMParser();
				// 	// let doc = parser.parseFromString(text, "text/html");
				// 	return doc;
				// })
				.then((doc) => {
					const eml_commonInfo = doc.querySelector("#commonInfo");
					const items = $$("input", eml_commonInfo);
					const commonInfo = {};
					for (let item of items) {
						if (!item.value) {
							continue;
						}
						commonInfo[item.id.replace("bpmPage_", "")] = item.value;
					}
					const 维修厂名称 = doc.querySelector(
						"#prpLrepairChannelPageList\\[0\\]\\.repairNameHidden"
					).value;
					commonInfo["维修厂名称"] = 维修厂名称;
					return commonInfo;
				});
			return carinfo;
		}

		// 解析定损页面_定损车辆明细页面的元素,传入的参数是一个doc对象
		function parser_Carlosspage(doc) {
			const lossitems = new Map();

			// 获取定损项目明细
			function getItems(Table, offset = 0) {
				if (!Table) {
					return [];
				}
				let Items = [];
				// console.log(Table)
				const trs = $$("tr", Table);
				trs.forEach((tr) => {
					const 项目名称 = Common.cellGetValue(tr.cells[1 + offset]);
					// Items里面不包含触发项目时添加
					if (!Items.includes(项目名称)) {
						Items.push(项目名称);
					}
				});
				return Items;
			}

			// 获取金额汇总
			function getAmountSum() {
				// 金额汇总
				const UIAmountSum = doc.querySelector("#UIAmountSum_table_tbody");
				const tr = $$("tr", UIAmountSum)[1];
				const 配件金额 = tr.cells[2].querySelector("input").value
					? parseInt(tr.cells[2].querySelector("input").value)
					: 0;
				const 工时金额 = tr.cells[3].querySelector("input").value
					? parseInt(tr.cells[3].querySelector("input").value)
					: 0;
				const 外修金额 = tr.cells[4].querySelector("input").value
					? parseInt(tr.cells[4].querySelector("input").value)
					: 0;
				const 小计 = tr.cells[5].querySelector("input").value
					? parseInt(tr.cells[5].querySelector("input").value)
					: 0;
				const 施救金额 = tr.cells[6].querySelector("input").value
					? parseInt(tr.cells[6].querySelector("input").value)
					: 0;
				const 合计 = tr.cells[7].querySelector("input").value
					? parseInt(tr.cells[7].querySelector("input").value)
					: 0;
				const 残值金额 = tr.cells[8].querySelector("input").value
					? parseInt(tr.cells[8].querySelector("input").value)
					: 0;
				const 管理费 = tr.cells[9].querySelector("input").value
					? parseInt(tr.cells[9].querySelector("input").value)
					: 0;

				const 金额汇总 = new Map();
				金额汇总.set("配件金额", 配件金额);
				金额汇总.set("外修金额", 外修金额);
				金额汇总.set("工时金额", 工时金额);
				金额汇总.set("施救金额", 施救金额);
				金额汇总.set("残值金额", 残值金额);
				金额汇总.set("管理费", 管理费);
				金额汇总.set("小计", 小计);
				金额汇总.set("合计", 合计);

				return 金额汇总;
			}

			// 意见列表
			function getOpinionList() {
				const pinionList_mainRow = doc.querySelector("#pinionList_mainRow");
				const 意见列表信息 = [];
				const trs = $$("tr", pinionList_mainRow);
				trs.forEach((tr) => {
					const 角色 = Common.cellGetValue(tr.cells[0]);
					const 姓名 = Common.cellGetValue(tr.cells[1]);
					const 机构 = Common.cellGetValue(tr.cells[2]);
					const 时间 = Common.cellGetValue(tr.cells[3]);
					const 意见 = Common.cellGetValue(tr.cells[4]);
					const 意见说明 = Common.cellGetValue(tr.cells[5]);
					const 金额 = Common.cellGetValue(tr.cells[6]);
					意见列表信息.push([角色, 姓名, 机构, 时间, 意见, 意见说明, 金额]);
				});
				return 意见列表信息;
			}

			// 配件栏
			const UIPrpLComponent = doc.querySelector(
				"#UIPrpLComponent_add_orderProduct_table"
			);
			// 外修
			const UIExternalComponent = doc.querySelector(
				"#UIExternalComponent_body"
			);
			// 工时
			const UIPrpLrepairFee = doc.querySelector(
				"#UIPrpLrepairFee_add_orderProduct_table"
			);
			// 辅料
			const UIPrpLmaterial = doc.querySelector(
				"#UIPrpLmaterial_add_orderProduct_table"
			);

			lossitems.set("配件", getItems(UIPrpLComponent, 0));
			lossitems.set("外修", getItems(UIExternalComponent, 0));
			lossitems.set("工时", getItems(UIPrpLrepairFee, 1));
			lossitems.set("辅料", getItems(UIPrpLmaterial, 1));
			lossitems.set("金额汇总", getAmountSum());
			lossitems.set("意见列表", getOpinionList());
			return lossitems;
		}

		// 获取定损车辆信息,传入的参数是一个Carinfo对象
		async function getCarlossinfo(Carinfo) {
			const url = "/claim/carCommonController.do?getLossInfo";
			const Carlossinfo = await httpRequest(url, Carinfo)
				.then((response) => response.html())
				.then((doc) => {
					//解析定损页面_定损车辆明细页面的元素
					return parser_Carlosspage(doc);
				});
			return Carlossinfo;
		}

		// 整合解析定损车辆基本信息和定损信息
		async function parse_carloss_node(node) {
			const carloss = new Map();
			const carinfo = await getCarinfo(node);
			const lossinfo = await getCarlossinfo(carinfo);
			carloss.set("registNo", carinfo["registNo"]);
			carloss.set("taskitems", carinfo["carLa"]);
			carloss.set("licenseNo", carinfo["licenseNo"]);
			carloss.set("node", node);
			carloss.set("carinfo", carinfo);
			carloss.set("lossinfo", lossinfo);
			return carloss;
		}

		// 整合解析财产节点定损信息
		async function parse_property_node(node) {
			// return {}
			//下面的代码待定
			function parser_Propertypage(doc) {
				const property = new Map();
				const bpmitems = new Map();
				const bpmPage_elements = $$('[id^="bpmPage_"]', doc);
				bpmPage_elements.forEach((element) => {
					bpmitems.set(element.id.replace("bpmPage_", ""), element.value);
				});

				const propLossFee_listTable = doc.querySelector(
					"#propLossFee_listTable"
				);
				const propLossFee_listTable_trs = $$("tr", propLossFee_listTable);
				const propLossFee_list = [];
				propLossFee_listTable_trs.forEach((tr) => {
					const tds = tr.querySelectorAll("td");
					//如果是核损页面,tds的长度是8,如果是定损页面,tds的长度是13
					if (tds.length < 9) {
						return;
					}
					const 序号 = Common.cellGetValue(tds[0]);
					const 车牌号 = Common.cellGetValue(tds[1]);
					const 险别 = Common.cellGetValue(tds[2]);
					const 财产种类 = Common.cellGetValue(tds[3]);
					const 财产名称 = Common.cellGetValue(tds[4]);
					const 费用名称 = Common.cellGetValue(tds[5]);
					const 财产数量 = Common.cellGetValue(tds[6]);
					const 财产单价 = Common.cellGetValue(tds[7]);
					const 报损金额 = Common.cellGetValue(tds[8]);
					const 回收方式 = Common.cellGetValue(tds[9]);
					const 残值金额 = Common.cellGetValue(tds[10]);
					const 金额 = Common.cellGetValue(tds[11]);
					const 备注 = Common.cellGetValue(tds[12]);

					propLossFee_list.push([
						序号,
						车牌号,
						险别,
						财产种类,
						财产名称,
						费用名称,
						财产数量,
						财产单价,
						报损金额,
						回收方式,
						残值金额,
						金额,
						备注,
					]);
				});

				// //核损总金额
				const 财产总金额 = doc.querySelector(
					"#prpLpropLossApprovalPage_sumVerifyLoss"
				).value;

				//意见列表信息
				const pinionList_mainRow = doc.querySelector("#pinionList_mainRow");
				const 意见列表信息 = [];
				const trs = pinionList_mainRow.querySelectorAll("tr");
				trs.forEach((tr) => {
					const 角色 = Common.cellGetValue(tr.cells[0]);
					const 姓名 = Common.cellGetValue(tr.cells[1]);
					const 机构 = Common.cellGetValue(tr.cells[2]);
					const 时间 = Common.cellGetValue(tr.cells[3]);
					const 意见 = Common.cellGetValue(tr.cells[4]);
					const 意见说明 = Common.cellGetValue(tr.cells[5]);
					const 金额 = Common.cellGetValue(tr.cells[6]);
					意见列表信息.push([角色, 姓名, 机构, 时间, 意见, 意见说明, 金额]);
				});

				property.set("node", node);
				property.set("taskitems", bpmitems.get("taskPropItems"));
				property.set("财产损失明细", propLossFee_list);
				property.set("财产总金额", 财产总金额);
				property.set("意见列表", 意见列表信息);
				return property;
			}

			const url = `/claim/bpmTaskController.do?processTask&taskId=${node.id}&taskType=${node.taskType}`;
			const Property = await httpRequest(url)
				.then((response) => response.html())
				// .then((text) => {
				// 	let parser = new DOMParser();
				// 	let doc = parser.parseFromString(text, "text/html");
				// 	return doc;
				// })
				.then((doc) => {
					return parser_Propertypage(doc);
				});

			return Property;
		}

		//创建悬浮窗口
		function createFloatingDiv(caselosses) {
			const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

			if (iframeDoc.querySelector("#lossinfofloatingDiv")) {
				return;
			}

			// 创建悬浮容器
			const floatingDiv = iframeDoc.createElement("div");
			floatingDiv.id = "lossinfofloatingDiv";
			floatingDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        width: 80%;
        height: 70%;
        max-width: 40vw;
        max-height: 60vh;
        z-index: 9999;
        display: none;
        flex-direction: column;
    `;

			// 最小化图标
			const icon = iframeDoc.createElement("div");
			icon.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        cursor: pointer;
        background: #fff;
        padding: 8px;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        z-index: 9998;
    `;
			icon.innerHTML = "📋";

			// 头部和关闭按钮
			const header = iframeDoc.createElement("div");
			header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #eee;
        position: relative;
    `;

			const closeBtn = iframeDoc.createElement("button");
			closeBtn.innerHTML = "×";
			closeBtn.style.cssText = `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

			// Tab栏
			const tabBar = iframeDoc.createElement("div");
			tabBar.style.cssText = `
        display: flex;
        background: #f5f5f5;
        border-bottom: 1px solid #eee;
    `;

			// 内容容器
			const contentContainer = iframeDoc.createElement("div");
			contentContainer.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 16px;
    `;

			// 构建Tabs
			caselosses.forEach((caseloss, index) => {
				// 根据taskitems值，判断是车辆损失还是财产损失
				let tabContent = null;
				if (caseloss.get("taskitems").startsWith("C_")) {
					// 车辆损失
					tabContent = createCarLossTabContent(caseloss);
				} else if (caseloss.get("taskitems").startsWith("P_")) {
					// 财产损失
					tabContent = createPropertyLossTabContent(caseloss);
				}

				if (tabContent) {
					const tabBtn = iframeDoc.createElement("button");
					tabBtn.textContent = caseloss.get("taskitems") || `案件 ${index + 1}`;
					tabBtn.style.cssText = `
                flex: 1;
                padding: 12px;
                border: none;
                background: none;
                cursor: pointer;
                white-space: nowrap;
                border-right: 1px solid #ddd;
                transition: all 0.2s;
            `;

					// 添加active样式类
					if (index === 0) {
						tabBtn.style.cssText += `
                    background: #1890ff;
                    color: white;
                `;
					}

					// 内容面板
					const panel = iframeDoc.createElement("div");
					panel.style.display = index === 0 ? "block" : "none";
					panel.appendChild(tabContent);

					contentContainer.appendChild(panel);

					// Tab切换逻辑
					tabBtn.addEventListener("click", () => {
						// 移除所有tab的active样式
						Array.from(tabBar.children).forEach((tab) => {
							tab.style.background = "#f5f5f5";
							tab.style.color = "#333";
						});

						// 设置当前tab样式
						tabBtn.style.background = "#1890ff";
						tabBtn.style.color = "white";

						// 切换内容显示
						Array.from(contentContainer.children).forEach(
							(child) => (child.style.display = "none")
						);
						panel.style.display = "block";
					});

					tabBar.appendChild(tabBtn);
				}
			});

			// 事件绑定
			closeBtn.addEventListener("click", () => {
				floatingDiv.style.display = "none";
				icon.style.display = "block";
			});

			icon.addEventListener("click", () => {
				floatingDiv.style.display = "flex";
				icon.style.display = "none";
			});

			// 组合元素
			header.appendChild(closeBtn);
			floatingDiv.appendChild(header);
			floatingDiv.appendChild(tabBar);
			floatingDiv.appendChild(contentContainer);

			// 插入到iframe
			iframeDoc.body.appendChild(floatingDiv);
			iframeDoc.body.appendChild(icon);
		}

		// 创建车辆损失Tab内容
		function createCarLossTabContent(caseloss) {
			const fragment = document.createDocumentFragment();

			// 基本信息行
			const basicInfo = document.createElement("div");
			basicInfo.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
    `;
			basicInfo.innerHTML = `
        <div><strong>车牌号：</strong>${caseloss.get("licenseNo")}</div>
        <div><strong>维修厂：</strong>${caseloss.get("carinfo")["维修厂名称"]
				}</div>
    `;

			// 金额信息行
			const amountSum = caseloss.get("lossinfo").get("金额汇总");
			const amountInfo = document.createElement("div");
			amountInfo.style.cssText = `
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-bottom: 16px;
    `;

			amountInfo.innerHTML = `
        <div><strong>维修费：</strong>${parseInt(amountSum.get("小计")) - parseInt(amountSum.get("外修金额"))
				}</div>
        <div><strong>外修费：</strong>${amountSum.get("外修金额")}</div>
        <div><strong>施救费：</strong>${amountSum.get("施救金额")}</div>
        <div><strong>总金额：</strong>${amountSum.get("合计")}</div>
        <div><strong>残值：</strong>${amountSum.get("残值金额")}</div>
    `;

			// 意见列表
			const opinionList = document.createElement("div");
			opinionList.style.cssText = `
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 8px;
    `;

			caseloss
				.get("lossinfo")
				.get("意见列表")
				.forEach((opinion) => {
					const item = document.createElement("div");
					item.style.cssText = `
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
            &:last-child { border-bottom: none; }
        `;
					item.innerHTML = `
            <div><strong>${opinion[0]} ${opinion[1]}</strong> (${opinion[2]})</div>
            <div style="color:#666; margin-top:4px;">${opinion[4]}：${opinion[5]}</div>
        `;
					opinionList.appendChild(item);
				});

			fragment.appendChild(basicInfo);
			fragment.appendChild(amountInfo);
			fragment.appendChild(opinionList);
			return fragment;
		}

		// 创建财产损失Tab内容
		function createPropertyLossTabContent(caseloss) {
			const fragment = document.createDocumentFragment();

			// 基本信息行
			const basicInfo = document.createElement("div");
			basicInfo.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
    `;
			basicInfo.innerHTML = `
        <div><strong>损失项目：</strong>${caseloss.get("taskitems")}</div>
    `;

			// 财产损失明细
			const lossDetails = document.createElement("div");
			lossDetails.style.cssText = `
        margin-bottom: 16px;
    `;
			const lossDetailsTable = document.createElement("div");
			lossDetailsTable.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;

			caseloss.get("财产损失明细").forEach((detail) => {
				const [
					序号,
					车牌号,
					险别,
					财产种类,
					财产名称,
					费用名称,
					财产数量,
					财产单价,
					报损金额,
					回收方式,
					残值金额,
					金额,
					备注,
				] = detail;
				const detailRow = document.createElement("div");
				detailRow.style.cssText = `
            padding: 8px;
            border: 1px solid #eee;
            border-radius: 4px;
        `;
				detailRow.innerHTML = `
            车牌号: ${车牌号}, 财产名称: ${财产名称}, 金额: ${金额}
        `;
				lossDetailsTable.appendChild(detailRow);
			});

			lossDetails.appendChild(lossDetailsTable);

			// 财产总金额
			const totalAmount = document.createElement("div");
			totalAmount.style.cssText = `
        margin-bottom: 16px;
    `;
			totalAmount.innerHTML = `
        <strong>财产总金额：</strong>${caseloss.get("财产总金额")}
    `;

			// 意见列表
			const opinionList = document.createElement("div");
			opinionList.style.cssText = `
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 8px;
    `;

			caseloss.get("意见列表").forEach((opinion) => {
				const item = document.createElement("div");
				item.style.cssText = `
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
            &:last-child { border-bottom: none; }
        `;
				item.innerHTML = `
            <div><strong>${opinion[0]} ${opinion[1]}</strong> (${opinion[2]})</div>
            <div style="color:#666; margin-top:4px;">${opinion[4]}：${opinion[5]}</div>
        `;
				opinionList.appendChild(item);
			});

			fragment.appendChild(basicInfo);
			fragment.appendChild(lossDetails);
			fragment.appendChild(totalAmount);
			fragment.appendChild(opinionList);
			return fragment;
		}

		// 从businessMainKey获取车辆及财产的定损信息
		async function getLossItemsInfo(businessMainKey) {
			// 获取节点数据
			const nodes = await getCaseNodes(businessMainKey);
			// 整理节点数据，生成所有分支路径
			const paths = organizeNodes(nodes);
			// 获取每个路径中最大的节点
			const maxnodes = getmaxnodes(paths);
			// 获取节点数据_定损车辆信息和财产损失信息
			const caselosses = await getcaselossinfo(maxnodes);

			console.debug("损失数据", caselosses, caselosses.length);

			// 创建悬浮 div
			createFloatingDiv(caselosses);

			return caselosses;
		}

		return getLossItemsInfo(businessMainKey);
	}

	// 在核损页面显示标准配件的价格
	static async getpartprice(iframe) {
		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		const table = await async_querySelector(
			"#UIPrpLComponent_add_orderProduct_table",
			{ parent: iframeDoc }
		);
		const trs = table.querySelectorAll("tr");
		if (!trs) return;

		// console.log('找到配件项目',trs)
		const priceinfos = await querypartsprice(iframe);
		trs.forEach((tr) => {
			const cell_配件代码 = tr.cells[2];
			// const 配件品质 = tr.cells[12];
			// const cell_配件报价 = tr.querySelector('[id^="offerPrice_"]')
			const cell_参考价格 = tr.querySelector('[id^="reFunitPrice_"]');
			const unitPrice = parseFloat(
				tr.querySelector(
					'[id^="prpLcarComponentPageList\\["][id$="\\.unitPrice"]'
				).value
			); //定损上报报价
			const originalCode = Common.cellGetValue(cell_配件代码); //配件编码
			const item = priceinfos[originalCode];
			if (!item) return;
			let content = "";
			if (item.oriGuidePrice) {
				content += `厂方指导价:${item.oriGuidePrice}  (${parseInt(
					(unitPrice / item.oriGuidePrice) * 100
				)}%)`;
			}
			if (item.oriAfterPrice) {
				content += ` 税后价:${item.oriAfterPrice}  `;
			}
			if (item.oriBrandPrice) {
				content += ` 机构报价:${item.oriBrandPrice}  `;
			}
			if (item.oriMarketPrice) {
				content += ` 市场价:${item.oriMarketPrice}  `;
			}
			if (item.locPrice) {
				content += ` 大地价:${item.locPrice}  `;
			}
			if (content) {
				cell_参考价格.style.backgroundColor = "rgba(255, 255, 0, 0.1)";
				HoverTip(iframe, cell_参考价格, content);
			}
		});

		// 获取配件价格,在核损节点页面使用
		async function querypartsprice(iframe = document) {
			let url_queryModifyTrack;
			const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document || document;
			const lossApprovalMethod = iframeDocument.querySelector(
				"#prpLcarLossApprovalPage_lossApprovalMethod option"
			).value;
			if (lossApprovalMethod == "4") {
				console.debug("提示", "该任务没有轨迹信息！");
				return;
			}

			if (
				iframeDocument.querySelector("#bpmPage_back").value == "N" &&
				iframeDocument.querySelector("#bpmPage_taskCatalog").value ==
				"CarLossApproval"
			) {
				console.debug("提示", "该任务没有轨迹信息！");
				return;
			}

			const lossApprovalId = iframeDocument.querySelector(
				"#bpmPage_businessKey"
			).value;
			const trackId = iframeDocument.querySelector("#bpmPage_trackId").value;
			const taskId = iframeDocument.querySelector("#bpmPage_taskId").value;
			const accidentNo = iframeDocument.querySelector(
				"#bpmPage_accidentNo"
			).value;
			const caseVersion = iframeDocument.querySelector(
				"#bpmPage_caseVersion"
			).value;
			if (lossApprovalId != null && lossApprovalId != "") {
				const url_queryModifyTrack =
				"/claim/preApprovalController.do?queryModifyTrack&lossApprovalId=" +
					lossApprovalId +
					"&taskId=" +
					taskId +
					"&trackId=" +
					trackId +
					"&accidentNo=" +
					accidentNo +
					"&caseVersion=" +
					caseVersion;
				return await httpRequest(url_queryModifyTrack)
					.then((response) => response.html())
					// .then((html) => {
					// 	const doc = new DOMParser().parseFromString(html, "text/html");
					// 	return doc;
					// })
					.then((doc) => {
						// console.log(doc);
						const accidentNo = doc.querySelector("#accidentNo").value;
						// const trackId = doc.querySelector("#trackId").value;
						const trackId = doc.querySelector("#preTrackIds").value;
						const url = `/claim/preApprovalController.do?docCollectComponentDatagrid&trackIds=${trackId}&businessMainKey=${accidentNo}`;
						// console.debug(url)
						return httpRequest(url)
							.then((response) => response.json())
							.then((JSON) => {
								// console.debug(JSON);
								return JSON;
							})
							.then((arr) => {
								// 创建一个空对象，用于存储结果
								const result = {};
								// 遍历数组中的每个元素
								// console.log('arr',arr);
								arr.forEach((item) => {
									if (item == null) return;
									// 提取需要的字段
									const {
										originalCode,
										originalName,
										oriAfterPrice,
										oriBrandPrice,
										oriGuidePrice,
										oriMarketPrice,
									} = item;

									// 将提取的字段放入一个新的对象中
									const value = {
										originalName, //EPC零件名称
										// partStandard,   //系统零件名称
										oriAfterPrice, //税后价
										oriBrandPrice, //机构价格
										oriGuidePrice, //厂方指导价
										oriMarketPrice, //市场价
										// locPrice      //本地价格(大地价)
									};

									// 将结果添加到 result 对象中，key 是 originalCode
									result[originalCode] = value;
								});

								// 返回结果对象
								// console.log(result);
								return result;
							});
					});
			} else {
				console.error("提示", "轨迹信息获取失败！", "info");
			}
		}
	}



	//  打开新窗口
	static GMopenJsWin(url, jsWinId = 'certifyQueryId') {
		const link = document.createElement('a');
		link.href = url;
		link.target = jsWinId;

		// 创建临时不可见容器
		const ghostContainer = document.createElement('div');
		ghostContainer.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;';

		// 短暂添加到DOM
		ghostContainer.appendChild(link);
		document.documentElement.appendChild(ghostContainer); // 添加到根元素避免布局影响
		link.click();
		// console.log('创建并打开链接', url);

		// 异步清理
		requestAnimationFrame(() => {
			document.documentElement.removeChild(ghostContainer);
		});
	}
}


class Navbar {

    constructor(iframe) {
        this.iframe = iframe
        this.init()
    }

    init() {
        this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow?.document || document;
        this.navbar = this.iframeDocument.querySelector("div#navbar");
        if (!this.navbar) return;
        this.bpmitem = Common.iframe_CarLoss_getbpmitems(this.iframe)
        this.showriskwarning()
        this.showpolicy()
    }


    /**
 * 将指定 DOM 元素中的所有 A 标签转换为红字加粗的 SPAN 标签
 * @param {HTMLElement} element - 输入的 DOM 元素
 * @returns {HTMLElement} - 修改后的 DOM 元素
 */
    static Atag2Span(element) {
        if (!element) return null;

        // 1. 获取元素内所有的 A 标签
        // 使用 querySelectorAll 获取的是静态 NodeList，方便直接循环
        const anchors = element.querySelectorAll('a');

        anchors.forEach(a => {
            // 2. 创建一个新的 span 元素
            const span = document.createElement('span');

            // 3. 复制原 A 标签的内容（包括文字或嵌套的 HTML）
            span.innerHTML = a.innerHTML;

            // 4. 设置红色加粗样式
            span.style.color = 'red';
            span.style.fontWeight = 'bold';

            // 5. 如果需要保留原有的 class 或 id，可以在这里添加（可选）
            // if (a.className) span.className = a.className;
            // if (a.id) span.id = a.id;

            // 6. 在 DOM 中替换旧的 A 标签
            a.parentNode.replaceChild(span, a);
        });

        // 7. 返回修改后的原始元素
        return element;
    }

    /**
 * 创建一个带有滚动条的容器div，用于显示一系列DOM元素，每行一个。
 *
 * @param {HTMLElement[]} elementsArray - 一个包含要添加到容器的DOM元素的数组。
 *                                        非HTMLElement类型的元素将被忽略并发出警告。
 * @returns {HTMLDivElement} 创建的容器div元素。
 */
    static createContainer(elementsArray) {
        // 1. 输入校验
        if (!Array.isArray(elementsArray)) {
            console.error("createVerticalScrollContainer expects an array of DOM elements as input.");
            return document.createElement('div'); // 返回一个空的div以避免后续错误
        }

        // 2. 创建主容器 div
        const container = document.createElement('div');

        // 3. 应用 CSS 样式
        // 设置最大宽度和最大高度
        container.style.maxWidth = '1280px';
        container.style.maxHeight = '960px';

        // 当内容高度超出容器时，显示垂直滚动条
        container.style.overflowY = 'auto';
        // 隐藏水平滚动条，以防子元素意外超出容器宽度
        container.style.overflowX = 'hidden';

        // 使用 Flexbox 布局，使其子元素垂直堆叠，每行一个
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        // 确保子元素在水平方向上拉伸以填充容器宽度
        container.style.alignItems = 'stretch';
        // 为子元素之间添加一些间距，使它们更清晰地分开
        container.style.gap = '5px'; // 例如，每个子元素之间有10px的间距

        // 重要的：`box-sizing: border-box` 确保 padding 和 border 不会增加元素的总尺寸
        // 这对于 `max-width` 和 `max-height` 的精确计算很重要。
        container.style.boxSizing = 'border-box';

        // 可选：添加一些默认的视觉样式，方便观察和调试
        container.style.border = '1px solid #ccc';
        container.style.padding = '5px'; // 容器内边距
        container.style.backgroundColor = '#f0f0f0';
        container.style.borderRadius = '5px'; // 圆角

        // 4. 将子元素添加到容器中
        elementsArray.forEach((element, index) => {
            if (element instanceof HTMLElement) {
                // 同样为子元素设置 `box-sizing`，确保它们也遵循相同的盒模型规则
                element.style.boxSizing = 'border-box';
                // 如果子元素本身没有设置宽度，并且你想确保它填满容器的可用宽度，
                // 那么 `align-items: stretch` 会处理大部分情况，
                // 但如果子元素是 `inline` 或有其他 `width` 设置，你可能需要强制设置。
                // element.style.width = '100%'; // 通常 Flexbox `align-items: stretch` 就够了

                container.appendChild(element);
            } else {
                console.warn(`Skipping element at index ${index} because it is not a valid HTMLElement:`, element);
            }
        });

        // 5. 返回创建的容器
        return container;
    }

    //在车辆损失页面添加风险提示
    async showriskwarning() {

        if (!this.iframeDocument.querySelector('button#riskWarningButton')) return;

        //设置悬浮提示绑定的元素,导航栏第4个元素
        const hover_node = this.navbar.querySelectorAll('li')[3]
        const bpmitem = this.bpmitem
        const url = `/claim/prplriskwarningController.do?goNewRiskWarning&registNo=${bpmitem.registNo}&taskCatalog=${bpmitem.taskCatalog}&lossApprovalId=${bpmitem.businessKey}&taskId=${bpmitem.taskId}&userCode=${bpmitem.userCode}&accidentNo=${bpmitem.accidentNo}`
        const doc = await httpRequest(url).then(resp => resp.html())

        let carLeakageRiskInfo = doc.querySelector('#carLeakageRiskInfo')
        if (carLeakageRiskInfo) { carLeakageRiskInfo = carLeakageRiskInfo.parentElement }
        const fraudRiskInfo = doc.querySelector('#fraudRiskInfo').parentElement
        const carRiskInfo = doc.querySelector('#carRiskInfo').parentElement
        const driverRiskInfo = doc.querySelector('#driverRiskInfo').parentElement
        const registRiskInfo = doc.querySelector('#registRiskInfo').parentElement
        // const payInfoSize = html.querySelector('#payInfoSize').parentElement
        const platFormHintVehicleInfo = doc.querySelector('#platFormHintVehicleInfo').parentElement
        let appendInsuranceInfo = doc.querySelector('#appendInsuranceInfo')
        if (appendInsuranceInfo) { appendInsuranceInfo = appendInsuranceInfo.parentElement }

        const divlist = []
        if (carLeakageRiskInfo && carLeakageRiskInfo.querySelectorAll('tr').length > 1) { divlist.push(carLeakageRiskInfo) }
        if (fraudRiskInfo.querySelectorAll('tr').length > 1) { divlist.push(fraudRiskInfo) }
        if (carRiskInfo.querySelector('a')) { divlist.push(carRiskInfo) }
        if (driverRiskInfo.querySelector('a')) { divlist.push(driverRiskInfo) }
        if (registRiskInfo.querySelector('a')) { divlist.push(registRiskInfo) }
        // if (payInfoSize.querySelector('a')) { divlist.push(payInfoSize) }
        if (platFormHintVehicleInfo.querySelectorAll('tr').length > 1) { divlist.push(platFormHintVehicleInfo) }
        if (appendInsuranceInfo && appendInsuranceInfo.querySelectorAll('tr').length > 1) { divlist.push(appendInsuranceInfo) }

        const Container = Navbar.createContainer(divlist)


        HoverTip(this.iframe, hover_node, Navbar.Atag2Span(Container).outerHTML)





    }

    async showpolicy(){
        const atag_policy=this.navbar.querySelector('a[addtabs="addTabpolicyInfo"]');
        const policyurl=JSON.parse(atag_policy.getAttribute('data-options')).url;
        //设置悬浮提示绑定的元素
        const hover_node = atag_policy.parentElement
        const url = `/claim/${policyurl}`
        console.log('保单链接',url)
        const doc = await httpRequest(url).then(resp => resp.html())

        
        const PolicyBaseInfo_Elements = doc.querySelector("div#UIPolicyBaseInfo")
        const CarInfo_Elements = doc.querySelector("div#UIInsuredCarInfo")
        const ItemKindInfo_Elements = doc.querySelector("div#UIItemKindInfo")
        const SpecialProv_Elements = doc.querySelector("div#UISpecialProv")

        const divlist = []
        if (PolicyBaseInfo_Elements) { divlist.push(PolicyBaseInfo_Elements) }
        if (CarInfo_Elements) { divlist.push(CarInfo_Elements) }
        if (ItemKindInfo_Elements) { divlist.push(ItemKindInfo_Elements) }
        if (SpecialProv_Elements) { divlist.push(SpecialProv_Elements) }
        const Container = Navbar.createContainer(divlist)
        HoverTip(this.iframe, hover_node, Navbar.Atag2Span(Container).outerHTML)
    }

}

/**
 * 合并并去重配件编码数据
 * @param {Array[]} [localData=[]] - 本地存储的二维数组数据（CSV_配件编码）
 * @param {Array[]} [externalData=[]] - 外部获取的二维数组数据
 * @returns {Array[]} 去重后的合并数据
 */
function mergeAndDeduplicate(localData = [], externalData = []) {
	// 类型安全检查
	if (!Array.isArray(localData)) localData = [];
	if (!Array.isArray(externalData)) externalData = [];

	// 合并数据
	const mergedData = [...localData, ...externalData];

	// 使用 Map 按指定字段组合键去重
	const uniqueMap = new Map();

	mergedData.forEach(row => {
		// 验证行数据是否包含所需字段
		if (!Array.isArray(row) || row.length < 15) return;

		// 提取并清洗关键字段（row[2], row[10], row[11], row[13], row[14]）
		const keyParts = [2, 10, 11, 13, 14].map(index => {
			const field = row[index]?.toString() || '';
			return field.replace(/[\s\-\/\\]/g, '');
		});

		// 生成复合键
		const key = keyParts.join('|');

		// 通过键保存首次出现的数据
		if (key && !uniqueMap.has(key)) {
			uniqueMap.set(key, row);
		}
	});

	// 返回去重后的数组
	return Array.from(uniqueMap.values());
}



//```````````````````测试`````````````


initialize()


// 页面加载完成后启动监控
Common.monitorIframes()

const toastr = Common.toast();


(function () {
	"use strict";


	// 检查是否是指定的URL
	const urls = ["claim/casLoginController.do?newlogin", "/claim/synergismOpenClaimController.do"]
	if (!urls.some(url => window.location.href.includes(url))) {
		return;
	}

	const autoClicker = Modules.startAutoClick();
	// Common.CreateBTN()



	const iframe_TopMSG = document.querySelector("iframe#Top_Message");
	if (iframe_TopMSG) {
		//iframe_TopMSG加载后执行新增控件
		iframe_TopMSG.onload = function () {


			Common.handle_iframe_Top_Message(iframe_TopMSG)


			const ConfigWidget = new MultiTabFloater(iframe_TopMSG)
			// 测试添加一个选项卡
			ConfigWidget.addTab('数据更新', (contentContainer) => {
				const 数据更新 = Createconfigdiv()
				contentContainer.appendChild(数据更新)
			});

			ConfigWidget.addTab('案件区域', (contentContainer) => {
				const 案件区域 = Modules.filterconfiger({ checkedareas: myconfig.areas, tailNo: myconfig.tailNo, publicNo: myconfig.publicNo })
				contentContainer.appendChild(案件区域)
			});

			ConfigWidget.addTab('案件号转事故号', (contentContainer) => {
				const div_案件号转换 = Modules.div_registNo2accidentNo()
				contentContainer.appendChild(div_案件号转换)
			});

		};
	}




})();
