// ==UserScript==
// @name         Moomoo.io ItzF1ker1 editon
// @namespace    None.
// @version      3.0
// @description  I'm trying to make dis. xd
// @author       ItzF1ker1
// @match        http://moomoo.io/*
// @match        https://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        None.
// @icon         http://u.cubeupload.com/FikriXGamer/Crown.png
// @downloadURL https://update.greasyfork.org/scripts/430513/Moomooio%20ItzF1ker1%20editon.user.js
// @updateURL https://update.greasyfork.org/scripts/430513/Moomooio%20ItzF1ker1%20editon.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementById("gameName").innerHTML = "DeadGame.io";
$('#leaderboard').append('Fancied by: ItzF1ker1');
document.getElementById("diedText").innerHTML = "GIT GUD"
$('#diedText').css({'background-color': 'rgba(0, 0, 0, 0.74)'});
document.getElementById('enterGame').innerHTML = 'Press Here to Suffer';
document.getElementById('loadingText').innerHTML = 'You gonna play this dead game? Ok...';

document.getElementById("pingDisplay").style.color = "#000000";
const pingDisplay = $("#pingDisplay");
pingDisplay.css("top", "8px");
pingDisplay.css("display", "block");

$("body").append(pingDisplay);

(function() {
  var UPDATE_DELAY = 200;

  var lastUpdate = 0;
  var frames = 0;

  var displayElement = document.createElement("div");
  displayElement.style.padding = "5px";
  displayElement.style.font = "16px Hammersmith One";
  displayElement.style.display = "block";
  displayElement.style.position = "fixed";
  displayElement.style.top = "0px";
  displayElement.style.left = "0px";
  displayElement.textContent = "Calculating...";
  document.body.appendChild(displayElement);

  function cssColorToRGB(color) {
    var values;

    if (color.startsWith("rgba")) {
      values = color.substring(5, color.length - 1).split(",");
    } else if (color.startsWith("rgb")) {
      values = color.substring(4, color.length - 1).split(",");
    } else if (color.startsWith("#") && color.length === 4) {
      values = [];
      values[0] = "" + parseInt("0x" + color.substr(1, 1));
      values[1] = "" + parseInt("0x" + color.substr(2, 1));
      values[2] = "" + parseInt("0x" + color.substr(3, 1));
    } else if (color.startsWith("#") && color.length === 7) {
      values = [];
      values[0] = "" + parseInt("0x" + color.substr(1, 2));
      values[1] = "" + parseInt("0x" + color.substr(3, 2));
      values[2] = "" + parseInt("0x" + color.substr(5, 2));
    } else {
      return {r : 255, g : 255, b : 255};
    }

    return {
      r : Number(values[0]),
      g : Number(values[1]),
      b : Number(values[2])
    };
  }

  function getInvertedRGB(values) {
    return "rgb(" + (255 - values.r) + "," + (9 - values.g) + ","
      + (9 - values.b) + ")";
  }

  function getOpaqueRGB(values) {
    return "rgba(" + values.r + "," + values.g + "," + values.b + ",0.7)";
  }

  function updateCounter() {
    var bgColor = getComputedStyle(document.body, null).getPropertyValue(
      "background-color");
    var bgColorValues = cssColorToRGB(bgColor);
    var textColor = getInvertedRGB(bgColorValues);
    var displayBg = getOpaqueRGB(bgColorValues);
    displayElement.style.color = textColor;
    displayElement.style.background = displayBg;

    var now = Date.now();
    var elapsed = now - lastUpdate;
    if (elapsed < UPDATE_DELAY) {
      ++frames;
    } else {
      var fps = Math.round(frames / (elapsed / 1000));
      displayElement.textContent = fps + " FPS";
      frames = 0;
      lastUpdate = now;
    }

    requestAnimationFrame(updateCounter);
  }

  lastUpdate = Date.now();
  requestAnimationFrame(updateCounter);
})();

document.getElementById("scoreDisplay").style.color = "#C2B17A";
document.getElementById("woodDisplay").style.color = "#758F58";
document.getElementById("stoneDisplay").style.color = "#818198";
document.getElementById("killCounter").style.color = "#B90000";
document.getElementById("foodDisplay").style.color = "#AE4D54";
document.getElementById("allianceButton").style.color = "#00F4FF";
document.getElementById("chatButton").style.color = "#FFFFFF";
document.getElementById("storeButton").style.color = "#FF7300";
document.getElementById("ageText").style.color = "#3DFF00";

document.title="Moo Moo"
setInterval(() => {
setTimeout( () => {
document.title="~oo Moo"
setTimeout( () => {
document.title="M~o Moo"
setTimeout( () => {
document.title="Mo~ Moo"
setTimeout( () => {
document.title="Moo~Moo"
setTimeout( () => {
document.title="Moo ~oo"
setTimeout( () => {
document.title="Moo M~o"
setTimeout( () => {
document.title="Moo Mo~"
setTimeout( () => {
}, 580);
}, 580);
}, 580);
}, 580);
}, 580);
}, 580);
}, 580);
}, 580);}
 , 2000);

document.getElementById('nameInput').placeholder = "Your Cringe Name";
$("#mapDisplay").css("background", "url('https://cdn.discordapp.com/attachments/654989610203742228/715081693655990353/20200527_125843.png')");
$('#ageBar').css({'-webkit-border-radius': '0px',
                  '-moz-border-radius': '0px',
                  'border-radius': '50px',
                  'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#ageBarBody').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '50px',
                      'background-color': '#3DFF00'});
$('#leaderboard').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '50px',
                       'background-color': 'rgba(0, 0, 0, 0.4)',
                       'text-align': 'center'});
$('.storeTab').css({'-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '30px',
                    'background-color': 'rgba(0, 0, 0, 0.4)'});
$('#storeHolder').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)'});
$('#allianceHolder').css({'-webkit-border-radius': '0px',
                          '-moz-border-radius': '0px',
                          'border-radius': '30px',
                          'background-color': 'rgba(0, 0, 0, 0.4)'});
$('.actionBarItem').css({'-webkit-border-radius': '0px',
                         'border-radius': '30px',
                         'background-color': 'rgba(0, 0, 0, 0.4)'});
$('#chatBox').css({'-webkit-border-radius': '0px',
                   '-moz-border-radius': '0px',
                   'border-radius': '30px',
                   'background-color': 'rgba(0, 0, 0, 0.4)',
                   'text-align': 'center'});
$('.uiElement, .resourceDisplay').css({'-webkit-border-radius': '0px',
                                       '-moz-border-radius': '0px',
                                       'border-radius': '20px',
                                       'background-color': 'rgba(0, 0, 0, 0.4)'});
$('#menuContainer').css({'white-space': 'normal'});
$('#nativeResolution').css({'cursor': 'pointer'});
$('#guideCard').css({'margin-top': 'auto',
                     'margin-bottom': '30px'});
$('#serverSelect').css({'margin-bottom': '30.75px'});
$('#skinColorHolder').css({'margin-bottom': '30.75px'});
$('#gameName').css({'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});
$('#loadingText').css({'padding': '8px',
                       'right': '150%',
                       'left': '150%',
                       'margin-top': '40px'});
$('.ytLink').css({'color': '#144db4',
                  'padding': '8px',});
$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});
$('#serverSelect').css({'cursor': 'pointer',
                        'border': 'hidden',
                        'font-size': '20px'});
$('.menuButton').css({'border-radius': '50px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});
})();