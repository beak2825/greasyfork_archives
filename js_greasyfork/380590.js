// ==UserScript==
// @author https://greasyfork.org/en/scripts/30089/versions/new
// @name irctc fill data
// @namespace irctcbooking
// @grant none
// @include     https://www.irctc.co.in/**
// @description contect me butter knowedge
// @version 17.5
// @license navoday
// @downloadURL https://update.greasyfork.org/scripts/380590/irctc%20fill%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/380590/irctc%20fill%20data.meta.js
// ==/UserScript==
var clk = new Event("click");
var onclk = new Event("onclick");
var ipt = new Event("input");
var foc = new Event("focus");
var kup = new Event("keyup");
var kep = new Event("keypress");
var blr = new Event("blur");
var kdwn  = new Event("keydown");
var chg = new Event("change");
var ochg = new Event("onchange");
var ofoc = new Event("onfocus");
var cos = new Event("compositionstart");
var coe = new Event("compositionend");
var moe = new Event("mouseenter");
var mol = new Event("mouseleave");
var mod = new Event("mousedown");
b=0;p=0;ca=0;s=0;
setInterval(function (){main();}, 500);
//main line start
function main(){ 

cur_url=document.location.href;
  if(cur_url.indexOf('train-search') > -1){ 
  adv=document.querySelectorAll('.text-center button.btn-primary')[0];
 if(adv != null && ca==0){
 adv.dispatchEvent(clk);adv.click();ca=1;}
   fillJryDetails();loginfill();
}else{
  if(cur_url.indexOf('train-list') > -1){ 
    //trainselect();
}else{
if(cur_url.indexOf('psgninput') > -1){ 
  pass();
}else{
  if(cur_url.indexOf('reviewBooking') > -1){  
    rivew();
}else{
  if(cur_url.indexOf('bkgPaymentOptions') > -1){ 
  btype=document.querySelectorAll('#pay-type div');// select banking option
 ptype=document.querySelectorAll('app-bank .border-all');//select bank
 if(btype != null && b==0)
    { 
   sel_bank();
    }
   if(ptype != null && b==1 && p==0)
    { 
    bank();
    }
    if(b==1 && p==1 && s==0){
var subm=document.querySelectorAll('app-payment button.btn-primary')[0];//pay submit
var fair=document.querySelectorAll('app-fare-summary div.top-header span.pull-right')[0];//pay submit
     d_fair=fair.innerText;
      subm.innerText=localStorage.seat+"Fair :"+ d_fair; }
}}}
}}}

function sel_bank(){
   btype=document.querySelectorAll('#pay-type div');// select banking option
 ptype=document.querySelectorAll('app-bank .border-all');//select bank
type_pay=document.querySelectorAll('#pay-type div span.col-pad');
  var btype_sel="Netbanking";
  if(btype.length > 0)
     {
     type_pay_lenth=btype.length;
     
     for (i=0; i<type_pay_lenth ; i++)
    { if(type_pay[i].innerText.indexOf(btype_sel) > -1)
    {
      b=1;p=0; btype[i].dispatchEvent(clk);
    }}}
}
function bank(){
  ptype=document.querySelectorAll('app-bank .border-all');
  bank=document.querySelectorAll('app-bank .border-all div.bank-text span.col-pad');
     var bank_sel="State Bank of India";     
			if (ptype.length > 0)
			{
				bank_len=ptype.length;
				for ( i=0; i<bank_len ; i++ )
				{
					if (bank[i].innerText.indexOf(bank_sel) > -1)
					{	p=1;		
           ptype[i].dispatchEvent(clk);  //select bank
            ptype[i].dispatchEvent(kdwn);
					}}}
  
}

function rivew(){
     b=0;
    p=0;
    s=0;
    var avb=document.querySelectorAll('app-train-header div.text-center')[0];
    var ava=avb.innerText;
    localStorage.seat=ava;
  if(document.querySelectorAll('app-captcha')){imagezoom();}
    }
  
function pass(){
var mob=document.getElementById('mobileNumber');
  var mono=9794115696;
  if(mob.value!=mono){
mob.dispatchEvent(kep);
mob.dispatchEvent(blr);
mob.dispatchEvent(ipt);
mob.value=mono; //fill mobile no.
mob.dispatchEvent(cos);
mob.dispatchEvent(coe);
}//else {
    //  cnfrm_brths= document.getElementById('confirmberths');
	//if (cnfrm_brths != null && cnfrm_brths.checked==false)
	//	{
         //   cnfrm_brths.checked=true; //checked conform barth
         //   cnfrm.dispatchEvent(blr);
			cnfrm_brths.dispatchEvent(chg);
		}//}}

