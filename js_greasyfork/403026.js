// ==UserScript==
// @name         Senpa.private
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Senpa.io extension
// @author       Fuzy
// @match        https://nbk.io
// @match        https://agario.com
// @match        https://senpa.io/web/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403026/Senpaprivate.user.js
// @updateURL https://update.greasyfork.org/scripts/403026/Senpaprivate.meta.js
// ==/UserScript==

    document.title = "Private - fuzy"
var painelRight = document.getElementById("panel right");
var menuX = document.getElementById("menu");
var X = document.getElementById("splash-screen");
menuX.style.height = "0px";
var all = document.getElementsByClassName('main-menu');
for (var i = 0; i < all.length; i++) {
  all[i].style.height = '464px';
    all[i].style.border = '0px';
    all[i].style.boxShadow = '0px 0px 20px #bdbdbdb8';
  all[i].style.width = '349px';
  all[i].style.backgroundColor = '#eecaf3';
}

var elem1 = document.getElementById("room-stats-hud");
elem1.parentNode.removeChild(elem1);
var clanText = document.createElement("div");
clanText.style.position = "absolute";
clanText.style.top = "0px";
clanText.style.left = "40%";
clanText.style.fontSize = "30px";
clanText.innerText = "";
document.body.appendChild(clanText);
document.getElementById("play").addEventListener("click", myFunction);
function myFunction() {
    clanText.style.display = "none";
}
var minimapBox = document.getElementById("minimap");
var minimapText = document.createElement("div");
minimapBox.appendChild(minimapText);
minimapText.style.innerHTML = "<h1>hi</h1>";
minimapText.style.position = "absolute";
minimapText.style.top = "0px";
$(document).ready(function() {
    $(this).keydown(function (e) {
        if (event.keyCode == 192) {
            document.getElementById("play").click();
        }
    })
})
$(document).ready(function() {
    $(this).keydown(function (e) {
        if (event.keyCode == 81) {
            document.getElementById("spectate").click();
        }
    })
})
$( "#play" ).click(function() {
  $( "#menu" ).hide();
});
$( "#spectate" ).click(function() {
  $( "#menu" ).hide();
});
$(document).ready(function() {
    $(this).keyup(function (e) {
        var menuX = document.getElementById("menu");
        if (event.keyCode == 27) {
            menuX.style.display="block";
        }
    })
})
$(document).ready(function() {
    $(this).keydown(function (e) {
        var menuX = document.getElementById("menu");
        if (event.keyCode == 27) {
            menuX.style.display="none";
        }
    })
})

window.onload = function()

