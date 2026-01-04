// ==UserScript==
// @name         Show io9 articles only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filters Gizmodo/latest to just io9 articles
// @author       You
// @match        https://gizmodo.com/latest
// @match        https://gizmodo.com/latest*
// @icon         https://www.google.com/s2/favicons?domain=gizmodo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428323/Show%20io9%20articles%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/428323/Show%20io9%20articles%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';

     //boilerplate greasemonkey to wait until jQuery is defined...
  function GM_wait() {
    if(typeof window.jQuery == 'undefined') {
      window.setTimeout(GM_wait, 100);
    }
    else {
        var $ = window.jQuery;

        var io9Articles = $('article').has('a[data-ga*="Front page click"]').has('a[href*="/io9/"]');
        //io9Articles.css('background','red');
        $('article').has('a[data-ga*="Front page click"]').not(io9Articles).css('display','none');
    }
  }
  GM_wait();

    var url = document.location.toString();

    document.querySelector('html').addEventListener('DOMNodeInserted', function(ev){
        var new_url = document.location.toString();
        if (url == new_url) return; // already checked or processed
        url = new_url;

        GM_wait(); // run when URL changes
    });
})();