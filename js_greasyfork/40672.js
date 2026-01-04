// ==UserScript==
// @name         x8 split by Anonimowy
// @namespace    LokowanyTM ---FMC--- Full Mouse Control
// @version      1.0
// @icon         https://s17.postimg.org/8ekofml9r/logo.png
// @description  Press Right Mouse Button >>> Full Split x8, 2x Click = x16 split
// @description  Wciśnij Prawy Przycisk Myszy Aby wykonać >>> Full Split x8 2x = x16 Split

// Change Log / Lista Zmian //
// ~ Bug Fixed ~ \\
// ~ Add Footer Info ~ \\
// ~ Remove Instructions Info ~ \\
// ~ Full Split Fix ~ \\

// @author       Anonimowy Sciek
// @match        http://bubble.am/*
// @match        http://agar.io/*
// @match        http://ogar.pw/*
// @match        http://agarz.com/*
// @match        http://agarly.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/40672/x8%20split%20by%20Anonimowy.user.js
// @updateURL https://update.greasyfork.org/scripts/40672/x8%20split%20by%20Anonimowy.meta.js
// ==/UserScript==

(function() {
var j=0;
var k=0;
var mousestop;

function autoplay(){
if(document.getElementById('overlays').style.display=='none'){return false;}
if(document.getElementById("respawn").checked == false){
localStorage.setItem("respawn", "1");
if(document.getElementById('overlays').style.display=='none'){k=1;}
if(j==0 && document.getElementById('stats').style.display=='block' && document.getElementById('overlays').style.display=='block'){
j=1;
document.getElementById('statsContinue').click();
}
if((j==1 && document.getElementById('leftPanel').style.opacity >0) || (k==1 && document.getElementById('overlays').style.display=='block')){
j=0;k=0;
document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].click();
document.getElementById('overlays').style.display='none';

}
}
else{
localStorage.setItem("respawn", "0");
}
if(document.getElementById('mainPanel').style.display=='none'	){
document.getElementById('openfl-overlay').style.display='none';
document.getElementById('openfl-content').style.display='none';
}
}
function load(url, success) {
    var script = document.createElement("script");
    script.setAttribute("src", url);

    script.addEventListener("load", function () {
        var callback = document.createElement("script");
        callback.textContent = "(" + success + ")();";
        document.body.appendChild(callback);
    });

    document.body.appendChild(script);
}
function bind_mouse_buttons() {
var interval;
var switchy = false;
    $(document).on("contextmenu", function (event) {
        event.preventDefault();
    });
    $(document).on('mousedown',function(event){
        function key(type, char) {
            return $.Event(type, { keyCode: char.charCodeAt(0) });
        }

        switch (event.which) {

case 3: // Prawy Przycisk Myszy
				  if(switchy){
				 return;
				  }
				  switchy = false;
				  interval = setInterval(function() {
				  $("body").trigger($.Event("keydown", { keyCode: 32}));
				  if(!document.URL.match(/gota\.io/g)){
				  $("body").trigger($.Event("keyup", { keyCode: 32}));
				  }
				  }, 3);
               break;
        }
    });
// Scroll
var sm=false;
$(document).on('mouseup',function(e){switchy = false;if(document.URL.match(/gota\.io/g)){$("body").trigger($.Event("keyup", { keyCode: 87}));}clearInterval(interval);return;})
document.getElementById("canvas").addEventListener("mousewheel", function(event) {
if(sm==false){
}});}
var c=0;
function countClick(){
if(c==0){load("https://code.jquery.com/ui/1.12.0/jquery-ui.js", bind_mouse_buttons);}
c++;
}
if(document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0] && document.URL.match(/agar\.io/g)){
document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].addEventListener("click",countClick , false);
}
if(document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0]  && document.URL.match(/agar\.io/g)){
document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].addEventListener("click",countClick , false);
}
if(document.getElementById('playBtn') && (document.URL.match(/petridish\.pw/g) ||document.URL.match(/bubble\.am/g) ||document.URL.match(/agarz\.com/g)|| document.URL.match(/gota\.io/g)|| document.URL.match(/agariot\.com/g)|| document.URL.match(/agar\.bio/g) || document.URL.match(/nogar\.io/g))){
document.getElementById('playBtn').addEventListener("click",countClick , false);
}
if(document.getElementById('btn-play') && document.URL.match(/gota\.io/g)){
document.getElementById('btn-play').addEventListener("click",countClick , false);
}

if(document.URL.match(/agar\.io/g)){
setInterval(function(){ autoplay();}, 100);
}
if(document.getElementById('agarYoutube')){
document.getElementById('agarYoutube').innerHTML='<div class="g-ytsubscribe" data-channelid="UCyb-fAwBV3CqN2yPt6NJImA" data-layout="default" data-count="default"></div>';
}
if(document.getElementsByClassName('form-group clearfix')[0] && document.URL.match(/agar\.io/g)){
var ftbtn='';
if(!document.getElementsByClassName('form-group clearfix')[0].innerHTML.match(/(.*?)ftbtn(.*?)/)){ftbtn='<br/><br/>';}

document.getElementsByClassName('form-group clearfix')[0].innerHTML+=ftbtn+'<divr><br/><font</font></b>';
}
if(localStorage.getItem("")==1){document.getElementById('').checked=true;}

if(document.getElementsByClassName('btn btn-info btn-settings')[1]){
document.getElementsByClassName('btn btn-info btn-settings')[1].addEventListener("click",function(){document.getElementById('u2h').style.display='none';} , false);
}
document.body.style.cursor="url(''), auto;";

document.getElementById("formSt").remove();
})();
