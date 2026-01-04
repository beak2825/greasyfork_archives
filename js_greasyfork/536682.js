// ==UserScript==
// @name         大地维修厂管理系统页面优化
// @namespace    https://claim.ccic-net.com.cn
// @icon         https://sso.ccic-net.com.cn/casserver/favicon.ico
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @version      0.1.9.4
// @description  维修厂系统自动化填写
// @author       zexjpg
// @match        http://claim.ccic-net.com.cn:35003/claimfactorysys/casLoginController.do?newlogin
// @grant        GM_notification
// @grant        GM_closeNotification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow


// @connect      *
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/536682/%E5%A4%A7%E5%9C%B0%E7%BB%B4%E4%BF%AE%E5%8E%82%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536682/%E5%A4%A7%E5%9C%B0%E7%BB%B4%E4%BF%AE%E5%8E%82%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var elmGetter = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = 'css';
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector ||
        elProto.mozMatchesSelector || elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;
    let defaultTimeout = 0;
    let defaultOnTimeout = () => null;
    function addObserver(target, callback) {
        const observer = new MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target, 'attr');
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node, 'insert');
                    if (observer.canceled) return;
                }
            }
        });
        observer.canceled = false;
        observer.observe(target, {childList: true, subtree: true, attributes: true});
        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }
    function addFilter(target, filter) {
        let listener = listeners.get(target);
        if (!listener) {
            listener = {
                filters: new Set(),
                remove: addObserver(target, (el, reason) => listener.filters.forEach(f => f(el, reason)))
            };
            listeners.set(target, listener);
        }
        listener.filters.add(filter);
    }
    function removeFilter(target, filter) {
        const listener = listeners.get(target);
        if (!listener) return;
        listener.filters.delete(filter);
        if (!listener.filters.size) {
            listener.remove();
            listeners.delete(target);
        }
    }
    function query(selector, parent, root, curMode, reason) {
        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? parent : null;
                const checkParent = parent !== root && matches.call(parent, selector);
                return checkParent ? parent : parent.querySelector(selector);
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? $(parent) : null;
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return jNodes.length ? $(jNodes.get(0)) : null;
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                return ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 9, null).singleNodeValue;
            }
        }
    }
    function queryAll(selector, parent, root, curMode, reason) {
        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? [parent] : [];
                const checkParent = parent !== root && matches.call(parent, selector);
                const result = parent.querySelectorAll(selector);
                return checkParent ? [parent, ...result] : [...result];
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? [$(parent)] : [];
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return $.map(jNodes, el => $(el));
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                const xPathResult = ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 7, null);
                const result = [];
                for (let i = 0; i < xPathResult.snapshotLength; i++) {
                    result.push(xPathResult.snapshotItem(i));
                }
                return result;
            }
        }
    }
    function isJquery(jq) {
        return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }
    function getOne(selector, parent, timeout) {
        const curMode = mode;
        return new Promise(resolve => {
            const node = query(selector, parent, parent, curMode);
            if (node) return resolve(node);
            let timer;
            const filter = (el, reason) => {
                const node = query(selector, el, parent, curMode, reason);
                if (node) {
                    removeFilter(parent, filter);
                    timer && clearTimeout(timer);
                    resolve(node);
                }
            };
            addFilter(parent, filter);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    removeFilter(parent, filter);
                    const result = defaultOnTimeout(selector);
                    if (result !== void 0) resolve(result);
                }, timeout);
            }
        });
    }
    return {
        get currentSelector() {
            return mode;
        },
        get(selector, ...args) {
            let parent = typeof args[0] !== 'number' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const timeout = args[0] || defaultTimeout;
            if (Array.isArray(selector)) {
                return Promise.all(selector.map(s => getOne(s, parent, timeout)));
            }
            return getOne(selector, parent, timeout);
        },
        each(selector, ...args) {
            let parent = typeof args[0] !== 'function' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const callback = args[0];
            const curMode = mode;
            const refs = new WeakSet();
            for (const node of queryAll(selector, parent, parent, curMode)) {
                refs.add(curMode === 'jquery' ? node.get(0) : node);
                if (callback(node, false) === false) return;
            }
            const filter = (el, reason) => {
                for (const node of queryAll(selector, el, parent, curMode, reason)) {
                    const _el = curMode === 'jquery' ? node.get(0) : node;
                    if (refs.has(_el)) break;
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return removeFilter(parent, filter);
                    }
                }
            };
            addFilter(parent, filter);
        },
        create(domString, ...args) {
            const returnList = typeof args[0] === 'boolean' && args.shift();
            const parent = args[0];
            const template = doc.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild;
            if (!node) return null;
            parent ? parent.appendChild(node) : node.remove();
            if (returnList) {
                const list = {};
                node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                list[0] = node;
                return list;
            }
            return node;
        },
        selector(desc) {
            switch (true) {
                case isJquery(desc):
                    $ = desc;
                    return mode = 'jquery';
                case !desc || typeof desc.toLowerCase !== 'function':
                    return mode = 'css';
                case desc.toLowerCase() === 'jquery':
                    for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                        if (isJquery(jq)) {
                            $ = jq;
                            break;
                        }
                    }
                    return mode = $ ? 'jquery' : 'css';
                case desc.toLowerCase() === 'xpath':
                    return mode = 'xpath';
                default:
                    return mode = 'css';
            }
        },
        onTimeout(...args) {
            defaultTimeout = typeof args[0] === 'number' && args.shift() || defaultTimeout;
            defaultOnTimeout = args[0] || defaultOnTimeout;
        }
    };
}();

