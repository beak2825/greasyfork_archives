// ==UserScript==
// @name         Try Google on Duck Duck Go - WF
// @namespace    https://www.wesfoster.com
// @version      1.3
// @description  Places a button to search Google from DDG. DuckDuckGo is great for privacy. But still, it's not the best search engine. This button allows you to quickly re-search on Google when necessary.
// @author       Wes Foster
// @match        http*://duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389801/Try%20Google%20on%20Duck%20Duck%20Go%20-%20WF.user.js
// @updateURL https://update.greasyfork.org/scripts/389801/Try%20Google%20on%20Duck%20Duck%20Go%20-%20WF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create Google button
    var button = document.createElement('a');
    button.setAttribute('style', 'color: #fff; background: #4285F4; padding: 10px 0px; text-align: center; width: 100px; margin-left:20px; left:100%; position:absolute; border-radius:5px; top:0px');

    // Set href
    var query = document.getElementById('search_form_input').value;
    button.href = 'https://www.google.com/search?q=' + query;
    button.text = "Try Google";


    // Add to page
    document.getElementsByClassName('header__search')[0].appendChild(button);
})();