// ==UserScript==
// @name         大地理赔北极星页面优化
// @namespace    https://claim.ccic-net.com.cn
// @icon         /favicon.ico
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @version      0.2.3
// @description  北极星版本,改版
// @author       sexjpg
// @match        https://claimcorein.ccic-net.com.cn/*
// @match        https://claimcore.ccic-net.com.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant       GM_notification
// @grant       GM_closeNotification
// @storageName   CCIC_Claim

// @connect      *

// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536939/%E5%A4%A7%E5%9C%B0%E7%90%86%E8%B5%94%E5%8C%97%E6%9E%81%E6%98%9F%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536939/%E5%A4%A7%E5%9C%B0%E7%90%86%E8%B5%94%E5%8C%97%E6%9E%81%E6%98%9F%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let myconfig;
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);
const dataseturl = 'https://cdn.jsdelivr.net/gh/sexjpg/CCIC_Helper@main/SCData.js'

if (typeof globalThis.BJX !== 'undefined') { globalThis.BJX = {} }
BJX = {}
BJX.getValue=GM_getValue
BJX.setValue=GM_setValue

// toast提示
function toast() {
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
      
      /* 不同类型颜色 *ss
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

function BJXRequests(url, data) {
	function getToken(cookieStr = document.cookie) {
		const TokenKey = "vue_admin_template_token";
		// 异常处理边界条件
		if (!cookieStr || cookieStr.length === 0) return undefined;

		const cookies = cookieStr.split(";").reduce((acc, current) => {
			const separatorIndex = current.indexOf("=");
			if (separatorIndex === -1) return acc; // 跳过非法格式

			const key = current.slice(0, separatorIndex).trim();
			const value = current.slice(separatorIndex + 1).trim();

			try {
				// 兼容URI编码存储
				acc[key] = decodeURIComponent(value);
			} catch (e) {
				acc[key] = value; // 保持原始值处理解码异常
			}
			return acc;
		}, {});

		return cookies[TokenKey] || undefined;
	}

	const headers = {};
	headers["Content-Type"] = "application/json";
	headers["Authorization"] = "Arch6WithCloud  " + getToken();
	headers["systemCode"] = "yjx_claim";
	headers["systemType"] = "CCX";
	headers["sec-fetch-dest"] = "empty";
	headers["sec-fetch-site"] = "same-origin";

	return new Promise((resolve, reject) => {
		fetch(url, {
			headers: headers,
			method: "POST",
			mode: "cors",
			credentials: "include",
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => resolve(data))
			.catch((error) => reject(error));
	});
}

// 案件列表类,未完成
class Casepad {
	constructor() {
		// 默认表头（可以根据 data 的 key 动态生成）
		this.headersCN = [
			"节点名称",
			"报案号",
			"承保机构",
			"被保险人",
			"出险时间",
			"流入时间",
			"损失金额",
		];
		this.defaultHeaders = this.translateList(this.headersCN);
		console.log(this.defaultHeaders);
		this.createTaskTable();
	}

	translateList(inputList) {
		const translatedList = [];
		const headersdic = {
			节点类型ID: "keyId",
			节点ID: "taskId",
			节点类型EN: "taskCatalog",
			节点名称EN: "taskType",
			任务状态码: "taskStatus",
			流入时间: "createTime",
			是否回退节点: "back",
			主事故号: "businessMainKey",
			事故号: "businessKey",
			任务状态: "businessStatus",
			承保机构代码: "comCode",
			出险时间: "damageStartTime",
			保单号: "policyNo",
			报案号: "registNo",
			报案时间: "reportDate",
			被保险人: "insuredName",
			标的车牌: "licenseNo",
			损失金额: "nfield1",
			滞留时间EN: "zlsj",
			滞留时间CN: "zlsjCN",
			估损金额: "sumClaim",
			结案金额: "sumPaid",
			承保机构: "comCName",
			节点名称: "taskTypeCN",
			任务状态: "taskStatusCN",
		};
		for (const header of inputList) {
			const translatedHeader = headersdic[header];
			if (translatedHeader) {
				translatedList.push(translatedHeader);
			} else {
				translatedList.push(header);
			}
		}

		return translatedList;
	}
	getodo(taskType = "BranchCarLossVerifyOne") {
		/**
		 * 获取待处理任务
		 * taskType任务类型:
		 * BranchCarLossVerifyOne   车损审核任务
		 * BranchPropLossVerifyOne  财产审核任务
		 * CarComponentAudit  验车验件任务
		 * BranchRiskAudit  风险审核任务
		 * CarOffer 报价任务
		 * BranchCarEstiAdjustAuditOne  估损调整审核任务
		 */
		const url =
			"https://claimcorein.ccic-net.com.cn/lpxtpt-server/xtptTaskAssign/taskQuery";
		const params = {
			registNo: "",
			policyNo: "",
			licenseNo: "",
			customerLevel: "",
			insuredName: "",
			claimCom: "",
			reportType: "",
			thirdReduceCaseType: "",
			riskCode: "",
			comCode: "",
			isAnyPay: "",
			isCata: "",
			reportTimeBegin: "",
			reportTimeEnd: "",
			damageStartTimeBegin: "",
			damageStartTimeEnd: "",
			createTimeEnd: "",
			createTimeBegin: "",
			systemType: "car",
			taskType: taskType,
			taskCatalog: "",
		};

		const data = {
			dataTablePageNum: 1,
			dataTablePageSize: 100,
			dataTablePageStart: 0,
			orderField: "",
			order: "ASC",
			queryparams: JSON.stringify(params),
		};

		return BJXRequests(url, data);
	}

	async getMultipleTasks() {
		const taskTypes = [
			"BranchCarLossVerifyOne",
			"BranchPropLossVerifyOne",
			"CarComponentAudit",
		];

		const results = [];

		for (const taskType of taskTypes) {
			try {
				const response = await this.getodo(taskType);
				if (response.statusText == "Success") {
					results.push(...response.data.data);
				}
			} catch (error) {
				console.error(`获取任务类型 ${taskType} 失败:`);
			}
		}
		return results;
	}

	createTaskTable() {
		// 创建主容器
		this.container = document.createElement("div");
		this.container.style.width = "100%";
		this.container.style.border = "1px solid #ddd";
		this.container.style.padding = "10px";
		this.container.style.boxSizing = "border-box";

		// 创建表格
		this.table = document.createElement("table");
		this.table.style.width = "100%";
		this.table.style.borderCollapse = "collapse";

		// 创建表头行
		const thead = document.createElement("thead");
		const headerRow = document.createElement("tr");

		// 创建可编辑的表头单元格
		// this.defaultHeaders.forEach(header => {
		this.headersCN.forEach((header) => {
			const th = document.createElement("th");
			th.contentEditable = "true";
			th.style.border = "1px solid #ddd";
			th.style.padding = "8px";
			th.textContent = header;
			th.addEventListener("input", (e) => {
				th.textContent = e.target.textContent;
			});
			headerRow.appendChild(th);
		});

		thead.appendChild(headerRow);
		this.table.appendChild(thead);

		// table.appendChild(tbody);
		this.datatbody = this.createdatatbody([]);
		this.table.appendChild(this.datatbody);
		this.container.appendChild(this.table);

		return this.container;
	}

	createdatatbody(data) {
		// 创建表格内容
		if (!data) return;
		const tbody = document.createElement("tbody");
		data.forEach((item) => {
			const row = document.createElement("tr");

			this.defaultHeaders.forEach((header) => {
				const td = document.createElement("td");
				td.style.border = "1px solid #ddd";
				td.style.padding = "8px";
				td.textContent = item[header] || ""; // 如果 key 不存在则显示空字符串
				row.appendChild(td);
			});

			tbody.appendChild(row);
		});
		return tbody;
	}

	async fleshdata() {
		const todotask = await this.getMultipleTasks();
		// 创建新的tbody元素
		const newTbody = this.createdatatbody(todotask);

		// 替换旧的tbody
		if (this.datatbody && this.table.contains(this.datatbody)) {
			this.table.replaceChild(newTbody, this.datatbody);
		} else {
			this.table.appendChild(newTbody);
		}

		// 更新引用
		this.datatbody = newTbody;
	}
}

