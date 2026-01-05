// ==UserScript==
// @name         Myx Fancys News Userscripts HBC
// @namespace    huobucuo
// @version      0.4
// @description  enter something useful
// @author       You
// @match        http://www.huobucuo.com/hbc5/index.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/13384/Myx%20Fancys%20News%20Userscripts%20HBC.user.js
// @updateURL https://update.greasyfork.org/scripts/13384/Myx%20Fancys%20News%20Userscripts%20HBC.meta.js
// ==/UserScript==
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

k = {
	tr: []
};
t = {
	td: []
};
$(document).ready(function() {
	if (document.URL.match(/purchased/)) {
		$('#button-filter').after('<button type="button" id="button-day" class="btn btn-primary pull-right" style="margin-right:15px;"><i class="fa fa-search"></i> Daily</button>');
		$('#button-day').on('click', function() {
			if ($('input[name=\'filter_date_start\']').val() && $('input[name=\'filter_date_end\']').val()) {
				dates = $('input[name=\'filter_date_start\']').val();
				datee = $('input[name=\'filter_date_end\']').val();
				title = dates + '~' + datee + '销量';
				url = 'index.php?route=report/product_purchased' + document.URL.match(/&token=.*/) + '&filter_date_start=' + dates + '&filter_date_end=' + datee;
			} else {
				dates = new Date();
				dates = dates.Format('yy-MM-dd');
				datee = '';
				title = '今日销量';
				url = 'index.php?route=report/product_purchased' + document.URL.match(/&token=.*/) + '&filter_date_start=' + dates;
			}

			$.post(url, function(data) {
				$('.table tr', data).each(function() {
					$('td', $(this)).each(function() {
						t.td.push($(this).html());
					});
					k.tr.push(t);
					t = {
						td: []
					};
				});

				$('.table tr').each(function(i) {
					if (i === 0) {
						$('td:eq(1)', $(this)).after('<td class="text-right">' + title + '</td>');
						$('td:eq(3)', $(this)).after('<td class="text-right">今日小计</td>');
					} else {
						for (var j = 1; j < k.tr.length; j++) {
							if ($('td:first', $(this)).text() == k.tr[j].td[0]) {
								$('td:eq(1)', $(this)).after('<td class="text-right">' + k.tr[j].td[2] + '</td>');
								$('td:eq(3)', $(this)).after('<td class="text-right">' + k.tr[j].td[3] + '</td>');
								break;
							}
							if (j == k.tr.length - 1) {
								$('td:eq(1)', $(this)).after('<td class="text-right">0</td>');
								$('td:eq(3)', $(this)).after('<td class="text-right">0</td>');
							}
						}
					}
				});
			})
		})
	}
});

$(document).ready(function() {

	$('input[type="text"]').after('<button type="button" class="clearit close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
	$('button.clearit.close').css({
		'margin': '-35px 6px',
		'display': 'none',
		'font-size': '3rem',
		'z-index': '9999',
		'position': 'relative'

	});
	$('input[type="text"]').bind('input click', function(e) {
		if ($(e.target).val()) $($(e.target).nextAll('button')[0]).show()
	});
	//$('input[type="text"]').on(function(e){$($(e.target).nextAll('button.clearit')[0]).hide()})
	$('.clearit').bind('click', function(e) {
		$('input', $($(e.target).closest('div'))[0]).val('');
		$($(e.target).parent()).hide();
		$('input', $($(e.target).closest('div'))[0]).focus();
	});
});

function getData(url, element) {
	orderid = url.match(/id=(.*)/)[1];
	if (localStorage.getItem(orderid)) {
		value = JSON.parse(localStorage.getItem(orderid));
		$('td:eq(1)', element).after('<td>' + value.wxid + '</td><td>' + value.model + '</td><td>' + value.num + '</td>');
		$('td:eq(2)', element).on('click', function() {
			GM_setClipboard($(this).text().trim());
			//alert('已复制：' + $(this).text())
		});
	} else {
		$.ajax({
			type: 'get',
			url: url,
			success: function(data) {
				value = {
					wxid: $('#tab-order tr:eq(1) td:last', data).text().trim(), //微单号
					model: $('#tab-product tbody td:eq(1)', data).text().trim(), //产品型号
					num: $('#tab-product tbody td:eq(2)', data).text().trim() //数量
				};
				localStorage.setItem(url.match(/_id=(.*)/)[1], JSON.stringify(value));
				$('td:eq(1)', element).after('<td>' + value.wxid + '</td><td>' + value.model + '</td><td>' + value.num + '</td>');
				$('td:eq(2)', element).on('click', function() {
					GM_setClipboard($(this).text().trim());
					//alert('已复制：' + $(this).text())
				});
			}
		});
	}
}
$(document).ready(function() {
	if (document.URL.match(/sale\/order&token/)) {
		$('.table-hover thead td:eq(1)').after('<td><a>微单号</a></td><td><a>型号</a></td><td><a>数量</a></td>');
		$('.table.table-bordered tbody tr').each(function() {
				url = $('a:first', $(this)).attr('href');
				getData(url, $(this));
			})
	} else if (document.URL.match(/report\/affiliate/)) {
		$('.table-bordered.table-hover tbody td:nth-child(-n+4)').on('click', function() {
			GM_setClipboard($(this).text().replace('¥', '').trim());
			//alert('已复制：' + $(this).text().replace('¥', ''));
		});
	};
});