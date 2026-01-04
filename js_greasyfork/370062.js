// ==UserScript==
// @name VkGroupDialogUserIgnore
// @namespace Eliont
// @version 1.0
// @description Скрывает в беседках сообщения указанных пользователей, как в дискорде.
// @include https://vk.com/*
// @include http://vk.com/*
// @grant none
// @copyright  2018+, Eliont
// @downloadURL https://update.greasyfork.org/scripts/370062/VkGroupDialogUserIgnore.user.js
// @updateURL https://update.greasyfork.org/scripts/370062/VkGroupDialogUserIgnore.meta.js
// ==/UserScript==

var names = new Array();

//alert('Loaded');

var element = document.getElementById('content');
element.addEventListener("DOMNodeInserted", Filter, false);
element.addEventListener("wheel", Filter, false);

setInterval(Filter, 1000);

function Filter ()
{
    //alert('Filter before chat id');
    if(window.location.href.indexOf("sel=c00") < 0) {
        return;
    }

    //alert('Filter after chat id');
    for(var i=0; i<names.length; i++)
    {
        //alert(names[i]);
        var selector = 'a[href="/'+names[i]+'"]';
        //alert(selector);
        var spam = document.querySelectorAll(selector);
        //if (spam.length > 0) { alert(selector + ' ' + spam.length); }

        for(var j=0; j<spam.length; j++)
        {
            if (spam[j].parentElement.parentElement.parentElement.style.display != 'none'){
            spam[j].parentElement.parentElement.parentElement.style.display='none';}
        }
    }
}