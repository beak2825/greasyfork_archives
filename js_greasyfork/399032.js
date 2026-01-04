// ==UserScript==
// @name         Bandcamp Volume Bar
// @version      1.8.0
// @description  adds a volume bar to Bandcamp
// @author       @HiImBlu, forked by @stib
// @match        *://*.bandcamp.com/*
// @exclude      *://bandcamp.com/
// @grant        GM_addStyle
// @license      DWTFYWWI https://github.com/avar/DWTFYWWI/blob/master/DWTFYWWI
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// @namespace https://pureandapplied.com.au/bandcampVolumeBar
// @downloadURL https://update.greasyfork.org/scripts/399032/Bandcamp%20Volume%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/399032/Bandcamp%20Volume%20Bar.meta.js
// ==/UserScript==
/* global $ */

//Awesome Tags!
$("audio").attr("id", "audioSource");
$("<div class='volumeControl'></div>").insertAfter(".inline_player");
$(".volumeControl").append("<div class='speaker'></div>");
$(".volumeControl").append("<div class='volume'></div>");
$(".volume").append("<span class='volumeInner'></span>");

//CSS Time!
let savedPercentage = getCookie("bandCampVolumeBar_volume");
let percentage = isNaN (parseFloat(savedPercentage))?
    50:
    parseFloat(savedPercentage);

let color = $("#pgBd").css("background-color");
console.log (color);
const css = ".volumeControl { margin-bottom: 6px; }" +
          ".speaker {" +
            "position: relative;" +
            "float: left;" +
            "width: 54px;" +
            "height: 8px;" +
            "border-radius: 1px;"+
            "cursor: pointer;" +
            "background-color: rgba(2,2,2,.1);" +
            "border: 1px solid rgba(190,190,190,.5);" +
          "}" +
          ".volumeInner {" +
            "position: absolute;" +
            "bottom: 0;" +
            "width: "+percentage+"%;" +
            "height: 8px;" +
            "background-color: #fff;" +
          "}" +
          ".volume {" +
            "position: relative;" +
            "width: 82%;" +
            "height: 8px;" +
            "float: right;" +
            "cursor: pointer;" +
            "background-color: rgba(2,2,2,.1);" +
            "border: 1px solid rgba(190,190,190,.5);" +
          "}";
GM_addStyle(css);

//Sexy Script!
$("#audioSource")[0].volume = percentage/100;

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain=bandcamp.com";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

function changeVolume(e) {
	var clickPos = (e.pageX) - $(".volume").offset().left;
	var maxWidth = $(".volume").width();
	percentage = Math.floor(clickPos / maxWidth * 100);
    if(percentage > 100) {
        percentage = 100;
        $(".volumeInner").css("width", "100%");
    } else if(percentage < 0) {
        percentage = 0;
        $(".volumeInner").css("width", "0%");
    } else {
        $(".volumeInner").css("width", percentage + "%");
    }

	$("#audioSource")[0].volume = percentage/100;
}

$(".volume").mousedown(function(e){
    //console.log("volume bar clicked");
    changeVolume(e);
    $("body").css({
        "-webkit-user-select": "none",
        "-moz-user-select": "none"
    });

	$("body").mousemove(function(e){ changeVolume(e); });
});

$(document).mouseup(function(){
    $("body").off("mousemove");
    $("body").css({
        "-webkit-user-select": "all",
        "-moz-user-select": "all"
    });
    setCookie("bandCampVolumeBar_volume", percentage, 365);
    console.log("saved cookie: " + getCookie("bandCampVolumeBar_volume"));
});

var mute = false;
$(".speaker").click(function(){
    if(mute) {
        mute = false;
        $(".speaker").css("background-color", "rgba(2,2,2,.1)");
        $(".volumeInner").css("width", percentage + "%");
        $("#audioSource")[0].volume = percentage/100;
    } else {
        mute = true;
        $(".speaker").css("background-color", "#f88");
        $("#audioSource")[0].volume = 0;
        $(".volumeInner").css("width", "0%");
    }
});