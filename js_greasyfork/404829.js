// ==UserScript==
// @name         ASTRio+
// @namespace    http://br3zin.com/
// @version      0.9
// @description  Astrio
// @author       You
// @match        https://astr.io
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404829/ASTRio%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/404829/ASTRio%2B.meta.js
// ==/UserScript==

    document.title = "ASTRio+"

$(window).load(function() {
     document.getElementById("splash-screen").style.display = "none";
     document.getElementById("backgr").style.display = "inline";
})

$("#splash-screen").fadeTo( "fast", Math.random() );

var iss2 = document.createElement("img");
var body2 = document.getElementById("main-menu");
body2.appendChild(iss2);
iss2.setAttribute('id', 'menuz');
iss2.setAttribute('src', 'https://i.imgur.com/MY01KE4.png');

var iss = document.createElement("div");
var body = document.body;
body.appendChild(iss);
iss.setAttribute('id', 'backgr');
document.getElementById("backgr").style.display = "none";
document.getElementById("backgr").style.display = "none";
var sple = document.createElement("div");
var screen = document.body;
screen.appendChild(sple);
sple.setAttribute('id', 'splash-screen');

var emmp = document.getElementById("button-spectate");
var sempo = document.createElement("span");
emmp.appendChild(sempo);
sempo.setAttribute('class', 'playkey');
sempo.innerHTML = "SPECTATE";

var u = document.createElement("div");
var wu = document.getElementById("splash-screen");
wu.appendChild(u);
u.setAttribute('id', 'uwu');

var pa = document.createElement("p");
var ra = document.getElementById("splash-screen");
ra.appendChild(pa);
pa.setAttribute('class', 'private');
pa.innerHTML = " EXTENSION UWU ";

var gr = document.createElement("p");
var fa = document.getElementById("splash-screen");
fa.appendChild(gr);
gr.setAttribute('class', 'pri');
gr.innerHTML = " © 2020 ";

var ui = document.createElement("img");
var wuz = document.getElementById("uwu");
wuz.appendChild(ui);
ui.setAttribute('src', 'https://i.imgur.com/LkqEtEy.png');
ui.setAttribute('id', 'imguwu');




var sim = document.createElement("div");
var bolo = document.getElementById("splash-screen");
bolo.appendChild(sim);
sim.setAttribute('id', 'simbolos');
var ima = document.createElement("img");
var ge = document.getElementById("simbolos");
ge.appendChild(ima);
ima.setAttribute('src', 'https://i.imgur.com/ArgMsGe.png');

var sadsdss = document.getElementById("backgrr");

$(document).ready(function() {
    $(this).keydown(function (e) {
        if (event.keyCode == 192) {
            document.getElementById("button-play").click();
        }
    })
})
$(document).ready(function() {
    $(this).keydown(function (e) {
        if (event.keyCode == 81) {
            document.getElementById("button-spectate").click();
        }
    })
})

var X = document.getElementById("team-leaderboard-hud");
X.style.display = "none";
 $("head").append("<link href=\"https://i.imgur.com/p3zYhN1.png\" rel=\"shortcur icon\">");
$(".icon").remove()
$("#button-play").append("<i class=\"fas fa-play\"></i>");
$("#button-theme").append("<i class=\"fas fa-paint-brush\"></i>");
$(".fa-keyboard").remove()
$(".fa-palette").remove()
$("#targeting-hud").remove()
$("#server").append("<i class=\"far fa-list-alt\"></i>");
$("#button-inputs").append("<i class=\"fas fa-gamepad\"></i>");
$("#time").append("<i class=\"fas fa-hourglass\"></i>");
$("#button-spectate").append("<i class=\"fas fa-eye\"></i>");
 $("head").append("<link href=\"//fonts.googleapis.com/css?family=Ubuntu\">");
