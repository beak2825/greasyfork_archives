// ==UserScript==
// @name         imdb link back
// @namespace    https://www.douban.com/people/MoNoMilky/
// @version      0.3.1
// @description  Add back imdb link to douban movies
// @match        https://movie.douban.com/subject/*
// @author       Bambooom
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426455/imdb%20link%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/426455/imdb%20link%20back.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var items = document.querySelectorAll('#info .pl');
    var filtered = Array.from(items).filter(function(el) {
        return el.textContent.startsWith('IMDb'); // 找 IMDb 行
    });
    if (filtered.length) {
        var imdb = filtered[0].nextSibling;
        if (imdb.nodeType === 3) { // 3 = TEXT_NODE
            var imdbcode = imdb.textContent.trim(); // like "tt10370822"
            var imdblink = document.createElement('span');
            imdblink.innerHTML = ' <a href="https://www.imdb.com/title/' + imdbcode + '" target="_blank">' + imdbcode + '</a>';
            imdb.parentNode.insertBefore(imdblink, imdb);
            imdb.parentNode.removeChild(imdb);
        }
    }
})();