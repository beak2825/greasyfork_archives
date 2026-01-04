// ==UserScript==
// @name         淘宝获取商品月销售额
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  用于淘宝获取商品月销售额
// @author       codeshif
// @match        https://s.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374241/%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E6%9C%88%E9%94%80%E5%94%AE%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/374241/%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E6%9C%88%E9%94%80%E5%94%AE%E9%A2%9D.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var css = `.more-info{
    	padding: 0 10px;
    	text-align: right;
    	color:red;
    	font-size: 13px;
    }
    .month-total{
    	font-weight: bold;
    }

    .m-itemlist .grid .item{

        height: auto !important;
        padding-bottom: 10px;
    }`;

    $(`<style>${css}</style>`).appendTo('head');

    // let timer = setInterval(()=>{

    // 	if($('#mainsrp-itemlist').length > 0){
    // 		clearInterval(timer);
    // 		// insertMoreInfo();

    // 	}
    // },300);

    $.callback = function(a, b, c) {
        console.log(a, b, c)
    }

    //	自动注入淘宝搜索数量值
    $(document).on('click keyup', 'input.search-combobox-input', function() {

        let value = $(this).val();
        $.getJSON('https://suggest.taobao.com/sug?callback=?', {
            code: 'utf-8',
            q: value,
            k: 1,
            area: 'c2c',
            _ksTS: Date.now()
        }, function(data) {

            setTimeout(function() {
                data.result.forEach(function(item, index) {
                    $('.search-popupmenu-content .item-wrapper').eq(index).find('.item-count').text(item[1]);
                });
            }, 500);


        });
    });

    $(document).on('DOMNodeInserted', '#mainsrp-itemlist', function(e) {

        if (e.target.id == 'mainsrp-itemlist') {

            let element = $(e.target);
            let type = element.find('.grid').length > 0 ? 'gird' : 'list';

            insertMoreInfo(type);
        }

        // console.log(e.target);
        // if(type == 'gird'){

        // 	//	替换平铺
        // 	//	替换付款人数
        // 	let payCount = $(element).find('.deal-cnt');
        // 	payCount.text(payCount.text().replace(/人累计付款/ig,' 付款'));

        // 	let price = $(element).find('.g_price-highlight strong').text();
        // 	let count = payCount.text().match(/\d+/ig)[0];
        // 	let monthTotal = `<div class="more-info">月销量：<span class="month-total">${(price * count).toFixed(2)}元</span></div>`;
        // 	$(element).find('.row.row-2.title').before(monthTotal);
        // }else{
        // 	//	替换列表
        // 	let price = $(element).find('.g_price-highlight strong').text();
        // 	let count = $(element).find('.deal-cnt').text().match(/\d+/ig)[0];

        // 	let monthTotal = `<div class="more-info">月销：<span class="month-total">${(price * count).toFixed(2)}元</span></div>`;

        // 	$(element).find('.col-4').append(monthTotal);
        // }

    });



    function insertMoreInfo(type) {


        if (type == 'gird') {
            let detailNodes = $('.J_IconMoreNew');

            detailNodes.each((index, element) => {

                //	删除天猫
                if ($(element).find('.icon-service-tianmao').length > 0) {
                    $(element).parent().remove();
                }

                //	替换付款人数
                let payCount = $(element).find('.deal-cnt');
                payCount.text(payCount.text().replace(/人累计付款/ig, ' 付款'));

                let price = $(element).find('.g_price-highlight strong').text();
                let count = payCount.text().match(/\d+/ig)[0];
                let monthTotal = `<div class="more-info">月销量：<span class="month-total">${(price * count).toFixed(2)}元</span></div>`;
                $(element).find('.row.row-2.title').before(monthTotal);
            });
        } else {


            let listNodes = $('#mainsrp-itemlist .item');

            listNodes.each((index, element) => {

                let price = $(element).find('.g_price-highlight strong').text();
                let count = $(element).find('.deal-cnt').text().match(/\d+/ig)[0];

                let monthTotal = `<div class="more-info">月销：<span class="month-total">${(price * count).toFixed(2)}元</span></div>`;

                $(element).find('.col-4').append(monthTotal);
            });
        }
    }

})();