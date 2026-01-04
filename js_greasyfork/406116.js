// ==UserScript==
// @name         0W Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       UWU
// @match        https://gota.io/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406116/0W%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/406116/0W%20Tool.meta.js
// ==/UserScript==

 document.title = "0W Tool"
document.getElementsByTagName("body")[0].style.cursor = "url('http://www.rw-designer.com/cursor-extern.php?id=93290'), auto";
$("head").append("<script src=\"https://kit.fontawesome.com/a076d05399.js\"></script>");
var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Ubuntu');
document.head.appendChild(link);
var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';
var css = '@keyframes rotate{from{transform: rotate(-360deg);}}#overlay {    width: 200%;    height: 200%;    position: fixed;    margin-left: -622px;    z-index: -61;    background: radial-gradient(rgba(255, 0, 0, 0.25),rgba(113, 113, 113, 0.5));    margin-top: -304px;}.main-panel-wrapper{    background: #272727;    width: 687px;    height: 481px;}#splash-screen {    width: 100%;    height: 100%;    position: fixed;    background-image: url(https://i.imgur.com/S791pkX.jpg);    z-index: 999993;}.image-spash {    width: 401px;    height: 401px;    margin: auto;    background-image: url(https://i.imgur.com/ArgMsGe.png);    background-size: cover;    margin-top: 303px;    animation: rotate 2s linear infinite;}.spl {    font-size: 40px;    font-family: Ubuntu;    margin: auto;    margin-left: 756px;    color: #ffffff;    margin-top: 219px;    text-shadow: 0px 0px 10px;}#menu-Social { display:none;   width: 522px;    height: 433px;    position: absolute;    left: 173px;    top: 57px;    background: #272727;    z-index: 10;}#container-Social {    width: 396px;    height: 283px;    margin-top: 46px;    border-radius: 18px;    margin-left: 34px;    padding: 32px;    display: flex;}.imgchannel {    width: 150px;    height: 150px;    border-radius: 50%;    background-image: url(https://i.imgur.com/Z5Zu1Pk.png);    background-size: cover;}#linkdiscchanel {    height: 47px;    color: #fff;    width: 169px;    position: absolute;    top: 255px;    border: 0;    border-radius: 20px;    left: 279px;    background: #f00;    font-size: 25px;    font-family: Ubuntu;}.imgdischannel {    width: 150px;    height: 150px;    border-radius: 50%;    background-image: url(https://i.imgur.com/QtuXUAo.png);    background-size: cover;    margin-left: 74px;    background-position-x: -56px;}.linkchanel {    height: 47px;    color: #fff;    width: 169px;    position: absolute;    top: 255px;    border: 0;    left: 61px;    border-radius: 20px;    background: #f00;    font-size: 25px;    font-family: Ubuntu;}#chat-body-0.title-text{visibility: hidden;}#Socia {    color: #fff;    transition: 2s;    font-size: 19px;    position: relative;    top: 35px;    height: 64px;    width: 172px;    background: #ff2b2b;    font-family: Ubuntu;    text-align: center;    border: 0;    margin-left: -9px;    outline: none;}#Socia:hover{background:#fff;color:#000;}#menu-Announcement {    width: 522px;    height: 433px;    position: absolute;    left: 173px;    top: 57px;    background: #272727;    z-index: 10;    display: none;}.container-Annon {    width: 322px;    height: 281px;    background: #505050;    margin-top: 46px;    border-radius: 18px;    margin-left: 64px;    padding: 32px;}.title-annon {    position: absolute;    left: 158px;    font-size: 25px;    top: -21px;    font-family: Ubuntu;}.skin-preview:hover{    transform: scale(1.2);}.skin-preview {     background-size: cover;      transition: 2s; width: 80px;    height: 80px;   display: inline-block;    border-radius: 50%;    margin-left: 13px;    margin-top: 22px;}#skin {    background-image: url(https://i.imgur.com/8k2eUNi.jpg);}#skin2 {    background-image: url(https://i.imgur.com/g3yPp5g.jpg);}#skin3 {    background-image: url(https://i.imgur.com/5tfBimr.jpg);}#skin4 {    background-image: url(https://i.imgur.com/gCABBxr.jpg);}#skin5 {    background-image: url(https://i.imgur.com/T9fXF1O.jpg);}#skin6 {    background-image: url(https://i.imgur.com/fJZl89d.jpg);}#skin7 {    background-image: url(https://i.imgur.com/OhGgprk.jpg);}#skin8 {    background-image: url(https://i.imgur.com/73oE9G7.jpg);}#skin9 {    background-image: url(https://i.imgur.com/Ya715ae.jpg);}#skin10 {    background-image: url(https://i.imgur.com/NHx7HPx.jpg);}#con-preview {    width: 490px;    height: 235px;    position: absolute;   top: 60px;    left: 192px;}.title-chann {    position: absolute;    left: 199px;    font-size: 25px;    top: -21px;    font-family: Ubuntu;}.server-table thead{display:none;}.container-chan {    width: 322px;    height: 281px;    background: #505050;    margin-top: 46px;    border-radius: 18px;    margin-left: 64px;    padding: 32px;}#menu-changelog {    width: 522px;    height: 433px;    position: absolute;    left: 173px;    top: 57px;    background: #272727;    z-index: 10;display:none;}#announcement {    color: #fff;    transition: 2s;    font-size: 19px;    position: relative;    top: 32px;    height: 62px;    width: 172px;    background: #ff2b2b;    font-family: Ubuntu;    text-align: center;    border: 0;    margin-left: -9px;    outline: none;}#announcement:focus{background:#fff;color:#000;}#announcement:hover{background:#fff;color:#000;}#text-changelog:hover{background:#fff;color:#000;}.gota-btn:focus{background-color: #fff ;color : #000 ; }.bottom-btn:focus{background:#fff;color:#000;}#btn-servers:focus{background:#fff;color:#000;}#btn-options:focus{background:#fff;color:#000;}#text-home2:active{background:#fff;color:#000;}#text-home2:focus{background:#fff;color:#000;}#text-changelog:focus{background:#fff;color:#000;}#text-changelog {    color: #fff;    transition: 2s;    font-size: 19px;    position: relative;    top: 32px;    height: 62px;width: 172px;    background: #ff2b2b;    font-family: Ubuntu;    text-align: center;    border: 0;    margin-left: -9px;    outline: none;}.title-text{visibility: hidden;}.fa-user {    position: relative;    top: 67px;    font-size: 16px;    margin: auto;    margin-left: -305px;}span {     font-family: Ubuntu;   color: #fff!important;}#chat-container{    background-color: rgba(23, 22, 23, 0.22)!important;}#leaderboard-uwu {   color: #f00; position: relative;    bottom: 287px;    font-size: 31px;    left: 10px;}.gota-btn:hover{box-shadow:0!important;}#text-home2 {    color: #fff; transition: 2s;   font-size: 25px;    position: relative;    top: -150px;    height: 62px;    width: 172px;    background: #ff2b2b;    font-family: Ubuntu;    text-align: center;border: 0;margin-left: -9px;outline: none;}.fa-cogs {    font-size: 38px;    color: #000;    margin-top: 9px;    margin-left: 9px;}#text-home {       color: #000; font-size: 38px;    position: relative;    top: 9px;    font-family: Ubuntu;    text-align: initial;    margin-left: 12px;}.pID{display:block;}#line-top {       display: flex; width: 694px;    height: 56px;    background: #fff;    position: relative;    margin-top: -492px;    margin-left: -9px;}@font-face {    font-family: Ubuntu;  src:;}#main-themes{position: relative;z-index: 10;    right: 116px;    bottom: 57px;}#preview {    position: absolute;    width: 210px;    height: 211px;    top: 45px;    left: 83px;    background-image: url(https://i.imgur.com/Qfxdhwz.png);    background-size: contain;}#btn-options:hover{color:#000!important;background:#fff!important;}#btn-options {     border-radius: 0px!important;   background-color: #ff2b2b!important;    border: 0!important;    position: relative;    top: 37px;    right: 9px;    height: 62px;    width: 172px;}#btn-themes {   border-radius: 0px!important;  border: 0!important;    background-color: #ff2b2b!important;    position: relative;    top: 35px;    height: 62px;    width: 172px;    right: 9px;}#btn-themes:hover{background:#fff!important;color:#000!important;    box-shadow: 0px 0px 0px;}#text-home2:hover{background:#fff;color:#000;}.gota-btn{transition: 2s;font-family: Ubuntu;border-radius:0!important;}#data-hora {      font-family: Ubuntu;  color: #fff;    font-size: 20px;    z-index: 100000!important;    position: absolute;    background: #12121200;    left: 90vw;    top: 249px;}#btn-servers:hover{background:#fff!important;color:#000!important; box-shadow:0px 0px 0px;}#btn-servers {   border-radius: 0px!important;   border: 0!important;    background-color: #ff2b2b!important;    position: relative;    right: 9px;    top: 225px;    height: 62px;    width: 172px;}.gota-input{    border: 0;    background-color: #383838;    border-radius: 12px;    color: #fff;}#name-box:focus{ border-bottom: 2px solid #f00;}#name-box{position: absolute;    transition: 2s;    width: 249px;    height: 33px;top: 299px;    left: 313px;    border-radius: 0px!important;background-color: #272727!important;    border-bottom: 2px solid #fff;}.server-row:hover{    transform: scale(1.1);color:#fff;}#server-content{    background-color: #272727!important;width: 520px;    height: 384px;    margin-top: 2px;}.server-table-mode {    width: 113px;    white-space: nowrap;    text-align: right;    font-size: 19px;    font-family: Ubuntu;    color: #929292;}.server-table-players {    width: 142px;    white-space: nowrap;    text-align: center;    font-size: 19px;    color: #929292;    font-family: Ubuntu;}.server-selected{    background-color: rgba(86, 86, 86, 0.7);}.server-table-name {    width: 118px;    white-space: nowrap;    text-align: left;    font-size: 19px;    padding-right: 48px;    font-family: Ubuntu;    color: #929292;}.server-table{    width: 511px;}.server-table tbody{    background-color: #272727!important;}#score-panel{display:flex;}#score-panel p{    font-size: 20px;}#server-tab-container{position: relative;left: 82px;color: #fff;font-family: Ubuntu;}#main-servers{position: relative;    right: 124px;    top: 9px;    z-index: 10;}#party-panel{background-color: #17161700!important;    border: 0!important;}#btn-spec {    background-color: #ffc300e6!important;    border: 0!important;    position: absolute;    top: 390px;    left: 450px;    width: 217px;    height: 39px;    border-radius: 27px!important;}.options-container{      font-family: Ubuntu;  margin-left: -11px;    border-radius: 0px!important;background-color: #272727!important;    width: 522px;    height: 433px;    margin-top: 75px;}#main-options{   z-index:10; position: relative;    right: 116px;bottom: 57px;}#btn-play {    background-color:rgba(46, 101, 255, 0.9)!important;    border: 0!important;    width: 217px;    position: absolute;    top: 390px;    height: 39px;    left: 211px;    border-radius: 27px!important;}.main{    width: 676px;border:0;    box-shadow: 0px 0px 13px #000;top:22%;}#main{   background-color: #272727!important;}#minimap-panel{opacity: 0.9;background-image: url(https://i.imgur.com/ARaNaZO.png);background-size: cover;border: 2px solid rgb(0, 79, 255)!important;    background-color: rgba(23, 22, 23, 0.63)!important;}.chat-name{color:#fff!important;font-size: 18px;    font-family: unset;}#chat-components{display:none;}#score-panel{background-color:#0000!important;border:0!important;}#chat-panel{border:0!important;width: 324px!important;    height: 364px!important;}.lh{    visibility: hidden;color: #004fff;    font-size: 38px;}#leaderboard-panel { border:0!important; background-color:#0000!important; }';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
$(".chat-table > #chat-body-0 > tr > td > span").text("[UWU's message] Welcome to my extension - 0W Tool. Subscribe to my channel: UWUx ");
$(".server-table > .server-table-name > span").text(" ");
$(".server-table > .server-table-players > span").text(" ");
$(".server-table > .server-table-mode > span").text(" ");
$("#chat-tab-container").remove()
$(".main-panel-wrapper").append("<i class=\"fas fa-user\"></i>");
$("#extra-panel").remove()
$("#chat-emote-btn").remove()
$("#main-left").remove()
$(".main-bottom-links").remove()
$(".policyLinks").remove()
$(".divider").remove()
$(".main-top").remove()
$(".main-bottom-right").remove()
$("#btn-reddit").remove()
$("#btn-discord").remove()
$("head").append("<link href=\"https://i.imgur.com/p3zYhN1.png\" rel=\"shortcur icon\">");
 $("head").append("<link href=\"http://fonts.googleapis.com/css?family=Ubuntu&subset=cyrillic,latin\">");
