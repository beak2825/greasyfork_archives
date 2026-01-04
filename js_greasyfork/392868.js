// ==UserScript==
// @name:zh-CN        	51job search filter with distance
// @name        	51job search filter with distance
// @namespace   https://github.com/zhuzemin
// @description:zh-CN  51job搜索结果以距离过滤
// @description  51job搜索结果以距离过滤
// @author      zhuzemin
// @include     https://search.51job.com/list/*
// @version     1.3
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @connect-src api.map.baidu.com
// @connect-src jobs.51job.com
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/392868/51job%20search%20filter%20with%20distance.user.js
// @updateURL https://update.greasyfork.org/scripts/392868/51job%20search%20filter%20with%20distance.meta.js
// ==/UserScript==

let config = {
	'debug': false,
	'origin': GM_getValue('origin').replace(/\s/, '') || null,
	'origin_list': [],
	'max_distence': GM_getValue('max_distence') || 12000,
	'max_joblist': GM_getValue('max_joblist') || 10,
	'joblist': [],
	'button': null,
	'running': false,
	'api': {
		'baidu': {
			'url': `https://api.map.baidu.com/direction/v2/riding?origin={{origin}}&destination={{lat}},{{lng}}&ak={{ak}}`,
			'ak': [
				"RGBBNuGoAcxvzl02ibOAxGZM",
				'xop0xOYgFxbts1hZhT8YAS2o4BoKfDZp'
			],
			'getpoint': 'https://api.map.baidu.com/lbsapi/getpoint/index.html'
		},
		'51job': {
			'url': 'https://search.51job.com/jobsearch/bmap/map.php?jobid={{jobid}}'
		}
	},
}
let debug = config.debug ? console.log.bind(console) : function () {
};
debug(config.max_distence);
debug(config.max_joblist);

// prepare UserPrefs
setUserPref(
	'origin',
	config.origin,
	'设置家的坐标',
	`
(经度, 纬度), Example: "117.215491, 39.122174";
多个坐标, 以";"分隔;
*坐标来自百度地图: `+ config.api.baidu.getpoint
	,
);

setUserPref(
	'max_distence',
	config.max_distence,
	'设置距离上限',
	'骑行距离, 单位(米)'
);

setUserPref(
	'max_joblist',
	config.max_joblist,
	'搜索结果上限',
	'搜索结果上限'
);

class requestObject {
	constructor(url) {
		this.method = 'GET';
		this.respType = 'text';
		this.url = url;
		this.body = null;
		this.headers = {
			'User-agent': window.navigator.userAgent,
			'Referer': window.location.href,
		};
		this.mimeType = 'text/html;charset=utf8';
	}
}

async function init() {
	debug(config.origin);
	if (config.origin != null) {
		for (let origin of config.origin.split(';')) {
			let lat, lng;
			for (let item of origin.split(',')) {
				if (item.length == 9) {
					lat = item;
				}
				else {
					lng = item;
				}

			}
			config.origin_list.push({
				'lat': lat,
				'lng': lng
			});
		}
		debug(JSON.stringify(config.origin_list));
		config.button = document.createElement('button');;
		config.button.textContent = '按距离筛选';
		config.button.className = 'p_but';
		config.button.style.width = '100px';
		config.button.addEventListener('click', () => {

			config.joblist = [];
			config.running = true;
			filter();
		});
		document.querySelector('div.j_tlc').appendChild(config.button);
	}

}
window.addEventListener('DOMContentLoaded', init);

