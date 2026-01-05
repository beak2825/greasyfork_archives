// ==UserScript==
// @name         OGARio - IamBEJO
// @namespace    https://greasyfork.org
// @description  OGARio Edited
// @author       IamBEJO
// @match        http://agar.io/*
// @include      https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @version 0.0.1.20160608001454
// @downloadURL https://update.greasyfork.org/scripts/20352/OGARio%20-%20IamBEJO.user.js
// @updateURL https://update.greasyfork.org/scripts/20352/OGARio%20-%20IamBEJO.meta.js
// ==/UserScript==

$(document).ready(function() {


$('h1').replaceWith('<div id="preview"><img id="img"></img></div>');
$('#leaderboard-hud h4').html('Leaderboard');
$('title').html('ACE Ogar');
$('#mainPanel img').src=$('#skin').val();
$('#skin').on('input',function() {
	$('#mainPanel img').src=$('#skin').val();
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
	document.querySelector("#mainPanel").querySelector("div").querySelector("div").lastElementChild.querySelector("img").src=document.getElementById("skin").value;
	};
	
	

$('#clantag, #skin, #nick').on("input", function(){
    var p = localStorage.getItem('activeprofile');
	var profile1 = new Array();
	profile1[0] = $('#clantag').val();
	profile1[1] = $('#nick').val();
	profile1[2] = $('#skin').val();
	localStorage["profile"+p] = JSON.stringify(profile1);
});




$('head').append('<style> .showskin:hover, .btn-info:hover {background-color: #92369a !important; border-color: #9c3aa5 !important; } .hideskin:hoveR {background-color: #942525 !important; border-color: #9e2929 !important; } .btn-success, .btn-primary:hoveR {background-color: #505988 !important; border-color: #5a628e !important; } .btn-warning:hoveR{background-color: #6b394d !important; } .btn-danger:hoveR {background-color: #c33d71 !important; border-color: #d2487d !important; }.yt-username{color:white !important;}.hideskin{cursor: pointer;background-color: #af2a2a !important;border-color: #af2a2a !important;}.showskin{cursor: pointer;background-color: #b644c1 !important;border-color: #b644c1 !important;}.btn-logout{margin: 10px 0 10px 0;width: 100%;}#helloContainer[data-logged-in="1"] .btn-spectate, .btn-login-play, .btn-play-guest{width: 100%;}.btn-login-play, .btn-play-guest{margin-left: 0px;}#helloContainer[data-logged-in="0"] #socialLoginContainer>.row{margin-top: 7px;    width: 100%;}.row{margin-right: 0;    margin-left: 0;}#socialLoginContainer{margin-top: 42px;}                                                 .btn-warning{background-color: #714355 !important;border-color: #6c4053 !important;}.btn-success, .btn-primary{background-color: #656D98 !important;border-color: #656D98 !important;}.btn-info{background-color: #ae41b9 !important;border-color: #ae41b9 !important;}.btn-danger{background-color: #d94f84 !important;border-color: #d94f84 !important;}#helloContainer{opacity: 0.96;}                                    #leaderboard-hud h4{font-size:27px;}#mainPanel h1{margin: 5px 0 5PX 0;}.hud, .hud-b{text-align: left !important;}#leaderboard-info{margin-top: 5px;}.agario-panel input, .agario-panel select{background-color: #433e4c;}.agario-panel input, .agario-panel select, .agario-panel, .btn, .form-control, .input-group-addon, .input-group-sm>.input-group-addon{border-radius: 0px;}#main-menu{border-bottom:none !important; }.ogario-yt-panel, #ogario-ad, #version{display:none !important;}.btn-group-justified>.btn, .btn-group-justified>.btn-group{background: #433e4c;color: #adadad;border-color: #1e1d21;}.input-group-addon{background-color: #433e4c;border: 1px solid #433e4c;}.agario-panel{background-color: #2f2c35;}#mainPanel #img{margin: 0 60px;border-radius: 1000px;width:200px;height:200px;}.menu-tabs li.active{background-color: rgba(255, 255, 255, 0.09);border-radius: 2px;}a:focus, a:hover{text-decoration: none;}.menu-tabs{background-color: transparent !important;padding: 0 22px 0 25px !important;margin-top: 10px;}</style>');
$('head').append('<style>#Radio{padding-top: 5px;background: #151415;}#mainPanel img{opacity: 1;}</style>');
$('.party-panel, .agario-party, .agario-party-0, .agario-party-1, .agario-party-2, .agario-party-3, .agario-party-4, .agario-party-5, .agario-party-6, .agario-panel-gifting, .agario-profile-panel').remove();
$('.hud, .hud-b').css('border-radius','0px');
$('h2').remove();
$('#fps-hud').css("bottom", "10px");
$('#fps-hud').css("top", "auto");
$('.ogario-yt-panel').html('<script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCuvYrid9mlRZ_ZW-eNM7o7w" data-layout="full" data-count="default"></div>');
$('.btn-logout, .btn-login-play').insertBefore('#tags-container');
$('#socialLoginContainer').insertBefore('#tags-container');
$('<div onclick="setProfile(1);" id="arrowR" style="    background: url(\'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TriangleArrow-Right.svg/461px-TriangleArrow-Right.svg.png\') no-repeat; background-size: contain; width: 17px; height: 12px; float: right; margin-top: -30%; margin-right: 20px; cursor: pointer;"></div><div onclick="setProfile(0);" id="arrowL" style="float: left; margin-top: -30%; margin-left: 26px; background: url(\'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/TriangleArrow-Left.svg/461px-TriangleArrow-Left.svg.png\') no-repeat; background-size: contain; width: 17px; height: 12px; cursor: pointer;"></div>').insertAfter('#mainPanel img');

$('head').append('<script>function hideUrl() {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","hidden"); } function showUrl() {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); $(".showskin").replaceWith(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); localStorage.setItem("S_skin_url","shown"); } if (localStorage.getItem("S_skin_url") == "hidden") {$("head").append(\'<style>#skin {text-indent: -999999px!important;}</style>\'); $(".hideskin").replaceWith(\'<span class="input-group-addon showskin" onclick="showUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\'); } else {$("head").append(\'<style>#skin {text-indent: 0px!important;}</style>\'); } $(\'#mainPanel .input-group\').append(\'<span class="input-group-addon hideskin" onclick="hideUrl()"><img src="http://i.imgur.com/DKZXxbz.png" width="20px"/></span>\');</script>')

   
    var f = localStorage.getItem('activeprofile');
    var data = JSON.parse(localStorage["profile"+f]);
	$('#clantag').val(data[0]);
	$('#nick').val(data[1]);
	$('#skin').val(data[2]);
	document.querySelector("#mainPanel").querySelector("div").querySelector("div").lastElementChild.querySelector("img").src=document.getElementById("skin").value;
	
	$('#overlays').prepend('<style>#lolhi{opacity:0;}#lolhi:hover{opacity:0.95;}</style><div id="lolhi" style="    background: #9c2556; width: 500px; height: 300px; bottom: 35px; right: 35px; position: fixed; border-radius: 15px; box-shadow: 0px 0px 25px 0px #9c2556; padding: 70px; font-weight: 600; color: white; transition: all .3s; ">Log in/out is in the settings.<br>Any suggestions/ feedback are welcome in the feedback section in  Greasyfork.<br>Enjoy :)<br><br><br><script src="https://apis.google.com/js/platform.js"></script> <div class="g-ytsubscribe" data-channelid="UCuvYrid9mlRZ_ZW-eNM7o7w" data-layout="full" data-count="default"></div></div>');
 
});