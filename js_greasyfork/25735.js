// ==UserScript==
// @name         Steam Gems-to-Price Helper
// @namespace    http://nota.moe/
// @version      0.5.1
// @description  处理垃圾库存的好帮手 ╰(￣▽￣)╭
// @author       NotaStudio
// @match        *://steamcommunity.com/*/inventory/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/25735/Steam%20Gems-to-Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25735/Steam%20Gems-to-Price%20Helper.meta.js
// ==/UserScript==

/* 
 * ChangeLog
 * 20170113 0.5
 * 更加完善的多国货币支持
 * 更彻底地修复了同时显示多个价格的 bug
 * 性能优化
 * 20161224 0.4
 * 添加初始设置
 * 添加手动设置货币单位功能
 * 修复了快速点击物品时同时显示多个价格的 bug
 * 降低了请求宝珠价格的频率,可能会有微弱的性能提升(或性能下降 o(≧v≦)o~~ )
 * 圣诞快乐~
 * 20161217 0.3
 * 临时修复国区价格显示为美元的 bug
 * 20161217 0.2
 * 修复价格显示为"约为 undefined NaN" 的 bug
 * 20161216 0.1-alpha
 * 初次发布
 */

/* jshint ignore:start */
 /*!
 * accounting.js v0.4.2, copyright 2014 Open Exchange Rates, MIT license, http://openexchangerates.github.io/accounting.js
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.4.1",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=c.format=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);
/* jshint ignore:end */

