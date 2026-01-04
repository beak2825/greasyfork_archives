// ==UserScript==
// @name         排名结果解析
// @namespace    AndyLee
// @version      1.1
// @description  解析搜索引擎结果，存储到API
// @author       Andy Lee
// @connect   182.254.244.167
// @match    *://www.baidu.com/s?*
// @match    *://m.baidu.com/*
// @exclude    *://*.google*/sorry*
// @require https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant    GM_xmlhttpRequest
// @grant    GM_registerMenuCommand
// @grant    GM_log
// @grant    GM_addStyle
// @grant GM_notification
// @grant    GM_openInTab
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at document-end
// @license  GPL
// @downloadURL https://update.greasyfork.org/scripts/444819/%E6%8E%92%E5%90%8D%E7%BB%93%E6%9E%9C%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/444819/%E6%8E%92%E5%90%8D%E7%BB%93%E6%9E%9C%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function () {
	'use strict';


	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}


	let DBSite = {
		baidu: {
			SiteTypeID: 1,
			MainType: "#content_left>.c-container",
			UrlStyle: "h3 a",
			LinkAttr: "href",
			Index: "id",
			URLREGEX: "URL='([^']+)'",
		},
		sogou: {
			SiteTypeID: 2,
			MainType: "#main .results>div",
			UrlStyle: "h3 a"
		},
		haosou: {
			SiteTypeID: 3,
			MainType: ".res-list",
			UrlStyle: "h3 a"
		},
		google: {
			SiteTypeID: 4,
			MainType: "#rso .g",
			UrlStyle: "h3 a"
		},
		bing: {
			SiteTypeID: 5,
			MainType: "#b_results>li",
			UrlStyle: "h3 a"
		},
		duck: {
			SiteTypeID: 10,
			MainType: "#links_wrapper #links .results_links_deep",
			UrlStyle: "h3 a"
		},
		doge: {
			SiteTypeID: 11,
			MainType: "#links_wrapper #links .results_links_deep",
			UrlStyle: "h3 a"
		},
		mBaidu: {
			SiteTypeID: 6,
			MainType: ".c-result.result ",
			UrlStyle: ".c-result-content article",
			LinkAttr: 'rl-link-href',
			Index: "order",
			URLREGEX: "url=([^']+)\\\"",

		},
		zhihu: {
			SiteTypeID: 7,
		},
		baidu_xueshu: {
			SiteTypeID: 8,
			MainType: "#content_left .result",
			UrlStyle: "h3 a"
		},
		other: {
			SiteTypeID: 9,
		}
	};


	let SiteType = {
		BAIDU: DBSite.baidu.SiteTypeID,
		MBAIDU: DBSite.mBaidu.SiteTypeID,
		SOGOU: DBSite.sogou.SiteTypeID,
		SO: DBSite.haosou.SiteTypeID,
		GOOGLE: DBSite.google.SiteTypeID,
		BING: DBSite.bing.SiteTypeID,
		DUCK: DBSite.duck.SiteTypeID,
		DOGE: DBSite.doge.SiteTypeID,
		ZHIHU: DBSite.zhihu.SiteTypeID,
		BAIDU_XUESHU: DBSite.baidu_xueshu.SiteTypeID,
		OTHERS: 8
	};


	function resetURLNormal(containers, currentSite) {
		// 注意有重复的地址，尽量对重复地址进行去重

		const tasks = []

		for (var i = 0; i < containers.length; i++) {
			// 此方法是异步，故在结束的时候使用i会出问题-严重!
			// 采用闭包的方法来进行数据的传递
			let curNode = containers[i];
			let ranking = curNode.getAttribute(currentSite.Index)
			let a_link = curNode.querySelector(currentSite.UrlStyle)
			if (a_link === null) {
				continue
			}
			let curhref = a_link.getAttribute(currentSite.LinkAttr)

			if (curhref !== null && curNode !== null && curNode.getAttribute("ac_redirectStatus") === null) {
				curNode.setAttribute("ac_redirectStatus", "0");

				if (curhref.includes("www.baidu.com/link") ||
					curhref.includes("m.baidu.com/from") ||
					curhref.includes("www.sogou.com/link") ||
					curhref.includes("so.com/link")) {

					const task = new Promise((resolve, reject) => {
						resolve()

						let c_curhref = curhref
						let url = c_curhref.replace(/^http:/, "https:");
						if (curSite.SiteTypeID === SiteType.BAIDU && !url.includes("eqid")) {
							// 如果是百度，并且没有带有解析参数，那么手动带上
							url = url + "&wd=&eqid=";
						}

						let gmRequestNode = GM_xmlhttpRequest({
							// from: "acxhr",
							extData: c_curhref, // 用于扩展
							url: url,
							headers: {
								"Accept": "*/*",
								"Referer": c_curhref.replace(/^http:/, "https:")
							},
							method: "GET",
							timeout: 10000,
							onreadystatechange: function (response) { // MARK 有时候这个函数根本不进来 - 调试的问题 - timeout
								if (response.responseText || response.responseHeaders) {
									// 由于是特殊返回-并且好搜-搜狗-百度都是这个格式，故提出
									let real_url = Reg_Get(response.responseText, curSite.URLREGEX)
									// 这个是在上面无法处理的情况下，备用的 tm-finalurldhdg  tm-finalurlmfdh
									if (response.responseHeaders.includes("tm-finalurl")) {
										let relURL = Reg_Get(response.responseHeaders, "tm-finalurl\\w+: ([^\\s]+)");
										if (relURL === null || relURL === "" || relURL.includes("www.baidu.com/search/error")) return;
										real_url = relURL
									}
									gmRequestNode.abort();
									if (real_url !== "") {
                                        if(curSite.SiteTypeID === SiteType.MBAIDU){
											const params = new URLSearchParams(location.search);
											if(params.get('pn')) {
												ranking = Number(ranking) + Number(params.get('pn'))
											}
										}
										resolve({ranking: ranking, url: real_url})
									}
								}
							}
						});

					})
					tasks.push(task)
				}
			}
		}

		return Promise.all(tasks)

	}

	function isMobileDevice() {
		try {
			document.createEvent("TouchEvent");
			return (navigator.maxTouchPoints > 0 || 'ontouchstart' in document.documentElement) &&
				window.orientation > -1;
		}
		catch (e) {
			return false;
		}
	}

	let mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'


	function Reg_Get(HTML, reg) {
		let RegE = new RegExp(reg);
		try {
			return RegE.exec(HTML)[1];
		} catch (e) {
			return "";
		}
	}

	let curSite = {}


	if (location.host.includes("xueshu.baidu.com")) {
		curSite = DBSite.baidu_xueshu;
	} else if (location.host.includes(".baidu.com")) {

		if (location.host.includes("m.baidu.com")) {
			curSite = DBSite.mBaidu;

		} else {
			curSite = DBSite.baidu;
		}
	} else if (location.host.includes("zhihu.com")) {
		curSite = DBSite.zhihu;
	} else if (location.host.includes("sogou")) {
		curSite = DBSite.sogou;
	} else if (location.host.includes("so.com")) {
		curSite = DBSite.haosou;
	} else if (location.host.includes("google")) {
		curSite = DBSite.google;
	} else if (location.host.includes("bing")) {
		curSite = DBSite.bing;
	} else if (location.host.includes("duckduckgo")) {
		curSite = DBSite.duck;
	} else if (location.host.includes("dogedoge")) {
		curSite = DBSite.doge;
	} else {
		curSite = DBSite.other;
	}


	const cfg = new MonkeyConfig({
		title: '插件设置',
		menuCommand: true,
		params: {
			'设备名': {
				type: 'text',
				default: ''
			},
			'API地址': {
				type: 'text',
				default: ''
			},
			'是否运行': {
				type: 'checkbox',
				default: false,
				enable: false
			}
		}
	});

	const username = cfg.get('设备名')
	const switch_running = cfg.get('是否运行')
	const api_endpoint = cfg.get('API地址')

    GM_log(`Parser runing status is ${switch_running}`)
	if (switch_running) {
		GM_log(`Is Mobile Device : ${isMobileDevice()}, Current Site ${JSON.stringify(curSite)}`)
		let containers = document.querySelectorAll(curSite.MainType)
		resetURLNormal(containers, curSite).then(ranking => {

            window.scrollTo(0, document.body.scrollHeight);

			const markup = "<!DOCTYPE html><html>"+document.documentElement.innerHTML+"</html>";
            
            const urlParams = new URLSearchParams(window.location.search);
            const pid = urlParams.get('pidddd');
            const wtf_id = urlParams.get('wtf_id');
            const keyword_id = urlParams.get('keyyyyyy');
            let device;

            if (curSite.SiteTypeID === SiteType.MBAIDU) {
                device = 'mb'
            }else {
                device = 'pc'
            }
            let page = 1;
            if(urlParams.get('pn')) {
                page = Number(urlParams.get('pn')) / 10 + 1
            }

			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					url: api_endpoint,
					headers: {
						"Accept": "*/*",
						"Content-Type": "application/json;charset=UTF-8"
					},
					data: JSON.stringify({
                        'platform': curSite.SiteTypeID,
						'username': username,
                        'device': device,
                        'wtf_id': wtf_id,
                        'keyword_id': keyword_id,
                        'page': page,
                        'pid': pid,
						'html': markup
                    }),
					method: "POST",
					timeout: 10000,
					onerror: e => reject(e),
					onreadystatechange: function (response) {
						console.log(response.text)
						resolve(response.text)
					}
				});


			}).then(res => {
                console.log('parse successed')
			window.close()
			}).catch(e => console.log(e))

		})


	}


})();
