// ==UserScript==
// @name Проверка
// @namespace Проверка
// @description Проверка.
// @include https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx*
// @include https://by.e-konsulat.gov.pl/Bledy*
// @include https://rejestracja.by.e-konsulat.gov.pl*
// @require http://code.jquery.com/jquery-latest.min.js
// @version 1
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16311/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/16311/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0.meta.js
// ==/UserScript==

// Проверяет возможные ошибки в личном номере,
// Проверяет поля 4,7,9,11,12,17,20,31.

function gi(element) {
return document.getElementById(element);
}
{
if(gi('cp_f_cmdDalej')){
gi('cp_f_cmdDalej').addEventListener( "click",function checkData() {
function perNum(num){
var check= '7317317317317',
sum=0;
for (i=0;i<num.length-1;i++){
sum += (!isNaN(num[i])) ? num[i]*check[i] : (num[i].charCodeAt(0)-55)*check[i] ;
}
return(sum % 10 == num[num.length-1]);
}
var err='';
console.info('Проверяю поля анкеты');
date=cp_f_daneOs_txtDataUrodzin.value;
res=date.split('-')[2]+date.split('-')[1]+date[2]+date[3];
var num=cp_f_txt5NumerDowodu.value;
if ((num[0]==3 || num[0]==5) && !cp_f_daneOs_rbPlec_0.checked ) err+='9 ';
else
if((num[0]==4 || num[0]==6) && cp_f_daneOs_rbPlec_0.checked) err+='9 ';
if (num[0]!=7 && num.indexOf(res)!=1) err+='4 ';
if ((cp_f_ddl21KrajDocelowy.value!='POL') || (cp_f_ddl23PierwszyWjazd.value!='POL'))
err +='22 23 ';
if (!cp_f_rbl13_0.checked) err+='12 ';
if (cp_f_ctrl31__ddl34panstwo.value!='POL') err+='31 ';
if (cp_f_ddl45Panstwo.value!='BLR') err+='17 ';
if (cp_f_dd20bPanstwo.value!='BLR') err+='20 ';
if (cp_f_daneOs_cbObecneObywatelstwo.value !='BLR')
alert ('Не беларус')
else if (!perNum(cp_f_txt5NumerDowodu.value))
alert('!!! Ошибка в личном номере ');
if (err) alert ('Внимание в Поле(ях) '+err+' возможны ошибки');
});
}
}