const $ = (selector, context = document) => context.querySelector(selector);

const style = {}

const utils = {};
/**
 * 发起异步HTTP请求，支持GET/POST，自动处理请求头和响应解析
 * @param {string} url - 请求目标URL
 * @param {Object|string} [data=""] - 表单数据，将作为x-www-form-urlencoded发送
 * @param {Object} [json=""] - JSON数据，将作为application/json发送
 * @param {Object} [headers={}] - 自定义请求头
 * @returns {Promise<Object|Document>} 返回JSON对象或HTML文档（根据响应Content-Type决定）
 */
utils.httpRequest = async function (url, data = "", json = "", headers = {}) {
	const options = {
		//如果data或json不为空，则为POST请求，否则为GET请求
		method: data || json ? "POST" : "GET",
		credentials: "include",
		headers: {
			...headers,
			"Content-Type": data
				? "application/x-www-form-urlencoded"
				: json
				? "application/json;charset=UTF-8"
				: "text/html",
		},
	};

	if (data) {
		options.body = new URLSearchParams(data).toString();
	}

	if (json) {
		options.body = JSON.stringify(json);
		//   options.body = new URLSearchParams(json).toString();
	}

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			const errorInfo = await response.json();
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorInfo.message}`
			);
		}

		// 根据 Content-Type 返回对应格式
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			return await response.json();
		} else {
			const text = await response.text();
			const parser = new DOMParser();
			return parser.parseFromString(text, "text/html");
		}
	} catch (error) {
		throw error;
	}
};

/**
 * 异步查询DOM元素，支持动态加载和超时控制
 * @param {string} selector - 要查询的CSS选择器
 * @param {Object} [options] - 配置选项
 * @param {number} [options.timeout=5000] - 超时时间（毫秒）
 * @param {HTMLElement} [options.parent=document] - 父级容器元素
 * @returns {Promise<HTMLElement>} 返回包含元素的Promise，超时或失败时拒绝
 */
utils.async_querySelector = function (
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
			reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
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
};

/**
 * 监控页面中所有 iframe 的加载、添加和移除事件
 * 使用 elmGetter 替代原生 MutationObserver 实现
 */
utils.monitorIframes = function () {
    // 新增：使用Set存储已观察的iframe
    const observedIframes = new Set();
    
    // 监控 iframe 的加载完成事件
    function bindIframeLoadEvent(iframe) {
        if (observedIframes.has(iframe)) return;
        observedIframes.add(iframe);

        iframe.addEventListener("load", () => {
            console.debug("iframe 加载完成:", iframe);
            initiframe_edit(iframe)
            initiframe_view(iframe)
            initiframe_pad(iframe)
        });

        if (iframe.contentDocument?.readyState === "complete") {
            console.debug("iframe 已缓存加载完成:", iframe,iframe.name);
        }
    }

    // 使用 elmGetter 监听 iframe 添加
    elmGetter.each('iframe', document.body, (node, isInsert) => {
        if (isInsert) {
            console.debug("iframe 被添加:", node);
            bindIframeLoadEvent(node);
        }
    });

    // ✅ 新增：立即处理初始加载的iframe
    document.querySelectorAll('iframe').forEach(bindIframeLoadEvent);
    console.log("开始监控 iframe 的动态生成、移除及加载事件...");
}

/**
 * Toast消息提示功能封装
 *
 * 实现特性：
 * - 自动创建样式表和容器
 * - 支持info/success/warning/error四种消息类型
 * - 自动消失功能（3秒，支持鼠标悬停暂停）
 * - 渐入渐出动画效果
 * - 多消息堆叠展示
 *
 * @returns {Object} 包含四种消息类型方法的对象
 */
utils.toast = function () {
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
};


/**
 * 获取iframe内容文档对象（Promise形式）
 * @param {HTMLIFrameElement} iframe - 目标iframe元素
 * @returns {Promise<Document>} 解析为iframe内容文档的Promise
 * @rejects {Error} 当iframe加载超时时拒绝
 */
utils.getIframeDocument = function (iframe) {
    return new Promise((resolve, reject) => {
        // 立即处理已加载完成的情况
        if (iframe.contentDocument?.readyState === "complete") {
            resolve(iframe.contentDocument);
            return;
        }

        // 定义加载完成处理函数
        const loadHandler = () => {
            iframe.removeEventListener("load", loadHandler);
            resolve(iframe.contentDocument);
        };

        // 设置超时保护机制
        const timeoutId = setTimeout(() => {
            iframe.removeEventListener("load", loadHandler);
            reject(new Error("Iframe load timeout"));
        }, 5000);

        // 注册加载事件监听
        iframe.addEventListener("load", loadHandler);

        // 处理添加监听前已加载完成的特殊情况
        if (iframe.contentDocument.readyState === "complete") {
            clearTimeout(timeoutId);
            loadHandler();
        }
    });
};

// 延迟方法
utils.sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// 修改后的重试查询方法
utils.retryQuery = async function (queryFn, retries = 3, delay = 500) {
	// 封装原生setTimeout为Promise
	const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

	for (let i = 1; i <= retries; i++) {
		try {
			const result = await queryFn();
			if (result) return result;
			console.debug(`第 ${i} 次重试未找到元素`);
		} catch (e) {
			console.warn(`第 ${i} 次查询失败:`, e.message);
		}
		await wait(delay);
	}
	throw new Error(`元素未找到，已重试 ${retries} 次`);
}


/**
 * 按顺序输出特定日期格式的工具函数
 * @returns {string} 每次调用按顺序返回：当前年最后一天 → 当前时间+9天 → 9999-01-01 → 循环
 */
utils.getRotatingDate = (function() {
    let counter = 0;
	const day = 9
    // const formatDate = (date) => date.toISOString().split('T')[0];

	const formatDate = (date) => {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			"0"
		)}-${String(date.getDate()).padStart(2, "0")}`;
	};

    return function() {
        const now = new Date();
        let result;
        
        switch(counter % 3) {
            case 0: // 当前年最后一天
                result = new Date(now.getFullYear(), 11, 31);
                break;
            case 1: // 当前时间+9天
                result = new Date(now);
                result.setDate(now.getDate() + day);
                break;
            case 2: // 固定日期
                result = '9999-01-01';
                counter = -1; // 重置计数器
                break;
        }
        
        counter++;
        return typeof result === 'string' ? result : formatDate(result);
    };
})();

