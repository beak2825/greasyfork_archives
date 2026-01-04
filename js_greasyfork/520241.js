// ==UserScript==
// @name         抢场地
// @namespace    Badminton court reservation @Roonfu
// @version      3.2.0.2504271353
// @description  Badminton court reservation script
// @author       Roonfu
// @license      MIT
// @match        https://ehall3.nuaa.edu.cn/v2/reserve/reserveDetail?id=14
// @match        https://ehall3.nuaa.edu.cn/v2/reserve/m_reserveDetail?id=14
// @match        https://x.nuaa.edu.cn/https/*/v2/reserve/reserveDetail?id=14
// @match        https://x.nuaa.edu.cn/https/*/v2/reserve/m_reserveDetail?id=14
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520241/%E6%8A%A2%E5%9C%BA%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520241/%E6%8A%A2%E5%9C%BA%E5%9C%B0.meta.js
// ==/UserScript==

/***************** User Define *******************/

const Time = 8; // 目标起始时间(12小时制下午，范围: 2~8)

/***************** User Define *******************/


const config = {
	time: Time,
	targetRowNumber: Time + 2,// 目标行的Index值
	priority: [5, 4, 6, 3, 2, 7],// 场地优先级
	debugMode: {
		enable: false, // 调试模式下不会自动更改state.step
		preventStepSet: true,
		consoleOutput: true,// 打印信息开关
	},
	loopDelay: {
		normal: 20,// 循环延迟(ms)
		debug: 500,
	}
}

/** DOM Cache */
const DOMCache = {
	targetRow: null,// 目标行，场地以行为一组，每行一个时间段，lines[4]:14:00, lines[5]:15:00
	verifyMsgBox: document.querySelector(".verify-msg"),
	refreshTargetRow: () => { DOMCache.targetRow = utils.getTargetRow(); },
}

const state = {
	step: 1,// 当前步
	setStep: (_step) => {
		if (!(config.debugMode.enable && config.debugMode.preventStepSet)) state.step = _step;
		utils.addLog(`set step to:${_step}`);
	},
	platform: document.body.className.includes("site_pc") ? "pc" : "mobile",// 平台
	selectedIndex: null,// 目标列
}

/** 工具函数 */
const utils = {
	logMsg: "",
	/** 输出调试信息 */
	addLog: (...args) => {
		utils.logMsg = `${utils.logMsg}${utils.logMsg.length == 0 ? '' : '; '}${[...args]}`;
	},
	writeLog: () => {
		config.debugMode.enable && config.debugMode.consoleOutput && console.log(utils.logMsg);
		utils.logMsg = "";
	},
	/** 关闭所有弹窗 */
	closePopups: () => document.querySelector(".el-dialog__wrapper .el-button")?.click(),
	/** 显示验证码区域 */
	showCaptcha: () => document.querySelector(".text_verify")?.setAttribute("style", ""),
	/** 将验证码区域显示为绿色 */
	dyeCaptchaGreen: () => document.querySelector(".choose_reserve")?.setAttribute("style", "background-color:rgb(150,240,150)"),
	getVerifyStatus: () => {
		return document.querySelector(".text_verify")?.textContent.includes("成功") ? true : false;
	},
	/** 关闭遮罩层 */
	hideMasks: () => document.querySelectorAll(".el-loading-mask")?.forEach(el => el.setAttribute("style", "display:none")),
	// hideMask: ()=> document.querySelectorAll(".el-loading-mask")?.forEach(el => el.remove()),
	/** 获取“前一天”“今天”按钮 */
	getDayButtons: () => {
		let btns = [...document.querySelectorAll(".select_week .zl-button")];
		return {
			prev: btns.find(b => b.textContent.includes("前一天")),
			today: btns.find(b => b.textContent.includes("今天")),
		};
	},
	/** 点击“确定预约”按钮 */
	clickConfirmButton: () => {
		if (state.platform == "pc") document.querySelector(".text_verify").nextElementSibling.click();
		else document.querySelector(".text_verify").nextElementSibling.children[0].click();
	},
	/** 获得场地和目标行 */
	getTargetRow: () => {
		return document.querySelectorAll(".right_calendar .lines")?.item(config.targetRowNumber);
	},
	/**
	 * 获得场地状态
	 * 一共有5种状态:
	 * noShow     : 场地上锁，不在预约时间内
	 * disable    : 场地不开放，一号不开放
	 * due        : 过期，仅在预约时间内出现
	 * full       : 约满
	 * canReserve : 可预约
	 * */
	getCourtState: (row) => {
		const states = [...row.children].map(child => {
			const className = child.children[0].className;
			const text = child.children[0].textContent;

			if (className.includes("canReserve")) return 'canReserve';
			if (className.includes("full")) return 'full';
			if (state.platform === 'pc') {
				if (className.includes("due")) return 'due';
				if (className.includes("disable")) return 'disable';
				return 'noShow';
			} else {
				if (className.includes("due")) {
					if (text.includes("过期")) return 'due';
					if (text.includes("不可预约")) return 'disable';
					return 'noShow';
				}
				return 'noShow';
			}
		});
		return states.find(s => s !== 'noShow') || 'noShow';
	},
	/** 按优先级选择场地 */
	selectCourt: (row, priority) => {
		for (const courtId of priority) {
			const index = courtId - 1;
			if (row.children[index]?.children[0].className.includes("canReserve")) {
				row.children[index].children[0].click();
				return index;
			}
		}
		return null;
	},
	checkSelected: () => {
		if (state.platform == "pc") {
			return document.querySelector(".iconshanchu3") != null
				&& DOMCache.targetRow.children[state.selectedIndex]?.querySelector(".active") != null;
		}
		else return DOMCache.targetRow.children[state.selectedIndex]?.querySelector(".active") != null;
	}
}

