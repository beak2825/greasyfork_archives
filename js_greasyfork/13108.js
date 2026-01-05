// ==UserScript==
// @name         MyAnimeList(MAL) - Profile Switch
// @version      1.0.9
// @description  Switch "About me" and "Statistics" in your profile
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile*
// @exclude      *://myanimelist.net/profile/*/*
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13108/MyAnimeList%28MAL%29%20-%20Profile%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/13108/MyAnimeList%28MAL%29%20-%20Profile%20Switch.meta.js
// ==/UserScript==

// solve conflict with navigationbar script
var n = 0;
if (document.getElementById('horiznav_nav') !== null) {
    n = 1;
}

// switch statistics and user information
var profile = document.getElementsByClassName('container-right')[0];
if (profile.innerHTML.indexOf('user-profile-about') > -1) {
    profile = profile.childNodes;
    profile[3+n].parentNode.insertBefore(profile[3+n], profile[0+n]);
}
