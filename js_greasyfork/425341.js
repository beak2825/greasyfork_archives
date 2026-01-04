// ==UserScript==
// @name         Brainy Menu
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Pretty cool dark mode on brainly!
// @author       Triggerman & Kai Smith
// @match      *://*brainly.in/*
// @icon       https://i.pinimg.com/originals/b9/7b/02/b97b02641851c9f012813e7e6714dd1f.jpg
// @grant         GM.xmlHttpRequest
// @grant       GM_addStyle
// @grant         GM_notification
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @run-at document-start
// @noframes
// @license      MIT; https://mit-license.org/
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/425341/Brainy%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/425341/Brainy%20Menu.meta.js
// ==/UserScript==



/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
// ALL RIGHT RESERVED BY KAI SMITH & TRIGGERMAN

var zNode       = document.createElement ('div');
zNode.innerHTML = '<span class="sg-button__icon"><div id="parameters" class="sg-icon sg-icon--adaptive sg-icon--x24"><svg  class="sg-icon__svg"><use xlink:href="#icon-settings"></use></svg></div></span><button class="sg-button sg-button--solid-mint" id="myButton" type="button">'
                + 'Check Point Transfering</button>'
                + '   <label class="switch"><input id="Checkbox" type="checkbox"><span class="slider round"></span></label>'
                + '<p id="darkmodetext">Dark Mode</p>'
                ;
zNode.setAttribute ('id', 'myContainer');
zNode.setAttribute ('class', 'sg-box sg-box--no-border sg-box brn-white-background-box-light-gray');
zNode.setAttribute ('class', 'vertical-center');
document.body.appendChild (zNode);





GM.xmlHttpRequest({
  method: "GET",
  url: "https://brainly.in/api/28/api_global_rankings/view/0/1",
  headers: {
    "User-Agent": "Chrome/83.0.4103.116",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }
var data = JSON.parse(response.responseText);
var firstuser = {points:data.data[0].value,nick:data.users_data[0].nick, id:data.users_data[0].id, rank:data.users_data[0].ranks.names[0]};
var seconduser = {points:data.data[1].value,nick:data.users_data[1].nick, id:data.users_data[1].id, rank:data.users_data[1].ranks.names[0]};
var thirduser = {points:data.data[2].value,nick:data.users_data[2].nick, id:data.users_data[2].id,rank:data.users_data[2].ranks.names[0]};




//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);





function ButtonClickAction (zEvent) {
   var zNode       = document.createElement ('p');
    var href1 = "/profile/"+firstuser.nick+"-"+firstuser.id;
    var href2 = "/profile/"+seconduser.nick+"-"+seconduser.id;
    var href3 = "/profile/"+thirduser.nick+"-"+thirduser.id;

    zNode.innerHTML = '<p id="UserList"><a style="background-color:Gold;" href="'+href1+'" target="_blank">'+"⚠️"+firstuser.nick+'</a>-'+firstuser.points+' points '+firstuser.rank+'</p><br><p><a style="background-color:Orange;" href="'+href2+'"target="_blank">'+"⚠️"+seconduser.nick+'</a>-'+seconduser.points+' points '+seconduser.rank+'</p><br><p><a style="background-color:Gray;" href="'+href3+'"target="_blank">'+"⚠️"+thirduser.nick+'</a>-'+thirduser.points+' points '+thirduser.rank+'</p>';
    document.getElementById ("myContainer").appendChild (zNode);
$(document).ready(function(){
  $("#myButton").click(function(){
    $(zNode).toggle();
  });
});
}




//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
            position: fixed;
    top: 60px;
    left: 30px;
    font-size: 20px;
    background: linear-gradient(217deg, rgb(13 255 0 / 80%), rgba(255,0,0,0) 70.71%),            linear-gradient(127deg, rgb(0 255 243 / 80%), rgba(0,255,0,0) 70.71%),            linear-gradient(336deg, rgb(0 243 255 / 80%), rgba(0,0,255,0) 70.71%);    border: none;
    margin: 20px;
    opacity: 0.9;
    z-index: 222;
    height: 25px;
    width: 25px;
    padding: 100px 120px;
    text-align: center;
    }
    #vertical-center {
        margin:                 0;
        position:               absolute;
        top:                    10%;
        -ms-transform:          translateY(-50%);
        transform:              translateY(-50%);
}
.switch {
    position: fixed;
    top: 117px;
    left: 55px;
  display: inline-block;
  width: 30px;
  height: 14px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 11px;
  width: 11px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(16px);
}

.slider.round {
  border-radius: 14px;
}