document.getElementById("leaderboard-header").innerHTML = "0W Tool";
var team = document.getElementById("party-header").innerHTML = "TEAM PLAYERS";
var server = document.getElementById("btn-servers").innerHTML = "Server";
window.addEventListener("keydown", checkKeyPress3, false);
function checkKeyPress3(key) {
    if (key.keyCode == "13") {
        document.getElementById("chat-components").style.display = "block";
    }
}
var br4 = document.createElement("div");
 var br5 = document.getElementById("main");
br5.appendChild(br4);
br4.setAttribute('id', 'line-top');
//------------------------------
var spla = document.createElement("div");
 var spla2 = document.getElementById("main");
spla2.appendChild(spla);
spla.setAttribute('id', 'overlay');
//------------------------------
var br8 = document.createElement("i");
 var br9 = document.getElementById("line-top");
br9.appendChild(br8);
br8.setAttribute('class', 'fas fa-cogs')
//-------------------------------------
var br6 = document.createElement("div");
 var br7 = document.getElementById("line-top");
br7.appendChild(br6);
br6.setAttribute('id', 'text-home');
br6.innerHTML = "MENU";
//------------------------------------
var br10 = document.createElement("button");
 var br11 = document.getElementById("main-content");
br11.appendChild(br10);
br10.setAttribute('id', 'text-home2');
br10.innerHTML = "Home";
//-----------------
var sp1 = document.createElement("div");
 var sp2 = document.body;
