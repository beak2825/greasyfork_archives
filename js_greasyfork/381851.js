// ==UserScript==
// @name         Nombre Connectés couleur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/381851/Nombre%20Connect%C3%A9s%20couleur.user.js
// @updateURL https://update.greasyfork.org/scripts/381851/Nombre%20Connect%C3%A9s%20couleur.meta.js
// ==/UserScript==

var $ = window.jQuery;
(function() {
    'use strict';

     const topics = $(".topic-list li[data-id]");
     const topic_urls = topics.find(".topic-title");

     topics.map(function(i,topic){
        const topic_url = $(topic).find(".topic-title")[0].href;
        const topic_id = $(topic).attr('data-id');

        $.get(topic_url, function(data, status){
            const topic_page = $(data);
            const nb_connectes = topic_page.find('.nb-connect-fofo').text().replace("connecté(s)","");

            const topic_page_id = topic_page.find('#bloc-formulaire-forum').attr('data-topic-id');

            const topic_to_update = $(".topic-list li[data-id="+topic_page_id+"]");
            const topic_select = topic_to_update.find(".topic-select");
            //topic_select.text(topic_select.text() + nb_connectes);
            let nb_connectes_color;
            if(nb_connectes > 100) {
                nb_connectes_color = "#ec4f4c";
            } else if(nb_connectes > 50) {
                nb_connectes_color = "#f9a84d";
            } else {
                nb_connectes_color = "#00cfa9";
            }
            $(topic_select).append("<span>"+nb_connectes+"</span>").css({color: nb_connectes_color, fontWeight: 400});

        });

     });

})();