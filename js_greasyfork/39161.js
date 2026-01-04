// ==UserScript==
// @name         闲鱼搜索框+去首图二维码
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  还原右上搜索框, 显示宝贝标题, 清除宝贝首图二维码
// @author       cuteribs
// @match        https://2.taobao.com/*
// @match        https://s.2.taobao.com/*
// @match        https://trade.2.taobao.com/*
// @match        http://s.ershou.taobao.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://www.taobao.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/39161/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86%2B%E5%8E%BB%E9%A6%96%E5%9B%BE%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/39161/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86%2B%E5%8E%BB%E9%A6%96%E5%9B%BE%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
	$(document).ready(() => {
		// 添加搜索框
		if ($('#J_IdleHeader').length > 0) {
			let form =
				'<div class="idle-search"><form method="get" action="//s.2.taobao.com/list" name="search" target="_top"><input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="" placeholder="搜闲鱼" /><input type="hidden" name="search_type" value="item" autocomplete="off" /><input type="hidden" name="app" value="shopsearch" autocomplete="off" /><button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button></form></div>';
			$('#J_IdleHeader').append(form);
		} else if ($('div.tab-wrap').length > 0) {
			let form =
				'<div class="tab" style="margin-left: 60px; position: relative;"><form method="get" action="//s.2.taobao.com/list" name="search" target="_top"><input name="q" type="text" value="" placeholder="搜闲鱼" style="width: 150px; padding: 5px 10px; border: solid 1px; border-radius: 5px;" /><input type="hidden" name="search_type" value="item" autocomplete="off" /><input type="hidden" name="app" value="shopsearch" autocomplete="off" /></form></div>';
			$('div.tab-wrap').append(form);
			$('div.navbar-wrap').css('justify-content', 'flex-start');

			// 调整首页
			$('div.banner-wrap').height('225px');
			$('div.usercard-wrap').css('bottom', 0);
			$('div.slodbar-wrap').remove();
			$('div.pop-wrap').remove();
		}

		// 隐藏首页左下二维码
		var bodyObs = new MutationObserver(list => {
			if (list.length > 0 && list[0].addedNodes.length > 0)
				var $downloadLayer = $(list[0].addedNodes[0]).find('.download-layer');

			if ($downloadLayer.length > 0) {
				$downloadLayer.remove();
			}
		}).observe(document.body, {
			childList: true
		});

		// 显示搜索页的宝贝标题
		var appendTitle = item => {
			var $a = $(item).find('.item-pic a');

			if ($a.index('h2') == -1) {
				$a.prepend(
					`<h2 style="font-size: 1.2em; color: #333; font-weight: bold; text-decoration: none;">${$a.attr(
						'title'
					)}</h2>`
				);
			}
		};

		$('#J_ItemListsContainer .ks-waterfall').each((i, item) => appendTitle(item));
		var listContainer = document.getElementById('J_ItemListsContainer');

		if (listContainer) {
			var listObs = new MutationObserver(list => {
				for (let i = 0; i < list.length; i++) {
					if (list[i].addedNodes.length > 0) {
						appendTitle(list[i].addedNodes[0]);
					}
				}
			}).observe(listContainer, {
				childList: true
			});
		}

		// 隐藏搜索页的底部二维码
		$('#popUp-div').remove();

		// 隐藏宝贝详情页的头图二维码
		$('.mau-guide').remove();
	}).on('click', 'a', e => {
		let $a = e.target.tagName === 'A' ? $(e.target) : $(e.target).closest('a');
		let href = $a.attr('href');
		$a.attr('href', href.replace('/list.htm?', '/?'));
	}).on('submit', 'form', e => {
		let $form = e.target.tagName === 'FORM' ? $(e.target) : $(e.target).closest('form');
		let action = $form.attr('action');
		$form.attr('action', action.replace('/list.htm?', '/?'));
	});
})();
