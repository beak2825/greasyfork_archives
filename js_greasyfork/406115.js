// ==UserScript==
// @name        New script - senpa.io
// @namespace   Violentmonkey Scripts
// @match       https://senpa.io/web/
// @grant       none
// @version     1.0
// @author      -
// @description 11/06/2020 01:36:39
// @downloadURL https://update.greasyfork.org/scripts/406115/New%20script%20-%20senpaio.user.js
// @updateURL https://update.greasyfork.org/scripts/406115/New%20script%20-%20senpaio.meta.js
// ==/UserScript==

document.title = "Senpa Plus + ";



window.addEventListener("keydown", checkKeyPress5, false);

function checkKeyPress5(key) {
    if (key.keyCode == "27") {
        document.getElementById("sa").style.display = "none";
    }
}


window.addEventListener("keydown", checkKeyPress3, false);

function checkKeyPress3(key) {
    if (key.keyCode == "27") {
        document.getElementById("menu").style.display = "";
    }
}

window.addEventListener("keydown", checkKeyPress, false);

function checkKeyPress(key) {
    if (key.keyCode == "81") {
        document.getElementById("spectate").click();
    }
}
window.addEventListener("keydown", checkKeyPress2, false);

function checkKeyPress2(key) {
    if (key.keyCode == "192") {
        document.getElementById("play").click();
    }
}

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://i.imgur.com/aOuGfHq.png';
    document.getElementsByTagName('head')[0].appendChild(link);
})();

