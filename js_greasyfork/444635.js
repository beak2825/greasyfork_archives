// ==UserScript==
// @name         Second Life Marketplace String Saver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically adds a string of your choosing to the end of the Second Life marketplace searches you make
// @author       Lucky Starlight
// @match        https://marketplace.secondlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=secondlife.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444635/Second%20Life%20Marketplace%20String%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/444635/Second%20Life%20Marketplace%20String%20Saver.meta.js
// ==/UserScript==

//Anything you put here will automatically be appended to the end of Marketplace searches.
//In my case I don't want to see anything from two imaginary creators named Poopy Peepoo or Pissy Papapoeepoe so I've put that here.
//Notice me wrapping separate NOT criteria in quote marks!
const savedstring = 'NOT "poopy peepoo" NOT "pissy papapoeepoe"';

$( "#item_search_keywords" ).change(function() {
    //When you put something in the search keywords box, we automatically add a space and our saved string to the end
  $( "#item_search_keywords" ).val($( "#item_search_keywords" ).val() + ' ' + savedstring);
});