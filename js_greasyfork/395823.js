// ==UserScript==
// @name         BrTeam Search
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Search BrTeam from IMDB page
// @author       jedimaster
// @match        https://www.imdb.com/title*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395823/BrTeam%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/395823/BrTeam%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const titleContainer = document.querySelectorAll('.title_wrapper h1')[0];
    const imdbId = document.querySelectorAll('#star-rating-widget')[0].getAttribute('data-title');
    const searchURL = 'https://brteam.net/search/?q=';
    const base64Icon = 'https://images2.imgbox.com/c5/a2/NBrafDy8_o.png';
    const link = document.createElement('a');
    link.setAttribute('style', 'display: inline-block; width: 20px; height: 20px;');
    link.setAttribute('href', `${searchURL}${imdbId}`);
    const img = document.createElement('img');
    img.setAttribute('style', 'width: 100%');
    img.setAttribute('src', base64Icon);
    link.append(img);
    titleContainer.append(link);

})();