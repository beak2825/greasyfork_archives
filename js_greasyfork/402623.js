// ==UserScript==
// @name           iMDB youtube trailer
// @namespace      http://diveintomark.org/projects/greasemonkey/
// @version        0.3
// @description    Youtube trailer search link next to title
// @author         taipignas
// @include        *imdb.com/title/*
// @match          http://*imdb.com/title/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402623/iMDB%20youtube%20trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/402623/iMDB%20youtube%20trailer.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let titleWrapper = document.querySelector(`.media-body`);
    let title = titleWrapper.firstElementChild;
 
    let button = document.createElement(`a`);
    button.href = `https://www.youtube.com/results?search_query=` + title.textContent.trim().replace(/[\u0028\u0029]+/g, ``).replace(/[\u00a0 ]+/g, `+`) + `+trailer`;
    button.target = `_blank`;
    let img = document.createElement(`img`);
    img.src = `https://i.imgur.com/6xayYEx.png`;
    img.width = 30;
    img.height = 30;
    button.appendChild(img);
    title.appendChild(button);
})();