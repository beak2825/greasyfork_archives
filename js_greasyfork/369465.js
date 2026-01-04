// ==UserScript==
// @name           Virtonomica:Warehouse+
// @namespace      virtonomic*
// @version        2.3
// @author         UnclWish
// @description    Добавление расширенной функциональности вкладки Сбыт
// @include        http*://virtonomic*.*/*/main/unit/view/*/sale/offer
// @include        http*://virtonomic*.*/*/main/unit/view/*/sale
// @downloadURL https://update.greasyfork.org/scripts/369465/Virtonomica%3AWarehouse%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/369465/Virtonomica%3AWarehouse%2B.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
var $=win.$;
$(document).ready( function () {

var sel=3;//Только для своей компании
var hidd=0;//0-не прятать пустые ряды,1-прятать
var delay = 375;//задержка в милисекундах при вводе цены

//склад/не склад?
//if(/(?:Склад)/.test($('div[class*="title"]').prop('textContent'))){
var a1=$('div.title').text().trim();
if (a1.indexOf("Офис") == -1 ) return; //Выход если главная страница не нашей компании

var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');
if(title.search('warehouse')!=-1) hidd=1

var inp=$('<td><input id="xxx"></td>');
var show=hidd;
//var show=1;

function SetColors (e, val) {
	if (+e.attr('price1')>+e.attr('ss')) e.next().css('color',"#0faa0f");
	if (+e.attr('price1')==+e.attr('ss')) e.next().css('color',"#0f0f77");
	if (+e.attr('price1')<+e.attr('ss')) e.next().css('color',"#aa0f0f");
	if ((val-e.attr('price1')).toFixed(2)>0) {e.next().next().prop('textContent', "+" +(val-e.attr('price1')).toFixed(2)); e.next().next().css('color',"#0f880f")}
	if ((val-e.attr('price1')).toFixed(2)==0) e.next().next().css('color',"#0f0f77");
	if ((val-e.attr('price1')).toFixed(2)<0) e.next().next().css('color',"#aa0f0f");
	//e.next().next().prop('textContent',"");}
	if(isNaN(e.attr('ss')) || e.attr('ss')==0 || e.attr('ss') == null) {e.css('background',"#31c6bd");}
	if(e.attr('ss')>0) {if (val==0) {e.css('background',"#ff9999")}else{
	if(+val==+e.attr('ss')){e.css('background',"#ffe4e4");}
	if(+val<+e.attr('ss')){;e.css('background',"#ffcccc");}
	if(+val>+e.attr('ss')){e.css('background',"#99ff99");}}}
	}

/////////прячем/не прячем ряды по умолчанию
if(hidd){$('table.grid>tbody>tr:gt(0)').each(function(){
if($('td.nowrap td:contains("Себестоимость")',this).next().prop('textContent')=="---")
{$(this).css('display','none');}});}

/////////функция показать/спрятать пустые позиции
$('table.grid>tbody>tr th:contains("На складе")').click(function(){
var disp=(show==0?'none':'table-row');
$('table.grid>tbody>tr:gt(0)').each(function(){
if($('td.nowrap td:contains("Себестоимость")',this).next().prop('textContent')=="---"){$(this).css('display',disp);}
SetColors($('input[name*="[price]"]',this), $('input[name*="[price]"]',this).attr('value'));
});
//переносим форму ввода изменений цены в первую видимую строку после работы функции
show==1?inp.insertBefore($('table.grid>tbody>tr td>input.money[ss]:first')):inp.insertBefore($('table.grid>tbody>tr td>input.money[ss!=""]:first'));
$('input#xxx').css('width',"80px");
show+=1;show=show%2;});

//////////индикатор изменения цены и красные индикаторы
$('table.grid>tbody>tr:gt(0)').each(function(){
var tdd=$('<td id="td1"></td><td id="td2"></td>');
tdd.insertAfter($('input[name*="[price]"]',this)).css('textAlign',"left");
$('td#td1').css('width',"40px");$('td#td2').css('width',"40px");
var price=($('input[name*="[price]"]',this).attr('value')-0);
$('input[name*="[price]"]',this).attr('price1',price).attr('price2',price);
var ss=$('td.nowrap td:contains("Себестоимость")',this).next().prop('textContent').replace(/[^\d\.]/g,'').replace(' ', '');
var sss=parseFloat($('td.nowrap td:contains("Себестоимость")',this).next().prop('textContent').replace(/[^\d\.]/g,'').replace(' ', ''));
$('input[name*="[price]"]',this).attr('ss',ss);
if(isNaN(ss) || ss==0 || ss == null || ss=="") {$('input[name*="[price]"]',this).css('background',"#31c6bd");}
if(+ss>0&+price==0){$('input[name*="[price]"]',this).css('background',"#FFAAAA");}
if(+price!=0&+price==sss) {$('input[name*="[price]"]',this).css('background',"#ffe4e4");}
if(+price>sss){$('input[name*="[price]"]',this).css('background',"#DDFFDD");}
if(+price!=0&+price<sss){$('input[name*="[price]"]',this).css('background',"#FFCCCC");}
if($('td:last select',this).attr('selectedIndex')==0&ss>0){$('td:last select',this).css('background',"#ff9999");}
});


/////////////переносим форму ввода изменений цены в первую видимую строку при загрузке
hidd==0?inp.insertBefore($('table.grid>tbody>tr td>input.money[ss]:first')):inp.insertBefore($('table.grid>tbody>tr td>input.money[ss!=""]:first'));
$('input#xxx').css('width',"80px");

//изменение цветов во время изменения цены
var timeout;
$('td>input[name*="[price]"]').unbind('keyup').keyup(function(ee){
var e=$(this);
if (timeout) clearTimeout(timeout);
timeout = setTimeout(function() {
//var val = parseFloat(e.attr('value').replace(',','.'));
var val = parseFloat(e.val().replace(',','.'));
if (isNaN(val)) val = 0;
//console.log(e.val());
//console.log(val);
e.next().prop('textContent',e.attr('price1'));
e.next().next().prop('textContent',(val-e.attr('price1')).toFixed(2));//}else {e.next().prop('textContent',"");
SetColors(e,val);
if (ee.keyCode == 13) return;
},delay);
})

////////////////////////////Групповые изменения////////////////////////////////////////
$('table.grid>tbody>tr th:contains("Цена")').click(function(e){
$('table.grid>tbody>tr:gt(0)').each(function(){
var price=$('td>input[name*="[price]"]',this).attr('value');
$('td>input[name*="[price]"]',this).attr('price2',price);
});
var izmen=$('input#xxx').attr('value');
if(izmen!==undefined){
var proc=izmen.slice(-1)=="%"?1:0; //проценты или сумма?
var znak=izmen.slice(0,1)=="+"?0:(izmen.slice(0,1)=="-"?1:2); // +, - или =?
var izmen_fix=izmen.replace(/[^\d\.]/g,'');
if(e.altKey){set_ss_alt(izmen_fix,proc,znak);} else
if(e.shiftKey){set_ss_shift();} else
if(e.ctrlKey){set_ss_ctrl(izmen_fix,proc,znak);} else set_all_ss();}
else if(e.shiftKey){set_ss_shift();} else set_all_ss();});

//всё по сс
function set_all_ss(){
$('table.grid>tbody>tr:gt(0)').each(function(){
var elem=$('td>input[name*="[price]"]',this);
var ss=(elem.attr('ss')-0+0.01).toFixed(2);
elem.attr('value',ss);
//if(elem.attr('value')!=elem.attr('price1')&ss>0)
//{elem.css('background',"#99ff99");
$('td#td1',this).prop('textContent',elem.attr('price1'));
$('td#td2',this).prop('textContent',(elem.attr('value')-elem.attr('price1')).toFixed(2));//}else {elem.css('background',"#ffffff");
//$('td#td1',this).prop('textContent',"");
//$('td#td2',this).prop('textContent',"");//}
SetColors(elem,ss);
});}

/////////////////////////////////////вычисления по сс////////
function set_ss_ctrl(i,p,z){
$('table.grid>tbody>tr:gt(0)').each(function(){
var elem=$('td>input[name*="[price]"]',this);
var ss=elem.attr('ss');
ss=ss>0?ss:0;
var val;
if((ss!=0)&(p==0)) /////////работа с числами////////
{switch(z){
case 0:val=((ss-0)+(i-0)).toFixed(2);break; //сумма
case 1:val=(ss-i).toFixed(2);break; //разность
case 2:val=i;break;}} //установка введённой суммы
else if ((ss!==0)&(p==1)) //////////работа с процентами///////
{switch(z){
case 0:val=(ss*(1+i/100)).toFixed(2);break; //сумма
case 1:val=(ss*(1-i/100)).toFixed(2);break; //разность
case 2:val=(i*ss/100).toFixed(2);break;}} //установка
elem.attr('value',val>0?val:(0-0));
//if(elem.attr('value')!=elem.attr('price1')&elem.attr('price1')>0)
//{elem.css('background',"#99ff99");
$('td#td1',this).prop('textContent',elem.attr('price1'));
$('td#td2',this).prop('textContent',(elem.attr('value')-elem.attr('price1')).toFixed(2));//} else {elem.css('background',"#ffffff");
//$('td#td1',this).prop('textContent',"");
//$('td#td2',this).prop('textContent',"");}
//if(+ss>0&+elem.attr('value')==0){elem.css('background',"#ff9999");}
SetColors(elem,elem.attr('value'));
});}

///////////////////////////вычисления по предыдущему значению///////////
function set_ss_alt(i,p,z){
$('table.grid>tbody>tr:gt(0)').each(function(){
var elem=$('td>input[name*="[price]"]',this);
var ss=elem.attr('price2');
var val;
if((ss!==0)&(p===0)) /////////работа с числами////////
{switch(z){
case 0:val=((ss-0)+(i-0)).toFixed(2);break; //сумма
case 1:val=(ss-i).toFixed(2);break; //разность
case 2:val=i;break;}} //установка введённой суммы
else if ((ss!==0)&(p==1)) //////////работа с процентами///////
{switch(z){
case 0:val=(ss*(1+i/100)).toFixed(2);break; //сумма
case 1:val=(ss*(1-i/100)).toFixed(2);break; //разность
case 2:val=(i*ss/100).toFixed(2);break;}} //установка
elem.attr('value',val>0?val:0);
//if(elem.attr('value')!=elem.attr('price1')&elem.attr('price1')>0)
//{elem.css('background',"#99ff99");
$('td#td1',this).prop('textContent',elem.attr('price1'));
$('td#td2',this).prop('textContent',(elem.attr('value')-elem.attr('price1')).toFixed(2));//}else {elem.css('background',"#ffffff");
//$('td#td1',this).prop('textContent',"");
//$('td#td2',this).prop('textContent',"");}
//if(ss>0&elem.attr('value')==0){elem.css('background',"#ff9999");}
SetColors(elem,elem.attr('value'));
});}

//возврат прежних значений
function set_ss_shift(){
$('table.grid>tbody>tr:gt(0)').each(function(){
var ss=$('td>input[name*="[price]"]',this).attr('price1');
$('td>input[name*="[price]"]',this).attr('value',ss).css('background',"#ffffff");
$('td#td1',this).prop('textContent',"");
$('td#td2',this).prop('textContent',"");
SetColors($('td>input[name*="[price]"]',this),ss);
});}

////////////////////////////////////////////////////////Одиночные изменения////////////////////////////////////////
$('table.grid>tbody>tr:gt(0)>td>input[name*="[price]"]').dblclick(function(e){
var elem=$(this);
var price=elem.attr('value');
elem.attr('price2',price);
var izmen=$('input#xxx').attr('value');
if(izmen != undefined){
var proc=izmen.slice(-1)=="%"?1:0; //проценты или сумма?
var znak=izmen.slice(0,1)=="+"?0:(izmen.slice(0,1)=="-"?1:2); // +, - или =?
var izmen_fix=izmen.replace(/[^\d\.]/g,'');
if(e.altKey){set_alt(izmen_fix,proc,znak,elem);} else
if(e.shiftKey){set_shift(elem);} else
if(e.ctrlKey){set_ctrl(izmen_fix,proc,znak,elem);} else set_ss(elem);}
else if(e.shiftKey){set_shift(elem);} else set_ss(elem);});

///////////////////////////вычисления по предыдущему значению///////////
function set_alt(i,p,z,e){
var ss=e.attr('price2');
var val;
if((ss!==0)&(p==0)) /////////работа с числами////////
{switch(z){
case 0:val=((ss-0)+(i-0)).toFixed(2);break; //сумма
case 1:val=(ss-i).toFixed(2);break; //разность
case 2:val=i;break;}} //установка введённой суммы
else if ((ss!==0)&(p==1)) //////////работа с процентами///////
{switch(z){
case 0:val=(ss*(1+i/100)).toFixed(2);break; //сумма
case 1:val=(ss*(1-i/100)).toFixed(2);break; //разность
case 2:val=(i*ss/100).toFixed(2);break;}} //установка
e.attr('value',val>0?val:0);
//if(e.attr('value')!=e.attr('price1')&e.attr('price1')>0)
//{e.css('background',"#99ff99");
e.next().prop('textContent',e.attr('price1'));
e.next().next().prop('textContent',(e.attr('value')-e.attr('price1')).toFixed(2));//}else {e.css('background',"#ffffff");
//e.next().prop('textContent',"");
//e.next().next().prop('textContent',"");}
//if(e.attr('ss')>0&e.attr('value')==0){e.css('background',"#ff9999");}
SetColors(e,e.attr('value'));
}

function set_ss(e){
var ss=(e.attr('ss')-0+0.01).toFixed(2);
e.attr('value', ss);
//if(e.attr('value')!=e.attr('price1')&e.attr('price1')>0)
//{e.css('background',"#99ff99");
e.next().prop('textContent',e.attr('price1'));
e.next().next().prop('textContent',(e.attr('value')-e.attr('price1')).toFixed(2));//}else {e.css('background',"#ffffff");
//e.next().prop('textContent',"");
//e.next().next().prop('textContent',"");}
SetColors(e, e.attr('value'));
}

/////////////////////////////////////вычисления по сс////////
function set_ctrl(i,p,z,e){
var ss=e.attr('ss');
ss=ss>0?ss:0;
var val;
if((ss!==0)&(p==0)) /////////работа с числами////////
{switch(z){
case 0:val=((ss-0)+(i-0)).toFixed(2);break; //сумма
case 1:val=(ss-i).toFixed(2);break; //разность
case 2:val=i;break;}} //установка введённой суммы
else if ((ss!==0)&(p==1)) //////////работа с процентами///////
{switch(z){
case 0:val=(ss*(1+i/100)).toFixed(2);break; //сумма
case 1:val=(ss*(1-i/100)).toFixed(2);break; //разность
case 2:val=(i*ss/100).toFixed(2);break;}} //установка
e.attr('value',val>0?val:0);
//if(e.attr('value')!=e.attr('price1')&e.attr('price1')>0)
//{e.css('background',"#99ff99");
e.next().prop('textContent',e.attr('price1'));
e.next().next().prop('textContent',(e.attr('value')-e.attr('price1')).toFixed(2));//}else {e.css('background',"#ffffff");
//e.next().prop('textContent',"");
//e.next().next().prop('textContent',"");}
//if(e.attr('ss')>0&e.attr('value')==0){e.css('background',"#ff9999");}
SetColors(e, e.attr('value'));
}

//возврат прежнего значения
function set_shift(e){
var ss=e.attr('price1');
e.attr('value',ss).css('background',"#ffffff");
e.next().prop('textContent',"");
e.next().next().prop('textContent',"");
SetColors(e,e.attr('value'));
}

//////////////////////////////////////////////////////////////Политика сбыта//////////////////////////////////////
$('table.grid>tbody>tr th:contains("Политика сбыта")').click(function(){set_pol_sb();});
function set_pol_sb(){
$('table.grid>tbody>tr:gt(0)').each(function(){
$('td:last select',this).attr('selectedIndex',sel);
$.each($('td:last select>option',this),function(index,value){
index==sel?$(value).prop('selected','selected'):$(value).prop('selected','');});
sel==2?$('td:last select',this).next('div').css('display','block'):$('td:last select',this).next('div').css('display','none');
(sel==0&$('td>input[name*="[price]"]',this).attr('ss')>0)?$('td:last select',this).css('background',"#ff9999"):$('td:last select',this).css('background',"#ffffff");
});
sel+=1;sel=sel%4;
}
})