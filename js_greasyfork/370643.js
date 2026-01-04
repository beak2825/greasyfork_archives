// ==UserScript==
// @name         京东快捷试用脚本
// @namespace	 https://blog.cuteribs.com/
// @version      0.20
// @description  一键申请试用
// @author       cuteribs
// @match        *://try.jd.com/
// @match        *://try.jd.com/activity/getActivityList*
// @grant		 GM.xmlHttpRequest
// @icon 		 https://www.jd.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/370643/%E4%BA%AC%E4%B8%9C%E5%BF%AB%E6%8D%B7%E8%AF%95%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/370643/%E4%BA%AC%E4%B8%9C%E5%BF%AB%E6%8D%B7%E8%AF%95%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 强行转到 https
	if (location.protocol === 'http:') {
		location.assign(location.href.replace('http:', 'https:'));
	}

	// 申请试用
	const apply = itemId =>
		new Promise(resolve => {
			const url = `https://try.jd.com/migrate/apply?activityId=${itemId}&source=0`;

			$.get(url).done(res => {
				switch (res.code) {
					case '1':
					case '-114':
						resolve('已申请');
						break;
					case '-113':
						resolve('操作太快');
						break;
					case '-125':
						follow(itemId).then(r => resolve(r));
						break;
				}

				console.log(res.message);
			});
		});

	// 关注店铺并申请试用
	const follow = itemId =>
		new Promise(resolve => {
			const url = `https://try.jd.com/${itemId}.html`;

			$.get(url).done(res => {
				const $html = $(res.replace(/<img[^>]*>/g, ''));
				const vendorId = $html.find('#product-intro').attr('shop_id');

				$.get(`https://try.jd.com/migrate/follow?_s=pc&venderId=${vendorId}`).done(res2 => {
					if (res2.success) {
						apply(itemId).then(r => resolve(r));
					}
				});
			});
		});

	// 调整申请按钮
	const setItem = container => {
		const price = parseFloat(container.find('p-price > span').text().substring(1));

		if (price < 100) {
			container.find('.try-item').css('background-color: #ccc;');
		}

		const $a = container.find('a.link').remove();
		container.find('div.p-img img').wrap(`<a href="${$a.attr('href')}"></a>`);

		container
			.find('div.try-button')
			.css('cursor', 'pointer')
			.bind('click', e => {
				e.preventDefault();
				e.cancelBubble = true;
				const $button = $(e.target);
				const $item = $button.closest('li');

				if (!$item.hasClass('applied')) {
					const itemId = $item.attr('activity_id');
					apply(itemId).then(res => {
						if (res) {
							$button.text(res);

							if (res === '已申请') {
								$item.addClass('applied');
							}
						}
					});
				}
			});
	};

	setItem($('ul.clearfix'));

	const observer = new MutationObserver(records => {
		setItem($(records[0].addedNodes[0]));
	});

	const $panels = $('div.ui-switchable-panel-main div.ui-switchable-panel');

	for (let i = 0; i < $panels.length; i++) {
		observer.observe($panels[i], {
			childList: true
		});
	}
})();
