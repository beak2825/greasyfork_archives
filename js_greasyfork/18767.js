// ==UserScript==
// @namespace   ileca
// @name        Ileca's Fap Viewer
// @description Fap hand in hand with Ileca for a better tomorrow.
// @version     2.1.0
// @include     https://exhentai.org/s/*
// @include     https://e-hentai.org/s/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/18767/Ileca%27s%20Fap%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/18767/Ileca%27s%20Fap%20Viewer.meta.js
// ==/UserScript==

var auto, now;
auto = now = GM_getValue('auto');
if(auto === undefined)
{
    auto = 'y';
    now = 'y';
}

$('body').css('background','#34353b').css('color','#f1f1f1');
$('#i1').css('background','#4f535b');
$('a').css('color','#f1f1f1');
$('div.sni').css('border-color','#000000');

function pageNumber() {
    var page_number = $('#i2 .sn > div').text();
    $('#img').prop('title', page_number);
}
pageNumber();

function resizer(){
    observer.disconnect();
    pageNumber();
    var img = $("#img");
    var ViewportH = $(window).height();
    wrapper.css('position','fixed').css('top',0).css('left',0).css('z-index',10).css('width','100%').css('height',ViewportH+'px').css('line-height',ViewportH+'px').css('background-color','black');
    imgH = img.height();
    imgW = img.width();
    var ratio = ViewportH/imgH;
    img.css('height',ViewportH+'px').css('width',ratio*imgW+'px');
    observer.observe(target,config);
}

function desizer(){
    $(window).off('resize');
    observer.disconnect();
    wrapper.css('position','static').css('background-color','').css('height','').css('line-height','');
    $("#img").css('height','auto').css('width','auto');
}

wrapper = $("#i3");
var target = wrapper.get(0);
var observer = new MutationObserver(resizer);
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
};
if(auto == 'y') observer.observe(target,config);

$(document).keypress(function(e) {
    if(e.which == 43 || e.which == 109) $('#i5 a')[0].click();//(+)/(M) >gallery main page
    else if(e.which == 13)
    {
        if(now == 'y')
        {
            desizer();
            now = 'n';
        }
        else
        {
            resizer();
            now = 'y';
        }
    }
    else if(e.which == 45 || e.which == 102) $('.ip a')[0].click();//(-)/(F) Key >front page
    else if(e.which == 103) $('#i6 a')[0].click();//(G) Key >show all galleries with this file
});

function setSetting(){
    newSet = prompt('Auto-trigger IFV at start? Choices: y/n.\nPlaceholder = current setting.',auto);
    if(newSet == 'y' || newSet == 'n')
    {
        if(newSet != auto) GM_setValue('auto',newSet);
        auto = newSet;
        alert('New setting properly saved. Refresh if you want to see the change.');
    }
    else if(newSet !== null) alert('Wrong value. New setting could not be set.');
}
GM_registerMenuCommand("Ileca's Fap Viewer > settings",setSetting);
