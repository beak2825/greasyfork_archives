// ==UserScript==
// @name         Clube do Dual Search 2.0 (Advanced View)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Search Clube do Dual from IMDB page (Advanced View)
// @author       jedimaster
// @match        https://www.imdb.com/title*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441610/Clube%20do%20Dual%20Search%2020%20%28Advanced%20View%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441610/Clube%20do%20Dual%20Search%2020%20%28Advanced%20View%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const titleContainer = document.getElementsByClassName("titlereference-title-year")[0];
    const imdbId = document.getElementsByClassName("ribbonize titlereference-watch-ribbon")[0].getAttribute('data-tconst');
    const searchURL = 'https://clubedodual.com/pesquisar/?q=';
    const tags = '&tags=';
    const base64Icon = 'https://i.imgur.com/v8SFgRf.pngg';
    const link = document.createElement('a');
    link.setAttribute('style', 'display: inline-block; width: 20px; height: 20px;');
    link.setAttribute('href', `${searchURL}${imdbId}${tags}${imdbId}`);
    const img = document.createElement('img');
    img.setAttribute('style', 'width: 100%');
    img.setAttribute('src', base64Icon);
    link.append(img);
    titleContainer.append(link);

})();