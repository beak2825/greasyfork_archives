// ==UserScript==
// @name         Aspen Gamez-Selfeed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Official AspenGamez Alis.io Extension
// @author       Aspen|Gamez
// @match        *://agarlist.com/*
// @match        *://alis.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

var audio = new Audio("http://158.69.227.214:8041/;");
//Audio Players
//trap(Personal Favorite)  http://158.69.227.214:8041/;
//trap  http://91.121.157.114:8421/stream?icy=http
//trap  http://listen.radionomy.com/It-saTrapRadio?icy=http
//Reggaeton  http://162.247.76.193:7000/stream?icy=http

$(function(){
    $('title').html('Kai Extension');
    $('head').append('<style type="text/css">#choose-radio{background-color:#FFFFFF;padding: 5px 10px;border-radius:15px;cursor:pointer;text-align: center;width:100%;color:#212121;height:30px;font-weight:bold;}#nickname_container{padding-top:10px;}#theming .form-group.label-static label.control-label, .form-group.label-floating.is-focused label.control-label, .form-group.label-floating:not(.is-empty) label.control-label{top:-20px;}#team_container{padding-top:10px;float:left;}#hide-info{vertical-align:middle;margin:0;}#hide-info-text{margin:0;vertical-align:middle;}#hide-info-form{padding-left:5px;}.arrow-left, .arrow-right{border-top: 20px solid transparent; border-bottom: 20px solid transparent;}.arrow-left{left: 34px; top: 55px;border-right: 20px solid #000;}.arrow-right{right: 34px; top: 55px;border-left: 20px solid #000;}.nav2{opacity: .3;}#preview-img, #preview-img-area{width: 150px; height: 150px;}input#volume {width:95%;margin-top:5px;margin-left:2%;-webkit-appearance: none !important;background:#FFFFFF;height:2px;margin-bottom:20px;}input#volume::-webkit-slider-thumb {-webkit-appearance: none !important;background:url(https://dimgg.000webhostapp.com/circleW.png) no-repeat;height:12px;width:12px;}</style><link rel="shortcut icon" href="https://pbs.twimg.com/profile_images/748688292065968128/5V0arMne.jpg">');
    $('.card-signup>.content').append('<center style="padding-top:50px;"><script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCMA4UUkb9bMKt5TSf-QLo7g" data-layout="default" data-theme="dark" data-count="default"></div></center>');
    $('form>.card-nav-tabs>.content').append('<div id="extension-div"><img style="margin-left:-20px;"src="https://dimgg.000webhostapp.com/stop.png" width="100%" id="audio-player-stop"></img><img style="margin-left:-20px;"src="https://dimgg.000webhostapp.com/play.png" width="100%" id="audio-player-play"></img><input id="volume" type="range" min="0" max="100" value="50" /></div>');
    $('#audio-player-stop').hide();
    $('#audio-player-play').click(function(){$(this).hide();$('#audio-player-stop').show();audio.play();});
    $('#audio-player-stop').click(function(){$(this).hide();$('#audio-player-play').show();audio.pause();});
    $('#volume').change(function(){audio.volume = parseFloat(this.value / 100);});
    $('a[href=#theming]').click(function(){$('#extension-div').hide();});
    $('a[href=#settings]').click(function(){$('#extension-div').hide();});
    $('a[href=#home]').click(function(){$('#extension-div').delay(150).fadeIn(250);});
    $('.skin').parent().attr('class', 'col-sm-12');
    $('#team_container').parent().attr('class', 'col-sm-12');
    $('#nickname_container>.control-label').css('padding-left','15px');
    $('#nickname_container').addClass('col-sm-9').css('float','right');
    $('body').on('keydown keyup',function(e){
        var color = e.type=="keydown";
        if(e.which==192){
            respawn();
        }
    });
});
setInterval(function(){
    $('img[src="/assets/img/adblocker.png"]').remove();
    $('#ad_bottom').remove();
    $('.content>.text-center>.tab-pane>div#ad_main').remove();
}, 500);
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

//© 2017. AspenGamez. All Rights Reserved