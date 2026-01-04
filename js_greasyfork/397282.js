// ==UserScript==
// @name         Голосовой ввод
// @version      1.7
// @description  Набор текста в интерфейсе таксометра очереди паспортов с помощью голоса.
// @require      http://code.jquery.com/jquery-3.2.1.js
// @author       ALMAZOV
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @grant        none
// @namespace    https://greasyfork.org/ru/users/395815-almazov
// @downloadURL https://update.greasyfork.org/scripts/397282/%D0%93%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%B2%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/397282/%D0%93%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%B2%D0%BE%D0%B4.meta.js
// ==/UserScript==
 
(function()
{
'use strict';
 
var recognition = new webkitSpeechRecognition();
var speechRecognitionList = new window.webkitSpeechGrammarList();
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
 
$(document).on('click','#record', function()
{
recognition.start();
});
 
recognition.onresult = function(event)
{
var speech = event.results[0][0].transcript;
speech = firstToUpperCase(speech);
speech = speech.replaceAll(" аллея "," 	ал. ");
speech = speech.replaceAll(" без номера "," б/н ");
speech = speech.replaceAll(" бульвар "," б-р ");
speech = speech.replaceAll(" воинская часть "," в/ч ");
speech = speech.replaceAll(" город "," г. ");
speech = speech.replaceAll(" городок "," г-к ");
speech = speech.replaceAll(" городской поселок "," гп. ");
speech = speech.replaceAll(" деревне "," д. ");
speech = speech.replaceAll(" деревня "," д. ");
speech = speech.replaceAll(" дом "," д. ");
speech = speech.replaceAll(" дробь "," 	/ ");
speech = speech.replaceAll(" имени "," им ");
speech = speech.replaceAll(" квартал "," кв-л ");
speech = speech.replaceAll(" квартира "," кв. ");
speech = speech.replaceAll(" квартиры "," кв. ");
speech = speech.replaceAll(" квартире "," кв. ");
speech = speech.replaceAll(" километр "," 	км ");
speech = speech.replaceAll(" комната "," ком. ");
speech = speech.replaceAll(" корпус "," корп. ");
speech = speech.replaceAll(" линия "," лн. ");
speech = speech.replaceAll(" литера "," лит. ");
speech = speech.replaceAll(" микрорайон "," мкр. ");
speech = speech.replaceAll(" общежитие "," общ. ");
speech = speech.replaceAll(" переезд "," пер-д ");
speech = speech.replaceAll(" переулок "," пер. ");
speech = speech.replaceAll(" площадь "," пл. ");
speech = speech.replaceAll(" помещение "," 	помещ. ");
speech = speech.replaceAll(" поселок "," п. ");
speech = speech.replaceAll(" поселок городского типа "," пгт. ");
speech = speech.replaceAll(" проезд "," пр-д ");
speech = speech.replaceAll(" проспект "," пр-кт. ");
speech = speech.replaceAll(" рабочий поселок "," рп. ");
speech = speech.replaceAll(" село ","  с. ");
speech = speech.replaceAll(" сила "," с. ");
speech = speech.replaceAll(" селе "," с. ");
speech = speech.replaceAll(" слобода "," сл. ");
speech = speech.replaceAll(" станица "," ст-ца. ");
speech = speech.replaceAll(" станице "," ст-ца. ");
speech = speech.replaceAll(" станция "," ст. ");
speech = speech.replaceAll(" страница "," ст-ца. ");
speech = speech.replaceAll(" строение "," стр. ");
speech = speech.replaceAll(" улица "," ул. ");
speech = speech.replaceAll(" улице "," 	ул. ");
speech = speech.replaceAll(" хутор "," х. ");
speech = speech.replaceAll(" шоссе "," ш. ");

switch (speech)
{
case "История":
window.open('https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=identity','_self');
break;
case "История ДКВУ":
window.open('https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkvu','_self');
break;
case "Черный список":
window.open('https://taximeter-admin.taxi.yandex-team.ru/blacklist/item/add/','_self');
break;
case "Админка":
window.open('https://tariff-editor.taxi.yandex-team.ru/show-driver','_self');
break;
case "Статистика":
window.open('https://stat.yandex-team.ru/taxi.yandex.ru/Quality%20Control/QC%20resolution%20report?scale=d&qc_type=_in_table_&assessor_login=almazov&resolution=_total_&city=_total_&_incl_fields=qc_ids&date_min=2020-03-04+00%3A00%3A00&date_max=2020-03-04+23%3A59%3A59', '_blank');
break;
default:
$('.im_editable.im-chat-input--text._im_text').focus();
var now = $('.im_editable.im-chat-input--text._im_text').text();
if(now.length>0)
{
$('.im_editable.im-chat-input--text._im_text').text(now+'. '+speech);
}
else
{
$('.im_editable.im-chat-input--text._im_text').text(speech);
}
$('.im_editable.im-chat-input--text._im_text').click();
}
};
 
var microphone = '<div id="nav" style="display: initial"><object id="microphone" style="position: relative; float: left; bottom: -9px; margin-right: 10px; margin-left: 5px; z-index: 10" data="https://site-icons.ru/microphone.svg"></object></div>';
var listen = '<a id="fon" style="height: 42px; position: absolute; margin-left: -45px;" class="top_nav_btn"></a><a id="record" style="height: 42px; position: absolute; margin-left: -45px; z-index: 11; opacity: 0!important" class="top_nav_btn"></a>';
$("#top_notify_btn").before(microphone);
$("#nav").append(listen);
 
$(function() {
$('#record').hover(function() {
$('#fon').css('background-color', 'rgb(61, 104, 152)');
}, function() {
$('#fon').css('background-color', '');
});
});
 
function firstToUpperCase(str)
{
return str.substr(0, 1).toUpperCase() + str.substr(1);
}
 
String.prototype.replaceAll = function(search, replace)
{
return this.split(search).join(replace);
};
 
// Горячая клавиша "стрелка вниз" также активирует микрофон
$(document).keyup(function(e){if (e.keyCode == 40)
{
recognition.start();
}});
 
})();