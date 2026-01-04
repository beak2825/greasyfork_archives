// ==UserScript==
// @name         Colorise_Bots
// @namespace    http://tampermonkey.net/
// @version      0.1120
// @description  try to take over the world!
// @author       Life
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png
// @grant        none
// @grant        unsafeWindow
// @grant        GM_info
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/412967/Colorise_Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/412967/Colorise_Bots.meta.js
// ==/UserScript==
/* jshint esversion: 6*/
(function() {
const l=document.getElementById("chat_logs_container");
document.querySelector('#chat_left_menu').insertAdjacentHTML("beforeend",'<div class="list_element left_item" onclick="document.getColorise();">'
+'<div class="left_item_in"><i class="fa fa-paint-brush menui"></i>Раскраська				</div>'
+'<div class="left_notify"><span id="news_notify" class="notif_left bnotify" style="display: none;"></span></div></div>');
var sb=function(b){
var a=$('.chatbot_settings '+b+'SelectBoxItOptions .selectboxit-focus').attr('data-val');
if (!a) a=$('.chatbot_settings '+b+'SelectBoxItOptions .selectboxit-selected').attr('data-val');
return a;}
$(document).on('click', '.b_name_choice', function() {var qq={};
var curColor = $(this).attr('data');
if(!localStorage.colorise)qq={}; else qq=JSON.parse(localStorage.colorise);
var a=sb('#set_bot');
var b=sb('#set_bot_obj');
if(!qq[a])qq[a]={};
if($('.my_name_color').attr('data') == curColor){$('.bccheck').remove();$('.my_name_color').attr('data', '');}
else {$('.bccheck').remove();$(this).append('<i class="bccheck fa fa-check"></i>');$('.my_name_color').attr('data', curColor);}
qq[a][b==1?'a':'b']=curColor;
localStorage.colorise=JSON.stringify(qq);});
var ud=function() {var qq={};
if(!localStorage.colorise)qq={}; else qq=JSON.parse(localStorage.colorise);
var a=sb('#set_bot');
var b=sb('#set_bot_obj');
if(!qq[a])qq[a]={};
var curColor=qq[a][b==1?'a':'b'];
if(curColor&&curColor.indexOf('bcolor')+1){
$('.bccheck').remove();
$('[data="'+curColor+'"].color_switch').append('<i class="bccheck fa fa-check"></i>');
$('.my_name_color').attr('data', curColor);}
else {
$('.bccheck').remove();
$('.my_name_color').attr('data', '');}}
$(document).on('click', '.chatbot_settings', ud);
var bots=[[56121,'AstralBot'],[99976495,'AstralBro'],[12826,'MafiaBot'],[15282,'Лакей']];
var getColorise=function(){var html = '<div class="pad_box"><div class="chatbot_settings"><p class="label">БОТ</p><select id="set_bot">'+bots.reduce((a,b,c)=>{return a+'<option '+(c?'':'selected ')+'value="'+b[0]+'">'+b[1]+'</option>'},'')+'</select> <div class="clear10"></div><p class="label">ЦВЕТ</p><select id="set_bot_obj"><option selected value="1">Ника</option><option value="2">Текста</option></select></div> <div class="clear10"></div><div class="my_name_color" data="">'
+'za1zb1zcza2zb2zcza3zb3zcza4zb4zcza5zb5zcza6zb6zcza7zb7zcza8zb8zcza9zb9zcza10zb10zcza11zb11zcza12zb12zcza13zb13zcza14zb14zcza15zb15zcza16zb16zcza17zb17zcza18zb18zcza19zb19zcza20zb20zcza21zb21zcza22zb22zcza24zb24zcza26zb26zcza27zb27zcza28zb28zcza29zb29zcza30zb30zcza31zb31zcza32zb32zcza33zb33zcza34zb34zcza35zb35zcza100zb100zcza101zb101zcza102zb102zcza103zb103zcza104zb104zc</div><div class="clearzc'.replaceAll(/za/g,'<div data="bcolor').replaceAll(/zb/g,'"  class="color_switch b_name_choice bcback').replaceAll(/zc/g,'"></div>');showModal(html);ud();}
l.addEventListener("DOMNodeInserted", (e)=>{if(e.target.getElementsByClassName&&e.target.getElementsByClassName("my_text").length){
var rl=e.target.getElementsByClassName("get_av");
if (rl.length&&rl[0].getAttribute('onclick'))rl=rl[0].getAttribute('onclick').split("'")[3]; else return;
if(!localStorage.colorise)var qq={}; else qq=JSON.parse(localStorage.colorise);
if (qq[rl]){var un=e.target.getElementsByClassName("username");un[0].className="username "+qq[rl].a;un[0].style='';
var cm=e.target.getElementsByClassName("chat_message");cm[0].className="chat_message "+qq[rl].b;for(var i=0;i<cm[0].children.length;i++){cm[0].children[i].style='';}}}}, false);
document.getColorise=getColorise;
console.log(GM_info.script.name+' v'+GM_info.script.version+' run');
})();