// ==UserScript==
// @name        muahahaha vimeo
// @namespace   muahahaha
// @version     1.0
// @include     https://player.vimeo.com/video/*
// @description fuck you vimeo
// @downloadURL https://update.greasyfork.org/scripts/386637/muahahaha%20vimeo.user.js
// @updateURL https://update.greasyfork.org/scripts/386637/muahahaha%20vimeo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config=document.body.innerHTML.slice(document.body.innerHTML.indexOf('var config'),document.body.innerHTML.indexOf('config.request'));
    config=config.slice(config.indexOf('{'),config.lastIndexOf(';'));
    config=JSON.parse(config);

    let div=document.createElement('div');
    document.body.appendChild(div);
    div.style.position='absolute';
    div.style.top='0px';
    div.style.left='3em';
    div.style.zIndex='9999';
    div.style.display='none';
    div.style.background='silver';
    div.style.whiteSpace='pre';
    div.innerHTML=config.request.files.progressive.map(($v)=>('<b>'+$v.height+'p</b>\t<input onclick="this.select()" value="'+$v.url+'"/>\t<a href="'+$v.url+'" target="_blank">abrir<sup>⇗</sup></a> <br/>')).join('');

    let bot=document.createElement('input');
    document.body.appendChild(bot);
    bot.type='button';
    bot.value='[+]';
    bot.style.position='absolute';
    bot.style.top='0px';
    bot.style.left='0px';
    bot.style.padding='0px';
    bot.style.zIndex='9999';
    bot.style.width='3em';
    bot.style.fontFamily='monospace';
    bot.onclick=function(){
        if(this.value=='[+]'){
            this.value='[-]';
            div.style.display='';
        }
        else{
            this.value='[+]';
            div.style.display='none';
        }
    };

})();