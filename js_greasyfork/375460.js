// ==UserScript==
// @name         TheStandard PoY2018 MOD
// @namespace    TheStandard PoY2018 MOD
// @version      0.2
// @description  try to take over the world!
// @author       Ning-X
// @match        https://thestandard.co/personoftheyear2018/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375460/TheStandard%20PoY2018%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/375460/TheStandard%20PoY2018%20MOD.meta.js
// ==/UserScript==

$(".undefined").hide(); //ซ่อนส่วนต่างๆ
$(".mini-seperator").hide();
$(".main-footer").hide();
$(".tstd-form").hide();
$(".main-header").hide();
$("div.container:nth-child(6)").hide(); //topbar

$("div.col-md-3:nth-child(2)").hide(); //moopar
$("div.col-md-3:nth-child(4)").hide(); //n'bam
$("div.col-md-3:nth-child(6)").hide(); //blackpanther
$("div.col-md-3:nth-child(8)").hide(); //car_axe
$("div.col-md-3:nth-child(10)").hide(); //RAD
//$("div.col-md-3:nth-child(12)").hide(); //bnk
$("div.col-md-3:nth-child(14)").hide(); //volley
$("div.col-md-3:nth-child(16)").hide(); //pope_bell
$("div.col-md-3:nth-child(18)").hide(); //songyos
$("div.col-md-3:nth-child(20)").hide(); //yaya
$("div.col-md-3:nth-child(22)").hide(); //twopee
//$("div.col-md-3:nth-child(24) > div:nth-child(1) > div:nth-child(1)").hide(); //div pic lisa
//$("div.col-md-3:nth-child(24)").hide(); //lisa
$("div.col-md-3:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)").hide(); //button bnk

document.querySelector('#vote-list > div:nth-child(24) > div > div.vote-card-cover > img').src = "https://www.generasia.com/w/images/0/0b/BLACKPINK_-_BLACKPINK_IN_YOUR_AREA_CD_LISA_Ver.jpg"; //img Lisa

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.reg-modal { width:0 !important;height:0 !important; }');
addGlobalStyle('.undefined { width:0 !important;height:0 !important; }');
addGlobalStyle('button[disabled] { background: #dddddd !important; }'); //color button when disable
addGlobalStyle('button[disabled].vote-card-vote:hover { background: #dddddd !important; }');
addGlobalStyle('button[disabled].vote-card-vote:active { background: #dddddd !important; }');
//addGlobalStyle('.vote-card { min-height: 120px !important; }');
addGlobalStyle('.vote-card-vote { background: #000000 !important; }'); //color button when enable
addGlobalStyle('.vote-card-vote:hover { background: #000000 !important; }');
addGlobalStyle('.vote-card-vote:active { background: #000000 !important; }');
addGlobalStyle('.vote-card-score { color: #9707ff !important; }'); //color score update
addGlobalStyle('.score { color: #ffb3ff !important; font-size: 18px !important;background-color: #000000 !important;}'); //color new score
addGlobalStyle('.score2 { color: #ff0000 !important; font-size: 20px !important;background-color: #000000 !important;}');

unsafeWindow.alert = function(){}
unsafeWindow.confirm = function(){}
unsafeWindow.prompt = function(){}

var settingsDiv4 = '<div id="testAdd4" class="score">Score / Second</div>';
var settingsDiv3 = '<div id="testAdd3" class="score">Score LISA - BNK</div>';
var settingsDiv2 = '<div id="testAdd3" class="score2"> </div>';

var x = document.getElementsByClassName("vote-card-score");
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv4);
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv3);
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv2);

var scLisaP=0;
var scBnkP =0;
const list = document.getElementsByTagName("button");

window.setInterval(function(){
    var scLisa =x[11].innerHTML;
    scLisa = scLisa.substr(0,(scLisa.length-6));
    scLisa = scLisa.replace(/[^0-9\.]+/g, "");

    var scBnk =x[5].innerHTML;
    scBnk = scBnk.substr(0,(scBnk.length-6));
    scBnk = scBnk.replace(/[^0-9\.]+/g, "");

    document.getElementById("testAdd4").innerHTML = "BNK = "+(scBnk-scBnkP)+"  Lisa = "+(scLisa-scLisaP) ;
    scLisaP = scLisa;
    scBnkP = scBnk;

    document.getElementById("testAdd3").innerHTML = "Lisa - Bnk = "+(scLisa-scBnk) ;
    if(list[1].disabled){ location.reload();}
}, 1000);