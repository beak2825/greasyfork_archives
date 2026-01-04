// ==UserScript==
// @name        Goodreads - Sort bookshelves on profiles alphabetically
// @version     1.1
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @license     MIT
// @include  		https://www.goodreads.com/*
// @include  		http://www.goodreads.com/*
// @include  		https://goodreads.com/*
// @include  		http://goodreads.com/*
// @description Sort the bookshelves on users' profiles alphabetically.
// @downloadURL https://update.greasyfork.org/scripts/470733/Goodreads%20-%20Sort%20bookshelves%20on%20profiles%20alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/470733/Goodreads%20-%20Sort%20bookshelves%20on%20profiles%20alphabetically.meta.js
// ==/UserScript==

const isProfile = document.querySelector("#profileNameTopHeading");
const wrapper = document.querySelector("#shelves");

if (wrapper && isProfile) {
  start();
}

function start() {
  const linkEls = [...wrapper.querySelectorAll(".actionLinkLite")];
  let output = "";
  
  let itemsPerColumn = Math.ceil((linkEls.length + 1) / 4);
  console.log(itemsPerColumn);
  if (itemsPerColumn < 5) itemsPerColumn = 5;
  
  const linkElsSorted = linkEls.sort(compare);
  
  for (let i = 0; i < linkElsSorted.length; i++) {
    if (i == 0 || i % itemsPerColumn == 0) {
      if (i !== 0) {
       	output += `</div>`; 
      }
     	output += `<div class="shelfContainer">`;
    }
    
    output += linkElsSorted[i].outerHTML + `<br>`;
    
    if (i == linkElsSorted.length - 1) {
      output += `</div>`; 
    }
  } 
  
  wrapper.innerHTML = output;
}

function compare( a, b ) {
  if ( a.getAttribute("href") < b.getAttribute("href") ){
    return -1;
  }
  if ( a.getAttribute("href") > b.getAttribute("href") ){
    return 1;
  }
  return 0;
}