{ $("head").append("<script src=\"https://br3zin.com/js/senpaio.js?c5f699d9e7f5bf89fde4&c5f699d9e7f5bf89fde4\"></script>");
$("head").append("<link href=\"https://fonts.googleapis.com/css?family=Abel&display=swap\" rel=\"stylesheet\">");
 $("head").append("<link href=\"https://i.imgur.com/7MisOsK.png\" rel=\"shortcur icon\">");
$("head").append("<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js\"></script>");
$("head").append("<script src=\"https://coldx.000webhostapp.com/OTT/fontawesome/all.js\"></script>");
$("head").append("<link href=\"https://fonts.googleapis.com/css?family=Montserrat&display=swap\" rel=\"stylesheet\"> ");
$("head").append("<link href=\"http://br3zin.com/css/senpaio.css\" rel=\"stylesheet\"> ");
$("link[href=\"https://senpa.io/web/senpaio.css?a601bf70d0038f71bd6e&amp;a601bf70d0038f71bd6e\"]").attr("href", "http://br3zin.com/css/senpaio.css");

$("head").append("<style>#menu .main-menu .panel.right .region-selectors .tab{background:#2b2b2b00;}#menu .main-menu .panel.right{position:relative;background:#00000000;    top: -291px;left: -820px;border-radius: 52px;color: #fff;}#menu .main-menu .panel.right .region-selectors .tab.active{background:#00000000}#menu .main-menu .panel.right .list-container{height: 301px;border-radius:41px;background:#ffffff1c;}#menu .main-menu .panel.right .list-container #server-list{height: 260px;background :#55555500;}.skin-preview.active {transform: scale(1);animation: pulse 2s infinite;}@keyframes pulse {0% {transform: scale(0.95);	box-shadow: 0 0 10px 2px #ff00a0;}70% {transform: scale(1);box-shadow: 0px 0px 25px 4px #ff00a0;}100% {transform: scale(0.95);box-shadow: 0 0 10px 0 #ff00a0;}}#splash-screen .hage-logo img{display:none;width: 1px;}#huds .minimap-hud #minimapNode{width: 190px;    height: 191px;}#huds .minimap-hud #minimap{} #huds #stats-hud{font-size: 0px;     bottom: 205px;left: 1860px;background: rgb(84, 84, 84);    padding: 1px 6px;color: #fff;} #huds .minimap-hud {border: 0px;}#menu .main-menu .panel.center{position: relative; top:45px;} #menu .main-menu .panel.left .profile-controls{margin-top: 60px;}#menu .main-menu .panel.center .input-field {border-radius: 10px;text-align: center;}#menu .main-menu .panel.center #spectate:hover{border: 0px;     background: #ffc800; transform: scale(0.7); }#menu .main-menu .panel.center #skinURL1{position:relative;top: 21px;} #menu .main-menu .panel.left .profile-controls .skin-preview:hover{transition:all 0.3s;transform: scale(1.2);} #menu .main-menu .panel.center #spectate{border: 0px;     background: #ffc800; position: relative;    height: 90px;width: 90px;;border-radius: 100px;left: 8px; }#menu .main-menu .panel.center .setting-btn:hover {transition:all 0.3s;transform: scale(0.7);} #menu .main-menu .panel.center .setting-btn{    height: 90px;    position: relative;    width: 90px;left: 21px;    background: #004fff;    border: 0px;    border-radius: 100px;} #menu .main-menu .panel.center #play:hover {transform: scale(0.7); border: 0px;background: #ff0000; cursor: url(http://www.rw-designer.com/cursor-extern.php?id=93290);} #menu .main-menu .panel.center #play {border: 0px;width: 108px;background: #ff0000;  position: relative;height: 108px;border-radius: 100px;} #splash-screen .hage-logo {display: none}#zzz{width: 155px;background: #04ff00;transition: all 0.3s;left: 546px;position: relative;top: 457px;} .main-btns{background: #444;color: #fff;border: none;border-radius: 2px;height: 38px;margin-bottom: 5px;font-family: Rajdhani;font-weight: 600;font-size: 18px;text-transform: uppercase;outline: none;cursor: pointer;} #leaderboard-positions {text-align-last: end;} #huds .leaderboard-hud {background-color: #00000000;} #splash-screen {position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background-color: #eeeeee;z-index: 100;opacity: 1;transition: opacity 1s;} #splash-screen .logo {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);} #splash-screen{ background-image: url(https://www.itl.cat/pngfile/big/6-68137_cool-anime-wallpapers-hd-7-anime-wallpaper-full.jpg);} </style>");
$(".logo").remove();
$("#leaderboard-title").replaceWith("<div class=\"leaderboard-title\" style=\"font-size:30px; color:#fff;\"></div>");
$(".panel.center").appendTo(".profile-controls");
$("#ad-slot-center-panel").remove();
$("#server-info").remove();
$(".adsPanel").remove();
$("#ad-slot-left-panel").remove();
$(".info-text").remove()
$("#stats-hud").position("<style> { position:absolute; right:5px; bottom: 220px} <style>") //leaving it for later;
$("center").remove();
$(".info-text").appendTo(".panel.right");
$("#menu").append("<div class=\"menu server-panel\" style=\"display:flex\"></div>");
$(".panel-right").appendTo(".server-panel");
$("#skinURL1").after("<div class=\"control-icon\"><span class=\"skin-icon\"><i class=\"far fa-acorn\"></i></span></div>");
$("#play").text("play");
$("#spectate").text("spectate");
$(".setting-btn-container").remove();
$("#spectate").after("<button class=\"setting-btn\"><i class=\"fal fa-sliders-h fa-2x\"></i></button>");
$(".setting-btn").click(function () {
$("#settings-panel").fadeIn(200)
});
$(".leaderboard-hud").after("<div id=\"time\"></div>");
$("head").append("<style> #time { user-select: none; position:absolute; font-size:21px ; right:13px; top: 224px;font-family: Abel!important; font-weight: 300!important; margin-left: 4px; letter-spacing: 2px; } #div_lb{ width: 270px!important; padding: 10px; background: 0 0!important;} #lb_detail{width: 250px!important; } #lb_detail>div { font-weight: 300; letter-spacing: 1px;} #splash-screen .hage-logo {display: none}</style>");

$(window).load(startTime)
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
var U = false;

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
   t = setTimeout(function() {
    startTime()
  }, 1000);
}
startTime();
var Feed = false;
var tin = 25;
 function keyup(event) {
if (event.keyCode == 87) {
Feed = false;

}
}
function leader(){
     console.log(this.leaderboard);
 }
//macrofeed
function macro() {
if (Feed) {
window.onkeydown({keyCode: 81});
window.onkeyup({keyCode: 81});
setTimeout(macro, tin);
}
}

}