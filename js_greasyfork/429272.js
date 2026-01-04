// ==UserScript==
// @name         Aliexpress order history extrator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts AliExpress orders history into a CSV file
// @author       Enfeet
// @match        https://trade.aliexpress.com/orderList.htm*
// @match        https://trade.aliexpress.com/order_list.htm*
// @icon         https://www.aliexpress.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429272/Aliexpress%20order%20history%20extrator.user.js
// @updateURL https://update.greasyfork.org/scripts/429272/Aliexpress%20order%20history%20extrator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var orderlist="OrderID;OrderDate;ProductTitle;ProductAmount;ProductProperty;Action;StoreName;TotalPrice;Status;URL<br>\n";
    var csrftoken = '';
    var nextPage=2;
    function parsePage(doc){
        var orders=doc.getElementsByClassName('order-item-wraper '),orders_length=orders.length;
        for (var i = 0, l1 = orders_length; i < l1; i++) {
            console.log("item "+i);
            var OrderID= orders[i].getElementsByClassName("order-info")[0].getElementsByClassName("first-row")[0].getElementsByClassName("info-body")[0].outerText;
            orderlist+=
            OrderID+";"+//OrderID
            orders[i].getElementsByClassName("order-info")[0].getElementsByClassName("second-row")[0].getElementsByClassName("info-body")[0].outerText+";;;;;"+//OrderDate+ProductTitle[2]+ProductAmount[2]+ProductProperty(optional)[2]+Action[2]
            orders[i].getElementsByClassName("store-info")[0].getElementsByClassName("info-body")[0].outerText+";"+//Store Name
            orders[i].getElementsByClassName("amount-num")[0].outerText+";"+//TotalPrice
            orders[i].getElementsByClassName("f-left")[0].outerText+";<br>\n"; //Status
            var orderBody=orders[i].getElementsByClassName("order-body"),orderBody_lenght=orderBody.length;
            for (var j = 0, l2 = orderBody_lenght; j < l2; j++) {
                //console.log("j="+j);
                var ProductProperty=orderBody[j].getElementsByClassName("product-property")[0].getElementsByClassName("val")[0]
                orderlist+=
                OrderID+";;"+//OrderID+OrderDate[1]
                orderBody[j].getElementsByClassName("product-title")[0].getElementsByClassName("baobei-name")[0].outerText.replaceAll(';', ' ')+";"+//ProductTitle
                orderBody[j].getElementsByClassName("product-amount")[0].outerText+";"+//ProductAmount
                ((typeof ProductProperty != 'undefined')?ProductProperty.outerText:"")+";"+//ProductProperty(optional)
                orderBody[j].getElementsByClassName("product-action")[0].outerText+";;;;"+ //Action
                orderBody[j].getElementsByClassName("product-title")[0].getElementsByClassName("baobei-name")[0].href+"<br>\n"; //href
            }
        }
        var tags=doc.getElementsByTagName('input');
        for (var k = 0; k < tags.length; k++)
        {
            if (tags[k].name.startsWith('_csrf_token'))
            {
                csrftoken=tags[k].value;
                break;
            }
        }
    }
    console.log("==== page 1");
    parsePage(document);

    var page_request = new XMLHttpRequest();
    function GetNextPage(){
        var parameters = "_csrf_token="+csrftoken+"&_fm.o._0.s=&action=OrderListAction&_fm.o._0.e=&_fm.o._0.c=&_fm.o._0.l=&_fm.o._0.or=&_fm.o._0.p=&_fm.o._0.o=&pageNum="+nextPage+"&_fm.o._0.cu="+(nextPage-1)+"&sortKey=&eventSubmitDoPage=doPage&pageSize=10&aliexpress.com=rootDomain";
        page_request.open('POST', 'orderList.htm?rand='+Math.random(), true);
        page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        page_request.send(parameters);
    }
    page_request.onreadystatechange = function(){
        if (page_request.readyState == 4 && page_request.status == 200){
            //document.body.innerHTML=page_request.responseText;
            var div = window.document.createElement('div');
            div.innerHTML = page_request.responseText;
            console.log("==== page "+nextPage);
            parsePage(div);
            var lastpage = (typeof div.getElementsByClassName('ui-pagination-next ui-pagination-disabled')[0] != 'undefined');
            console.log("lastpage="+lastpage);
            if (lastpage){
                console.log("!!!FINISHED!!!");
                document.body.innerHTML=orderlist;
                return;
            }
            div=null;
            nextPage++;
            GetNextPage();
        }else{
            console.log("page_request.readyState="+page_request.readyState+" page_request.status="+page_request.status);
        }
    };
    GetNextPage();

})();