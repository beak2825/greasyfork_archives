// ==UserScript==
// @name         Crash Hack
// @namespace    RIP MOOMOO
// @version      0.13
// @description  CRASH SERVERS
// @author       Discord - Lost MvP#7777
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428699/Crash%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/428699/Crash%20Hack.meta.js
// ==/UserScript==
 
document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"
 
document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
 
document.getElementById("leaderboard").style.color = "yellow";
document.getElementById("gameName").style.color = "yellow";
document.getElementById("setupCard").style.color = "yellow";
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "yellow";
document.getElementById("woodDisplay").style.color = "yellow";
document.getElementById("stoneDisplay").style.color = "yellow";
document.getElementById("killCounter").style.color = "yellow";
document.getElementById("foodDisplay").style.color = "yellow";
document.getElementById("ageText").style.color = "yellow";
document.getElementById("allianceButton").style.color = "yellow";
document.getElementById("chatButton").style.color = "yellow";
document.getElementById("storeButton").style.color = "yellow";
 
$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});
 
$('#menuContainer').css({'white-space': 'normal'});
 
$('#nativeResolution').css({'cursor': 'pointer'});
 
$('#playMusic').css({'cursor': 'pointer'});
 
$('#guideCard').css({'overflow-y': 'hidden',
                     'margin-top': 'auto',
                     'margin-bottom': '30px'});
 
 
$('#skinColorHolder').css({'margin-bottom': '30.75px'});
 
$('.settingRadio').css({'margin-bottom': '30.75px'});
 
 
 
$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0)',
                           'text-align': 'center',
                           'bottom': '12px'});
 
$('#gameName').css({'color': '#000000',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});
 
$('#loadingText').css({'color': '#000000',
                       'background-color': 'rgba(0, 0, 0, 0)',
                       'padding': '8px',
                       'right': '150%',
                       'left': '150%',
                       'margin-top': '40px'});
 
$('.ytLink').css({'color': '#144db4',
                  'padding': '8px',
                  'background-color': 'rgba(0, 0, 0, 0)'});
 
$('.menuLink').css({'color': '#144db4'});
 
$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});
 
$('#serverSelect').css({'cursor': 'pointer',
                        'color': '#000000',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});
 
$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});
 
$('#promoImgHolder').css({'position': 'absolute',
                          'bottom': '-7%',
                          'left': '20px',
                          'width': '420px',
                          'height': '236.25px',
                          'padding-bottom': '18px',
                          'margin-top': '0px'});
 
$('#adCard').css({'position': 'absolute',
                  'bottom': '-7%',
                  'right': '20px',
                  'width': '420px',
                  'height': '236.25px',
                  'padding-bottom': '18px'});
 
document.addEventListener('keydown', function(e) {
    for (i = 0; i < 3; i++) {
      if (e.keyCode == 16){
        window.open('https://www.pornhub.com/view_video.php?viewkey=ph5e5b5de5a184f', '_blank')
        console.log('noob')
      }
    }
})