// ==UserScript==
// @name         理杏仁雪球插件
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  方便用户在理性仁和雪球网站之间跳转。
// @author       chen
// @include      /^https:\/\/(xueqiu|www\.lixinger)+\.com.*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482163/%E7%90%86%E6%9D%8F%E4%BB%81%E9%9B%AA%E7%90%83%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/482163/%E7%90%86%E6%9D%8F%E4%BB%81%E9%9B%AA%E7%90%83%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/*eslint-disable*/
;
(function() {
	'use strict'

const hkStockTemplateUrl = 'https://www.lixinger.com/analytics/company/detail/hk/{stockCode}/{tickerId}'
const szStockTemplateUrl = 'https://www.lixinger.com/analytics/company/detail/sz/{stockCode}/{tickerId}'
const shStockTemplateUrl = 'https://www.lixinger.com/analytics/company/detail/sh/{stockCode}/{tickerId}'
const bjStockTemplateUrl = 'https://www.lixinger.com/analytics/company/detail/bj/{stockCode}/{tickerId}'

const szFundTemplateUrl = 'https://www.lixinger.com/analytics/fund/detail/sz/{stockCode}/{tickerId}'
const shFundTemplateUrl = 'https://www.lixinger.com/analytics/fund/detail/sh/{stockCode}/{tickerId}'

const szIndexTemplateUrl = 'https://www.lixinger.com/analytics/index/detail/sz/{stockCode}/{tickerId}'
const shIndexTemplateUrl = 'https://www.lixinger.com/analytics/index/detail/sh/{stockCode}/{tickerId}'
const csiIndexTemplateUrl = 'https://www.lixinger.com/analytics/index/detail/csi/{stockCode}/{tickerId}'

const szBondTemplateUrl = 'https://www.lixinger.com/analytics/bond/detail/sz/{stockCode}/{tickerId}'
const shBondTemplateUrl = 'https://www.lixinger.com/analytics/bond/detail/sh/{stockCode}/{tickerId}'

const regList = [
	// 港股
	/^\d{5}$/,
	// 深市股票
	/^SZ(00|01|02|20|30)\d{4}$/,
	// 沪市股票
	/^SH(600|601|603|605|688|689|900)\d{3}$/,
	// 北交所
	/^BJ(8|4)\d{5}$/,
	// 深市基金
	/^SZ(15|16)\d{4}$/,
	// 沪市基金
	/^SH5\d{5}$/,
	// 深证指数
	/^SZ39\d{4}$/,
	// 沪市指数
	/^SH000\d{3}$/,
	// 中证指数
	/^CSI(\d|H)\d{5}$/,
    // 深市可转债
	/^SZ12\d{4}$/,
	// 沪市可转债
	/^SH11\d{4}$/,
];

const urlList = [
	hkStockTemplateUrl,
	szStockTemplateUrl,
	shStockTemplateUrl,
	bjStockTemplateUrl,
	szFundTemplateUrl,
	shFundTemplateUrl,
	szIndexTemplateUrl,
	shIndexTemplateUrl,
	csiIndexTemplateUrl,
    szBondTemplateUrl,
    shBondTemplateUrl,
];

function normalizeCode(code) {
	return code && code.replace(/^(sz|sh|bj|csi)/i, '')
}

function getLixingrenStockPageUrl(code) {
	const stockCode = normalizeCode(code)
	// 美股不支持
	if (!stockCode) return ''

	for (let i = 0; i < regList.length; i++) {
		if (regList[i].test(code)) {
			return urlList[i].replace(/\{stockCode\}/g, stockCode).replace(/\{tickerId\}/g, stockCode.replace(/[a-z]+/gi, ''))
		}
	}

	return ''
}

function setHrefAttribute(el, code) {
	const url = getLixingrenStockPageUrl(code)
	if (!url) {
		console.log('不支持的证券代码：' + code)
		return
	}
	el.attr('href', url)
}

function insertAfterLxrIcon(el, code) {
	const url = getLixingrenStockPageUrl(code)
	if (!url) {
		console.log('不支持的证券代码：' + code)
		return
	};

	el.after(`<div style="float: left;margin: 0 20px">
                        <a class="lxr-icon" target="_blank">
                            <img style="width: 20px;height: 20px;vertical-align: middle"
                                src="https://www.lixinger.com/static/img/logo50x50.png"
                                style="vertical-align: middle;" />
                        </a>
                </div>`)
}

if (location.host === 'xueqiu.com') {
	/**
	 * 主页自选股跳转到理性仁
	 */
	const linkSelector = '#optional tr.sortable a.code'
	$(document.body).on('click', linkSelector, function(e) {
		var href = $(this).attr('href')
		if (href.indexOf('www.lixinger.com') > -1) {
			return
		}

		const code = href.replace('/S/', '')
		setHrefAttribute($(this), code)
	})

	/**
	 * 股票页跳转到理性仁
	 */
	const titleSelector = '#app .stock-name'

	insertAfterLxrIcon($(titleSelector).eq(0), location.pathname.replace('/S/', ''));

	$('.lxr-icon').on('mouseenter', function() {
		const code = location.pathname.replace('/S/', '')
		setHrefAttribute($(this), code)
	})

	return
}

/*
 * 理性仁相关功能
 */
if (location.host === 'www.lixinger.com') {
	setInterval(function() {
		const regex = /\/analytics\/(company|fund|index|bond)\/detail\/(sh|sz|bj|csi|hk|nasdaq|nyse|indexsp)\/(\.?\w+)\/(\d+)\/.+/;
		const result = location.pathname.match(regex);
		const linkNode = document.querySelector('.xueqiu-link');

		if (!result) {
			linkNode?.remove();
			return;
		}
		if (linkNode) {
			if (linkNode.getAttribute("stock-code") === result[3]) {
				return;
			} else {
				linkNode.remove();
			}
		}
		const nameNode = document.querySelector('div.action-group.d-flex');
		if (!nameNode) {
			return
		}
		let market = (['hk', 'nasdaq', 'nyse', 'indexsp'].includes(result[2]) ? '' : result[2]).toUpperCase();
		if(result[1] === 'index' && result[2] === 'hk'){
		    market = result[2].toUpperCase();
		}
		const code = result[3].toUpperCase();
		const xueqiuUrl = 'https://xueqiu.com/S/' + market + code
		const a = document.createElement('a')
		a.innerHTML = `<img
								src="https://assets.imedao.com/images/favicon.png"
								style="width: 1.32rem;"
							/>`;
		a.setAttribute('href', xueqiuUrl)
		a.setAttribute('target', '_blank')
		a.style.cssText = 'margin-left: 0.5rem;'
		a.setAttribute("class", "xueqiu-link");
		a.setAttribute("stock-code", result[3]);
		nameNode.append(a)
	}, 3000)
}
})()
