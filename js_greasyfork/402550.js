// ==UserScript==
// @name         pseudo-Benben - tiger0132
// @namespace    https://oj.akioi.ml:8200/
// @version      1.2.7
// @description  qwq
// @author       tiger0132
// @match        https://*.luogu.com.cn/
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402550/pseudo-Benben%20-%20tiger0132.user.js
// @updateURL https://update.greasyfork.org/scripts/402550/pseudo-Benben%20-%20tiger0132.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const $ = unsafeWindow.$, host = GM_getValue('benben_host', 'https://pbb.akioi.ml');

	const request = ({ url, data }) => new Promise((resolve, reject) => {
		try {
			data.img = 1;
			data._ = +new Date;
			var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function () {
				var canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(this, 0, 0);
				resolve(JSON.parse(new TextDecoder().decode(ctx.getImageData(0, 0, this.width, 1).data.filter((_, i) => i % 4 !== 3))));
			};
			img.onerror = reject;
			img.src = url + '?' + new URLSearchParams(data);
		} catch (e) {
			reject(e);
		}
	});
	function verifyToken(cur_token, secret) {
		console.log(`token: ${cur_token}`);
		console.log(`secret: ${secret}`);
		var slogan = _feInstance.currentUser.slogan;
		show_prompt('提示', '脚本可能会覆盖您的签名，请妥善备份。\n原签名：' + slogan, () => {
			fetch('https://www.luogu.com.cn/api/user/updateSlogan', {
				'headers': {
					'content-type': 'application/json;charset=UTF-8',
					'x-csrf-token': document.getElementsByName('csrf-token')[0].content
				},
				'body': `{"slogan":"${secret}"}`,
				'method': 'POST',
			}).then(resp => resp.json()).then(resp => {
				request({
					url: host + '/api/auth/verifyToken',
					data: { token: cur_token }
				}).then(res => {
					if (res.status !== 200) {
						console.error(res.data);
						return show_alert('提示', '[Benben\'] 出了一点问题 >_<', res.data);
					}
					GM_setValue('benben_token', token = cur_token);
					fetch('https://www.luogu.com.cn/api/user/updateSlogan', {
						'headers': {
							'content-type': 'application/json;charset=UTF-8',
							'x-csrf-token': document.getElementsByName('csrf-token')[0].content
						},
						'body': `{"slogan":"${slogan}"}`,
						'method': 'POST',
					}).then(res => res.json()).then(res => {
						show_alert('提示', '[Benben\'] 验证成功');
						checkStatus();
					});
				});
			});
		});
	}
	function genNewToken() {
		request({
			url: host + '/api/auth/getToken',
			data: { uid: _feInstance.currentUser.uid }
		}).then(res => {
			if (res.status !== 200) {
				console.error(res.data);
				return alert('[Benben\'] 出了一点问题 >_<');
			}
			verifyToken(res.data.token, res.data.secret);
		});
	}

	var token = GM_getValue('benben_token'), cur_uid;
	var sendMode = 0; // 1 是伪犇，0 是原

	function injectPostFeed() {
		$('#feed-submit').unbind();
		$('#feed-submit').click(function () {
			if (sendMode) {
				this.classList.add('am-disabled');
				var content = document.getElementById('feed-content').value;
				request({
					url: host + `/api/feed/${feedMode.substr(8)}/post`,
					data: { content: content, token: token }
				}).then(resp => {
					if (resp.status !== 200) {
						show_alert('好像哪里有点问题', resp.data);
					} else {
						$("#feed-content").val('');
						switchMode(feedMode);
					}
					this.classList.remove('am-disabled');
				});
			} else {
				$(this).addClass("am-disabled");
				var content = $('#feed-content').val(), e = this;
				$.post("/api/feed/postBenben", { content: content }, function (resp) {
					if (resp.status !== 200) {
						show_alert("好像哪里有点问题", resp.data);
					} else {
						$(e).removeClass("am-disabled");
						$("#feed-content").val('');
						switchMode('watching');
					}
				});
			}
		});
	}

	const selector_html = `<a style="cursor: pointer">伪犇犇</a>`;

	function origLoadFeed() {
		$.get('/feed/' + feedMode + '?page=' + feedPage, function (resp) {
			console.log('[pLIE v2] loadFeed()');
			var l = $(resp), res;
			for (var i = 0; i < l.length; i++) { // 在获取犇犇的时候就直接过滤
				(function (node) {
					if (node.tagName == 'LI') {
						var uid = node.querySelector('div.lg-left > a').href.match(/\/user\/(\d+)/)[1];
						if (ignQuery(uid)) {
							console.log(`[pLIE v2] ignored a feed from uid=${uid}`); // debug
							return;
						}
						var ignAddButton = $(`<span class="am-btn am-btn-danger am-btn-sm am-radius am-badge lg-bg-red ign-btn" data-uid="${uid}">屏蔽</span>`);
						var ignDelButton = $(`<span class="am-btn am-btn-success am-btn-sm am-radius am-badge lg-bg-green ign-btn" data-uid="${uid}">解除</span>`);
						ignAddButton.click(() => { ignAdd(uid); });
						ignDelButton.click(() => { ignDel(uid); });
						$('div.am-comment-main > header > div', node).append(ignAddButton).append('&nbsp;').append(ignDelButton);
						$feed.append(node);
					} else
						$feed.append(node);
				})(l[i]);
			}

			$('#feed-more').children('a').text('点击查看更多...')
			$('[name=feed-delete]').click(function () {
				$.post('/api/feed/delete/' + $(this).attr('data-feed-id'), () => {
					switchMode(feedMode);
				})
			})
			$('[name=feed-reply]').click(function () {
				var content = $(this).parents('li.feed-li').find('.feed-comment').text();
				$('#feed-content').val(' || @' + $(this).attr('data-username') + ' : ' + content);
			})
			$('[name=feed-report]').click(function () {
				var reportType = $(this).attr('data-report-type'), reportID = $(this).attr('data-report-id');
				$('#report').modal({
					relatedTarget: this,
					onConfirm: (e) => {
						var reason = $('[name=reason]').val();
						var detail = $('[name=content]').val();

						$.post('/api/report/' + reportType, {
							relevantID: reportID,
							reason: reason + ' ' + detail
						}, function (data) {
							show_alert('提示', data.data);
						});
					}
				});
			});
		});
		feedPage++;
	}
	unsafeWindow.loadFeed = () => {
		if (unsafeWindow.feedMode.indexOf('pbenben') != -1) p_loadFeed();
		else origLoadFeed();
	}
	var origSwitchMode = unsafeWindow.switchMode;
	unsafeWindow.switchMode = mode => {
		if (mode.indexOf('pbenben') != -1) sendMode = 1;
		else sendMode = 0;
		origSwitchMode(mode);
	}
	function p_loadFeed() {
		request({
			url: host + '/api/feed/' + unsafeWindow.feedMode.substr(8),
			data: {
				page: unsafeWindow.feedPage,
				token: token
			}
		}).then(resp => {
			if (resp.status !== 200) return show_alert('提示', resp.data);

			const rootUsers = [ // 后端会检验的，如果没有权限，加进去也没用
				28762
			];

			var feedMd = [];
			var html = resp.data.reduce((last, i) => {
				var feed_del = '', badge_html = '';
				if (i.user.uid == cur_uid || rootUsers.includes(cur_uid))
					feed_del = `<a name="feed-delete" data-feed-id="${i.id}">删除</a>`;
				if (i.user.badge)
					badge_html = `&nbsp;<span class="am-badge am-radius" style="background-color: ${i.user.color};">${escapeHtml(i.user.badge)}</span>`;
				return last + `
<li class="am-comment am-comment-primary feed-li"}>
<div class="lg-left"><a href="/user/${i.user.uid}" class="center">
<img src="https://cdn.luogu.com.cn/upload/usericon/${i.user.uid}.png" class="am-comment-avatar">
</a></div>
<div class="am-comment-main">
<header class="am-comment-hd">
<div class="am-comment-meta">
<span class="feed-username"><a class${i.user.bold ? '="lg-bold"' : ''} style="color: ${i.user.color} !important;" href="/user/${i.user.uid}" target="_blank">${i.user.name}</a>${badge_html}</span> ${fmtDate(new Date(i.time * 1000))}
${feed_del}
<a name="feed-reply" href="javascript: scrollToId('feed-content')" data-username="${i.user.name}">回复</a>
</header>
<div class="am-comment-bd">
<span class="feed-comment">${i.content_html}</span>
<span class="feed-markdown">${encodeURIComponent(i.content_markdown)}</span>
</div>
</div>
</li>`
			}, '');

			$feed.append(html);
			$('#feed-more').children('a').text('点击查看更多...');
			$('[name=feed-delete]').click(function () {
				request({
					url: host + '/api/feed/action/delete',
					data: {
						id: $(this).attr('data-feed-id'),
						token: token
					}
				}).then(resp => {
					if (resp.status != 200) show_alert(resp.data);
					else switchMode(feedMode);
				});
			});
			$('[name=feed-reply]').click(function () {
				var content_markdown = $(this).parents('li.feed-li').find('.feed-markdown').text();
				var content_html = $(this).parents('li.feed-li').find('.feed-comment').text();
				$('#feed-content').val(' || @' + $(this).attr('data-username') + ' :  \n' + (decodeURIComponent(content_markdown) || content_html));
			});
			feedPage++;
		});
	}

	unsafeWindow.getFeedMode = () => {
		if (feedMode.startsWith('pbenben-'))
			return feedMode.substr(8);
		else
			return feedMode;
	};

	unsafeWindow.changeColor = (color, bold) =>
		request({
			url: host + '/api/user/changeColor',
			data: {
				token: token,
				color: color,
				bold: bold
			}
		}).then(data => {
			console.log(data.data);
			show_alert('提示', data.data)
		});
	unsafeWindow.changeTag = tag =>
		request({
			url: host + '/api/user/changeTag',
			data: { token: token, tag: tag }
		}).then(data => {
			console.log(data.data);
			show_alert('提示', data.data)
		});

	unsafeWindow.newRoom = name =>
		request({
			url: host + '/api/room/new',
			data: { token: token, name: name }
		}).then(data => {
			if (data.status === 200)
				show_alert('提示', '创建成功。分区 id：' + data.data.id);
			else
				show_alert('提示', data.data);
		});
	unsafeWindow.addUser = (uid, id) =>
		request({
			url: host + `/api/room/${id || getFeedMode()}/addUser`,
			data: { token: token, uid: uid }
		}).then(data => {
			console.log(data.data);
			show_alert('提示', data.data)
		});
	unsafeWindow.delUser = (uid, id) =>
		request({
			url: host + `/api/room/${id || getFeedMode()}/delUser`,
			data: { token: token, uid: uid }
		}).then(data => {
			console.log(data.data);
			show_alert('提示', data.data)
		});
	unsafeWindow.userList = id =>
		request({
			url: host + `/api/room/${id || getFeedMode()}/info`,
			data: { token: token }
		}).then(data => {
			console.log(data.data.users.map(x => x.name));
			console.log(data.data.users);
		});

	function checkStatus() {
		request({
			url: host + '/api/auth/tokenStatus',
			data: { token: token }
		}).then(resp => {
			console.logresp;
			var statusNode = document.getElementById('pbenben-status');
			var btn = document.getElementById('benben-btn');
			btn.textContent = '';
			statusNode.textContent = '';
			if (resp.status !== 200) {
				statusNode.style.color = '#e74c3c';
				statusNode.textContent = `错误：${resp.data}`;
				btn.textContent = '生成 token';
				btn.style.visibility = 'visible';
				btn.onclick = function () {
					this.classList.add('am-disabled');
					genNewToken();
				};
			} else if (resp.data.verified/* && resp.data.uid == _feInstance.currentUser.uid*/) {
				btn.style.visibility = 'hidden';
				statusNode.style.color = '#5eb95e';
				statusNode.textContent = `正常：uid = ${cur_uid = resp.data.user.uid}`;
			} else {
				btn.style.visibility = 'visible';
				statusNode.style.color = '#e67e22';
				if (!resp.data.verified) {
					statusNode.textContent = 'token 未验证&nbsp;';
					btn.textContent = '验证 token';
					btn.onclick = function () {
						this.classList.add('am-disabled');
						verifyToken(token);
					};
				}
			}
		});
	}
	function addTagChanger() {
		$('#change-tag').click(() => {
			var tag = $('#tag-content')[0].value;
			changeTag(tag);
		});
	}
	async function addVersionChecker() {
		try {
			$('#version-info')[0].textContent = `当前版本：${GM_info.script.version} `;

			var latestScriptVersion = await request({
				url: host + '/api/misc/latestScriptVersion',
				data: {}
			});
			$('#version-info')[0].textContent += `最新版本：${latestScriptVersion.data} `;

			var backendVersion = await request({
				url: host + '/api/misc/backendVersion',
				data: {}
			});
			$('#version-info')[0].textContent += `后端版本：${backendVersion.data}`;
		} catch (e) { console.error(e); }
	}
	async function addFeedModeButton() {
		request({
			url: host + '/api/room/list',
			data: { token: token, mode: 'public' }
		}).then(data => {
			var node = $('#feedmode-selector')[0];
			if (data.status != 200) node.append(data.data);
			else
				for (var i of data.data) {
					node.append($(`
<button class="am-btn am-btn-primary am-btn-sm" onclick="switchMode('pbenben-${i.id}')">${escapeHtml(i.name)}</button>`)[0]);
					node.append('\u00a0');
				}
		});
		var ownedRooms = new Set();
		await request({
			url: host + '/api/room/list',
			data: { token: token, mode: 'my' }
		}).then(data => {
			if (data.status === 200)
				for (var i of data.data)
					ownedRooms.add(JSON.stringify({ name: i.name, id: i.id }));
		});
		request({
			url: host + '/api/room/list',
			data: { token: token, mode: 'joined' }
		}).then(data => {
			var node = $('#joined-selector')[0];
			if (data.status != 200) node.append(data.data);
			else
				for (var i of data.data) {
					node.append($(`
<button class="am-btn ${ownedRooms.has(JSON.stringify({ name: i.name, id: i.id })) ? 'am-btn-success' : 'am-btn-secondary'} am-btn-sm" onclick="switchMode('pbenben-${i.id}')">${escapeHtml(i.name)}</button>`)[0]);
					node.append('\u00a0');
				}
		});
	}

	const entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;'
	};
	function escapeHtml(string) {
		return String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);
	}
	function fmtDate(dt) {
		return `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
	}

	const modal_html = `
<div class="am-modal am-modal-prompt" tabindex="-1" id="pbenben-prompt">
<div class="am-modal-dialog">
<div class="am-modal-hd" id="pbenben-alert-title"></div>
<div class="am-modal-bd" id="pbenben-alert-message"></div>
<div class="am-modal-footer">
<span class="am-modal-btn" data-am-modal-cancel>取消</span>
<span class="am-modal-btn" data-am-modal-confirm>确定</span>
</div>
</div>
</div>`;
	unsafeWindow.show_prompt = function show_prompt(title, message, callback) {
		$('#pbenben-alert-title').html(title);
		$('#pbenben-alert-message').html(message);
		$('#pbenben-prompt').modal({
			onConfirm: callback
		});
	}
	function addConfirmModal() {
		document.body.append($(modal_html)[0]);
	}

	const status_html = `
<h2>伪犇犇</h2>
<span id="version-info">版本信息：N/A</span>&nbsp;<a href="https://greasyfork.org/zh-CN/scripts/402550-pseudo-benben-tiger0132">项目链接</a>&nbsp;
<a href="/paste/b22sy2nu">FAQ</a>&nbsp;
<a href="https://pbb.akioi.ml/">独立站</a><br>
<span>状态：<span id="pbenben-status">N/A</span>&nbsp;
<button class="am-btn am-btn-primary am-btn-sm" id="benben-btn" style="visibility: hidden !important"></button></span><br>
<div class="am-input-group am-input-group-primary am-input-group-sm"><input type="text" class="am-form-field" placeholder="tag 内容" id="tag-content"></div>
<button class="am-btn am-btn-danger am-btn-sm" id="change-tag">修改</button><br>
<div id="feedmode-selector">
<button class="am-btn am-btn-primary am-btn-sm" onclick="switchMode('watching')">我关注的</button>
<!--<button class="am-btn am-btn-primary am-btn-sm" onclick="switchMode('all')">全网动态</button>-->
<button class="am-btn am-btn-primary am-btn-sm" onclick="switchMode('my')">我发布的</button>
</div>
<div id="joined-selector">
</div>
<small>
提示：第一次使用请按「生成 token」<br>
注：如果选中的是「我关注的」、「全网动态」（和「我发布的」），那么发送的内容就在原犇犇，反之亦然<br>
以及，tag 长度最多 10 个字，特殊字符会被过滤</small>
`;
	function init() {
		if (!_feInstance.currentUser) {
			console.error('[Benben\'] Not logined!');
			return;
		}

		var node = document.createElement('div');
		node.className = 'lg-article';
		node.id = 'benben-status';
		node.innerHTML = status_html;

		document.querySelector('div.lg-index-benben > div:nth-child(2)').insertAdjacentElement('afterend', node);

		GM_addStyle(`.feed-comment p {margin-bottom: 0;} .feed-markdown {display: none;}`);

		checkStatus();
		injectPostFeed();
		// addColorSelector(); disabled
		// addFeedModeSelector(); deprecated
		addTagChanger();
		addVersionChecker();
		addFeedModeButton();
		addConfirmModal();
	}
	init();

	unsafeWindow.getToken = () => GM_getValue('benben_token');
	unsafeWindow.setToken = data => {
		GM_setValue('benben_token', token = data);
		checkStatus();
	};
	unsafeWindow.rmToken = () => {
		GM_deleteValue('benben_token');
		token = undefined;
		checkStatus();
	};
	unsafeWindow.setHost = data => GM_setValue('benben_host', data);
	unsafeWindow.getHost = () => GM_getValue('benben_host');
	unsafeWindow.rmHost = () => GM_deleteValue('benben_host');

	// 屏蔽器相关
	var ignoreList = GM_getValue('LuoguIgnoreList_v2', {});

	function getUid(name) { // 根据用户名反查 uid
		return new Promise((resolve, reject) => {
			$.get('/api/user/search?keyword=' + name, function (resp) {
				resolve(resp.users[0].uid);
			});
		});
	}

	function ignAdd(uid) {
		ignoreList[uid] = true;
		console.log(`[pLIE v2] added ${uid}`);
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function ignSet(data) {
		ignoreList = data;
		console.log(`[pLIE v2] success`);
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function ignDel(uid) {
		delete ignoreList[uid];
		console.log(`[pLIE v2] deleted ${uid}`);
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function ignQuery(uid) {
		return ignoreList[uid] || false;
	}
	function ignTog(uid) {
		console.log(`[pLIE v2] toggled ${uid}`);
		ignQuery(uid) ? ignDel(uid) : ignAdd(uid);
	}
	function ignShow() {
		return ignoreList;
	}
	function ignClear() {
		ignoreList = {};
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function id2uid_pack(callback) {
		return function (uid) {
			getUid(uid).then((resp) => console.log(callback(resp)));
		};
	}

	unsafeWindow.ignAdd = id2uid_pack(ignAdd);
	unsafeWindow.ignDel = id2uid_pack(ignDel);
	unsafeWindow.ignSet = id2uid_pack(ignSet);
	unsafeWindow.ignQuery = id2uid_pack(ignQuery);
	unsafeWindow.ignTog = id2uid_pack(ignTog);
	unsafeWindow.ignShow = ignShow;
	unsafeWindow.ignClear = ignClear;
})();