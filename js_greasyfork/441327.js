// ==UserScript==
// @name         Search reddit from IMDB
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Generate a reddit search for the currently viewed actor/actress
// @author       You
// @match        https://www.imdb.com/name/*
// @match        https://m.imdb.com/name/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441327/Search%20reddit%20from%20IMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/441327/Search%20reddit%20from%20IMDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var URLPattern = "https://new.reddit.com/search/?type=sr&q=";

    var panel = $('h1')[0];
    var button = document.createElement('BUTTON');
    button.innerHTML = "Search Reddit";
    button.id = "btnSearch";
    button.style.display = "flex";
    button.style.fontSize = "0.5em";
    panel.append(button);

    $('#btnSearch').click(function() {
        var search = panel.children[0].innerText;

        window.location.href = URLPattern + search;
    });

})();