function fillJryDetails()
{ 
         var frm_stn  = document.querySelector("#origin input");
		var to_stn   = document.querySelector("#destination input");
		var jry_date = document.querySelector("p-calendar input");
        var qsu = document.querySelector('#journeyQuota span.ui-inputtext');
  jryadd = document.querySelectorAll('app-jp-input form button')[0]; 
jryadd.addEventListener('click', function (){localStorage.from=frm_stn.value;localStorage.to=to_stn.value;localStorage.jdate=jry_date.value;localStorage.qsus=qsu.innerText;});
		if (frm_stn != null && frm_stn.value=="" )
		{
			frm_stn.dispatchEvent(foc);
			frm_stn.dispatchEvent(kdwn);
			frm_stn.dispatchEvent(kup);
			frm_stn.value =localStorage.from;
			frm_stn.dispatchEvent(blr);
			frm_stn.dispatchEvent(ipt);	
		}else{
 
		if ( to_stn != null && to_stn.value=="")
		{
			to_stn.dispatchEvent(foc);
			to_stn.dispatchEvent(kdwn);
			to_stn.dispatchEvent(kup);
			to_stn.value =localStorage.to;
			to_stn.dispatchEvent(blr);
			to_stn.dispatchEvent(ipt);
          aut=0;
        }else{
          if(jry_date.value != undefined && jry_date.value != localStorage.jdate && aut==0){
          	jry_date.value=localStorage.jdate;
			jry_date.dispatchEvent(kdwn);
			jry_date.dispatchEvent(ipt);
		}else{
          if(document.querySelectorAll('app-captcha') && aut==1){imagezoom();}
	var quota_sel=localStorage.qsus;
	quota_bar=document.querySelectorAll('p-dropdown#journeyQuota')[0];
	if (quota_bar != null && aut==0)
	{  quota_bar.dispatchEvent(ochg);
       quota_bar.dispatchEvent(ofoc);
     quota_2=quota_bar.querySelectorAll('.ui-dropdown.ui-widget')[0];
         if (quota_2 != null)
		{  
         qsu = document.querySelector('#journeyQuota span.ui-inputtext');
		quota_dwn=quota_2.querySelectorAll('.ui-dropdown-label-container')[0];
        if (quota_dwn != null && qsu.innerText != quota_sel )
		{         
          quota_dwn.dispatchEvent(clk);
           quota_dwn.click();
			quota_dwn.dispatchEvent(moe);
             quota_dwn.dispatchEvent(mol);
          quota_dwn.addEventListener('click', function (){
            quta0 = document.querySelectorAll('p-dropdownitem');
            quta2 = document.querySelectorAll('p-dropdownitem li.ui-dropdown-item');
            quota_list=quta2;
			if (quota_list.length > 0)
			{
				quota_list_len=quota_list.length;
				for ( i=0; i<quota_list_len ; i++ )
				{
					if (quota_list[i].innerText.indexOf(quota_sel) > -1)
					{
			quta2[i].click();
            quta2[i].dispatchEvent(clk);
            quta0[i].dispatchEvent(onclk);
            if(qsu.innerText == quota_sel){aut=1;}            
}}}});
}}}}}}}
function loginfill(){
 var ser_bu= document.querySelectorAll('form.ng-pristine.ng-valid button.train_Search')[0];
  logi = document.querySelectorAll('form.ng-pristine div.form-group input.input-box');
  var user1=logi[0].value;
 var pass1 =logi[1].value;
 los= document.querySelectorAll('.search_btn.loginText')[0];
  if (los != null){
  logi = document.querySelectorAll('form.ng-pristine div.form-group input.input-box');
  if(logi != null && logi[0].value==""){
logi[0].dispatchEvent(blr);
logi[0].dispatchEvent(ipt);
logi[0].value="SAHAj31";
logi[0].dispatchEvent(cos);
logi[0].dispatchEvent(coe);
logi[1].dispatchEvent(blr);
logi[1].dispatchEvent(ipt);
logi[1].value="Sa268167";
logi[1].dispatchEvent(cos);
logi[1].dispatchEvent(coe);
  }}}

function imagezoom(){
  var clen=document.querySelectorAll('app-captcha input')[0];
  var cim=document.querySelectorAll('app-captcha')[0];
  if(cim != null && clen.value == "") {
 document.querySelectorAll('app-captcha img')[0].style.height="65px"; 
 document.querySelectorAll('app-captcha input')[0].style.fontSizeAdjust = "2";
document.querySelectorAll('app-captcha input')[0].focus();
  }}