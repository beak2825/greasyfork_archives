// ==UserScript==
// @name         H5链接转小程序链接
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  东福H5移动端页面转小程序页面
// @author       Cme
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.19/lodash.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.8.32/dayjs.min.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @match        https://m.dongfangfuli.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at      document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483953/H5%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/483953/H5%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
'use strict';
GM_addElement('link', {
	src: 'https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css',
	type: 'text/javascript'
});
let style = `
.swal2-popup{
	display: none;
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    max-width: 100%;
    padding: 1.25em;
    border: none;
    border-radius: 0.3125em;
    background: #fff;
    font-family: inherit;
    font-size: 10px;
}
.diy-tool{
	position: fixed;
	top: 0;
	left: 50%;
	background: #3fa6ff;
	color: white;
	width: 80px;
	height: 24px;
	border: none;
	border-radius: 20px;
	z-index: 9999999999;
	font-size: 15px;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
}
.text-area {
	display:flex;
	max-height:200px;
	width: 100%;
	word-break: break-all;
	line-height:1
}
`
GM_addStyle(style);
// GM_setValue('h5Toxcx', JSON.stringify([{
// 	xcxPath: '/packageE/channelHome/channelHome',
// 	params: [{
// 			name: 'pageCode',
// 			require: true
// 		},
// 		{
// 			name: 'channelId',
// 			require: true
// 		}
// 	],
// 	h5Path: 'https://m.dongfangfuli.com/max-pagesite'
// }, {
// 	xcxPath: '/packageE/qinzi/goodsDetail/index',
// 	params: [{
// 		name: 'projectId',
// 		require: false
// 	}],
// 	h5Path: 'https://m.dongfangfuli.com/offactivities/programDetail'
// }]))
// 根据配置进行转化
function transform(url) {
	let [path, params] = url.split("?");
	const pageList = JSON.parse(GM_getValue('h5Toxcx') || '[]');
	let result = '';
	let errorList = [];
	let str = '';
	let notCfgPage = true;
	for (let page of pageList) {
		str = '';
		if (path.indexOf(page.h5Path) >= 0) {
			notCfgPage = false;
			str += page.xcxPath + '?';
			let obj = {};
			params.split("&").map(item => {
				let [name, value] = item.split("=");
				obj[name] = value
			})
			let plist = [];
			let flag = false
			for (let i of page.params) {
				if (i.require && !obj[i.name]) {
					flag = true;
					errorList.push({
						path: path,
						text: `必要参数:"${i.name}"缺失了!`
					})
					// Swal.fire({
					// 	icon: 'error',
					// 	title: 'Oops...',
					// 	text: '必要参数缺失了:' + i.name
					// })
					// continue;
				} else {
					obj[i.name] && plist.push(i.name + "=" + obj[i.name])
				}
			}
			if (!flag){
				result = str += plist.join("&");
			};
		}
	}
	if(notCfgPage){
		errorList.push({
			path: path,
			text: `未配置转化规则！`
		})
	}
	return {
		result,
		errorList
	}
}
// 建立监听
function initListener() {
	let btn1 = document.getElementById('add');
	let btn2 = document.getElementById('single');
	let btn3 = document.getElementById('all');

	btn1?.addEventListener("click", function() {
		Swal.close();
		add();
	})
	btn2?.addEventListener("click", function() {
		Swal.close();
		single();
	})
	btn3?.addEventListener("click", function() {
		Swal.close();
		all();
	})
}
// 功能面板
function start() {
	let temps = JSON.parse(GM_getValue("temp") || '[]')
	Swal.fire({
		html: `
				  <div class="flex-style functions-list">
					<button type="button" class="function-item swal2-confirm swal2-styled" id="add">加入批量处理(已${temps.length}条)</button>
					<button type="button" class="function-item swal2-confirm swal2-styled" id="single">立即转化</button>
					<button type="button" class="function-item swal2-confirm swal2-styled" id="all">批量转化</button>
				  </div>
				`,
		showCancelButton: true,
		cancelButtonText: '关闭',
		confirmButtonText: '配置'
	}).then(({
		isConfirmed,
		isDismissed
	}) => {
		isConfirmed && showSettingDialog()
	});
	initListener();
}

