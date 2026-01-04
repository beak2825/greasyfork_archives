// ==UserScript==
// @name         Facebook AdBlock
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Elimina la publicidad de Facebook
// @author       Leg-ion
// @match        https://www.facebook.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391103/Facebook%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/391103/Facebook%20AdBlock.meta.js
// ==/UserScript==

var publicidad = ['The Jerry Can Bar Europe','Amazon Flex España','StarVegas','Halls','Secretos De Mezcla','888casino'];
var pos;

const trimAds = () => {

    var feeds = document.getElementById('contentArea').querySelectorAll('[id*=hyperfeed_story_id]');
    for (var i = 0; i < feeds.length; i++)
    {
        var hs = feeds[i].getElementsByTagName("h5");
        var as = hs[0].getElementsByTagName("a");
        for (var j = 0; j < publicidad.length; j++)
        {
            pos = as[0].innerHTML.indexOf(publicidad[j]);
            if (pos != -1)
            {
                feeds[i].style.display = "none";
                break;
            }
        }
    }
}

(function() {
    window.addEventListener('scroll', () => {
        setTimeout(trimAds, 1000);
    });
})();