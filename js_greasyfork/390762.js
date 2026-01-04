// ==UserScript==
// @name         bing_rel_next_prev
// @namespace    https://github.com/grepsuzette/bing_rel_next_prev
// @description  On *.bing.com add a rel="prev" and rel="next" attribute to the <a> going to Prev and Next pages, so it works with Saka keys and others. 
// @version      20191004_0007
// @author       grepsuzette
// @run-at       document-start
// @include      http*://*.bing.com/*
// @exclude      
// @downloadURL https://update.greasyfork.org/scripts/390762/bing_rel_next_prev.user.js
// @updateURL https://update.greasyfork.org/scripts/390762/bing_rel_next_prev.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tries = 0;
    var intv = setInterval(function() {
        var next = document.body.querySelector('a[href][title="Next page"]');
        var prev = document.body.querySelector('a[href][title="Previous page"]');
        if ( next !== null || prev !== null) {
            clearInterval(intv);    // ready, stop trying
            if (prev != null) prev.rel = "prev";
            if (next != null) next.rel = "next";
            // console.log("standardize with <a rel='prev'> and <a ref='next'>: done");
        }
        if (tries++ > 25) {
            clearInterval(intv); // stop trying after a reasonable 5sec
            // console.log("standardize with <a rel='prev'> and <a ref='next'>: abandoned, couldn't find these elements after 5 sec");
        }
    }, 230);
})();