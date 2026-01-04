// ==UserScript==
// @name         somkingpipesMobileDIY
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello
// @author       none
// @match        https://www.smokingpipes.com/users*
// @icon         none
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/473233/somkingpipesMobileDIY.user.js
// @updateURL https://update.greasyfork.org/scripts/473233/somkingpipesMobileDIY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //===============订单号======日期========订单总额=======状态========快递单号=====商品信息第1行=====商品信息第2行=====订单详情页商品信息补充============商品数===单价=====商品合计====物流费用===发票页底部备注信息默认是总重量==========================================================================================
    var zCfgLine = '1234567----09/14/23----$123.45---- 已经发货----EMS12345678----ttttt111111----tttttt222----SKU: 008-808-0008<br>Quantity: 8----8----$18.8----$99.99----$66.66----Thanks for your order';
    //====================================================================================================================================================================================================
    var cfgInfoArr = [];

    cfgInfoArr = zCfgLine.split('----');

    if(cfgInfoArr.length>0){
            var ordNo=cfgInfoArr[0];
            var ordDate=cfgInfoArr[1];
            var ordTotal=cfgInfoArr[2];
            var ordStatus=cfgInfoArr[3];
            var ordTrack=cfgInfoArr[4];
            var ordProductName1=cfgInfoArr[5];
            var ordProductName2=cfgInfoArr[6];
            var ordProductNumberInfo=cfgInfoArr[7];
            var ordProductQty=cfgInfoArr[8];
            var ordProductPrice=cfgInfoArr[9];
            var ordProductPriceTotal=cfgInfoArr[10];
            var ordProductShippingFee=cfgInfoArr[11];
            var ordProductNote=cfgInfoArr[12];
    }

    //----------------------------------------------------------------------------------------------------
 if(location.href=='https://www.smokingpipes.com/users' || location.href=='https://www.smokingpipes.com/users/'){ //------------------/users/------
    document.body.style.visibility='hidden';
	
    var loopTimerID = setInterval(function(){

        if(document.querySelector('div.view-all')){clearInterval(loopTimerID);}else{return 0;};

            var OrdersLinkInBar = document.querySelector('#user-menu>a.view-order-history.buttonnav');
            var viewallorders = document.querySelectorAll('div.view-all');
            var trackLinks = document.querySelectorAll('span.order-tracking>a');
            var viewDivs = document.querySelectorAll('li>a>div.view');//.parentElement
            var topOrderNo = document.querySelector('div.order-detail>span.order-no');
            var topOrderDate = document.querySelector('div.order-detail>span.order-date');
            var topOrderTotal = document.querySelector('div.order-detail>span.order-total');
            var topOrderStatus = document.querySelector('div.order-detail>span.order-status');
            var topOrderTrack = trackLinks[0];

            //--page-prepareworks---
            OrdersLinkInBar.href = '/users/';
            for(let i=0;i<viewallorders.length;i++) viewallorders[i].style.visibility='hidden';
            for(let i=0;i<trackLinks.length;i++) trackLinks[i].href=viewDivs[i].parentElement.href;

            //modTop1------
            if(cfgInfoArr.length>0){

                topOrderNo.innerHTML='#'+ordNo;
                topOrderDate.innerHTML=ordDate;
                topOrderTotal.innerHTML=ordTotal;
                topOrderStatus.innerHTML=ordStatus;
                topOrderTrack.innerHTML=ordTrack;

            }

        document.body.style.visibility='visible';

    },100);
 }
