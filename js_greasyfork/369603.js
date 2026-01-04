// ==UserScript==
// @name         North-Plus Notification
// @namespace    https://github.com/sssssssl/NP-scripts
// @version      0.1
// @description  查看自己发的主题的回复
// @author       sl
// @match        https://*.white-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.imoutolove.me/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/369603/North-Plus%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/369603/North-Plus%20Notification.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 1. CONSTANTS

	var lastPullTimeKey = 'lastPullTime';
	var unACKTimeKey = 'lastUnACKTime';
	var unACKDataKey = 'unACKData';
	var mappingKey = 'tidCommentMap';
	var uidKey = 'uid';
	// this needs to be tested.
	var pullInterval = 1000 * 60 * 2;
	var maxUnACKAge = 1000 * 60 * 1;
	var checkInterval = 1000 * 5 * 1;
	var maxRetry = 5;

	// 2. GLOBAL STATE

	var logLevels = {
		verbose: 1,
		silent: 2
	};

	var dev = false;

	var g = {
		url: window.location.href,
		stopNofitication: false,
		unInitialized: true,
		stopLoop: false,
		retry: 0,
		has_mypost_btn: false,
		checkInterval: checkInterval,
		pullInterval: pullInterval,
		logLevel : logLevels.verbose
	};

	var originalTitle = document.title;

	// 3. CODE ENTRYPOINT

	var lastPullTime = GM_getValue(lastPullTimeKey);
	// 第一次在用户机器上运行
	if (!lastPullTime) {
		getPostStatus(true);
	}

	grabUserInfo();
	addStopBlinkCallback();
	addSelfCommentCallback();
	mainLoop();

	function mainLoop() {
		app();
		setTimeout(function () {
			if (!g.stopLoop) {
				mainLoop();
			}
		}, g.checkInterval);
	}

	function app() {
		var unACKData = GM_getValue(unACKDataKey);
		if (unACKData) {
			log(['存在未合并数据', unACKData]);

			g.stopNotification = false;
			sendNotification(unACKData);

			// var lastUnACKTime = GM_getValue(unACKTimeKey);
			// var now = Date.now()
			// // 当未确认数据寿命达到允许的最大值，进行合并
			// if (lastUnACKTime && (now - lastUnACKTime) > maxUnACKAge) {
			// 	updateMapping(unACKData);
			// }
		}

		getPostStatus(false);
	}

	function getPostStatus(first = false) {

		function timeCheck() {
			var now = Date.now();
			var lastPullTime = GM_getValue(lastPullTimeKey);
			if (lastPullTime) {
				var dtime = (now - lastPullTime);
				log('距离上次拉取评论 ' + (dtime / 1000) + ' 秒');
			}
			return !(lastPullTime && dtime < g.pullInterval);
		}

		var needUpdate = timeCheck();

		if (!needUpdate) {
			g.checkInterval = g.checkInterval + 1000 * 5;
			g.checkInterval = Math.min(g.checkInterval, 1000 * 20);
			g.pullInterval = g.pullInterval + 1000 * 60 * 1;
			if (g.pullInterval > 1000 * 60 * 4) {
				g.pullInterval = pullInterval;
			}
			return;
		}
		else {
			g.checkInterval = checkInterval;
			g.pullInterval = pullInterval;
		}

		if (needUpdate) {

			var myPostURL = getPostURL(dev);

			$.ajax({
				url: myPostURL,
				type: 'GET',
				success: function (data) {

					// 调用返回后才更新 lastPullTime, 增加访问服务器的时间间隔
					GM_setValue(lastPullTimeKey, Date.now());

					var newMap = getParser(dev)(data);
					var mapping = getMapping();
					var diffInfo = compareMap(mapping, newMap);
					if (diffInfo.nNewComment > 0) {
						if (first) {
							log('首次执行.');
							updateMapping(diffInfo.diffMap);
						}
						else {
							log(['写入 unACKData:', diffInfo]);
							GM_setValue(unACKDataKey, diffInfo);
							GM_setValue(unACKTimeKey, Date.now());
							sendNotification(diffInfo);
						}
					}
					else {
						log('评论数量没有变化.');
					}
				},
				error: function (data) {
					g.retry += 1;
					if (g.retry == maxRetry) {
						g.stopLoop = true;
						console.log('网络似乎有问题，停止拉取评论');
					}
					console.log([data]);
				}
			});

		}
	}


	// 4. DATA PROCESSING

	function getPostURL(lv) {
		if (lv) {
			return 'posts';
		}
		return 'u.php?action-topic.html';
	}

	function getParser(lv) {
		if (lv) {
			return JSON.parse;
		}
		return parseData;
	}

	// 比较拉取到的评论数与本地保存的评论数的区别
	function parseData(data) {
		var dataMap = {};
		var pat = /read.php\?tid-(\d+).html.+?回复:(\d+)/g;
		var m;
		while (m = pat.exec(data)) {
			var tid = m[1];
			var num = parseInt(m[2]);
			dataMap[tid] = num;
		}
		return dataMap;
	}

	function compareMap(baseMap, newMap) {
		var diffInfo = {
			nNewComment: 0,
			diffMap: {},
		};
		for (var key in newMap) {
			diffInfo.diffMap[key] = newMap[key];
			if (!(key in baseMap)) {
				diffInfo.nNewComment += newMap[key];
			}
			else {
				diffInfo.nNewComment += newMap[key] - baseMap[key];
			}
		}
		return diffInfo;
		// debug
		if (diffInfo.nNewComment > 0) {
			log([
				'from compareMapp:',
				'有 ' + diffInfo.nNewComment + ' 条新评论.',
				diffInfo.diffMap,
			]);
		}
	}

	function mergeMap(baseMap, diffMap) {
		for (var key in diffMap) {
			baseMap[key] = diffMap[key];
		}
	}

	function getMapping() {
		var mapping = GM_getValue(mappingKey);
		if (!mapping) {
			mapping = {};
		}
		return mapping;
	}

	function updateMapping(diffMap) {
		var mapping = getMapping();
		mergeMap(mapping, diffMap);
		GM_setValue(mappingKey, mapping);
		GM_setValue(unACKDataKey, null);
		GM_setValue(unACKTimeKey, null);
		log([
			'from updateMapping',
			'写入 mapping:',
			mapping,
		]);
	}

	function grabUserInfo() {
		var uid = GM_getValue(uidKey);
		if (uid) {
			g.uid = uid;
			return;
		}
		log('try to get uid from page...');
		var userInfo = $('span.user-infoWraptwo');
		if (!userInfo) {
			log('no userinfo span, unable to get uid.');
			return;
		}
		var userData = $(userInfo).text();
		var uidPat = /UID:\s(\d+)/;
		var m = uidPat.exec(userData);
		if (m && m.length) {
			uid = m[1];
			log(`got uid: ${uid}.`);
			g.uid = uid;
			GM_setValue(uidKey, uid);
		}
	}

	// 自己发的评论不会导致回复数增加
	function addSelfCommentCallback() {
		var form = $('form[name=FORM]');
		if (!form) {
			log('no form, no worries.');
			return;
		}
		var modifyPat = /post.php\?action-modify/;
		// 编辑回复页面，不增加回复数
		if (modifyPat.test(g.url)) {
			log('modify page...');
			return;
		}
		$(form).on('submit', function () {
			var tid = $('form > input[name=tid]').attr('value');
			log(`tid: ${tid}`);
			if (!tid) {
				log('发帖页面，不是评论，无 tid');
				return;
			}
			// 评论
			var mapping = GM_getValue(mappingKey);
			if (!mapping) {
				mapping = {};
			}
			// 可能是自己刚刚发的帖子，也可能是别人的帖子
			// 给刚刚发的帖子评论就无视掉好了
			if (!(tid in mapping)) {
				log(`对 tid=${tid} 的帖子评论.`);
			}
			else {
				mapping[tid] += 1;
				GM_setValue(mappingKey, mapping);
				log('回复自己的帖子.')
			}
		});
	}


	// 5. UI

	// 给【我的主题】按钮添加停止闪烁的回调函数，每个页面只要做一次就行了
	function addStopBlinkCallback() {
		var myPostButton = $('#infobox').find('.link5')[0];
		// 有些页面没有这个按钮，不需要更新 UI。
		if (!myPostButton) {
			g.has_mypost_btn = false;
			return;
		}
		else {
			g.has_mypost_btn = true;
		}
		$(myPostButton).wrap('<span></span>');
		var span = $(myPostButton).parent()[0];
		addSpinEffect();
		// enforce event capture, disable event bubbling.
		span.addEventListener('click', function (e) {
			var unACKData = GM_getValue(unACKDataKey);
			if (unACKData) {
				updateMapping(unACKData.diffMap);
			}
			g.stopNofitication = true;
		}, true);
	}

	function addSpinEffect() {
		$('head').append('<style>#btn-my-post {' +
			'display: inline-block; font-weight:bold;' +
			'animation:myfirst 1s;animation-iteration-count:infinite;' +
			'-webkit-animation: myfirst 1s;-webkit-animation-iteration-count: infinite;}' +
			'@keyframes myfirst {' +
			'0% { transform: rotate(0deg) scale(1, 1);; }' +
			'25% { transform: rotate(15deg) scale(1.2, 1.2);; }' +
			'50% { transform: rotate(-15deg) scale(1.2, 1.2);; }' +
			'100% { transform: rotate(0deg) scale(1, 1);; }}' +
			'@-webkit-keyframes myfirst {' +
			'0% { transform: rotate(0deg) scale(1, 1);; }' +
			'25% { transform: rotate(15deg) scale(1.2, 1.2);; }' +
			'50% { transform: rotate(-15deg) scale(1.2, 1.2);; }' +
			'100% { transform: rotate(0deg) scale(1, 1);; }}' +
			'#btn-my-post > a {color:#FF0000}' +
			'</style>'
		);
	}

	function sendNotification(diffInfo) {

		if (!g.has_mypost_btn) {
			return;
		}

		log([
			'from sendNotification',
			'stopNofitication:' + g.stopNofitication,
			'unInitialized: ' + g.unInitialized,
		]);

		var nNewComment = diffInfo.nNewComment;
		if (!nNewComment) {
			return;
		}
		else if(g.nNewCommentCache && g.nNewCommentCache == nNewComment) {
			return;
		}
		else {
			g.nNewCommentCache = nNewComment;
		}

		var title_blk = `【新回复 x ${nNewComment}】${originalTitle}`;

		var title_list = [originalTitle, title_blk];
		var fw_list = ['normal', 'bold'];

		g.style = {
			title_list : title_list,
			fw_list : fw_list,
			index : 0
		};

		var myPostButton = $('#infobox').find('.link5')[0];
		$(myPostButton).text(`我的主题( ${nNewComment} 条新回复)`);

		function updateStyle(index) {
			document.title = g.style.title_list[index];
		}


		function blink() {
			setTimeout(function () {
				g.style.index = 1 - g.style.index;
				updateStyle(g.style.index);
				if (g.stopNofitication) {
					updateStyle(0);
					$('#btn-my-post').attr('id', '');
				}
				else {
					blink();
				}
			}, 1000);
		};

		if (g.unInitialized) {

			g.unInitialized = false;
			blink();

			var span = $(myPostButton).parent()[0];
			$(span).attr('id', 'btn-my-post');
		}
	}

	function log(sl, lv = g.logLevel) {
		if (lv == logLevels.verbose) {
			if (sl.constructor === Array) {
				sl.forEach(function (s) {
					console.log(s);
				});
			}
			else {
				console.log(sl);
			}
		}
	}

})();