// ==UserScript==
// @name 	SwagTv script
// @description	this script will automatically fetch and go to the next video after the meter goes up. 
// @version 0.34
// @include	http://video.swagbucks.com/*
// @require      http://code.jquery.com/jquery-git.js
// @namespace swagtv
// @downloadURL https://update.greasyfork.org/scripts/1126/SwagTv%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/1126/SwagTv%20script.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------

var iLoops = 0;
window.setInterval(reloadTimer,1000);
var notes = false;

var k = getK();

$("video-title").remove();
$("commentsCont").remove();

var randomNum = 0;

function getK(){
    $("#video-title").remove();
    $("#commentsCont").remove();
    var m = $('div.thumb-container.next-item a').attr("href");
    if (!m){
        if (!$('span.feed-ajax-next').length)
            m = null;
        else{
            $('span.feed-ajax-next').click();
            setTimeout(function() { getURL() }, 5000);
        }
    }
    return m
}

function getURL(){
    var m = $('div.thumb-container:first a').attr("href");
    k=m;
}

function reloadTimer(){
    iLoops++;
    if (iLoops%5==0)
        console.log(iLoops);
    if (iLoops == 5) {
        console.log(k);
        if ($("#meterDuplicateVideo").is(':visible'))
            randomNum = 8;
        else 
            randomNum = Math.floor(Math.random()*15 + 50);            
        if (k == null) 
            notes = true;
    }

    if (iLoops == randomNum){
        console.log("Match!");
        if ($("#sbvd_capText").is(":visible")) 
            alert('Captcha');
        else {
            if (notes)
                alert("Pick a new category");
            else{
                link = k;
                window.location.href = link;
            }
        }
    }
}