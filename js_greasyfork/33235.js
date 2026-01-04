// ==UserScript==
// @name         RARBG Show thumbnails in torrent lists (Plain JavaScript)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows the thumbnail on every item of the torrent list, highlight matched torrent in searchpattern
// @include     /^(https?:)?\/\/(www\.)?rarbg\.(is|to|com)\/(torrents\.php.*|catalog\/.*|top10)$/
// @downloadURL https://update.greasyfork.org/scripts/33235/RARBG%20Show%20thumbnails%20in%20torrent%20lists%20%28Plain%20JavaScript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33235/RARBG%20Show%20thumbnails%20in%20torrent%20lists%20%28Plain%20JavaScript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var searchpattern = [
        'webrip'
    ];
    searchpattern.forEach(function(el, i){
        searchpattern[i] = el.toLowerCase();
    });
    var matches = document.querySelectorAll('.lista2 .lista a');
    var regExp = /\\'([^)]+)\\'/;
    if(matches && matches.length) {
        for(var i=0; i<matches.length; i++) {
            if(matches[i] && matches[i].onmouseover) {
                var inh = matches[i].innerHTML.toLowerCase();
                for(var j=0; j<searchpattern.length; j++) {
                    if(inh.includes(searchpattern[j])) {
                        matches[i].style.color = '#ff4db0';
                        matches[i].style.background = 'pink';
                        break;
                    }
                }
                var match = regExp.exec(matches[i].onmouseover);
                if(match) {
                    matches[i].parentNode.previousSibling.innerHTML = '<img src="'+match[1]+'"></img>';
                }
            }
        }
    }
})();