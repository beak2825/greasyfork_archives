// ==UserScript==
// @name           bw_autobattle_lite
// @namespace      bw_autobattle_lite
// @description    bw_autobattle_lite111
// @include        http://www.bloodyworld.com/*
// @version 0.0.1.20150605225921
// @downloadURL https://update.greasyfork.org/scripts/10280/bw_autobattle_lite.user.js
// @updateURL https://update.greasyfork.org/scripts/10280/bw_autobattle_lite.meta.js
// ==/UserScript==
var doc = document.wrappedJSObject ? document.wrappedJSObject : document;
var ddoc = (window.wrappedJSObject) ? window.wrappedJSObject : window;
patt=/Закрыть|окончания боя/;
patt2=/Ваша заявка принята|Заявка на бой подана|Отозвать запрос|Ожидаем начала поединка|Происходит распределение игроков/;
if(ddoc.rooms && ddoc.flBtl!='battle' && ddoc.flBtl!='battle2' && !patt.exec(document.documentElement.innerHTML) && !patt2.exec(document.documentElement.innerHTML)){
if(GM_getValue('doTeleport')==1){
GM_setValue('autobattle',0);
doTeleport();
}
else if(GM_getValue('setvopl')==1){
GM_setValue('autobattle',0);
setVoplot();
}
else if(GM_getValue('toheal')==1){
GM_setValue('autobattle',0);
healFull();
}
else if(GM_getValue('auto_andwari')==1){
if(ddoc.rooms=='depot'){
//вокзал, идем в пещеру
patt=/GoUrl\(\'(index\.php\?file=go&go=[a-zA-Z0-9]*&move=cave)\'/;
result=patt.exec(document.documentElement.innerHTML);
if(result)location.href="http://www.bloodyworld.com/"+result[1];
}
else if(ddoc.rooms=='go'){
//дорога
GM_setValue('autobattle',1);
}
else if(ddoc.rooms=='cave'){
//пещера, идем на вокзал
patt=/GoUrl\(\'(index\.php\?file=go&go=[a-zA-Z0-9]*&move=depot)\'/;
result=patt.exec(document.documentElement.innerHTML);
if(result)location.href="http://www.bloodyworld.com/"+result[1];
}
}
if(ddoc.rooms=='depot' || ddoc.rooms=='go' || ddoc.rooms=='cave'){
  var btn = doc.createElement('button');
  btn.setAttribute('id','auto_andwari');
  btn.setAttribute('style','position: absolute; top:0px; left:95px; font-size:11px; background: #f1f1f1; width:80px; z-index: 100; border: 1px #000000 solid; color: maroon;');
  btn.addEventListener('click', auto_andwari, false);
if(GM_getValue('auto_andwari')==1)  btn.innerHTML = '<nobr>андвари откл.</nobr>';
else{ GM_setValue('auto_andwari',0);btn.innerHTML = '<nobr>андвари вкл.</nobr>';}
  doc.body.appendChild(btn);
}
if(ddoc.rooms=='guild'){
  var btn = doc.createElement('button');
  btn.setAttribute('id','change');
  btn.setAttribute('style','position: absolute; top:15px; left:95px; font-size:11px; background: #f1f1f1; width:90px; z-index: 100; border: 1px #000000 solid; color: maroon;');
  btn.addEventListener('click', change, false);
  btn.innerHTML = '<nobr>Переключиться</nobr>';
  doc.body.appendChild(btn);
}
}
patt=/Закрыть/;
patt2=/окончания боя/;
if(ddoc.rooms && (((ddoc.flBtl=='battle' || ddoc.flBtl=='battle2') && (ddoc.dsgStatus=='battle' || ddoc.dsgStatus=='waitBat')) || patt.exec(document.documentElement.innerHTML) || patt2.exec(document.documentElement.innerHTML))){
setTimeout(main,500);
  var btn = doc.createElement('button');
  btn.setAttribute('id','menu_autobattle');
  btn.setAttribute('style','position: absolute; top:0px; left:0px; font-size:11px; background: #f1f1f1; width:80px; z-index: 100; border: 1px #000000 solid; color: maroon;');
  btn.addEventListener('click', menu_autobattle, false);
if(GM_getValue('autobattle')==1)  btn.innerHTML = '<nobr>прекратить</nobr>';
else{ GM_setValue('autobattle',0);btn.innerHTML = '<nobr>бить</nobr>';}
  doc.body.appendChild(btn);
  
  var btn = doc.createElement('button');
  btn.setAttribute('id','mobAfterBattle');
  btn.setAttribute('style','position: absolute; top:0px; left:80px; font-size:11px; background: #f1f1f1; width:100px; z-index: 100; border: 1px #000000 solid; color: maroon;');
  btn.addEventListener('click', mobAfterBattle, false);
if(GM_getValue('mobAfter')==1)  btn.innerHTML = '<nobr>Отменить воплот</nobr>';
else{ GM_setValue('mobAfter',0);btn.innerHTML = '<nobr>Моб после боя</nobr>';}
  doc.body.appendChild(btn);
  var btn = doc.createElement('button');
  btn.setAttribute('id','teleportAfterBattle');
  btn.setAttribute('style','position: absolute; top:0px; left:180px; font-size:11px; background: #f1f1f1; width:110px; z-index: 100; border: 1px #000000 solid; color: maroon;');
  btn.addEventListener('click', teleportAfterBattle, false);
if(GM_getValue('teleporAfter')==1)  btn.innerHTML = '<nobr>Отменить телепорт</nobr>';
else{ GM_setValue('teleporAfter',0);btn.innerHTML = '<nobr>Телепорт после боя</nobr>';}
  doc.body.appendChild(btn);
}
function auto_andwari(){
	if(GM_getValue('auto_andwari')==1){
	GM_setValue('auto_andwari',0);
	GM_setValue('autobattle',0);
	doc.getElementById("auto_andwari").innerHTML='<nobr>андвари вкл.</nobr>';
	}
	else {
	GM_setValue('auto_andwari',1);
	location.href=location.href;
}
}
function change(){
	var req = new XMLHttpRequest();
	var url='/index.php?file=inventar_dress&press=c&set=0';
req.onreadystatechange = function() {
  if (req.readyState == 3) {
  req.abort();
	var req2 = new XMLHttpRequest();
	var url2='/index.php?file=inventar&show=magic&closemutant=1';
req2.onreadystatechange = function() {
  if (req2.readyState == 3) {
  req2.abort();
	var req3 = new XMLHttpRequest();
	var url3='/index.php?file=guild&mode=clon&act=change_clon';
req3.onreadystatechange = function() {
  if (req3.readyState == 3) {
  req3.abort();
setVoplot();
  }
};
		req3.open('GET', url3, true);
        req3.send(null);
  }
};
		req2.open('GET', url2, true);
        req2.send(null);
  }
};
		req.open('GET', url, true);
        req.send(null);
}
function mobAfterBattle(){
if(GM_getValue('mobAfter')==1){
GM_setValue('mobAfter',0);
doc.getElementById("mobAfterBattle").innerHTML='<nobr>Моб после боя</nobr>';
}
else {
GM_setValue('mobAfter',1);
doc.getElementById("mobAfterBattle").innerHTML='<nobr>Отменить воплот</nobr>';
}
}

function teleportAfterBattle(){
if(GM_getValue('teleporAfter')==1){
GM_setValue('teleporAfter',0);
doc.getElementById("teleportAfterBattle").innerHTML='<nobr>Телепорт после боя</nobr>';
}
else {
GM_setValue('teleporAfter',1);
doc.getElementById("teleportAfterBattle").innerHTML='<nobr>Отменить телепорт</nobr>';
}
}

function refresh(){
location.href=location.href;
}
  function main(){
if(GM_getValue('autobattle')==1){
patt2=/окончания боя/;
if(patt2.exec(document.documentElement.innerHTML) || ddoc.dsgStatus=='waitBat'){
setTimeout(refresh,300);
GM_setValue('toheal',0);
GM_setValue('setvopl',0);
GM_setValue('doTeleport',0);
}
else if(((ddoc.flBtl=='battle' || ddoc.flBtl=='battle2') && ddoc.dsgStatus=='battle')){
setTimeout(do_strikes,2000);
GM_setValue('toheal',0);
GM_setValue('setvopl',0);
GM_setValue('doTeleport',0);
}
else {
     patt=/Закрыть/;
if(result=patt.exec(document.documentElement.innerHTML)){
GM_setValue('toheal',0);
if(GM_getValue('mobAfter')==1)GM_setValue('setvopl',1);
else GM_setValue('setvopl',0);
if(GM_getValue('teleporAfter')==1)GM_setValue('doTeleport',1);
else GM_setValue('doTeleport',0);
location.href="http://www.bloodyworld.com/index.php?file=endbattle&cls=close";
}
}
}
}
  function menu_autobattle(){
	if(GM_getValue('autobattle')==1){
	GM_setValue('autobattle',0);
	location.href=location.href;
	}
	else {
	doc.getElementById("menu_autobattle").innerHTML='<nobr>прекратить</nobr>';
	GM_setValue('autobattle',1);
	setTimeout(do_strikes,2500);
}
}
function getdefpoints(maxdef){
defs=new Array();
k=0;
while(k<maxdef){
d=Math.floor(Math.random()*5);
if(!in_array(d,defs)){
switch(d){
case 0:selectDefPoint("head");break;
case 1:selectDefPoint("righthend");break;
case 2:selectDefPoint("body");break;
case 3:selectDefPoint("lefthend");break;
case 4:selectDefPoint("lags");break;
}
defs[k]=d;k++;}
}
return true;
}
function selectDefPoint(pnt){
for(var i=0; el = doc.forms['FormBattle'].elements[i]; i++){
if(el.name=='shit[]' && el.value==pnt && el.checked==false){el.checked=true;break;}
}
}
function do_strikes(){
x=Math.floor(Math.random()*7 + 20);
y=Math.floor(Math.random()*12 + 15);
form = doc.forms['FormBattle']
		var inp = doc.createElement('input');
		inp.value = x;
		inp.name = "go.x";
		form.appendChild(inp);	  
		var inp = doc.createElement('input');
		inp.value = y;
		inp.name = "go.y";
		form.appendChild(inp);	
maxdef=ddoc.MaxTotalDEF;
maxatck=ddoc.MaxTotalATK;
getdefpoints(maxdef);
fire="";
if(maxatck>1){
for(i=0;i<maxatck;i++){
a=Math.floor(Math.random()*5);
switch(a){
case 0:selectAttckPoint("head");break;
case 1:selectAttckPoint("righthend");break;
case 2:selectAttckPoint("body");break;
case 3:selectAttckPoint("lefthend");break;
case 4:selectAttckPoint("lags");break;
}
}}
else {
a=Math.floor(Math.random()*5);
switch(a){
case 0:selectAttckPoint("head");break;
case 1:selectAttckPoint("righthend");break;
case 2:selectAttckPoint("body");break;
case 3:selectAttckPoint("lefthend");break;
case 4:selectAttckPoint("lags");break;
}
}
doc.forms['FormBattle'].submit();
}
function selectAttckPoint(pnt){
for(var i=0; el = doc.forms['FormBattle'].elements[i]; i++){
if((el.name=='fire[]' || el.name=='fire') && el.value==pnt && el.checked==false){el.checked=true;break;}
}
}
function in_array(what, where) {
    var a=false;
    for(var i=0; i<where.length; i++) {
        if(what == where[i]) {
            a=true;
            break;
        }
    }
    return a;
}
function healFull(){    
GM_setValue('toheal',0);
	GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=list&wid=0&slot=0&item_type=magic",
    onload: function(response) {
     patt=/"uid":"[0-9]*", "wid":"([0-9]*)", "slot":"([0-9]*)", "item_type":"([^"]*)", "image":"[^"]*", "alert_type":"[^"]*", "name":"Полное восстановление", "add_mutant":""/;
if(result=patt.exec(response.responseText)){
wid=result[1];
slot=result[2];
item_type=result[3];
   GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=use&wid="+wid+"&slot="+slot+"&item_type="+item_type,
    onload: function(response) {
	location.href=location.href;
	}
});
}
	}
});
}
function setVoplot(){
GM_setValue('setvopl',0);
GM_setValue('mobAfter',0);
	GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=list&wid=0&slot=0&item_type=magic",
    onload: function(response) {
     patt=/"uid":"[0-9]*", "wid":"([0-9]*)", "slot":"([0-9]*)", "item_type":"([^"]*)", "image":"[^"]*", "alert_type":"magic_mutant", "name":"[^"]*", "add_mutant":(" [^"]*")/;
