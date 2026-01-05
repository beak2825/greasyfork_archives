// ==UserScript==
// @name         MovieChat.org - Remove 'Recommended For You' ads
// @version      1.00
// @description  Remove 'Recommended For You' ads on MovieChat.org
// @author       RandomUsername404
// @match        https://moviechat.org/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @grant        none
// @icon         http://moviechat.org/favicons/favicon.ico
// @namespace    https://greasyfork.org/users/105361
// @downloadURL https://update.greasyfork.org/scripts/29811/MovieChatorg%20-%20Remove%20%27Recommended%20For%20You%27%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/29811/MovieChatorg%20-%20Remove%20%27Recommended%20For%20You%27%20ads.meta.js
// ==/UserScript==

$(document).ready(function() {   

    $("#rcjsload_358172").hide();

})();