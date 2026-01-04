// ==UserScript==
// @name         VK Voice
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Набор текста в сообщениях ВКонтакте с помощью голоса.
// @require      http://code.jquery.com/jquery-3.2.1.js
// @author       ggscript
// @match        *://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39534/VK%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/39534/VK%20Voice.meta.js
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
speech = speech.replaceAll(" плюс "," + ");
speech = speech.replaceAll(" минус "," - ");
speech = speech.replaceAll(" делить "," : ");
speech = speech.replaceAll(" умножить "," * ");
speech = speech.replaceAll(" равно "," = ");
switch (speech)
{
case "Отправить":
$("div.im-chat-input--txt-wrap._im_text_wrap > button").click();
break;
case "Send":
$("div.im-chat-input--txt-wrap._im_text_wrap > button").click();
break;
case "Сообщения":
window.open('https://vk.com/im','_self');
break;
case "Новости":
window.open('https://vk.com/feed','_self');
break;
case "Настройки":
window.open('https://vk.com/settings','_self');
break;
case "Музыка":
window.open('https://vk.com/audio','_self');
break;
case "Салют":
Ny2018.startFlapper();
break;
case "Поддержка":
window.open('https://vk.com/support?act=new', '_blank');
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