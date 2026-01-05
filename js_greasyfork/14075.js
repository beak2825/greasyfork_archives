// ==UserScript==
// @name           [Does not work any more] HWM Blacksmith list in art info
// @author         JUSTteen15
// @namespace      JUSTteen15
// @description    [Does not work any more]
// @homepage       http://www.heroeswm.ru/pl_info.php?id=2210892
// @icon           http://dcdn.heroeswm.ru/avatars/2210/nc-47/2210892.gif
// @version        1.04
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/art_info.php?id=*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/14075/%5BDoes%20not%20work%20any%20more%5D%20HWM%20Blacksmith%20list%20in%20art%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/14075/%5BDoes%20not%20work%20any%20more%5D%20HWM%20Blacksmith%20list%20in%20art%20info.meta.js
// ==/UserScript==
//-----------------------------------------------------------------------------------------------------------------------------------------------
var image;
var x=0;
var artname=[];
var array=[];
var btn_menu=[];
var c=[]; 
var row=[]; 
var btn=[];
var k_name=[];
var k_repair=[];
var k_cost=[];
var k_bonus=[];
var div=[];
var t=[];
var send_gold = document.createElement("div");
t[1] = document.createTextNode("Добавить кузнеца");   
t[2] = document.createTextNode("Добавить"); 
t[3] = document.createTextNode("Удалить"); 
t[4] = document.createTextNode("Удалить кузнеца"); 
t[5] = document.createTextNode("Раскрыть список кузнецов");
t[6] = document.createTextNode("OK");
t[7] = document.createTextNode("Отмена");
t[8] = document.createTextNode("Скрыть список");

var repCostTbl = getI("//b[contains(text(),'Стоимость ремонта:')]").snapshotItem(0).nextSibling;
var res=/<td>([0-9,]+)<\/td>/.exec(repCostTbl.innerHTML) ;
var remont = parseInt(res[1].replace(',','')); 

var kuznec_menu = document.createElement("table");
var kolvo_menu = document.createElement("table");
var desk = document.createElement("table");
var delete_menu= document.createElement("table");
kuznec_menu.setAttribute('width','200');
kolvo_menu.setAttribute('width','213');
desk.setAttribute('width','100%');
delete_menu.setAttribute('width','213');

for(var i=0;i<3;i++)
{
    div[i]=document.createElement("div");
    div[i].innerHTML='<br/>';
}

if((els = document.getElementsByClassName('wbwhite')) && (el = els[0].firstChild)) artname = el.innerHTML;
if((elss = document.getElementsByClassName('wblight')) && (els = elss[0].firstChild)) image = els.innerHTML;

var last_element = artname[artname.length - 1];
if(last_element!=="]"){
    var b = document.getElementsByTagName('body')[0] ;
    var hard_regexp =/.+Прочность:.+?(\d+?)<br>.+/gmi;
    var h = hard_regexp.exec(b.innerHTML);
    var e0 = getI("//b[text()=' Стоимость ремонта:']").snapshotItem(0) ;
    var e1 = e0.nextSibling.firstChild.firstChild.firstChild.nextSibling ;
}
else{
    var b = document.getElementsByTagName('body')[0] ;
    var hard_regexp =/.+Прочность:.+?(\d+)\/(\d+).+?\((\d+)\)<br>.+/gmi;
    var h = hard_regexp.exec(b.innerHTML);
    var e0 = getI("//b[text()=' Стоимость ремонта:']").snapshotItem(0) ;
    var e1 = e0.nextSibling.firstChild.firstChild.firstChild.nextSibling ;
}
for(var i=0;i<5;i++)
{
    btn_menu[i]=2;
}
for(var i=1;i<7;i++)
{
    btn[i]=document.createElement("BUTTON");
    btn[i].appendChild(t[i]);
    btn[i].style.width = 213;
} 
btn[2].style.border = "1px solid #5D413A";
btn[3].style.border = "1px solid #5D413A";
btn[6].style.border = "1px solid #5D413A";

