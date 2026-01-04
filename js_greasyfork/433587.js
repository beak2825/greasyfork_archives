// ==UserScript==
// @name         港任 eShop 网页显示折扣比例
// @namespace    http://www.mapaler.com/
// @version      1.3.4
// @description  任天堂香港 eShop 网页直接显示优惠活动折扣比例
// @author       Mapaler <mapaler@163.com>
// @license      MIT
// @include      *://store.nintendo.com.hk/*
// @resource     icon https://ec.nintendo.com/c/svg/images.svg
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/433587/%E6%B8%AF%E4%BB%BB%20eShop%20%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E6%8A%98%E6%89%A3%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433587/%E6%B8%AF%E4%BB%BB%20eShop%20%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E6%8A%98%E6%89%A3%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const isEShop = /^\/digital\-games\b/i.test(location.pathname); //判断当前是不是eshop
	const svgNS = "http://www.w3.org/2000/svg"; //svg用的命名空间
	const cssText = `
.price-rmb {
	font-size: 20px;
	font-weight: 700;
	color: #f77;
	white-space: nowrap;
}
.price-off {
	font: inherit;
	background-color: #e60012;
	color: #fff;
	border-radius: 2px;
	padding: 2px 4px 1px;
	font-size: 12px;
	display: inline-block;
	font-weight: 400;
}
.hide {
	display: none;
	aria-hidden:true;
	position:absolute;
	width:0;
	height:0;
	overflow:hidden;
}
.coin {
	width: 18px;
	height: 18px;
	vertical-align: text-bottom;
	margin-right: 8px;
}
.gp-getpoint {
	color: orange;
	display: inline-block;
}

`;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(cssText));
	document.head.appendChild(style);

	//创建svg图标引用的svg
	function svgIcon(id) {
		const svg = document.createElementNS(svgNS,'svg');
		svg.setAttribute("class","coin");
		svg.setAttribute("aria-hidden","true");
		//svg.setAttribute('xmlns',svgNS);
		const use = document.createElementNS(svgNS,'use');
		use.setAttribute("href",`#${id}`);
		svg.appendChild(use);
		return svg;
	}
	//插入总svg
	const svgText = GM_getResourceText("icon"); //将svg文本读取出来
	const parser = new DOMParser();
	const iconsSvg = parser.parseFromString(svgText, "image/svg+xml"); //转换成svg文档
	document.body.insertAdjacentElement("afterbegin", iconsSvg.documentElement); //插入body

	//获取汇率
	const priceConfigName = "eshopHK-price";
	const showCoinConfigName = "show-coin";
	let priceHKD2RMB = Number(GM_getValue(priceConfigName)) || null;
	let showCoin = Boolean(GM_getValue(showCoinConfigName)) || false;

	//获取所有商品
	const priceBoxs = document.body.querySelectorAll('.price-box');
	for (const priceBox of priceBoxs) {
		const infoDiv = document.createElement('div'); //显示打折和点数的div
		//显示折扣比例
		const specialPrice = priceBox.querySelector(':scope>.special-price');
		const oldPrice = priceBox.querySelector(':scope>.old-price');
		let sellPrice = null; //实际卖价
		let getGpPrice = null; //获得金币的价格
		if (specialPrice && oldPrice) {
			const special = Number(specialPrice.querySelector('.price-wrapper').dataset.priceAmount);
			const old = Number(oldPrice.querySelector('.price-wrapper').dataset.priceAmount);
			sellPrice = special;
			getGpPrice = isEShop ? special : old; //是eShop则给当前价格，是store则给原价。
			const off = (old - special) / old;
			const offLabel = document.createElement('div');
			offLabel.className = 'price-off';
			offLabel.textContent = `减${Math.floor(off * 100)}%`;
			infoDiv.appendChild(offLabel);
		} else {
			getGpPrice = Number(priceBox.querySelector('.price-wrapper').dataset.priceAmount);
			sellPrice = getGpPrice;
		}

		//有实际卖价时才做处理
		if (sellPrice > 0) {
			//显示黄金点数
			if (showCoin) {
				const coinDiv = document.createElement('div');
				coinDiv.className = "gp-getpoint";
				coinDiv.appendChild(svgIcon("gold-point-coin")); //添加金币SVG
				const gpSpan = coinDiv.appendChild(document.createElement('span'));
				gpSpan.appendChild(document.createTextNode(Math.ceil(getGpPrice * 0.5))); //添加点数数字
				infoDiv.appendChild(coinDiv);
			}
	
			priceBox.appendChild(infoDiv);

			if (priceHKD2RMB) { //如果有汇率就计算并显示
				const rmb = sellPrice * priceHKD2RMB / 100;
				const rmbLabel = document.createElement('span');
				rmbLabel.className = 'price-rmb';
				rmbLabel.textContent = `￥ ${rmb.toFixed(2)}`;
				priceBox.appendChild(rmbLabel);
			}
		}
	}
	
	GM_registerMenuCommand("显示 人民币 换算", ()=>{
		let newPrice = Number(prompt("设定 每百港币-人民币元 汇率，设定新值后请手动刷新页面。\n（如：2022年10月16日大约为 100港币-90.56人民币，此处填 90.56）", priceHKD2RMB || ''));
		if (newPrice && !Number.isNaN(newPrice)) {
			priceHKD2RMB = newPrice;
			GM_setValue(priceConfigName , newPrice);
		} else {
			priceHKD2RMB = null;
			GM_deleteValue(priceConfigName);
		}
	});
	GM_registerMenuCommand("显示 黄金点数", ()=>{
		showCoin = Number(confirm("是否显示黄金点数？\n任天堂官方宣布，自2025年3月25日12:30起，将全面停止发放 My Nintendo 黄金点数（包括实体版 & 数字版游戏）。"));
		if (showCoin) {
			GM_setValue(showCoinConfigName , showCoin);
		} else {
			GM_deleteValue(showCoinConfigName);
		}
	});
})();