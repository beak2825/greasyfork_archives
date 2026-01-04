// ==UserScript==
// @name         Auto Vote Standard PoY2018
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://thestandard.co/personoftheyear2018/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375421/Auto%20Vote%20Standard%20PoY2018.user.js
// @updateURL https://update.greasyfork.org/scripts/375421/Auto%20Vote%20Standard%20PoY2018.meta.js
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
$("div.col-md-3:nth-child(12)").hide(); //bnk
$("div.col-md-3:nth-child(14)").hide(); //volley
$("div.col-md-3:nth-child(16)").hide(); //pope_bell
$("div.col-md-3:nth-child(18)").hide(); //songyos
$("div.col-md-3:nth-child(20)").hide(); //yaya
$("div.col-md-3:nth-child(22)").hide(); //twopee
$("div.col-md-3:nth-child(24) > div:nth-child(1) > div:nth-child(1)").hide(); //pic lisa
//$("div.col-md-3:nth-child(24)").hide(); //lisa

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

//setTimeout(function(){ location.reload(); }, 60*1000);

unsafeWindow.alert = function(){}
unsafeWindow.confirm = function(){}
unsafeWindow.prompt = function(){}

var settingsDiv = '<div id="testAdd" class="vote-card-score">This is the div that I want to add to the page</div>';
var settingsDiv2 = '<div id="testAdd2" class="vote-card-score">This is the div that I want to add to the page</div>';
$('#post-156312').append(settingsDiv);
$('#post-156312').append(settingsDiv2);
var i=0;
var j=0;
const list = document.getElementsByTagName("button");
//window.setInterval(function(){ $('[data-vote]').removeAttr('disabled');unsafeWindow.localStorage.setItem('vote_session_expire', false); },500);
window.setInterval(function(){ unsafeWindow.localStorage.setItem('vote_session_expire', false); },500);
//window.setInterval(function(){ list[11].disabled = false; },500);
//window.setInterval(function(){ list[11].click(); },333);
window.setInterval(function(){
//unsafeWindow.localStorage.setItem('vote_session_expire', false);
	//if((list[11].disabled)){ location.reload();}
 	 	if((j>300) || (list[1].disabled) ){ location.reload();}
    if(!(list[1].disabled)){document.getElementById("testAdd2").innerHTML = (j+=0.5);}
    if(!(list[11].disabled)){list[11].click();document.getElementById("testAdd").innerHTML = (i+=1);}
}, 500);