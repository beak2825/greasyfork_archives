// ==UserScript==
// @name         MyAnimeList(MAL) - Profile Switch (2)
// @version      1.0.6
// @description  Switch "About me" with "Statistics and Favorites" in your profile
// @author       Cpt_mathix
// @include      *://myanimelist.net/profile*
// @exclude      *://myanimelist.net/profile/*/reviews
// @exclude      *://myanimelist.net/profile/*/recommendations
// @exclude      *://myanimelist.net/profile/*/clubs
// @exclude      *://myanimelist.net/profile/*/friends
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13110/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%282%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13110/MyAnimeList%28MAL%29%20-%20Profile%20Switch%20%282%29.meta.js
// ==/UserScript==

// solve conflict with navigationbar script
var n = 0;
if (document.getElementById('horiznav_nav') !== null)
    n = 1;

// switch statistics and user information
var profile = document.getElementsByClassName('container-right')[0];
if (profile.innerHTML.indexOf('user-profile-about') > -1) {
    profile = profile.childNodes;
    profile[3+n].parentNode.insertBefore(profile[3+n], profile[0+n]);
    profile[5+n].parentNode.insertBefore(profile[5+n], profile[1+n]);
    profile[7+n].parentNode.insertBefore(profile[7+n], profile[2+n]);
}
