// ==UserScript==
// @name         MyAnimeList(MAL) - Profile Switch (3 - list buttons)
// @version      1.0.4
// @description  Place list buttons below profile picture
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile*
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13129/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%283%20-%20list%20buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13129/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%283%20-%20list%20buttons%29.meta.js
// ==/UserScript==

// place list buttons under profile picture
var user = document.getElementsByClassName('user-profile')[0].childNodes;
user[7].parentNode.insertBefore(user[7], user[2]);