// ==UserScript==
// @name 	Вакаба-разметка для vk.com
// @author      Anza Nyanza
// @namespace  	vk.com/nyanza
// @version    	1.2.2
// @description Включает вакаба-разметку в сообщениях ВК.
// @match       *.vk.com/*
// @icon        https://2ch.hk/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/21785/%D0%92%D0%B0%D0%BA%D0%B0%D0%B1%D0%B0-%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20vkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/21785/%D0%92%D0%B0%D0%BA%D0%B0%D0%B1%D0%B0-%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20vkcom.meta.js
// ==/UserScript==

function repl(str){
    str = str.replace(/\*\*(.*?)\*\*/gim, '<span class="bold">$1</span>');
    str = str.replace(/\*(.*?)\*/gim, '<span class="italic">$1</span>');
    str = str.replace(/\%\%(.*?)\%\%/gim, '<span class="spoiler">$1</span>');
    str = str.replace(/(&gt;.*?)</gim, '<span class="quote">$1</span><');
    str = str.replace(/\[s\](.*?)\[\/s\]/gim, '<span class="strikeout">$1</span>');
    str = str.replace(/\[2ch\]/gim, '<img src="http://cs6.pikabu.ru/images/avatars/1142/s1142061-1782739729.jpg"/>');
    str = str.replace(/\[sub\](.*?)\[\/sub\]/gim, '<span class="sub">$1</span>');
    str = str.replace(/\[sup\](.*?)\[\/sup\]/gim, '<span class="sup">$1</span>');
    str = str.replace(/\[u\](.*?)\[\/u\]/gim, '<span class="underline">$1</span>');
    str = str.replace(/\[o\](.*?)\[\/o\]/gim, '<span class="overline">$1</span>');
    str = str.replace(/\`(.*?)\`/gim, '<span class="code">$1</span>');
    str = str.replace(/~(.*?)~/gim, '<span class="marked">$1</span>');
    str = str.replace('<div', '<div wak');
    str = str.replace('<span class="nim-dialog--preview _dialog_body"', '<span class="nim-dialog--preview _dialog_body" wak');
    return str;
}

function markUp(){
	for(var i = 0; typeof document.getElementsByClassName('_im_log_body')[i] != 'undefined'; i++){
        var string = document.getElementsByClassName('_im_log_body')[i].innerHTML;
        if (string.indexOf('wak') == -1){
            document.getElementsByClassName('_im_log_body')[i].innerHTML = repl(string);
        }
    }
    for(var i2 = 0; typeof document.getElementsByClassName('nim-dialog--text-preview')[i2] != 'undefined'; i2++){
        var string2 = document.getElementsByClassName('nim-dialog--text-preview')[i2].innerHTML;
        if (string2.indexOf('wak') == -1){
            document.getElementsByClassName('nim-dialog--text-preview')[i2].innerHTML = repl(string2);
        }
	}
}

var html_doc = document.getElementsByTagName('head').item(0);
var css = document.createElement('style');
css.setAttribute('type', 'text/css');
css.innerHTML = '.spoiler{background: #888; color: #888; padding: 0 3px} .spoiler:hover{color: #fff} .italic{ font-style: italic;} .bold{ font-weight: bold;} .quote{ color: #789922;} .strikeout{ text-decoration: line-through} .sub{vertical-align: sub; font-size: 12px;} .sup{vertical-align: super; font-size: 12px;} .underline{text-decoration: underline} .overline{text-decoration: overline} .code{border: 1px solid #ddd; border-radius: 2px; padding: 1px 4px} .marked{background: #FFFF00}';
html_doc.appendChild(css);
var timer = setInterval(markUp, 100);