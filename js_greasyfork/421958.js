// ==UserScript==
// @name         jgrpg-sakura.com furigana toggler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A simple script to toggle furigana on/off for the JGRPG-SAKURA graded reader site.
// @author       kipufogogaz
// @match        https://jgrpg-sakura.com/reader/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421958/jgrpg-sakuracom%20furigana%20toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/421958/jgrpg-sakuracom%20furigana%20toggler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// get all furigana elements from DOM
var furiganas=document.getElementsByTagName("rt");

var mybutton = document.createElement("button");
mybutton.innerHTML = "Toggle Furigana";
var arrOfFurigana = Array.from(furiganas);
mybutton.addEventListener("click", function() {
  if (furiganas[0].style.display == "") { // if furigana is shown (the default)
      Array.prototype.map.call(arrOfFurigana, function (item){item.style.display = 'none';}); // hide
  } else {
      Array.prototype.map.call(arrOfFurigana, function (item){item.style.display = "";}); // show
  }
});
// get document body
var body = document.getElementsByTagName("body")[0];
// prepend button to rightmost position
body.prepend(mybutton);
})();