//案件筛选模块
class CaseFilter {
	constructor() {
		this.UI();
	}
	static Configer(options = {}) {
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
				"营业部",
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

	static Handler() {
		const ths = $$(".el-table__header-wrapper th");
		const titles = [];
		ths.forEach((th) => {
			titles.push(th.textContent.trim());
		});

		const table = $(".el-table__body-wrapper table.el-table__body");
		const trs = $$("tr", table);
		trs.forEach((tr) => {
			const td_案件号 = tr.cells[titles.indexOf("报案号")];
			const td_承保公司 = tr.cells[titles.indexOf("承保机构")];
			const td_损失金额 = tr.cells[titles.indexOf("金额")];
			const td_出险时间 = tr.cells[titles.indexOf("出险时间")];
			const td_流入时间 = tr.cells[titles.indexOf("流入时间")];

			td_案件号.style.backgroundColor = "";
			td_承保公司.style.backgroundColor = "";
			tr.style.backgroundColor = "";

			// 处理案件号列
			if (td_案件号) {
				const caseNumber = td_案件号.querySelector("span").textContent.trim();

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
					td_案件号.closest("tr").style.backgroundColor = "rgb(200, 255, 237)";
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
					td_流入时间.title = `已滞留：${Math.round(timeDiff * 10) / 10}小时`; // 保留1位小数
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
					const timeDiff = (currentTime - damageTime) / (1000 * 60 * 60 * 24); // 计算天数差

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
						const ratio = (timeDiff - FRESH_DAYS) / (OLD_DAYS - FRESH_DAYS);
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

	UI() {
		const iframeDocument = document;

		// 创建小图标
		const minimizeIcon = document.createElement("div");
		minimizeIcon.style.position = "fixed";
		minimizeIcon.style.bottom = "100px";
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
		minimizeIcon.innerHTML = "🔍";

		iframeDocument.body.appendChild(minimizeIcon);
		const filterScheduler = this.Schedule(1000); // 每1秒执行一次
		let Schedulerstatus = true;
		filterScheduler.start();

		// 点击按钮展开对应动作
		minimizeIcon.addEventListener("click", function () {
			if (!Schedulerstatus) {
				filterScheduler.start(); // 启动定时器
				Schedulerstatus = true;
				minimizeIcon.style.backgroundColor = "#007bff";
			} else {
				filterScheduler.stop(); // 停止定时器
				Schedulerstatus = false;
				minimizeIcon.style.backgroundColor = "white";
			}
		});

		// 添加键盘监听
		function handleKeyPress(e) {
			// 检测左Alt + F 组合键
			if (
				e.altKey &&
				!e.ctrlKey &&
				!e.shiftKey &&
				e.key.toLowerCase() === "q"
			) {
				e.preventDefault();
				CaseFilter.Handler();
			}
		}

		// 绑定到iframe文档
		iframeDocument.addEventListener("keydown", handleKeyPress);

		// 清理时移除监听
		iframeDocument.addEventListener("unload", () => {
			iframeDocument.removeEventListener("keydown", handleKeyPress);
		});
	}

	Schedule(interval = 1000) {
		let timer = null; // 用于存储定时器ID
		let isRunning = false; // 标志位，确保只有一个定时器在运行

		// 启动定时器
		function start() {
			if (isRunning) {
				console.warn("定时器已经在运行中");
				return;
			}

			isRunning = true;
			timer = setInterval(() => {
				CaseFilter.Handler(); // 执行 filterCases 函数
			}, interval);

			console.log(`已启动定时器，每隔 ${interval} 毫秒执行一次 案件筛选函数`);
		}

		// 停止定时器
		function stop() {
			if (!isRunning) {
				console.warn("定时器未在运行中");
				return;
			}

			clearInterval(timer);
			isRunning = false;
			console.log("已停止定时器");
		}

		return {
			start,
			stop,
		};
	}
}

// 用于创建悬浮窗口的类
class MultiTabFloater {
	constructor(iframe = document, iconstr = "⚙️", options = {}) {
		// 默认配置
		this.config = {
			title: "悬浮窗",
			x: 50,
			y: 50,
			bx: 1,
			by: 1,
			...options,
		};

		// 获取 iframe 的 document 对象
		//iconstr可以用特殊符号⚙️🎛️🦉🌏🚗🏍️🧸🧱
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow?.document || document;

		// 创建图标按钮
		this.swastika = iframeDocument.createElement("div");
		this.swastika.innerHTML = iconstr;
		this.swastika.style.fontSize = "18px";
		this.swastika.style.position = "fixed";
		this.swastika.style.left = `${this.config.bx}px`;
		this.swastika.style.bottom = `${this.config.by}px`;
		this.swastika.style.height = "25px";
		this.swastika.style.width = "25px";
		// this.swastika.style.backgroundColor = '#007bff';
		this.swastika.style.borderRadius = "50%";
		this.swastika.style.display = "flex";
		this.swastika.style.alignItems = "center";
		this.swastika.style.justifyContent = "center";
		this.swastika.style.cursor = "pointer";
		this.swastika.style.zIndex = "1000";
		this.swastika.style.color = "#333";
		this.swastika.style.userSelect = "none";
		iframeDocument.body.appendChild(this.swastika);

		// 创建悬浮窗口
		this.modal = iframeDocument.createElement("div");
		this.modal.style.position = "fixed";
		this.modal.style.left = `${this.config.x}px`;
		this.modal.style.top = `${this.config.y}px`;
		this.modal.style.transform = "translate(-50%, -50%)";
		// this.modal.style.width = '600px'; // 设置宽度,不设置则自适应
		this.modal.style.maxWidth = "50vw";
		this.modal.style.maxHeight = "80vh";
		this.modal.style.backgroundColor = "#f9f9f9";
		this.modal.style.border = "1px solid #ddd";
		this.modal.style.borderRadius = "8px";
		this.modal.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
		this.modal.style.zIndex = "1001";
		this.modal.style.display = "none";
		this.modal.style.overflow = "auto";
		this.modal.style.transition = "transform 0.3s ease, opacity 0.3s ease";
		iframeDocument.body.appendChild(this.modal);

		// 创建标题栏
		this.header = iframeDocument.createElement("div");
		this.header.style.padding = "8px";
		this.header.style.backgroundColor = "#eee";
		this.header.style.borderBottom = "1px solid #ddd";
		this.header.style.cursor = "move";
		this.header.style.userSelect = "none";
		this.header.textContent = `${this.config.title}`; // 标题文字,空格占位，使标题栏高度不为 0
		this.modal.appendChild(this.header);

		// 创建关闭按钮
		this.closeButton = iframeDocument.createElement("div");
		this.closeButton.textContent = "×";
		this.closeButton.style.position = "absolute";
		this.closeButton.style.right = "10px";
		this.closeButton.style.top = "7px";
		this.closeButton.style.cursor = "pointer";
		this.closeButton.style.fontSize = "20px";
		this.closeButton.style.color = "#888";
		this.closeButton.style.border = "none";
		this.closeButton.style.borderRadius = "50%";
		// this.closeButton.style.backgroundColor = '#ff4444';
		this.closeButton.addEventListener("mouseenter", () => {
			this.closeButton.style.color = "#ff4444";
		});
		this.closeButton.addEventListener("mouseleave", () => {
			this.closeButton.style.color = "#888";
		});
		this.header.appendChild(this.closeButton);

		// 创建 Tab 容器
		this.tabContainer = iframeDocument.createElement("div");
		this.tabContainer.style.display = "flex";
		this.tabContainer.style.justifyContent = "space-around";
		this.tabContainer.style.gap = "0";
		this.tabContainer.style.backgroundColor = "#f1f1f1";
		this.tabContainer.style.borderBottom = "1px solid #ddd";
		this.modal.appendChild(this.tabContainer);

		// 创建内容容器
		this.contentContainer = iframeDocument.createElement("div");
		this.contentContainer.style.padding = "20px";
		this.contentContainer.style.fontSize = "14px";
		this.contentContainer.style.color = "#333";
		this.modal.appendChild(this.contentContainer);

		// 初始化 Tabs
		this.tabs = [];

		// 保存窗口位置
		this.modalPosition = { left: "5%", top: "20%" };

		// 绑定事件到 iframe 的文档
		const iframeWindow = iframe.contentWindow || iframe.defaultView;
		// const iframeDocument = iframeWindow.document;
		this.swastika.addEventListener("click", this.showModal.bind(this));
		this.closeButton.addEventListener("click", this.closeModal.bind(this));
		this.header.addEventListener("mousedown", this.startDrag.bind(this));
		iframeWindow.addEventListener("mousemove", this.onMouseMove.bind(this));
		iframeWindow.addEventListener("mouseup", this.stopDrag.bind(this));
	}

	// 显示悬浮窗口
	showModal() {
		this.swastika.style.display = "none"; // 隐藏卍字按钮
		this.modal.style.display = "block";
		this.modal.style.opacity = "0";
		this.modal.style.transform = "scale(0.9)";
		this.modal.style.left = this.modalPosition.left;
		this.modal.style.top = this.modalPosition.top;
		setTimeout(() => {
			this.modal.style.opacity = "1";
			this.modal.style.transform = "scale(1)";
		}, 10);
	}

	// 关闭悬浮窗口
	closeModal() {
		this.modal.style.opacity = "0";
		this.modal.style.transform = "scale(0.9)";
		setTimeout(() => {
			this.modal.style.display = "none";
			this.swastika.style.display = "flex"; // 重新显示卍字按钮
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
			offsetY: e.clientY - rect.top,
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
		this.modal.style.transform = "none";
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
		this.tabContainer.innerHTML = "";
		this.contentContainer.innerHTML = "";

		if (this.tabs.length === 0) {
			// 默认显示 Tab1 的内容
			this.contentContainer.textContent = "这是 Tab 1 的内容";
			return;
		}

		this.tabs.forEach((tab, index) => {
			const tabButton = this.tabContainer.ownerDocument.createElement("button");
			tabButton.textContent = tab.name;
			tabButton.style.flex = "1";
			tabButton.style.padding = "10px";
			tabButton.style.border = "none";
			tabButton.style.borderRadius = "0";
			tabButton.style.cursor = "pointer";
			tabButton.style.backgroundColor = "#ddd";
			tabButton.style.color = "#333";
			tabButton.style.transition =
				"background-color 0.3s ease, color 0.3s ease";
			tabButton.style.fontSize = "14px";
			tabButton.style.fontWeight = "bold";

			tabButton.addEventListener("click", () => this.selectTab(index));

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
		this.contentContainer.innerHTML = "";

		if (index >= 0 && index < this.tabs.length) {
			this.tabs.forEach((tab, i) => {
				const tabButtons = this.tabContainer.getElementsByTagName("button");
				if (i === index) {
					tabButtons[i].style.backgroundColor = "#007bff"; // 蓝色
					tabButtons[i].style.color = "#fff"; // 白色
					tab.content(this.contentContainer);
				} else {
					tabButtons[i].style.backgroundColor = "#ddd";
					tabButtons[i].style.color = "#333";
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
			miniIcon_text: "🎛️",
			title: "悬浮窗",
			x: 100,
			y: 100,
			bx: 1,
			by: 100,
			content: null,
			element: null,
			iframe: document,
			isdblclick: true,
			...options,
		};

		// 初始化状态
		this.isDragging = false;
		this.startX = 0;
		this.startY = 0;
		this.initialX = 0;
		this.initialY = 0;

		// 初始化 DOM 元素
		this.iframe = this.config.iframe || document;
		this.iframeDocument =
			this.iframe.contentDocument ||
			this.iframe.contentWindow?.document ||
			document;

		this._createElements();
		this._bindEvents();
	}

	_createElements() {
		// 创建主容器
		this.floatDiv = this.iframeDocument.createElement("div");
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
		this.titleBar = this.iframeDocument.createElement("div");
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
		this.titleText = this.iframeDocument.createElement("span");
		this.titleText.textContent = this.config.title;

		// 关闭按钮
		this.closeBtn = this.iframeDocument.createElement("button");
		this.closeBtn.textContent = "×";
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
		this.contentContainer = this.iframeDocument.createElement("div");
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
			this.miniIcon = this.iframeDocument.createElement("div");
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
		this.floatDiv.style.display = "none";
		if (this.miniIcon) this.miniIcon.style.display = "block";

		// 绑定元素交互
		if (this.config.element) {
			this.config.element.style.cssText = `
          cursor: pointer;
          user-select: none;
        `;
			const isdblclick = this.config.isdblclick ? "dblclick" : "click";
			this.config.element.addEventListener(isdblclick, () => this.show());
		}

		// 初始化内容
		if (this.config.content) {
			this.contentContainer.appendChild(this.config.content);
		}
	}

	_bindEvents() {
		// 拖动事件
		this.titleBar.addEventListener("mousedown", (e) => this._startDrag(e));
		this.iframeDocument.addEventListener("mousemove", (e) => this._drag(e));
		this.iframeDocument.addEventListener("mouseup", () => this._endDrag());

		// 关闭按钮
		this.closeBtn.addEventListener("click", () => this.hide());

		// 迷你图标切换
		if (this.miniIcon) {
			this.miniIcon.addEventListener("click", () => this.toggleVisibility());
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
		const shouldShow = this.floatDiv.style.display === "none";
		this.floatDiv.style.display = shouldShow ? "block" : "none";
		if (this.miniIcon)
			this.miniIcon.style.display = shouldShow ? "none" : "block";
	}

	setContent(element) {
		this.contentContainer.innerHTML = "";
		this.contentContainer.appendChild(element);
	}

	show() {
		this.floatDiv.style.display = "block";
		if (this.miniIcon) this.miniIcon.style.display = "none";
	}

	hide() {
		this.floatDiv.style.display = "none";
		if (this.miniIcon) this.miniIcon.style.display = "block";
	}

	close() {
		this.floatDiv.remove();
		if (this.miniIcon) this.miniIcon.remove();
		if (this.config.element) {
			this.config.element.style.cssText = "";
			this.config.element.removeEventListener("dblclick", () => this.show());
		}
	}
}

class utils {
	/**
	 * 合并并去重配件编码数据
	 * @param {Array[]} [localData=[]] - 本地存储的二维数组数据（CSV_配件编码）
	 * @param {Array[]} [externalData=[]] - 外部获取的二维数组数据
	 * @returns {Array[]} 去重后的合并数据
	 */
	static mergeAndDeduplicate(localData = [], externalData = []) {
		// 类型安全检查
		if (!Array.isArray(localData)) localData = [];
		if (!Array.isArray(externalData)) externalData = [];

		// 合并数据
		const mergedData = [...localData, ...externalData];

		// 使用 Map 按指定字段组合键去重
		const uniqueMap = new Map();

		mergedData.forEach((row) => {
			// 验证行数据是否包含所需字段
			if (!Array.isArray(row) || row.length < 15) return;

			// 提取并清洗关键字段（row[2], row[10], row[11], row[13], row[14]）
			const keyParts = [2, 10, 11, 13, 14].map((index) => {
				const field = row[index]?.toString() || "";
				return field.replace(/[\s\-\/\\]/g, "");
			});

			// 生成复合键
			const key = keyParts.join("|");

			// 通过键保存首次出现的数据
			if (key && !uniqueMap.has(key)) {
				uniqueMap.set(key, row);
			}
			// else{console.log('重复数据',row)}
		});

		// 返回去重后的数组
		return Array.from(uniqueMap.values());
	}

	static mergeRiskPartsData() {
		try {
			// 获取本地CSV数据
			const localData = GM_getValue("CSV_配件编码") || [];

			// 获取SCData.riskpartcodes数据（假设dataset.js已加载）
			const externalData = window.SCData?.riskpartcodes || [];

			// 使用现有去重函数合并数据
			const mergedData = utils.mergeAndDeduplicate(localData, externalData);

			// 保存回存储
			GM_setValue("CSV_配件编码", mergedData);

			// 统计信息
			const stats = {
				原始数量: localData.length,
				新增数量: mergedData.length - localData.length,
				最终数量: mergedData.length,
			};

			// 提示用户
			toastr.success(
				`风险配件编码已更新`,
				`原始：${stats.原始数量}\n新增：${stats.新增数量}\n总计：${stats.最终数量}`
			);

			console.log("配件编码合并完成:", stats);
			return mergedData;
		} catch (error) {
			console.error("配件编码合并失败:", error);
			toastr.error("数据合并失败", error.message);
			return null;
		}
	}
}

//数据配置

function DataManager() {
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
		cursor: "pointer",
	};

	const container = document.createElement("div");
	container.style.backgroundColor = "white";
	container.style.padding = "10px";
	container.style.width = "100%"; // 设置div的宽度
	container.style.boxSizing = "border-box"; // 确保padding和border包含在宽度内

	function handlexcelData(excelData) {
		const data = excelData.data["修理厂信息列表"];
		if (!data) {
			alert("未找到修理厂信息列表");
			return;
		}
		// 处理数据
		if (data[0].includes("修理厂信息列表")) {
			data.shift();
		}

		const header = data[0];
		// 把header里面的元素转化为其对应的序号
		const idx = {};
		header.forEach((item, index) => {
			idx[item] = index;
		});
		//从data的第二行开始遍历所有数据
		const lvdict = {};
		// const lvlist = [] // 用于存储等级,子元素分别是[是否4S店,等级,厂方指导价平均折扣系数,品牌件价平均折扣系数]
		for (let i = 1; i < data.length; i++) {
			let level;
			const row = data[i];
			// 通过header的序号找到对应的数据
			const 修理厂名称 = row[idx["修理厂名称"]];
			const 是否4S店 = parseInt(row[idx["是否4S店"]]);
			const 厂方指导价平均折扣系数 = parseInt(
				row[idx["厂方指导价平均折扣系数"]]
			)
				? parseInt(row[idx["厂方指导价平均折扣系数"]])
				: 0;
			const 品牌件价平均折扣系数 = parseInt(row[idx["品牌件价平均折扣系数"]])
				? parseInt(row[idx["品牌件价平均折扣系数"]])
				: 0;
			if (是否4S店) {
				level = 厂方指导价平均折扣系数;
			} else {
				if (厂方指导价平均折扣系数 >= 70) {
					level = 6;
				} else if (厂方指导价平均折扣系数 >= 65) {
					level = 5;
				} else if (厂方指导价平均折扣系数 >= 60) {
					level = 4;
				} else if (厂方指导价平均折扣系数 >= 55) {
					level = 3;
				} else if (品牌件价平均折扣系数 >= 120) {
					level = 2;
				} else if (品牌件价平均折扣系数 >= 110) {
					level = 1;
				} else {
					level = 0;
				}
			}
			lvdict[修理厂名称] = [
				level,
				是否4S店,
				厂方指导价平均折扣系数,
				品牌件价平均折扣系数,
			];
			// lvdict[修理厂名称]={"等级":level,"厂方指导价平均折扣系数":厂方指导价平均折扣系数,"品牌件价平均折扣系数":品牌件价平均折扣系数}
		}

		return [lvdict, excelData.lastModified];
	}

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
				// console.log(updatedata)
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
				dataBox1.textContent = `总记录数: ${
					Object.keys(合作维修厂).length || 0
				}`;
				dataBox2.textContent = `最新时间: ${localData[1] || "未知"}`;
				dataBox3.textContent = `风险配件数: ${
					Object.keys(配件编码风险).length
				}`;
			} else {
				dataBox1.textContent = "总记录数: 0";
				dataBox2.textContent = "最新时间: 无数据";
				dataBox3.textContent = "数据状态: 未初始化";
			}
		}

		return flesh_div;
	}

	function createonlineUpdate_div() {
		const onlineUpdateDiv = document.createElement("div");

		// 创建按钮时不继承全局按钮样式
		const btn_onlineUpdate = document.createElement("button");
		// 单独设置按钮样式
		btn_onlineUpdate.style.width = "100%";
		btn_onlineUpdate.style.padding = "5px";
		btn_onlineUpdate.style.backgroundColor = "#007bff";
		btn_onlineUpdate.style.color = "white";
		btn_onlineUpdate.style.border = "none";
		btn_onlineUpdate.style.borderRadius = "4px";
		btn_onlineUpdate.style.cursor = "pointer";
		btn_onlineUpdate.style.display = "block"; // 显式设置为可见

		btn_onlineUpdate.textContent = "在线更新";
		btn_onlineUpdate.disabled = true; // 初始禁用状态

		// 修改loadData函数启用按钮
		const originalLoadData = loadData;
		loadData = function () {
			const src =dataseturl;
			var script = document.createElement("script");
			script.src = `${src}?ts=${Date.now()}`;
			script.onload = function () {
				console.log("脚本加载成功:", src);
				btn_onlineUpdate.disabled = false; // 启用按钮
			};
			script.onerror = function () {
				console.error("脚本加载失败:", src);
			};
			document.head.appendChild(script);
		};

		// 绑定点击事件
		btn_onlineUpdate.addEventListener("click", Dataupdate);

		// 将按钮添加到容器
		onlineUpdateDiv.appendChild(btn_onlineUpdate);
		return onlineUpdateDiv;
	}

	function loadData() {
		const src =
			"https://update.greasyfork.org/scripts/537487/1597138/SCDatajs.js";
		var script = document.createElement("script");
		//加入时间戳使其加载最新数据而不是用缓存
		script.src = `${src}?ts=${Date.now()}`;
		script.onload = function () {
			console.log("脚本加载成功:", src);
			// 脚本加载并执行完成后，你可以在这里或者之后使用脚本中定义的内容
			// 例如，如果 ElementGetter.js 定义了一个全局变量或函数 ElementGetter
			// console.log(typeof ElementGetter);
		};
		script.onerror = function () {
			console.error("脚本加载失败:", src);
		};
		document.head.appendChild(script);
	}

	function mergeAndDeduplicate(localData = [], externalData = []) {
		// 类型安全检查
		if (!Array.isArray(localData)) localData = [];
		if (!Array.isArray(externalData)) externalData = [];

		// 合并数据
		const mergedData = [...localData, ...externalData];

		// 使用 Map 按指定字段组合键去重
		const uniqueMap = new Map();

		mergedData.forEach((row) => {
			// 验证行数据是否包含所需字段
			if (!Array.isArray(row) || row.length < 15) return;

			// 提取并清洗关键字段（row[2], row[10], row[11], row[13], row[14]）
			const keyParts = [2, 10, 11, 13, 14].map((index) => {
				const field = row[index]?.toString() || "";
				return field.replace(/[\s\-\/\\]/g, "");
			});

			// 生成复合键
			const key = keyParts.join("|");

			// 通过键保存首次出现的数据
			if (key && !uniqueMap.has(key)) {
				uniqueMap.set(key, row);
			}
			// else{console.log('重复数据',row)}
		});

		// 返回去重后的数组
		return Array.from(uniqueMap.values());
	}

	function Dataupdate() {
		if (typeof SCData != "object") return;
		const localdata = Array.isArray(GM_getValue("合作维修厂"))
			? GM_getValue("合作维修厂")
			: [{}, "2023-06-14T08:24:51.221Z"];
		const riskpartcodeslocal = Array.isArray(GM_getValue("CSV_配件编码"))
			? GM_getValue("CSV_配件编码")
			: [];
		// 更新维修厂等级数据
		const claimfactorysys = SCData.claimfactorysys;
		const lastModified = claimfactorysys[1];
		if (!localdata || localdata[1] < lastModified) {
			GM_setValue("合作维修厂", claimfactorysys);
			GM_notification({
				text: `在线更新成功,数据时间${lastModified}`,
				title: "数据更新",
				timeout: 3000,
			});
		} else {
			GM_notification({
				text: `更新失败,本地数据比在线数据更新${localdata[1]}`,
				title: "数据更新",
				timeout: 3000,
			});
		}

		// 整合配件风险数据
		const riskpartcodes = SCData.riskpartcodes;
		const newriskpartcodes = mergeAndDeduplicate(
			riskpartcodes,
			riskpartcodeslocal
		);
		console.log("CSV_配件编码_已更新", newriskpartcodes);
		GM_setValue("CSV_配件编码", newriskpartcodes);
		GM_notification({
			text: "配件编码风险已更新",
			title: "更新成功",
			timeout: 3000,
			highlight: true,
		});
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
					const rows = csvData
						.split("\n")
						.map((row) => row.split(","))
						.filter((row) => !row.every((field) => isBlankField(field)));

					/* 结构分离：解构获取标题行和后续数据行 */
					const [headers, ...dataRows] = rows;

					/* 二次过滤：排除单列行和残留空行（处理\r\n换行符情况） */
					const filteredData = dataRows.filter(
						(row) =>
							row.length > 1 && !row.every((field) => isBlankField(field))
					);

					/* 检查合并数据 */
					const mergeData = mergeCSVData(filteredData);

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
				return String(field)
					.replace(/[-\/\\\s\r\n,;.]/g, "")
					.trim();
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
				const localMap = new Map(
					localData.map((row) => [cleanField(row[2]), row])
				);

				// 差异项收集器
				const changes = [];

				filteredData.forEach((newRow) => {
					const key = cleanField(newRow[2]);
					const oldRow = localMap.get(key);

					// 新增记录直接标记
					if (!oldRow) {
						changes.push(newRow);
						return;
					}

					// 关键列对比（使用安全取值）
					const criticalFields = [
						[2, 10], // 编码和报价列
						[13, 14], // 风险规则和备注信息列
					].some(
						([col1, col2]) =>
							(newRow[col1] || "").trim() !== (oldRow[col1] || "").trim() ||
							(newRow[col2] || "").trim() !== (oldRow[col2] || "").trim()
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
				localData.forEach((row) => {
					const key = cleanField(row[2]);
					if (key) localMap.set(key, row);
				});

				// 差异项收集器
				const changes = [];
				const updatedData = [...localData]; // 创建本地数据副本

				filteredData.forEach((newRow) => {
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
						[2, 10], // 编码和报价列
						[13, 14], // 风险规则和备注信息列
					].some(([col1, col2]) => {
						const oldVal1 = (oldRow[col1] || "").toString().trim();
						const newVal1 = (newRow[col1] || "").toString().trim();
						const oldVal2 = (oldRow[col2] || "").toString().trim();
						const newVal2 = (newRow[col2] || "").toString().trim();

						return oldVal1 !== newVal1 || oldVal2 !== newVal2;
					});

					if (hasChanges) {
						// 创建更新后的行（保持数组结构）
						const updatedRow = [...oldRow];
						// 只更新关键字段
						[2, 10, 13, 14].forEach((idx) => {
							if (newRow[idx] !== undefined) {
								updatedRow[idx] = newRow[idx];
							}
						});

						changes.push(updatedRow);

						// 更新本地数据中对应的行
						const index = updatedData.findIndex(
							(row) => cleanField(row[2]) === key
						);
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

	container.appendChild(createonlineUpdate_div());

	//```````````````````````````````````````````````

	// 创建在线更新按钮区域

	// 初始化时自动加载数据
	loadData();

	return container;
}

function initialize() {
	function List2Dict(rows) {
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
	// 1. 加强类型校验
	const 合作维修厂存储值 = GM_getValue("合作维修厂");

	// 验证存储数据结构（必须包含两个元素的数组）
	const is合作维修厂Valid =
		Array.isArray(合作维修厂存储值) &&
		合作维修厂存储值.length === 2 &&
		typeof 合作维修厂存储值[0] === "object" &&
		!Array.isArray(合作维修厂存储值[0]);

	// 2. 安全解构（带类型回退）
	const [合作维修厂原始数据, lastModified] = is合作维修厂Valid
		? 合作维修厂存储值
		: [{}, null]; // 无效数据时使用空对象

	// 3. 增强数据转换（带类型检查）
	合作维修厂 = Object.entries(合作维修厂原始数据).reduce(
		(acc, [key, value]) => {
			// 验证值结构是否为四元素数组
			if (Array.isArray(value) && value.length >= 4) {
				acc[key] = `等级:${value[0]},类型:${
					value[1] ? "服务站" : "综修厂"
				},厂方折扣:${value[2]}%,品牌折扣:${value[3]}%`;
			} else {
				console.warn("异常维修厂数据:", key, value);
			}
			return acc;
		},
		{}
	);

	// 4. 带类型保护的配件编码处理
	const rawCSV = GM_getValue("CSV_配件编码");
	const CSV_配件编码 = Array.isArray(rawCSV) ? rawCSV : [];
	// CSV_配件编码 = Array.isArray(rawCSV) ? rawCSV : [];
	配件编码风险 = CSV_配件编码.length > 0 ? List2Dict(CSV_配件编码) : {};

	// 5. 统计信息（带数据校验）
	const stats = {
		合作综修厂: Object.keys(合作维修厂).length,
		异常维修厂数据:
			Object.keys(合作维修厂原始数据).length - Object.keys(合作维修厂).length,
		配件编码风险: Object.keys(配件编码风险).length,
		CSV数据更新时间: lastModified
			? new Date(lastModified).toLocaleDateString()
			: "无",
	};

	// console.log('数据初始化报告:', stats);

	// 6. 增强通知信息
	GM_notification({
		text: `有效合作厂: ${stats.合作综修厂} 
        异常数据: ${stats.异常维修厂数据}
        风险编码: ${stats.配件编码风险}
        最后更新: ${stats.CSV数据更新时间}`.replace(/\s+/g, " "),
		title: "数据健康状态",
		timeout: 8000,
	});

	// 6. 初始化配置项
	myconfig = GM_getValue("config") || {};
	myconfig.areas = Array.isArray(myconfig.areas) ? myconfig.areas : []; // 类型安全
	myconfig.tailNo = Array.isArray(myconfig.tailNo) ? myconfig.tailNo : []; // 类型安全
	myconfig.publicNo = Array.isArray(myconfig.publicNo) ? myconfig.publicNo : []; // 类型安全
}

const toastr = toast();

(function () {
	"use strict";

	initialize();
	// Module_CaseFilter.UI()
	const casefilter = new CaseFilter();
	const 数据更新 = DataManager();

	const ConfigWidget = new MultiTabFloater();
	// 测试添加一个选项卡
	ConfigWidget.addTab("数据更新", (contentContainer) => {
		
		contentContainer.appendChild(数据更新);
	});

	ConfigWidget.addTab("案件区域", (contentContainer) => {
		const 案件区域 = CaseFilter.Configer({
			checkedareas: myconfig.areas,
			tailNo: myconfig.tailNo,
			publicNo: myconfig.publicNo,
		});
		contentContainer.appendChild(案件区域);
	});

	ConfigWidget.addTab("案件列表", (contentContainer) => {
		const 案件列表 = new Casepad();
		contentContainer.appendChild(案件列表.container);
		案件列表.fleshdata();
	});
})();
