// ==UserScript==
// @name         MAAT
// @namespace    
// @version      2.0
// @description  Accepts all HITs on the given page then reloads.
// @author       Kadauchi (rewrite), ikarma
// @include      https://www.mturk.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/11940/MAAT.user.js
// @updateURL https://update.greasyfork.org/scripts/11940/MAAT.meta.js
// ==/UserScript==

// Set true/false for sound.
var sound = true;
var urlIdx = 0;



// Change URL for custom sounds.
Beep = new Audio("http://www.soundjay.com/button/sounds/beep-07.mp3");
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\                                                          //==[Just change the url to use whatever sound you want]==\\

//$("a:contains('All HITs')").before('<button id="Reload" type="button"><span>Reload</span></button>');
//$("a:contains('All HITs')").before('<span class="almostblack_text">&nbsp;&nbsp;|&nbsp;&nbsp;</span>');

//$('#Reload').click(function() {
//    PandA();
//});

// Changes the preview link to a panda.
var preview_link_change = function(){
    $("a:contains('View a HIT in this group')").each(function(){
        var newurl = $(this).attr('href').replace('preview','previewandaccept');
        $(this).attr('href', newurl);
    });
};

preview_link_change();

// Grabs all of the URLs.
var urlsToLoad =  $("a:contains('View a HIT in this group')");

// panda function

function PandA()
{
    var numUrls = urlsToLoad.length;
    //alert(urlIdx);
    //document.body.innerHTML =urlsToLoad[urlIdx];
    if (urlIdx <= numUrls){
        $.get(urlsToLoad[urlIdx] , function(data) { 
            if(data.indexOf("Automatically accept the next HIT") >= 0) {
                setTimeout(mCoinSound.play(),800);
                urlIdx--;
            }                              
        });     
        urlIdx++;
        setTimeout(PandA, 800);
    }
}

if (document.location.toString().indexOf('#Reload') != -1){
    $("a:contains('All HITs')").before('<a href="#" class="subnavclass" onClick="window.history.back();">Stop Reload</a>');
    $("a:contains('All HITs')").before('<span class="almostblack_text">&nbsp;&nbsp;|&nbsp;&nbsp;</span>');
    PandA();
} else {
    $("a:contains('All HITs')").before('<a href="'+location+'#Reload" class="subnavclass" onClick="window.location.reload(true);">Reload</a>');
    $("a:contains('All HITs')").before('<span class="almostblack_text">&nbsp;&nbsp;|&nbsp;&nbsp;</span>');
}