sp2.appendChild(sp1);
sp1.setAttribute('id', 'splash-screen');
//-----------------
var sp3 = document.createElement("div");
 var sp4 = document.getElementById("splash-screen");
sp4.appendChild(sp3);
sp3.setAttribute('class', 'image-spash');
//-----------------
var sp5 = document.createElement("p");
 var sp6 = document.getElementById("splash-screen");
sp6.appendChild(sp5);
sp5.setAttribute('class', 'spl');
sp5.innerHTML = "Uwu Extension © 2020 ";
//-----------------
var menuann = document.createElement("div");
 var menuann2 = document.getElementById("main-content");
menuann2.appendChild(menuann);
menuann.setAttribute('id', 'menu-Announcement');
//-----------------
var btns = document.createElement("button");
 var btns2 = document.getElementById("main-content");
btns2.appendChild(btns);
btns.setAttribute('id', 'Socia');
btns.innerHTML = "Social";
//-----------------
var menuann3 = document.createElement("div");
 var menuann4 = document.getElementById("menu-Announcement");
menuann4.appendChild(menuann3);
menuann3.setAttribute('class', 'container-Annon');
//-----------------
var menuann5 = document.createElement("p");
 var menuann6 = document.getElementById("menu-Announcement");
menuann6.appendChild(menuann5);
menuann5.setAttribute('class', 'title-annon');
menuann5.innerHTML = "Announcements";
//-----------------
var menuchangelo = document.createElement("div");
 var menuchangelo2 = document.getElementById("main-content");
