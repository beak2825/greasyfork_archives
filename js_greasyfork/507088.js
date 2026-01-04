// ==UserScript==
// @name         tiktok gather
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  vid gather
// @author       MF
// @match        https://www.douyin.com/search/**
// @match        https://www.xiaohongshu.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @run-at 		 document-idle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getTabs
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/507088/tiktok%20gather.user.js
// @updateURL https://update.greasyfork.org/scripts/507088/tiktok%20gather.meta.js
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
		new Box('start', '开始采集', 'start()'),
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

	const TOTAL_COUNT = 50;
	const {
		host
	} = location;

	const dy = 'www.douyin.com';
	const xhs = 'www.xiaohongshu.com';

	const setDataXhs = new Set(); // 存放小红书数据
	const setDelXhs = new Set(); // 存放小红书数据

	/**
	 * @author Mr.Fang
	 * @description ID 生成器
	 */
	function randomId() {
		// 获取当前日期和时间
		const now = new Date();

		// 格式化日期和时间
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以+1
		const day = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		// 组合日期和时间字符串
		const timestampStr = `${year}${month}${day}${hours}${minutes}${seconds}`;

		// 生成一个随机数，假设我们想要一个1到9999之间的随机数
		const randomNum = Math.floor(Math.random() * 9999) + 1;
		const randomStr = randomNum.toString().padStart(4, '0');

		// 拼接时间戳和随机数
		return timestampStr + randomStr;
	}

	// 统计视频数量
	function statsVideo(value, checked) {
		console.log('value: ', checked, value);
		if (host === dy) {
			const checkeds = [...document.querySelectorAll('input[type="checkbox"]:checked')];
			u.preText(checkeds.length)
		} else {
			if (value) {
				if (!checked) {
					console.log(setDataXhs.size);
					setDataXhs.delete(value)
					console.log(setDataXhs.size);
				} else {
					setDataXhs.add(value)
				}
			}
			u.preText(setDataXhs.size)
		}
	}

	// 选择
	function selectAll(params) {
		document.querySelectorAll('input[type="checkbox"]').forEach(item => {
			if (params) {
				item.checked = true;
				setDataXhs.add(item.value)
			} else {
				item.checked = !item.checked;
				setDataXhs.delete(item.value)
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
		checkbox.style = 'position:absolute;top:0;width:50px;height:50px;z-index:100;appearance: auto;';
		checkbox.checked = true;
		checkbox.value = vid;
		checkbox.onclick = function() {
			statsVideo(this.value, this.checked);
		}
		return checkbox;
	}

	// 删除登录提示
	const maskInter = setInterval(() => {
		const mask = document.querySelector('[role="presentation"]');
		if (mask) {
			const close = mask.querySelector('.close-button');
			if (close) {
				close.click();
				clearInterval(maskInter)
			}
		}
	}, 500)


	function xhsHandleData() {
		const data = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(item => item.value);
		data.forEach(item => {
			setDataXhs.add(item);
		})
	}

	// 视频列表
	function addCheckboxXHS() {
		const nodes = document.querySelectorAll('.note-item')
		for (let node of nodes) {
			// const len = document.querySelectorAll('.tk-checkbox').length;
			// if (len && len >= TOTAL_COUNT) {
			// 	showToast('已达上限:' + TOTAL_COUNT)
			// 	console.log('current:', len, 'total:', TOTAL_COUNT);
			// 	break;
			// }
			const child = node.children[0];
			child.style = "position: relative;";
			if (!child.querySelector('.tk-checkbox')) {
				const a = child.querySelector('a');
				if (a) {
					const href = a.getAttribute('href');
					const cid = href.split('/').pop().split('?').shift()
					child.append(createCheckbox(cid))
				}
			}
		}
		xhsHandleData()
	}

	// 视频列表
	function addCheckboxDY() {
		[...document.querySelectorAll('ul[data-e2e="scroll-list"]')].forEach(item => {
			if (item.parentElement.style.display === 'block') {
				const nodes = [...item.children];
				for (let child of nodes) {
					// const len = document.querySelectorAll('.tk-checkbox').length;
					// if (len && len >= TOTAL_COUNT) {
					// 	showToast('已达上限:' + TOTAL_COUNT)
					// 	console.log('current:', len, 'total:', TOTAL_COUNT);
					// 	break;
					// }
					child.style = "position: relative;";
					if (!child.querySelector('.tk-checkbox')) {
						const a = child.querySelector('a');
						const href = a.getAttribute('href');
						const vid = href.split('/').pop().split('?').shift()
						child.append(createCheckbox(vid))
					}
				}
			}
		})
	}
	// 监听滚动事件
	document.addEventListener('scroll', (e) => {
		if (host === dy) {
			addCheckboxDY()
		} else {
			addCheckboxXHS()
		}
		statsVideo()
	})

	function start() {
		const t = Number(localStorage.getItem('tk_t'))
		if (t) {
			const abs = Date.now() - t;
			const oneMinute = 1 * 60 * 1000; // 30 秒
			if (abs < oneMinute) {
				showToast('操作过于频繁')
				return;
			}
		}

		const listVid = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(item => item.value);
		if (!listVid || !listVid.length) {
			showToast('未采集到任何数据，滚动页面')
			return;
		}

		const postData = {
			cookie: document.cookie,
		}
		if (host === dy) {
			const name = decodeURI(location.pathname.split('/').pop());
			postData.type = 'douyin'
			postData.listVid = listVid;
			postData.name = name;
			if (localStorage.getItem('user_info')) {
				postData.uid = JSON.parse(localStorage.getItem('user_info')).uid;
			}
		} else {
			const tag = document.querySelector('.content-container .active').innerText
			const keyword = new URLSearchParams(decodeURI(location.search)).get('keyword')
			postData.type = 'xhs'
			postData.listVid = Array.from(setDataXhs);
			postData.name = keyword || tag;
			const href = document.querySelector('li.user').querySelector('a').href;
			const uid = href.split('/').pop();
			console.log(uid);
			// postData.uid = uid
			// if (!postData.uid) {
			// 	alert('请先登录！')
			// 	return;
			// }
		}
		console.log('postData', postData);
		sendData(postData)
		// showToast(`任务：${name}已开始`)
		
		// 更新统计信息
		statsVideo()
	}

	function sendData(postData) {
		GM_xmlhttpRequest({
			method: 'POST',
			url: 'https://szzxuan.cn/admin/gather/gtTask/add',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(postData),
			onload: function(response) {
				if (response.status >= 200 && response.status < 300) {
					const res = JSON.parse(response.responseText)
					console.log('Success:', res);
					if (res.success) {
						showToast('采集成功');
						localStorage.setItem('tk_t', Date.now())
						// 删除
						document.querySelectorAll('input[type="checkbox"]').forEach(item => {
							item.remove();
						})
					} else {
						showToast(res.message);
					}
				} else {
					showToast('采集失败');
					console.error('Error:', response.status, response.statusText);
				}
			},
			onerror: function(response) {
				showToast('请求失败');
				console.error('Request failed:', response.status, response.statusText);
			}
		});
	}

	function tabsTest() {
		GM_getTabs((tabs) => {
			console.log(tabs);
			for (const [tabId, tab] of Object.entries(tabs)) {
				console.log(`tab ${tabId}`, tab);
			}
		});
	}

	setTimeout(() => {
		showToast('请滚动页面，加载更多视频！')
		if (host === dy) {
			addCheckboxDY()
		} else {
			addCheckboxXHS()
		}
	}, 2500)
	
	const list = [...document.querySelectorAll('.WV4fYvgt .dySwiperSlide img')].map(item=>{
		return item.src
	})
	const set = new Set(list);
	for(let f of set){
		console.log(f);
	}
	console.log(JSON.stringify());
})();