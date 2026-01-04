// ==UserScript==
// @name         lavida待出貨訂單
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  lavida 待出貨訂單
// @author       You
// @match        https://www.lavida.tw/adm_PPot4F/wait_ship_order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461631/lavida%E5%BE%85%E5%87%BA%E8%B2%A8%E8%A8%82%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/461631/lavida%E5%BE%85%E5%87%BA%E8%B2%A8%E8%A8%82%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        $('button:contains("查詢")').after(`
        <button type="button" class="btn btn-sm btn-danger" style="float:right" id="getOrderList">X外掛刷單X</button>
        <form>
        <table>
        關鍵字:<input type="text" name="searchKeyword" id="searchKeyword" class="form-control" value="">
        檔期名稱:<input type="text" name="batchName" id="batchName" class="form-control" value="">
        <table/>
        <form/>
        `);
        $('th:contains("總金額|已配貨|代收金額")').append(`<span id="sortAmount">代收<i class="fa fa-sort text-muted pull-right"></i></span>`);

        $('#sortAmount').click(function(){
            $(this).find('i').removeClass('fa-sort').addClass('fa-sort-desc');
            var orderList = [];
            $('tr.order_row').each((index,ele)=>{

                var element = $(ele);
                var order = {};
                var link = element.find('a[href*="https://www.lavida.tw/adm_PPot4F/order/?action=edit"]');
                order.editUrl = link.attr('href');
                order.id = link.text().trim();
                var member = element.find('a[href*="https://www.lavida.tw/adm_PPot4F/member/"]');
                order.member = member.text().trim();

                var amount = parseInt(member.parent().next('td').next('td').html().trim().split("<br>")[0]);
                //console.log(amount);
                order.amount = amount;
                var orderItems = $(ele).next('tr');
                var items = orderItems.find('a[href*="https://www.lavida.tw/adm_PPot4F/product/"]');

                order.items = items.map(function(){return $(this).text().trim();}).get();

                order.status = element.find('td:eq(3)').text().trim();

                order.tr1=$(ele);
                order.tr2=$(ele).next('tr');
                order.tr3=$(ele).next('tr').next('tr');
                //console.log(order.tr1.html());
                //console.log(order.tr2.html());
                //console.log(order.tr3.html());
                /*
                console.log($(ele));
                console.log($(ele).next('tr'));
                */
                orderList.push(order);
            });

            orderList = orderList.sort((a,b)=>b.amount-a.amount);
            console.log(orderList);
            var tbody = $('tr.order_row').parent();
            for(var order of orderList){
                tbody.append(order.tr1);
                tbody.append(order.tr2);
                tbody.append(order.tr3);
            }


        });
        $('#getOrderList').click(function(){
            //alert("OK");
            var keyword = $('#searchKeyword').val();
            var batchName = $('#batchName').val();
            var orderList = [];
            $('tr.order_row').each((index,ele)=>{

                var element = $(ele);
                var order = {};
                var link = element.find('a[href*="https://www.lavida.tw/adm_PPot4F/order/?action=edit"]');
                order.editUrl = link.attr('href');
                order.id = link.text().trim();
                var member = element.find('a[href*="https://www.lavida.tw/adm_PPot4F/member/"]');
                order.member = member.text().trim();

                var orderItems = $(ele).next('tr');
                var items = orderItems.find('a[href*="https://www.lavida.tw/adm_PPot4F/product/"]');

                order.items = items.map(function(){return $(this).text().trim();}).get();

                order.status = element.find('td:eq(3)').text().trim();

                /*
                console.log($(ele));
                console.log($(ele).next('tr'));
                */
                orderList.push(order);
            });

            var targetOrders = {};
            for(var order of orderList){
                if(order.items.filter(x=>x.startsWith(keyword)).length>0){
                    order.batch = batchName;
                    if(targetOrders.hasOwnProperty(order.member)){
                        targetOrders[order.member].push(order);
                    }else{
                        targetOrders[order.member] = [order];
                    }
                }
            }

            var updateOrders = [];
            for(var member in targetOrders){
                console.log(member);
                console.log(targetOrders[member]);
                var count = targetOrders[member].length;
                var deliverCount = targetOrders[member].filter(x=>x.status=="可出貨").length;
                var desc = `[[${targetOrders[member][0].batch}(${count})||可出貨(${deliverCount})]]`;
                for( order of targetOrders[member]){
                    order.desc = desc;
                    updateOrders.push(order);
                }
            }

            console.log(targetOrders);
            console.log(updateOrders);


            for(var i =0;i<updateOrders.length;i++){

                var updateOrder = updateOrders[i];
                (function(updateOrder,i){
                    setTimeout(()=>{
                        window.open(`${updateOrder.editUrl}&desc=${updateOrder.desc}`);
                    },2000*(i+1));
                }(updateOrder,i)
                );
            }





        });
    },600);
    // Your code here...
})();