// ==UserScript==
// @name         Sporcle Lyrics Quiz Semi-Cheater
// @namespace    http://github.com/lshapz
// @version      0.3
// @description  automatically populates a lyrics quiz on sporcle with 87 common words
// @author       lshapz
// @match        http://*.sporcle.com/*
// @match        https://*.sporcle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24883/Sporcle%20Lyrics%20Quiz%20Semi-Cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/24883/Sporcle%20Lyrics%20Quiz%20Semi-Cheater.meta.js
// ==/UserScript==

if (document.querySelectorAll("a[href='/games/subcategory/lyrics']") && document.getElementById('gameinput')){
    window.addEventListener("onload",load);
    window.addEventListener("load",load,true);
 }

 function load(){
     sporcle();
 }

function sporcle(){
  const words = ["the", "a", "and", "I", "is", "be", "was", "am", "were", "are", "arent", "werent", "love", "Im", "Id", "Ill", "Ive", "You", "Your", "Youre", "Youve", "Youd", "He", "Her", "She", "Him", "They", "Theyd", "Theyll", "Theyve", "Their", "We", "Us", "Our", "Me", "My", "Mine", "This", "That", "Here", "There", "Who", "What", "Where", "When", "Why", "How", "in", "on", "if", "of", "off", "or", "for", "from", "to", "go", "get", "got", "with", "out", "without", "over", "under", "up", "down", "like", "as", "at", "an", "know", "see", "seen", "been", "do", "dont", "can", "cant", "will", "wont", "other", "not", "well", "just", "myself", "all", "it", "its"];
  var input = document.getElementById('gameinput');
  var event = new Event('input');

  words.forEach(word=>{
     input.value = word;
     input.dispatchEvent(event);
  });
}


//https://greasyfork.org/en/scripts/24883-sporcle-lyrics-quiz-semi-cheater