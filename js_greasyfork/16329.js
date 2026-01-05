// ==UserScript==
// @name         MyDealz-Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Phantomaz
// @include     http://www.mydealz.de/*
// @require	http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16329/MyDealz-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/16329/MyDealz-Filter.meta.js
// ==/UserScript==

//FilterArray. Weitere Namen können ergänzt werden. Bsp: statt ['BENUTZERNAME'] -> ['A','B']
var BLOCKED_USERS = ['BENUTZERNAME'];

//Löschen von allen Deals/Threads auf die der Filter zutrifft. Falls nicht gewünscht, vor "filter" einfach "//" ergänzen (ohne Anführungszeichen)
filter('.thread-author','.thread');
//Löschen von allen Kommentaren auf die der Filter zutrifft
filter('.avatar-link','.comments-item');

function filter(c1,c2)
{
$(c1).each(function() {
    var found = false;
    for (var i = 0; i < BLOCKED_USERS.length && !found; i++)    
        if ($(this).attr('href').indexOf(BLOCKED_USERS[i])>-1)
            found = true;        
    if (found)
        $(this).closest(c2).remove();
});
}

