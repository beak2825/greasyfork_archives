// ==UserScript==
// @name       merchant login 
// @namespace   anand
// @include     https://merchant.onlinesbi.sbi/merchant/*
// @include     https://retail.onlinesbi.com/retail/*
// @description csc
// @license     navoday
// @version     5.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380591/merchant%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/380591/merchant%20login.meta.js
// ==/UserScript==
var clk = new Event("click");
cur_url=document.URL;
  if(cur_url.indexOf('merchantprelogin') > 0 )
		{
   if( cur_url.indexOf('merchantprelogin') > 0){
document.quickLookForm.userName.value ="" ;
document.quickLookForm.password.value ="";
setTimeout(function(){document.getElementsByClassName('btn btn-Yellow')[0].click();}, 900);
   }
        }           
      else
         {var subgo=document.getElementById('Go');
         if(cur_url.indexOf('loginsubmit') > -1 && subgo != null)
		{
          setTimeout(function(){document.getElementById('Go').click();}, 1000);
          }
           else
             {
              if(cur_url.indexOf('merchantinter') > -1 && document.getElementById('confirmButton') && document.getElementById('merchantName').value == "IRCTC-RAILWAY TICKET BOOKING" && !document.getElementById('Resend'))
		{
      document.highSecurity.securityPassword.type="text";
      document.highSecurity.securityPassword.style="FONT:bold 30px arial; width:8em;color:#FF0000;";
      document.highSecurity.securityPassword.focus();
          paysub();
      }}}
var pred=setInterval(paysub, 1000);
function paysub(){
 var pvalue=document.highSecurity.securityPassword.value;
 var plth=pvalue.length;
   if(cur_url.indexOf('merchantinter') > -1 && plth == "8"){
  clearInterval(pred);
  document.getElementById('confirmButton').click();
   }}
