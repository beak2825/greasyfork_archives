// ==UserScript==
// @name        Tourplan NX permanently open the side menu
// @namespace   english
// @description      Tourplan NX permanently open the side menu 2
// @include     http*://*tourplan.net*
// @version     1.15
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495215/Tourplan%20NX%20permanently%20open%20the%20side%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/495215/Tourplan%20NX%20permanently%20open%20the%20side%20menu.meta.js
// ==/UserScript==

// Main - CSS added to header 
/*
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                     ';
document.getElementsByTagName('head')[0].appendChild(style);
*/













function loadclassestpnx(x){
	/*
var li = document.getElementById(x);
if( (li.className == "") || (li.className == 0) || (li.className == null) ){
   document.getElementById(x).classList.add("tpnavopen");
   document.getElementById(x).classList.add("tpnavpinned"); }

var oInput = li,
		oChild;
for(i = 0; i < oInput.childNodes.length; i++){
	oChild = oInput.childNodes[i];

		if( oChild.className == 'nav-head' ){
			oChild.click();
		}
		
	
}
*/

var targetDiv = document.getElementById(x).getElementsByClassName("nav-head")[0];

targetDiv.click();

var targetDiv2 = document.getElementById(x).getElementsByClassName("pin")[0];
targetDiv2.click();

}


function tpnxinitpukka(){

if(document.getElementById('homeview')){
loadclassestpnx('homeview'); }
if(document.getElementById('fastbookview')){
loadclassestpnx('fastbookview'); }
if(document.getElementById('debtorview')){
loadclassestpnx('debtorview'); }
if(document.getElementById('reportsview')){
loadclassestpnx('reportsview'); }
if(document.getElementById('codemaintview')){
loadclassestpnx('codemaintview'); }
if(document.getElementById('securityview')){
loadclassestpnx('securityview'); }
if(document.getElementById('groupbookview')){
loadclassestpnx('groupbookview'); }
if(document.getElementById('pcmview')){
loadclassestpnx('pcmview'); }
if(document.getElementById('operationsview')){
loadclassestpnx('operationsview'); }
if(document.getElementById('paxcrmview')){
loadclassestpnx('paxcrmview'); }
if(document.getElementById('creditorview')){
loadclassestpnx('creditorview'); }
if(document.getElementById('accountingview')){
loadclassestpnx('accountingview'); }
if(document.getElementById('productview')){
loadclassestpnx('productview'); }
if(document.getElementById('pcmview')){
loadclassestpnx('pcmview'); }





}

 
 
 
 setTimeout(() => { tpnxinitpukka(); }, 888);