/**
 * 创建日期快捷设置链接
 */
function createDateShortcutLink(iframe) {

	const iframeDocument = iframe.contentDocument;
    const $ = (selector) => iframeDocument.querySelector(selector);
    // 查找目标输入框
    const dateInput = $('#channelEndDate');
    if (dateInput) {

		let linkdate = utils.getRotatingDate()

		// 创建链接元素
		const link = iframeDocument.createElement('a');
		link.style.cssText = 'margin-left:10px; color:#2196F3; cursor:pointer; text-decoration:underline;';
		// link.className = 'dan-btn'; // 使用页面已有样式
		link.innerHTML = `📅 ${linkdate}`;
		
		// 点击事件处理
		link.addEventListener('click', () => {
			// dateInput.value = linkdate;
			linkdate = utils.getRotatingDate()
			const islong = iframe.contentDocument.querySelector("#longTimeFlag").checked
			if (linkdate == '9999-01-01'){
				if (!islong) {$("#longTimeFlag").click()
				}
			}
			else  {
				if (islong) {$("#longTimeFlag").click()
				}
			}
			link.innerHTML = `📅 ${linkdate}`;
			dateInput.value = linkdate;
			linkdate = utils.getRotatingDate()
		});

		// 添加到最近的父元素td
		const parentTd = dateInput.closest('td');
		if (parentTd) {
			parentTd.appendChild(link);
		}
	}

	const targetBtn = iframeDocument.querySelector("#addRowBtn3");
    
    if (targetBtn) {
		// 创建新按钮
		const newBtn = document.createElement('a');
		newBtn.className = targetBtn.className; // 继承原按钮样式
		newBtn.style.marginRight = "10px"; // 添加右边距分隔按钮
		newBtn.innerHTML = '<span class="l-btn-left">填充工时</span>';

		// 插入到原按钮前
		targetBtn.parentNode.insertBefore(newBtn, targetBtn);
		newBtn.addEventListener('click', async () => {
			const is4s = iframeDocument.querySelector("#type4sY").checked
			processRuleLists(iframeDocument,is4s)
		});
	}
};

