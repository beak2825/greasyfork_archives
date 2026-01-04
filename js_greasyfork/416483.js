// ==UserScript==
// @name         Mini episode view TVTime.com
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      0.1
// @description  Affiche un apercu de l'image de l'episode
// @author       Hoax017
// @match        https://www.tvtime.com/fr/show/*/episode/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416483/Mini%20episode%20view%20TVTimecom.user.js
// @updateURL https://update.greasyfork.org/scripts/416483/Mini%20episode%20view%20TVTimecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

   $("div.episode-infos.extended").append($("<img style='height:100px' src='"+$(".banner-image img").attr("src")+"'>"))
})();