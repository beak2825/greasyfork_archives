// ==UserScript==
// @name         Ekşi Sözlük Search Bar Limit Counter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       FrknKoseoglu
// @match        https://eksisozluk.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448787/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Search%20Bar%20Limit%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/448787/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Search%20Bar%20Limit%20Counter.meta.js
// ==/UserScript==

// @Github https://github.com/FrknKoseoglu/

(function() {
    'use strict';
    const searchInput = document.querySelector('#search-textbox')
    const searchForm = document.querySelector('#search-form')
    const countsLetter = document.createElement("div");
    const rgbRatio = 10.2;
    let red = 1;
    let green = 255;
    countsLetter.setAttribute("id", "count-letter");
    searchForm.prepend(countsLetter)
    countsLetter.style.cssText = "position:absolute;right:15%;font-weight:bold;"

const count = document.getElementById('count-letter')
searchInput.onkeyup = (e) => {
   let charCount = e.target.value.length;
  count.innerHTML = (50 - charCount);

    if(charCount < 25) {
        red = charCount * rgbRatio;
        countsLetter.style.cssText += `color:rgb( ${red} 255 0);`
    }
    else {
    green = (((charCount * rgbRatio) - 255) - 255) * -1;
        countsLetter.style.cssText += `color:rgb( 255 ${green} 0);`
    }

    if(charCount > 50){
        searchInput.style.cssText +='border: 2px solid red !important;';
    }
    else{
    searchInput.style.cssText = '';
    }

};

})();