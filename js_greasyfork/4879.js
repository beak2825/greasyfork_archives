// ==UserScript==
// @name       Sticky mTurk Search Bar
// @version    0.14
// @author zingy
// @description  sticks mturk searchbar on scroll
// @require http://code.jquery.com/jquery-latest.min.js
// @match https://www.mturk.com/*
// @match https://www.mturk.com/mturk*
// @match https://www.mturk.com/mturk/findhits?match=false*
// @match https://www.mturk.com/mturk/dashboard*
// @match https://www.mturk.com/mturk/findquals?requestable=false&earned=true*
// @match https://www.mturk.com/mturk/myhits*
// @match https://www.mturk.com/mturk/findhits?match=true*
// @match https://www.mturk.com/mturk/searchbar*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/2698
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4879/Sticky%20mTurk%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/4879/Sticky%20mTurk%20Search%20Bar.meta.js
// ==/UserScript==

jQuery(function($) {
    function fixDiv() {
      var $cache = $('#searchbar'); 
      if ($(window).scrollTop() > 100) 
        $cache.css({'position': 'fixed', 'top': '10px'}); 
      else
        $cache.css({'position': 'relative', 'top': 'auto'});
    }
    $(window).scroll(fixDiv);
    fixDiv();
});

//add css styling to div
$(window).load(function() {
    $('#searchbar').css('background-color','#A6CDDE'); 
});