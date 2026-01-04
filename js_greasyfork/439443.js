// ==UserScript==
// @name         Skribbl.io AutoGuesser
// @version      1.0
// @description  Goes into Skribbl.io's console to guess possible outputs, and puts them in chat.
// @author       `
// @match        https://skribbl.io/*
// @grant        none
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/439443/Skribblio%20AutoGuesser.user.js
// @updateURL https://update.greasyfork.org/scripts/439443/Skribblio%20AutoGuesser.meta.js
// ==/UserScript==

(function() {
    'use strict';

if (localStorage.getItem('wordlist') !== null) {
  window.alert('Hi! I\'m `, I am the developer of Skribbl.io AutoGuesser, and I just wanted to tell you that this script took a LONG time to make. Please rate honestly, it would mean alot!')
}

//create wordlist name, check if wordlist localstorage exists upon joining game
var wordlist; //declare global scope wordlist var
document.querySelector('#formLogin > button').onclick = function(){
wordlist = 'wordlist' + document.querySelector('#loginLanguage').value;
if (localStorage.getItem(wordlist) === null) {
localStorage.setItem(wordlist,'""');
}
};

var wordhint;
var wordRGX;
var i;

//create message element
var messageelement = document.createElement('p');
messageelement.setAttribute('style', 'display: none');
messageelement.setAttribute('id','botChat');
var c = document.createElement('span');
c.setAttribute('id','hint');
messageelement.appendChild(c);
document.getElementById('containerSidebar').insertBefore(messageelement, document.getElementById('containerSidebar').childNodes[0]); //insert bot chat

document.getElementById('containerFreespace').setAttribute('style','display: none');

var css = document.createElement('style');
css.innerHTML = '#botChat{ border-radius: 2px; background: rgb(238, 238, 238); width:inherit-5px; overflow-wrap: break-word; position:absolute;right:0;top:3px;left:3px; color: rgb(206, 79, 10);}';
document.body.appendChild(css);

document.getElementById('inputChat').setAttribute('placeholder', 'Press F2 to open matching words');  // when F2 is pressed it opens wordhint which you then click it for it to chat

document.getElementsByTagName("body")[0].onkeyup = function() {
            if (event.key === "F2" ){
							chatbot();
						}};

//mutationObserver > trigger wordCapture
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var element = document.querySelector('#overlay > div > div.text');
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == 'childList') {
      if (document.querySelector('#overlay > div > div.text').textContent.startsWith("Choose a word")){wordchoiceCapture();}; //trigger wordCatupre() when turn ends
      if (document.querySelector('#overlay > div > div.text').textContent.startsWith("The word was")){wordCapture();};
    }
  });
});
observer.observe(element, {
  childList: true
});

//capture word from skribbl.io after round
function wordCapture() {
 var word = document.querySelector('#overlay > div > div.text').textContent.slice(14);
 if (localStorage.getItem(wordlist).search( '"' + word + '"') === -1){
 	if (word.endsWith('word!') === false){
localStorage.setItem(wordlist,localStorage.getItem(wordlist) + ',"' + word + '"');  //updates localstorage
}
 }
}
function wordchoiceCapture() { //Is called twice by mutation observer
  var wordchoicelist = [];
  for (i = 0; i < document.getElementsByClassName("word").length; i++){
     wordchoicelist.push(document.getElementsByClassName("word")[i].textContent); //collects words from word options when it's the player's turn to draw.
  }; // somehow creates undefined,"word1","word2","word3"
  console.log(wordchoicelist)
  for (i = 0; i < wordchoicelist.length; i++){
    if (localStorage.getItem(wordlist).search( '"' + wordchoicelist[i] + '"') === -1){
      localStorage.setItem(wordlist,localStorage.getItem(wordlist) + ',"' + wordchoicelist[i] + '"');
  }
}
}

function chatbot(){
  var wordRGX = document.getElementById('currentWord').textContent;

while (wordRGX.charAt(0) === '_' || wordRGX.charAt(wordRGX.length-1) === '_'){
if (wordRGX.charAt(0) === '_'){
      wordRGX = wordRGX.replace('_','[^ ]');
    } else if(wordRGX.charAt(wordRGX.length-1) === '_'){
      wordRGX = wordRGX.replace(/_$/,'[^ ]');
    }
  }
  wordRGX = wordRGX.replace(/_/g,'[^ ]');
  wordRGX = '"'.concat(wordRGX,'"');
  wordRGX = new RegExp(wordRGX, 'g');

	var wordhint = localStorage.getItem(wordlist).match(wordRGX).filter(function(f){return !f.includes(',');}).sort().toString().replace(/"/g,'').replace(/,/g,', '); // clean up result for bot chat

if (document.getElementById('botChat').attributes[0].value.search('display: none') != -1){//if hidden
document.getElementById('hint').innerHTML = wordhint;
document.getElementById('botChat').setAttribute('style','display:');
} else {document.getElementById('botChat').setAttribute('style','display: none');}

document.getElementById('boxMessages').scrollTop = document.getElementById('boxMessages').scrollHeight; //scrollto bottom of chat
}
})();