// ==UserScript==
// @name         GGn search Google Images and Mobygames for cover
// @namespace    http://tampermonkey.net/
// @description  Add a small link on edit desctiption page to search in google images for vertical picrures >2MP and: "Game Name" cover on google, and a link to mobygames for the game
// @include      https://gazellegames.net/torrents.php?action=editgroup*
// @version      1.0
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        M_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/37980/GGn%20search%20Google%20Images%20and%20Mobygames%20for%20cover.user.js
// @updateURL https://update.greasyfork.org/scripts/37980/GGn%20search%20Google%20Images%20and%20Mobygames%20for%20cover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name_google = $('input[name="name"]').val().replace(/ /g, "+");
    var name_moby = $('input[name="name"]').val().replace(/ /g, "-");
    var href_google = 'https://www.google.ru/search?newwindow=1&as_st=y&hl=ru&tbs=isz%3Alt%2Cislt%3A2mp%2Ciar%3At&tbm=isch&sa=1&ei=za1vWt3MJ-2KmgWCypKIAQ&q=%22'+name_google+'%22+cover';
    var href_moby = 'http://www.mobygames.com/game/'+name_moby+'/cover-art'
    $('<span>    </span><a href="'+href_google+'" target="_blank">Google</a> |\
      <a href="'+href_moby+'" target="_blank">Mobygames</a>').insertAfter('h3:contains("Image") + span input + input*');
})();