var ttt=localStorage.getItem("k_name");
if (ttt!==null){
    k_name = JSON.parse(localStorage.k_name);
    k_repair = JSON.parse(localStorage.k_repair);
    k_cost = JSON.parse(localStorage.k_cost);
    k_bonus = JSON.parse(localStorage.k_bonus);
}

var kolvo_artov=localStorage.getItem("kolvo_artov");
if (kolvo_artov===null){
    kolvo_artov=1;                    
}

for(x;x<k_repair.length ;x++)
{
    sumRem = Math.ceil(((remont*(k_cost[x]/100))+(parseInt(k_bonus[x])))*(kolvo_artov));
    send_gold.innerHTML +='<br/><div align=center ><a title="Передать '+sumRem+' золота" href="/transfer.php?gold='+sumRem+'&desc=за ремонт '+artname+' ['+kolvo_artov+' шт.]'+'&nick='+k_name[x]+'"><b>'+'['+(x+1)+']'+' '+k_name[x]+" ("+k_repair[x]+"/"+k_cost[x]+")"+"</b></a>"+"<br/></div>";
}send_gold.innerHTML +="<br/>";

for(var i=1;i<5;i++)
{
    row[i]=kuznec_menu.insertRow(-1);
}
row[6]=delete_menu.insertRow(-1); 
row[7]=kolvo_menu.insertRow(-1); 

c[1]= row[1].insertCell(0);
c[2]= row[1].insertCell(0);
c[3]= row[2].insertCell(0);
c[4]= row[2].insertCell(0);
c[5]= row[3].insertCell(0);
c[6]= row[3].insertCell(0);
c[7]= row[4].insertCell(0);
c[8]= row[4].insertCell(0);
c[9]= row[6].insertCell(0);  
c[10]= row[6].insertCell(0);
c[11]= row[7].insertCell(0); 
c[12]= row[7].insertCell(0);

c[1].innerHTML='<br><div align=center><form name="form_1"><input id=set_1 type=text size=8 maxlength=15></form></div>';
c[2].innerHTML='<div align=center>Введите имя<br/></div>';
c[3].innerHTML='<br><div align=center><form name="form_2"><input id=set_2 type=text size=8 maxlength=2></form></div>';
c[4].innerHTML='<div align=center>На сколько % ?<br/></div>';
c[5].innerHTML='<br><div align=center><form name="form_3"><input id=set_3 type=text size=8 maxlength=3></form></div>';
c[6].innerHTML='<div align=center>За сколько % ?<br/></div>';
c[7].innerHTML='<br><div align=center><form name="form_4"><input id=set_4 type=text size=8 maxlength=6 value=0></form></div>';
c[8].innerHTML='<div align=center>Дополнительные бонусы<br/></div>';
c[9].innerHTML='<br><div align=center><form name="form_444"><input id=set_444 type=text size=1 maxlength=3 value='+x+'></form></div>';
c[10].innerHTML='<div align=center>Введите<br> номер кузнеца:<br/></div>';
c[11].innerHTML='<br><div align=center><form name="form_kolvo"><input id=set_kolvo type=text size=1 maxlength=3 value='+kolvo_artov+'></form></div>';
c[12].innerHTML='Количество артефактов:';

els.parentNode.insertBefore(div[0], els.nextSibling);
els.parentNode.insertBefore(btn[5], div[0].nextSibling);
els.parentNode.insertBefore(div[1], btn[5].nextSibling);
els.parentNode.insertBefore(btn[1], div[1].nextSibling);
els.parentNode.insertBefore(div[2], btn[1].nextSibling);
els.parentNode.insertBefore(btn[4], div[2].nextSibling);

btn[1].onclick = ClickButton1;
btn[2].onclick = ClickButton2;
btn[3].onclick = ClickButton3;
btn[4].onclick = ClickButton4;
btn[5].onclick = ClickButton5;
btn[6].onclick = ClickButton6;
//-----------------------------------------------------------------------------------------------------------------------------------------------
function ClickButton1() {  
    if (btn_menu[1]%2===0){
        btn[1].replaceChild(t[7],t[1]);
        btn[2].appendChild(t[2]);       
        document.body.appendChild(btn[2]);
        els.parentNode.insertBefore(kuznec_menu, btn[1].nextSibling);
        els.parentNode.insertBefore(btn[2], kuznec_menu .nextSibling);
        btn_menu[1]++;
    }
    else{ 
        btn[1].replaceChild(t[1],t[7]);
        btn_menu[1]=2;
        kuznec_menu.parentNode.removeChild(kuznec_menu); 
        btn[2].parentNode.removeChild(btn[2]);
    }
}