menuchangelo2.appendChild(menuchangelo);
menuchangelo.setAttribute('id', 'menu-changelog');
//------------
var changelog = document.createElement("button");
 var changelog2 = document.getElementById("main-content");
changelog2.appendChild(changelog);
changelog.setAttribute('id', 'text-changelog');
changelog.innerHTML = "Changelog";
//-------------------------
var changelogm = document.createElement("div");
 var changelogm2 = document.getElementById("menu-changelog");
changelogm2.appendChild(changelogm);
changelogm.setAttribute('class', 'container-chan');
//-------------------------
var changelogt = document.createElement("p");
 var changelogt2 = document.getElementById("menu-changelog");
changelogt2.appendChild(changelogt);
changelogt.setAttribute('class', 'title-chann');
changelogt.innerHTML = "Changelog";
//--------------------------
var announcement = document.createElement("button");
 var announcement2 = document.getElementById("main-content");
announcement2.appendChild(announcement);
announcement.setAttribute('id', 'announcement');
announcement.innerHTML = "Announcements";
// ------------------------
var hora = document.createElement("div");
 var date = document.getElementById("canvas-container");
date.appendChild(hora);
hora.setAttribute('id', 'data-hora');
//-----------------------------
var leader = document.createElement("p");
 var board = document.getElementById("leaderboard-panel");
board.appendChild(leader);
leader.setAttribute('id', 'leaderboard-uwu');
leader.innerHTML="0W Tool";
//------------------------------
var con = document.createElement("div");
 var preview = document.getElementById("main-content");
preview.appendChild(con);
con.setAttribute('id', 'con-preview');
//------------------------------
var s1 = document.createElement("div");
 var s2 = document.getElementById("main-content");
s2.appendChild(s1);
s1.setAttribute('id', 'menu-Social');
//-----------------------------
var s3 = document.createElement("div");
 var s4 = document.getElementById("menu-Social");
