// ==UserScript==
// @name         UwU
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Astrio
// @author       You
// @match        https://astr.io
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403485/UwU.user.js
// @updateURL https://update.greasyfork.org/scripts/403485/UwU.meta.js
// ==/UserScript==

    document.title = "U W U 布雷诺"

$(window).load(function() {
     document.getElementById("splash-screen").style.display = "none";
     document.getElementById("backgr").style.display = "inline";
})
$(document).ready(function(){
        window.setTimeout('fadeout();', 3000);
    });

    function fadeout(){
        $('#splash-screen').fadeOut('slow', function() {
           // Animation complete.
        });
    }


var sple = document.createElement("div");
var screen = document.body;
screen.appendChild(sple);
sple.setAttribute('id', 'splash-screen');

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
$("#targeting-hud").remove()
$("#server").append("<i class=\"far fa-list-alt\"></i>");
$("#button-spectate").append("<i class=\"fas fa-eye\"></i>");
 $("head").append("<link href=\"//fonts.googleapis.com/css?family=Ubuntu\">");
$("head").append("<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js\"></script>");
$("head").append("<style>#site-a:hover{    transform: scale(1.2);    border-bottom: 2px solid #fff;}#site-a{left: 111px;     font-size: x-large;    position: absolute;    color: #fff;        top: 5px;}#site{    background: #56565675;    position: relative;height: 48px;bottom: 645px;width: 100%;}#asia.is-active, .button:active{    background: #313131;}#america.is-active, .button:active{    background: #313131;}#europe.is-active, .button:active{    background: #313131;}.tl-player-nick{    position: relative;right: 13px;}.tl-player-mass{position: relative;    left: 89px;}.tl-player-location{display:none;}.tl-position{    position: relative;left: 25px;}#team-leaderboard-head{display:none;}#team-leaderboard-positions{display:none;}#splash-screen .pri{    position: relative;top: 92%;left: 49%;    font-size: x-large;text-shadow: 0px 0px 15px #9C27B0;cursor: default;font-family: sans-serif;color: #ffffff;}#splash-screen .private{    position: relative;    top: 85%;    left: 45%;font-size: xx-large;    text-shadow: 0px 0px 15px #9C27B0;    cursor: default;    font-family: sans-serif;color: #ffffff;}#imguwu:hover{transition-duration: 5s;transition-delay: 1s;transform: scale(1.2);}@-webkit-keyframes rodarIb {0%{-webkit-transform: rotate(0deg);}100%{-webkit-transform: rotate(-360deg);}}div#uwu:hover{transition-duration: 5s;transition-delay: 1s;transform: scale(1.2);}div#uwu{    position: fixed;left: 39%;    top: 21%;animation: rodarIb 15s infinite ease-in-out 1s;    animation-play-state: running;}img:hover{transition-duration: 5s;transition-delay: 1s;transform: scale(1.2);}div#simbolos{    position: fixed;    left: 39%;    top: 21%;animation: rodar 15s infinite ease-in-out 1s;animation-play-state: running;}#splash-screen{    position: fixed;    top: 0px;left: 0px;    width: 100%;    height: 100%;    z-index: 100;    background-image: url(https://i.imgur.com/VNQ4oRy.jpg);    opacity: 1;    transition: opacity 1s;    background-size: cover;    background-position-y: center;}@-webkit-keyframes rodar {0%{-webkit-transform: rotate(0deg);}100%{-webkit-transform: rotate(360deg);}}div#backgr{display:none;animation: rodar 3s infinite ease-in-out;animation-timing-function: ease-out;    background-image: url(https://i.imgur.com/ArgMsGe.png);    width: 100%;    height: 100%;    position: fixed;    background-position-y: center;    z-index: -1;    background-position-x: center;    background-repeat: no-repeat;}div#Backgr{    position: relative;    height: 50px;}input{    background: #161d21!important;}input.url{position:relative;    top: -38px;    left: 256px;    width: 79px;border: 1px solid;}#canvas{background-image:url(https://i.imgur.com/TEHZjX4.jpg);}body{cursor:url('http://www.rw-designer.com/cursor-extern.php?id=93290'), auto;}.box.menu-user{display:none;}#time{    font-size: 31px;}#team-leaderboard-hud{}#minimap-hud{border:0;}.lb-position{    background: #4e4e4e;    border-radius: 50%;    text-align-last: center;    margin-left: 11px;    margin-top: 1px;}.menu{    padding-top: 54px;    text-align: center;}#server:hover{background:#292c3d;}#server{    width: 47px;    font-size: x-large;    height: 38px;    position: absolute;color:#fff;background: #1b1b1b;    left: 135px;    top: 160px;}.columns.is-gapless{    margin-top: 37px;}#button-theme{    width: 47px;}.columns.is-vcentered.is-gapless{postion:relative;top: -18px;}.button-group .button{background: #1b1b1b;}.field.has-addons{        display: flow-root;justify-content: flex-start;position: absolute;left: 135px;    width: 46px;}.button-spec{    background: #ff8d00!important;}.button-spec:hover{    background: #ffb04f!important;}#nick{cursor:default;position:relative;left:-3px;}input::placeholder,select::placeholder{  color: #5b5b5b!important}input{    background: #292929bf!important;    color: #ffffff!important;}#button-play{cursor:default;position:relative;    top: 9px;    width: 268px;}#button-spectate{cursor:default;    position: relative;    top: 9px;}body, html, input{font-family:ubuntu;}.control.has-icons-left .input, .control.has-icons-left .select select{    padding-left: 0;    text-align: center;}#pin{cursor:default;position:relative;    left: -3px;}#tag{cursor:default;left: -2px;position:relative;width: 162px;}.input.is-medium, .textarea.is-medium{        margin: 3px;border-radius: 14px;    margin: 3px;}#asia{position: relative;    top: -69px;left: 94px;height: 35px;    width: 64px;}#america{    position: relative;    top: -34px;    left: 30px;    height: 35px;    width: 64px;}.modal-card, .modal-content{overflow:initial;}#europe{    position: relative;    top: 1px;    width: 64px;    left: -34px;}.modal-background{background:#0000;}.menu-play{background:#48484861;    border-radius: 15px;}.menu-select{    width: 364px;display:none;background:#292c3d;    z-index: 1;position: relative;    left: 187px;}</style>");

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
sa.setAttribute('data-tooltip', 'Server');
sa.setAttribute('class', 'button tooltip is-tooltip-bottom');
$( "#server" ).click(function() {
  $( ".menu-select" ).toggle();
});


var br3 = document.createElement("i");
 var br2 = document.getElementById("server");
br2.appendChild(br3);
br3.setAttribute('class', 'far fa-list-alt');
var teaml = document.getElementById("teamlist-head").innerHTML = "TEAM PLAYERS";
 var lea = document.getElementById("leaderboard-head").innerHTML = "UWU布雷诺";
var mensa =document.getElementById("time");
mensa.setAttribute('style', 'font-size: 31px;');

var se = document.createElement("i");
var clo = document.getElementsByClassName("box-container").setAttribute('id', 'f');
clo.appendChild(se);
se.setAttribute('class', 'alt');


