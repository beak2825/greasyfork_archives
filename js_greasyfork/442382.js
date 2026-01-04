// ==UserScript==
// @name            Free drops from dropz.xyz
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     free roller for dropz.xyz
// @author          elmer76
// @license         MIT
// @description	    coin
// @include	    https://my.dropz.xyz/site-friends
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/442382/Free%20drops%20from%20dropzxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/442382/Free%20drops%20from%20dropzxyz.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://freecrypto.site/769744                                                                         |
==================================================================================================================================================
*/

var autoClick = true;
var autoScroll = true;
var autoWithdraw = true;
var minpay=800;
var useFetch = true;
var idButton = '';
var countSubmitCaptcha =0;
var countCaptcha = 0;
var openNewWindow = false;
var timeWaitNextAd = 1000;

var countSameTitle = 0;
var lastTitle = '';
var checkSameTitle = true;
var MAX_SAME_TITLE = 60;

function reloadWindow(){
	setTimeout(function(){window.location=window.location;},timeWaitNextAd);
}
setInterval(function(){
    if(document.getElementsByName('h-captcha-response').length > 0){
		var captchaResponse = document.getElementsByName('h-captcha-response')[0].value;
        if(captchaResponse != '') {
			document.title='Dropz submit captcha ';
			
			
			$.post("/api/ex/solve-captcha.php",	{	"h-captcha-response" : captchaResponse,	},function(data,status){	
				console.log('success', data);
			})  .done(function() {
				console.log( "second success" );
			  })
			  .fail(function() {
				console.log( "error" );
			  })
			  .always(function() {
				console.log( "finished" );
				document.getElementsByName('h-captcha-response')[0].value = '';
				reloadWindow();
			  });;
			// if(document.getElementsByClassName('btn btn-info btn-sm mt-3 mb-4').length > 0)
				// document.getElementsByClassName('btn btn-info btn-sm mt-3 mb-4')[0].click();

            
        }else{
			
			document.title='Dropz captcha ';
		}
    }else{
        if(document.getElementsByClassName('btn btn-info btn-sm mt-3 mb-4').length > 0){
            if(autoClick)
            {
                var buttonSubmit = document.getElementsByClassName('btn btn-info btn-sm mt-3 mb-4')[0];
                if(buttonSubmit.innerText.indexOf('Website') >-1 ){
					var curIdButton = buttonSubmit.getAttribute('id')+ buttonSubmit.innerText;
					if(curIdButton != idButton  || buttonSubmit.innerText == 'Visit Website'){
						var fclick = buttonSubmit.getAttribute('onclick');
						if(fclick.indexOf(';') >-1) {
							buttonSubmit.setAttribute('onclick', fclick.split(';')[1]);
						}
						
						 var ref = '';
						 try{
							 ref = eval(buttonSubmit.id).toString().split('ref=')[1].split('"')[0];
						 }catch(e){
							 
						 }
						 if(!openNewWindow){
							 openNewWindow = true;
							 document.title='Dropz Please wait ' + document.getElementById('pts_lbl').innerText;
							 if(useFetch){
								 var urlFetch = 'redir/index.php?ref=' + ref;
							
								 fetch(urlFetch).then(()=>{
									 reloadWindow();
								 }).catch(()=>{
									 reloadWindow();
								 });
							 }else{
								 window.open('redir/index.php?ref=' + ref, '_blank');
								 reloadWindow();
							 }
							 if(autoWithdraw){
								 if(document.getElementById('balance_lbl')){
									 var bl = document.getElementById('balance_lbl').innerText.split('.')[0].replace(',','');
									 if(bl>minpay){
										 fetch('https://my.dropz.xyz/api/ex/payout.php',{method:'POST'}).then(()=>{
										 }).catch(()=>{
										 });
									 }
								 }
							 }
						 }
						//buttonSubmit.click();
						idButton = curIdButton;
					}
                }
            }
        }
    }
},5000);

setInterval(function(){
    if(autoScroll){
        if(document.getElementsByClassName('btn btn-info btn-sm mt-3 mb-4').length > 0){
            document.getElementsByClassName('horizontal-menu')[0].style.display='none';
            document.getElementById('payout').scrollIntoView();
        }
    }
}
,2000);

setInterval(function(){
	if(document.title === 'Dropz captcha ') return;
	if(checkSameTitle){
		var currentTitle = document.title;
		if(lastTitle == currentTitle){
			countSameTitle++;
			console.log('sameTitle',countSameTitle);
			if(countSameTitle > MAX_SAME_TITLE){
				countSameTitle = 0;
				reloadWindow();
			}
		}else{
			countSameTitle = 0;
			lastTitle = currentTitle;
		}
	}
},5000);
