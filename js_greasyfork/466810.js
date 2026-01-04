// ==UserScript==
// @name        Anime history on page
// @namespace   https://myanimelist.net/
// @description Modal tier list using MAL api
// @author      elpo
// @match       https://myanimelist.net/anime/*
// @match       https://myanimelist.net/anime.php?id=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant GM.log
// @version 1
// @license GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/466810/Anime%20history%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/466810/Anime%20history%20on%20page.meta.js
// ==/UserScript==
//GM_addStyle( "#toggle-episode-history, .history {padding: 8px 10px;}");
(function() {
    'use strict';

    $(document).ready(function()
                      {
        const url = location.href; //Create a new global variable to detect the url
        let anime_id;
        if(url.split("anime.php?id=").length > 1){
            anime_id = url.split("anime.php?id=")[1];
        }else{
            anime_id = url.split("/")[4];
        }

        let clicked =false;
        $('[itemprop="description"]').prev().prev().append($(`<button class="inputButton btn-middle flat js-anime-update-button" id=toggle-episode-history>Toggle Episode History</button>`).click(function(){
            if(!clicked){
                $.ajax ( {
                    type:       'GET',
                    url:        `https://myanimelist.net/ajaxtb.php?keepThis=true&detailedaid=${anime_id}&TB_iframe=true&height=420&width=390`,
                    dataType:   'html',
                    success:    function (response) {
                        const parser = new DOMParser();
                        const html = parser.parseFromString(response, 'text/html');
                        let history = html.getElementById('eplayer');
                        GM.log(history.innerHTML);

                        $('[itemprop="description"]').prev().prev().append($(`<div class=history id=episode-history>${history.innerHTML}</div>`));

                    }
                } );
            }
            clicked = true;
            $(".history").toggle();
        }));


    });
})();