// ==UserScript==
// @name         bilibili_live_modify
// @namespace    http://tampermonkey.net/
// @match         *://live.bilibili.com/*
// @version      0.2
// @description  目前只能车
// @author       Yi MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492076/bilibili_live_modify.user.js
// @updateURL https://update.greasyfork.org/scripts/492076/bilibili_live_modify.meta.js
// ==/UserScript==
(function () {
	let website;//站点：0(斗鱼)，1(虎牙)，2(bilibili)，3(抖音)
	let url = window.location.host;//当前网址
	let cookie = document.cookie;//获取所有cookie
	let csrf = '';//csrf码
	let room_info = '';//房间信息
	let room_id = '';//房间号
	let data = '';//表单数据
	let sessdata = '';//B站登录状态
	let sleepTime = -1;
	let start = 0;//按钮状态：0启动 1停止
	let periodic = ''//周期状态
	let strI = 0;
	let strMax = 20;
	
	setTimeout(() => {
		initDLC();
	}, 7000);
	
    //初始化
	async function initDLC() {
		if (url === 'www.douyu.com') {
			website = 0;
		} else if (url === 'www.huya.com') {
			website = 1;
		} else if (url === 'live.bilibili.com') {
			website = 2;
			let temp = window.location.href.split("/")[3].split("?")[0];
			if (isNaN(parseFloat(temp))) {
				return;
			}
			room_info = await (await fetch("https://api.live.bilibili.com/room/v1/Room/get_info?room_id=" + temp)).json();
			room_id = room_info.data.room_id;
			let cookie_list = cookie.split(";");
			let flag = false;
		    for (let i = 0; i < cookie_list.length; i++) {
		    	let temp = cookie_list[i].trim().split("=");
		    	if (temp[0] === 'bili_jct') {
		    		csrf = temp[1];
		    	} else if (temp[0] === 'yimit_live_sessdata') {
					flag = true;
					cookie = cookie + ";SESSDATA=" + temp[1];
				}
		    }
			if (flag === false) {
				let returnGenerate = await run_unicycle_request_GET("https://passport.bilibili.com/x/passport-login/web/qrcode/generate");
				
				let login_live = document.createElement("div");
				login_live.setAttribute("style", "z-index: 999;position: fixed; top: 35%; left: 40%;background: #ffffff;padding: 0.3%;height: 16%; width: 7%;border-radius: 12px;display: block;");
				let main_live = document.querySelectorAll(".app-content.p-relative.z-app-content");
				main_live[0].appendChild(login_live);
				let login_live_text = document.createElement("div");
				login_live_text.innerHTML = "使用脚本前，请先用bilibili手机客户端扫码登陆";
				login_live_text.setAttribute("style", "color: #f69; text-align: center;");
				login_live.appendChild(login_live_text);
				let qrcode = document.createElement("div");
				qrcode.setAttribute("id", "qrcode");
				let img = new QRCode(qrcode, {
					text: returnGenerate[0].data.url,
					width: 180,
					height: 180,
					colorDark : "#000000",
					colorLight : "#ffffff"
				});
				login_live.appendChild(qrcode);
				
				let code = 1;
				while (code !== 0) {
					let login_in = await run_unicycle_request_GET("https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=" + returnGenerate[0].data.qrcode_key);
					code = login_in[0].data.code;
					if (code === 86090) {
						alert("二维码已扫未确认");
					} else if (code === 86038) {
						alert("二维码已失效");
					} else if (code === 0) {
						alert("账号已登录");
						let sessdata = login_in[1].split('\n');
						for (let i = 0; i < sessdata.length; i++) {
							let set_cookie = sessdata[i].split(';');
							if (set_cookie.length > 1) {
								for (let j = 0, k = 0; j < set_cookie.length; j++) {
									let set_temp = set_cookie[j].split("=");
									if (set_temp[0].indexOf("SESSDATA") !== -1) {
										sessdata = set_temp[1];
									} else if (set_temp[0].trim() === 'Expires' && k === 0) {
										document.cookie = "yimit_live_sessdata=" + sessdata + "; expires=" + set_temp[1];
										cookie = cookie + ";SESSDATA=" + sessdata;
										k++;
									}
								}
							}
						}
						login_live.setAttribute("style", "z-index: 999;position: fixed; top: 35%; left: 40%;background: #ffffff;padding: 0.3%;height: 16%; width: 7%;border-radius: 12px;display: none;");
					}
					sleep(10);
				}
			}
		}
		
		let ul_tab_list = document.querySelectorAll(".tab-list.dp-flex");
		let tab_content = document.querySelectorAll(".tab-content.ts-dot-2.tab-content-pilot");
		let unicycle_test1_height = document.querySelectorAll(".tabs");
		
		if (document.getElementsByTagName("iframe").length > 2) {
			ul_tab_list = document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".tab-list.dp-flex");
			tab_content = document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".tab-content.ts-dot-2.tab-content-pilot");
			unicycle_test1_height = document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".tabs");
		}
		
		// let ul_tab_list = document.querySelectorAll(".tab-list.dp-flex");
		// alert(document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".tab-list.dp-flex").length);
		let li_tab_list = document.createElement("li");
		li_tab_list.setAttribute("id", "li-tab-list");
		li_tab_list.setAttribute('data-v-9a8f688c', '');
		li_tab_list.setAttribute('data-v-9d1b85a4', '');
		li_tab_list.setAttribute('class', 'item live-skin-normal-text dp-i-block live-skin-separate-border border-box t-center pointer opacity6');
		li_tab_list.setAttribute('height', '14px');
		li_tab_list.setAttribute('line-height', '14px');
		li_tab_list.setAttribute('border-right', '1px solid #e3e5e7;');
		li_tab_list.setAttribute('flex', '1');
		li_tab_list.innerHTML = "独轮车";
		ul_tab_list[0].appendChild(li_tab_list);
		let ul_tab_children = ul_tab_list[0].querySelectorAll('li');
		
		let unicycle_test1 = document.createElement("div");
		unicycle_test1.className = "unicycle-test1";
		unicycle_test1.setAttribute('data-v-018ef60e', '');
		unicycle_test1.setAttribute('data-v-30dc9297', '');
		unicycle_test1.setAttribute('style', 'z-index: 999;position: absolute;background: rgba(255, 255, 255, 0);');
		unicycle_test1.setAttribute('class', 'gift-rank-cntr live-skin-coloration-area rank-list-content a-move-in-top');
		unicycle_test1.style.width = tab_content[0].offsetWidth + 'px';
		unicycle_test1.style.top = unicycle_test1_height[0].offsetHeight + 'px';
		// unicycle_test1.style.height = 400 + 'px';
		unicycle_test1.style.height = "80%";
		unicycle_test1.style.display = 'none';
		tab_content[0].appendChild(unicycle_test1);
		
		let mode = document.createElement("div");
		mode.style.padding = "1%";
		mode.style.height = "100%";
		unicycle_test1.appendChild(mode);
		
		let mode_top = document.createElement("div");
		mode_top.style.width = "98%";
		mode_top.style.height = "7%";
		mode_top.style.padding = "0% 1% 2% 1%";
		mode.appendChild(mode_top);
		
		let mode_top_select = document.createElement("div");
		mode_top_select.style.height = "100%";
		mode_top_select.style.width = "50%";
		mode_top_select.style.display = "inline-flex";
		mode_top_select.innerHTML = "模式选择："
		mode_top_select.style.alignItems = "center";
		let mode_top_select_1 = document.createElement("select");
		mode_top_select_1.style.height = "100%";
		mode_top_select_1.style.borderRadius = "4px";
		mode_top_select_1.style.border = "1px solid rgba(255,102,153,0.8)";
		mode_top.appendChild(mode_top_select);
		mode_top_select.appendChild(mode_top_select_1);
		
		let mode_top_select_option_0 = document.createElement("option");
		mode_top_select_option_0.value = "0";
		mode_top_select_option_0.innerHTML = "单句模式";
		mode_top_select_option_0.style.border = "0";
		mode_top_select_option_0.style.padding = "0";
		mode_top_select_option_0.style.borderRadius = "4px";
		mode_top_select_1.appendChild(mode_top_select_option_0);
		
		let mode_top_select_option_1 = document.createElement("option");
		mode_top_select_option_1.value = "1";
		mode_top_select_option_1.innerHTML = "说书模式";
		mode_top_select_option_1.style.border = "0";
		mode_top_select_option_1.style.padding = "0";
		mode_top_select_option_1.style.borderRadius = "4px";
		mode_top_select_1.appendChild(mode_top_select_option_1);
		
		let mode_top_select_option_2 = document.createElement("option");
		mode_top_select_option_2.value = "2";
		mode_top_select_option_2.innerHTML = "编程模式";
		mode_top_select_option_2.style.border = "0";
		mode_top_select_option_2.style.padding = "0";
		mode_top_select_option_2.style.borderRadius = "4px";
		mode_top_select_1.appendChild(mode_top_select_option_2);
		
		let mode_top_select_option_3 = document.createElement("option");
		mode_top_select_option_3.value = "3";
		mode_top_select_option_3.innerHTML = "随机模式";
		mode_top_select_option_3.style.border = "0";
		mode_top_select_option_3.style.padding = "0";
		mode_top_select_option_3.style.borderRadius = "4px";
		mode_top_select_1.appendChild(mode_top_select_option_3);
		
		let mode_top_select_right = document.createElement("div");
		mode_top_select_right.style.height = "100%";
		mode_top_select_right.style.width = "50%";
		mode_top_select_right.style.display = "inline-flex";
		mode_top.appendChild(mode_top_select_right);
		
		let mode_top_select_right_text = document.createElement("input");
		mode_top_select_right_text.setAttribute("id", "input_time");
		mode_top_select_right_text.type = "text";
		mode_top_select_right_text.style.width = "80%";
		mode_top_select_right_text.style.float = "right";
		mode_top_select_right_text.placeholder = "间隔时间(ms)";
		mode_top_select_right_text.style.borderRadius = "4px 0 0 4px";
		mode_top_select_right_text.style.padding = "0% 2%";
		mode_top_select_right_text.style.border = "1px solid rgba(255,102,153,0.8)";
		mode_top_select_right.appendChild(mode_top_select_right_text);
		let text_time = mode_top_select_right_text.value;
		
		let mode_top_select_right_span = document.createElement("span");
		mode_top_select_right_span.innerHTML = "ms";
		mode_top_select_right_span.style.display = "block";
		mode_top_select_right_span.style.justifyContent = "center";
		mode_top_select_right_span.style.alignContent = "center";
		mode_top_select_right_span.style.textAlign = "center";
		mode_top_select_right_span.style.width = "20%";
		mode_top_select_right_span.style.borderRadius = "0 4px 4px 0";
		mode_top_select_right_span.style.border = "1px solid rgba(255,102,153,0.8)";
		mode_top_select_right.appendChild(mode_top_select_right_span);
		
		let mode_text = document.createElement("textarea");
		mode_text.rows = "10";
		mode_text.cols = "20";
		mode_text.placeholder = "有活的整活，没活的复制，直播间不养闲人！";
		mode_text.style.width = "96%";
		mode_text.style.height = "75%";
		mode_text.style.padding = "2%";
		mode_text.style.borderRadius = "4px";
		mode_text.style.border = "1px solid rgba(255,102,153,0.8)";
		mode_text.setAttribute("id", "mode-text");
		mode.appendChild(mode_text);
		let text_str = mode_text.value;
		
		let mode_button = document.createElement("div");
		mode_button.style.padding = "2% 0%";
		mode_button.style.width = "100%";
		mode_button.style.height = "8%";
		mode_button.style.display = "inline-flex";
		mode.appendChild(mode_button);
		
		let mode_button_left = document.createElement("div");
		mode_button_left.style.height = "100%";
		mode_button_left.style.width = "50%";
		mode_button_left.style.display = "inline-flex";
		mode_button.appendChild(mode_button_left);
		
		let mode_button_right = document.createElement("div");
		mode_button_right.style.height = "100%";
		mode_button_right.style.width = "50%";
		mode_button_right.style.display = "inline-flex";
		mode_button.appendChild(mode_button_right);
		
		let mode_button_button = document.createElement("button");
		mode_button_button.setAttribute("id", "mode_button_button");
		mode_button_button.innerHTML = "独轮车，启动！";
		mode_button_button.style.padding = "0% 3%";
		mode_button_button.style.width = "94%";
		mode_button_button.style.background = "rgba(255,102,153,0.8)";
		mode_button_button.style.color = "#ffffff";
		mode_button_button.style.border = "0";
		mode_button_button.style.borderRadius = "4px";
		mode_button_right.appendChild(mode_button_button);
		
		for (let j = 0; j < ul_tab_children.length; j++) {
			ul_tab_children[j].addEventListener('click', (function(children, num, unicycle_test1_1) {
				return function(e) {
					for (let i = 0; i < children.length; i++) {
						children[i].setAttribute('class', 'item live-skin-normal-text dp-i-block live-skin-separate-border border-box t-center pointer opacity6');
					}
						// let tab_content = document.querySelectorAll(".tab-content.ts-dot-2.tab-content-pilot");
						let tab_content = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".tab-content.ts-dot-2.tab-content-pilot") : document.querySelectorAll(".tab-content.ts-dot-2.tab-content-pilot");
					if (children[num].id === 'li-tab-list') {
						unicycle_test1_1.style.display = 'block';
						tab_content[0].querySelectorAll("div")[0].style.display = "none";
						// let switch_btn = document.querySelectorAll(".switch-btn-bg.live-skin-highlight-bg");
						let switch_btn = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".switch-btn-bg.live-skin-highlight-bg") : document.querySelectorAll(".switch-btn-bg.live-skin-highlight-bg");
						switch_btn[0].click();
					} else {
						unicycle_test1_1.style.display = 'none';
						tab_content[0].querySelectorAll("div")[0].style.display = "block";
					}
					children[num].setAttribute('class', 'item live-skin-normal-text dp-i-block live-skin-separate-border border-box t-center pointer active');
				}
			})(ul_tab_children, j, unicycle_test1));
		}
		
		mode_top_select_1.addEventListener("change", (function(mode_top_select_1_1, text) {
			return function(e) {
				let change_num = mode_top_select_1_1.value;
				// let temp = document.getElementById("input_time");
				let temp = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.getElementById("input_time") : document.getElementById("input_time");
				if (change_num === '0') {
					temp.removeAttribute("disabled");
					text.placeholder = "按照指定时间间隔逐行发送弹幕" + '\n' + "1.使用回车换行。" + '\n' + "2.每行字符数建议不超过弹幕字符上限(超过部分会裁掉)。" + '\n' + "3.间隔时间建议不小于网站规定。";
				} else if (change_num === '1') {
					temp.removeAttribute("disabled");
					text.placeholder = "按照指定时间间隔逐行发送弹幕" + '\n' + "1.以符号为分段依据，过长会拆分发送。" + "\n" + "2.间隔时间建议不小于网站规定。";
				} else if (change_num === '2') {
					temp.setAttribute("disabled", "");
					text.placeholder = "待发送弹幕间可自定义发送间隔" + "\n" + "1.请以一行待发送弹幕一行间隔时间的格式来编写。" + "\n" + "2.每行字符数建议不超过弹幕字符上限(超过部分会裁掉)。" + '\n' + "3.间隔时间建议不小于网站规定。" + "\n\n例如：\n" + "谁不在改变呀！\n6000\n我也在改变呀！\n7000\n改变就应该改变！\n8000\n而不是不改变！\n9000";
				} else if (change_num === '3') {
					temp.setAttribute("disabled", "");
					text.placeholder = "随机时间间隔逐行发送弹幕" + '\n' + "1.使用回车换行。" + '\n' + "2.每行字符数建议不超过弹幕字符上限(超过部分会裁掉)。" + '\n' + "3.间隔时间建议不小于网站规定。";
				}
			}
		})(mode_top_select_1, mode_text));
		
		
		
		
		
		mode_button_button.addEventListener("click", (function(mode_top_select_1_1, room_id_1, csrf_1, cookie_1, data_1) {
			return function(e) {
				
				let change_num = mode_top_select_1_1.value;
				// let str = document.getElementById("mode-text").value;
				let str = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.getElementById("mode-text").value : document.getElementById("mode-text").value;
				// let time = document.getElementById("input_time").value;
				let time = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.getElementById("input_time").value : document.getElementById("input_time").value;
				let text = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.querySelectorAll(".chat-input.border-box") : document.querySelectorAll(".chat-input.border-box");
				// let button = document.getElementById("mode_button_button");
				let button = document.getElementsByTagName("iframe").length > 2 ? document.getElementsByTagName("iframe")[1].contentWindow.document.getElementById("mode_button_button") : document.getElementById("mode_button_button");
				
				if (start === 0) {
					if (str.trim() === "") {
						alert("独轮车不写内容好比上厕所不带纸");
					} else if (change_num === '0') {
						if (time.trim() === '') {
							alert("为什么不写时间！");
						} else {
							start = 1;
							button.innerHTML = "我说婷婷";
							let str_split = str.split("\n");
							let str_num = str_split.length;
							
							periodic = setInterval(() => {
								let str_temp = str_split[strI].length > 20 ? str_split[strI].substr(0, 20) : str_split[strI];
								text[text.length - 1].value = str_temp;
								let form_data = formData(str_temp, room_id_1, csrf_1);
								run_unicycle_request_1("https://api.live.bilibili.com/msg/send", cookie_1, form_data);
								strI = ++strI % str_split.length;
								sleep(100);
								text[text.length - 1].value = '';
							}, time);
						}
					} else if (change_num === '1') {
						if (time.trim() === '') {
							alert("为什么不写时间！");
						} else {
							start = 1;
							button.innerHTML = "我说婷婷";
							let str_split = new Array();
							let temp_str = '';
							for (let i = 0, j = 1; i < str.length; i++) {
								if (j < strMax && ([i] !== '\n' || str[i] !== '\t' || str[i] !== ',' || str[i] !== '.' || str[i] !== '?' || str[i] !== '!' || str[i] !== '，' || str[i] !== '。' || str[i] !== '？' || str[i] !== '！')) {
									temp_str += str[i];
									j++;
								} else {
									temp_str += str[i];
									str_split.push(temp_str);
									temp_str = '';
									j = 1;
								}
							}
							
							periodic = setInterval(() => {
								text[text.length - 1].value = str_split[strI];
								let form_data = formData(str_split[strI], room_id_1, csrf_1);
								run_unicycle_request_1("https://api.live.bilibili.com/msg/send", cookie_1, form_data);
								strI = ++strI % str_split.length;
								sleep(100);
								text[text.length - 1].value = '';
							}, time);
						}
					} else if (change_num === '2') {
						alert("编程模式");
					} else if (change_num === '3') {
						alert("随机模式");
					}
					
				} else {
					start = 0;
					button.innerHTML = "独轮车，启动！";
					clearInterval(periodic);
				}
			}
		})(mode_top_select_1, room_id, csrf, cookie, data));
	}
})();

async function run_unicycle_request_1(url, cookie, data) {
	GM_xmlhttpRequest({
			method: 'POST',
			url: url,
			anonymous: true,
			cookie: cookie,
			data: data,
			onload: function(response) {
			},
			onerror: function (){
				    alert(`操作失败`);
			}
	});
}

async function run_unicycle_request_GET(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
				},
				onload: function(response) {
					let array = new Array();
					array[0] = JSON.parse(response.responseText);
					array[1] = response.responseHeaders;
					resolve(array);
				},
				onerror: function (){
						alert(`操作失败!`);
				}
		});
	})
}

function sleep(time){
 return new Promise((resolve) => setTimeout(resolve, time));
}

function formData(msg, room_id, csrf) {
	let form = new FormData();
	form.append("bubble","0");
	form.append("msg",msg);
	form.append("color","16777215");
	form.append("mode","1");
	form.append("fontsize","25");
	form.append("rnd",Date.now());
	form.append("roomid",room_id);
	form.append("csrf",csrf);
	form.append("csrf_token",csrf);
	return form;
}