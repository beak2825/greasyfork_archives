// ==UserScript==
// @name         Ads.id Marketplace Link
// @namespace    http://www.inetkita.com/
// @version      0.2
// @description  Add marketplace link to ads.id site 
// @author       Dedi Suryadi
// @match        *://ads.id/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/17792/Adsid%20Marketplace%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/17792/Adsid%20Marketplace%20Link.meta.js
// ==/UserScript==
/*


   Hello my name is Dedi Suryadi, if you happen to read this message please keep going.
   I am a self taught programmer, I can cobble together some javascript, Go, PHP, HTML5 and CSS3 
   If you have some interesting project and need a coder please contact me on dedisyd at ymail dot com   
   Thank you and here is a cute cat for you, cheers.
   
   
                      \,`~"~` /
      .-=-.           /    . .\
     / .-. \          {  ==  _ }==
    (_/   \ \          \      / 
           \ \        _/`'`'`b
            \ `.__.-'`        \-._
             |            '.__ `'-;_
             |            _.' `'-.__)
              \    ;_..--'/     //  \
              |   /  /   |     //    |
              \  \ \__)   \   //    /
               \__)        './/   .'
                             `'-'`   
                             
*/

/* jshint -W097 */
'use strict'; 
(function(){  
    if (document.getElementById('navtabs') !== null && document.getElementById('marketplace') === null) {
        var m = document.createElement("li");
        var p = document.querySelector('#pagetitle > p.description');
        m.innerHTML = '<a href="http://ads.id/forums/search.php?do=getnew&contenttype=vBForum_Post&exclude=88,78,114,66,157,158,159,138,150,155,116,117,152,153,154,113,93,90,115,119,73,75,79,137,118,85,112,81,135,82,161,136,98,80,109,148,139,89,97,94,86,84,77,91,104,100,101,102,111,110,103" class="navtab" id="marketplace" title="Marketplace ads.id">Marketplace</a>';
        if (p !== null && p.textContent.length > 760) {
            document.querySelector('li.selected').className = '';
            m.setAttribute('class', 'selected');
        }
        document.getElementById('navtabs').appendChild(m);
    }
}());

