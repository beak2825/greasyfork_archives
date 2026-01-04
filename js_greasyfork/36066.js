// ==UserScript==
// @name         WhatsApp Web Spammer
// @namespace    http://tampermonkey.net/
// @version      1.55
// @description  Spam people with this beautiful WhatsApp Web spammer.
// @author       Dan6erbond
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36066/WhatsApp%20Web%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/36066/WhatsApp%20Web%20Spammer.meta.js
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
  spamButton.innerHTML = 'SPAM';
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
  if(element.innerHTML == 'SPAM'){
    var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[2]/div/div[2]");
    if(input.innerHTML == '' || input.innerHTML == null){
      window.alert('Please Enter a Text to be spammed before using the spam button.');
      return;
    }
    element.innerHTML = 'STOP';
    message = input.innerHTML;
    var interval = parseInt (prompt('Please enter spam-interval:', '500'));
    repeatingSpamFunction = window.setInterval(function(){
      sendMessage();
    }, interval);
  } else {
    element.innerHTML = 'SPAM';
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