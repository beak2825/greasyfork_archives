// ==UserScript==
// @name         Youtube/DiscogsSearchLink
// @namespace    https://greasyfork.org/en/scripts/400798
// @version      0.2
// @description  add a link to search discogs for the youtube video title
// @author       denlekke
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400798/YoutubeDiscogsSearchLink.user.js
// @updateURL https://update.greasyfork.org/scripts/400798/YoutubeDiscogsSearchLink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        var container_el = document.getElementById('info-contents');

        //container_el.addEventListener("load", function() {
        console.log(container_el);
        var title_el = container_el.getElementsByClassName('title')[0];
        console.log(title_el);
        var title = document.querySelector('title');

        var title_text = title.innerHTML.replace(' - YouTube','').replace(/\s*\(.*?\)\s*/g,'');
        title_el.innerHTML = title_text+' ';
        //if artist - title likely the title, add link
        if (title_text.includes(' - ')){
            var a=document.createElement('a');
            a.href="https://www.discogs.com/search/?q="+encodeURIComponent(title_text);
            a.innerHTML = '->';
            a.target = '_blank';
            a.style.color = 'red';

            title_el.appendChild(a);
            console.log(title_el);
        }
    }
})();