// ==UserScript==
// @name        Unfuck Pornhub 2
// @namespace   none yet
// @match       *://*.pornhub.com/*
// @grant       none
// @version     2.1
// @author      Kvothe (original code), fakeanatomydoctor (regex)
// @description Hide videos on Pornhub by title with regex. Currently blocks incest titles.
// @downloadURL https://update.greasyfork.org/scripts/412661/Unfuck%20Pornhub%202.user.js
// @updateURL https://update.greasyfork.org/scripts/412661/Unfuck%20Pornhub%202.meta.js
// ==/UserScript==


// WORD BLOCK LIST (supports regex, can make a copy and change these terms to whatever you like)
let wordList = ["sis", "step", "bro", "mom", "mother", 
  "dad", "father", "uncle", "n[ei]{2}ce", "nephew", "aunt",
  "daughter", "son", "family"];

// DON'T EDIT BELOW
console.log('WORKING');

const searchRelatedList = document.querySelectorAll('.searchRelatedList a')
searchRelatedList.forEach(term => {
    const searchTerm = term.textContent.toLocaleLowerCase().trim();
      wordList.forEach(word => {
      if(searchTerm.match(word) && word != "") {
        term.parentElement.remove()
        console.log(`search suggestion removed => ${searchTerm} cuz it contains ==> ${word}`)
      }
    })
})

const titles = document.querySelectorAll('.videoBox .title a')
titles.forEach(title => {
    const titleContent = title.textContent.toLocaleLowerCase().trim();
    wordList.forEach(word => {
      if(titleContent.match(word) && word != "") {
        title.parentElement.parentElement.parentElement.parentElement.remove();
        console.log(`video removed => ${titleContent} cuz it contains ==> ${word}`)
      }
    })
});