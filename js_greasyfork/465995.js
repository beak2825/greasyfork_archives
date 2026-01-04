// ==UserScript==
// @name         考场监考批量导入
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  考场监考批量导入，将排好的文件一次性导入系统
// @author       小朗
// @match        https://jw.jxust.edu.cn/framework/main.jsp*
// @icon         https://xiaolang.fun/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465995/%E8%80%83%E5%9C%BA%E7%9B%91%E8%80%83%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/465995/%E8%80%83%E5%9C%BA%E7%9B%91%E8%80%83%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==
(function () {
	'use strict';
	let inputBtn = null
	let data = null
	let headers = null
	function handleDrop(e) {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.onload = function (e) {
			/* DO SOMETHING WITH workbook HERE */
			/* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
			let workbook = XLSX.read(e.target.result);
			let sheets = workbook.Sheets

			let sheet = sheets[workbook.SheetNames[0]]
			console.log(sheet);
			window.sheet = sheet


			headers = [];
			data = [];
			const range = XLSX.utils.decode_range(sheet['!ref']);
			/* 按列进行数据遍历 */
			for (let C = range.s.c; C <= range.e.c; ++C) {
				data[C] = [];
				for (let R = range.s.r; R <= range.e.r; ++R) {
					const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
					if (R == 0) {
						/* 查找第一行中的单元格 */
						let hdr = "UNKNOWN " + C; // <-- 进行默认值设置
						if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
						headers.push(hdr);
						continue;
					}
					data[C].push(XLSX.utils.format_cell(cell));
				}

			}

			// 批量导入按钮
			inputBtn.disabled = false
			inputBtn.style.cursor = "pointer"

		};
		reader.readAsArrayBuffer(file);
	}
	function getName(str) {
		let index = str.indexOf("(")
		if (index <= 0) index = str.indexOf("（")
		if (index <= 0) return str;
		else return str.slice(0, index)
	}
	function run() {
		let infos = []
		let dom_parent = window[1][1].document.querySelector("#dataTables > tbody")
		let trNodes = dom_parent.childNodes
		for (let i = 0; trNodes && i < trNodes.length; ++i) {
			if (trNodes[i].childNodes[0].querySelector("input").checked) {
				let info = []
				info.push(trNodes[i].childNodes[17].title) // addr
				info.push(trNodes[i].id) // id
				infos.push(info)
			}

		}
		if (infos.length <= 0) {
			alert("请勾选列表")
			return
		}


		let addr_index = headers.indexOf("考试地点")
		let t_index = headers.indexOf("主监考")
		let t_1_index = headers.indexOf("副监考1")
		let t_2_index = headers.indexOf("副监考2")
		let addr_map = new Map()
		let addrs = data[addr_index]

		if (addr_index <= 0 || t_index <= 0 || t_1_index <= 0 || t_2_index <= 0) {
			alert("请检查表格表头")
			return
		}
		for (let i = 0; i < addrs.length; i++) {
			const el = addrs[i];
			addr_map.set(el, [data[t_index][i], data[t_1_index][i], data[t_2_index][i]])
		}

		// 开始导入
		let test = Promise.resolve()
		for (let i = 0; i < infos.length; i++) {
			const el = infos[i];
			test = test.then(() => {
				// 查找对应的老师
				let procs = []
				if (!addr_map.has(el[0])) {
					alert("表格中没有考场'" + el[0] + "'的监考老师信息！已跳过该考场的导入")
					return Promise.resolve()
				}
				let ts = addr_map.get(el[0])
				// 查找主监考老师
				if (ts[0] != null && ts[0] != '') {
					procs.push(new Promise(function (resolve, reject) {
						$.ajax({
							url: "https://jw.jxust.edu.cn/kwsjglAction.do?method=queryJs",
							data: "kw0401id=627&maxRow=10&xm=" + getName(ts[0]), type: "POST", dataType: "json",
							success: function (data) {
								resolve(data.list[0])
							},
							error: function (data) {
								alert("主监考查询错误！")
								resolve()
							}
						});
					}))
				} else {
					alert("主监考不存在！")
					return Promise.reject()
				}
				// 副监考1
				if (ts[1] != null && ts[1] != '') {
					procs.push(new Promise(function (resolve, reject) {
						$.ajax({
							url: "https://jw.jxust.edu.cn/kwsjglAction.do?method=queryJs",
							data: "kw0401id=627&maxRow=10&xm=" + getName(ts[1]), type: "POST", dataType: "json",
							success: function (data) {
								resolve(data.list[0])
							},
							error: function (data) {
								reject()
							}
						});

					}))
				}
				// 副监考2
				if (ts[2] != null && ts[2] != '') {
					procs.push(new Promise(function (resolve, reject) {
						$.ajax({
							url: "https://jw.jxust.edu.cn/kwsjglAction.do?method=queryJs",
							data: "kw0401id=627&maxRow=10&xm=" + getName(ts[2]), type: "POST", dataType: "json",
							success: function (data) {
								resolve(data.list[0])
							},
							error: function (data) {
								reject()
							}
						});
					}))
				}
				return Promise.all(procs).then(function ([d, d_1, d_2]) {
					if (!d_1) d_1 = { xm: "", kw0405id: "" }
					if (!d_2) d_2 = { xm: "", kw0405id: "" }
					return new Promise((resolve, reject) => {
						// 保存信息
						console.log([el[0], ...ts]);
						setTimeout(() => {
							$.ajax({
								url: "https://jw.jxust.edu.cn/kwsjglAction.do?method=addplapZjk",
								data: "checkjs=&kw0410id=" + el[1] + "&kw0401id=627&" +
									"jsmc=" + d.xm + "&kw0405id=" + d.kw0405id + "&ykw0405id=" + d.kw0405id + "&xx04id=&jklb=0&c=1&cc=1&" +
									"jsmc1=" + d_1.xm + "&kw0405id1=" + d_1.kw0405id + "&ykw0405id1=" + d_1.kw0405id + "&xx04id1=&jklb1=1&c1=1&cc1=1&" +
									"jsmc2=" + d_2.xm + "&kw0405id2=" + d_2.kw0405id + "&ykw0405id2=" + d_2.kw0405id + "&xx04id2=&jklb2=2&c2=1&cc2=1&jcct=1&sl=2",
								success: function (data, status) {
									if (status != 'success')
										alert("保存考场'" + el[0] + "'出错了,将跳过该考场的导入")
									resolve()
								},
								error: function (data) {
									alert("保存考场'" + el[0] + "'出错了，网络异常或请检测该考场的监考信息！将跳过该考场的导入")
									resolve()
								}
							});
						}, (Math.random() + 1) * 1000);
					})
				}).catch((e) => {
					alert("考场'" + el[0] + "'的监考老师查询错误!将跳过该考场的导入")
					return Promise.resolve()
				})
			})
		}
		test.then(() => {
			alert("导入完成")
		}).catch(() => { })
	}
	setInterval(() => {
		if (!window || !window[1] || !window[1][1]) return
		let pageNodes = window[1][1].document.querySelectorAll(".selectTag")
		let toolViewNodes = window[1][1].document.querySelectorAll("#toolAndSearchView div table tbody tr td")
		let inputOrNot = window[1][1].document.querySelector("#input_dom_element")
		if (pageNodes == null || pageNodes.length == 0) return
		if (toolViewNodes == null || toolViewNodes.length == 0) return
		if (inputOrNot) return
		let flag = false
		for (let i = 0; i < pageNodes.length; i++) {
			const element = pageNodes[i];
			if (element.innerText.trim() == "考场考试安排")
				flag = true
		}
		if (!flag) return
		let script = document.createElement("script")
		document.head.appendChild(script)
		script.src = "https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js"
		let tool_view = window[1][1].document.querySelector("#toolAndSearchView div table tbody tr")
		let td = window[1][1].document.querySelector("#toolAndSearchView div table tbody tr td").cloneNode(true)
		// 导入文件按钮
		td.style.paddingLeft = "5px"
		let input = td.querySelector("input")
		input.id = "input_dom_element"
		input.type = "file"
		input.accept = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		input.onclick = () => { }
		input.addEventListener("change", handleDrop, false);
		input.disabled = true
		tool_view.appendChild(td)
		// 批量导入按钮
		td = window[1][1].document.querySelector("#toolAndSearchView div table tbody tr td").cloneNode(true)
		inputBtn = td.querySelector("input")
		inputBtn.value = "开始导入"
		inputBtn.onclick = run
		inputBtn.disabled = true
		inputBtn.style.cursor = "default"
		tool_view.appendChild(td)
		script.onload = function () {
			input.disabled = false
		}
	}, 3000);
})()
