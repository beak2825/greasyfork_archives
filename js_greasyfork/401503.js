// ==UserScript==
// @name         洛谷用户屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  qwqwq
// @author       tiger0132
// @match        https://*.luogu.com.cn/*
// @match        https://*.luogu.com.cn./*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/401503/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401503/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

with (unsafeWindow) {
	var ignoreList = GM_getValue('LuoguIgnoreList_v2', {});

	function getUid(name) { // 根据用户名反查 uid
		return new Promise((resolve, reject) => {
			$.get('/fe/api/user/search?keyword=' + name, function (resp) {
				resolve(resp.users[0].uid);
			});
		});
	}

	function injectLoadFeed() {
		console.log('[LIE v2] injectLoadFeed()');

		$('#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right > div:nth-child(4)').remove();
		$(`<div class="lg-article">
<ul class="am-nav am-nav-pills am-nav-justify" id="home-center-nav">
<li class="am-active feed-selector" data-mode="watching"><a style="cursor: pointer">我关注的</a></li>
<li class="feed-selector" data-mode="all"><a style="cursor: pointer">全网动态</a></li>
<li class="feed-selector" data-mode="my"><a style="cursor: pointer">我发布的</a></li></div>`).
			insertAfter('#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right > div:nth-child(3)');
		$(".feed-selector").click(function () {
			var mode = $(this).attr('data-mode');
			switchMode(mode);
		});

		loadFeed = () => {
			$.get('/feed/' + feedMode + '?page=' + feedPage, function (resp) {
				console.log('[LIE v2] loadFeed()');
				var l = $(resp), res;
				for (var i = 0; i < l.length; i++) { // 在获取犇犇的时候就直接过滤
					if (l[i].tagName == 'LI') {
						var uid = l[i].querySelector('div.lg-left > a').href.match(/\/user\/(\d+)/)[1];
						if (ignQuery(uid)) {
							console.log(`[LIE v2] ignored a feed from uid=${uid}`); // debug
							continue;
						}
						(function (node, uid) {
							var ignAddButton = $(`<span class="am-btn am-btn-danger am-btn-sm am-radius am-badge lg-bg-red ign-btn" data-uid="${uid}">屏蔽</span>`);
							var ignDelButton = $(`<span class="am-btn am-btn-success am-btn-sm am-radius am-badge lg-bg-green ign-btn" data-uid="${uid}">解除</span>`);
							ignAddButton.click(() => { ignAdd(uid); });
							ignDelButton.click(() => { ignDel(uid); });
							$('div.am-comment-main > header > div', node).append(ignAddButton).append('&nbsp;').append(ignDelButton);
						})(l[i], uid);
					}
					$feed.append(l[i]);
				}

				$('#feed-more').children('a').text('点击查看更多...')
				$('[name=feed-delete]').click(function () {
					$.post('/api/feed/delete/' + $(this).attr('data-feed-id'), () => {
						switchMode('all'); // TODO: 把这个改了
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
	}

	function main() { // 主函数
		console.log('[LIE v2] main()');
		if (window.location.href.match(/https:\/\/www\.luogu\.com.cn\.?/) != null) { // 主页
			console.log('[LIE v2] path: /');
			injectLoadFeed();
		}
	}
	main();

	function ignAdd(uid) {
		ignoreList[uid] = true;
		console.log(`[LIE v2] added ${uid}`);
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function ignDel(uid) {
		delete ignoreList[uid];
		console.log(`[LIE v2] deleted ${uid}`);
		GM_setValue('LuoguIgnoreList_v2', ignoreList);
	}
	function ignQuery(uid) {
		return ignoreList[uid] || false;
	}
	function ignTog(uid) {
		console.log(`[LIE v2] toggled ${uid}`);
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
	unsafeWindow.ignQuery = id2uid_pack(ignQuery);
	unsafeWindow.ignTog = id2uid_pack(ignTog);
	unsafeWindow.ignShow = ignShow;
	unsafeWindow.ignClear = ignClear;
}