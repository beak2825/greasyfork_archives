// ==UserScript==
// @name         Adblock for video commercials
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Erykizd
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getadblock.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482129/Adblock%20for%20video%20commercials.user.js
// @updateURL https://update.greasyfork.org/scripts/482129/Adblock%20for%20video%20commercials.meta.js
// ==/UserScript==

'use strict';

var flag = true;
setInterval(()=>{skipAd()}, 1000);
document.addEventListener('keydown',(event)=>{onKeyDown(event)});

function onKeyDown(event)
{
    if(event.key.toLocaleLowerCase() == "l")
    {
       flag = !flag;
    }
}

function skipAd()
{
    if(flag)
    {
        var videos = document.getElementsByTagName("video");
        for(let i = 0; i < videos.length; i++)
        {
            if(videos[i].duration <= 180)
            {
                videos[i].currentTime = videos[i].duration;
            }
        }
        skipAdBtnClick();
    }
}

function skipAdBtnClick()
{
    var btns = document.getElementsByTagName("button");
    for(let i = 0; i < btns.length; i++)
    {
		let btnText = btns[i].innerText;
        if(btnText.toLowerCase()=="pomiń"
           || btnText.toLowerCase()=="pomiń reklamę"
           || btnText.toLowerCase()=="skip")
        {
            btns[i].click();
        }
    }
}
