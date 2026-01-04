// ==UserScript==
// @name         Bilibili Ban Kit
// @namespace    https://github.com/linyanm
// @version      2024-10-24--01
// @description  批量ban掉你讨厌的up主
// @author       Noir
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/?*
// @match        *://www.bilibili.com/index.html
// @match        *://www.bilibili.com/index.html?*
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/watchlater?*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://space.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513846/Bilibili%20Ban%20Kit.user.js
// @updateURL https://update.greasyfork.org/scripts/513846/Bilibili%20Ban%20Kit.meta.js
// ==/UserScript==

(function() {
	'use strict';



	const CACHE = {
			陈三岁恐怖游戏: 3537112840275980,
			吧主甲: 434615,
			晚晚恶霸和小跟班: 253212392,
			电影迷小雅: 395991094,
			真探唐仁杰: 544336675,
			润州镜: 2229752,
			龙崎棒棒糖: 4564056,
			英大吉: 638816489,
			steam情报局: 473519710,
			勾手老大爷邓肯: 24490535,
			红警HBK08: 1629347259,
			小片片说大片: 10119428,
			正说清代十二朝: 1457639978,
			井号5467: 4305299,
			培根悖论唠唠嗑: 386869863,
			南国小豆豆: 10518076,
			胶片看电影: 46545652,
			机智帅气的一炫君: 309134148,
			不搞博士Dcy: 442229,
			黝黑蜗壳天眼老师: 14068111,
			光影笔墨: 269319344,
			迷影至下Filmlast: 942755,
			河畔的伯爵: 1596926736,
			老野心家: 2043926679,
			一碗龙虾汤: 98684196,
			渤海小吏: 504934876,
			风都獭书馆: 145544,
			The梁某人: 1405515989,
			江湖弃子: 1117551831,
			墨染玄黎: 406999290,
			大聪看电影: 253350665,
			抽风crazy: 2728123,
			悬疑MOVIE: 452600545,
			西葛西: 2035005110,
			文西与阿漆: 94281836,
			硬核的HeyMatt: 239688446,
			发光的三极管yoyo: 1135981288,
			南条鸡腿子: 2574869,
			老大南: 483052036,
			老坚果然翁: 284845773,
			影Man未知档案: 13743667,
			AYCS2: 203680252,
			地上足球888: 550674844,
			瓦岗寨主坑爹李: 3948019,
	};
	const NAMES = Object.keys(CACHE).join(',');


	const cache = GM_getValue('cache', CACHE);
	const block = GM_getValue('block', {});

	let blacklist = GM_getValue('blacklist', []);

	GM_registerMenuCommand('配置黑名单', showConfigDialog);

	let container = null;

	function showConfigDialog() {
			if (container) {
					container.remove();
			}
			container = document.createElement('div');
			container.innerHTML = `
					<div style="position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
											background: #fff; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.3);
											padding: 20px; z-index: 10000; width: 400px; font-family: Arial;">
							<h3 style="text-align: center; margin-bottom: 10px;">配置拉黑名单</h3>
							<textarea id="batchInput" style="width: 100%; height: 50px; border: 1px solid #ddd;
									border-radius: 5px; padding: 5px;" placeholder="批量输入昵称，用逗号分隔"></textarea>
							<button id="batchAdd" style="margin-top: 10px; width: 100%; padding: 10px;
									background-color: #00a1d6; color: white; border: none; border-radius: 5px;">批量添加</button>
							<button id="initialize" style="margin-top: 10px; width: 100%; padding: 10px;
									background-color: #00a1d6; color: white; border: none; border-radius: 5px;">一键添加畜生名单</button>
							<ul id="blacklist" style="list-style: none; padding: 0; margin-top: 15px; max-height: 200px;
									overflow-y: auto; border: 1px solid #ddd; border-radius: 5px;">
									${blacklist.map((name, i) => `
											<li style="display: flex; justify-content: space-between; align-items: center; padding: 5px;
													border-bottom: 1px solid #f0f0f0;">
													<span id="user-${i}" class="user-name" style="flex: 1;">${name}</span>
													<button data-index="${i}" class="remove-btn" style="color: red; border: none;
															background: none;">删除</button>
											</li>
									`).join('')}
							</ul>
							<!-- <button id="execute" style="margin-top: 10px; width: 100%; padding: 10px; background-color: #00a1d6;
									color: white; border: none; border-radius: 5px;">正义执行</button> -->
							<button id="close" style="margin-top: 5px; width: 100%; padding: 10px; background-color: #ccc;
									color: black; border: none; border-radius: 5px;">关闭</button>
					</div>
			`;
			document.body.appendChild(container);

			// container.querySelector('#execute').addEventListener('click', main);
			container.querySelector('#close').addEventListener('click', () => container.remove());
			container.querySelector('#batchAdd').addEventListener('click', addBatchNames);
			container.querySelector('#initialize').addEventListener('click', initialize);

			container.querySelectorAll('.remove-btn').forEach(btn => {
					btn.addEventListener('click', (e) => {
							const index = e.target.dataset.index;
							const name = blacklist[index];
							delete block[name];
							GM_setValue('block', block);
							blacklist.splice(index, 1);
							showConfigDialog(); // 重新渲染
							saveBlacklist();
					});
			});

			// 检查每个用户的拉黑状态
			blacklist.forEach((name, i) => {
					fetchUID(name).then(uid => {
							if (uid) {
									isBlocked(uid).then(isBlocked => {
											const userElement = document.getElementById(`user-${i}`);
											userElement.style.color = isBlocked ? 'green' : 'red';
											userElement.textContent += isBlocked ? '（已拉黑）' : '（未拉黑）';
									});
							}
					});
			});
	}

	function addBatchNames() {
			const input = document.querySelector('#batchInput').value.trim();
			if (input) {
					const names = input.split(',').map(name => name.trim()).filter(name => name);
					blacklist.push(...names);
					showConfigDialog();
					saveBlacklist();
			}
	}

	function initialize() {
			const names = NAMES.split(',').map(name => name.trim()).filter(name => name);
			blacklist.push(...names);
			showConfigDialog();
			saveBlacklist();
	}

	function saveBlacklist() {
			blacklist = Array.from(new Set(blacklist));
			GM_setValue('blacklist', blacklist);
			main();
	}

	function fetchUID(name) {
			const url = `https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&keyword=${encodeURIComponent(name)}`;
			return new Promise((resolve, reject) => {
					if (cache[name]) {
							resolve(cache[name]);
							return;
					}
					GM_xmlhttpRequest({
							method: 'GET',
							url: url,
							onload: (response) => {
									try {
											const result = JSON.parse(response.responseText);
											if (result.data && result.data.result.length > 0) {
													const uid = result.data.result[0].mid;
													if (name && uid) {
															cache[name] = uid;
															GM_setValue('cache', cache);
													}
													resolve(uid);
											} else {
													resolve(null);
											}
									} catch (e) {
											reject(e);
									}
							},
							onerror: reject
					});
			});
	}

	function isBlocked(uid) {
			const url = `https://api.bilibili.com/x/relation?fid=${uid}`;
			return new Promise((resolve, reject) => {
					if (block[uid]) {
							resolve(true);
							return;
					}
					GM_xmlhttpRequest({
							method: 'GET',
							url: url,
							onload: (response) => {
									try {
											const result = JSON.parse(response.responseText);
											const blocked = result.data.attribute === 128; // 128 表示已拉黑
											block[uid] = blocked;
											GM_setValue('block', block);
											resolve(blocked)
									} catch (e) {
											reject(e);
									}
							},
							onerror: reject
					});
			});
	}

	async function getUIDsToBlock() {
			const uids = [];
			for (const name of blacklist) {
					const uid = await fetchUID(name);
					if (uid && !(await isBlocked(uid))) {
							uids.push(uid);
					} else {
							// console.log(`用户 ${name} 已经拉黑或未找到，跳过。`);
					}
			}
			return uids;
	}

	function blockUser(uid) {
			const csrfToken = getCsrfToken();
			const extendContent = JSON.stringify({
					entity: "user",
					entity_id: uid,
					fp: `0\u0001900,,1440\u0001Win32\u000120\u00018\u000124\u00011\u0001zh-CN\u00010\u00010,,0,,0\u0001${navigator.userAgent}`
			});

			const formData = new URLSearchParams({
					fid: uid,
					act: "5", // act=5 拉黑
					// act=6 解除拉黑
					re_src: "11",
					gaia_source: "web_main",
					spmid: "333.999.0.0",
					extend_content: extendContent,
					csrf: csrfToken
			}).toString();

			GM_xmlhttpRequest({
					method: 'POST',
					url: 'https://api.bilibili.com/x/relation/modify',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Origin': 'https://www.bilibili.com',
							'Referer': 'https://www.bilibili.com/',
							'Cookie': document.cookie,
					},
					data: formData,
					onload: (response) => {
							if (response.status === 200) {
									console.log(`成功拉黑用户：${uid}`);
							} else {
									console.error(`拉黑失败：${uid}`, response);
							}
					},
					onerror: (error) => console.error(`请求错误：${uid}`, error)
			});
	}

	function getCsrfToken() {
			const match = document.cookie.match(/bili_jct=([a-zA-Z0-9]{32})/);
			return match ? match[1] : '';
	}

	// 主逻辑：过滤后执行批量拉黑
	async function main () {
			const uidsToBlock = await getUIDsToBlock();
			uidsToBlock.forEach((uid, index) => {
					setTimeout(() => {
							blockUser(uid);
							if (container) {
									showConfigDialog();
							}
					}, index * 5000); // 间隔 5 秒避免风控
			});
	}

	main();
})();