// 新增重试查询方法
async function retryQuery(queryFn, retries = 3, delay = 500) {
	for (let i = 0; i < retries; i++) {
		try {
			const result = await queryFn();
			if (result) return result;
		} catch (e) {/* 忽略错误 */}
		await utils.sleep(delay);
	}
	throw new Error(`Element not found after ${retries} retries`);
}


//自动化点击流程,在修理厂编辑页面使用
async function autofill(iframe) {
    const iframeDocument = iframe.contentDocument;
    const $ = (selector) => iframeDocument.querySelector(selector);

    // 使用 elmGetter 简化元素查找
    $("#virtualN").click();
    $("#isCooperationN").click();
    const is4s = $("#type4sY").checked;

    // if (!is4s){
	// 	$("#longTimeFlag").click(); //规则时间,长期
	// }else {
	// 	$("#channelEndDate").value = "2025-12-31"; //日期,点击长期时该位置不可用 readonly
	// }
    $("#longTimeFlag").click(); //规则时间,长期
    
    // 使用 Promise 链优化
    await elmGetter.get("#_easyui_combobox_i6_2", iframeDocument, 3000)
        .then(el => el.click())
        .catch(() => console.warn("品牌价元素未找到"));

    //直供管理费率,录入40
    $("#prpLmanagefeeRatePageList\\[1\\]\\.straightManageRate").value = 40; 
    $("#ruleExplain").value = "新增"; //规则说明,录入新增
    $("#applyRemark").value = "新增"; //申请说明,录入新增

    await elmGetter.get("#comCNameShow1", iframeDocument, 3000)
        .then(el => el.nextElementSibling.querySelector("a").click())
        .then(() => elmGetter.get("#datagrid-row-r1-2-0", iframeDocument, 3000))
        .then(el => el.click())
        .catch(() => console.warn("公司名称选择失败"));

    //点击省份下拉链接
    await elmGetter.get("#cataPovince", iframeDocument, 3000)
        .then(el => el.nextElementSibling.querySelector("a").click())
        .then(() => elmGetter.get("#_easyui_combobox_i2_19", iframeDocument, 3000))
        .then(el => el.click())
        .catch(() => console.warn("省份选择失败"));

    // 点击城市下拉链接
    await elmGetter.get("#cataCity", iframeDocument, 3000)
        .then(el => el.nextElementSibling.querySelector("a").click())
        .then(() => elmGetter.get("#_easyui_combobox_i3_1", iframeDocument, 3000))
        .then(el => el.click())
        .catch(() => console.warn("城市选择失败"));

    // // 点击区域
    // await elmGetter.get("#countyCode", iframeDocument, 3000)
    //     .then(el => el.nextElementSibling.querySelector("a").click())
    //     .then(() => elmGetter.get("#_easyui_combobox_i4_4", iframeDocument, 3000))
    //     .then(el => el.click())
    //     .catch(() => console.warn("区域选择失败"));

    // $("#cataAddress").value = "-"; //地址栏,详细地址

    $("#cataAddress").value = $("#cataAddress").value == "" ? "-" : $("#cataAddress").value;
    $("#addRowBtn3").click();


    //点击添加工时列表

    await elmGetter.get('iframe[name="seriesGroupfeeRuleSelectId"]')
    .then(iframe => {
        return utils.getIframeDocument(iframe);
    })
    .then(iframeDoc => {
    iframeDoc.querySelector("#allchecked").click();
    
    if (iframeDoc.querySelector("#allchecked").checked) {
        const closestTable = iframeDoc.defaultView.frameElement
        .closest("table");
        closestTable.querySelector("input").click();
    }
    })
    .catch(error => {
    console.error("[添加工时列表]流程执行失败:", error);
    });

    processRuleLists(iframeDocument,is4s)


    //填充空白折扣
    fill_discount(iframe)

}

