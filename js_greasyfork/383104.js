// ==UserScript==
// @name        Shopee - Cetak Hemat 
// @namespace   Shopee
// @include     https://seller.shopee.co.id/api/v2/orders/address/pdf/*
// @include 		https://seller.shopee.co.id/api/v2/orders/waybill/*
// @description   Cetak Slip Hemat Kertas dan Tinta 
// @version     2018.10.31
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383104/Shopee%20-%20Cetak%20Hemat.user.js
// @updateURL https://update.greasyfork.org/scripts/383104/Shopee%20-%20Cetak%20Hemat.meta.js
// ==/UserScript==
var sheet = document.createElement('style')
sheet.innerHTML ='@page @media print { size: portrait; margin: 5 10; } .j-and-t-shipping-label-component .left { width: 100%;  line-height: normal;} td { font-size: 120%; color: #000; font-family: tahoma;}';
document.body.appendChild(sheet); 

var btext = "";
var JneBarcode = document.getElementsByClassName('barcode_number');
if ( JneBarcode.length > 0) {
// JNE   
  btext = document.getElementsByClassName('barcode_number')[0].textContent;
  document.getElementsByClassName('jne_logo f_left')[0].textContent=btext;
  document.getElementsByClassName('jne_logo f_left')[0].style.float='right';
  document.getElementsByClassName('jne_logo f_left')[0].style.fontSize='120%';  
  document.getElementsByClassName('jne_logo f_left')[0].style.verticalAlign= 'text-bottom';  
  document.getElementsByClassName('jne_logo f_left')[0].style.border = '1px solid #0000FF'; 

  var namatag = ['img','h1'];
  for (var a = 0; a < namatag.length; a++)
  {
    var divsToHide = document.getElementsByTagName(namatag[a]);
    for (var i = 0; i < divsToHide.length; i++)	
    { 
      if  (divsToHide[i].alt == 'barcode') { divsToHide[i].style.height = '30px'; } 
      else {   divsToHide[i].style.display = 'none'; }
    }
  }    
}  else {
// J&T  
  if ( document.getElementsByClassName('barcode-text')) { btext = document.getElementsByClassName('barcode-text')[0].textContent;}
  if ( document.getElementsByClassName('data-city-code') )
  {
  document.getElementsByClassName('data-city-code')[0].style.fontSize='150%';
  document.getElementsByClassName('data-city-code')[0].style.margin='0 0 0 10';
  document.getElementsByClassName('data-city-code')[0].textContent=btext;
  document.getElementsByClassName('header flex')[0].style.height = 'Auto';
  document.getElementsByClassName('barcode')[0].style.height = '30px';
  }
}  

var namaclass = ['logos','scissors-vertical','payment flex','note flex','sign-here','cut-line',
                 'instruction','data-source','data-cod','label','right flex flex-column','expiry-date','title','barcode_number']; //'right flex flex-column'

for (var a = 0; a < namaclass.length; a++)
{
	var divsToHide = document.getElementsByClassName(namaclass[a]);
  if ( divsToHide ) 
  {
	for (var i = 0; i < divsToHide.length; i++)	{ divsToHide[i].style.display = 'none'; }
  }  
}  

document.getElementsByClassName('data-name')[1].style.display = 'none';
var berat=document.getElementsByClassName('data-weight')[0].textContent;
var asuransi=document.getElementsByClassName('data-insurance')[0].textContent;
var biaya=document.getElementsByClassName('data-total-fee')[0].textContent;
document.getElementsByClassName('data-weight')[0].innerHTML= asuransi + '<br>';
document.getElementsByClassName('data-weight')[0].innerHTML+= biaya + '<br>';
document.getElementsByClassName('data-weight')[0].innerHTML+='Dari : DKIJAYA 089525910910';

var sheet1 = document.createElement('style')
//sheet1.innerHTML = 'body { font-size: 12px; font-family: verdana;} .page.left { padding: 1 1 1 1; border: 1px solid #000 ; } .container { margin: 10 15; } @page { size: portrait; margin: 0 0; } .content .flex { font-size: 120%; color: #000; }';
sheet1.innerHTML = 'body { font-size:1em; } .page.left { padding: 1 1 1 1; border: 1px solid #000 ; } .content .flex { font-size: 140%; color: #000; font-family: verdana; } td { font-size: 140%; color: #000; font-family: verdana; }';
document.body.appendChild(sheet1);