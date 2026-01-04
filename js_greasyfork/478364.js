// ==UserScript==
// @name         Detailed Search Link
// @namespace    https://github.com/13ulbasaur/
// @version      0.31
// @description  Add Detailed Search link below the search bar. 
// @author       Twiggies
// @match        *://www.grundos.cafe/*
// @match        *://grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478364/Detailed%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/478364/Detailed%20Search%20Link.meta.js
// ==/UserScript==

//Find the search box. 
const searchBox = document.getElementById('searchquery')
//Only run if search box is found.
if (searchBox) {
    //Add the link after the searchbox.
    searchBox.parentElement.insertAdjacentHTML('afterend', '<a class="sb-custom-css" href="https://www.grundos.cafe/search/items/" style="font-weight: bold;font-style: underline;">Detailed Search</a>')
}