const core = () => {
	utils.addLog(`step:${state.step}`);
	utils.closePopups();
	if (state.platform == "pc") {
		utils.showCaptcha();
		utils.hideMasks();
	}

	if (state.step == 1) {// 注意：click()操作后必须分步
		if (!DOMCache.targetRow) {
			DOMCache.refreshTargetRow();
		}
		let courtState = utils.getCourtState(DOMCache.targetRow);
		switch (courtState) {
			case "noShow":
				clearInterval(interval); //必须先停止再刷新
				location.reload(); //刷新页面
				break;
			case "canReserve":
				if (state.platform == "pc") {
					utils.dyeCaptchaGreen(); //把验证码区域变绿
					utils.getDayButtons().prev?.click(); //点击“前一天”按钮
					state.setStep(2);//下一步
				}
				else state.setStep(3);
				break;
			default:
				clearInterval(interval);
				utils.addLog(`已退出, 场地状态:${courtState}`);
				break;
		}
	}
	else if (state.step == 2) { // pc-only: 等待用户验证及前一天的场地加载完成
		DOMCache.refreshTargetRow();
		if (utils.getCourtState(DOMCache.targetRow) == "due"
			&& utils.getVerifyStatus()) {
			utils.getDayButtons().today?.click();
			state.setStep(3);
		}
	}
	else if (state.step == 3) { //选择场地
		DOMCache.refreshTargetRow();
		if (state.platform == "pc") {
			let courtState = utils.getCourtState(DOMCache.targetRow);
			switch (courtState) {
				case "due":
					break;
				case "canReserve":
					state.selectedIndex = utils.selectCourt(DOMCache.targetRow, config.priority);
					state.setStep(4);
					break;
				default: // full
					clearInterval(interval); //必须先停止再刷新
					utils.addLog(`已退出, 场地状态:${courtState}`);
					break;
			}
		}
		else {
			state.selectedIndex = utils.selectCourt(DOMCache.targetRow, config.priority);
			state.setStep(4);
		}
	}
	else if (state.step == 4) { // 确认场地选上了
		if (utils.checkSelected()) {
			utils.clickConfirmButton();
			if (state.platform == "pc") state.setStep(6);
			else state.setStep(5);
		}
	}
	else if (state.step == 5) { // mobile-only: 等待用户验证
		if (utils.getVerifyStatus()) {
			state.setStep(6);
		}
	}
	else if (state.step == 6) {
		let msg = document.querySelector(".el-message");
		if (msg?.className.includes("success")) {
			clearInterval(interval);
			utils.addLog(`成功`);
		}
		else if (msg?.className.includes("warning")) {
			let msgText = msg.textContent;
			if (msgText.includes("已约满")) {//text = "预约日期已约满"
				// 此时选择另一个场地再约会提示“参数错误”
				state.setStep(1);
			}
			else if (msgText.includes("时段")) {//text = "请选择预约时段"
				// 说明没点上，理论上不会出现
				state.setStep(3);
			}
			else if (msgText.includes("校验")) {//text = "请点击文字校验通过后再进行预约"
				// 验证码没过，理论上不会出现
			}
			else if (msgText.includes("参数错误")) {//text = "参数错误"
				//参数错误时刷新验证码无效，只能刷新页面
				clearInterval(interval);
				location.reload();
			}
			else if (msgText.includes("超过")) {//text = "单次预约个数超过：1"
				// 同时选择了多个场地，理论上不会出现
				document.querySelector(".iconshanchu3")?.click();
				utils.clickConfirmButton();
			}
			else if (msgText.includes("频繁")) {//text = "您的操作太频繁了，请稍后重试！"
				//操作就完事了
				utils.clickConfirmButton();
			}
		}
	}
	utils.writeLog();
}

/** 启用循环 */
const interval = setInterval(() => core(), config.debugMode.enable ? config.loopDelay.debug : config.loopDelay.normal);