s4.appendChild(s3);
s3.setAttribute('id', 'container-Social');
//-----------------------------
var s5 = document.createElement("button");
 var s6 = document.getElementById("container-Social");
s6.appendChild(s5);
s5.setAttribute('class', 'linkchanel');
s5.setAttribute('onclick', 'channel()');
s5.innerHTML="Subscribe";
s5.setAttribute('href', 'https://www.youtube.com/channel/UC-V-l4SrYkL82r2yaaf4ZhA?view_as=subscriber');
function channel(){
var chn = "https://www.youtube.com/channel/UC-V-l4SrYkL82r2yaaf4ZhA?view_as=subscriber";
   window.location(chn);
}
//-----------------------------
var s7 = document.createElement("div");
 var s8 = document.getElementById("container-Social");
s8.appendChild(s7);
s7.setAttribute('class', 'imgchannel');
//-----------------------------
var s9 = document.createElement("div");
 var s10 = document.getElementById("container-Social");
s10.appendChild(s9);
s9.setAttribute('class', 'imgdischannel');
//-----------------------------
var s11 = document.createElement("button");
 var s12 = document.getElementById("container-Social");
s12.appendChild(s11);
s11.innerHTML="Join";
s11.setAttribute('onclick', 'discord()');
s11.setAttribute('id', 'linkdiscchanel');
s11.setAttribute('type', 'button');
function discord(){
var dhn = "https://discord.gg/8TYtgRS";
   window.location(dhn);
}
var s22 = document.createElement("a");
var s23 = document.getElementById("linkdiscchanel");
s23.appendChild(s22);
s22.setAttribute('href', 'https://discord.gg/8TYtgRS');
//-----------------------------
var pr = document.createElement("div");
 var pr1 = document.getElementById("con-preview");
pr1.appendChild(pr);
pr.setAttribute('id', 'skin');
pr.setAttribute('class', 'skin-preview');

var pr2 = document.createElement("div");
 var pr3 = document.getElementById("con-preview");
pr3.appendChild(pr2);
pr2.setAttribute('id', 'skin2');
pr2.setAttribute('class', 'skin-preview');

var pr4 = document.createElement("div");
 var pr5 = document.getElementById("con-preview");
pr5.appendChild(pr4);
pr4.setAttribute('id', 'skin3');
pr4.setAttribute('class', 'skin-preview');

var pr6 = document.createElement("div");
 var pr7 = document.getElementById("con-preview");
pr7.appendChild(pr6);
pr6.setAttribute('id', 'skin4');
pr6.setAttribute('class', 'skin-preview');

var pr8 = document.createElement("div");
 var pr9 = document.getElementById("con-preview");
pr9.appendChild(pr8);
pr8.setAttribute('id', 'skin5');
pr8.setAttribute('class', 'skin-preview');

var pr10 = document.createElement("div");
 var pr11 = document.getElementById("con-preview");
pr11.appendChild(pr10);
pr10.setAttribute('id', 'skin6');
pr10.setAttribute('class', 'skin-preview');

var pr12 = document.createElement("div");
 var pr13 = document.getElementById("con-preview");
pr13.appendChild(pr12);
pr12.setAttribute('id', 'skin7');
pr12.setAttribute('class', 'skin-preview');

var pr14 = document.createElement("div");
 var pr15 = document.getElementById("con-preview");
pr15.appendChild(pr14);
pr14.setAttribute('id', 'skin8');
pr14.setAttribute('class', 'skin-preview');

var pr16 = document.createElement("div");
 var pr17 = document.getElementById("con-preview");
pr17.appendChild(pr16);
pr16.setAttribute('id', 'skin9');
pr16.setAttribute('class', 'skin-preview');

var pr18 = document.createElement("div");
 var pr19 = document.getElementById("con-preview");
pr19.appendChild(pr18);
pr18.setAttribute('id', 'skin10');
pr18.setAttribute('class', 'skin-preview');

//------------------------------
var minimapSize = document.getElementById("minimap-panel");
minimapSize.style.height="200px";
minimapSize.style.width="200px";
var servertoggle = document.getElementById("main-servers");
servertoggle.style.display="none";
// Função para formatar 1 em 01
	const zeroFill = n => {
	return ('0' + n).slice(-2);
	}
	// Cria intervalo
	const interval = setInterval(() => {
	// Pega o horário atual
	const now = new Date();
	// Formata a data conforme dd/mm/aaaa hh:ii:ss
	const dataHora = zeroFill(now.getUTCDate()) + '/' + zeroFill((now.getMonth() + 1)) + '/' + now.getFullYear() + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());
	// Exibe na tela usando a div#data-hora
	document.getElementById('data-hora').innerHTML = dataHora;
	}, 1000);