async function processRuleLists(iframeDocument,is4s=true) {
	const RuleLists = iframeDocument.querySelectorAll('#feeRule2_mainRow [id^="prpLseriesGroupfeeRulePageList"][id$="discountLevel"]');
	
	// 转换为数组处理
	const elementsArray = Array.from(RuleLists);

	// 使用 for...of 实现顺序执行
	let i = 0;
	for (const element of elementsArray) {
		try {
			i++;
			console.debug(`正在处理: ${i}`);

			// await utils.delay(100);
			await element.click();

			// 等待后续流程执行完成
			await clickrepairgroup(is4s);
			
			// 可选：添加间隔防止操作过快
			await utils.sleep(100);
		} catch (error) {
			console.error(`处理元素时出错: ${error.message}`);
			// 根据需求决定是否继续执行
			// throw error; // 如果要终止流程
		}
	}
}
async function clickrepairgroup(is4s=true) {
	
	// const groupname=is4s?'广东服务站工时标准202004':'广东综修厂工时标准202004'
	const groupname=is4s?'广东分公司服务站通用工时标准--202505':'广东分公司综修厂通用工时标准--202505'
	const groupname2025=is4s?'广东分公司服务站通用工时标准-202505':'广东分公司综修厂通用工时标准-202505'
	let iframeDoc;


		// 修改后的调用方式
	const element = await retryQuery(async () => {
        const iframe = await elmGetter.get('iframe[name="getSeriesGroupFeeRuleId"]');
		iframeDoc = await utils.getIframeDocument(iframe);
		
		const targetNames = ['广东特货车工时标准202003', '广东特货车工时标准--202003',groupname,groupname2025];
		const elements = iframeDoc.querySelectorAll('td[field="schemeName"] div');
		
		for (const el of elements) {
			if (targetNames.includes(el.textContent?.trim())) {
				console.debug(`找到匹配方案: ${el.textContent}`);
				return el;
			}
		}
		return null; // 显式返回null表示未找到
	}, 3, 500);
	if (element) {
		await utils.sleep(10);
		element.click();
		//延迟1秒
		await utils.sleep(10);
		
		// 获取 closestTable
		const closestTable = iframeDoc.defaultView.frameElement.closest("table");
		closestTable.querySelector("input").click();
		

	}


}

