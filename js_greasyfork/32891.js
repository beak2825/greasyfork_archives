// ==UserScript==
// @name                 SearchEngine-Filter
// @name:zh-CN           搜索引擎过滤器
// @namespace            https://greasyfork.org/zh-CN/users/42351
// @version              1.8
// @description          Filter search page spam, And resolve redirect URL into direct
// @description:zh-CN    过滤搜索页垃圾信息,并将重定向网址解析为直接网址
// @icon64               https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon                 https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @author               Antecer
// @include              http*://*.baidu.com*
// @include              http*://*.bing.com/search?*
// @grant                GM_xmlhttpRequest
// @grant                GM_getValue
// @grant                GM_setValue
// @connect              *
// @run-at               document-body
// @compatible           chrome 测试通过
// @compatible           firefox 未测试
// @compatible           opera 未测试
// @compatible           safari 未测试
// @downloadURL https://update.greasyfork.org/scripts/32891/SearchEngine-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/32891/SearchEngine-Filter.meta.js
// ==/UserScript==

(async () => {
    // 识别百度网页
    if (!location.host.endsWith('baidu.com')) return;
    // 识别百度搜索页 与 搜图页
    if (!(location.href.includes('baidu.com/s?') || location.href.includes('baidu.com/pcpage/similar?'))) return;
	// 读取脚本配置
	let scriptCfgs = {
		unRedirect: GM_getValue('unRedirect', true), // 反重定向(默认启用)
		unExperience: GM_getValue('unExperience', true), // 屏蔽百度经验(默认启用)
		unOtherQuery: GM_getValue('unOtherQuery', true), // 屏蔽其他人还在搜(默认启用)
		unExpert: GM_getValue('unExpert', true), // 屏蔽百度健康(默认启用)
		unHotQuery: GM_getValue('unHotQuery', false), // 屏蔽百度热搜榜(默认禁用)
		unSimilar: GM_getValue('unSimilar', false), // 屏蔽相关搜索(默认禁用)
		unGame: GM_getValue('unGame', false), // 屏蔽百度游戏(默认禁用)
		unTuiguang: GM_getValue('unTuiguang', true), // 屏蔽百度推广(默认启用)
		adBlock: GM_getValue('adBlock', true), // 屏蔽广告(默认启用)
		unRogue: GM_getValue('unRogue', 'hao123.com|2345.com') // 屏蔽流氓网站(默认启用,清空参数表示禁用)
	};

	// 创建sleep方法(用于async/await的延时处理)
	const Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	// 创建超时变量,防止长时间循环遍历document
	const timeoutValue = 10;
	// 创建选择器,用于判断element是否已加载
	const isBodyLoading = async (css) => {
		let timeout = timeoutValue;
		while (!document.querySelector(css) && timeout) {
			--timeout;
			await Sleep(1000);
		}
	};

	// 功能模块
	const Steps = {
		unRedirect: async () => {
			await isBodyLoading(`[href*="baidu.com/link?"],[href*="baidu.com/api/proxy?"]`);
			let allowUpgrade = document.createElement(`meta`);
			allowUpgrade.setAttribute('http-equiv', 'Content-Security-Policy');
			allowUpgrade.setAttribute('content', 'upgrade-insecure-requests');
			document.head.append(allowUpgrade);
			document.querySelectorAll(`[href*="baidu.com/link?"],[href*="baidu.com/api/proxy?"]`).forEach((element) => {
				(async (item) => {
					let reTry = false;
					let thisXhr = GM_xmlhttpRequest({
						url: item.href,
						method: 'GET',
						onreadystatechange: (result) => {
							if (result.readyState > 2) {
								item.href = result.finalUrl;
								thisXhr.abort();
							}
						},
						onerror: (err) => {
							reTry = true;
							console.error(`[Baidu-Filter] Call HEAD Failed!`, err);
						}
					});
				})(element);
			});
		},
		unExperience: async () => {
			await isBodyLoading(`[href*="jingyan.baidu.com"]`);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.querySelector(`[href*="jingyan.baidu.com"]`)) item.remove();
			});
		},
		unOtherQuery: async () => {
			await isBodyLoading(`.result-op`);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.innerHTML.includes(`>其他人还在搜<`)) item.remove();
			});
		},
		unExpert: async () => {
			while (!document.querySelector(`[href*="expert.baidu.com"]`)) await Sleep(1000);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.querySelector(`[href*="expert.baidu.com"]`)) item.remove();
			});
		},
		unTuiguang: async () => {
			while (!document.querySelector(`[data-tuiguang]`)) await Sleep(1000);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.querySelector(`span[data-tuiguang]`)) item.remove();
			});
		},
		unGame: async()=> {
			await isBodyLoading(`a[href*="lewan.baidu.com"]`);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.querySelector(`a[href*="lewan.baidu.com"]`)) item.remove();
			});
		},
		unHotQuery: async () => {
			await isBodyLoading(`[title="百度热榜"]`);
			document.querySelectorAll(`#content_right`).forEach((item) => {
				if (item.querySelector(`[title="百度热榜"]`)) item.remove();
			});
		},
		unSimilar: async () => {
			while (!document.querySelector(`#rs`)) await Sleep(1000);
			document.querySelectorAll(`[id="rs"]`).forEach((item) => {
				if (item.querySelector(`table a[href^="/s?wd="]`)) item.remove();
			});
		},
		adBlock: async () => {
			while (!document.querySelector(`.ec_tuiguang_pplink`)) await Sleep(1000);
			document.querySelectorAll(`#content_left>div`).forEach((item) => {
				if (item.innerHTML.includes(`>广告</span>`)) item.remove();
			});
		},
		unRogue: async () => {
			let timeout = timeoutValue;
			let rogueList = scriptCfgs.unRogue;
			let rogueRegExp = new RegExp(rogueList);
			while (rogueList && timeout) {
				--timeout;
				let nodes = document.querySelectorAll('a');
				for (let i = nodes.length; i > 0; ) {
					if (nodes[--i].href.match(rogueRegExp)) {
						i = timeout = 0;
					}
				}
				await Sleep(1000);
			}
			let rList = document.querySelectorAll(`#content_left>div`);
			for (let i = rList.length; i > 0; ) {
				--i;
				let cList = rList[i].querySelectorAll('a');
				for (let n = cList.length; n > 0; ) {
					--n;
					if (cList[n].href.match(rogueRegExp)) {
						rList[i].remove();
						break;
					}
				}
			}
		}
	};

	// 检查并执行已启用的功能
	const runScript = async () => {
		let loopNum = 3; // 执行次数
		let timeout = 5; // 间隔时间
		while (loopNum--) {
			Object.keys(scriptCfgs).forEach((key) => {
				GM_setValue(key, scriptCfgs[key]); // 保存脚本配置
				if (scriptCfgs[key]) Steps[key](); // 执行脚本功能
			});
			for (let i = timeout; i-- > 0; ) await Sleep(1000);
		}
	};
	// 监听页面变化
	document.querySelector('title').addEventListener('DOMNodeInserted', () => runScript(), false);
	// 运行脚本
	runScript();
})();