//--------------------------
var btnSearch = document.getElementById("text-home2");
btnSearch.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
    var server = document.getElementById("main-servers");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
    var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "none";
    option.style.display = "none";
    server.style.display = "none";
    theme.style.display = "none";
    changelog.style.display = "none";
});
//--------------------------
var btnSearch2 = document.getElementById("btn-options");
btnSearch2.addEventListener('click', function ass(event) {
    var server = document.getElementById("main-servers");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
      var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "none";
    server.style.display = "none";
    theme.style.display = "none";
    changelog.style.display = "none";
});
//---------------------------
var btnSearch4 = document.getElementById("btn-themes");
btnSearch4.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
    var server = document.getElementById("main-servers");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
      var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "none";
    server.style.display = "none";
    option.style.display = "none";
    changelog.style.display = "none";
});
//--------------------------
var btnSearch5 = document.getElementById("btn-servers");
btnSearch5.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
      var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "none";
    theme.style.display = "none";
    option.style.display = "none";
    changelog.style.display = "none";
});
//--------------------------
var btnSearch9 = document.getElementById("text-changelog");
btnSearch9.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
     var server = document.getElementById("main-servers");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
     var announcement = document.getElementById("menu-Announcement");
      var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "none";
    server.style.display = "none";
    theme.style.display = "none";
    option.style.display = "none";
    changelog.style.display = "block";
});
//---------------------------
var btnSearch20 = document.getElementById("announcement");
btnSearch20.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
     var server = document.getElementById("main-servers");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
      var social = document.getElementById("menu-Social");
    social.style.display = "none";
    announcement.style.display = "block";
    server.style.display = "none";
    theme.style.display = "none";
    option.style.display = "none";
    changelog.style.display = "none";
});
//---------------------------
var btnSearch30 = document.getElementById("Socia");
btnSearch30.addEventListener('click', function ass(event) {
    var option = document.getElementById("main-options");
     var server = document.getElementById("main-servers");
    var theme = document.getElementById("main-themes");
    var changelog = document.getElementById("menu-changelog");
    var announcement = document.getElementById("menu-Announcement");
    var social = document.getElementById("menu-Social");
    social.style.display = "block";
    announcement.style.display = "none";
    server.style.display = "none";
    theme.style.display = "none";
    option.style.display = "none";
    changelog.style.display = "none";
});
//---------------------------
var btnSearch10 = document.getElementById("skin");
btnSearch10.addEventListener('click', function ass(event) {
    $("#name-box").val("[rage]");
});
var btnSearch11 = document.getElementById("skin2");
btnSearch11.addEventListener('click', function ass(event) {
    $("#name-box").val("[00]");
});
var btnSearch12 = document.getElementById("skin3");
btnSearch12.addEventListener('click', function ass(event) {
    $("#name-box").val("[00158y]");
});
var btnSearch13 = document.getElementById("skin4");
btnSearch13.addEventListener('click', function ass(event) {
    $("#name-box").val("[001o12]");
});
var btnSearch14 = document.getElementById("skin5");
btnSearch14.addEventListener('click', function ass(event) {
    $("#name-box").val("[00ad]");
});
var btnSearch15 = document.getElementById("skin6");
btnSearch15.addEventListener('click', function ass(event) {
    $("#name-box").val("[00c]");
});
var btnSearch16 = document.getElementById("skin7");
btnSearch16.addEventListener('click', function ass(event) {
    $("#name-box").val("[00z343]");
});
var btnSearch17 = document.getElementById("skin8");
btnSearch17.addEventListener('click', function ass(event) {
    $("#name-box").val("[011b]");
});
var btnSearch18 = document.getElementById("skin9");
btnSearch18.addEventListener('click', function ass(event) {
    $("#name-box").val("[01lucifer1]");
});
var btnSearch19 = document.getElementById("skin10");
btnSearch19.addEventListener('click', function ass(event) {
    $("#name-box").val("[01rv]");
});
function onReady(callback) {
    var intervalId = window.setInterval(function() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 3000);
}
function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}
onReady(function() {
    setVisible('#main-content', true);
    setVisible('#splash-screen', false);
});