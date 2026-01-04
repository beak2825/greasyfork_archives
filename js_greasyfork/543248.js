// ==UserScript==
// @name         afk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  xua'yı çok seviyorum
// @author       mikey
// @match        https://gartic.io/*
// @icon        https://pbs.twimg.com/media/FQwQQBOWUAEdDut?format=jpg&name=large
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543248/afk.user.js
// @updateURL https://update.greasyfork.org/scripts/543248/afk.meta.js
// ==/UserScript==
document.addEventListener("keydown",function(event){if(event.key==="Escape"){handleEscapeKey()}
if(event.key==="PageUp"){handlePageUpKey()}});let clickCount=0;let clickInterval=setInterval(handleClick,100);function createCountDiv(){let div=document.createElement('div');div.style.position='fixed';div.style.top='10px';div.style.right='10px';div.style.padding='10px';div.style.background='';div.style.color='white';return div}
function handleClick(){if(clickCount<1&&isButtonAvailable()&&!isLoading()&&!isPopupVisible()){document.querySelector('#screens > div > div.content.join > div.actions > button').click();if(isLoading()){clickCount++}
}}
function isButtonAvailable(){return document.querySelector('#screens > div > div.content.join > div.actions > button')}
function isLoading(){return document.querySelector('div.loading')}
function isPopupVisible(){return document.querySelector('#popUp > div > div > div.contentPopup.confirm')}
function handleEscapeKey(){window.open(window.location.href,"_blank");clickExitButton();setTimeout(function(){window.close()},2000)}
function handlePageUpKey(){clickExitButton()}
function clickExitButton(){let exitButton=document.getElementById("exit");if(exitButton){exitButton.click()}
let yesButton=document.querySelector('.btYellowBig.smallButton.ic-yes');if(yesButton){yesButton.click()}}
function kontrol(){let documentText=document.body.innerText;if(documentText.includes("PASİF")){clickYesButton()}}
function clickYesButton(){let yesButton=document.querySelector('.btYellowBig.ic-yes');if(yesButton){yesButton.click()}}
let xd=setInterval(kontrol,1000);kontrol()