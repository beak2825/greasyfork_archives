	// ==UserScript==
	// @name         扇贝搜索
	// @version     2019.06.26.4
	// @description
	// @author       Aaron Liu
	// @supportURL   https://gitee.com/xiaobai-aaron/shanbeizhushousousuo
	// @license      MIT
	// @date         2019-6-25
	// @modified     2019-6-26
	// @match        *://www.shanbay.com/team/detail/34543/*
	// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
	// @run-at            document-end
	// @grant             unsafeWindow
	// @grant             GM_setClipboard
	// @grant             GM_xmlhttpRequest
	// @namespace undefined
	// @description It's a helper tool for adding search function of the posts in Shanbay
// @downloadURL https://update.greasyfork.org/scripts/386852/%E6%89%87%E8%B4%9D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/386852/%E6%89%87%E8%B4%9D%E6%90%9C%E7%B4%A2.meta.js
	// ==/UserScript==

	(function () {
		'use strict';

		const pageUrl = 'https://www.shanbay.com/api/v1/team/34543/thread/?page=';
		const pageCount = 100;
		const postBaseUrl = 'https://www.shanbay.com';
		const starredKey = 'starred';

		if ($('.seek-container').length === 0) {
			$(document.body).append(`
            <div class='seek-container'>
        <style>
            label {
                display: inline;
            }
            .seek-container {
                position: fixed;
                top: 80px;
                right: 80px;
                width: 80%;
				height: 34px;
				padding: 5px;
                background-color: #000000BB;
                color: white;
            }

            .seek-container.expend {
                height: 80%;
            }
			.seek-container input {
				height: 24px;
				margin: 0;
				font-size: 80%;
				vertical-align: middle;
			}
            .seek-container-start-page,
            .seek-container-end-page {
                width: 40px;
			}

			.seek-container-display {
				height: 95%;
			}
			.seek-container-result {
				height: 95%;
				overflow-y: auto;
			}
			.seek-container-input-author, .seek-container-input-text {
				width: 100px;
			}
			#seek-container-input-starred {
				width:20px;
				height:20px;
			}
        </style>
        <div class="seek-container-input">
            <label>搜索范围</label>
            <input type="number" class="seek-container-start-page" placeholder=1 min=1 max=499 value=1> -
            <input type="number" class="seek-container-end-page" placeholder=100 min=2 max=500 value=500>
            <label>作者：</label>
            <input type="text" class="seek-container-input-author" placeholder="【兰芷】小白">
            <label>标题：</label>
			<input type="text" class="seek-container-input-text">
			<input type="checkbox" id="seek-container-input-starred" value="starred">精华帖</input>
            <input type="button" class="seek-container-seek-button" value="搜索">
            <input type="button" class="seek-container-seek-stop-button" value="停止搜索">
			<input type="button" class="seek-container-seek-exit-button" value="退出">
			<input type="button" class="seek-container-seek-clear-button" value="清空缓存">
		</div>
		<div class="seek-container-display">
			<div class="seek-container-status"></div>
			<div class="seek-container-result">
		</div>
	</div>
    </div>
            `);
		}

		const $m = $('.seek-container-result');
		const $s = $('.seek-container-status');

		const showStatus = msg => {
			$s.text(msg);
		};

		const showMsg = (msg, level) => {
			const color = level < 10 ? 'red' : level < 20 ? 'yellow' : 'white';
			$m.append(`<div style="color:${color}">${msg}</div>`);
		};

		const showLink = (title, link) => {
			if (!isInSearch) return;

			const content = `<h4><a href="${link}" target="_blank">${title}</a></h4>`;
			showMsg(content, 30);

			$('.seek-container-result').scrollTop($('.seek-container-result')[0].scrollHeight);
		};


		const doSearch = (author, searchContent, starred, pageIndex, minPage, maxPage) => {
			const pageUrl = `https://www.shanbay.com/api/v1/team/34543/thread/?ipp=20${starred ? '&' + starredKey : ''}&page=`;
			const postBaseUrl = 'https://www.shanbay.com';

			const targetUrl = pageUrl + pageIndex;
			showStatus('get page: ' + targetUrl);

			const parseAllData = (responseText) => {
				const ret = [];
				const json = JSON.parse(responseText);
				const data = json && json.data;
				const total = data && data.total;
				const ipp = data && data.ipp;
				const objects = data && data.objects || [];

				objects.forEach((o, i) => {
					ret.push({
						title: o.title,
						author:{nickname: o.author.nickname},
						absolute_url: o.absolute_url
					});
				});

				return {
					data: {
						total,
						ipp,
						objects: ret
					}
				};
			}

			const onLoadData = (json, delayTime) => {
				const data = json && json.data;
				const total = data && data.total;
				const ipp = data && data.ipp;
				const objects = data && data.objects || [];
				objects.forEach((o, i) => {
					if (author) {
						if (o.author.nickname === author) {
							if (searchContent) {
								if (o.title.indexOf(searchContent) >= 0) {
									showLink(o.title, postBaseUrl + o.absolute_url);
								}
							} else {
								showLink(o.title, postBaseUrl + o.absolute_url);
							}
						}
					} else {
						if (searchContent) {
							if (o.title.indexOf(searchContent) >= 0) {
								showLink(o.title, postBaseUrl + o.absolute_url);
							}
						}
					}

				});

				if (pageIndex < maxPage && pageIndex * ipp < total) {
					setTimeout(() => doSearch(author, searchContent, starred, pageIndex + 1, minPage, maxPage), delayTime || 0);
				} else {
					isInSearch = false;
					showWarning('搜索结束');
					$('.seek-container-result').scrollTop($('.seek-container-result')[0].scrollHeight);
				}
			};

			if (isInSearch && pageIndex >= minPage && pageIndex <= maxPage) {
				const cache = localStorage.getItem(targetUrl);
				let data;
				if (cache) {
					data = parseAllData(cache);
					onLoadData(data);
				} else {
					GM_xmlhttpRequest({
						method: "GET",
						url: targetUrl + '&_=' + Date.now(),
						onload: function (response) {
							data = parseAllData(response.responseText);
							localStorage.setItem(targetUrl, JSON.stringify(data));
							onLoadData(data, Math.random() * 1000 * 3);
						}
					});
				}
			}

		}

		const showError = msg => showMsg(msg, 0);
		const showWarning = msg => showMsg(msg, 10);
		const showNormal = msg => showMsg(msg, 20);

		let isExpend = false;
		let isInSearch = false;
		const $c = $('.seek-container');
		$c.find('.seek-container-seek-button').on('click', () => {
			if (!isExpend) {
				isExpend = true;
				$c.addClass('expend');
			}

			if (isInSearch) {
				showWarning('请先终止当前搜索');
				return;
			}

			const minPage = Number.parseInt($c.find('.seek-container-start-page').val());
			const maxPage = Number.parseInt($c.find('.seek-container-end-page').val());

			if (minPage >= maxPage) {
				showError('起始页的值需要小于终止页的值');
				return;
			}

			const searchValue = $c.find('.seek-container-input-text').val().trim();
			const author = $c.find('.seek-container-input-author').val().trim();
			const starred = $c.find('#seek-container-input-starred')[0].checked;

			// if (!author && !searchValue) {
			// 	showError('请输入作者或者搜索内容');
			// 	$c.find('.seek-container-input-text').focus();
			// 	return;
			// }

			$m.empty();

			isInSearch = true;
			const authorValue = author || !searchValue && $c.find('.seek-container-input-author').attr('placeholder');
			doSearch(authorValue, searchValue, starred, minPage, minPage, maxPage);

		});

		$c.find('.seek-container-seek-stop-button').on('click', () => {
			if (isInSearch) {
				isInSearch = false;
				showWarning('终止搜索');

				const $seekButton = $c.find('.seek-container-seek-button');
				$seekButton.attr("disabled", true);
				setTimeout(() => {
					$seekButton.attr("disabled", false);
				}, 5000);
			}
		});

		$c.find('.seek-container-seek-exit-button').on('click', () => {
			if (isInSearch) {
				isInSearch = false;
			}

			$m.empty();
			$s.empty();

			isExpend = false;
			$c.removeClass('expend');
		});

		$c.find('.seek-container-seek-clear-button').on('click', () => {
			localStorage.clear();
		})

	})();