async function filter() {
	debug('filter');
	if (config.running) {
		config.button.textContent = "搜索中...";
		setTimeout(async () => {

			let j_joblist = document.querySelector("div.j_joblist");
			for (let item of j_joblist.childNodes) {
				let jobid = item.querySelector('input[name="delivery_jobid"').getAttribute('value');
				let url = config.api['51job'].url.replace('{{jobid}}', jobid);
				debug(url);
				let obj = new requestObject(url);
				obj.mimeType = 'text/html;charset=gb2312';
				await httpRequest(obj).then(async (resp) => {
					let dom = new DOMParser().parseFromString(resp.response, 'text/html');
					let script = dom.querySelector('script');
					debug(script.textContent);
					eval(script.textContent);
					let suc = false;
					for (let origin of config.origin_list) {
						if (g_company.lat > 0 && Math.abs(origin.lat - g_company.lat) <= 1 && Math.abs(origin.lng - g_company.lng) <= 1) {

							let rnd = Math.floor(Math.random() * config.api.baidu.ak.length);
							url = config.api.baidu.url.replace('{{ak}}', config.api.baidu.ak[rnd]);
							url = url.replace('{{origin}}', origin.lat + ',' + origin.lng);
							url = url.replace('{{lat}}', g_company.lat);
							url = url.replace('{{lng}}', g_company.lng);
							debug(url);
							obj = new requestObject(url);
							obj.respType = 'json';
							await httpRequest(obj).then((resp) => {
								if (resp.status == 200) {

									//0=ok
									if (resp.response.status == 0) {
										let distance = resp.response.result.routes[0].distance;
										debug(distance);
										if (distance > config.max_distence) {
											debug('jobid: ' + jobid + '; too far');
										}
										else {
											debug('jobid: ' + jobid + '; distance: ' + distance);
											config.joblist.push(item);
											suc = true;
										}

									}
									else {

										debug('jobid: ' + jobid + '; status error: ' + JSON.stringify(resp.response) + '; finalUrl: ' + resp.finalUrl);
									}
								}
							});
							if (suc) {
								debug('distance confort');
								break;
							}
						}
						else {
							debug(g_company.name);
						}

					}
					if (!suc) {
						item.style.display = "none";
					}
				});

			}
			let page_num = document.querySelector('div.rt.rt_page');
			let arr = page_num.textContent.match(/(\d+)\s\/\s(\d+)/);
			let current = parseInt(arr[1]);
			let total = parseInt(arr[2]);
			debug(current + '/' + total);
			debug('config.joblist: ' + config.joblist.length);
			debug('config.max_joblist: ' + config.max_joblist);
			if (config.joblist.length < config.max_joblist && current < total) {
				debug('config.joblist: ' + config.joblist.length);
				config.running = true;
				page_num.querySelector('a.e_icons.i_next').click();
				await filter();
			}
			else {
				for (let item of config.joblist) {
					let jobid = item.querySelector('input[name="delivery_jobid"').getAttribute('value');
					for (let node of j_joblist.childNodes) {
						let node_jobid = node.querySelector('input[name="delivery_jobid"').getAttribute('value');
						if (jobid == node_jobid) {

							break;
						}
						else if (node == j_joblist.lastChild) {

							j_joblist.appendChild(item);
						}
					}
				}
				debug('suc');
				config.button.textContent = "按距离筛选";
				config.running = false;
			}
		}, 1000);

	}
}

/**
 * Create a user setting prompt
 * @param {string} varName
 * @param {any} defaultVal
 * @param {string} menuText
 * @param {string} promtText
 * @param {function} func
 */
function setUserPref(varName, defaultVal, menuText, promtText, func = null) {
	GM_registerMenuCommand(menuText, function () {
		var val = prompt(promtText, GM_getValue(varName, defaultVal));
		if (val === null) { return; }// end execution if clicked CANCEL
		GM_setValue(varName, val);
		if (func != null) {
			func(val);
		}
	});
}
function httpRequest(object, timeout = 10000) {
	return new Promise(
		(resolve, reject) => {
			GM_xmlhttpRequest({
				method: object.method,
				url: object.url,
				headers: object.headers,
				responseType: object.respType,
				overrideMimeType: object.mimeType,
				data: object.body,
				timeout: timeout,
				onload: function (responseDetails) {
					debug(responseDetails);
					//Dowork
					resolve(responseDetails);
				},
				ontimeout: function (responseDetails) {
					debug(responseDetails);
					//Dowork
					resolve(responseDetails);

				},
				ononerror: function (responseDetails) {
					debug(responseDetails);
					//Dowork
					resolve(responseDetails);

				}
			});
		}
	)
}