// 在iframe中添加自动化点击按钮
function addinitBTN(iframe) {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

const minimizeIcon = document.createElement('div');
	const styleObj = {
		fontSize: '18px',
		width: '25px',
		height: '25px',
		backgroundColor: '#007bff',
		borderRadius: '50%',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
		color: 'white'
	};
	Object.assign(minimizeIcon.style, styleObj);
	minimizeIcon.innerHTML = '🚗'
    
    // 现在可以安全地添加到目标位置
    const positiontd = iframeDocument.querySelector("#type4sN").closest('td');
    positiontd.appendChild(minimizeIcon);

    //开始初始化填写,包括修改原来的管理费费率

        //直供管理费率,录入40
    iframeDocument.querySelector(
        "#prpLmanagefeeRatePageList\\[1\\]\\.straightManageRate"
    ).value = 40; 
    //点选不调级
    const isChangeGradeN = iframeDocument.querySelector("#isChangeGradeN")
    if(isChangeGradeN){isChangeGradeN.click()}



	// 点击按钮展开对应动作
	minimizeIcon.addEventListener("click", function () {
		autofill(iframe)
		// processRuleLists(iframeDocument)

	});

}

// 在iframe中添加待处理点击按钮
function addBTN_tudo(iframe) {
	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const $ = (selector) => iframeDocument.querySelector(selector);
	positiontd=$("#applyRemark").closest('td');

	// 创建小图标
	const minimizeIcon = document.createElement('div');
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
	minimizeIcon.innerHTML = '待'


	// iframeDocument.body.appendChild(minimizeIcon);
	positiontd.appendChild(minimizeIcon);

	// // 点击按钮展开对应动作
	// minimizeIcon.addEventListener("click", function () {
    //     auto_fill_tudo(iframe) 

	// });

	minimizeIcon.addEventListener("click", () => {
		auto_fill_tudo(iframe) 
	});


    function auto_fill_tudo(iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const $ = (selector) => iframeDocument.querySelector(selector);
        $("#applyRemark").value = "非合作调整折扣";

		//直供管理费率,录入40
		$("#prpLmanagefeeRatePageList\\[1\\]\\.straightManageRate").value = 40; 
		//点选不调级
		const isChangeGradeN = $("#isChangeGradeN")
		if(isChangeGradeN){isChangeGradeN.click()}

		const e開始时间=$("#prpLfactoryCarBrandAuthInfoPageList\\[0\\]\\.authStartDate")
		const e結束时间=$("#prpLfactoryCarBrandAuthInfoPageList\\[0\\]\\.authEndDate")
		if(e開始时间&&e開始时间.value==""){e開始时间.value="2025-01-01"}
		if(e結束时间&&e結束时间.value==""){e結束时间.value="2025-12-31"}

}

}

// 填写空白折扣
function fill_discount(iframe){
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    //填充空白折扣
    const zhekouinputs=iframeDocument.querySelectorAll('input[id$="iscount"]:not([readonly])')
    zhekouinputs.forEach((input)=>{
        if(input.value==""){input.value=100}
    })
}

function fill_authdate(iframe,StartDate="2025-01-01",EndDate="2025-12-31") {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    //填写授权起止时间
    const trs=iframeDocument.querySelectorAll("#carBrandAuthInfo_mainRow tr")
    trs.forEach((tr)=>{
        const authStartDate = tr.querySelector("input[id$='authStartDate']");
        const authEndDate = tr.querySelector("input[id$='authEndDate']");
        if(authStartDate&&authEndDate){ 
            if(authStartDate.value === "")authStartDate.value=StartDate
            if(authEndDate.value === "")authEndDate.value=EndDate
        }
    })
}

// 创建按钮快捷链接
function handlerUI(iframe) {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let btntemplate = iframeDocument.querySelector("button#addRowBtn4")
    const btn_ahthdatafill = iframeDocument.createElement("a");
    btn_ahthdatafill.textContent = "填写空白值";
    btn_ahthdatafill.addEventListener("click", () => { 
        fill_authdate(iframe)
        fill_discount(iframe)
    });
    btn_ahthdatafill.className = btntemplate.className
    btn_ahthdatafill.title = "默认开始时间:2025-01-01,结束:2025-12-31,默认折扣:100"
    btntemplate.parentNode.insertBefore(btn_ahthdatafill, btntemplate);




}


//在修理厂信息iframe内初始化
function initiframe_edit(iframe) {
	if (!(iframe.name && iframe.name =='factoryMainEditId')){return}
	addinitBTN(iframe)
	
	createDateShortcutLink(iframe)

	addBTN_tudo(iframe)

    handlerUI(iframe)

}

