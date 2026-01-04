// ==UserScript==
// @name         Skribbl.io Helper
// @version      0.24
// @description  Learns the wordlist each round and outputs possible words in chat.
// @author       n0thing
// @match        https://skribbl.io/*
// @grant        none
// @namespace https://greasyfork.org/users/90770
// @downloadURL https://update.greasyfork.org/scripts/374584/Skribblio%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/374584/Skribblio%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

if (localStorage.getItem('wordlist') !== null) {
  window.alert('Hello from n0thing! I am the developer of Skribbl.io Helper, and I\'ve just updated the script from 0.12 to 0.20.\nThis new update allows for multi-language support, but your current WORDLIST will be affected!\nPlease transfer your current wordlist to wordlist[Lang] so Skribbl.io helper can use your current wordlist.\nSee this this forum (greasyfork.org/en/forum/discussion/48865/) for more information and how to transfer!\n\n This popup will stop appearing once the transfer is complete.');
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

document.getElementById('inputChat').setAttribute('placeholder', 'Press ALT to open matching words');  // input wordhint into chat

document.getElementsByTagName("body")[0].onkeyup = function() {
            if (event.key === "Alt" ){
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