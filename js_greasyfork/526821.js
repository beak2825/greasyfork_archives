// ==UserScript==
// @name         SMLWiki - The Collab! on smlwiki.com/movie
// @namespace    https://greasyfork.org/en/users/1434767
// @version      2.0
// @description  Adds The Collab! to the Episodes page.
// @author       BoyOHBoy
// @match        https://smlwiki.com/movie/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526821/SMLWiki%20-%20The%20Collab%21%20on%20smlwikicommovie.user.js
// @updateURL https://update.greasyfork.org/scripts/526821/SMLWiki%20-%20The%20Collab%21%20on%20smlwikicommovie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://smlwiki.com/page/collab';
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-collab.jpg';
    imgElement.style.rotate = '-10deg';
    imgElement.style.left = '250px';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);
})();