$("head").append("<script src=\"https://code.jquery.com/jquery-3.5.0.js\"></script>");
$("head").append("<style>.settings-container .row{    background: #000000;}.arrow-left, .arrow-right{color:#fff;}#profile-left{position:relative;right: 30px;}#profile-right{position:relative;    left: 29px;}.theme-container .row{background:#000;}#commands .row{background: #000000;}.inputs-tab.active{background:#000;}#hotkeys .row{    background: #000000;}.fa-paint-brush {    text-shadow: 0px 0px 34px #fff;    transform: skewX(-12deg);    font-size: 34px;}.fa-list-alt {    transform: skewX(-42deg);    font-size: 34px;    text-shadow: 0px 0px 34px #fff;}.fa-cog {    text-shadow: 0px 0px 16px #fff;    transform: skewX(37deg);    font-size: 34px;}.tooltip.is-tooltip-bottom.is-tooltip-active:not(.is-loading)::after, .tooltip.is-tooltip-bottom:focus:not(.is-loading)::after, .tooltip.is-tooltip-bottom:hover:not(.is-loading)::after {display: none;}.fa-gamepad {    text-shadow: 0px 0px 34px #fff;    transform: skewX(17deg);    font-size: 34px;}.tooltip.is-tooltip-active::before, .tooltip:hover::before {   display: none;}.fa-keyboard {    text-shadow: 0px 0px 7px #fff;    transform: skewX(17deg);    font-size: 34px;}.fa-palette {    text-shadow: 0px 0px 7px #fff;    transform: skewX(-12deg);    font-size: 34px;}#button-theme {    position: relative;    right: 486px;    width: 94px!important;    bottom: 196px;    border-radius: 15px!important;    transform: skewX(12deg);    height: 126px;    background: #04ff0000;}#button-inputs {    position: relative;    right: 486px;    width: 94px;    bottom: 199px;    border-radius: 15px;    transform: skewX(-17deg);    height: 126px;    background: #a21e1e00;}#button-settings {    position: relative;    right: 429px;    width: 104px;    bottom: 199px;    border-radius: 10px;    transform: skewX(-37deg);    height: 126px;    background: #1f161600;}.columns.is-mobile>.column.is-6 {    flex: none;    width: 50%;    z-index: 10;}#menuz {    top: -286px;    width: 703px;    z-index: 1;    position: absolute;}.fa-hourglass{position: relative;    right: 6px;background: linear-gradient(to right,#1b00ff, #4b00ff , #5600ff);font-size: 18px;-webkit-background-clip: text;    -webkit-text-fill-color: transparent;    filter: drop-shadow(0 0 0.75rem #1b00ff4f);}#emptu2{    position: absolute;    background: #ff8d00;width: 26px;    height: 80px;top: 326px;    left: 334px;}div#emptu{position: absolute;    background: #36f;    width: 26px;height: 80px;    top: 216px;    left: 334px;}.button-play span{        text-shadow: 0px 0px 10px #fff;text-transform: uppercase;    font-size: x-large;transform: skewX(-12deg);    position: relative;left: 48px;}.fa-play{    text-shadow: 0px 0px 10px;font-size: xx-large;    transform: rotate(-64deg); }#asia.is-active, .button:active{    background: #313131;}#america.is-active, .button:active{    background: #313131;}#europe.is-active, .button:active{    background: #313131;}.tl-player-nick{    position: relative;right: 13px;}.tl-player-mass{position: relative;    left: 89px;}.tl-player-location{display:none;}.tl-position{    position: relative;left: 25px;}#team-leaderboard-head{display:none;}#team-leaderboard-positions{display:none;}#leaderboard-positions{    background-color: #00000075;    padding: 9px;    border-radius: 7px;}#splash-screen .pri{    position: relative;top: 92%;left: 49%;    font-size: x-large;text-shadow: 0px 0px 15px #9C27B0;cursor: default;font-family: sans-serif;color: #ffffff;}#splash-screen .private{    position: relative;    top: 85%;    left: 45%;font-size: xx-large;    text-shadow: 0px 0px 15px #9C27B0;    cursor: default;    font-family: sans-serif;color: #ffffff;}#imguwu:hover{transition-duration: 5s;transition-delay: 1s;transform: scale(1.2);}@-webkit-keyframes rodarIb {0%{-webkit-transform: rotate(0deg);}100%{-webkit-transform: rotate(-360deg);}}div#uwu:hover{transition-duration: 5s;transition-delay: 1s;transform: scale(1.2);}div#uwu{    position: fixed;left: 39%;    top: 21%;animation: rodarIb 15s infinite ease-in-out 1s;    animation-play-state: running;}#simbolos{    position: fixed;    left: 39%;    top: 21%;animation: rodar 15s infinite ease-in-out 1s;animation-play-state: running;}#splash-screen{    position: fixed;    top: 0px;left: 0px;    width: 100%;    height: 100%;    z-index: 100;    background-image: url(https://i.imgur.com/VNQ4oRy.jpg);    opacity: 1;    transition: opacity 1s;    background-size: cover;    background-position-y: center;}@-webkit-keyframes rodar {0%{-webkit-transform: rotate(0deg);}100%{-webkit-transform: rotate(360deg);}}div#backgr{position:fixed; width:100%; height:100%;}div#Backgr{    position: relative;    height: 50px;}input{    background: #101010bf!important;    color: #ffffff!important;border-radius: 13px!important;}input.url{position:relative;    top: -38px;    left: 256px;    width: 79px;border: 1px solid;}#canvas{}body{cursor:url('http://www.rw-designer.com/cursor-extern.php?id=93290'), auto;}.box.menu-user{display:none;}#time{    font-size: 31px;}#team-leaderboard-hud{}#minimap-hud{border:0;}.lb-mass{display:none}.lb-position{border-radius:50%;filter: drop-shadow(0 0 0.75rem #1b00ff4f);    background: linear-gradient(to right,#1b00ff, #4c4c4c , #5600ff);text-align-last: center;margin-top: 1px;margin-left: 10px;width: 20px;height: 20px;position: relative;z-index: 0;}#a4g{display:none;}.menu{    padding-top: 54px;    text-align: center;}#server {    z-index: 5;    width: 119px;    font-size: x-large;    height: 111px;    position: absolute;    color: #fff;    background: #1b1b1b00;    left: 71px;    border-radius: 63px 0px 99px 12px;top: 196px;    transform: skewX(41deg);}.columns.is-gapless{    margin-top: 37px;}#button-theme{    width: 47px;}.columns.is-vcentered.is-gapless{position:relative;top: -18px;}.button-play span{display:none;}.button{box-shadow: 0px 0px 10px #080808;letter-spacing: 4.8px;    padding-bottom: calc(0.375em - 1px);}.button-group .button{background: #1b1b1b;}.field.has-addons{        display: flow-root;justify-content: flex-start;position: absolute;left: 135px;    width: 46px;}.button-spec{    background: #ff8d0000!important;}.modal-background{background: linear-gradient(rgba(0, 0, 0, 0.25),rgba(249, 249, 249, 0.32));}.button-play:hover{    background: #4d7aff00!important;}.button-spec:hover{    background: #0000!important;}#nick{cursor:default;position:relative;left:-3px;}input::placeholder,select::placeholder{  color: #5b5b5b!important}input{    background: #292929bf!important;    color: #ffffff!important;}.button-play{    background: #36f0!important;cursor:default;position:relative;           left: 135px;    height: 106px;border-radius: 52px 68px 12px 30px;    width: 244px;bottom: 465px;    transform: rotate(64deg);}.fa-eye{    position: relative;    transform: rotate(-117deg);text-shadow: 0px 0px 10px #fff;    text-transform: uppercase;font-size: x-large;}span.playkey{position: relative;    left: 47px;display:none;    text-shadow: 0px 0px 10px #fff;text-transform: uppercase;    font-size: x-large;}#button-spectate{cursor:default;    transform: rotate(117deg);    right: 15px;    position: relative;    height: 88px;    width: 250px;    border-radius: 44px 47px 38px 0px;    bottom: 185px;}body, html, input{font-family:ubuntu;}.control.has-icons-left .input, .control.has-icons-left .select select{    padding-left: 0;    text-align: center;top:-223px;}#pin{cursor:default;position:relative;    left: -3px;}#tag{cursor:default;position:relative;width: 90px;}.input.is-medium, .textarea.is-medium{        margin: 3px;border-radius: 14px;    margin: 3px;}#asia{position: relative;    top: -69px;left: 94px;height: 35px;    width: 64px;}#america{    position: relative;    top: -34px;    left: 30px;    height: 35px;    width: 64px;}.modal-card, .modal-content{overflow:initial;}#skin2 {    position: relative;    top: 19px;    right: 244px;}#skin2-preview{    position: relative;    right: 286px;    top: 25px;}#skin {    position: relative;    right: 164px;    bottom: 140px;    z-index: ;}#skin1-preview{    position: relative;        bottom: 153px;right: 213px;    }#skin1-preview, #skin2-preview{    width: 160px;    height: 160px;    border: 8px solid #fff;}#europe{    position: relative;    top: 1px;    width: 64px;    left: -34px;}.menu-play{background:#ffffffcf;position:relative;    width: 201px;    height: 116px;    border-radius: 15px;left:191px;}.menu-panel{    background: #E91E63;}.menu-list a.is-active, .menu-list a:hover {    border-top: 3px solid #ff0000a8;    color: #ffffff;    background: #000;}.menu-select {    bottom: -96px;    z-index: 11;    width: 368px;    display: none;    background: #000;    position: absolute;    left: 188px;}</style>");

