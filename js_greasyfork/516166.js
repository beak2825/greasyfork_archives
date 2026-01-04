// ==UserScript==
// @name         易班自动发帖网薪经验值
// @namespace    https://wechatid.github.io/2024/11/06/Yiban-JSmonkey/
// @version      1.2.1
// @description  易班自动发贴微社区的脚本，完全自动获取网薪经验值。自动检测内容是否重复，重复即重新输入新的内容内容，易班微社区完全自动发帖脚本，自动获取网薪和经验值
// @match        https://s.yiban.cn/userPost/detail
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/516166/%E6%98%93%E7%8F%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%96%E7%BD%91%E8%96%AA%E7%BB%8F%E9%AA%8C%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/516166/%E6%98%93%E7%8F%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%96%E7%BD%91%E8%96%AA%E7%BB%8F%E9%AA%8C%E5%80%BC.meta.js
// ==/UserScript==
(function() {
	"use strict";


	let sever = 'http://113.45.159.104:8000';
	let SIMINPUTFROM_CONNET_AUTOINCREM = 0;
	let submits_count = 0;
	const panel = document.createElement('div');
	panel.id = 'floating-panel';
	panel.innerHTML = `
        <div class="header" id="panel-header">
            <h1 class="title">易班自动发帖</h1>
            <button id="toggle-panel" class="toggle-btn">收起</button>
        </div>
        <div class="content">
            <div class="announcement">
                <p>公告：欢迎使用易班自动发帖工具，自动发帖零风险100%安全。<br><a href="https://greasyfork.org/zh-CN/scripts/517184-%E6%98%93%E7%8F%AD%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E7%82%B9%E8%B5%9E" target="_blank">易班帖子自动评论点赞脚本</a><br>加QQ群获取<strong>免费</strong>试用额度，群号：912033859  验证密码为：9412<br>刷网薪值和经验值必备！</p>
            </div>
                <div class="button-box">
    <button class="green-button"><a style="color: white;" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=73thmEuo_TCaipv8gUuEk1cTbbTgGKIe&authKey=iJEotuZey7eVphPY8Ab9b3Jk%2FSfg00laloCvM6%2FfjLkWv1sgtUWxnMtwLACYn18f&noverify=0&group_code=912033859" target="_blank">加QQ群</a></button>
    <button class="orange-button"><a style="color: white;" href="https://hsfaka.cn/shop/D2GYQYL1" target="_blank">购买卡密</a></button>
</div>
            <div class="status">
                <div class="status-item">
                    <label for="remaining">剩余<br>次数</label>
                    <input type="text" id="remaining" value="" readonly>
                </div>
                <div class="status-item">
                    <label for="posted">现在<br>发帖</label>
                    <input type="text" id="posted" value="" readonly>
                </div>
            </div>
            <div class="key-section">
                <label for="api-key">你的key：</label>
                <input type="text" id="api-key" placeholder="请输入你的卡密">
                <button id="submit-btn">确认</button>
            </div>
        </div>
    `;

	const body = document.body;

	body.insertBefore(panel, body.firstChild);


	GM_addStyle(`
        /* 面板样式 */
        #floating-panel {
            position: fixed;
            top: 30%;
            left: 20px;
            width: 250px; /* 调整面板宽度 */
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            overflow: hidden;
            cursor: move; /* 鼠标样式 */
        }

       #floating-panel .header {
    background-color: #007bff;
    color: #fff;
    padding: 8px;
    text-align: center;
    border-radius: 8px 8px 0 0;

    /* 使用 Flexbox 实现垂直排列 */
    display: flex;
    flex-direction: column;    /* 子元素垂直排列 */
    justify-content: center;   /* 垂直居中 */
    align-items: center;       /* 水平居中 */

}

        #floating-panel .header h1 {
            font-size: 16px;
            margin: 0;
        }

        #floating-panel .toggle-btn {
            background-color: #f5f5f5;
            border: none;
            color: #333;
            cursor: pointer;
            padding: 5px 8px;
            font-size: 12px;
            border-radius: 5px;
        }

        #floating-panel .toggle-btn:hover {
            background-color: #ddd;
        }
        #floating-panel .header .toggle-btn {
    margin-top: 8px;  /* 为按钮添加上边距，确保按钮与标题有间距 */
}

        /* 内容区域 */
        #floating-panel .content {
            padding: 15px;
            display: block;
        }

        #floating-panel .announcement {
            background-color: #e6f7ff;
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 12px;
        }
        .announcement p {
    line-height: 1.3;    /* 公告行间距 */
}

        #floating-panel .status {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        #floating-panel .status-item {
            display: flex;
            align-items: center;
        }

        #floating-panel .status-item label {
            margin-right: 8px;
            font-size: 12px;
        }

        #floating-panel .status-item input {
            width: 60px;
            padding: 4px;
            text-align: center;
            font-size: 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        #floating-panel .key-section {
            margin-bottom: 12px;
        }

        #floating-panel .key-section label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
        }

        #floating-panel .key-section input {
            width: 100%;
            padding: 6px;
            font-size: 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        #floating-panel .key-section button {
            padding: 8px 16px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        #floating-panel .key-section button:hover {
            background-color: #0056b3;
        }
.button-box {
        display: flex;
        justify-content: center;  /* 水平居中 */
        gap: 20px;  /* 按钮之间的间隔 */
        margin-top: 20px;  /* 上部间隔 */
        margin-bottom: 20px;  /* 下部间隔 */
    }

    /* 绿色按钮的样式 */
    .green-button {
        background-color: #1168F4;  /* 绿色背景 */
        color: white;  /* 白色文字 */
        border: none;  /* 无边框 */
        padding: 4px 12px;  /* 内边距 */
        cursor: pointer;  /* 鼠标指针 */
        border-radius: 30px;  /* 圆角 */
    }

    /* 橙色按钮的样式 */
    .orange-button {
        background-color: #2CF411;  /* 橙色背景 */
        color: white;  /* 白色文字 */
        border: none;  /* 无边框 */
        padding: 4px 12px;  /* 内边距 */
        cursor: pointer;  /* 鼠标指针 */
        border-radius: 30px;  /* 圆角 */
    }

    /* 鼠标悬停时的效果 */
    .green-button:hover, .orange-button:hover {
        opacity: 0.8;  /* 悬停时稍微透明 */
    }

    `);

	// 实现收起和展开功能
	const toggleButton = document.getElementById('toggle-panel');
	const contentArea = document.querySelector('.content');
	let isCollapsed = false;

	toggleButton.addEventListener('click', () => {
		if (isCollapsed) {
			contentArea.style.display = 'block';
			toggleButton.textContent = '收起';
		} else {
			contentArea.style.display = 'none';
			toggleButton.textContent = '展开';
		}
		isCollapsed = !isCollapsed;
	});

	// 拖动功能
	let isDragging = false;
	let offsetX, offsetY;

	const panelHeader = document.getElementById('panel-header');

	panelHeader.addEventListener('mousedown', (e) => {
		isDragging = true;
		offsetX = e.clientX - panel.offsetLeft;
		offsetY = e.clientY - panel.offsetTop;
		panel.style.cursor = 'move';
	});

	document.addEventListener('mousemove', (e) => {
		if (isDragging) {
			panel.style.left = `${e.clientX - offsetX}px`;
			panel.style.top = `${e.clientY - offsetY}px`;
		}
	});

	document.addEventListener('mouseup', () => {
		isDragging = false;
		panel.style.cursor = 'move';
	});

	// 从 localStorage 中读取保存的 API Key
	let savedKey = localStorage.getItem('apiKey');
	if (savedKey) {
		// 如果有保存的API Key，将其填充到输入框
		document.getElementById('api-key').value = savedKey;
	} else {
		document.getElementById('api-key').placeholder = "暂未填写你的卡密";
	}
	// 获取确认按钮并添加事件监听器
	document.getElementById('submit-btn').addEventListener('click', function() {
		// 获取用户输入的 API Key
		const apiKey = document.getElementById('api-key').value;

		if (apiKey) {
			// 存储用户输入的 API Key 到 localStorage
			localStorage.setItem('apiKey', apiKey);
			savedKey = localStorage.getItem('apiKey');
			document.getElementById('api-key').value = savedKey;
			alert('卡密已保存，请妥善保管，清除缓存会丢失卡密信息！刷新页面即可开始');
		} else {
			//alert('请输入有效的API Key');
		}
	});

	let input = document.getElementById('remaining');

	GM_xmlhttpRequest({
		method: 'GET',
		url: sever + '/check_counter?key=' + savedKey,
		headers: {
			'Accept': 'application/json'
		},
		onload: function(r) {
			if (r.status === 200) {
				try {
					const j = JSON.parse(r.responseText);
					input.value = j.counter;
				} catch (e) {
					input.value = '响应解析失败';
				}
			} else {
				input.value = '卡密不存在';
			}
		},
		onerror: function() {
			input.value = '请求失败';
		}
	});



	function simulateComplexClick(element, offsetX, offsetY) {
		let rect = element.getBoundingClientRect();
		let click_x = rect.left + offsetX;
		let click_y = rect.top + offsetY;

		["mousedown", "mouseup", "click", /* "touchstart"*/ ].forEach((eventType) => {
			var clickEvent = new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true,
				view: unsafeWindow,
				clientX: click_x,
				clientY: click_y,
			});
			element.dispatchEvent(clickEvent);
			let td;
			let td_s = setInterval(() => {
                //发帖成功之后的页面按钮
                td = document.querySelector("body > div.container > section > div.mdc-alert.mdc-alert--success > div");
				if (td == null) {
					console.log('检测不到');
					verify();
					clearInterval(td_s);
				}
				clearInterval(td_s);
			}, 4000);


		});


	}

	function waitForElement(selector, timeout = 3000) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			// 定时器检查元素是否存在
			const msgIsRepeat_int = setInterval(() => {
				const msgIsRepeat = document.querySelector(selector);
				if (msgIsRepeat) {
					clearInterval(msgIsRepeat_int); // 找到元素时清除定时器
					resolve(msgIsRepeat); // 返回元素
				}

				// 如果超过指定的时间还没找到元素
				if (Date.now() - startTime > timeout) {
					clearInterval(msgIsRepeat_int); // 超时时清除定时器
					reject(new Error(`Element not found within ${timeout} ms`)); // 返回超时错误
				}
			}, 200); // 每100毫秒检查一次
		});
	}


	window.simulateComplexClick = simulateComplexClick
	let bg_url = ''; // 全局状态变量，存储背景图 URL
	let interval; // 用于保存定时器引用

	function verify() {
		// 清除之前的定时器
		if (interval) {
			clearInterval(interval);
		}

		setTimeout(() => {
			interval = setInterval(() => {
				//let element = document.querySelector('.shumei_captcha_loaded_img_bg');
				let base_dom = document.querySelector("body").lastChild.childNodes[1].childNodes[0];

				waitForElement('body > div.mdc-confirm-dialog.mdc-dialog.mdc-dialog--open > div.mdc-dialog__container > div > footer > button.mdc-button.mdc-button--outlined.mdc-confirm-dialog__secondary-button')
					.then(msgIsRepeat => {
						console.log('Element found:', msgIsRepeat);
						clearInterval(interval);
						msgIsRepeat.click();
						SIMINPUTFROM_CONNET_AUTOINCREM--;
						edit_text();
						return;
						// 在这里处理找到的元素
					})
					.catch(error => {
						console.log(error.message);
						// 处理没有找到元素的情况（比如超时）
					});

				let element = base_dom.childNodes[0].childNodes[2].firstChild.firstChild;
				let msgIsRepeat;
				// msgIsRepeat = document.querySelector("body > div.mdc-confirm-dialog.mdc-dialog.mdc-dialog--open > div.mdc-dialog__container > div > footer > button.mdc-button.mdc-button--outlined.mdc-confirm-dialog__secondary-button");

				if (element) {
					console.log("333");
					// 检查 src 是否更新
					if (element.src.indexOf('https') !== -1 && bg_url !== element.src) {
						clearInterval(interval); // 清除定时器，防止重复执行
						bg_url = element.src; // 更新 bg_url

						GM_xmlhttpRequest({
							method: 'GET',
							url: sever + '/predict?key=' + savedKey + '&bg_img=' + encodeURIComponent(element.src),
							headers: {
								'Accept': 'application/json'
							},
							onload: function(r) {
								if (r.status === 200) {
									try {
										const j = JSON.parse(r.responseText);
										if (j['reply'] === 'success') {
											simulateComplexClick(base_dom.childNodes[0].childNodes[2].firstChild.firstChild, j['position']['X'] / 2, j['position']['Y'] / 2);
											input.value = j['counter'];
										} else {
											alert('次数不够');
										}
									} catch (e) {
										alert('响应解析失败');
									}
								} else {
									alert('卡密或者服务器错误');
								}
							},
							onerror: function() {
								alert('请求失败');
							}
						});
					}
				}
			}, 100);
		}, 100);
	}


	window.edit_text = function() {
		fetch("https://v1.hitokoto.cn/?c=i")
			.then((response) => response.json())
			.then((data) => {
				let info_text = data.hitokoto;
				let from = data.from;
				let author = data.from_who;

				let input_1 = document.querySelector(
					"body > div.container > section > div.mdc-form.mdc-form--horizontal > div:nth-child(1) > div > input"
				);
				let input_2 = document.querySelector(
					"body > div.container > section > div.mdc-form.mdc-form--horizontal > div:nth-child(2) > div > span.mdc-text-field__resizer > textarea"
				);
				let connet = document.getElementById(
					"ueditor_" + SIMINPUTFROM_CONNET_AUTOINCREM + ""
				).contentWindow.document.querySelector("body > p");
				let submit_btn = document.querySelector(
					"body > div.container > section > div.actions > div > button:nth-child(2) > div"
				);
				input_1.value = info_text;
				input_2.value = info_text;
				connet.innerHTML = "<p>" + info_text + "</p>" + "<p>" + "来自：" + from + "</p>" + "<p>" + "作者：" + author + "</p>";
				var event = document.createEvent("HTMLEvents");
				event.initEvent("input", true, true);
				event.eventType = "message";

				input_1.dispatchEvent(event);
				input_2.dispatchEvent(event);
				connet.dispatchEvent(event);

				SIMINPUTFROM_CONNET_AUTOINCREM++;
				setTimeout(() => {
					submit_btn.click();
					verify();
				}, 1000);
			});
	};
	window.scan_succeed = function() {
		let d;
		let _t = setInterval(() => {
			d = document.querySelector("body > div.container > section > div.mdc-alert.mdc-alert--success > div");
			if (d != null) {
				submits_count++;
				if (submits_count >= 20) {
					document.querySelector("head > title").innerHTML = "已完成! ";
					clearInterval(_t);
				} else {
					wait_cd();
					clearInterval(_t);
				}
			}
		}, 1000);
	};
	window.wait_cd = function() {
		let t = 60;

		let _t = setInterval(() => {
			document.querySelector("head > title").innerHTML = `🎉&nbsp;${String(submits_count)}&nbsp;/&nbsp;${String(t)}`;
			document.getElementById('posted').value = submits_count;
			t = t - 1;
			if (t == 0) {
				wait_cd_after();
				document.querySelector("head > title").innerHTML = "😴 等待验证口令...";
				clearInterval(_t);
			}
		}, 1000);
	};

	window.wait_cd_after = function() {
		let continueTo = document.querySelector(
			"body > div.container > section > div.mdc-alert.mdc-alert--success > div > p > a:nth-child(2) > div.mdc-button__ripple"
		);
		continueTo.click();

		setTimeout(() => {
			edit_text();
			scan_succeed();
		}, 1000);
	};

	setTimeout(() => {
		edit_text();
		scan_succeed();
	}, 2000);

	function w1t67rL1() {
		let pW7x = 5;
		let vB8j = 10;
		return pW7x + vB8j;
	}

	function z3lT9r0A(a, b) {
		let Y0i9p = a * b;
		let qN2u9s = Y0i9p / 2;
		return Y0i9p - qN2u9s;
	}

	function dB3J2wK() {
		let H7f = [1, 2, 3, 4, 5];
		H7f.push(6);
		H7f.pop();
		return H7f.length;
	}

	function tR8c2N(value) {
		let k0j = {
			a: 1,
			b: 2,
			c: 3
		};
		let f6d = k0j[value];
		return f6d;
	}

	function qT5w3X() {
		let M9b = "hello";
		let F7g = "world";
		return M9b + F7g;
	}

	function nW8r1Z() {
		let o8Q = 100;
		for (let z3p = 0; z3p < o8Q; z3p++) {

			Math.random();
		}
		return null;
	}

	function s1M9l3P(str) {
		let vQ9a = '';
		for (let i = 0; i < str.length; i++) {
			vQ9a += str.charAt(i);
		}
		let reversed = vQ9a.split('').reverse().join('');
		return reversed === vQ9a ? true : false;
	}

})();