.slider.round:before {
  border-radius: 50%;
}
    #myButton {

    cursor: pointer;
    position: fixed;
    top: 70px;
    left: 48px;

    }
    #darkmodetext {
     position: fixed;
    top: 111px;
    left: 90px;
}
#Checkbox {
    cursor: pointer;
    position: fixed;
    top: 115px;
    left: 70px;
    display: inline-block;



}

    #parameters {
        position:                    fixed;
        top:                    60px;
        left:                  30px;


}


   label {
    display:flex;
    align-items: baseline;
}

input[type=checkbox] {
    margin-right: 8px;
}
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}}});



window.onload = function ChangeTheme() {
'use strict';
console.log(cfg);
console.log(cfg_excl);
var el;
var css;
var cfg_color;
var cfg_bgclr;
var cfg_visclr;
var cfg_excl;
var cfg_css;
var cfg_js;
var cfg_active = (localStorage.getItem('active') === 'true');
function load_settings()
{
cfg_excl = localStorage.getItem('excl') || "";
cfg_excl = cfg_excl+"#myButton,.brn-progress-tracking__icon-dot,#sg-counter--xxs,.sg-search__icon,.sg-box--dark,.sg-box--blue,.sg-text--break-words,.sg-icon--gray-secondary,.sg-icon--gray-light,.game-box__dashed-progress-bar,.sg-text--full,.brn-qpage-next-question-box-content__primary,.sg-text--break-words,.brn-answering-streak__front-element ";
cfg_css = localStorage.getItem('css') || "";
cfg_css = cfg_css+'.sg-counter--xxs { min-height: 25px; min-width: 25px; height: 16px; padding: 0 9px; border-radius: 25px; }.sg-button--transparent { background-color: rgba(255,255,255,0); color: #ff7968; fill: #ff7968; }.brn-challenge-confetti__container:before {        display: block;    position: absolute;    border-radius: 8px;    top: 2px;    left: 0;    z-index: 3;    height: 40px;    width: 100%;    background: -webkit-gradient(linear,left bottom,left top,from(hsla(0,0%,100%,0)),to(#27eBA7));    background: -webkit-linear-gradient(bottom,hsla(0,0%,100%,0),#27eBA7);    background: linear-gradient(0deg,hsla(0,0%,100%,0) 0,#27eBA7);}.brn-challenge-confetti__container:after { display: block; position: absolute; border-radius: 8px; bottom: 2px; left: 0; z-index: 2; height: 30px; width: 100%;}.HeaderController__subnavWrapper--1mfz7:after { display: block; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #27eBA7;}.sg-box--blue { background-color: #27eBA7; } .sg-box--dark { background: #ff7968; }.sg-icon--gray-secondary { fill: #ff7968; }.sg-icon--gray-light { fill: #27eBA7 ; }.sg-text--full { width: 100%; color: #27eBA7; }.brn-qpage-next-question-box-content__primary { display: block; color: #27eBA7; }'
cfg_js = localStorage.getItem('js') || "";

window.onload = function geturl(){
var url = document.URL
console.log(url)
if (url="https://brainly.in/"){
cfg_excl = cfg_excl+",.sg-text--break-words"
cfg_css = cfg_css+".sg-text--break-words { word-break: break-word; color: #27eBA7; }"
}}

if (typeof GM_getValue !== "undefined")
{
cfg_color = GM_getValue("Color", "#27eBA7");
cfg_bgclr = GM_getValue("bgColor", "#2d4870");
cfg_visclr = GM_getValue("visitedColor", "#a4a4a4");
}
    }

function activate(yes, prev_active)
{
if(prev_active && el){document.body.removeChild(el);}
if(yes)
{
make_css();
el = GM_addStyle(css);
el = document.body.appendChild(el);
if(cfg_js){eval(cfg_js);}
}
}
document.getElementById ("Checkbox").addEventListener (
    "click", toggleDT, false
);

function toggleDT()
{
load_settings();
let prev_active = cfg_active;
cfg_active = !(localStorage.getItem('active') === 'true');
activate(cfg_active, prev_active);
if(!cfg_active)
{
localStorage.removeItem('active');
}
else
{
localStorage.setItem('active', "true");
}
}

if (typeof GM_registerMenuCommand !== "undefined")
{
GM_registerMenuCommand("Brainly Dark Theme Configuration", cfg, "D");
GM_registerMenuCommand("Toggle Brainly Dark Theme", toggleDT, "T");
}

function make_css()
{

let exclusions;
let exc_txt = ""
if(cfg_excl !== "")
{
exclusions = cfg_excl.split(",");
for (var i = 0, len = exclusions.length; i < len; i++)
{
exc_txt += ":not("+exclusions[i]+")";
}
}
css = `
*`+exc_txt+` {
color: `+cfg_color+` !important;
background: `+cfg_bgclr+` !important;
border-color: `+cfg_color+` !important;
}
:visited`+exc_txt+`, a:hover`+exc_txt+` {
color: `+cfg_visclr+` !important;
}
`+cfg_css+`
`;
//////////////
}

if(cfg_active)
{
load_settings();
make_css();
el = GM_addStyle(css);
document.addEventListener("DOMContentLoaded", function(){ el = document.body.appendChild(el); if(cfg_js){eval(cfg_js);} });
}

var t;




function cfg()
{
if (typeof GM_setValue !== "undefined")
{
function saveCfg()
{
GM_setValue("Color", document.getElementById("color").value);
GM_setValue("bgColor", document.getElementById("bgclr").value);
GM_setValue("visitedColor", document.getElementById("visitedColor").value);
localStorage.setItem('excl', document.getElementById("excl").value);
localStorage.setItem('css', document.getElementById("css").value);
localStorage.setItem('js', document.getElementById("js").value);
localStorage.setItem('active', document.getElementById("active").checked);
// pretty text "saved"
document.getElementById("cfg_save").value = "SAVED !";
clearTimeout(t);
t = setTimeout(function() {document.getElementById("cfg_save").value = "Save configuration";},1500)
// update active configuration
cfg_color = document.getElementById("color").value;
cfg_bgclr = document.getElementById("bgclr").value;
cfg_visclr = document.getElementById("visitedColor").value;
cfg_excl = document.getElementById("excl").value;
cfg_css = document.getElementById("css").value;
cfg_js = document.getElementById("js").value;
activate(document.getElementById("active").checked, cfg_active );
cfg_active = document.getElementById("active").checked;
// clean up
if(!document.getElementById("active").checked) { localStorage.removeItem('active'); }
if(!document.getElementById("excl").value) { localStorage.removeItem('excl'); }
if(!document.getElementById("css").value) { localStorage.removeItem('css'); }
if(!document.getElementById("js").value) { localStorage.removeItem('js'); }
}
load_settings();
var div = document.createElement("div");
div.style.position = "fixed";
div.style.top = "5%";
div.style.left = "50%";
div.style.margin = "5% -222px";
div.style.width = "444px";
div.style.border = "solid 1px black";
div.style.backgroundColor = cfg_bgclr;
div.style.color = cfg_color;
div.style.zIndex = 8888888;
div.style.lineHeight = 1.0;
div.innerHTML = "<b><center>Configuration</center></b>"
+ "<br><br><input id='color' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial;'> Text color (empty = site default)"
+ "<br><br><input id='bgclr' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial;'> Background color"
+ "<br><br><input id='visitedColor' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial;'> Visited & hovered links color"
+ "<br><br><center><b>Per-site settings (stored in browser cookies called LocalStorage):</b>"
+ "<br><br><input id='active' type='checkbox' style='display:inline; width:initial; padding: initial;'> Enabled for this website"
+ "<br><br>Excluded css elements (e.g. \"#id1,.class2,input\"):<br><textarea id='excl' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial;'></textarea>"
+ "<br><br>Custom CSS style:<br><textarea id='css' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial;'></textarea>"
+ "<br><br>Custom JS Action:<br><textarea id='js' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial;'></textarea>"
+ "<br><input id='cfg_save' type='button' value='Save configuration'  style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial;'> <input id='cfg_close' type='button' value='Close'  style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial;'></center>";
document.body.appendChild(div);
document.getElementById("color").value = cfg_color;
document.getElementById("bgclr").value = cfg_bgclr;
document.getElementById("visitedColor").value = cfg_visclr;
//
document.getElementById("active").checked = cfg_active;
document.getElementById("excl").value = cfg_excl;
document.getElementById("css").value = cfg_css;
document.getElementById("js").value = cfg_js;
document.getElementById("cfg_save").addEventListener("click", saveCfg, true);
document.getElementById("cfg_close").addEventListener("click", function(){div.remove();clearTimeout(t);}, true);
}
else
{
alert("Sorry, Chrome userscripts in native mode can't have configurations! Install TamperMonkey userscript-manager extension");
}
}

}();




GM.xmlHttpRequest({
  method: "GET",
  url: "https://brainly.in/api/28/api_users/me",
  headers: {
    "User-Agent": "Chrome/83.0.4103.116",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }
     var data = JSON.parse(response.responseText);
     var nick = data.data.user.nick;
     var priv = data.data.privileges;
     var privileges=priv.join(", ")
     var nprivileges=Number(privileges.length-10);
     var username = data.data.user.username;
     var Ncomments = data.data.comments;
     console.log(nprivileges);
  }
});
