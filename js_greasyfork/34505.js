// ==UserScript== 
// @name         Gota.io script by Sejo
// @namespace    none
// @description  This very first version. Updates will come out soon.
// @version      0.1.1
// @author       Sejo
// @match        http://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34505/Gotaio%20script%20by%20Sejo.user.js
// @updateURL https://update.greasyfork.org/scripts/34505/Gotaio%20script%20by%20Sejo.meta.js
// ==/UserScript==

//hide food
document.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if(key==70){
        document.getElementById('cHideFood').click();
    }
});
//BUTTON

var featurs = document.createElement('div');
featurs.id = "featurs-button";
featurs.innerText="Feautures of script";
document.getElementById('main').appendChild(featurs);
$('#featurs-button').css({
    "width":"200px",
    "height":"25px",
    "border-radius":"10px",
    "border":"2px solid #570000",
    "background-color": "rgba(23, 22, 23, 0.9)",
    "color":"rgba(124, 0, 0)",
    "font":"20px Calibri",
    "text-align":"center",
    "line-height":"25px",
    "position":"relative",
    "top":"-100px",
    "left":"9px",
    "cursor":"pointer",


});
//BLOCK OF INFO
var featursBlock = document.createElement('div');
featursBlock.id = "featurs-block";
document.getElementById('main').appendChild(featursBlock);
$('#featurs-block').css({
    "width":"350px",
    "height":"500px",
    "border-radius":"5px",
    "border":"2px solid #570000",
    "background-color": "rgba(23, 22, 23, 0.9)",
    "font":"20px Calibri",
    "text-align":"center",
    "position":"relative",
    "top":"-595px",
    "margin-left":"-375px",
    "display":"none",
    "color":"white",
});
//Onclick shows features panel
$('#featurs-button').on("click", function(){
	$('#featurs-block').fadeToggle('slow');
});
//TEXT IN BLOCK
var p1 = document.createElement('p');
document.getElementById('featurs-block').appendChild(p1);
p1.innerHTML = "Hello,<br>Thanks for using this script.<br>Here are some features:";

var p2 = document.createElement('p');
document.getElementById('featurs-block').appendChild(p2);
p2.innerHTML = "Toggle Hide Food - F<br>Toggle names - Very Soon<br>Toggle skins - Very Soon";

var aFooter = document.createElement('footer');
aFooter.id ="a-footer";

document.getElementById('featurs-block').appendChild(aFooter);
aFooter.innerHTML = "Created by Sejo";
$('#a-footer').css({
"text-align":"left",
"font-size":"10px",
"position" :"relative",
 "top":"281px",
});


var minimap = document.getElementById('minimap-canvas');
minimap.style.background = "url('https://i.imgur.com/QF3128J.png')";
minimap.style.opacity = ".7";


document.getElementById('main-left').style.display = "none";
document.getElementById('main-content').style.paddingRight = "5px";
document.getElementById('main-content').style.borderRight = "2px solid #570000";
document.getElementById('main-content').style.borderBottomRightRadius = "0px";
document.getElementById('main-content').style.borderTopRightRadius = "0px";
document.getElementById('main').style.width = "640px";
document.getElementById('main').style.background = "rgb(15, 0, 0)";
$(".main-bottom-links").empty(); // removes social media at the bottom


$(function(){
    $('#optionsPanel').css({"position":"absolute", "top":"100px", "left":"5px","opacity":".5"});
    $('#logo').css({"background-image":"url('https://i.imgur.com/38pkJpx.png')"}); //changes logo
    //$('#main-rb').replaceWith(""); // Deletes Add
    $('#leaderboard-panel , #score-panel, #party-panel, #chat-container, #minimap-panel, #btn-servers, #btn-options, #btn-keybinds, #btn-themes, #btn-discord, .main-bottom-stats, #btn-play, #btn-spec, #main').css({"border":"2px solid #570000","color":"#7c0000"});
    $('##chat-container').css({"border":"3px solid #5c0030", "background":"#33001b", "opacity":".5",});
    $('.stext').css({"color":"#9f0052",});
    $('#playerId, #playerScore, #playerFps, #playerCells').css({"color":"#c894ca"});
    // $('.main-bottom-links').replaceWith(50);
});