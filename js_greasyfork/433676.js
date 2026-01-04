// ==UserScript==
// @name        AniDB -> MyAnimelist
// @namespace   Krich
// @match       https://anidb.net/anime/*
// @icon        https://cdn-eu.anidb.net/css/icons/touch/apple-touch-icon.png
// @grant       none
// @version     1.0
// @author      Krich
// @description AniDB to MyAnimelist Redirector
// @downloadURL https://update.greasyfork.org/scripts/433676/AniDB%20-%3E%20MyAnimelist.user.js
// @updateURL https://update.greasyfork.org/scripts/433676/AniDB%20-%3E%20MyAnimelist.meta.js
// ==/UserScript==



var mal = document.getElementsByClassName("i_icon i_resource_mal brand")[0];
mal = mal.getAttribute('href');
location.replace(mal); // load page
