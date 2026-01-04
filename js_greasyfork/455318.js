// ==UserScript==
// @name         Twitter "from:" UI upgrade
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  makes twitter search better lol
// @author       @gd3kr
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455318/Twitter%20%22from%3A%22%20UI%20upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/455318/Twitter%20%22from%3A%22%20UI%20upgrade.meta.js
// ==/UserScript==


//MIT license or something

//Paste directly into console

let search;
let fromFlag = false;

setTimeout(() => {
  search = document.querySelectorAll(
     "input[placeholder='Search Twitter']"
   )[0];
   
 search.addEventListener("keydown", function (e) {
   let searchValue = search.value;
   if (searchValue.indexOf("from:") > -1) {
     if (fromFlag === false) {
       createSpanElement();
       search.value = searchValue.replace(/from:/, "");

       fromFlag = true;
     }
   }
   if (search.value === "" && e.keyCode === 8) {
     let span = document.getElementById("customSpan");
     span.parentNode.removeChild(span);
     fromFlag = false;
   }

   if (e.keyCode === 13) {
     e.preventDefault();
     window.location.href = "https://twitter.com/search?q=from:" + search.value;
   }
 });
}, 1000); //one second delay to initialise the search bar


const createSpanElement = () => {
  let span = document.createElement("span");
  span.innerHTML = "from:";
  span.style.color = "white";
  span.style.margin = "0px";
  span.style.height = "20px";
  span.style.marginRight = "0.5em";
  span.style.padding = "0.3em";
  span.style.marginTop = "0.45em";
  span.style.borderRadius = "0.5em";
  span.id = "customSpan";
  span.style.backgroundColor = "#1d99eb";
  search.parentNode.insertBefore(span, search);
};

  

setInterval(function () {
  // try catch block
    let elements = document.getElementById("typeaheadDropdown-1")?.children;

    // if null or undefined return
    if (!elements) return;

    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function (e) {
        search.focus();
        e.stopImmediatePropagation();
        let text = this.innerText.match(/@.*\n/)[0];
        search.value = text;
      });
    }
}, 200);