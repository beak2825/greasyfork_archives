// ==UserScript==
// @name       sbi merchant login 
// @namespace   ramsbi
// @include     https://merchant.onlinesbi.sbi/merchant/*
// @include     https://retail.onlinesbi.com/retail/*
// @description csc
// @version     4.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396312/sbi%20merchant%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/396312/sbi%20merchant%20login.meta.js
// ==/UserScript==
var clk = new Event("click");
cur_url=document.URL;
  if(cur_url.indexOf('merchantprelogin') > 0 )
		{
   if(document.getElementsByClassName('btn btn-Yellow ') && localStorage.log1 !==undefined && cur_url.indexOf('merchantprelogin') > 0){
document.quickLookForm.userName.value =localStorage.log1 ;
document.quickLookForm.password.value =localStorage.pass1;
setTimeout(function(){document.getElementsByClassName('btn btn-Yellow')[0].click();}, 900);
   }
          else
            {
document.getElementsByClassName('btn btn-Yellow')[1].addEventListener('click', function(){
localStorage.log1 =document.quickLookForm.userName.value;
localStorage.pass1 =document.quickLookForm.password.value ;
alert("UserId :"+localStorage.log1+"   Password :"+localStorage.pass1);
});   
              alert("Fill UserId && Password Then Click Reset Button");
            }
        }           
      else
         {var subgo=document.getElementById('Go');
         if(cur_url.indexOf('loginsubmit') > -1 && subgo != null)
		{
     document.getElementById('Go').click();
      }
           else
             {
              if(cur_url.indexOf('merchantinter') > -1 && document.getElementById('confirmButton') && document.getElementById('merchantName').value == "IRCTC-RAILWAY TICKET BOOKING" && !document.getElementById('Resend'))
		{
      document.getElementById('confirmButton').click();
      }
               else
                 {
                 if(cur_url.indexOf('smsenablehighsecurity') > -1 && document.highSecurity.securityPassword.value=="")
		{ 
document.highSecurity.securityPassword.type="text";
document.highSecurity.securityPassword.style="FONT:bold 25px arial; width:5em;color:#FF0000;";
document.highSecurity.securityPassword.focus();
          paysub();
        } 
        }                 
     }}
var pred=setInterval(paysub, 1000);
function paysub(){
 var pvalue=document.highSecurity.securityPassword.value;
 var plth=pvalue.length;
   if(cur_url.indexOf('smsenablehighsecurity') > -1 && plth == "8"){
  clearInterval(pred);
  document.getElementById('confirmButton').click();
   }}
