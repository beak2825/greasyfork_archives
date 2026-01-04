// ==UserScript==
// @name         小米路由器增强脚本
// @namespace    kirin
// @version      0.1.0
// @license MIT
// @description  实时显示设备流量和总速度！
// @author       kirin
// @include      /https?:\/\/.*?\/cgi-bin\/luci\/;stok.*/
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525238/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/525238/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
function boot() {
	let pathName = location.pathname;

	if (/\/web\/home/.test(pathName)) {
		initHomePage();
	}
}

let token,
	jQuery,
	uw = unsafeWindow;

function getToken() {
	if (!token) token = /;stok=([\da-f]+)/.exec(location.href) && RegExp.$1;

	return token;
}

function initHomePage() {
	var s = document.createElement("style");
	s.id = "blog.iccfish.com";
	s.textContent =
		".device-speed { float: right; }\
	.up-speed, .down-speed { display: inline-block;  padding-left: 16px; border: 1px solid #ff4c00; color: #ff4c00; position: relative; --percentage: 0; width: 110px; text-align: center; font-size: 90%; }\
	.up-speed:after, .down-speed:after { 	content: '🔼'; position: absolute; left: 0; top: 0; line-height: 150%; }\
	.up-speed:before, .down-speed:before { content: ' '; position: absolute; left: 0; top: 0; bottom: 0; background: rgba(255,0,0,0.25); width: var(--percentage); }\
	.down-speed { color:#0059fa; border-color:#0059fa; }\
	.down-speed:after { content: '🔽'; }\
	.down-speed:before { background-color: rgb(0 68 255 / 25%); }\
	";
	document.head.appendChild(s);
	// 替换模板
	let devicesItemTmpl = document.querySelector("#tmpldevicesitem");
	devicesItemTmpl.innerHTML =
		'\
	<tr class="device-item" data-mac="{$mac}">\
	<td>\
	<img class="dev-icon" width="60" src="{$devices_icon}" onerror="this.src=\'/img/device_list_error.png\'">\
	<div class="dev-info">\
	<div class="name">{$name} &nbsp;&nbsp;{if($isself)}<span class="muted">|&nbsp;本机</span>{/if}</div>\
	<ul class="devnetinfo clearfix">\
	<li><span class="k">已连接:</span> <span class="v online-time">{$online}</span></li>\
	<li>{for(var i=0, len=$ip.length; i<len; i++)}<p data-ip="{$ip[i]}"><span class="k">IP地址:</span> <span class="v">{$ip[i]}</span></p>{/for}</li>\
	<li><span class="k">MAC地址:</span> <span class="v">{$mac}</span></li>\
	</ul>\
	</div>\
	</td>\
	{if($d_is_ap != 8)}<td class="option">{$option}</td>{/if}\
	{if($d_is_ap == 8)}<td class="option_d01"></td>{/if}\
	{if($hasDisk)}<td class="option2">{$option2}</td>{/if}\
	</tr>';

	// 处理数据
	let lock;

	function showSpeed(list) {
		let needFullReload = false;

		let totalUpload = 0,
			totalDownload = 0;
		list.filter(item => item.statistics).forEach(item => {
			totalDownload += +item.statistics.downspeed;
			totalUpload += +item.statistics.upspeed;
		});

		list.forEach(item => {
			if (item.statistics) {
				let mac = item.mac;
				let tr = uw.$(`tr.device-item[data-mac='${mac}']`);
				if (!tr) {
					needFullReload = true;
					return;
				}

				let title = tr.find("div.name");
				let upspeed = uw.byteFormat(+item.statistics.upspeed, 100) + "/S";
				let downspeed = uw.byteFormat(+item.statistics.downspeed, 100) + "/S";
				let online = jQuery.secondToDate(+item.statistics.online);
				let ups = title.find(".up-speed");

				const pu = totalUpload ? Math.round((+item.statistics.upspeed * 10000) / totalUpload) / 100 : 0;
				const pd = totalDownload ? Math.round((+item.statistics.downspeed * 10000) / totalDownload) / 100 : 0;

				if (ups.length) {
					ups.html(`${upspeed} | ${pu}%`)[0].style.setProperty("--percentage", pu + "%");
					title
						.find(".down-speed")
						.html(`${downspeed} | ${pd}%`)[0]
						.style.setProperty("--percentage", pd + "%");
				} else {
					let speedTmpl = `<sub class='device-speed'><span class='up-speed' style="--percentage: ${pu}%;">${upspeed} | ${pu}%</span> <span class='down-speed' style="--percentage: ${pd}%;">${downspeed} | ${pd}%</span></sub>`;
					title.append(speedTmpl);
				}
				tr.find(".online-time").html(online);
			}
		});

		let total = jQuery("div.total-speed");
		if (!total.length) {
			jQuery("#bd").prepend("<div class=\"total-speed\" style='padding: 10px 0;margin-bottom: -40px;font-size: 130%;color: #0a6f15;'>总速度：🔼<span style='color:#ff4c00;' class='up'>--</span> 🔽<span style='color:#0059fa;' class='down'>--</span></div>");
			total = jQuery("div.total-speed");
		}
		//debugger;
		total.find(".up").html(uw.byteFormat(totalUpload, 100) + "/S");
		total.find(".down").html(uw.byteFormat(totalDownload, 100) + "/S");

		if (location.hash !== "#devices") return;
		if (needFullReload) {
			console.log("发现新设备，需要完全重新加载.");
			jQuery.pub("devices:getlist");
		} else {
			setTimeout(refreshSpeed, 1000);
		}
	}

	function refreshSpeed() {
		if (lock) return;
		lock = true;

		let api = `/cgi-bin/luci/;stok=${getToken()}/api/misystem/devicelist`;
		jQuery
			.getJSON(api, {})
			.done(function (data) {
				if (data.code !== 0) return;

				showSpeed(data.list);
			})
			.fail(function () {
				setTimeout(refreshSpeed, 1000);
			})
			.always(function () {
				lock = false;
			});
	}

	jQuery(document).ajaxComplete(function (e, xhr, setting) {
		if (/misystem\/devicelist/.test(setting.url)) {
			let data;
			try {
				data = JSON.parse(xhr.responseText);
			} catch (e) {
				console.log(`invalid reponse: ${e}.`);
				return;
			}

			showSpeed(data.list);
		}
	});
}

(function () {
	let val, inited;

	Object.defineProperty(unsafeWindow, "jQuery", {
		get: function () {
			return val;
		},
		set: function (v) {
			val = v;
			jQuery = v;
			if (!inited) {
				inited = true;
				boot();
			}
		},
	});
})();
