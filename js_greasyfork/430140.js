// ==UserScript==
// @name         G.E.T Gats Enhancement Tool Beta Version 1.6.8 (Deprecated and Archived)
// @namespace    https://github.com/LightLordYT/
// @version      Beta 1.6.8
// @author       LightLord
// @match        https://gats.io/
// @icon         https://www.google.com/s2/favicons?domain=gats.io
// @description  Gats.io-Enhancement-Tool (G.E.T) This is a script for Gats.io that customizes the gui This is still in the Beta stage so don't expect it to be a completely developed, and perfect script.
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @compatible   chrome+tampermonkey
// @license      MIT License 
//Copyright (c) 2021 LightLord


// @downloadURL https://update.greasyfork.org/scripts/430140/GET%20Gats%20Enhancement%20Tool%20Beta%20Version%20168%20%28Deprecated%20and%20Archived%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430140/GET%20Gats%20Enhancement%20Tool%20Beta%20Version%20168%20%28Deprecated%20and%20Archived%29.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


 /* Version Updates:
    V1.0.0 Alpha version release
    V1.0.1 Alpha version added title
    V1.0.2 Added other customization stuff
    V1.0.3 Disabled canvas to fix glitch
    V1.0.4 Fixed css for top scores and play also credit for myself XD
    V1.0.5 Checks for update
    V1.1.5 Redid gui also did some changelog/alert/stats stuff
    V1.1.6 Made the homescreen customization match
    V1.2.6 Added Tips and Tricks and Combos for each gun
    V1.3.6 Added fps,ms,bytes counter
    V1.4.7 Added jQuery and added other stuff
    V1.4.8 Added compatibility
    V1.5.8 Added source control from github
    V1.6.8 Optimized adblock and customization*/


//--- checks to see if script is running and gives new logo (if you don't see an alert before the page finishes loading the script is not working)---\\
function scriptRunning() {

    alert("Injected G.E.T Version 1.6.8 (It might take a while for code to load depending on how powerful you computer is)\nATTENTION THIS IS NOT THE OFFICAL SCRIPT FOR THE OFFICIAL SCRIPT GO TO MY GITHUB: https://github.com/LightLordYT/Gats.io-Enhancement-Tool/blob/main/get.js")
    document.getElementById("gatsLogo").src = "https://i.imgur.com/aOG03yv.png"
};

//--- useful code for making interface look fancier--\\


var message = document.getElementById("announcementMessage");

window.onload = function () {
    document.getElementById("gameadsbannerpic").innerHTML = "add deleted (beta)";
    document.title = "G.E.T  V1.6.8";
  var newM = "Going to add auto upgrade soon! stay tuned (Also click this text to see tips and tricks/combos)";
  message.textContent = newM;
};
window.addEventListener("load", function(event) {
document.getElementById('highScoresHeading').style.background = "#13AAFF"
document.getElementById('moreGamesFooter').style.background = "#13AAFF"
document.getElementById('moreGamesFooter').innerHTML = "G.E.T made by LightLord"
var options = document.getElementById("moreGamesFooter")
options.addEventListener("click", () => {
if (window.confirm('Press Ok to see my G.E.T github repository. Press cancel to see my greasyfork'))
{
window.open("https://github.com/LightLordYT/Gats.io-Enhancement-Tool","_blank")
}
else
{
window.open('https://greasyfork.org/en/users/798398-lightlord', '_blank');
}
});
document.getElementById('infoFooter').style.background = "#13AAFF"
document.getElementById('infoFooter').innerHTML = "Click to see G.E.T Changelog and Gats.io Stats"
var link = document.getElementById("infoFooter")
link.addEventListener("click", () => {
if (window.confirm('Press Ok to see changelog. Press cancel to see stats'))
{
alert("Version 1.0.1 Added Title\nVersion 1.0.2 Added other customization stuff\n Version 1.0.3 Disabled canvas to fix glitch\nVersion 1.0.4 Fixed css for top scores and play also credit for myself XD\nVersion 1.0.5 Checks for update\nVersion 1.1.5 Redid gui also other alert/changelog/stats stuff\nVersion 1.1.6 Made the homescreen customization match\n Version 1.2.6 Added Tips and Tricks and Combos for each gun.\nVersion 1.3.6 Added fps,ms,bytes counter that can be changed by clicking on it.\nVersion 1.4.7 Added jQuery and other stuff.\nVersion 1.4.8 Added Compatibility\nVersion 1.5.8 Added version control from github\nVersion 1.6.8 Optimized adblock and customization")
}
else
{
window.open('https://stats.gats.io', '_blank');
}
});
document.getElementById("infoFooter").style.color = "black"
document.getElementById("moreGamesFooter").style.color = "black"
document.getElementById('registerButton').style.background = "#13AAFF"
document.getElementById('weaponBacking').style.background = "#001359"
document.getElementById('weaponTitle').style.background = "#001359"
document.getElementById('armorBacking').style.background = "#001359"
document.getElementById('colorBacking').style.background = "#001359"
document.getElementById('colorTitle').style.background = "#001359"
document.getElementById('armorTitle').style.background = "#001359"
document.getElementById('reconnectButton').style.background = "#13AAFF"
document.getElementById('playButton').style.background = "#13AAFF"
document.getElementById('playButton').innerHTML = "Deploy"
document.getElementById('playButtonContainer').style.background = "#001992"
document.getElementById('loginButton').style.background = "#13AAFF"
document.getElementById('logoutButton').style.background = "#13AAFF"
document.getElementById("gametypeDropdown").style.borderRadius ="10px";
document.getElementById("serversBtn").style.borderRadius ="10px";
document.getElementById("playButton").style.borderRadius = "15px";
document.getElementById("playButton").style.borderColor = "black";
document.getElementById("slct").style.backgroundColor = "blue";
document.getElementById("slct").style.borderRadius = "25px";
document.getElementById("loginButton").style.borderRadius = "20px";
document.getElementById("registerButton").style.borderRadius = "20px";
document.getElementById("red").style.borderRadius ="100px";
document.getElementById("orange").style.borderRadius ="100px";
document.getElementById("yellow").style.borderRadius ="100px";
document.getElementById("green").style.borderRadius ="100px";
document.getElementById("blue").style.borderRadius ="100px";
document.getElementById("purple").style.borderRadius ="100px";
document.getElementById("announcementMessage").style.color = "white"
});


