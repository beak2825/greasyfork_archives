// ==UserScript==
// @exclude       *
// @author        max
// @icon https://www.taobao.com/favicon.ico
// ==UserLibrary==
// @name          淘宝天猫领券脚本
// @description   淘宝天猫领券专用库
// @copyright     max
// @license MIT

// ==/UserScript==

// ==/UserLibrary==

function max_get_json(data) {
	var n1 = data.indexOf("goodsItem");
	if (n1 < 0) return 0;
	var tmp_str = data.substr(n1);
	var n2 = tmp_str.indexOf(";");
	tmp_str=data.substr(n1+11,n2-11);

	return tmp_str;
}

function max_get_coupon(data) {
    //var html=$(data).find("ul .goods-list .clear li:first  div h3").text();
	var $html=$(data).find("ul.goods-list.clear li:first  div div.good-price");
	return $html;
}

function max_get_huodong(data) {
	var n1 = data.indexOf("huodongStr");
	if (n1 < 0) return 0;
	var tmp_str = data.substr(n1+10);
	return tmp_str;
}

function TINT(name) {
    var reTaoBao = /taobao.com/i;
    var reTmall = /tmall/i;
    var currentUrl = window.location.href;
    $('head').append($('<link rel="stylesheet" href="https://youhuicity.com/zkq4tb2.css">'));
    var h = 'https://www.youhuicity.com/?m=search&a=index&k=' + encodeURI(name);
    var init = "<div id='max-test'><div id='zkq_nr' style='position: relative;'><table class='zkq_tab' id='zkq_table'><thead><tr><th><b onclick=window.open('https://link.zhihu.com/?target=https://www.youhuicity.com') style='cursor:pointer'>\u4f18\u60e0\u5238</b></th><th>\u539f\u4ef7</th><th>\u5238\u540e\u4ef7</th><th>\u64cd\u4f5c\u261f</th></tr></thead><tbody><tr><td colspan='4'>\u6b63\u5728\u67e5\u8be2\u4f18\u60e0\u4fe1\u606f\uff0c\u8bf7\u7a0d\u5019...</td></tr></tbody></table></div></div>";
    //0110015
    $('div#root').children().eq(0).children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(1).children().eq(5).prepend(init);
	$('#J_LinkBasket').parent().parent().prepend(init);
    $('.J_LinkAdd').parent().parent().prepend(init);
    if (reTaoBao.test(currentUrl)) {
        $('#zkq_table').addClass('zkq_tab_taobao');
    } else {
        $('#zkq_table').addClass('zkq_tab_tmall');
    }
    $.get(h,
    function(d, status) {
        $("#zkq_table tbody tr").remove();
		var reTaoBao = /taobao.com/i;
		var reTmall = /tmall/i;
		var reChaoShi = /chaoshi/i;
		var currentUrl = window.location.href;
		var name='';
		if (reTaoBao.test(currentUrl)) {
		name = $('.tb-main-title').attr('data-title');
		} else if(reChaoShi.test(currentUrl)){
            name=$('div#detail h1').text();
		} else {
            name=$('div#root h1').text();
        }
        var h= 'https://www.youhuicity.com/?m=search&a=index&k=' + encodeURI(name);

		/*
		var jso=max_get_json(d);
		var s =  JSON.parse(jso);
		if (s.length >0) {
			row += "<tr><td>" + s[0].quan_jine + "元</td><td>￥" + s[0].yuanjia + "</td><td>￥" + s[0].jiage + "</td><td><a style='display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;width:100px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: red;' href='" + h +  "' target='_blank'>领取</a></td></tr>";
		} else {
        var row = "<tr><td colspan='4'>\u8fd9\u4e2a\u5546\u54c1\u6ca1\u6709\u8d85\u503c\u4f18\u60e0\u5238</td></tr>";
		}
		*/
		var coupon = max_get_coupon(d);
		if (coupon != null) {
			row += "<tr><td>" + coupon.find("span.num").text() + "元</td><td>" + coupon.find("span.price-old").text() + "</td><td>" + coupon.find("span.price-current").text() + "</td><td><img style='width:30px;height:30px' src='data:image/gif;base64,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'><a style='display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;width:100px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: red;' href='" + h +  "' target='_blank'>领取</a></td></tr>";
		} else {
			var row = "<tr><td colspan='4'>\u8fd9\u4e2a\u5546\u54c1\u6ca1\u6709\u8d85\u503c\u4f18\u60e0\u5238</td></tr>";
		}
        $("#zkq_table tbody").append(row);
		h='https://www.youhuicity.com/huodong.php?t='+Math.random();
		$.get(h,
		function(d, status) {
			var s = max_get_huodong(d);
			$("#zkq_table tbody").append(s);
		});
    });
}
(function() {
    'use strict';
    
	$.holdReady(true);
    var setTime = setTimeout(function () {
        $.holdReady(false);
    }, 2000);
    $(document).ready(function() {
        var name = ''; //$(document).attr('title');
        var host = window.location.host;
        if ($('#max-test').length <= 0) {
            if (host == 'detail.tmall.com') {
                name = $('div#root h1').text();
                TINT(name);
            } else if (host == 'item.taobao.com') {
                name = $('.tb-main-title').attr('data-title');
                TINT(name);
            } else if (host == 'detail.tmall.hk') {
                name = $('meta[name=keywords]').attr('content');
				TINT(name);
            } else if (host == 'chaoshi.detail.tmall.com') {
                name = $('input[name=title]').attr('value');
                TINT(name);
            }
        }
    });
})();