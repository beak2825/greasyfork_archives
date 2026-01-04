// ==UserScript==
// @name         Mimeface
// @namespace    zero.mimeface.torn
// @version      0.1
// @description  Hides users who have been messaged!
// @author       -zero [2669774]
// @match        https://www.torn.com/messages.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469762/Mimeface.user.js
// @updateURL https://update.greasyfork.org/scripts/469762/Mimeface.meta.js
// ==/UserScript==

var mimefacelist = localStorage.getItem('mimefacelist') || "{}";
mimefacelist = JSON.parse(mimefacelist);
var curtime = Date.now();

function capture(){
    if ($('.form-submit-send').length > 0){
        $('.form-submit-send').on('click',function(){
            save();
        });
        console.log('Doneda');

    }
    else{
        setTimeout(capture,300);
    }
}

function clear(){
    for (var id in mimefacelist){
        if (Date.now() - mimefacelist[id] > 364*24*60*60*1000){
            delete mimefacelist[id];
        }
    }
    localStorage.setItem('mimefacelist', JSON.stringify(mimefacelist));
}

function hide(){
    console.log('hiding');
    $('.user-info-list-wrap > li').each(function(){
        var id = $(this).attr('class').substring(4);
        console.log(id);
        if (mimefacelist[id]){
            $(this).hide();
        }
    });
}

function save(){
    var id = $('#ac-search-0').attr('value').split(' ')[1].slice(1,-1);
    mimefacelist[id] = Date.now();
    localStorage.setItem('mimefacelist', JSON.stringify(mimefacelist));
}

var url = window.location.href;

clear();

if (url.includes('messages')){
    capture();
}
else{
    setInterval(hide, 1000);
}


