// ==UserScript==
// @name       LF Clickable Userbars
// @namespace  http://leakforums.net/
// @version    1.7.3
// @description  Harvey R Specter
// @match      http://*leakforums.*/*
// @copyright  2015+, You
// @downloadURL https://update.greasyfork.org/scripts/13022/LF%20Clickable%20Userbars.user.js
// @updateURL https://update.greasyfork.org/scripts/13022/LF%20Clickable%20Userbars.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');
var a = '<a href="/forumdisplay.php?fid=';
for (var i = 0; i < tags.length; i++)
{
    var b = '">'+tags[i].outerHTML+'</a>';
    var tag = tags[i].src;
    
    if (tag.indexOf("awesome") !== -1) { tags[i].outerHTML = a+'86'+b; }
    if (tag.indexOf("elite5") !== -1) { tags[i].outerHTML = a+'121'+b; }
    if (tag.indexOf("olympus") !== -1) { tags[i].outerHTML = a+'290'+b; }
    if (tag.indexOf("0-200-d7554e71e8-5a504896a1") !== -1) { tags[i].outerHTML = a+'290'+b; }
    if (tag.indexOf("325-200-02d8212df1-5a504896a1") !== -1) { tags[i].outerHTML = a+'290'+b; }
    if (tag.indexOf("inception") !== -1) { tags[i].outerHTML = a+'452'+b; }
    if (tag.indexOf("333-200-bd60f09c0b-cc438b4ab6") !== -1) { tags[i].outerHTML = a+'452'+b; }
    if (tag.indexOf("312-200-f908486397-cc438b4ab6") !== -1) { tags[i].outerHTML = a+'452'+b; } 
    if (tag.indexOf("243-50-5aca863f85-cc438b4ab6") !== -1) { tags[i].outerHTML = a+'452'+b; }     
    if (tag.indexOf("Core") !== -1) { tags[i].outerHTML = a+'589'+b; }    
    if (tag.indexOf("0-200-e00659e9b5-54e47d7a0c.png") !== -1) { tags[i].outerHTML = a+'589'+b; }
    if (tag.indexOf("174-200-b8e27e9ad1-54e47d7a0c.png") !== -1) { tags[i].outerHTML = a+'589'+b; }
    if (tag.indexOf("legion_ub") !== -1) { tags[i].outerHTML = a+'173'+b; }
    if (tag.indexOf("mCOmRGJ") !== -1) { tags[i].outerHTML = a+'585'+b; }
    if (tag.indexOf("0-50-a56b4c37dc-0b10852367") !== -1) { tags[i].outerHTML = a+'585'+b; }
    if (tag.indexOf("warlordshouldprollykillhimselfbecauseofthisfilenamebeingsolong") !== -1) { tags[i].outerHTML = a+'574'+b; }
    if (tag.indexOf("34-200-12b58314a9-2a74a166ec") !== -1) { tags[i].outerHTML = a+'574'+b; } 
    if (tag.indexOf("272-50-4490af3833-2a74a166ec") !== -1) { tags[i].outerHTML = a+'574'+b; } 
    if (tag.indexOf("rotten") !== -1) { tags[i].outerHTML = a+'634'+b; }
    if (tag.indexOf("Sponsor") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("52-200-48a5926c7b-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("171-156-e3c6dedb40-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("staff") !== -1) { tags[i].outerHTML = a+'117'+b; }
    if (tag.indexOf("support") !== -1) { tags[i].outerHTML = a+'117'+b; }
    if (tag.indexOf("neko") !== -1) { tags[i].outerHTML = a+'599'+b; }
    if (tag.indexOf("183-200-f2b24dddcb-a711f083bc") !== -1) { tags[i].outerHTML = a+'599'+b; }
    if (tag.indexOf("elite2") !== -1) { tags[i].outerHTML = a+'99'+b; }
    if (tag.indexOf("Monetizer") !== -1) { tags[i].outerHTML = a+'145'+b; }
    if (tag.indexOf("137-91-2d52f470ae-663c6a1735") !== -1) { tags[i].outerHTML = a+'429'+b; }
    if (tag.indexOf("295-75-bf83624720-663c6a1735") !== -1) { tags[i].outerHTML = a+'429'+b; }
    if (tag.indexOf("0-200-a59a3773fe-663c6a1735") !== -1) { tags[i].outerHTML = a+'429'+b; }
    if (tag.indexOf("armenplzdiejustplz") !== -1) { tags[i].outerHTML = a+'429'+b; }
    if (tag.indexOf("314-200-d81a1b8a45-663c6a1735") !== -1) { tags[i].outerHTML = a+'429'+b; }
    if (tag.indexOf("medal") !== -1) { tags[i].outerHTML = a+'121'+b; }
    if (tag.indexOf("Coder") !== -1) { tags[i].outerHTML = a+'261'+b; }
    if (tag.indexOf("lounge") !== -1) { tags[i].outerHTML = a+'18'+b; }
    if (tag.indexOf("random") !== -1) { tags[i].outerHTML = a+'248'+b; }
    if (tag.indexOf("360-64-7740048eb1-a711f083bc") !== -1) { tags[i].outerHTML = a+'599'+b; }
    if (tag.indexOf("sponsor") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("0-50-17f89424e8-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("250-50-15e086430a-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("244-50-d30e0d4d61-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("268-200-2f49562c87-2bb17cc367") !== -1) { tags[i].outerHTML = a+'249'+b; }
    if (tag.indexOf("LFawards") !== -1) { tags[i].outerHTML = a+'288'+b; }
}