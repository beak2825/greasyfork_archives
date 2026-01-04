// ==UserScript==
// @name        UNFUCK PORNHUB
// @namespace   make pornhub great again
// @match       *://*.pornhub.com/*
// @grant       none
// @version     1.1
// @author      Kvothe
// @description hide videos containing certain words from showing up at recommendation and search result.
// @downloadURL https://update.greasyfork.org/scripts/406228/UNFUCK%20PORNHUB.user.js
// @updateURL https://update.greasyfork.org/scripts/406228/UNFUCK%20PORNHUB.meta.js
// ==/UserScript==


// ADD WORDS YOU WANT TO BLOCK HERE
let addWords = ["", ""]; 

// THIS IS THE WORDS THAT IM BLOCKING
// JUST REMOVE WORDS YOU DON'T WANT TO BLOCK
let wordList = ["mistress", "femdom", "pegging", "pegged", "cd", "fag",
                "tranny", "tgirl", "ts", "hypno", "cuck", "faggot", "crossdresser",
                "transexual", "sissy", "ladyboy", "trans", "shemale"];

// DON'T EDIT BELOW
console.log('WORKING');

const searchRelatedList = document.querySelectorAll('.searchRelatedList a')
searchRelatedList.forEach(term => {
    const searchTerm = term.textContent.toLocaleLowerCase().trim().split(' ');
      arr.forEach(word => {
      if(searchTerm.includes(word.toLowerCase()) || searchTerm.includes(word.toLowerCase() + 's') && word != "") {
        term.parentElement.remove()
        console.log(`search suggestion removed => ${searchTerm.join(' ')} cuz it contains ==> ${word}`)
      }
    })
})

const titles = document.querySelectorAll('.videoBox .title a')
titles.forEach(title => {
    const titleContent = title.textContent.toLocaleLowerCase().trim().split(' ');
    // let eee = wordList.some(el => titleContent.includes(el))
    arr.forEach(word => {
      if(titleContent.includes(word.toLowerCase()) || titleContent.includes(word.toLowerCase() + 's') && word != "") {
        title.parentElement.parentElement.parentElement.parentElement.remove();
        console.log(`video removed => ${titleContent.join(' ')} cuz it contains ==> ${word}`)
      }
    })
});

// PLEASE REPORT ANY ISSUES OR BUGS
// AND READ "THE NAME OF THE WIND"
// REALLY GOOD BOOK)

