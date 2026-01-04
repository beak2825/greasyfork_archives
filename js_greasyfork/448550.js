// ==UserScript==
// @name        Voorash Inline Tier Charts
// @namespace   voorash
// @description   This will provide an inline tier chart for DotD on Armor games
// @include     http://armorgames.com/dawn-of-the-dragons-game/13509
// @include     http://www.27thdimension.com/dotd/tierChartsStandalone.html
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/448550/Voorash%20Inline%20Tier%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/448550/Voorash%20Inline%20Tier%20Charts.meta.js
// ==/UserScript==
 
var lowTiers = "<img src='http://www.27thdimension.com/dotd/tierData/lowTiers.png'>";
var highTiers = "<img src='http://www.27thdimension.com/dotd/tierData/highTiers.jpg'>";
var guildTiers = "<img src='http://www.27thdimension.com/dotd/tierData/guildTiers.jpg'>";
var campTiers = "<img src='http://www.27thdimension.com/dotd/tierData/campTiers.jpg'>";
 
// Create Tier Divs
 
var gameCanvas = document.getElementById('gamearea');
var lowTierDiv = document.createElement('div');
lowTierDiv.setAttribute('id','voorashLowTierDiv');
lowTierDiv.innerHTML = lowTiers; 
 
var highTierDiv = document.createElement('div');
highTierDiv.setAttribute('id','highTierDiv');
highTierDiv.innerHTML = highTiers; 
 
var guildTierDiv = document.createElement('div');
guildTierDiv.setAttribute('id','guildTierDiv');
guildTierDiv.innerHTML = guildTiers; 
 
var campTierDiv = document.createElement('div');
campTierDiv.setAttribute('id','campTierDiv');
campTierDiv.innerHTML = campTiers; 
 
 
// Create button divs
var voorashLowTierButtonDiv = document.createElement('div');
voorashLowTierButtonDiv.setAttribute('id','voorashLowTierButtonDiv');
voorashLowTierButtonDiv.innerHTML = 'Z1-Z9';
 
 
var voorashHighTierButtonDiv = document.createElement('div');
voorashHighTierButtonDiv.setAttribute('id','voorashHighTierButtonDiv');
voorashHighTierButtonDiv.innerHTML = 'Z10+';
 
var voorashGuildTierButtonDiv = document.createElement('div');
voorashGuildTierButtonDiv.setAttribute('id','voorashGuildTierButtonDiv');
voorashGuildTierButtonDiv.innerHTML = 'Guild';
 
var voorashCampTierButtonDiv = document.createElement('div');
voorashCampTierButtonDiv.setAttribute('id','voorashCampTierButtonDiv');
voorashCampTierButtonDiv.innerHTML = 'Camp';
 
 
gameCanvas.appendChild(lowTierDiv);
gameCanvas.appendChild(highTierDiv);
gameCanvas.appendChild(guildTierDiv);
gameCanvas.appendChild(campTierDiv);
 
 
 
gameCanvas.appendChild(voorashLowTierButtonDiv);
gameCanvas.appendChild(voorashHighTierButtonDiv);
gameCanvas.appendChild(voorashGuildTierButtonDiv);
gameCanvas.appendChild(voorashCampTierButtonDiv);
 
 
$("#voorashLowTierDiv").css({"position":"fixed","top":"0px","left":"0px","z-index":"100000","background-color":"white"}); 
$("#voorashLowTierDiv").hide();
$("#highTierDiv").css({"position":"fixed","top":"0px","left":"0px","z-index":"100000","background-color":"white"}); 
$("#highTierDiv").hide();
$("#guildTierDiv").css({"position":"fixed","top":"0px","left":"0px","z-index":"100000","background-color":"white"}); 
$("#guildTierDiv").hide();
$("#campTierDiv").css({"position":"fixed","top":"0px","left":"0px","z-index":"100000","background-color":"white"}); 
$("#campTierDiv").hide();
 
var divWidth = "40px";
$("#voorashLowTierButtonDiv").css({"position":"fixed","top":"0px","left":"0px","width":divWidth,"border": "1px solid", "z-index":"99","background-color":"white"}); 
$("#voorashLowTierButtonDiv").show();
$("#voorashHighTierButtonDiv").css({"position":"fixed","top":"20px","left":"0px","width":divWidth,"border": "1px solid","z-index":"99","background-color":"white"}); 
$("#voorashHighTierButtonDiv").show();
$("#voorashGuildTierButtonDiv").css({"position":"fixed","top":"40px","left":"0px","width":divWidth,"border": "1px solid","z-index":"99","background-color":"white"}); 
$("#voorashGuildTierButtonDiv").show();
$("#voorashCampTierButtonDiv").css({"position":"fixed","top":"60px","left":"0px","width":divWidth,"border": "1px solid","z-index":"99","background-color":"white"}); 
$("#voorashCampTierButtonDiv").show();
 
// Low Tier Div Show and Hide
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#voorashLowTierDiv\", \"click\", function() {$(\"#voorashLowTierDiv\").hide();});";
$("head").append( script );
 
 
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#voorashLowTierButtonDiv\", \"click\", function() {$(\"#voorashLowTierDiv\").show();});";
$("head").append( script );
 
// High Tier Div Show and Hide
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#highTierDiv\", \"click\", function() {$(\"#highTierDiv\").hide();});";
$("head").append( script );
 
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#voorashHighTierButtonDiv\", \"click\", function() {$(\"#highTierDiv\").show();});";
$("head").append( script );
 
// Guild Tier Div Show and Hide
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#guildTierDiv\", \"click\", function() {$(\"#guildTierDiv\").hide();});";
$("head").append( script );
 
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#voorashGuildTierButtonDiv\", \"click\", function() {$(\"#guildTierDiv\").show();});";
$("head").append( script );
 
// Camp Tier Div Show and Hide
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#campTierDiv\", \"click\", function() {$(\"#campTierDiv\").hide();});";
$("head").append( script );
 
var script = document.createElement( 'script' );
script.type = 'text/javascript';
script.text = "$(document).delegate(\"#voorashCampTierButtonDiv\", \"click\", function() {$(\"#campTierDiv\").show();});";
$("head").append( script );
 
 
 