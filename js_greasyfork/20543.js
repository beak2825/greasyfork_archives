// ==UserScript==
// @name         XXX Agar
// @namespace    ogario.ovh
// @version      1.8.2
// @description  Ogario with added profiles, skin preview, hide/ show skin URL, improved look and colors, etc..// All the SYX features
// @author       szymy, XXX
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/20543/XXX%20Agar.user.js
// @updateURL https://update.greasyfork.org/scripts/20543/XXX%20Agar.meta.js
// ==/UserScript==
 
// Copyright © 2016 ogario.ovh
 
$(document).ready(function() {
 
 
$('h1').replaceWith('<div id="preview"><div id="img"></div></div>');
$('#leaderboard-hud h4').html('Leaderboard');
$('title').html('Agar.io');
$('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
$('.leaderboard-panel').html('<style>.leaderboard-panel{width: 252px;height: 597px;}#skinz{display: inline-block;-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);cursor:pointer;width:99px;height:99px;maRgin:5px;border-radius:100000000px;}</style> <div id="skinz" style="opacity: 1;" class="1"></div> <div id="skinz" style="opacity: 1;" class="2"></div> <div id="skinz" style="opacity: 1;" class="3"></div> <div id="skinz" style="opacity: 1;" class="4"></div> <div id="skinz" style="opacity: 1;" class="5"></div> <div id="skinz" style="opacity: 1;" class="6"></div> <div id="skinz" style="opacity: 1;" class="7"></div> <div id="skinz" style="opacity: 1;" class="8"></div> <div id="skinz" style="opacity: 1;" class="9"></div> <div id="skinz" style="opacity: 1;" class="10"</div>');
 
for (var i = 1; i < 11; i++) {
    if (localStorage.getItem('profile'+i) === null){
    localStorage.setItem('profile'+i, null);
    }
}
 
 
    $('.1,.2,.3,.4,.5,.6,.7,.8,.9,.10').on('click',function() {
    var dd = $(this).attr('class');
    var skinzz = JSON.parse(localStorage["profile"+dd]);
            localStorage.setItem('activeprofile', dd);
    $('#clantag').val(skinzz[0]);
    $('#nick').val(skinzz[1]);
    $('#skin').val(skinzz[2]);
    $('#mainPanel #img').css("opacity","0");
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
    $('#mainPanel #img').css("opacity","1");
   
   
    var p = localStorage.getItem('activeprofile');
    var profile1 = new Array();
    profile1[0] = $('#clantag').val();
    profile1[1] = $('#nick').val();
    profile1[2] = $('#skin').val();
    localStorage["profile"+p] = JSON.stringify(profile1);
 
    });
 
 
window.setProfile = function(x) {
    var f = localStorage.getItem('activeprofile');
    if(x === 0) f--;
    if(x === 1) f++;
    if(f < 1) f = 10;
    if(f > 10) f = 1;
    localStorage.setItem('activeprofile', f);
   
   
    var data = JSON.parse(localStorage["profile"+f]);
    $('#clantag').val(data[0]);
    $('#nick').val(data[1]);
    $('#skin').val(data[2]);
    $('#mainPanel #img').css("opacity","0");
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
    $('#mainPanel #img').css("opacity","1");
};
   
   
 
$('#clantag, #skin, #nick').on("input", function(){
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
    var p = localStorage.getItem('activeprofile');
    var profile1 = new Array();
    profile1[0] = $('#clantag').val();
    profile1[1] = $('#nick').val();
    profile1[2] = $('#skin').val();
    localStorage["profile"+p] = JSON.stringify(profile1);
        for (var i = 1; i < 11; i++) {
        var skinz = JSON.parse(localStorage["profile"+i]);
       
        if (skinz !== null) {
        $('.'+i).css("background","url('"+skinz[2]+"')");  
        }
 
       
    }
});
 
$('.agario-panel-freecoins, .agario-shop-panel').insertBefore('#tags-container');
$('.vertical-line').remove();
$('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');
$('head').append('<style>.shop-power{float:right;}.agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel{width:100%;}#img, #skinz{background-size: cover !important;}#helloContainer{margin-top: -15px;}#mainPanel #img, #skinz{    -webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);}#minimap-hud{border: 1px solid rgba(0, 0, 0, 0.15);}.hideskin{backgRound-coloR:#d43f3a !important;border-coloR:#d43f3a !important;cursor: pointer;}.showskin{cursor: pointer;background-color: #449d44 !important;border-color: #449d44 !important;}.btn-info{    color: #fff !important; background-color: #428bca !important; border-color: #357ebd !important;}#helloContainer{opacity: 0.98;}                                                                         #leaderboard-hud h4{font-size:27px;}#mainPanel h1{margin: 5px 0 5PX 0;}.hud, .hud-b{text-align: left !important;}#leaderboard-info{margin-top: 5px;}#main-menu{border-bottom:none !important; }.ogario-yt-panel, #ogario-ad, #version{display:none !important;}.btn-group-justified>.btn, .btn-group-justified>.btn-group{background: rgb(16, 16, 16);color: #adadad;border-color: #1e1d21;}.input-group-addon{background-color: rgba(255, 255, 255, 0.15);border: rgba(255, 255, 255, 0.15);}#mainPanel #img{transition: opacity .15s;margin: 0 60px;border-radius: 1000px;width:200px;height:200px;}.menu-tabs li.active{background-color: rgba(0, 0, 0, 0.65);border-radius: 2px;}.menu-tabs .active{color: #87c0d8 !important;}a:focus, a:hover{text-decoration: none;}.menu-tabs{padding: 6px 22px 6px 25px !important;border-radius: 2px;    background-color: rgba(255, 255, 255, 0.13);}.agario-panel, .btn, .form-control, .input-group-addon, .input-group-sm>.input-group-addon{border-radius: 2px;}                            .showskin, .btn-warning, .btn-success{background-color: #35a7a5 !important; border-color: #35a7a5 !important;}.btn-danger, .hideskin{backgRound-coloR: #d43a66 !important;border-coloR: #d43a66 !important;} .btn-info.active, .btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{background-color: #2d6ca1 !important;border-color: #2d6ca1 !important;} .btn-danger.active, .btn-danger.focus, .btn-danger:active, .btn-danger:focus, .btn-danger:hover, .open>.dropdown-toggle.btn-danger, .hideskin:hover{    background-color: #af2f53 !important;border-color: #af2f53 !important;} .btn-shop, .btn-shop:active, .btn-shop:disabled{background-color: #32a5a7 !important;border-color: #2f9d9f !important;} .btn-warning.active, .btn-warning.focus, .btn-warning:active, .btn-warning:focus, .btn-warning:hover, .open>.dropdown-toggle.btn-warning, .showskin:hover, .btn-success:hover{background-color: #29878a !important;border-color: #29878a !important;}.agario-panel{background-color: #1a1b25;}.agario-panel input, .agario-panel select{background-color: rgba(255, 255, 255, 0.15);}</style>');
$('.party-panel, .agario-party, .agario-party-0, .agario-party-1, .agario-party-2, .agario-party-3, .agario-party-4, .agario-party-5, .agario-party-6, .agario-panel-gifting, .agario-profile-panel').remove();
$('.hud, .hud-b').css('border-radius','0px');
$('h2').remove();
$('#fps-hud').css("bottom", "10px");
$('#fps-hud').css("top", "auto");
$('#autoHideCellsInfo').parent().html('<input type="checkbox" onchange="setSettings(\'autoHideCellsInfo\', $(this).is(\':checked\'));" id="autoHideCellsInfo">Auto hide cells info');
 
$('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>')
 
   
    var f = localStorage.getItem('activeprofile');
    var data = JSON.parse(localStorage["profile"+f]);
    $('#clantag').val(data[0]);
    $('#nick').val(data[1]);
    $('#skin').val(data[2]);
    $('#mainPanel #img').css("background","url('"+$('#skin').val()+"')");
   
    $('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="    background: #9c2556; width: 500px; height: 300px; bottom: 35px; right: 35px; position: fixed; border-radius: 15px; box-shadow: 0px 0px 25px 0px #9c2556; padding: 70px; font-weight: 600; color: white; transition: all .3s; ">is this a script. ok ?<br><br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCMKTCbazPEZVfoVEGoEGVLQ" data-layout="full" data-count="default"></div></div>');
    $('#minimap-sectors').replaceWith('<img id="minimap-sectors" width="182" height="182" src="http://i.imgur.com/5VLl2UA.png">');
 
    for (var i = 1; i < 11; i++) {
        var skinz = JSON.parse(localStorage["profile"+i]);
       
        if (skinz !== null) {
        $('.'+i).css("background","url('"+skinz[2]+"')");
        }
 
       
    }
 
 
});