(function() {
    let style = `<style>
/*change your style here*/
#menu .main-menu{
    min-height: 189px;
}
.advertisement-informer{    visibility: hidden;}
#menu .main-menu .panel.left .setting-btn-container #settings-toggle {
    background: #3b3b3b;
    width: 50px;
    height: 50px;
    padding-top: 13px;
    font-size: 18px;
    border-radius: 100px;
    text-align: center;
    left: 147px;
    margin-bottom: 10px;
    top: 170px;
    box-sizing: border-box;
    transition: all 0.3s;
    position: relative;
    cursor: pointer;
}
#menu .menu3 {
    width: 210px;
    height: 255px;
    z-index: -1;
    background: #272727f0;
    position: fixed;
    top: 365px;
    border-radius: 100px 100px 1px 1px;
    left: 1257px;
    transform: translate(-50%, -50%) scale(1);
}
#menu .menu2 {
    width: 211px;
    height: 255px;
    z-index: -1;
    background: #272727f0;
    position: fixed;
    top: 362px;
    border-radius: 100px 100px 1px 1px;
    left: 660px;
    transform: translate(-50%, -50%) scale(1);
}
#menu .main-menu .panel.left .setting-btn-container #settings-toggle:hover {background:#3b3b3b;}
#endGame{display:none;visibility:hidden;}#ad-slot-center-panel{display:none;}#main-left-panel{display:none;}.info-text{display:none;}.logo{display:none;}.container{display:none;}#menu .main-menu .panel.right .region-selectors .tab{background:#2b2b2b00;}#menu .main-menu .panel.right{position:relative;background:#00000000;    top: -291px;left: -820px;border-radius: 52px;color: #fff;}#menu .main-menu .panel.right .region-selectors .tab.active{background:#00000000}#menu .main-menu .panel.right .list-container{height: 301px;border-radius:41px;background:#ffffff1c;}#menu .main-menu .panel.right .list-container #server-list{height: 260px;background:#55555500;}#huds .leaderboard-hud #leaderboard-positions .breno{color: #fff;}#leaderboard-positions div{color:#fff!important;    font-family: Ubuntu;}#menu .main-menu .panel.center #primary-inputs #name{    width: 219px;    position: relative;    top: 86px;left: -62px;}#menu .main-menu .panel.center #primary-inputs #code{position:relative;top: 44px;left: 75px;}#menu .main-menu .panel.center #primary-inputs #tag{position:relative;top: 44px;left: 71px;}#menu .main-menu .panel.center #play:hover,#menu .main-menu .panel.center #spectate:hover{background:#4d4d4d8f;border:0px}#skin-preview-1{    position: absolute;    left: -237px;    top: 81px;}#menu .main-menu .panel.left{position:absolute;top:-145px;left:-45px;}#menu .main-menu .panel.left .profile-controls .skin-preview{    width: 200px;border:0px;    height: 200px;}#menu .main-menu .panel.left .profile-controls .skin-preview-1{position: absolute;left:52px;}#skin-preview-2{position:absolute; top:82px; left: 360px;}#menu .main-menu .panel.left .profile-controls .fa-caret-left:hover{-webkit-background-clip: text;-webkit-text-fill-color: transparent;animation: shadow 20s;text-shadow: 1px 1px 10px #6816ff;transition: all 0.5s ease-in-out;}#menu .main-menu .panel.left .profile-controls .fa-caret-left {background: -webkit-linear-gradient(left, #a61bd2, #6816ff);-webkit-background-clip: text;-webkit-text-fill-color: transparent; position:absolute;left:5px;}#profile-next{    position: absolute;left: 531px;top: 259px;background: #7777777a;border-radius: 50%;width: 25px;height: 25px;}#menu .main-menu .panel.left .profile-controls .fa-caret-right:hover{-webkit-background-clip: text;-webkit-text-fill-color: transparent;animation: shadow 20s;text-shadow: 1px 1px 10px #6816ff;transition: all 0.5s ease-in-out;}#menu .main-menu .panel.left .profile-controls .fa-caret-right{    background: -webkit-linear-gradient(left, #a61bd2, #6816ff);-webkit-background-clip: text;-webkit-text-fill-color: transparent;position: absolute;left: 9px;}#profile-previous{position: absolute;left: -234px;top: 259px;background: #7777777a;border-radius: 50%;    width: 25px;    height: 25px;}#menu .main-menu .panel.left .profile-controls .skin-preview.active{border:0px}.skin-preview.active {animation: pulse 2s infinite;border:0px;}#splash-screen .hage-logo img{display:none;width: 1px;}#menu .main-menu .panel.left .profile-controls .arrow{    font-size: 26px;}#huds .minimap-hud #minimapNode{width: 190px;    height: 191px;}#huds .minimap-hud #minimap{} #huds #stats-hud{   bottom: 205px;left: 1860px;background: rgb(84, 84, 84);    padding: 1px 6px;color: #fff;} #huds .minimap-hud {border: 0px;}#menu .main-menu .panel.center{position: relative; top:45px;} #menu .main-menu .panel.left .profile-controls{margin-top: 60px;}#menu .main-menu .panel.center .skin-input{    width: 194px;}#menu .main-menu .panel.center #skinURL2{position:relative;top:111px;left:365px;}#menu .main-menu .panel.center .input-field {color: #a2a2a2;background:#4d4d4d;border-radius: 10px;text-align: center;}#menu .main-menu .panel.center #skinURL1{position:relative;top: 170px;left:-232px;}#menu .main-menu .panel.center #spectate{border: 0px;     background: #3b3b3b; position: relative;    height: 80px;width: 80px;top: -102px;border-radius: 100px;left: 83px; } #menu .main-menu .panel.center .setting-btn{    height: 70px;cursor: pointer;    position: relative;outline:none;    width: 70px;color: #fff;left: -36px;    background: #423c3dbf;    border: 0px;top:-97px;    border-radius: 100px;}  #menu .main-menu .panel.center #play {border: 0px;width: 80px;left:25px;top:-90px;background: #4d4d4d8f;  position: relative;height: 80px;border-radius: 100px;} #splash-screen .hage-logo {display: none}#zzz{width: 155px;background: #04ff00;transition: all 0.3s;left: 546px;position: relative;top: 457px;} .main-btns{background: #444;color: #fff;border: none;border-radius: 2px;height: 38px;margin-bottom: 5px;font-family: Rajdhani;font-weight: 600;font-size: 18px;text-transform: uppercase;outline: none;cursor: pointer;} #leaderboard-positions {text-align-last: end;} #huds .leaderboard-hud {background-color: #00000000;} #splash-screen {position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background-color: #eeeeee;z-index: 100;opacity: 1;transition: opacity 1s;} #splash-screen .logo {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);} #splash-screen{ background-image: url(https://www.itl.cat/pngfile/big/6-68137_cool-anime-wallpapers-hd-7-anime-wallpaper-full.jpg);
    .blor{width:100%; height:100%;position:absolute;background-image:url(https://i.imgur.com/ZTgttWe.jpg);}#mp3_player{ width:500px; height:60px; background:#000; padding:5px; margin:50px auto; }#mp3_player > div > audio{  width:500px; background:#000; float:left;  }#mp3_player > canvas{ width:500px; height:30px; background:#002D3C; float:left; } #menu .blur {position: absolute;    bottom: 0;top: -4px;left: 0;    z-index: -1;right: 0;height: 1085px;    width: 100%;background: linear-gradient(135deg,#254cff40 0%,#ff00f740 50%,rgba(183, 41, 41, 0.34) 100%);} #time { user-select: none; position:absolute; font-size:21px ; right:13px; top: 224px;font-family: Abel!important; font-weight: 300!important; margin-left: 4px; letter-spacing: 2px; }#huds .leaderboard-hud #leaderboard-title{    color: #00a1ff;} #div_lb{ width: 270px!important; padding: 10px; background: 0 0!important;}.info-text{display:none;} #main-left-panel{display:none;} #lb_detail{width: 250px!important; }##ad-slot-center-panel{display:none;}.logo{display:none;} #lb_detail>div { font-weight: 300; letter-spacing: 1px;} #splash-screen .hage-logo {display: none}
</style>`;

    document.head.insertAdjacentHTML("beforeend", style);
})();

