// ==UserScript==
// @name         Ikariam - Check island slots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ikariam - Check slot availability on a specific Island
// @author       Skillz0r
// @match        *://*.ikariam.gameforge.com/?view=worldmap_iso*
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/421573/Ikariam%20-%20Check%20island%20slots.user.js
// @updateURL https://update.greasyfork.org/scripts/421573/Ikariam%20-%20Check%20island%20slots.meta.js
// ==/UserScript==
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js


(function() {
    'use strict';
    var cities = [];
    cities.push({"name":'Riloos [49:52]', "max_slots": 17});
    cities.push({"name":'Zuneos [50:51]', "max_slots": 17});

    setTimeout( function () {
        for(var i = 0; i < cities.length; i++){
            var diff = cities[i].max_slots - parseInt($(".islandTile[title='" + cities[i].name + "']").find(".cities").html());
            if(diff > 0){
                var id = $(".islandTile[title='" + cities[i].name + "']").find(".linkurl").attr('id');
                GM_notification ( {title: 'Slot avaliable',
                                   image: 'https://www.mmos.com.br/f/2016/01/ikariam-1.jpg',
                                   text: diff + " slot(s) available on " + cities[i].name,
                                   onclick: function(event){
                                       document.getElementById(id).click();
                                       location.href = document.getElementById(id).getAttribute("href");
                                   }
                                  } );
                clearTimeout(timeOut);
            }
        }
    }, 500);

    var timeOut = setTimeout( function () {
        location.reload();
    },30000 );

})();