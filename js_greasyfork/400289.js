// ==UserScript==
// @name         Skribbl.io Helper
// @version      0.02
// @description  Retrieves the wordlist and outputs possible words in chat. Based off of n0thing's Skribbl.io Helper.
// @author       n0thing, jakecrowley
// @match        https://skribbl.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/500647-jakecrowley
// @downloadURL https://update.greasyfork.org/scripts/400289/Skribblio%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/400289/Skribblio%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

var wordlist; //declare global scope wordlist var
$.get("https://raw.githubusercontent.com/jakecrowley/Skribblio-Wordlist-Scraper/master/SkribblioWordlistScraper/bin/Debug/wordlist.json", function(data, status){
    wordlist = data.substring(1, data.length - 1);
    console.log("[Skribbl.io Helper] Loaded " + (wordlist.match(/,/g) || []).length + " words");
});

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

document.getElementById('inputChat').setAttribute('placeholder', 'Press ALT to toggle matching words');  // input wordhint into chat

var hidden = true;

document.getElementsByTagName("body")[0].onkeyup = function() {
    if (event.key === "Alt" ){
        hidden = !hidden;
    }
};

var currentWord = "";

setInterval(function() {
    if(document.getElementById('currentWord') != null && !hidden){
        if(currentWord != document.getElementById('currentWord').textContent){
            chatbot();
            currentWord = document.getElementById('currentWord').textContent;
        }
    } else {
        document.getElementById('botChat').setAttribute('style','display: none');
        currentWord = "";
    }
}, 500);

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

  var wordhint = wordlist.match(wordRGX).filter(function(f){return !f.includes(',');}).sort().toString().replace(/"/g,'').replace(/,/g,', '); // clean up result for bot chat

//if (document.getElementById('botChat').attributes[0].value.search('display: none') != -1){//if hidden
document.getElementById('hint').innerHTML = wordhint.substring(0, 700);
document.getElementById('botChat').setAttribute('style','display:');

document.getElementById('boxMessages').scrollTop = document.getElementById('boxMessages').scrollHeight; //scrollto bottom of chat
}
})();