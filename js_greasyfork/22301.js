// ==UserScript==
// @name         MyDealz Embedded Youtube Urls
// @namespace    http://www.mydealz.de/profile/richi2k
// @version      0.2
// @description  Adds functionallity to turn plain youtube urls into embedded videos on mydealz.de 
// @author       richi2k
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22301/MyDealz%20Embedded%20Youtube%20Urls.user.js
// @updateURL https://update.greasyfork.org/scripts/22301/MyDealz%20Embedded%20Youtube%20Urls.meta.js
// ==/UserScript==

function isYoutubeUrl(url) 
{
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
function getYoutubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2]) {
        return match[2];
    } else {
        return 'error';
    }
}

(function() {
    'use strict';
    
    $(".bbcode_url").each(function(){
        if(isYoutubeUrl($(this).attr("href")))
        {
            $(this).replaceWith(function(){
               return '<div><iframe width="400" height="200" src="https://www.youtube.com/embed/' + getYoutubeId( $(this).attr("href") ) + '" frameborder="0" allowfullscreen></iframe></div>'; 
            });
        }
    });
    
})();