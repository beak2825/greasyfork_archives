// ==UserScript==
// @name         Aternos Auto START Bot
// @namespace    https://www.lstv.ml
// @version      0.5.8.1
// @description  Will auto-click the "Start/Confirm" button in Aternos. Features an button.
// @author       LSTV
// @match        https://aternos.org/server/*
// @grant        none
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAZlBMVEUrh9P///8si9kuj+BfpN08kdez1PBAk9a82fEtjdw3j9a21u/2+v1LmtpVn9wsiteozu1lqN/E3vN1seJ8teTX6PcwitMvlenD3fPd7PjQ5PWGuuXw9/w8l+I4kttaot6cx+tLmt5JjPpNAAACc0lEQVR4nO3d23KqMBSAYRTkpMgWKiBaD+//kt1tbkrJclwlG7Od/7/sTBO+oTMd0yQNmoCIiIiIiIiIiCgIyqWP/QLS5Cv/ytXLcGV+XMceVmjfyTLpFj4WhWpI+uxntgbEt4D4FhDfAuJbQEyndK0rPUhPsqli5Vi9Q0ic5LrejxKk3551Q50vDiF/mkz3saF9kyBdEuqGCguXkLzUfXsoQqpbphsqA/IVEBOQcUBMQExAxgExATEBGQfEBMQEZBwQExDTy0DuLT74CbF/vbzzRsRVlGdCyry2t4slyKHeXqxtnwnJttLz6tuv7O8ECBAgQIAAAQIEyGfXSNeu3vsJidpQVZt/n8MjyE75kWmZrIEAAQIECJD/ClLaf2m3g0kmQqQ5EoeQ/k1YiLu6g5yOj8wxy57GaZDHAgIECBAgQIAAAQIECBAgQIAAAQLkccimSjtLaTc4yToNsukra/1gjomQrkjsDU6yToP0l1th61Y7hMSNdUdllg0mmQZJmzCz5fSIa5wLe0BdQoQ5fvwJHAgQIECAvCwk0t7msPIUUp9119adi++3qnkE6bUXyqUnPyHTAgIECBAgQIC8EqR7KiRS30G3OOwP1h48SPCPIIH+DrrLu32tLxdmmAkifNRoxZ858Q466Xz2TBChe8fAtefZgXwFxARkHBATEBOQcUBMQExAxgExATEBGQfEBMQEZJxbSGDfgiQmr6JUiXIop9ucKmFTmNjtuhDa77RDDV7u1D2NG22SY+pQ/P8R3wLiW0B8C4hvAfGtX0CqZz+zNTUkaArljXLz1CjvtP5bprtQbqb0DiIiIiIiIiIiesU+AFRirLdQ+iC6AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/418101/Aternos%20Auto%20START%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/418101/Aternos%20Auto%20START%20Bot.meta.js
// ==/UserScript==

//Following code is the START and CONFIRM clicker

startTheServer();
function startTheServer() {
    console.clear()
isRunning = false;
if (botON) {
setTimeout(
    function () {
        antiBanCheckIfUnused();
        setTimeout(
            function () {
                if (isRunning) {
                    console.clear()
                    console.log("Bot tick has been completed, server has been sucessfully started.");
                    document.querySelector('div[id="confirm"]').click();
                    document.querySelector('div[id="start"]').click();
                    console.clear()
                    startTheServer();
                }else{
                    console.clear()
                     console.log("Bot tick has been completed, but the server status is not in requied state. Waiting...");
                    console.clear()
                    startTheServer();
                }
            }, 200
        );
    }, 900
);
} else {
    setTimeout(
        function () {
            startTheServer();
        }, 100
    );
}
}

//Following code is the button onclick and vars;

var repeatingSpamFunction = null;
var isMobileVersion = null;
var botON = false;
var isRunning = false;


function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

createonoffButton();

function myfunc (zEvent) {
    if (botON) {
    alert ("The Aternos Auto Start bot has been turned off!");
    changeonoffButtonFALSE();
    botON = false;
     } else {
    alert ("The Aternos Auto Start bot has been turned on!");
    changeonoffButtonTRUE();
    botON = true;
     }
}

var myDiv = document.querySelector ("#onoffButton");
if (myDiv) {
    myDiv.addEventListener ("click", myfunc , false);
}

//Following code is the ON/OFF button script

function createonoffButton () {
  var composeBar = getElementByXpath("/html/body/div[2]/main/section/div[3]/div[4]");
  var onoffButton = document.createElement('button');
  onoffButton.setAttribute("id", "onoffButton");
  onoffButton.innerHTML = 'AutoStart bot is OFF';
  onoffButton.style.fontSize = '200%'
  onoffButton.style.backgroundColor = '#999999';
  onoffButton.style.borderRadius = '3px';
  onoffButton.style.padding = '5px 15px 5px 15px';
  onoffButton.style.marginTop = 'auto';
  onoffButton.style.fontWeight = 'bold';
  onoffButton.style.marginBottom = 'auto';
  onoffButton.style.outline = "none";
  onoffButton.style.boxShadow = "none";
  onoffButton.style.color = '#FFFFFF';
  onoffButton.style.height = "73px";
  composeBar.append(onoffButton);
}

function changeonoffButtonTRUE () {
  var composeBar = getElementByXpath("/html/body/div[2]/main/section/div[3]/div[4]");
  var onoffButton = document.getElementById('onoffButton');
    onoffButton.style.cursor = 'pointer';
    onoffButton.innerHTML = 'AutoStart bot is ON';
    onoffButton.style.color = '#FFFFFF';
    onoffButton.style.backgroundColor = '#308fe3';
    onoffButton.onclick = function(){
    };
}

function changeonoffButtonFALSE () {
  var composeBar = getElementByXpath("/html/body/div[2]/main/section/div[3]/div[4]");
  var onoffButton = document.getElementById('onoffButton');
    onoffButton.style.cursor = 'pointer';
    onoffButton.innerHTML = 'AutoStart bot is OFF';
    onoffButton.style.backgroundColor = '#999999';
    onoffButton.style.color = '#FFFFFF';
    onoffButton.onclick = function(){
    };
}

// And the following code is to prevent from detecting and IP banning. Also removes the error popups made by bot.

function antiBanCheckIfUnused() {
        isMobileVersion = document.getElementsByClassName('status online');
        if (isMobileVersion.length > 0) {
         isRunning = false;
         } else {
             isMobileVersion = document.getElementsByClassName('status loading');
             if (isMobileVersion.length > 0) {
                 isRunning = false;
             } else {
                 isMobileVersion = document.getElementsByClassName('status loading starting');
                 if (isMobileVersion.length > 0) {
                     isRunning = false;
                 } else {
                     isRunning = true;
                 }
             }
         }
}