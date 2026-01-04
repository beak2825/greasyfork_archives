// ==UserScript==
// @name         自动申诉
// @namespace    https://github.com/
// @version      0.0.2
// @description  违规广告自动申诉
// @author       mulan
// @match        https://business.facebook.com/accountquality/*
// @supportURL   https://github.com/
// @downloadURL https://update.greasyfork.org/scripts/440052/%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440052/%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%89.meta.js
// ==/UserScript==


// 申请复审按钮
// const button = document.querySelector(
// 	"#globalContainer  .l081gc3l ._3qn7._61-0._2fyi._3qng > div > div"
// );
let timer = null;
let adId = "";
let adHref = "";
const utils = {
	setCss(targetObj, cssObj) {
		var str = targetObj.getAttribute("style")
			? targetObj.getAttribute("style")
			: "";
		for (var i in cssObj) {
			str += i + ":" + cssObj[i] + ";";
		}
		targetObj.style.cssText = str;
	},
	alertMsg(time, data = "", callbackTure = "") {
		var alert_bg = document.createElement("div");
		var alert_box = document.createElement("div");
		var alert_text = document.createElement("div");
		var textNode = document.createTextNode(data ? data : "");
		// 控制背景样式
		utils.setCss(alert_bg, {
			position: "fixed",
			top: "0",
			left: "0",
			right: "0",
			bottom: "0",
			"z-index": "999999999",
		});
		// 控制 提示框样式
		utils.setCss(alert_box, {
			width: "100%",
			"max-width": "90%",
			"font-size": "18px",
			"text-align": "center",
			"border-radius": "15px",
			position: "absolute",
			top: "40%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		});
		if (data) {
			// 控制提示字体样式
			utils.setCss(alert_text, {
				width: "350px",
				"border-bottom": "1px solid #ddd",
				padding: "16px 10px",
				color: "white",
				"background-color": "rgba(0, 0, 0, 0.7)",
				opacity: 1,
				"border-radius": "4px",
				margin: "auto",
			});
		} else {
			// 控制load图片显示样式
			utils.setCss(alert_text, {
				width: "100px",
				height: "100px",
				background: ' url("/src/assets/img/loading-0.gif") no-repeat center',
				margin: "auto",
			});
		}

		// 内部结构套入
		alert_text.appendChild(textNode);
		alert_box.appendChild(alert_text);
		alert_bg.appendChild(alert_box);
		// 整体显示到页面内
		document.getElementsByTagName("body")[0].appendChild(alert_bg);

		setTimeout(function () {
			if (typeof callbackTure === "function") {
				callbackTure(); //回调
			}
			// 弹窗消失~
			utils.setCss(alert_bg, {
				display: "none",
			});
		}, time);
	},
	alert(data, callbackTure = "", callbackFalse = "") {
		var alert_bg = document.createElement("div");
		var alert_box = document.createElement("div");
		var alert_text = document.createElement("div");
		var alert_btn_true = document.createElement("div");
		var alert_btn_false = document.createElement("div");
		var textNode = document.createTextNode(data ? data : "");
		var btnText_false = document.createTextNode("取 消");
		var btnText_true = document.createTextNode("确 定");
		// 控制背景样式
		utils.setCss(alert_bg, {
			position: "fixed",
			top: "0",
			left: "0",
			right: "0",
			bottom: "0",
			"background-color": "rgba(0, 0, 0, 0.1)",
			"z-index": "999999999",
		});
		// 控制 提示框样式
		utils.setCss(alert_box, {
			width: "350px",
			"max-width": "90%",
			"font-size": "18px",
			"text-align": "center",
			"background-color": "#fff",
			"border-radius": "15px",
			position: "absolute",
			top: "40%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		});
		// 控制提示字体样式
		utils.setCss(alert_text, {
			padding: "32px 15px",
			"border-bottom": "1px solid #ddd",
		});
		// 控制确定按钮样式
		utils.setCss(alert_btn_true, {
			padding: "10px 0",
			color: "#007aff",
			"font-weight": "600",
			cursor: "pointer",
			float: "right",
			"text-align": "center",
			width: "49%",
		});
		// 控制取消按钮样式
		utils.setCss(alert_btn_false, {
			padding: "10px 0",
			color: "#007aff",
			"font-weight": "600",
			cursor: "pointer",
			float: "right",
			"text-align": "center",
			width: "50%",
			"border-right": "1px solid #CCC",
		});
		// 内部结构套入
		alert_text.appendChild(textNode);
		alert_btn_true.appendChild(btnText_true);
		alert_btn_false.appendChild(btnText_false);
		alert_box.appendChild(alert_text);
		alert_box.appendChild(alert_btn_true);
		alert_box.appendChild(alert_btn_false);
		alert_bg.appendChild(alert_box);
		// 整体显示到页面内
		document.getElementsByTagName("body")[0].appendChild(alert_bg);
		// 确定按钮绑定点击事件
		alert_btn_true.onclick = function () {
			// alert_bg.parentNode.removeChild(alert_bg);
			if (typeof callbackTure === "function") {
				callbackTure(); //回调
			}
			utils.setCss(alert_bg, {
				display: "none",
			});
		};
		// 取消按钮绑定点击事件
		alert_btn_false.onclick = function () {
			if (typeof callbackFalse === "function") {
				callbackFalse(); //回调
			} else if (typeof callbackTure === "function") {
				callbackTure(); //回调
			}
			utils.setCss(alert_bg, {
				display: "none",
			});
		};
	},
};

// 修改本地存储账号申诉状态
const changeAccountState = id => {
	let data = JSON.parse(sessionStorage.getItem("adAccount"));
	console.log("changeAccountState", id, adHref);
	if (id) {
		data.some(item => {
			if (item.adId == id) {
				item.isCheck = true;
				return true;
			}
		});
	}
	sessionStorage.setItem("adAccount", JSON.stringify(data));
	if (adHref) {
		window.location.href = "https://business.facebook.com" + adHref;
	} else {
		sessionStorage.setItem("startApply", false);
		utils.alert("已无可申诉账号，请手动检查！");
		clearInterval(timer);
		return false;
	}
};

// 初始化本地写入账号列表
const initAccounts = () => {
	return new Promise(resolve => {
		// 账户列表入口 DOM
		let accountsDOM = null;
		try {
			// setTimeout(() => {
			accountsDOM =
				document.querySelectorAll("div.gapnwauf")?.[0]?.childNodes?.[0]
					.childNodes?.[0].childNodes?.[0].childNodes?.[0];
			// }, 1000);
		} catch (error) {
			utils.alert("当前页面无法获取账号，请切换页面");
			return false;
		}
		if (!accountsDOM) {
			utils.alert("当前账号异常，自动前往下一个账号");
			changeAccountState();
			// 自调用继续检查下一个账号
			init();
			return false;
		}
		accountsDOM.click();
		setTimeout(() => {
			// 账号列表
			// const accountList = document.querySelectorAll(".uiScrollableAreaContent")?.[0]
			// 	?.childNodes?.[0].childNodes?.[0].childNodes?.[0].childNodes?.[0];
			const accountList = document.querySelectorAll(
				".UNIFIED_LOCAL_SCOPE_SELECTOR_ITEM_LIST-item"
			);
			if (!accountList) {
				utils.alert("账号获取失败，请联系开发者！");
				return false;
			}
			let adData = [];
			for (let i = 0; i < accountList.length; i++) {
				const href = accountList[i].childNodes[0].getAttribute("href");
				const checked =
					accountList[i].childNodes[0].getAttribute("aria-checked");
				if (checked) adId = href.split("/")[3];
				adData[i] = {
					href,
					bussinessId: href.split("/")[2],
					adId: href.split("/")[3],
					isCheck: false,
				};
			}
			if (!adData.length) {
				utils.alert("账号获取失败，请联系开发者！");
				return false;
			}
			console.log(333);
			sessionStorage.setItem("adAccount", JSON.stringify(adData));
			resolve();
		}, 3000);
	});
};

// 重新检查当前账号下可申诉广告数量
const checkActiveAccount = adId => {
	appealTip = getDOM("可申请复审");
	// 读取可申请复审数量
	appealNum =
		appealTip?.nextElementSibling?.childNodes?.[0]?.childNodes[0]?.innerText ||
		appealTip?.parentNode?.parentNode?.nextElementSibling?.childNodes?.[0]
			?.childNodes?.[0]?.innerText;
	console.warn("adId->" + adId + "可申诉数量", appealNum);
	if (appealNum == 0) {
		// utils.alert("账号申诉完毕，请手动检查！");
		changeAccountState(adId);
		// 自调用继续检查下一个账号
		// init();
		return false;
		// return;
	} else {
		init();
	}
};

async function init() {
	if (timer) clearInterval(timer);
	// utils.alert("错误");

	// 检查本地账号列表，读取一个 isCheck 为 false 的账号进行申诉
	if (!sessionStorage.getItem("adAccount")) {
		await initAccounts();
	}
	let accounts = JSON.parse(sessionStorage.getItem("adAccount"));
	accounts.some(item => {
		if (!item.isCheck) {
			adId = item.adId;
			return true;
		}
	});
	accounts.some(item => {
		if (!item.isCheck && adId != item.adId) {
			adHref = item.href;
			return true;
		}
	});
	console.log("adHref", adHref);
	// 没有可申诉的账号，清空本地账号
	if (!adId) {
		sessionStorage.removeItem("adAccount");
		sessionStorage.setItem("startApply", false);
		utils.alert("账号申诉完毕，请手动检查！");
		return false;
	}

	// 获取DOM自定义内容
	const getAttrVal = (dom, type) => {
		return dom.getAttribute(type);
	};
	// 获取页面所有DOM
	let allDom = document.querySelectorAll("*");
	// 根据文本获取DOM
	const getDOM = val => {
		let dom = null;
		for (let i = 0; i < allDom.length; i++) {
			if (allDom[i].innerText === val) {
				dom = allDom[i];
				break;
			}
		}
		return dom;
	};

	// 全选按钮
	const selectAll = document.querySelector(
		".ReactVirtualized__Grid__innerScrollContainer input"
	);
	// 可申请复审DOM
	let appealTip = null;
	// 可申请复审数量
	let appealNum = 0;
	// 申请复审按钮DOM
	let appealButton = null;
	// 申请复审按钮所在事件DOM
	let button = null;

	try {
		appealTip = getDOM("可申请复审");
		checkActiveAccount(adId);

		// 读取申请复审按钮所在事件DOM
		button =
			appealButton?.childNodes?.[0]?.childNodes[0]?.childNodes?.[0] ||
			appealButton?.parentNode?.parentNode?.parentNode?.parentNode;
		// 确认是按钮
		if (
			getAttrVal(button, "role") === "button" &&
			getAttrVal(button, "aria-busy") === "false"
		) {
			// 全选按钮选中
			selectAll.click();
			if (!selectAll.checked) {
				selectAll.click();
				// selectAll.checked = true;
			}
			// 是否不可选
			const isDisabled = getAttrVal(button, "aria-disabled");
			if (isDisabled) {
				console.warn("按钮不可选");
				checkActiveAccount(adId);
				// 跳过当前账号，自调用继续检查下一个账号
				// init();
				return false;
			}
			button.click();
			setTimeout(() => {
				allDom = document.querySelectorAll("*");
				let confirmButton = getDOM("提交");
				getDOM("取消").childNodes[0].click();
				console.warn("当前账号申诉完毕，继续检查下一个！");
				let startTime = new Date();
				timer = setInterval(() => {
					allDom = document.querySelectorAll("*");
					if (getDOM("我们会在作出决定后通知你。")) {
						checkActiveAccount(adId);
						// 跳过当前账号，自调用继续检查下一个账号
						// init();
					}
					let endTime = new Date();
					if (endTime - startTime > 10000) {
						console.warn("10秒钟未响应，跳过当前账号");
						checkActiveAccount(adId);
						// 跳过当前账号，自调用继续检查下一个账号
						// init();
					}
				}, 1000);
			}, 1000);
		}
	} catch (error) {
		console.warn("ERROR->", error);
	}
}

window.onload = () => {
	if (sessionStorage.getItem("startApply") == "true") {
		console.log("直接执行 init");
		init();
	} else {
		console.log("插入 DOM 准备 init");
		const div = document.createElement("div");
		div.innerHTML = "申诉";
		div.setAttribute("id", "APPLY_BTN");
		div.setAttribute(
			"style",
			"color: #3776ff;cursor: pointer;position: fixed;z-index: 99999999;top: 100px;font-size: 30px;right: 100px;font-weight: bold;border-radius: 4px;padding: 0 10px;background: #fff;"
		);
		document.getElementsByTagName("body")[0].appendChild(div);
		document.querySelector("#APPLY_BTN").addEventListener("click", () => {
			sessionStorage.setItem("startApply", true);
			init();
		});
	}
};
