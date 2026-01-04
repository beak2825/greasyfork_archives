// ==UserScript==
// @name         XKCD Explain Button
// @namespace    https://aamirtahir.com
// @version      1.0
// @description  Adds a new button underneath XKCD comics to go the the ExplainXKCD webpage for that comic.
// @author       Aamir
// @match        https://xkcd.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/398595/XKCD%20Explain%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/398595/XKCD%20Explain%20Button.meta.js
// ==/UserScript==

'use strict';

(function() {
    let path = window.location.pathname.slice(1);
    path = path.slice(0,path.search('/'));
    $('.comicNav').last().after(
    `<div id="explanation-button">
        <ul class="comicNav">
            <li>
                <a href="https://www.explainxkcd.com/wiki/index.php/${path}">Explanation</a>
            </li>
        </ul>
    </div>`
    );
})()