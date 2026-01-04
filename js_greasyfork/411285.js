// ==UserScript==
// @name         Bye Bitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get rid of shit
// @author       Jay Du
// @match        https://www.tennisforum.com/forums/general-messages.12/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411285/Bye%20Bitch.user.js
// @updateURL https://update.greasyfork.org/scripts/411285/Bye%20Bitch.meta.js
// ==/UserScript==

// var $ = window.jQuery;
// let filtered_words = ["Floyd", "equal pay", "BLM", "Homophobic", "Sexist", "Transphobic", "Black", "Penis", "Ashe", "Vandalized"];

// for (let i = 0; i < filtered_words.length; i++) {
//     let s = 'div[class*="structItem-title"]:contains(' + filtered_words[i] + ')';
//     $(s).parent().parent().parent().remove();
// }

const threads = document.querySelectorAll(".structItem-title");
let filteredWords = [
  "Floyd",
  "equal pay",
  "BLM",
  "Homophobic",
  "Sexist",
  "Transphobic",
  "Black",
  "Penis",
  "brutality",
    "political",
    "social justice",
    "justice",
    "sjw",
    "republican",
    "democrat",
    "trump",
    "protest",
    "Guest",
    "naomi",
    "osaka",
    "embarrassing",
    "bouchard",
    "5x",
];

let blocked = 0;

for (const thread of threads) {
  for (const word of filteredWords) {
      if (
        thread.textContent.toUpperCase().includes(word.toUpperCase())
      ) {
        thread.parentElement.parentElement.parentElement.remove();
        blocked += 1;
        console.log(blocked);
        }
   }
}

