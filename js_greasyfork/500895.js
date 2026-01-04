// ==UserScript==
// @name         淘宝订单导出
// @namespace    thebszk_taobao_order_export
// @version      2025-04-23
// @description  支持淘宝订单导出到json格式数据
// @author       thebszk
// @match        https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @icon         https://img.alicdn.com/favicon.ico
// @grant        none
// @license         AGPL
// @downloadURL https://update.greasyfork.org/scripts/500895/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/500895/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
	"use strict";
	let mainDiv = document.getElementById("J_bought_main");
	if (!mainDiv) {
		console.log("未找到订单列表");
		return;
	}
	let orderContainers;

	function order_flsuh() {
		orderContainers = mainDiv.getElementsByClassName("js-order-container");
		if (!orderContainers) {
			console.log("未找到订单");
			return;
		}
		const lable = '<label><input type="checkbox"> 导出</label>';
		for (let i = 0; i < orderContainers.length; i++) {
			if (!orderContainers[i].querySelector("div > table > tbody:nth-child(2) > tr > td[colspan='3'] > label")) {
				orderContainers[i].querySelector("div > table > tbody:nth-child(2) > tr > td[colspan='3']").insertAdjacentHTML("afterbegin", lable);
			}
		}
	}

	let btn_contorl = document.querySelector("#tp-bought-root > div.js-actions-row-top > div:nth-child(2)");

	// 为每个按钮添加点击事件
	const buttons = document.querySelectorAll("button");
	buttons.forEach(function (button) {
		button.addEventListener("click", function () {
			setTimeout(order_flsuh, 3000);
		});
	});

	let export_btn = document.createElement("button");
	export_btn.innerText = "导出数据";
	export_btn.className = btn_contorl.querySelector("button").className;
	order_flsuh();
	export_btn.addEventListener("click", function () {
		//导出勾选的订单
		let orderData = {};
		orderData.order = [];

		let x = 0;
		for (let i = 0; i < orderContainers.length; i++) {
			if (orderContainers[i].querySelector("div > table > tbody:nth-child(2) > tr > td[colspan='3'] > label > input[type=checkbox]").checked) {
				orderData.order[x] = {};
				orderData.order[x].id = orderContainers[i].children[0].getAttribute("data-id");
				let table = orderContainers[i].getElementsByTagName("table")[0];
				if (table) {
					let tbodies = table.getElementsByTagName("tbody");
					if (tbodies.length >= 2) {
						orderData.order[x].date = tbodies[0].getElementsByTagName("tr")[0].children[0].children[0].innerText;
						orderData.order[x].price = parseFloat(tbodies[1].querySelector("tr:nth-child(1) > td:nth-child(5) > div > div > p > strong > span:nth-child(2)").innerText);
						orderData.order[x].state = tbodies[1].querySelector("tr:nth-child(1) > td:nth-child(6) > div > p > span").innerText;
						orderData.order[x].items = [];
						let items = tbodies[1].getElementsByTagName("tr");
						let y = 0;
						for (let j = 0; j < items.length; j++) {
							let tds = items[j].getElementsByTagName("td");
							if (tds[2].querySelector("div > p")) {
								//有数量，说明不是"保险服务"之类的

								orderData.order[x].items[y] = {};
								let ps = tds[0].getElementsByTagName("p");
								//物品名称
								orderData.order[x].items[y].name = ps[0].querySelector("a:nth-child(1) > span:nth-child(2)").innerText;

								//判断是否有分类
								let elem_class = ps[1].querySelector("span > span:nth-child(1)");
								if (elem_class && elem_class.innerText == "颜色分类") {
									orderData.order[x].items[y].class = ps[1].querySelector("span > span:nth-child(3)").innerText;
								}

								//价格
								orderData.order[x].items[y].price = parseFloat(tds[1].querySelector("div > p > span:nth-child(2)").innerText);
								//数量
								orderData.order[x].items[y].quantity = parseInt(tds[2].querySelector("div > p").innerText);
								y++;
							}
						}
					}
				}
				x++;
			}
		}
		if (x > 0) {
			navigator.clipboard
				.writeText(JSON.stringify(orderData))
				.then(() => {
					alert("数据已复制到剪贴板");
				})
				.catch((err) => {
					alert("导出失败: " + err);
				});
		} else {
			alert("没有订单被选中");
		}
	});
	btn_contorl.appendChild(export_btn);
})();
