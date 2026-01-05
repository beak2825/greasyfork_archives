// ==UserScript==
// @name       merchant login 
// @namespace   anand
// @include     https://merchant.onlinesbi.com/merchant/*
// @include     https://retail.onlinesbi.com/retail/*
// @description csc
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26440/merchant%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/26440/merchant%20login.meta.js
// ==/UserScript==
if (document.URL.indexOf("/merchant.onlinesbi.com/merchant") > 0) {
function sblog(){
if(document.getElementsByClassName('Button1 button_class') && localStorage.log1 !==undefined && document.URL.match('merchantprelogin')){
document.quickLookForm.userName.value =localStorage.log1 ;
document.quickLookForm.password.value =localStorage.pass1;
setTimeout(function(){document.getElementsByClassName('Button1 button_class')[0].click();}, 900);}}
function sbgo(){
   if(document.getElementById('Go')){
      document.getElementById('Go').click();}}
function sbcom(){
     if(document.getElementById('confirmButton') && document.getElementById('merchantName').value == "IRCTC-RAILWAY TICKET BOOKING" && !document.getElementById('Resend')){
      document.getElementById('confirmButton').click();}}
function sbotp(){
if(document.highSecurity.securityPassword.value==""){
document.highSecurity.securityPassword.type="text";
document.highSecurity.securityPassword.style="FONT:bold 30px arial; width:5em;color:#FF0000;";
document.highSecurity.securityPassword.focus();}}
//botp();
sbcom();
sbgo();
sblog();
document.getElementsByClassName('Button1 button_class')[1].addEventListener('click', function(){
localStorage.log1 =document.quickLookForm.userName.value;
localStorage.pass1 =document.quickLookForm.password.value ;alert("UserId :"+localStorage.log1+"   Password :"+localStorage.pass1)  
});}

if (document.URL.indexOf("/retail.onlinesbi.com/retail") > 0) {
document.querySelector(".continue_btn a").click();
  if(localStorage.log1){
document.querySelector("#username").value=localStorage.log1;
document.querySelector("#username").dispatchEvent(new Event("input"));
document.querySelector("#label2").value=localStorage.pass1;
document.querySelector("#label2").dispatchEvent(new Event("input"));}
document.getElementById('reset_btn').addEventListener('click', function(){
localStorage.log1 =document.querySelector("#username").value
localStorage.pass1 =document.querySelector("#label2").value ;alert("UserId :"+localStorage.log1+"   Password :"+localStorage.pass1);  
});
}