// 在一个无法修改的修理厂iframe内新增一个照片上传的连接
function initiframe_view(iframe) {
	if (!(iframe.name && iframe.name =='factoryMainViewId')){return}
	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

	//创建一个上传文件的连接,在[单证查看]的后面添加这个元素
	const link = iframeDocument.createElement('a');
	link.href = "javascript:uploadCertifyOpt('CLRole01');";
	link.className = "dan-btn";
	link.textContent = "单证上传";
	const positiontd=iframeDocument.querySelector("#factoryName").closest('td');
	positiontd.appendChild(link);

    //自动填写折扣
    const inputs=iframeDocument.querySelectorAll('input[id$="iscount"]')
    inputs.forEach((input)=>{
        if(input.value==""){input.value=100}
    })



}

async function initiframe_pad(iframe) {
	// if (!(iframe.name && iframe.name =='factoryMainEditId')){return}
	if (!(iframe.src && iframe.src.includes('isIframe') && iframe.src.includes('clickFunctionId'))) { return }
	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
	
	//点击归属机构
	comCode = iframeDocument.querySelector("#comCodeShow").nextElementSibling.querySelector("a"); 
	comCode.click();
	//点击广东分公司
    await elmGetter.get("#datagrid-row-r1-2-0",iframeDocument)
    .then((element)=>{element.click()})

}




// 循环检查退回
async function 循环检查退回(delay = 300000) {

    function json2list(data) {
        const list = [];
        data.rows.forEach(element => {
            list.push(`${element.factoryName} ${element.operateTimeForHis}`)
        });
        return list
    }

    //遍历检查第二个数组的元素不在第一个数组内,获取不在的元素,输出一个新数组
    function getNotInArray(pre, now) {
        const prerows = json2list(pre)
        const nowrows = json2list(now)
        const result = [];
        nowrows.forEach(element => {
            if (!prerows.includes(element)) {
                result.push(element);
            }
        });
        return result;
    }

    function notification(pre, now) {
        const result = getNotInArray(pre, now);
        if (result.length > 0) {
            const message = `${result.join('\n')}`;
            console.log(message);
            GM_notification({
                title: `新增${result.length}个回退`,
                text: message,
                timeout: 5000
            })
        }
    }

    //检查退回量
    async function checkrollback() {
        const url = '/claimfactorysys/factoryMainController.do?factoryMainQueryNew&field=factoryCode,factoryName,comCName,address,is4S,auditFrom,validStatus,validFlag,auditLevel,isCooperation,cooperateType,factoryOperate,taskCreatTime,operateTimeForHis&menutype=1'
        const data = { comCode: 44010000, validStatus: 3, rows: 50 }
        return utils.httpRequest(url, data)
    }

    const 原始退回 = await checkrollback()
    if (原始退回.total > 0) {
        原始退回list = json2list(原始退回)
        const title = `有${原始退回.total}个回退待处理`
        const msg = `${原始退回list.join('\n')}`
        console.log(msg)
        GM_notification({
            title: title,
            text: msg,
            timeout: 5000
        })
    }
    await utils.sleep(delay)
    while (true) {
        const 现有退回 = await checkrollback()
        console.log(`现有回退: ${现有退回.total}`)
        const msg = notification(原始退回, 现有退回)
        if (msg) {
            // const msg = `新增${现有退回.total - 原始退回.total}个回退待处理`
            GM_notification({
                title: "有新增维修厂回退待处理",
                text: msg,
                timeout: 5000
            })
        }
        await utils.sleep(delay)

    }

}


(function () {
	"use strict";

	unsafeWindow.utils = utils;
	// unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
	// unsafeWindow.GM_setValue = GM_setValue;
	// unsafeWindow.GM_getValue = GM_getValue;
	// unsafeWindow.GM_notification = GM_notification;
	// unsafeWindow.GM_closeNotification = GM_closeNotification;
    utils.monitorIframes();
    const iframe_TopMSG = document.querySelector("iframe#Top_Message");
    unsafeWindow.iframe_TopMSG = iframe_TopMSG;
    循环检查退回()
})();