(function($) {
    const ver = GM_info.script.version,
        dateVer = '2017.01.13';

    console.log(`Steam Gems-to-Price Helper ${ver}\nCreated by Nota\n${dateVer}`);

    let gemsInfo = {};

    let currency = {
        "USD": 1,
        "GBP": 2,
        "EUR": 3,
        "CHF": 4,
        "RUB": 5,
        "PLN": 6,
        "BRL": 7,
        "JPY": 8,
        "NOK": 9,
        "IDR": 10,
        "MYR": 11,
        "PHP": 12,
        "SGD": 13,
        "THB": 14,
        "VND": 15,
        "KRW": 16,
        "TRY": 17,
        "UAH": 18,
        "MXN": 19,
        "CAD": 20,
        "AUD": 21,
        "NZD": 22,
        "CNY": 23,
        "INR": 24,
        "CLP": 25,
        "PEN": 26,
        "COP": 27,
        "ZAR": 28,
        "HKD": 29,
        "TWD": 30,
        "SAR": 31,
        "AED": 32
    };

    let setup = (init) => {
        let initTips = [`Steam Gems-to-Price Helper 已升级到 ${ver} 版本! 请进行初始设置.<br><br>`, `<br> 以后, 您可以随时按下 Alt+G 更改本页设置.`],
            form = `<form style="font-size: 16px;line-height: 25px;text-align: center;" class="currencyForm"><b>我的币种代码是</b><select class="sg2ph_select" style="font-weight: bold;"></select><br></form><br><br>若价格显示存在问题,请在<a href="https://greasyfork.org/zh-CN/scripts/25735-steam-gems-to-price-helper/feedback" target="_blank"> Greasy Fork </a>或<a href="http://steamcn.com/forum.php?mod=viewthread&tid=235466" target="_blank"> SteamCN </a>向我反馈.`;
        if (init) form = initTips[0] + form + initTips[1];
        ShowAlertDialog('设置 Steam Gems-to-Price Helper 币种', form);
        let nowID = GM_getValue('currencyId',23);
        for (let c in currency) {
            let opt = $(`<option value="${currency[c]}">${c}</option>`);
            if (currency[c] == nowID) opt.attr('selected', 'selected');
            opt.appendTo($('.sg2ph_select'));
        }
        let realButton = $('.newmodal:not(#market_sell_dialog) .btn_grey_white_innerfade');
        realButton.css('visibility', 'hidden');
        let overrideButton = $(`<div class="btn_green_white_innerfade btn_medium sg2ph_button"><span>确定(将会刷新页面)</span></div>`);
        overrideButton.insertAfter(realButton);
        overrideButton.on('click', (() => {
        	GM_setValue('currencyId',$('.sg2ph_select').val());
        	GM_setValue('currentVersion',ver);
            realButton.click();
            location.reload();
        })); // Steam 提供的模态窗口不支持回调函数,所以小小地 hack 了一下,用自定义的确认按钮替换掉原来的
    };

    if (GM_getValue('currentVersion') !== ver) setup(true); // 初始设置

    let parseAmount = (data) => {
    	let rawData = data.lowest_price;
    	let hasSpace = rawData.includes(' '),
    		localAmountSymbol = rawData.replace(/ |\d\.\d|\d|,/g, ''),
    		isSymbolBeforeNumber = rawData.indexOf(localAmountSymbol) === 0;
    	let symbolReplaceRule = new RegExp(localAmountSymbol.replace(/\//g,'\/').replace(/\./g,'\.')),
    		rawPrice = rawData.replace(symbolReplaceRule,'').replace(/\s/g,'');
    	let commaPos = rawPrice.indexOf(','),
    		dotPos = rawPrice.indexOf('.'),
    		decimalSeparator = (commaPos > dotPos) ? ',' : '.',
    		thousandSeparator = (decimalSeparator == ',') ? '.' : ',';
    	rawPrice = accounting.unformat(rawPrice, decimalSeparator);

    	gemsInfo = {hasSpace, localAmountSymbol, isSymbolBeforeNumber, rawPrice, decimalSeparator, thousandSeparator};

    	// 解释一下上边这些翔一样的代码是干嘛的
    	// Steam 针对不同的币种有不同的价格显示格式,如 '$0.86' '0,83€' 'CLP$ 579,17' 'Rp 11 513.27' '52,10 pуб.' 'S/.2.92' 等等等等
    	// hasSpace - 符号与数字间是否存在空格(尚不完善,使用空格做千位分隔符的币种可能会误判)
    	// localAmountSymbol - 币种符号
    	// isSymbolBeforeNumber - 符号在前还是数字在前
    	// rawPrice - 处理为纯数字的价格
    	// decimalSeparator - 小数分隔符(部分欧洲货币使用逗号作为小数分隔符)
    	// thousandSeparator - 千位分隔符(部分欧洲货币使用小数点作为千位分隔符)
    	// L111 为什么要写 .replace(/\//g,'\/').replace(/\./g,'\.') : 因为 S/. 这个货币单位里有两个正则表达式的保留字
    };

    let showValue = (xhr) => {
    	let {hasSpace, localAmountSymbol, isSymbolBeforeNumber, rawPrice, decimalSeparator, thousandSeparator} = gemsInfo,
    		gemsCount = Number.parseFloat(xhr.responseJSON.goo_value), // 获取当前物品可分解的宝珠数量
    		valueSpan = $('span.item_scrap_value:visible'),  // span.item_scrap_value 会对应两个 SPAN 元素,其中可见者则为当前宝珠价值
    		gemsValue = rawPrice / 1000 * gemsCount;
    	let accountingFormat;
    	accountingFormat = isSymbolBeforeNumber ? '%s %v' : '%v %s';
    	if (!hasSpace) accountingFormat = accountingFormat.replace(/\s/g, '');
    	gemsValue = accounting.formatMoney(gemsValue, {
    		symbol: localAmountSymbol,
    		precision: 2,
    		thousand: thousandSeparator,
    		decimal: decimalSeparator,
    		format: accountingFormat
    	}); // accounting.js 的文档: http://openexchangerates.github.io/accounting.js
        valueSpan.append($(`<span style="color: #FF0;cursor: help;" class="sg2ph_valueBox" title="价格显示错误?按 Alt+G 修改设置!">&nbsp;&nbsp;&nbsp;&nbsp;约为 ${gemsValue}</span>`));
    };

    let ajaxHandler = (event, xhr, settings) => {
        if (settings.url.match(/ajaxgetgoovalueforitemtype/)) { // Steam 会在点击某一库存物品时进行 3 次 jQuery AJAX 请求.筛选出请求宝珠数量的那一次
            $('.sg2ph_valueBox').remove();
            setTimeout((() => (showValue(xhr))), 100);
        }
    };

    let refreshPrice = () => {
        let apiUrl = `https://steamcommunity.com/market/priceoverview/?appid=753&currency=${GM_getValue('currencyId',1)}&market_hash_name=753-Sack%20of%20Gems`;
        $.get(apiUrl,((data) => parseAmount(data)));
        setTimeout(refreshPrice, 45000);
    };

    let keyHandler = (e) => {
    	if (e.keyCode == 71 && e.altKey) setup(false); // 同时按下 Alt+G
    };

    refreshPrice();
    $(document).keydown(keyHandler);
    $(document).ajaxComplete(ajaxHandler);

})(jQuery);