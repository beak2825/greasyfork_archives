// ==UserScript==
// @name         doc88 文章地址采集
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  采集
// @author       MF
// @match        https://www.doc88.com/tag/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doc88.com
// @run-at 		 document-idle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getTabs
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/510605/doc88%20%E6%96%87%E7%AB%A0%E5%9C%B0%E5%9D%80%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/510605/doc88%20%E6%96%87%E7%AB%A0%E5%9C%B0%E5%9D%80%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let MF =
		'#MF_fixed{position:fixed;top:20%;right:20px;gap:10px;flex-direction:column;z-index:2147483647;display:flex}';
	MF +=
		'.MF_box{padding:10px;cursor:pointer;border-color:rgb(0,102,255);border-radius:5px;background-color:white;color:rgb(0,102,255);border:1px solid}.MF_active{color: green}#MF_k_page_no,#MF_k_page_size{color: red;};';
	const prefix = "MF_";

	class Box {
		id = ""; // id
		label = ""; // 按钮文本
		fun = ""; // 执行方法
		constructor(id, label, fun) {
			this.id = id;
			this.label = label;
			this.fun = fun;
		}
	}

	class Utility {
		debug = true;

		/**
		 * 添加 css 样式
		 * @param e 节点
		 * @param data JSON 格式样式
		 */
		style(e, data) {
			Object.keys(data).forEach(key => {
				e.style[key] = data[key]
			})
		}

		attr(e, key, val) {
			if (!val) {
				return e.getAttribute(key);
			} else {
				e.setAttribute(key, val);
			}

		}

		/**
		 *  追加样式
		 * @param css  格式样式
		 */
		appendStyle(css) {
			let style = this.createEl('', 'style');
			style.textContent = css;
			style.type = 'text/css';
			let dom = document.head || document.documentElement;
			dom.appendChild(style);
		}

		/**
		 * @description 创建 dom
		 * @param id 必填
		 * @param elType
		 * @param data
		 */
		createEl(id, elType, data) {
			const el = document.createElement(elType);
			el.id = id || '';
			if (data) {
				this.style(el, data);
			}
			return el;
		}

		query(el) {
			return document.querySelector(el);
		}

		queryAll(el) {
			return document.querySelectorAll(el);
		}

		update(el, text) {
			const elNode = this.query(el);
			if (!elNode) {
				console.log('节点不存在');
			} else {
				elNode.innerHTML = text;
			}
		}

		/**
		 * 进度
		 * @param current 当前数量 -1预览结束
		 * @param total 总数量
		 * @param content 内容
		 */
		preview(current, total, content) {
			return new Promise(async (resolve, reject) => {
				if (current === -1) {
					this.update('#' + prefix + 'text', content ? content : "已完成");
				} else {
					let p = (current / total) * 100;
					let ps = p.toFixed(0) > 100 ? 100 : p.toFixed(0);
					console.log('当前进度', ps)
					this.update('#' + prefix + 'text', '进度' + ps + '%');
					await this.sleep(500);
					resolve();
				}
			})

		}

		preText(content) {
			this.update('#' + prefix + 'text', content);
		}

		gui(boxs) {
			const box = this.createEl(prefix + "fixed", 'div');
			for (let x in boxs) {
				let item = boxs[x];
				if (!item.id) continue;
				let el = this.createEl(prefix + item.id, 'button');
				el.append(new Text(item.label));
				if (x === '0') {
					el.classList = prefix + 'box ' + prefix + "active";
				} else {
					el.className = prefix + "box";
				}
				if (item.fun) {
					el.onclick = function() {
						eval(item.fun);
					}
				}
				if (item.id === 'speed') {
					this.attr(el, 'contenteditable', true)
				}
				box.append(el);
			}
			document.body.append(box);
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		log(msg) {
			if (this.debug) {
				console.log(msg);
			}
		}

		logt(msg) {
			if (this.debug) {
				console.table(msg);
			}
		}
	}

	const u = new Utility();
	u.appendStyle(MF);


	const btns = [
		new Box('text', '0'),
		new Box('selectAll', '全选', 'selectAll(1)'),
		new Box('reverse', '反选', 'selectAll()'),
		new Box('downloadText', '下载', 'downloadText()'),
	]
	u.gui(btns);


	/**
	 * @description 轻提示
	 * @param {String} message 
	 * @param {Number} duration
	 */
	const showToast = (message, duration) => {
		const styles = {
			"position": "fixed",
			"top": "20px",
			"left": "50%",
			"transform": "translateX(-50%)",
			"z-index": 9999,
			"background-color": "#333",
			"color": "red",
			"padding": "10px 20px",
			"border-radius": "5px",
			"text-align": "center",
			"transition": "opacity 0.3s"
		};
		// 创建轻提示元素
		var toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = message;
		for (let key of Object.keys(styles)) {
			toast.style[key] = styles[key];
		}
		// 将轻提示添加到页面中
		document.body.append(toast);
		// 隐藏轻提示
		setTimeout(function() {
			setTimeout(function() {
				document.body.removeChild(toast);
			}, 300);
		}, duration || 1000);
	}

	const setData = new Set(); // 


	// 统计视频数量
	function statsVideo(value, checked) {
		if (value) {
			if (!checked) {
				console.log(setData.size);
				setData.delete(value)
				console.log(setData.size);
			} else {
				setData.add(value)
			}
		}
		u.preText(setData.size)
	}

	// 选择
	function selectAll(params) {
		document.querySelectorAll('input[type="checkbox"]').forEach(item => {
			if (params) {
				item.checked = true;
				setData.add(item.value)
			} else {
				item.checked = !item.checked;
				setData.delete(item.value)
			}
		});
		statsVideo()
	}
	// 添加多选框
	function createCheckbox(vid) {
		const checkbox = document.createElement('input');
		checkbox.className = 'tk-checkbox'
		checkbox.type = 'checkbox'
		checkbox.name = 'videos';
		checkbox.style =
			'position:absolute;top:-10px;left:-38px;width:30px;height:30px;z-index:100;appearance: auto;';
		checkbox.checked = true;
		checkbox.value = vid;
		checkbox.onclick = function() {
			statsVideo();
		}
		return checkbox;
	}

	function HandleData() {
		const data = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(item => item.value);
		data.forEach(item => {
			setData.add(item);
		})
	}


	// 视频列表
	function addCheckbox() {
		[...document.querySelectorAll('.sd-type-title')].forEach(item => {
			item.style = "position: relative;";
			if (!item.querySelector('.tk-checkbox')) {
				const a = item.querySelector('a');
				const href = a.getAttribute('href');
				item.append(createCheckbox(href))
			}
		})
		HandleData()
	}
	// 监听滚动事件
	document.addEventListener('scroll', (e) => {
		addCheckbox()
		statsVideo()
	})

	function downloadText() {
		exportListData(Array.from(setData).join('\n'), '文件列表.txt');
	}

	function exportListData(data, filename) {
		const csvContent = "data:text/txt;charset=utf-8," + data;
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", filename);

		// 点击链接以下载文件
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}


	setTimeout(() => {
		showToast('请滚动页面，加载更多视频！')
		addCheckbox()
	}, 2500)
})();