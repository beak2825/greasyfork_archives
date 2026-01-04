// ==UserScript==
// @name         AtajosScriptByStorm
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Atajos Gota.io
// @author       Storm
// @match        http://gota.io/web/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36683/AtajosScriptByStorm.user.js
// @updateURL https://update.greasyfork.org/scripts/36683/AtajosScriptByStorm.meta.js
// ==/UserScript==

//Ocultar Comida (Hide Food Option)
document.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if(key==49){
        document.getElementById('cHideFood').click();
    }
});

//Ocultar Chat (Hide Chat Option)
document.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if(key==50){
        document.getElementById('cHideChat').click();
    }
});

//Ocultar Minimapa (Hide Minimap Option)
document.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if(key==51){
        document.getElementById('sHideMinimap').click();
    }
});

//Mostrar Masa (Show Mass Option)
document.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if(key==52){
        document.getElementById('sShowMass').click();
    }
});
//Boton

var featurs=document.createElement("div");featurs.id="featurs-button",featurs.innerText="Atajos",document.getElementById("main").appendChild(featurs),$("#featurs-button").css({width:"316px",height:"25px","border-radius":"10px",border:"1px solid #ffffff","background-color":"#191919",color:"#ffffff",font:"20px Calibri","text-align":"center","line-height":"25px",position:"relative",top:"-124px",left:"0px",cursor:"pointer"});var featursBlock=document.createElement("div");featursBlock.id="featurs-block",document.getElementById("main").appendChild(featursBlock),$("#featurs-block").css({width:"350px",height:"500px","border-radius":"50px",border:"2px solid #3d3d3d",background:"rgba(14, 14, 14)",font:"20px Calibri","text-align":"center",position:"relative",top:"-595px","margin-left":"-375px",display:"none",color:"white"}),$("#featurs-button").on("click",function(){$("#featurs-block").fadeToggle("slow")});var p1=document.createElement("p");document.getElementById("featurs-block").appendChild(p1),p1.innerHTML="Atajos Script By Storm <br>Proximamente: Atajos Customizables:";var p2=document.createElement("p");document.getElementById("featurs-block").appendChild(p2),p2.innerHTML="//Ocultar Comida   - Hide Food          = Tecla ''1''<br>//Ocultar Chat     - Hide Chat          = Tecla ''2''<br>//Ocultar Minimapa - Hide Minimap          = Tecla ''3''<br>//Mostrar Masa     - Show Mass          = Tecla ''4''";var aFooter=document.createElement("footer");aFooter.id="a-footer",document.getElementById("featurs-block").appendChild(aFooter),aFooter.innerHTML="Shortcuts Gota.io By Storm",$("#a-footer").css({"text-align":"left","font-size":"10px",position:"relative",top:"281px"});

$(".main-bottom-links").empty();
$("#btn-discord").empty();


$('#optionsPanel').css({"position":"absolute", "top":"100px", "left":"5px","opacity":".5"});
$('#logo').css({"background-image":"url('https://i.imgur.com/ZEhJaXO.png')"});
$('#main').css({"background-image":"url('https://c1.staticflickr.com/8/7430/11833986113_1315d0323f_b.jpg')"});
$('#main-scrimmage').css({"background-image":"url('https://c1.staticflickr.com/8/7430/11833986113_1315d0323f_b.jpg')"});
$('#feautrs-block').css({"background-image":"url('https://i.ytimg.com/vi/mcSs2YgJOj8/maxresdefault.jpg')"});
$('#minimap-canvas').css({"background-image":"url('https://i.imgur.com/BiiaeBB.png')"});
$('#btn-play').css({"background-image":"url('http://www.timesa.com.gt/sites/default/files/524.AZUL-REAL.jpg')"});
$('#btn-spec').css({"background-image":"url('http://www.shbroaden.com/uploadfile/color/201309/20130912124528977.jpg')"});
$("head").append(`<style type="text/css">
 #chat-container {
        border-width: 0px;
        margin-bottom: 5px;
    }
    .main-bottom-stats {
        margin-left: 5000px;
    }
    .divider {
        margin-left: 5000px;
    }
    #chat-input {
        border-width: 0px;
        margin-bottom: 5px;
    }
    * #chat-panel {
        width: 300px;
        height: 195px;
    }
    * .main-bottom-stats {
        margin-right: 5000px;
    }
    * #btn-spec {
        width: 152px;
    }
    * #btn-play {
        width: 152px;
        margin-right: 0px;
    }
    * .bottom-btn {
        width: 318px;
    }
    * #chat-input, * #name-box {
        font-weight: bold;
    }
    * .stext {
        margin-top: 2px;
        margin-bottom: 2px;
    }
    * .server-row {
        transition: all 0.3s;
    }
    * .server-row:hover {
        font-size: 16px;
        font-weight: bold;
    }
 input[type="checkbox" i] {-webkit-appearance: none; background: #424140; color: white; border-radius: 50px; padding: 4px; transition: background 0.3s;}
    input[type="checkbox" i]:checked {background: #1400f7; color: #00ef17; padding: 4px; padding-right: 9px;}
    input[type="checkbox" i]:checked:after {content: "✔";}
    input[type="checkbox" i]:not(:checked):before {content: "X"}
    .options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 50px; width: 10px;}
    .options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 50px;}
    tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 50px;}
</style>`);

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

document.getElementById('main-left').style.display = "none";
document.getElementById('main-right').style.widht = "700px";
document.getElementById('main-content').style.paddingRight = "5px";
document.getElementById('main-content').style.borderBottomRightRadius = "0px";
document.getElementById('main-content').style.borderTopRightRadius = "0px";
document.getElementById('main').style.width = "640px";
document.getElementById('main').style.borderRadius = "50px";
//Border Removal
document.getElementById("leaderboard-panel").style.borderRadius = "0";
document.getElementById("leaderboard-panel").style.borderWidth = "0px";
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("score-panel").style.borderRadius = "0";
document.getElementById("score-panel").style.borderWidth = "0px";
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.borderRadius = "0";
document.getElementById("main-scrimmage").style.borderRadius = "50px";
document.getElementById("minimap-panel").style.borderWidth = "0px";
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.marginBottom = "3px";
document.getElementById("party-panel").style.borderRadius = "0";
document.getElementById("party-panel").style.borderWidth = "0px";
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";

spike.src = "https://i.imgur.com/urteLj2.png";

var newTitle = "Gota ExtByStorm";
document.title = newTitle;
document.querySelector("div.boardTitle").textContent = newTitle;

