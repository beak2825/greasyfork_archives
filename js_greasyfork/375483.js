'use strict';

// ==UserScript==
// @name              PC闲鱼过滤器-屏蔽职业二手商家、骗子、收购
// @namespace         http://space.bilibili.com/13127303/2.taobao
// @version           1.0.3
// @description       识别并屏蔽PC闲鱼上出现的大量职业二手贩子、商家、骗子、收购，识别出真正的二手卖家，降低筛选成本
// @author            阿布垃机手册
// @supportURL        http://space.bilibili.com/13127303
// @match             http*://*.2.taobao.com/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/375483/PC%E9%97%B2%E9%B1%BC%E8%BF%87%E6%BB%A4%E5%99%A8-%E5%B1%8F%E8%94%BD%E8%81%8C%E4%B8%9A%E4%BA%8C%E6%89%8B%E5%95%86%E5%AE%B6%E3%80%81%E9%AA%97%E5%AD%90%E3%80%81%E6%94%B6%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/375483/PC%E9%97%B2%E9%B1%BC%E8%BF%87%E6%BB%A4%E5%99%A8-%E5%B1%8F%E8%94%BD%E8%81%8C%E4%B8%9A%E4%BA%8C%E6%89%8B%E5%95%86%E5%AE%B6%E3%80%81%E9%AA%97%E5%AD%90%E3%80%81%E6%94%B6%E8%B4%AD.meta.js
// ==/UserScript==

var pageStyles = '\n.item-info-wrapper.band{\n    height: 50px;\n    overflow: hidden;\n    min-height: 0;\n    opacity: .2;\n}\n.item-info-wrapper.warn{\n    border: solid 2px red;\n}\n\n.jquery-ready .search-filters-container{\n\tbackground-color: lightgreen;\n}\n';

var $ = jQuery;
var nicks = (window.localStorage.nicks || '').split(';');

function inBlacklist(nick) {
	return nicks.includes(nick);
}

function extractNick(url) {
	return url.split('?')[1].match(/usernick=([^&]*)/)[1];
}

function hideBlacklist() {
	$('.item-info-wrapper').each(function (i, e) {
		var href = $('a.seller-nick-name', e).attr('href');
		var nickname = extractNick(href);

		if (inBlacklist(nickname)) {
			$(e).addClass('band');
		}

		var keys = ['求购', '回收', '收', '现货', '售价', '新品'];
		var title = $('h4.item-title a', e).text();
		var desc = $('div.item-description', e).text();
		if (keys.some(function (t) {
			return title.includes(t);
		}) || keys.some(function (t) {
			return desc.includes(t);
		})) {
			$(e).addClass('warn');
		}
	});
}

function unique(a) {
	return a.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
}

var checkJquery = setInterval(function (_) {
	if ($) {
		clearInterval(checkJquery);

		var styleElem = $('<style>');
		styleElem.text(pageStyles);
		$(document.body).append(styleElem);
		$(document.body).addClass('jquery-ready');

		hideBlacklist();
		var i = 0;
		var check = setInterval(function (_) {
			i += 1;
			hideBlacklist();
			if (i > 2) {
				clearInterval(check);
			}
		}, 1000);

		$(document.body).on('click', 'div.seller-nick', function (e) {
			if (e.shiftKey) {
				var nick = extractNick($('a.seller-nick-name', e.currentTarget).attr('href'));
				var nickRead = $('span.ww-light.ww-small', e.currentTarget).data('nick');

				if (confirm('\u6DFB\u52A0 ' + nickRead + ' \u5230\u9ED1\u540D\u5355\uFF1F')) {
					e.preventDefault();
					nicks.push(nick);
					window.localStorage.nicks = unique(nicks).join(';');
					hideBlacklist();
				}
			}
		});
	}
}, 1000);