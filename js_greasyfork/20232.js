// ==UserScript==
// @name        CK SBI BANK
// @namespace   anand
// @include     https://retail.onlinesbi.com/retail/*
// @include     https://merchant.onlinesbi.com/merchant/*
// @include     https://www.onlinesbi.com/merchant/*
// @run-at document-end
// @description NCOMPUTER 9794115696
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/20232/CK%20SBI%20BANK.user.js
// @updateURL https://update.greasyfork.org/scripts/20232/CK%20SBI%20BANK.meta.js
// ==/UserScript==
if(document.getElementById("username")){
document.quickLookForm.userName.value =''
document.quickLookForm.password.value =''
document.quickLookForm.Button2.click();}
else {if(document.getElementsByName('Submit')){
   // document.getElementsByName('Submit')[0].click();
}}