function ClickButton2(){
    array[0] = document.forms.form_1.set_1.value;
    array[1] = document.forms.form_2.set_2.value;
    array[2] = document.forms.form_3.set_3.value;
    array[3] = document.forms.form_4.set_4.value; 
    window.localStorage.setItem('array_nickname', array[0]);
    window.localStorage.setItem('array_repair', array[1]);
    window.localStorage.setItem('array_cost', array[2]);
    window.localStorage.setItem('array_bonus', array[3]);
    var array_nickname=window.localStorage.getItem('array_nickname');
    var array_repair=window.localStorage.getItem('array_repair');
    var array_cost=window.localStorage.getItem('array_cost');
    var array_bonus=window.localStorage.getItem('array_bonus');

    kuznec_menu.parentNode.removeChild(kuznec_menu);
    btn[2].parentNode.removeChild(btn[2]); 

    k_name.push(array_nickname);
    k_repair.push(array_repair);
    k_cost.push(array_cost);
    k_bonus.push(array_bonus);
    localStorage.k_name = JSON.stringify(k_name);
    localStorage.k_repair = JSON.stringify(k_repair);
    localStorage.k_cost = JSON.stringify(k_cost);
    localStorage.k_bonus = JSON.stringify(k_bonus);

    btn_menu[1]=2;
    location.reload();
}

function ClickButton3(){
    array[4] = (document.forms.form_444.set_444.value)-1; 

    var removed1=k_name.splice( array[4], 1);
    var removed2=k_repair.splice( array[4], 1);
    var removed3=k_cost.splice( array[4], 1);
    var removed4=k_bonus.splice( array[4], 1);

    localStorage.k_name = JSON.stringify(k_name);
    localStorage.k_repair = JSON.stringify(k_repair);
    localStorage.k_cost = JSON.stringify(k_cost);
    localStorage.k_bonus = JSON.stringify(k_bonus);

    location.reload();
}

function ClickButton4(){
    if(x===0)
    {
        alert("Список пуст, вначале добавтье кузница");
    }
    else
    {
        if(btn_menu[3]%2===0){
            btn[4].replaceChild(t[7],t[4]);
            els.parentNode.insertBefore(delete_menu,btn[3].nextSibling);
            els.parentNode.insertBefore(btn[3],delete_menu.nextSibling);
            btn_menu[3]++;
        }
        else{   
            btn[4].replaceChild(t[4],t[7]);
            btn_menu[3]=2;
            delete_menu.parentNode.removeChild(delete_menu); 
            btn[3].parentNode.removeChild(btn[3]);
        }
    }
}

function ClickButton5() {
    if(x===0)
    {
        alert("Список пуст, вначале добавтье кузница");
    }
    else
    {
        if (btn_menu[4]%2===0){
            btn[5].replaceChild(t[8],t[5]);
            els.parentNode.insertBefore(send_gold,btn[5].nextSibling);
            els.parentNode.insertBefore(kolvo_menu,send_gold .nextSibling);
            els.parentNode.insertBefore(btn[6],kolvo_menu .nextSibling);
            btn_menu[4]++;
        }
        else{ 
            btn[5].replaceChild(t[5],t[8]);
            btn_menu[4]=2;
            kolvo_menu.parentNode.removeChild(kolvo_menu); 
            send_gold.parentNode.removeChild(send_gold);
            btn[6].parentNode.removeChild(btn[6]);
        }
    }
}

function ClickButton6(){
    kolvo_artov= document.forms.form_kolvo.set_kolvo.value; 
    window.localStorage.setItem('kolvo_artov', kolvo_artov);
    location.reload();
}
//-----------------------------------------------------------------------------------------------------------------------------------------------
function getI(xpath,elem) {return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}



