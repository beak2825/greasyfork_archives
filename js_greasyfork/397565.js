// ==UserScript==
// @name         pm订单页增强
// @namespace    http://shenchaohuang.net/
// @version      0.1
// @description  七禾公司内部使用，严禁外泄！
// @author       沈超煌
// @match        https://poshmark.com/order/sales
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397565/pm%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/397565/pm%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

//css
GM_addStyle ( `


        #is-show-wrap{display:inline-block;font-size:18px;border:1px solid #ddd;padding:5px}

        .orders-list .item .item-pic-con .item-pic{width:150px;height:150px}

        .title,.pipe{margin-bottom:10px !important}

        .order-info{width:55%;padding-top:20px;font-size:18px}

        .order_info_ex{margin-left:25px; border-left: 1px solid #eee;padding:5px 15px}

        .status-con .status{display:inline-block;}

        .status-con .price{border-top:1px solid #eee;border-bottom:1px solid #eee;}

` );



(function() {
    'use strict';

    var items = $('.item');


    items.each(function(){


        //对订单列表处理

        var item = $(this);

        //获取订单号
        var order_href = item.attr('href');
        var order_no = order_href.split('/sales/');
        order_no = order_no[1]

        //去除链接，让其可以复制
        item.removeAttr('href');

        var size = item.find('.size');
        size.html('尺码：' + size.children('.value').text());

        item.children('.order-info').append('订单号：'+order_no)




        //右边的一些东西

        item.append('<div class="order_info_ex"></div>');

        var order_status_block = item.find('.status-con');

        var info_ex = item.children('.order_info_ex');

        info_ex.append(order_status_block);

        info_ex.append(item.find('.price'));

        info_ex.append('<div><a href="'+order_href+'" target="_blank">订单详情</a></div>');

        //info_ex.append('<a class="download-label" data-ajax-modal="true" href="/order/sales/'+order_no+'/download_shipping_label_link" target="#download-shipping-label-confirm">下载面单（测试）</a>')


        //exit;


    });

    $('h1').append('&nbsp;&nbsp;&nbsp;&nbsp;<div id="is-show-wrap">是否显示订单详情：<label><input name="isShowDetial" type="radio" value="0">否</label> <label><input name="isShowDetial" type="radio" value="1">是</label></div>');

    $('input:radio[name="isShowDetial"]').click(function(){
        var checkValue = $('input:radio[name="isShowDetial"]:checked').val();
        if(checkValue == 0){
            $('.seller').fadeOut();
            $('.order_info_ex').fadeOut();
        }else{
            $('.seller').fadeIn();
            $('.order_info_ex').fadeIn();
        }
    });


})();