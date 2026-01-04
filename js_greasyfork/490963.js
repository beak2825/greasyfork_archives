// ==UserScript==
// @name         JD Order
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world!
// @author       You
// @match        https://shop.jd.com/jdm/trade/orders/order-list*
// @match        https://shop.jd.com/jdm/trade/order/orderList*
// @match        https://trade-order-jdm.jd.com/orderList*
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490963/JD%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/490963/JD%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

    var getlist = setInterval(start,1000);

	$('body').on('click', '.el-pager li', function() {
        getlist = setInterval(start,5000);
    })

	$('body').on('click', '.copybtn1', function() {
		var btn = $(this);
		var num = $(this).data('num')
		var list = $('.jd-pro-card-table .table-body .card');
		var order = $(list[num]);
		var order_id = order.find('.order-info-btn').text();
		var name = order.find('.cons-name-text').text();
		var mobile = order.find('.cons-mobile-phone-text').text().replace(' 虚拟号说明 ','');
		var address = order.find('.cons-address-text').text();
		var remark = order.find('.remark-cell__text').text();
		var nick = order.find('.user-pin').text()
		var shop_name = $('.shop-menu-account__right-account-top-name').text();
		var d_list = order.find('.sku-info-list__item .sku-info-card');
		var item = [];
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('.sku-name').text();
				var price = $(v).find('.sku-info-card__right .config-view-item').eq(0).text().replace('¥','');
				var num = $(v).find('.sku-info-card__right .config-view-item').eq(1).text().replace('x','');
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						price: price,
						num: num,
					}
					item.push(temp)
				}
			})
		}
		var param = {
			order_id: order_id,
			name: name,
			mobile: mobile,
			address: address,
			remark: remark,
			nick: nick,
			type: 2,
			kf: '',
			shop_name: shop_name,
			item: item,
			step: 1,
		}
		$.post('https://s.kingdom.net.cn/api/home/index/getUserInfo',param,function(res){
			if (res.code == 1) {
				btn.css('background','#87B87F');
				layer.msg(res.msg)
			} else {
				console.log(param);
				layer.msg(res.msg,{icon: 2})
			}
		})
    })

	$('body').on('click', '.copybtn2', function() {
		var btn = $(this);
		var num = $(this).data('num')
		var list = $('.jd-pro-card-table .table-body .card');
		var order = $(list[num]);
		var order_id = order.find('.order-info-btn').text();
		var name = order.find('.cons-name-text').text();
		var mobile = order.find('.cons-mobile-phone-text').text().replace(' 虚拟号说明 ','');
		var address = order.find('.cons-address-text').text();
		var remark = order.find('.remark-cell__text').text();
		var nick = order.find('.user-pin').text()
		var shop_name = $('.shop-menu-account__right-account-top-name').text();
		var d_list = order.find('.sku-info-list__item .sku-info-card');
		var item = [];
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('.sku-name').text();
				var price = $(v).find('.sku-info-card__right .config-view-item').eq(0).text().replace('¥','');
				var num = $(v).find('.sku-info-card__right .config-view-item').eq(1).text().replace('x','');
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						price: price,
						num: num,
					}
					item.push(temp)
				}
			})
		}
		var param = {
			order_id: order_id,
			name: name,
			mobile: mobile,
			address: address,
			remark: remark,
			nick: nick,
			type: 2,
			kf: '',
			shop_name: shop_name,
			item: item,
			step: 2,
		}

		$.post('https://s.kingdom.net.cn/api/home/index/getUserInfo',param,function(res){
			if (res.code == 1) {
				btn.css('background','#87B87F');
				layer.msg(res.msg)
			} else {
				layer.msg(res.msg,{icon: 2})
			}
		})
    })

	function start() {
		var list = $('.jd-pro-card-table .table-body .card');
		if (list.length > 0) {
            $.each(list,function(k,v){
                var order_id = $(v).find('.order-info-btn').text();
                $.post('https://s.kingdom.net.cn/api/home/index/searchOrderInfo',{order_no:order_id},function(res){
                    if (res.code == 1) {
                        var btn = '<span class="copybtn1" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#D15B47;padding: 3px 6px;">复制加密信息</span><span class="copybtn2" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#D15B47;padding: 3px 6px;">复制明文信息</span>';
                        if (res.data.result == 1) {
                            btn = '<span class="copybtn1" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#87B87F;padding: 3px 6px;">复制加密信息</span><span class="copybtn2" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#D15B47;padding: 3px 6px;">复制明文信息</span>';
                        } else if (res.data.result == 2) {
                            btn = '<span class="copybtn1" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#87B87F;padding: 3px 6px;">复制加密信息</span><span class="copybtn2" data-num="'+k+'" style="cursor: pointer;margin-left: 25px;color:#fff;background:#87B87F;padding: 3px 6px;">复制明文信息</span>';
                        }
                        $(v).find('.deliver-info').append(btn);
                    } else {
                        layer.msg(res.msg,{icon: 2})
                    }
                })
            })
			clearInterval(getlist);
			console.log('success');
		} else {
			console.log('loading...');
		}
	}

})();