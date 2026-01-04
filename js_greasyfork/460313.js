// ==UserScript==
// @name         b站视频观看进度
// @namespace    dingshuai
// @version      1.4
// @description  在b站作品简介中输出当前观看百分比等信息（有分p的视频才会生效）
// @author       dingshuai
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @github       https://github.com/prgding/myUserScripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460313/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/460313/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==


setTimeout(function () {
	let durationElements = document.querySelectorAll('div.duration');
	let currentPElement = document.querySelector("li.watched.on span.page-num");
	let text = currentPElement.textContent; // P27
	let current = parseInt(text.slice(1)); // 27
	let sum = 0;
	let left = 0;

	console.log("\n\n------------------输出------------------\n\n\n")

	// 把时间数据转换成秒数再弄进times数组
	let times = []
	for (let i = 0; i < durationElements.length; i++) {
		let time = durationElements[i].textContent;
		let parts = time.split(":");
		let hour = 0;
		let minute = 0;
		let second = 0;
		let seconds = 0;

		if (parts.length === 3) {
			hour = parseInt(parts[0]);
			minute = parseInt(parts[1]);
			second = parseInt(parts[2]);
		}
		if (parts.length === 2) {
			minute = parseInt(parts[0]);
			second = parseInt(parts[1]);
		}
		if (parts.length === 1) {
			second = parseInt(parts[0]);
		}
		seconds = 3600 * hour + 60 * minute + second;

		times.push(seconds)
	}
	console.log(times);

	// 秒数相加 得sum, left
	for (let i = 0; i < times.length; i++) {
		// 输出所有集数
		// console.log("all", i + 1);
		sum += times[i];
		if (i >= current - 1) {
			// 输出当前集数
			// console.log("current P", i + 1);
			left += times[i];
		}
	}

	let alreadySeen = sum - left;

	// sum,left,alreadySeen 转换成时分秒
	function toHms(seconds) {
		let h = Math.floor(seconds / 3600);
		let m = Math.floor(seconds % 3600 / 60);
		let s = Math.floor(seconds % 3600 % 60);
		if (h < 10) {
			h = `0${h}`;
		}
		if (m < 10) {
			m = `0${m}`;
		}
		if (s < 10) {
			s = `0${s}`;
		}
		return `${h}:${m}:${s}`
	}

	let formatSum = toHms(sum);
	let formatLeft = toHms(left);
	let formatAlreadySeen = toHms(alreadySeen);

	let alreadyPercent = (alreadySeen / sum * 100).toFixed(2) + "%";

	let episodePercent = ((current - 1) / times.length * 100).toFixed(2) + "%";

	let msg1 = "总时长: " + formatSum + "\n";
	let msg2 = "已看时长: " + formatAlreadySeen + "&emsp;剩余时长: " + formatLeft + "\n";
	let msg3 = "已看百分比: " + alreadyPercent + "&emsp;已看集数百分比: " + episodePercent + " ";
	let msg4 = "<a id='get_full_data'>获取全集数据</a>\n"

	console.log(msg1 + msg2 + msg3);

	let desc_div = document.querySelector("#v_desc > div.desc-info.desc-v2");

	if (desc_div != null) {
		desc_div.style = "height: auto";
		let desc_span = document.querySelector(".desc-info-text");
		let desc = desc_span.textContent;
		desc_span.innerHTML = msg1 + msg2 + msg3 + msg4 + desc;

		document.getElementById("get_full_data").onclick = function () {
			let accumulation_list = [];
			let epo_list = [];
			accumulation_list.push(0);

			// 时长百分比
			let sum = 0;
			for (let i = 0; i < times.length; i++) {
				sum += times[i];
				accumulation_list[i + 1] = sum;
			}

			// 集数百分比
			for (let i = 0; i < times.length; i++) {
				epo_list[i] = i;
			}

			for (let i = 0; i < times.length; i++) {
				let percent1 = ((accumulation_list[i]) / sum * 100).toFixed(2) + "%";
				let percent2 = (epo_list[i] / times.length * 100).toFixed(2) + "%";
				let p_num;
				if (i < 9) {
					p_num = `0${i + 1}`
				} else p_num = i + 1;
				console.log(`P${p_num}   ${percent1}   ${percent2}`);
			}
		}
	}


}, 3000);