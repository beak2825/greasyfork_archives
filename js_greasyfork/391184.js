// ==UserScript==
// @name         Plex Mobile
// @namespace    oracle.plex
// @version      1.1.2
// @description  Archmonger's plex modifications to support small screens https://github.com/Archmonger/Improved-Plex-Mobile-CSS
// @author       TheGuardianWolf
// @match        https://app.plex.tv/*
// @match        http://app.plex.tv/*
// @include      *:32400/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391184/Plex%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/391184/Plex%20Mobile.meta.js
// ==/UserScript==

/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    var script = document.createElement('script');
    script.src = 'https://archmonger.github.io/Improved-Plex-Mobile-CSS/plex_mobile.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://archmonger.github.io/Improved-Plex-Mobile-CSS/plex_mobile.css';
    document.getElementsByTagName('head')[0].appendChild(link);
})();