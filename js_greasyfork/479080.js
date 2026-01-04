// ==UserScript==
// @name            BiliBili 高级倍速功能
// @namespace       cec8225d12878f0fc33997eb79a69894
// @version         1.9
// @description     BiliBili倍速插件，支持自定义速度、记忆上一次速度、快捷键调速。
// @author          TheBszk
// @match           https://www.bilibili.com/video/*
// @match           https://www.bilibili.com/list/*
// @match           https://www.bilibili.com/bangumi/play/*
// @match           https://www.bilibili.com/cheese/play/*
// @match           https://www.bilibili.com/festival/*
// @icon            https://www.bilibili.com/favicon.ico
// @license         AGPL
// @downloadURL https://update.greasyfork.org/scripts/479080/BiliBili%20%E9%AB%98%E7%BA%A7%E5%80%8D%E9%80%9F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479080/BiliBili%20%E9%AB%98%E7%BA%A7%E5%80%8D%E9%80%9F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const CUSTOM_RATE_ARRAY = "custom_rate_array";
	const CUSTOM_RATE = "custom_rate";
	const CUSTOM_ShowTimeState = "custom_showtimestate";
	const CUSTOM_ArrowRightSpeed = "custom_arrowrightspeed";
	const CUSTOM_SwitchCustomSpeed = "custom_switchcustomspeed";
	const CUSTOM_DefaultWideScreen = "custom_defaultwidescreen";
	const CUSTOM_Volume = "custom_volume";
	const CUSTOM_GlobalVolumeAdjustment = "custom_globalvolumeadjustment";

	if (!localStorage.getItem(CUSTOM_ArrowRightSpeed)) {
		localStorage.setItem(CUSTOM_ArrowRightSpeed, "2x"); //设置默认值
	}

	function getPageType() {
		const path = window.location.pathname;

		if (path.startsWith("/video/")) {
			return "video";
		} else if (path.startsWith("/list/")) {
			return "list";
		} else if (path.startsWith("/bangumi/play/")) {
			return "bangumi";
		} else if (path.startsWith("/cheese/play/")) {
			return "cheese";
		} else if (path.startsWith("/festival/")) {
			return "festival";
		} else {
			return "unknown";
		}
	}

	const pageType = getPageType();

	if (pageType == "video" || pageType == "list" || pageType == "bangumi" || pageType == "cheese" || pageType == "festival") {
		var MENUCLASS = "bpx-player-ctrl-playbackrate-menu";
		var MENUCLASS_ITEM = "bpx-player-ctrl-playbackrate-menu-item";
		var MENUCLASS_ACTIVE = "bpx-state-active";
	} else {
		return;
	}

	function getRate() {
		let rate = localStorage.getItem(CUSTOM_RATE);
		if (rate <= 0) {
			rate = 1;
		}
		return rate;
	}

	function getRateArray() {
		let storageData = localStorage.getItem(CUSTOM_RATE_ARRAY);
		let rates;
		if (storageData == null) {
			rates = [];
		} else {
			rates = storageData.split(",");
		}
		if (rates.length === 0) {
			//如果没有，则初始化一个默认的
			rates = [0.5, 1.0, 1.5, 2, 2.5, 3.0, 4.0];
			localStorage.setItem(CUSTOM_RATE_ARRAY, rates.join(","));
		}
		return rates;
	}

	// 创建显示元素
	function createTip() {
		var elem = document.createElement("div");
		elem.style.display = "none";
		elem.style.position = "absolute";
		elem.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
		elem.style.color = "white";
		elem.style.padding = "5px";
		elem.style.borderRadius = "5px";
		elem.style.zIndex = "1000";
		elem.style.fontSize = "22px";
		return elem;
	}

	var timeDisplay = createTip();
	timeDisplay.style.top = "20px";
	timeDisplay.style.right = "20px";

	let _showtime;

	function setShowTimeState(state) {
		localStorage.setItem(CUSTOM_ShowTimeState, state);
		if (state == true) {
			timeDisplay.style.display = "block";

			if (!_showtime) {
				_showtime = setInterval(FlashShowTime, 1000);
			}
		} else {
			timeDisplay.style.display = "none";

			if (_showtime) {
				clearInterval(_showtime);
				_showtime = 0;
			}
		}
	}

	var tipDisplay = createTip();
	tipDisplay.style.right = "20px";

	let hideTimer;
	let bpx_player_control_entity = document.querySelector(".bpx-player-control-entity");
	let bpx_player_control_wrap = document.querySelector(".bpx-player-control-wrap");
	function showTip(title, time) {
		let h;
		if (bpx_player_control_entity.getAttribute("data-shadow-show") == "true") {
			h = 0;
		} else {
			h = bpx_player_control_wrap.clientHeight;
		}

		tipDisplay.style.bottom = h + 20 + "px";
		tipDisplay.textContent = title;
		tipDisplay.style.display = "block";

		if (!hideTimer) {
			clearTimeout(hideTimer);
		}

		hideTimer = setTimeout(function () {
			tipDisplay.style.display = "none";
		}, time);
	}

	function showPlayRate(rate) {
		showTip(`速度: ${rate}x`, 1200);
	}

	function showVolume(volume) {
		showTip(`音量: ${volume}%`, 1200);
	}

	class SettingPopup {
		popup_dragend_move(e) {
			this.popup.style.left = e.clientX - this.offsetX + this.startX + "px";
			this.popup.style.top = e.clientY - this.offsetY + this.startY + "px";
		}
		constructor() {
			this.speedlist = getRateArray().join(",");
			this.ArrowRightTime = localStorage.getItem(CUSTOM_ArrowRightSpeed);
			this.SwitchCustomSpeed = localStorage.getItem(CUSTOM_SwitchCustomSpeed) == "true" ? true : false;
			// this.GlobalVolumeAdjustment = localStorage.getItem(CUSTOM_GlobalVolumeAdjustment) == "true" ? true : false;
			this.GlobalVolumeAdjustment = false;//不再开启
			this.DefaultWideScreen = localStorage.getItem(CUSTOM_DefaultWideScreen) == "true" ? true : false;
			let v = localStorage.getItem(CUSTOM_Volume);
			if (v == null || v == "") {
				this.volume = -1;
			} else {
				this.volume = parseInt(v);
			}
		}
		create(handle) {
			this.popup = document.createElement("div");
			this.popup.innerHTML = `
				<div class="popup-title" id="popupTitle">
					<span>BiliBili 高级倍速功能</span>
					<button class="close-button">×</button>
				</div>
				<div class="popup-content">
					<label for="SpeedList">自定义倍速列表:</label>
					<input type="text" id="SpeedList" placeholder="以英文逗号隔开" />

					<label for="ArrowRightSpeed">长按右光标键速度:</label>
					<input type="text" id="ArrowRightSpeed" placeholder="例: 2 为固定二倍速, 2x 为当前速度两倍" />

					<label title="默认为对应速度(如 按2为2倍速、按3为3倍速)"><input type="checkbox" id="SwitchCustomSpeed" /> 0~9/Ctrl+0~9 快捷键切换自定义列表速度</label>
					<br />
					<label title="默认宽屏"><input type="checkbox" id="DefaultWideScreen" /> 默认宽屏</label>
					<br />
					<label title="[!]此功能放弃维护，因此不再可以使用\n\n↑ / ↓ 全局调整音量 ; 优化滚轮调整音量体验\n支持 0 ~ 500%(过高会有轻微失真)\n仅支持快捷键与鼠标滚轮调整\n\n[!] 本项修改需要刷新网页后生效"><input type="checkbox" id="GlobalVolumeAdjustment" disabled/> 接管音量控制</label>
					<br />
					<label title="暂不支持取消"><input type="checkbox" disabled checked /> 增加快捷键: 字幕切换(Z)</label>
					<br />
					<label title="暂不支持取消"><input type="checkbox" disabled checked /> 增加快捷键: 网页全屏(G)</label>
					<br />
					<label title="暂不支持取消"><input type="checkbox" disabled checked /> 增加快捷键: 宽屏模式(H)</label>
					<br />
					<label title="暂不支持取消"><input type="checkbox" disabled checked /> 双击字幕复制内容</label>
				</div>
				<div id="popup-tips">关闭设置窗口自动保存 | 鼠标停留查看更多信息</div>
			`;
			this.popup.classList.add("popup-container");
			this.popupcss = document.createElement("style");
			this.popupcss.innerHTML = `
			.popup-container {
				width: 330px;
				position: absolute;
				z-index: 999999;
				background-color: #fff;
				border: 1px solid #ccc;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(33,150,243,0.5);
			}

			.popup-container .popup-title {
				position: relative;
				background-color: #3498db;
				color: #fff;
				padding: 10px;
				cursor: move;
				border-top-left-radius: 8px;
				border-top-right-radius: 8px;
				user-select: none;
			}
			.popup-container .popup-content {
				padding: 20px;
			}
			.popup-container .close-button {
				position: absolute;
				top: 0px;
				right: 0px;
				height: 100%;
				background-color: #3498db;
				color: #fff;
				border: none;
				padding: 0px 13px;
				font-size: 24px;
				cursor: pointer;
				border-top-right-radius: 8px;
				transition: background-color 0.3s ease, transform 0.3s ease;
			}
			.popup-container .close-button:hover {
				background-color: #e74c3c;
			}
			.popup-container label {
				font-size: 14px;
			}
			.popup-container #popup-tips {
				color: #555555;
				font-size: 14px;
				padding: 4px 0px 4px 10px;
				border-top: 1px solid #ccc;
			}
			.popup-container .button {
				display: block;
				padding: 10px;
				background-color: #3498db;
				color: #fff;
				text-align: center;
				text-decoration: none;
				border-radius: 5px;
				cursor: pointer;
				transition: background-color 0.3s ease;
				border: none;
			}
			.popup-container .button:hover {
				background-color: #2980b9;
			}
			.popup-container select,
			input[type="text"] {
				display: block;
				margin-bottom: 10px;
				padding: 8px;
				border: 1px solid #ccc;
				border-radius: 4px;
				width: 100%;
				box-sizing: border-box;
				outline: none;
			}
			.popup-container input[type="text"]:focus {
				border: 1px solid #2980b9;
			}
			.popup-container input[type="radio"] {
				margin-right: 5px;
			}`;
			document.body.appendChild(this.popup);
			document.head.appendChild(this.popupcss);

			this.popup_dragend_move = this.popup_dragend_move.bind(this);
			this.popup.querySelector("#popupTitle").addEventListener("mousedown", (e) => {
				this.offsetX = e.clientX;
				this.offsetY = e.clientY;
				this.startX = parseInt(this.popup.style.left);
				this.startY = parseInt(this.popup.style.top);
				document.addEventListener("mousemove", this.popup_dragend_move);
				document.addEventListener("mouseup", (e) => {
					document.removeEventListener("mousemove", this.popup_dragend_move);
				});
			});
			this.popup.querySelector(".close-button").addEventListener("click", (e) => {
				this.close();
			});
			this.handle = handle;
		}
		show() {
			this.popup.querySelector("#SpeedList").value = this.speedlist;
			this.popup.querySelector("#ArrowRightSpeed").value = this.ArrowRightTime;
			this.popup.querySelector("#SwitchCustomSpeed").checked = this.SwitchCustomSpeed;
			this.popup.querySelector("#GlobalVolumeAdjustment").checked = this.GlobalVolumeAdjustment;
			this.popup.querySelector("#DefaultWideScreen").checked = this.DefaultWideScreen;
			this.popup.style.display = "block";
			let left = (window.innerWidth - this.popup.offsetWidth) / 2;
			let top = (window.innerHeight - this.popup.offsetHeight) / 2;

			this.popup.style.left = left + "px";
			this.popup.style.top = top + "px";
		}
		close() {
			let sl, ars;
			// 读取元素的值
			sl = this.popup.querySelector("#SpeedList").value;
			ars = this.popup.querySelector("#ArrowRightSpeed").value;
			this.SwitchCustomSpeed = this.popup.querySelector("#SwitchCustomSpeed").checked;
			this.GlobalVolumeAdjustment = this.popup.querySelector("#GlobalVolumeAdjustment").checked;
			this.DefaultWideScreen = this.popup.querySelector("#DefaultWideScreen").checked;

			let sl_ = null,
				ars_ = null;
			//进行处理
			//自定义速度列表
			if (!(sl === null || sl.trim() === "")) {
				let rates = sl
					.split(",")
					.map((s) => s.trim())
					.filter((s) => s);

				if (rates.length > 0) {
					// 检查输入是否全部为有效数字
					if (rates.every((s) => isFinite(s))) {
						localStorage.setItem(CUSTOM_RATE_ARRAY, rates.join(","));
						this.speedlist = sl;
						sl_ = rates;
					}
				}
			}

			//右光标键速度
			if (parseInt(ars) > 0) {
				localStorage.setItem(CUSTOM_ArrowRightSpeed, ars);
				this.ArrowRightTime = ars;
				ars_ = ars;
			}

			localStorage.setItem(CUSTOM_SwitchCustomSpeed, this.SwitchCustomSpeed);
			localStorage.setItem(CUSTOM_GlobalVolumeAdjustment, this.GlobalVolumeAdjustment);
			localStorage.setItem(CUSTOM_DefaultWideScreen, this.DefaultWideScreen);
			this.handle(sl_, ars_);

			this.popup.remove();
		}
	}
	let setting = new SettingPopup();

	class PlayRateMenu {
		init(menu) {
			this.videoObj = document.querySelector("video");
			if (this.videoObj) {
				if (setting.GlobalVolumeAdjustment) {
					let context = new (window.AudioContext || window.webkitAudioContext)();
					this.gain = context.createGain();
					context.createMediaElementSource(this.videoObj).connect(this.gain);
					this.gain.connect(context.destination);
					this.volumeNumElem = document.querySelector(".bpx-player-ctrl-volume-number");
					if (setting.volume != -1) {
						this.setVolume(setting.volume / 100, false);
					}
					this.videoObj.addEventListener("volumechange", () => {
						if (this.gain) {
							this.gain.gain.value = 1;
						}
					});
				}
			} else {
				this.videoObj = document.querySelector("bwp-video"); //b站自研wasm软解视频播放器
			}

			if (!this.videoObj) {
				return false;
			}

			this.saveSetting = this.saveSetting.bind(this);
			this.menu = menu;
			this.rates = getRateArray();
			this.videoObj.addEventListener("loadedmetadata", () => {
				this.setRate(getRate());
			});
			if (setting.DefaultWideScreen) {
				document.querySelector("#bilibili-player .bpx-player-ctrl-wide span").click();
			}

			return true;
		}

		insertRate(rateValue) {
			this.rates.push(rateValue);
			this.render();
		}

		insertItem(content, rate, event) {
			const item = document.createElement("li");
			item.textContent = content;
			item.classList.add(MENUCLASS_ITEM);
			item.setAttribute("data-value", rate);
			item.addEventListener("click", event);
			this.menu.appendChild(item);
		}

		saveSetting(sl, ars) {
			if (sl != null) {
				this.rates = sl;
				this.render();
				let nowRate = getRate();
				if (this.rates.indexOf(nowRate) === -1) {
					this.setRate(1);
				} else {
					this.setRate(nowRate);
				}
			}
		}

		render() {
			this.menu.innerHTML = "";
			this.rates.sort((a, b) => b - a); //排序

			this.rates.forEach((rate) => {
				this.insertItem(rate % 1 == 0 ? rate + ".0x" : rate + "x", rate, (e) => {
					e.stopPropagation();
					const rateValue = e.target.getAttribute("data-value");
					this.setVideoRate(rateValue);
					this.setActiveRate(rateValue);
					localStorage.setItem(CUSTOM_RATE, rateValue);
				});
			});

			//插入一个设置按钮
			this.insertItem("设置", 0, (e) => {
				e.stopPropagation();
				setting.create(this.saveSetting);
				setting.show();
			});
		}

		setActiveRate(rateValue) {
			const items = this.menu.querySelectorAll(`.${MENUCLASS_ITEM}`);
			items.forEach((item) => {
				const value = item.getAttribute("data-value");
				if (value === rateValue) {
					item.classList.add(MENUCLASS_ACTIVE);
				} else {
					item.classList.remove(MENUCLASS_ACTIVE);
				}
			});
		}

		getDuration() {
			return this.videoObj.duration;
		}

		getCurrentTime() {
			return this.videoObj.currentTime;
		}

		setVideoRate(rate) {
			this.videoObj.playbackRate = parseFloat(rate);
		}
		getVideoRate() {
			return this.videoObj.playbackRate;
		}

		//使用此函数前提：速度列表必须存在该速度值
		setRate(rate) {
			const item = document.querySelector(`.${MENUCLASS_ITEM}[data-value="${rate}"]`);
			if (item) {
				item.classList.add(MENUCLASS_ACTIVE);
				item.click();
			} else {
				console.error("未找到匹配元素");
			}
		}

		changeRate(up) {
			let nowRate = getRate();
			let index = this.rates.indexOf(nowRate);
			if ((index == 0 && up) || (index == this.rates.length && !up)) {
				return nowRate;
			} else {
				index += up ? -1 : 1;
				this.setRate(this.rates[index]);
				return this.rates[index];
			}
		}
		getVolume() {
			if (this.videoObj.volume == 1.0) {
				return this.gain.gain.value;
			} else {
				return this.videoObj.volume;
			}
		}

		setVolume(volume, show) {
			if (!this.gain && volume > 1.0) {
				volume = 1.0;
			}

			if (volume <= 1.0) {
				this.videoObj.volume = volume;
				if (this.gain) {
					this.gain.gain.value = 1;
				}
			} else {
				this.videoObj.volume = 1;
				this.gain.gain.value = volume;
			}

			let sv = (volume * 100).toFixed(0);
			localStorage.setItem(CUSTOM_Volume, sv);
			this.volumeNumElem.textContent = sv;
			if (show == true) {
				showVolume(sv);
			}
		}
	}

	let menu = new PlayRateMenu();

	let _interval = setInterval(function () {
		let element = document.querySelector(`.${MENUCLASS}`);
		if (element) {
			if (menu.init(element)) {
				menu.render();
				menu.setRate(getRate());
				let bpx_player_video_warp = document.querySelector(".bpx-player-video-wrap");
				bpx_player_video_warp.appendChild(tipDisplay);
				bpx_player_video_warp.appendChild(timeDisplay);
				if (setting.GlobalVolumeAdjustment) {
					bpx_player_video_warp.addEventListener("mousewheel", (e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						let volume = menu.getVolume() + parseInt(e.wheelDelta / 120) * 0.05;
						if (volume > 5.0) {
							volume = 5.0;
						} else if (volume < 0) {
							volume = 0;
						}
						menu.setVolume(volume, true);
					});
				}

				setShowTimeState(localStorage.getItem(CUSTOM_ShowTimeState) == "true");
				clearInterval(_interval);
			} else {
				console.warn("获取视频元素失败!");
			}

			//双击复制字幕内容
			let subtitle_panel = document.querySelector(".bpx-player-subtitle-panel-major-group");
			if (subtitle_panel) {
				subtitle_panel.addEventListener("dblclick", function () {
					let text = document.querySelector(".bpx-player-subtitle-panel-major-group span").textContent;

					//如果是歌词会存在音乐符号，要清除
					let musicSymbol = "♪";
					if (text.startsWith(musicSymbol)) {
						text = text.slice(musicSymbol.length);
						if (text.endsWith(musicSymbol)) {
							text = text.slice(0, -musicSymbol.length);
						}
					}
					navigator.clipboard.writeText(text);
				});
			}
		}
	}, 500);

	let ArrowRightTime = 0;
	let OldRate = 0;

	document.addEventListener(
		"keydown",
		function (e) {
			e = e || window.event;
			if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName == "BILI-COMMENTS" || e.target.isContentEditable) {
				return;
			}
			if (e.ctrlKey == true && e.code == "ArrowUp") {
				let rate = menu.changeRate(true);
				showPlayRate(rate);
			} else if (e.ctrlKey == true && e.code == "ArrowDown") {
				let rate = menu.changeRate(false);
				showPlayRate(rate);
			} else if (e.code == "ArrowRight" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				if (ArrowRightTime == 0) {
					ArrowRightTime = e.timeStamp;
				} else {
					if (e.timeStamp - ArrowRightTime > 500) {
						if (OldRate == 0) {
							OldRate = getRate();
							if (typeof setting.ArrowRightTime === "string" && setting.ArrowRightTime.indexOf("x") != -1) {
								menu.setVideoRate(OldRate * parseInt(setting.ArrowRightTime));
								showPlayRate(OldRate * parseInt(setting.ArrowRightTime));
							} else {
								menu.setVideoRate(parseInt(setting.ArrowRightTime));
								showPlayRate(parseInt(setting.ArrowRightTime));
							}
						}
					}
				}
			} else if ("0" <= e.key && e.key <= "9") {
				e.preventDefault();
				e.stopImmediatePropagation();
				let num = parseInt(e.key - "0");
				let speed;
				if (setting.SwitchCustomSpeed) {
					if (!(1 <= num && num <= menu.rates.length)) {
						return;
					}
					speed = menu.rates[menu.rates.length - num];
				} else {
					if (num == 0) {
						speed = 0.5;
					} else {
						speed = num;
					}
				}

				if (e.ctrlKey) {
					menu.setVideoRate(speed);
					menu.setActiveRate(speed);
					showPlayRate(speed);
					localStorage.setItem(CUSTOM_RATE, speed);
				} else {
					if (OldRate == 0) {
						OldRate = getRate();
						menu.setVideoRate(speed);
						showPlayRate(speed);
					}
				}
			} else if (e.code == "KeyZ" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				if (document.querySelector("#bilibili-player .bpx-player-ctrl-subtitle")) {
					let close_btn = document.querySelector(".bpx-player-ctrl-subtitle-close-switch");
					if (close_btn) {
						if (!close_btn.classList.contains("bpx-state-active")) {
							close_btn.click();
						} else {
							let openSubtitle_btns = document.querySelectorAll(".bpx-player-ctrl-subtitle-language-item");
							if (openSubtitle_btns.length == 1) {
								openSubtitle_btns[0].click();
							} else {
								let langList = ["zh-Hans", "ai-zh", "ai-en"];
								langList.some(lang => {
									for (const btn of openSubtitle_btns) {
										if (btn.dataset.lan === lang) {
											btn.click();
											return true;
										}
									}
									return false;
								});

							}
						}
					}
				}
			} else if (e.code == "KeyG" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				document.querySelector("#bilibili-player .bpx-player-ctrl-web span").click();
				e.stopImmediatePropagation();
			} else if (e.code == "KeyH" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				document.querySelector("#bilibili-player .bpx-player-ctrl-wide span").click();
			} else if ((e.code == "ArrowUp" || e.code == "ArrowDown") && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				if (setting.GlobalVolumeAdjustment) {
					e.preventDefault();
					e.stopImmediatePropagation();
					let volume = menu.getVolume();
					if (e.code == "ArrowUp") {
						volume = volume + 0.1;
						if (volume > 5.0) {
							volume = 5.0;
						}
					} else {
						volume = volume - 0.1;
						if (volume < 0) {
							volume = 0;
						}
					}
					menu.setVolume(volume, true);
				}
			}
		},
		true
	);

	document.addEventListener("keyup", function (e) {
		if (e.code == "ArrowRight" || ("0" <= e.key && e.key <= "9")) {
			ArrowRightTime = 0;
			if (OldRate != 0) {
				menu.setVideoRate(OldRate);
				showPlayRate(OldRate);
				OldRate = 0;
				e.preventDefault();
			}
		} else if (e.code == "F2") {
			setShowTimeState(localStorage.getItem(CUSTOM_ShowTimeState) == "false");
		}
	});

	window.addEventListener("focus", function () {
		menu.setRate(getRate());
		setShowTimeState(localStorage.getItem(CUSTOM_ShowTimeState) == "true");
		if (setting.GlobalVolumeAdjustment) {
			let volume = localStorage.getItem(CUSTOM_Volume);
			if (volume != -1) {
				menu.setVolume(volume / 100, false);
			}
		}
	});

	function formatTime(s) {
		var m = parseInt(s / 60);
		var ss = parseInt(s % 60);
		return (m > 9 ? `${m}` : `0${m}`) + ":" + (ss > 9 ? `${ss}` : `0${ss}`);
	}

	function FlashShowTime() {
		var rate = menu.getVideoRate();
		timeDisplay.textContent = formatTime(menu.getCurrentTime() / rate) + "/" + formatTime(menu.getDuration() / rate);
	}
})();
