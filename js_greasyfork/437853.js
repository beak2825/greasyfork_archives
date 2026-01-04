// ==UserScript==
// @name         Google Search - remove "Top Stories"
// @namespace    googlesearchtopstoriesremover
// @version      1.0
// @description  Remove the "Top Stories" section from Google Search
// @author       Skyfighteer
// @include      https://www.google.com/search?*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437853/Google%20Search%20-%20remove%20%22Top%20Stories%22.user.js
// @updateURL https://update.greasyfork.org/scripts/437853/Google%20Search%20-%20remove%20%22Top%20Stories%22.meta.js
// ==/UserScript==

try {
    topstories();
    marginfix();
}
catch
{
    console.log('No Top Stories section has been found.');
}

function topstories() {
console.log('Looking for the top stories section...');
let topstories = Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'Top stories'); // change 'top stories' in this line to your own language exactly the way it displays in Google Search to localize the script
topstories.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
console.log('The Top Stories section has been successfully removed.');
console.log('');
}


function marginfix() {
// fix the annoying 44px margin-bottom
console.log('Looking for divs with 44px margin-bottom...');
let alldiv = document.querySelectorAll('div'), elLength = alldiv.length; // query every single div
for (let i = 0; i < elLength; i++) {

let style = window.getComputedStyle(alldiv[i]); // get every single style of each div
let marginval = style.getPropertyValue('margin-bottom'); // get the margin-bottom value of each div

if (marginval === '44px') { // if a div's margin-bottom is 44px
alldiv[i].style.marginBottom = '30px'; // change it to 30px
console.log('Every 44px margin-bottom has been changed to 30px!');
} // if

} // for

} //func