//============================================DetailPage==
     if(location.href.indexOf('smokingpipes.com/users/order.cfm?order=')>-1){ //------------------/users/------
		document.body.style.visibility='hidden';

		var loopTimerID2 = setInterval(function(){

			if(document.querySelector('div.list-header')){clearInterval(loopTimerID2);}else{return 0;};

				var OrdersLinkInBar = document.querySelector('#user-menu>a.view-order-history.buttonnav');
				var detailOrderNo = document.querySelector('h1.list-title');
				var detailOrderDate = document.querySelector('table.order-details>tbody>tr:nth-child(2)>td:nth-child(2)');
				var detailOrderTotal = document.querySelector('table.order-details>tbody>tr:nth-child(3)>td:nth-child(2)');
				var detailOrderStatus = document.querySelector('table.order-details>tbody>tr:nth-child(4)>td:nth-child(2)');
				var detailOrderTrack = document.querySelector('table.order-details>tbody>tr:nth-child(5)>td:nth-child(2)'); //>a
				var detailProductName1 = document.querySelector('div.order_product>div.info>a.catname');
				var detailProductName2 = document.querySelector('div.order_product>div.info>a.prodname');
				var detailProductNumberInfo = document.querySelector('div.order_product>div.info>div.addit-details');

				//--detail-page-prepareworks---
				 OrdersLinkInBar.href = '/users/';

				//moddetail------
				if(cfgInfoArr.length>0){

					detailOrderNo.innerHTML='订单号 ' + ordNo;
					detailOrderDate.innerHTML = ordDate.substr(0,ordDate.length-2) + '20' + ordDate.substr(ordDate.length-2);
					detailOrderTotal.innerHTML=ordTotal;
					detailOrderStatus.innerHTML=ordStatus;
					detailOrderTrack.innerHTML=ordTrack;
					detailProductName1.innerHTML=ordProductName1;
					detailProductName2.innerHTML=ordProductName2;
					detailProductNumberInfo.innerHTML=ordProductNumberInfo;

				}

			document.body.style.visibility='visible';


		},100);
 }

//======================================================================================================================
       if(location.href.indexOf('smokingpipes.com/users/invoice.cfm?order_no=')>-1){ //------------------/users/------
		document.body.style.visibility='hidden';

		var loopTimerID3 = setInterval(function(){

			if(document.querySelector('div.thankyou-pagewrap')){clearInterval(loopTimerID3);}else{return 0;};

				var OrdersLinkInBar = document.querySelector('#user-menu>a.view-order-history.buttonnav');
				var invoiceOrderNo = document.querySelector('div.thankyou-orderno');
				var invoiceOrderDate = document.querySelector('div.thankyou-orderdate');
				var invoiceShipInfo = document.querySelector('div.thankyou-shippinginfo');
				var invoiceProductName1 = document.querySelector('div.thankyou-orderRowWrap>div.thankyou-itemName');
				var invoiceProductQty = document.querySelector('div.thankyou-orderRowWrap>div.thankyou-itemQty');
				var invoiceProductPrice = document.querySelector('div.thankyou-orderRowWrap>div.thankyou-itemPrice');
				var invoiceProductTotal = document.querySelector('div.thankyou-orderRowWrap>div.thankyou-itemExtendedPrice');
				var invoiceSubTotal = document.querySelector('div.thankyou-cartInnerBottomWrap>div.thankyou-paymentInforight');
				var invoiceShippingDescript = document.querySelector('div.thankyou-cartInnerBottomWrap>div:nth-child(3)');
				var invoiceShippingFee = document.querySelector('div.thankyou-cartInnerBottomWrap>div:nth-child(4)');
				var invoiceTotal = document.querySelector('div.thankyou-cartInnerBottomWrap>div:nth-child(6)');
				var invoiceCreditCard = document.querySelector('div.thankyou-cartInnerBottomWrap>div:nth-child(8)');
				var invoiceNoteInfo = document.querySelector('div.thankyou-orderNotes');


				//--invoice-page-prepareworks---
				OrdersLinkInBar.href = '/users/';

				//modinvoice------
				if(cfgInfoArr.length>0){

					invoiceOrderNo.innerHTML='Order No. ' + ordNo;
					invoiceOrderDate.innerHTML = ordDate.substr(0,ordDate.length-2) + '20' + ordDate.substr(ordDate.length-2);
					invoiceShipInfo.innerHTML ='<b>Shipped On:</b>'+ordDate.substr(0,ordDate.length-2) + '20' + ordDate.substr(ordDate.length-2)+'<br>Tracking Numbers: '+ordTrack;

					invoiceProductName1.innerHTML =ordProductName1+'<br><i>'+ordProductName2+'</i>';
					invoiceProductQty.innerHTML =' '+ ordProductQty +' ';
					invoiceProductPrice.innerHTML =' '+ ordProductPrice +' ';
					invoiceProductTotal.innerHTML = ' '+ordProductPriceTotal+' ';
					invoiceSubTotal.innerHTML = ' '+ordProductPriceTotal+' ';
					invoiceShippingDescript.innerHTML ='Shipping:';
					invoiceShippingFee.innerHTML =' '+ordProductShippingFee+' ';
					invoiceTotal.innerHTML =' '+ordTotal+' ';
					invoiceCreditCard.innerHTML =' '+ordTotal+' ';
					invoiceNoteInfo.innerHTML ='<b>'+ordProductNote+'</b>';
				}

			document.body.style.visibility='visible';


		},100);
 }

     //======================================================================
})();