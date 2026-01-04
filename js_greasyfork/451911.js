// ==UserScript==
// @name        PKU学生出入校_userscript - pku.edu.cn
// @namespace   pkureportbot
// @match       https://simso.pku.edu.cn/pages/sadEpiAccessApply.html
// @grant       none
// @version     v20220930
// @author      pkureportbot
// @description PKU 校内信息门户->学生出入校
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451911/PKU%E5%AD%A6%E7%94%9F%E5%87%BA%E5%85%A5%E6%A0%A1_userscript%20-%20pkueducn.user.js
// @updateURL https://update.greasyfork.org/scripts/451911/PKU%E5%AD%A6%E7%94%9F%E5%87%BA%E5%85%A5%E6%A0%A1_userscript%20-%20pkueducn.meta.js
// ==/UserScript==
// 警告：本脚本调试的时候只考虑出入校有一项为“校外（社会面）"的情形， 其他情形弹出的选项不同，需要略作修改
// 警告：本脚本不会自动保存，因为保存以后就无法撤销保存状态。请自行保存

// 以下值按照自身情况修改
let G_SLEEP = 1000             // 睡眠时间（毫秒），如果运行有问题尝试延长到3000
const G_DATE = 0                              // 出入校日期，输入 0 表示今天, 1 表示明天，
const G_REASON = "其他必要事项（补充生活物资等）"  // 出入校理由
const G_START = "燕园"          // 出入校起点
const G_END = "校外（社会面）"   // 出入校终点
const G_REASON_DETAIL = "补充生活物资"    // 出入校具体事项
const G_GATE = "东南门"         // 起点校门
const G_CN = "中国"            // 终点所在国家地区
const G_BJ = "北京市"          // 终点所在省
const G_BJ2 = "市辖区"         // 终点所在地级市
const G_DISTRICT = "海淀区"    // 终点所在区县
const G_STREET = "学院路街道"   // 终点所在街道
const G_LOCATION = "五道口"    // 详细轨迹
const G_YES = "是"            // 抵京已满7日

/* https://code.tutsplus.com/tutorials/how-to-change-the-date-format-in-javascript--cms-39400 */
//a simple date formatting function
function dateFormat(inputDate, format) {
    //parse the input date
    let date = new Date(inputDate);
    // 强制修改UTC+8
    const UTCp8_OFFSET = "-480"
    if (date.getTimezoneOffset() != UTCp8_OFFSET) {
    	//getTime() 单位为毫秒
    	let unix_time_ms = date.getTime() + (date.getTimezoneOffset() - UTCp8_OFFSET) * 60 * 1000
    	date = new Date(unix_time_ms)
    }
    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    //replace the month
    format = format.replace("MM", month.toString().padStart(2,"0"));

    //replace the year
    if (format.indexOf("yyyy") > -1) {
	format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
	format = format.replace("yy", year.toString().substr(2,2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2,"0"));

    return format;
}

function today() {
	return dateFormat(new Date(), "yyyy-MM-dd")
}

function tomorrow() {
	let d = new Date()
	return dateFormat(d.getTime() + 86400 * 1000, "yyyy-MM-dd")
}
var G_TODAY = today()
var G_TOMORROW = tomorrow()

function click(value) {
	let list_parent = document.body.lastElementChild
	let list = list_parent.querySelector("ul.el-select-dropdown__list")
	let list_target = Array.from(list.children).find(el => el.textContent.includes(value))
	list_target.dispatchEvent(new Event("click"))
}
function clickGate(value) {
	let list_parent = document.body.lastElementChild
	let list_items = list_parent.querySelectorAll("li")
	let list_target = Array.from(list_items).find(el => el.textContent.includes(value) && !el.querySelector("li"))
	list_target.dispatchEvent(new Event("click"))
}
function clickDate() {
	let list_parent = document.querySelector(".el-picker-panel") || document.body.lastElementChild
	let list_items = list_parent.querySelectorAll("table.el-date-table td:not(.disabled)")
	let list_target
	if (G_DATE == 0) {
		list_target = list_items[0]
	} else if (G_DATE == 1) {
		list_target = list_items[1]
	}
	if (!list_target) {
		console.error("选择日期失败")
	}
	list_target.dispatchEvent(new Event("click", {bubbles: true}))
}

function sleep(time) {
	return new Promise(r => setTimeout(r, time));
}

async function chooseItem(el) {
	el.parentElement.parentElement.dispatchEvent(new Event("click"))
	await sleep(G_SLEEP)
}

async function main() {
	//只匹配第一栏“出入校申请”
  let url = new URL(window.location)
	if (!url.hash.includes("/editEpiApplyInfo")) {
		 return
	}
	await sleep(G_SLEEP)
	setTimeout(() => {
		let e1 = document.querySelector(".el-dialog__wrapper button")
		e1.dispatchEvent(new Event("click"))
	}, 5000)
	let a = document.querySelectorAll(".el-form-item__content input")
	a[0].dispatchEvent(new Event("focus"))
	await sleep(G_SLEEP)
	clickDate()
	await sleep(G_SLEEP)
	await chooseItem(a[1])
	click(G_REASON)
	await chooseItem(a[2])
	click(G_START)
	await chooseItem(a[3])
	click(G_END)
	// 校外点击以后会加载新的选项
	// click()以后需要sleep()才能让新选项加载到DOM
	await sleep(G_SLEEP)
	let a2 = document.querySelectorAll(".el-form-item__content input")
	await chooseItem(a2[4])
	clickGate(G_GATE)
	await chooseItem(a2[5])
	click(G_CN)
	await chooseItem(a2[6])
	click(G_BJ)
	await chooseItem(a2[7])
	click(G_BJ2)
	await chooseItem(a2[8])
	click(G_DISTRICT)
	await chooseItem(a2[10])
	click(G_YES)
	let a3 = document.querySelectorAll("textarea")
	a2[9].value = G_STREET
	a2[9].dispatchEvent(new Event('input', {bubbles:true}));
	a3[0].value = G_REASON_DETAIL
	a3[0].dispatchEvent(new Event('input', {bubbles:true}));
	a3[1].value = G_LOCATION
	a3[1].dispatchEvent(new Event('input', {bubbles:true}));

	// let save_el = Array.from(document.querySelectorAll("button")).find(el => el.textContent.includes("保存"))
	// save_el.dispatchEvent(new Event("click"))
}
main()