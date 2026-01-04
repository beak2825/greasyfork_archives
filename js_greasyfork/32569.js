// ==UserScript==
// @name         JD
// @namespace    https://twitter.com/ytzong
// @version      2019.12.2
// @author       ytzong
// @include      http*://*.jd.com/*
// @include      http*://item.jd.*/*
// @include      http*://item.jkcsjd.*/*
// @run-at       document-end
// @grant        GM_addStyle
// @description JD for ytzong
// @downloadURL https://update.greasyfork.org/scripts/32569/JD.user.js
// @updateURL https://update.greasyfork.org/scripts/32569/JD.meta.js
// ==/UserScript==

GM_addStyle('#bjd_yifenqian_detail, #right_info,.more-prom-ins,.view-all-promotions,.jdm-toolbar-footer, #id-pcprompt-mask{display:none !important}.itemInfo-wrap .summary-price-wrap .z-has-more-promotion .p-promotions-wrap,.itemInfo-wrap .summary-price-wrap .z-has-more-promotion .prom-item, .itemInfo-wrap .summary-price-wrap .z-has-more-promotion .prom-quan,.itemInfo-wrap .summary-price-wrap .z-has-more-promotion{height:auto!important;white-space: normal !important;}.itemInfo-wrap .summary-price-wrap .summary-top .z-promotions-all-show{position:static!important;}.itemInfo-wrap .summary-price-wrap .summary-top .p-promotions-wrap{padding-bottom:5px !important}.summary-service,.free_delivery_zhong{background-color:yellow}');

if (location.protocol == 'http:') {
    location.href = location.href.replace(/http\:/, 'https:');
}
var url = location.href;
var domain = window.location.hostname;
if (domain == 'pcashier.jd.com') {
    GM_addStyle('.paybox-bankCard{display:block !important}');
	//window.setInterval(YTPay, 1000);
}
if (domain == 'btmkt.jd.com') {
    GM_addStyle('body{background:none !important}');
}
/*
if (domain == 'coupon.m.jd.com' || domain == 'coupon.jd.com') {
    //$('#pcprompt-viewpc').click();
	location.href = 'https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={"activityId":"3otnUZEkGA4YVeLpTxAfef3gVJn9","from":"H5node","scene":"1","args":"key=' + getUrlParameter('key', location.search) + ',roleId=' + getUrlParameter('roleId', location.search) + '"}&client=wh5&clientVersion=1.0.0&callback=jsonp';
}
*/
if (domain == 'm.jd.com') {
    var pathnames = location.pathname.split('/');
	//if (!navigator.userAgent.includes('Mobile')) location.href = 'https://sale.jd.com/act/' + pathnames[pathnames.length - 1];
}
if (domain == 'search.jd.com') {
    window.setInterval(function () {
        $('.hd-shopname').each(function(){
            var shop = $(this).text();
            if (shop.includes('东方红大药房') || shop.includes('新兴大药房')) {
                $(this).parents('.gl-item').hide()
            }
        })
    }, 1000);
}
if (domain == 'item.m.jd.com' || domain == 're.jd.com' || domain == 're.m.jd.com') {
    var pathnames = location.pathname.split('/');
    if (!navigator.userAgent.includes('Mobile'))  location.href = 'https://item.jd.com/' + pathnames[pathnames.length - 1];
}
if (domain.includes('item.jd')) {
	//if ($('#InitCartUrl').hasClass('btn-disable')) {
    	$('#choose-btns').append('<a class="btn-special1 btn-lg" href="https://cart.jd.com/gate.action?pid=' + location.pathname.replace('/', '').replace('.html', '') + '&pcount=1&ptype=1">+ 购物车</a>').append('<a class="btn-special3 btn-lg" target="_blank" href="https://tool.manmanbuy.com/historyLowest.aspx?url=' + encodeURIComponent(location.href) + '">历史价格</a>');
	//}
}
if (domain.includes('item.jkcsjd')) {
	//if ($('#InitCartUrl').hasClass('btn-disable')) {
    	$('#choose-btns').append('<a class="btn-special1 btn-lg" href="https://med.jkcsjd.com/cart_addItem.action?pid=' + location.pathname.replace('/', '').replace('.html', '') + '&pcount=1&ptype=1">+ 购物车</a>').append('<a class="btn-special3 btn-lg" target="_blank" href="https://tool.manmanbuy.com/historyLowest.aspx?url=' + encodeURIComponent(location.href) + '">历史价格</a>');
	//}
}
if (domain == 'wq.jd.com' || domain == 'wqs.jd.com') {
    GM_addStyle('.mod_alert_v2_mask{display:none!important}.yt-quan{position:absolute;right:0;bottom:0;height:44px;width:44px;text-align:center; background-color:yellow;}');
    window.setTimeout(function () {
        $('div[data-api]').each(function(){
            var link = $(this).attr('data-api');
            var strings = link.split('?');
            if (strings.length > 1) link = '?' + strings[1];
            
            link = 'https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={"activityId":"3otnUZEkGA4YVeLpTxAfef3gVJn9","from":"H5node","scene":"1","args":"key=' + getUrlParameter('key', link) + ',roleId=' + getUrlParameter('roleid', link) + '"}&client=wh5&clientVersion=1.0.0&callback=jsonp';
            console.log(link);
            $(this).append('<a href="' + encodeURI(link) + '" target="_blank" class="yt-quan">Fuck</a>');
            $(this).css('postion', 'relative');
        })
    }, 3000);

}

function YTPay() {
	$('.ui-shortPwd-input').eq(0).val('');
	$('.ui-shortPwd-input').eq(1).val('');
	$('.ui-shortPwd-input').eq(2).val('');
	$('.ui-shortPwd-input').eq(3).val('');
	$('.ui-shortPwd-input').eq(4).val('');
	$('.ui-shortPwd-input').eq(5).val('');
	$('.p-k-check').each(function(){
		if ($(this).text().includes('工商')) {
			$(this).click();
		}
	});
}
//https://davidwalsh.name/query-string-javascript
function getUrlParameter(name, url) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
