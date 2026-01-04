// ==UserScript==
// @name        Find cube duplicates
// @namespace   Violentmonkey Scripts
// @match       https://cubecobra.com/cube/list/*
// @grant       none
// @version     1.3
// @author      -
// @description 16/09/2021, 18:24:46
// @downloadURL https://update.greasyfork.org/scripts/432509/Find%20cube%20duplicates.user.js
// @updateURL https://update.greasyfork.org/scripts/432509/Find%20cube%20duplicates.meta.js
// ==/UserScript==
// 


// source: https://stackoverflow.com/questions/32132242/is-there-something-like-mulitiset-in-javascript
class Multiset {
    _backing = new Map();
    add(value) {
        if (this._backing.has(value)) {
            this._backing.set(value, 1 + this._backing.get(value));
        } else {
            this._backing.set(value, 1);
        }
    }

    delete(value) {
        if (this._backing.get(value) > 0) {
            this._backing.set(value, this._backing.get(value) - 1);
        } else {
            //do nothing
        }
    }

    get(value) {
        if (this._backing.get(value) > 0) {
            return this._backing.get(value);
        } else {
            return 0;
        }
    }
}

let preCreated = false;
let buttonToggled = false;
let pre = null;

window.findDuplicates = function (){
  
  let cards = new Multiset();

  [...document.querySelectorAll("li.card-list-item")]
    .map(e => e.textContent)
    .map(card => cards.add(card));


  // This is our output variable we'll be appending to
  let resultString = "";

  // shamelessly abuse functional constructs when we 
  // really mean forEach
  [...cards._backing]
    .sort((a, b) => a[1] - b[1] )
    .reverse().filter(e => e[1] > 1)
    .map(e => resultString = `${resultString}${e[0]} - ${e[1]}\n`);
  if(resultString.trim() === ""){
    resultString = "No duplicates!\n";
  }
  if(!preCreated){
    pre = document.createElement("pre");
    document.querySelector(".usercontrols.mb-3 + .mt-3").appendChild(pre);
    preCreated = true;
  }
  if(!buttonToggled){
    pre.textContent = resultString;
    buttonToggled = true;
  } else {
    pre.textContent = "";
    buttonToggled = false;
  }
}


let btn = document.createElement("button");
btn.style.margin = "2rem";
btn.classList.add("btn");
btn.classList.add("btn-success");
btn.textContent = "Click me to find duplicate cards on a view where gold cards are shown once only.";
btn.addEventListener("click", e => window.findDuplicates())
target = document.querySelector(".usercontrols.mb-3 + .mt-3");
target.style.marginBottom = "2rem";
target.appendChild(btn);