function add() {
	let temps = JSON.parse(GM_getValue("temp") || '[]');
	let local = window.location.href;
	let flag = false;
	for (let item of temps) {
		if (item == local) {
			flag = true;
			continue;
		}
	}
	if (flag) {
		Swal.fire({
			title: '无需重复添加！',
			timer: 1000
		}).then(() => {
			start();
		})
		return;
	}
	temps.push(window.location.href)
	GM_setValue("temp", JSON.stringify(temps))
	Swal.fire({
		icon: 'success',
		title: '添加成功！',
		timer: 1500
	}).then(() => {
		start();
	})
}

function single() {
	let {result, errorList} = transform(window.location.href);
	if (!result) {
		Swal.fire({
			icon: "error",
			title: '转化异常！',
			text: errorList.length ? errorList.map(item => `${item.path}转换时${item.text}`).join("\n") : "当前页面未添加配置，可联系管理员添加配置",
		}).then(() => {
			start();
		})
		return;
	}
	successed(result);
}

function all() {
	let temps = JSON.parse(GM_getValue("temp") || '[]');
	if (!temps.length) {
		Swal.fire({
			title: '未添加批量处理！',
			timer: 1500
		}).then(() => {
			start();
		})
		return;
	}
	let urls = [];
	let errors = [];
	for (item of temps) {
		let {result, errorList} = transform(item);
		result && urls.push(result);
		errorList.length && errors.push(...errorList);
	}
	GM_setValue("temp", '[]');
	if(errors.length){
		Swal.fire({
			icon: "error",
			title: '转化异常！',
			text: errors.map(item => `${item.path}转换时${item.text}`).join("\n"),
		}).then(() => {
			urls.length ? successed(urls.join("\n---------------------\n")) : start();
		})
		GM_setValue("temp", '[]');
		return;
	}else if (!urls.length) {
		Swal.fire({
			icon: "error",
			title: '转化异常！',
			text: "批量页面中都未添加配置，可联系管理员添加配置",
		}).then(() => {
			start();
		})
		GM_setValue("temp", '[]');
		return;
	}
	successed(urls.join("\n---------------------\n"));
	GM_setValue("temp", '[]')
}

function successed(txt) {
	Swal.fire({
		title: '小程序地址如下：',
		html: `<textarea id="dddd" rows="25" cols="80" class="text-area">${txt}</textarea>`,
		icon: 'success',
		showCancelButton: true,
		confirmButtonColor: '#3FA6FF',
		cancelButtonColor: '#d33',
		confirmButtonText: '复制',
		cancelButtonText: '取消'
	}).then((result) => {
		if (result.value) {
			document.getElementById("dddd").select();
			document.execCommand("Copy");
			Swal.fire({
				icon: 'success',
				title: '复制成功！',
				timer: 1500
			})
		}
	})
}
// 配置规则
function showSettingDialog(cfgTxt) {
	const pageList = GM_getValue('h5Toxcx') || '[]';
	Swal.fire({
		title: "配置信息",
		html: `
				<div class="config-content flex-style">
					<span class="config-title">配置解析并导入：</span>
					<textarea id="urlCfg" rows="25" cols="80" class="text-area">${cfgTxt || pageList}</textarea>
				</div>
				`,
		showCancelButton: true,
		confirmButtonText: "保存",
		cancelButtonText: "返回"
	}).then(({
		isConfirmed,
		isDismissed
	}) => {
		if (isConfirmed) {
			let urlCfg = document.getElementById("urlCfg").value;
			try {
				let test = JSON.parse(urlCfg);
				GM_setValue('h5Toxcx', JSON.stringify(test));
				Swal.fire('保存成功').then(() => {
					start();
				})
			} catch (e) {
				Swal.fire({
					icon: 'error',
					title: '保存失败',
					text: '请检查配置',
					confirmButtonText: "返回编辑"
				}).then(() => {
					showSettingDialog(urlCfg)
				})
			}
		} else if (isDismissed) {
			start();
		}
	});
}

function enter() {
	if (document.getElementById("diy-tool")) return;
	GM_addElement(document.getElementsByTagName("body")[0], 'button', {
		class: 'weui-desktop-btn weui-desktop-btn_primary diy-tool',
		textContent: '辅助工具',
		// style: 'margin-left:20px'
	});
	let ele = document.getElementsByClassName('diy-tool')[0];
	ele.addEventListener("click", function() {
		start();
	})
}
// 入口
if (!document.getElementsByClassName('diy-tool').length) {
	enter();
}
let old = history.pushState
history.pushState = function(...arg) {
	if (arg && arg.length && arg.length > 2) {
		enter();
	}
	return old.call(this, ...arg)
}