// ==UserScript==
// @name         Youtube - Zaebis/Huina
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Better Likes/Dislikes
// @author       You
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444800/Youtube%20-%20ZaebisHuina.user.js
// @updateURL https://update.greasyfork.org/scripts/444800/Youtube%20-%20ZaebisHuina.meta.js
// ==/UserScript==
var changes=["ЗАЕБИСЬ!","ХУЙНЯ!"];
function setup()
{
    var elements = document.getElementsByClassName("style-scope ytd-toggle-button-renderer");
    if(elements.length>=4)
    {
        var cur = 0;
        for(var i = 0 ; i<=elements.length ; i++)
        {
            if(elements[i].id=='text')
            {
                console.log('changed');
                elements[i].innerHTML=changes[cur];
                cur++;
            }
        }
    }
    setTimeout(() => setup(), 250);
}
setup();