if(result=patt.exec(response.responseText)){
wid=result[1];
slot=result[2];
item_type=result[3];
mut_list=result[4];
pattm=/<option value=([^>]*)>[^<]*<\/option> "/
if(res=pattm.exec(mut_list)){
    GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=use&wid="+wid+"&slot="+slot+"&item_type="+item_type+"&list="+res[1],
    onload: function(response) {
location.href=location.href;
	}
});
}
else {
    GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=use&wid="+wid+"&slot="+slot+"&item_type="+item_type+"&list=traglodit",
    onload: function(response) {
location.href=location.href;
	}
});
}
}
	}
});

}
function doTeleport(){
GM_setValue('doTeleport',0);
GM_setValue('teleporAfter',0);
	GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=list&wid=0&slot=0&item_type=magic",
    onload: function(response) {
     patt=/"uid":"[0-9]*", "wid":"([0-9]*)", "slot":"([0-9]*)", "item_type":"([^"]*)", "image":"[^"]*", "alert_type":"magic_portal_adm", "name":"[^"]*", "add_mutant":""/;
if(result=patt.exec(response.responseText)){
wid=result[1];
slot=result[2];
item_type=result[3];
    GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.bloodyworld.com/index.php?file=rapid_panel&ajax=1&action=use&wid="+wid+"&slot="+slot+"&item_type="+item_type+"&portal_adm=elf",
    onload: function(response) {
location.href=location.href;
	}
});
}
	}
});
}