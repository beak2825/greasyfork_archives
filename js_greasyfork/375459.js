// ==UserScript==
// @name         Auto Vote Standard PoY2018 Show Score
// @namespace    Auto Vote Standard PoY2018 Show Score
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://thestandard.co/personoftheyear2018/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375459/Auto%20Vote%20Standard%20PoY2018%20Show%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/375459/Auto%20Vote%20Standard%20PoY2018%20Show%20Score.meta.js
// ==/UserScript==

$(".undefined").hide();
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
//$("div.col-md-3:nth-child(24) > div:nth-child(1) > div:nth-child(1)").hide(); //pic lisa
//$("div.col-md-3:nth-child(24)").hide(); //lisa
$("div.col-md-3:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)").hide(); //button bnk

document.querySelector('#vote-list > div:nth-child(24) > div > div.vote-card-cover > img').src = "https://www.generasia.com/w/images/0/0b/BLACKPINK_-_BLACKPINK_IN_YOUR_AREA_CD_LISA_Ver.jpg"; //img Lisa

//$(".vote-card-body:nth-of-type(1)").hide();

//-/html/body/section/div/div/div/div[2]/article/div/div[2]/div[2]/div[1]
//html body.page-template-default.page.page-id-156312.topic-personoftheyear2018 section.section-wrapper div.container div.padder div.row div.col-sm-11 article#post-156312.post-156312.page.type-page.status-publish.has-post-thumbnail.hentry div.entry-content div.container div#vote-list.row div.col-md-3.col-xs-6
//div.col-md-3:nth-child(2)

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
addGlobalStyle('button[disabled] { background: #dddddd !important; }');
addGlobalStyle('button[disabled].vote-card-vote:hover { background: #dddddd !important; }');
addGlobalStyle('button[disabled].vote-card-vote:active { background: #dddddd !important; }');
addGlobalStyle('.vote-card { min-height: 70px !important; }');
addGlobalStyle('.vote-card-vote { background: #000000 !important; }');
addGlobalStyle('.vote-card-vote:hover { background: #ff96fb !important; }');
addGlobalStyle('.vote-card-vote:active { transform: translateY(4px) !important; background: #ff05f6 !important; }');
addGlobalStyle('.vote-card-score { color: #9707ff !important; }');
addGlobalStyle('.score { color: #ffb3ff !important; font-size: 20px !important;background-color: #000000 !important;}');

//setTimeout(function(){ location.reload(); }, 60*1000);

unsafeWindow.alert = function(){}
unsafeWindow.confirm = function(){}
unsafeWindow.prompt = function(){}

var settingsDiv = '<div id="testAdd" class="score">Count</div>';
var settingsDiv2 = '<div id="testAdd2" class="score">Timer</div>';
var settingsDiv4 = '<div id="testAdd4" class="score">Score LISA - BNK</div>';
var settingsDiv3 = '<div id="testAdd3" class="score">Score LISA - BNK</div>';

var x = document.getElementsByClassName("vote-card-score");
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv4);
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv3);
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv);
$('#post-156312 > div.entry-content > div.container > p').append(settingsDiv2);

var i=0;
var j=0;
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
    unsafeWindow.localStorage.setItem('vote_session_expire', false);
    document.getElementById("testAdd3").innerHTML = "Lisa - Bnk = "+(scLisa-scBnk) ;
 	 	if((j>300) || (list[1].disabled) ){ location.reload();}
    if(!(list[1].disabled)){document.getElementById("testAdd2").innerHTML = (j+=1);}
    if(!(list[11].disabled)){list[11].click();document.getElementById("testAdd").innerHTML = (i+=1);}
}, 1000);

KeyEvent = (typeof KeyEvent === "object") ? KeyEvent : [];
const LEFT_KEY = KeyEvent.DOM_VK_LEFT || 37;
const RIGHT_KEY = KeyEvent.DOM_VK_RIGHT || 39;
const UP_KEY = KeyEvent.DOM_VK_UP || 38;
const DOWN_KEY = KeyEvent.DOM_VK_DOWN || 40;

window.addEventListener ("keydown", keyboardHandler, false);

function keyboardHandler (zEvent) {
    var bBlockDefaultAction = false;

    //--- Assume we want only the plain keys, not the modified versions.
    if (zEvent.altKey  ||  zEvent.ctrlKey  ||  zEvent.shiftKey) {
        //-- Do nothing (most user-friendly option, in most cases).
    }
    else {
        if (zEvent.which == LEFT_KEY) {
            list[7].click();
            bBlockDefaultAction = true;
        }
        else if (zEvent.which == RIGHT_KEY) {
            list[11].click();
            bBlockDefaultAction = true;
        }
		else if (zEvent.which == DOWN_KEY) {
            list[9].click();
            bBlockDefaultAction = true;
        }
		else if (zEvent.which == UP_KEY) {
            //list[11].click();
            bBlockDefaultAction = true;
        }
    }

    if (bBlockDefaultAction) {
        zEvent.preventDefault ();
        zEvent.stopPropagation ();
    }
}