var newP = document.getElementById("announcementMessage")
newP.addEventListener("click", () => {
if (window.confirm('Press Ok to see Combos. Press cancel to see Tips and Tricks'))
{
alert("Combo Snipe and Go(In my opinion the best sniper combo): Gun Choice: Sniper Having 1 Armor. Slot 1: Speed. Slot2: Grenade/Gas/Knife. Slot3: Damage.\nCombo Up Close: Gun Choice: smg/shotgun 1 Amor. Slot 1: Range. Slot 2: Dash/Medkit/Shield. Slot 3: Speed.\nCombo Spam: Gun Choice: lmg/assault 1 Amor. Slot 1: Range. Slot 2: Grenade/Gas. Slot 3: Speed.\nCombo Spam: Gun Choice: pistol 1 Amor. Slot 1: Damage. Slot 2: Grenade/Gas/Medkit. Slot 3: Speed.\nThese are the only combos for now. If you want more combos or want to add a combo that you like join the discord and tell me!")
}
else
{
alert("Tips and Tricks:\n Knife: For knife use when people are bunched up to maximized damage or when a person is really close. Throw knife and shoot sniper almost at the same time towards the left and right of a person so when they try to run they either get hit by sniper or killed by knife.\n Grenade: Most useful when opponent is behind cover. Throw it at them, forcing them to go in one direction, shoot in that direction so that your shot and the grenade both hit.\n Medkit: For medkit use when you get hit even if it is a little bit since sniper can easily kill you.\n Dash: Most useful when opponent is behind cover. Dash in an unpredictable way toward them and shoot them(most effective if gun is lmg,smg, or shotgun). If you want you can dash, quickly shoot and dash out to avoid taking any damage.\nGas: Most useful when opponent is behind cover. You can spam it so they have to keep on running and when they are out in the open shoot them. This way you can pinch them a lot.\nThese are the only tips and tricks for now. If you want more tips and tricks or want to add a tip or trick that you like join the discord and tell me!")
}
});
var red = document.getElementById("red")
red.addEventListener("click", changeColorRed);

function changeColorRed() {

$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#A10000");
document.getElementById('playButton').style.background = "#FF0000"
document.getElementById("slct").style.backgroundColor= "red";
}

var blue = document.getElementById("blue")
blue.addEventListener("click", changeColorBlue);

function changeColorBlue() {

$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#001992");
document.getElementById('playButton').style.background = "#13AAFF"
document.getElementById("slct").style.backgroundColor= "blue";

}

var green = document.getElementById("green")
green.addEventListener("click", changeColorGreen)

function changeColorGreen() {

$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#10CF00");
$('playButton')("background-color", "#25FF23")
$("slct").css("background-color", "green");

}

/*var pink = document.getElementById("pink")
pink.addEventListener("click", changeColorPink)
function changeColorPink() {
$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#CF004F");
document.getElementById('playButton').style.background = "#FF0061"
document.getElementById("slct").style.backgroundColor= "pink";
}*/


/*var yellow = document.getElementById("yellow")
yellow.addEventListener("click", changeColorYellow)
function changeColorYellow() {
$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#C8BE00");
document.getElementById('weaponTitle').style.background = "#E5DA00 "
document.getElementById("slct").style.backgroundColor= "yellow";
}
var orange = document.getElementById("orange")
orange.addEventListener("click", changeColorOrange)
function changeColorOrange() {
$("#colorTitle, #colorBacking, #armorBacking, #armorTitle, #weaponTitle, #weaponBacking, #playButtonContainer").css("background-color", "#C99400");
document.getElementById('weaponTitle').style.background = "#E8AA00 "
document.getElementById("slct").style.backgroundColor= "orange";
}*/


//--- GUI to be implemented... ---\\

scriptRunning();

//fps counter
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

//--- useful styles to make interface look cooler + some other styles for general stuff like adblock(which  should "hopefully work" although prob it doesn't so dm me on discord if u can help---\\
GM_addStyle ( `
    .ccr {
    color: red
    }
    #lgc {
    position: fixed
    z-index:-5
    };
    #playButton {
    color:black
    };
    .high-score-row {
    color: black
    };
   #gameadsbannerpic {
    position: fixed;
   z-index:-1;
    };
    #detect {
    position: fixed;
    z-index:-1;
    };
    .ad-unit-container {
    position: fixed;
    z-index:-1;
    };
    #adhome {
   position: fixed;
   z-index: -1;
   };
` );

//chatbox extension
document.getElementById("chatbox").maxlength("100");
document.getElementById("chatbox").style.borderRadius = "25px";
document.getElementById("chatbox").style.backgroundColor = "blue";
document.getElementById("chatbox").style.borderColor = "black";
document.getElementById("chatbox").style.color = "white";


//---v---adblock---v---\\ (doesn't really work so if any of you guys can help dm me)

$("#gameadsbannerpic, #detect, #adRespawnLeft, #adRespawnRight, #adRespawnTop, #adHome, #ad-group, #ad-unit-container").remove()