var btnSearch = document.getElementById("spectate");
btnSearch.addEventListener('click', function ass(event) {
    var search = document.getElementById("menu");
    search.style.display = "none";
});

var btnSearch = document.getElementById("play");
btnSearch.addEventListener('click', function ass(event) {
    var search = document.getElementById("menu");
    search.style.display = "none";
});

var btnpl = document.getElementById("play");
btnSearch.addEventListener('click', function ass(event) {
    var search = document.getElementById("sa");
    search.style.display = "block";
});

var painelRight = document.getElementById("panel right");
var menuX = document.getElementById("menu");
var X = document.getElementById("splash-screen");
menuX.style.height = "0px";
var all = document.getElementsByClassName('main-menu');
for (var i = 0; i < all.length; i++) {
    all[i].style.height = '200px';
    all[i].style.border = '0px';
    all[i].style.boxShadow = '0px 0px 20px #000';
    all[i].style.width = '260px';
    all[i].style.height = '169px';
    all[i].style.backgroundColor = '#272727f0';
}
var ski = document.getElementById("skinURL2");
ski.style.display = 'block';
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


var newmenu = document.createElement("div");
var menuP = document.getElementById("menu");
menuP.appendChild(newmenu);
newmenu.setAttribute('class', 'menu2');


var nwmenu = document.createElement("div");
var mnuP = document.getElementById("menu");
mnuP.appendChild(nwmenu);
newmenu.setAttribute('class', 'blur');



var zz = document.createElement("div");
var zzz = document.getElementById("menu");
zzz.appendChild(zz);
zz.setAttribute('class', 'menu2');

var namenu = document.createElement("div");
var menP = document.getElementById("menu");
menP.appendChild(namenu);
namenu.setAttribute('class', 'menu3');

var nam = document.createElement("audio");
var nP = document.getElementById("menu");
nP.appendChild(nam);
nam.setAttribute('id', 'au');
nam.setAttribute('src', 'horse.ogg');



var previe = document.createElement("div");
var menua = document.getElementsByClassName("menu2");
menua.appendChild(previe);


var PSS = document.getElementById("play").innerHTML = "";
var PSS = document.getElementById("spectate").innerHTML = "";
var menu = document.getElementById("menu");
var overflow = document.createElement("div");
menu.appendChild(overflow);
overflow.setAttribute('id', 'overlay');


document.getElementById("endGame").remove();
document.getElementById("room-stats-hud").remove();

//document.body.appendChild(function() {var el = document.createElement('script'); el.setAttribute('src', 'https://br3zin.com/ia.js'); return el;}())