// ==UserScript==
// @name         WhatsApp BombText Button
// @namespace    https://www.youtube.com/channel/UCgZDJZnndc9LNcVzhD85csw
// @version      1.0.0
// @description  Creates a button that when pressed copies and pastes the text written in the chatbox
// @author       KRAMOS
// @icon         https://i.pinimg.com/originals/f7/09/99/f70999bf2fe7f1d8bd6bd0994787cbb1.png
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427818/WhatsApp%20BombText%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/427818/WhatsApp%20BombText%20Button.meta.js
// ==/UserScript==

var repetir = null;
var repeatingCreateSpamButtonFunction = null;
var message = '';





document.onclick = function(){
  createSpamButton();
  creatcredit();
    creatnovocredit();
};

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function createSpamButton () {
  if(document.getElementById('botaospam') != null)
    return;
  var composeBar = getElementByXpath("//*[@id=\"main\"]/footer/div/div[1]");
  if(composeBar == null)
    return;
  composeBar.oninput = function(){
    editSpamButton();
  };

  var spamButton = document.createElement('button');
  spamButton.setAttribute("id", "botaospam");
  spamButton.innerHTML = '💣';
  spamButton.style.fontSize = '100%';
  spamButton.style.padding = '7px 10px 10px 10px';
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
  if(element.innerHTML == '💣'){
    var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[2]/div/div[2]");
    if(input.innerHTML == '' || input.innerHTML == null){
      window.alert('Coloque Um Texto Primeiramente');
      return;
    }
    element.innerHTML = '🛑';
    message = input.innerHTML;
    var interval = parseInt;
    repetir = window.setInterval(function(){
      sendMessage();
    }, 1);
  } else {
    element.innerHTML = '💣';
    window.clearInterval(repetir);
  }
  editSpamButton();
}

function editSpamButton(){
  var spamButton = document.getElementById('botaospam');
  var input = getElementByXpath("//*[@id=\"main\"]/footer/div/div[1]");
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



function creatcredit () {
  if(document.getElementById('kramostext') != null)
     return;
  var ota = getElementByXpath("//*[@id=\"main\"]/header/div/div[2]");
  if(ota == null)
     return;
  ota.oninput = function(){
  creatnovocredit();
  };
  var kramostext = document.createElement('text');
  kramostext.setAttribute("id", "kramostext");
  kramostext.innerHTML = 'KamozinMaker';
  kramostext.style.fontSize = '100%';
  kramostext.style.padding = '0px 10px 10px 10px';
  ota.append(kramostext);
}

function creatnovocredit () {
    if(document.getElementById('makertext') != null)
     return;
  var mak = getElementByXpath("//*[@id=\"side\"]/header/div[2]");
  if(mak == null)
     return;
  mak.oninput = function(){
  };
  var makertext = document.createElement('text');
  makertext.setAttribute("id", "makertext");
  makertext.innerHTML = 'KramozinMaker';
  makertext.style.fontSize = '100%';
  makertext.style.padding = '0px 0px 10px 10px';
  mak.append(makertext);
}


