// ==UserScript==
// @name         LetterBoxd AP Features
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      2.0.0
// @description  Search native text on Douban and opening full size cover
// @author       Quin15
// @match        https://letterboxd.com/film/*
// @icon         https://www.google.com/s2/favicons?domain=letterboxd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425419/LetterBoxd%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/425419/LetterBoxd%20AP%20Features.meta.js
// ==/UserScript==

var copyText = document.createElement('div')
copyText.style = "height:50px;width:100px;border:1px solid;border-radius:8px;text-align:center;float:left;cursor:pointer"
copyText.innerText = "Search on Douban"
document.querySelector('div[class="review body-text -prose -hero prettify"] div').appendChild(copyText);
copyText.addEventListener("click", function() {open(encodeURI("https://search.douban.com/movie/subject_search?search_text=" + document.querySelector('#featured-film-header p em').innerText.substr(1).slice(0, -1)), "")});

var coverImage = document.createElement('div')
coverImage.style = "height:50px;width:100px;border:1px solid;border-radius:8px;text-align:center;float:left;cursor:pointer;margin-left:10px;"
coverImage.innerText = "Open Cover Image"
document.querySelector('div[class="review body-text -prose -hero prettify"] div').appendChild(coverImage);
coverImage.addEventListener("click", function() {open(document.querySelector('section[class^="poster-list"] div div img').srcset.replace(" 2x", ''), "")});