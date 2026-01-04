// ==UserScript==
// @name         WhatsApp Spaaaaam
// @namespace    http://tampermonkey.net/
// @version      3.0 final
// @description  estensione per spammare su whatsapp web
// @author       doggycheems
// @match        https://web.whatsapp.com/*
// @icon         https://telegra.ph/file/1ea2c4726850d20d7e61b.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420546/WhatsApp%20Spaaaaam.user.js
// @updateURL https://update.greasyfork.org/scripts/420546/WhatsApp%20Spaaaaam.meta.js
// ==/UserScript==

var repeatingSpamFunction = null;
var repeatingCreateSpamButtonFunction = null;
var message = '';

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

document.onclick = function(){
  createSpamButton();
};

function createSpamButton () {
  if(document.getElementById('spamButton') != null)
    return;
  var composeBar = getElementByXpath("//*[@id=\"main\"]/footer/div[1]");
  if(composeBar == null)
    return;
  composeBar.oninput = function(){
    editSpamButton();
  };

  var spamButton = document.createElement('button');
  spamButton.setAttribute("id", "spamButton");
  spamButton.innerHTML = 'rompi il cazzo';
  spamButton.style.fontSize = '100%';
  spamButton.style.padding = '0px 0px 10px 10px';
  composeBar.append(spamButton);
  editSpamButton();
}

function sendMessage () {
  var evt = new Event('input', {
    bubbles: true
  });

  var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[2]/div/div[2]");
  input.innerHTML = message;
  input.dispatchEvent(evt);

  getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[3]/button").click();
}

function doSpam(element) {
  if(element.innerHTML == 'spam'){
    var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[2]/div/div[2]");
    if(input.innerHTML == '' || input.innerHTML == null){
      window.alert('prima di spammare scrivi qualcosa.');
      return;
    }
    element.innerHTML = 'stop';
    message = input.innerHTML;
    var interval = parseInt (prompt('inserisci un intervallo: numero più grande = spam più lento:', '500'));
    repeatingSpamFunction = window.setInterval(function(){
      sendMessage();
    }, interval);
  } else {
    element.innerHTML = 'spam';
    window.clearInterval(repeatingSpamFunction);
  }
  editSpamButton();
}

function editSpamButton(){
  var spamButton = document.getElementById('spamButton');
  var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[2]/div/div[2]");
  if(input.innerHTML == '' || input.innerHTML == null){
    spamButton.style.cursor = 'not-allowed';
    spamButton.style.color = '#D3D3D3';
    spamButton.onclick = null;
  } else {
    spamButton.style.cursor = 'pointer';
    spamButton.style.color = '#039be5';
    spamButton.onclick = function(){
      doSpam(this);
    };
  }
}