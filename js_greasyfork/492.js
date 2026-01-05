// ==UserScript==
// @name          AoA:GE
// @description   Age of Aincrad: Guild Edition
// @include       http://age-of-aincrad.com/game/?GameUI*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version       1.0
// @author        Haranobu
// @grant         GM_addStyle
// @namespace     https://greasyfork.org/scripts/492-aoa-ge
// @downloadURL https://update.greasyfork.org/scripts/492/AoA%3AGE.user.js
// @updateURL https://update.greasyfork.org/scripts/492/AoA%3AGE.meta.js
// ==/UserScript==

GM_addStyle ( "                                     \
body {\
    margin: 0px;\
    background: url('http://img4.wikia.nocookie.net/__cb20121223021437/swordartonline/images/4/40/Aincard_in_ALO.png') top center / 100% auto transparent !important;\
    height: 100% !important;\
}\
span{\
	font-family:aoaui;\
	color:#FFF !important;\
    font-size:30px;\
    }\
p{\
	padding-top:2px;\
	font-family:aoaui;\
	color:#FFF !important;\
    }\
#Profile_Container{\
	position:fixed;\
	padding-top:74px;\
	font-family:aoaiu;\
	display: inline-block;\
	padding-left:30px;\
	height:64px;\
	width:1000px !important;\
    border-radius:50px;\
}\
#Name_Container{\
	font-family:aoaiu;\
	color:#333;\
	height:94px;\
    width:450px;\
	display: inline-block;\
	vertical-align: middle;\
    border-radius:0px;\
    background:url('http://i.imgur.com/ZbX4E1E.png') no-repeat !important;\
    background-position:0px -20px !important;\
}\
#Name_Container>p{\
    margin: 5px -284px 10px 290px !important;\
    display: inline-block !important;\
    font-size:9px !important;\
}\
#Name_Container>p:nth-child(2){\
    font-size:10px !important;\
    margin: -5px -284px 10px 39px !important;\
    position: absolute;\
}\
#Name_Container>p:nth-child(3){\
    font-size:15px !important;\
    margin: 5px -280px 10px 300px !important;\
    position: absolute;\
    text-transform:uppercase;\
word-spacing:1px;\
letter-spacing:1px\
text-align: center;\
}\
#Name_Container>span{\
    margin-top:6px !important;\
    margin-left:38px !important;\
    right:20px !important;\
    display:block !important;\
    font-size:21px !important;\
}\
#Profile_Container{\
	position:fixed !important;\
	padding-top:20px !important;\
	font-family:aoaiu !important;\
	display: inline-block !important;\
	padding-left:20px !important;\
	height:64px !important;\
	width:1000px !important;\
    border-radius:50px !important;\
}\
.Player_Icon{\
	font-family:aoaiu !important;\
	border:1px solid #e2e2e2 !important;\
    border-radius:50px !important;\
	height:50px !important;\
	width:50px !important;\
    box-shadow: 0px 0px 10px #000;\
    -webkit-transition: all 0.5s ease-out;\
    -moz-transition: all 0.5s ease-out;\
    -o-transition: all 0.5s ease-out;\
}\
.Player_Icon:hover{\
	font-family:aoaiu !important;\
	border:1px solid #ffb31f !important;\
    border-radius:50px !important;\
	height:50px !important;\
	width:50px !important;\
    box-shadow: 0px 0px 10px #000;\
}\
.window {\
    background: none repeat scroll 0% 0% #FFF;\
    display: none;\
    font-size: 16px;\
    box-shadow: 0px 0px 10px 2px #616161;\
    opacity: 0.8;\
}\
#Version_Container {\
    color: #FFF\
}\
#haranobu {\
    position: fixed;\
    bottom: 0px;\
    right: 5px;\
    font-family: sans-serif;\
    font-size: 10px;\
    color: #FFF\
}\
a {\
    color: #286fff;\
	text-decoration:none;\
}\
#UI_Me_w {\
    color: #000;\
height: 429px !important;\
width: 270px !important;\
background: url('http://i.imgur.com/xmBuf3p.png') no-repeat;\
box-shadow: 0px 0px 0px 0px #616161 !important;\
}\
#UI_Me_w>h1{\
margin: 0px;\
height: 30px;\
padding: 20px;\
font-family: aoaui;\
font-size: 20px;\
background: none repeat scroll 0% 0% !important;\
box-shadow: 0px 0px 0px 0px #616161 !important;\
margin-left: -22px;\
margin-top: -5px;\
top: 6px !important;\
left: 1100px !important;\
}\
#CInfo {\
margin-left: -22px;\
}\
#Item {\
background: url('http://i.imgur.com/1Z4Kp8Q.png') no-repeat;\
font-family: aoaui;\
font-size: 20px;\
text-align: center;\
position: unset !important;\
background-position: 26px;\
margin-top: 30px;\
margin-right: 17px;\
}\
#Items {\
font-family: aoaui;\
font-size: 12px;\
position: unset !important;\
text-align: left;\
margin-left: 35px;\
}\
.buttonholder {\
    height: 54px !important;\
}\
" );

$("body").append ( '\
    <div id="haranobu">\
        GM © <a href="http://age-of-aincrad.com/forum/members/haranobu.4401/">Haranobu</a>\
    </div>\
<script language=\"JavaScript\">\
function setHide(id, visibility) {\
document.getElementById(id).style.display = visibility;\
}\
</script>\
' );

element = document.getElementById("UI_Me_w");
element.innerHTML = "<h1>Account</h1>\
<img src=\"http://i.imgur.com/qsarM4U.png\" id=\"CInfo\" />\
<div id=\"Item\">Active Equipment</div>\
<div id=\"Items\">\
<ul>\
<li>Sword of Two Hands</li>\
<li>Armor of Paradise</li>\
<li>Shield of Thanatos</li>\
<li>Dagger of Devil</li>\
</div>\
<a href=\"#\" id=\"UI_Edit\" onmouseover=\"mouseoversound.playclip()\"><img src=\"images/ui/close.png\" onclick=\"setHide('UI_Me_w', 'none');\" style=\"margin-left: 170px; margin-top: -22px;\"></a>";