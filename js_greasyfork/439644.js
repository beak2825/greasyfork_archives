// ==UserScript==
// @name         Google Search Margin Fixer
// @namespace    googlesearchmarginfixer
// @version      1.0
// @description  Fix 44px margin-bottom divs
// @author       Skyfighteer
// @include      https://www.google.com/search?*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439644/Google%20Search%20Margin%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/439644/Google%20Search%20Margin%20Fixer.meta.js
// ==/UserScript==

//Check if this is actually the Google search engine and not some other google site.
function isSearch(){
    const classname = document.getElementsByClassName("RNNXgb"); //Class present on one of the divs of the Google search bar.

    if(classname != undefined && classname != null)
        return true;
    else
        return false;
}

//Only run on Google domain.
if( isSearch() ) {

console.log('Looking for divs with 44px margin-bottom...');
let alldiv = document.querySelectorAll('div'), elLength = alldiv.length; // query every single div
for (let i = 0; i < elLength; i++) {

let style = window.getComputedStyle(alldiv[i]); // get every single style of each div
let marginval = style.getPropertyValue('margin-bottom'); // get the margin-bottom value of each div

if (marginval === '44px') { // if a div's margin-bottom is 44px
alldiv[i].style.marginBottom = '30px'; // change it to 30px
console.log('A 44px margin-bottom has been changed to 30px!');
}

}

} // site check

// site check source:
// https://github.com/EECSB/Google-Search-Customizer/blob/master/Google%20Search%20Customizer%20v1/program.js