(async()=>{
    // 识别必应网页
    if (!location.host.endsWith('bing.com')) return;
    // 读取脚本配置
	let scriptCfgs = {
		unRogue: GM_getValue('unRogue', 'hao123.com|2345.com') // 屏蔽流氓网站(默认启用,清空参数表示禁用)
	};
	// 创建sleep方法(用于async/await的延时处理)
	const Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	// 功能模块
	const Steps = {
        unRogue: async()=>{
			let rogueList = scriptCfgs.unRogue;
			let rogueRegExp = new RegExp(rogueList);
            let rList = document.querySelectorAll(`main>ol>li`);
            for (let i = rList.length; i > 0; ) {
				--i;
				let cList = rList[i].querySelectorAll('a');
				for (let n = cList.length; n > 0; ) {
					--n;
					if (cList[n].href.match(rogueRegExp)) {
						rList[i].remove();
						break;
					}
				}
			}
        }
    };
	// 检查并执行已启用的功能
	const runScript = async () => {
		let loopNum = 3; // 执行次数
		let timeout = 5; // 间隔时间
		while (loopNum--) {
			Object.keys(scriptCfgs).forEach((key) => {
				GM_setValue(key, scriptCfgs[key]); // 保存脚本配置
				if (scriptCfgs[key]) Steps[key](); // 执行脚本功能
			});
			for (let i = timeout; i-- > 0; ) await Sleep(1000);
		}
	};
	// 监听页面变化
	document.querySelector('title').addEventListener('DOMNodeInserted', () => runScript(), false);
	// 运行脚本
	runScript();
})();