var back = document.getElementById("hotkeys");
var s = document.createElement("div");
back.appendChild(s);
s.setAttribute('class', 'row');
s.setAttribute('id', 'Backgr');
s.setAttribute('name', 'BackgroundImage');


var span = document.getElementById("Backgr");
var di = document.createElement("div");
span.appendChild(di);
di.setAttribute('class', 'title');
di.setAttribute('id', 'Ba');
di.innerHTML = "Background Image";


var bacss = document.getElementById("Backgr");
var inzz = document.createElement("input");
bacss.appendChild(inzz);
inzz.setAttribute('class', 'url');
inzz.setAttribute('id', 'u');

var sa = document.createElement("a");
 var za = document.getElementById("main-menu");
 za.appendChild(sa);
sa.setAttribute('id', 'server');
sa.setAttribute('class', 'button is-tooltip-bottom');
$( "#server" ).click(function() {
  $( ".menu-select" ).toggle();
});

var g = document.createElement('div');
g.setAttribute("id", "Div1");

var br3 = document.createElement("i");
 var br2 = document.getElementById("server");
br2.appendChild(br3);
br3.setAttribute('class', 'far fa-list-alt');
var teaml = document.getElementById("teamlist-head").innerHTML = "TEAM PLAYERS";

 var lea = document.getElementById("leaderboard-head").innerHTML = "";
var mensa =document.getElementById("time");
mensa.setAttribute('style', 'font-size: 31px;');

var se = document.createElement("i");
var clo = document.getElementsByClassName("box-container").setAttribute('id', 'f');
clo.appendChild(se);
se.setAttribute('class', 'alt');


var c=document.getElementById("backgr");
var ctx=c.getContext("2d");
ctx.fillStyle="#7F7F00";
ctx.fillRect(0,0,150,100);

var btnplay = document.getElementsByClassName("control_control-play_is-expanded")
var btnp = document.createElement("div");
btnp.appendChild(btnplay);
btnplay.setAttribute('class', 'empty-btn-play');


