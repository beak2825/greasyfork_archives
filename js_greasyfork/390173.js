// ==UserScript==
// @name         Lien vers joueurs anonymes
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ajoute un lien vers le palmares d'un joueurs anonyme
// @author       Jrmc
// @match        https://tenup.fft.fr/palmares/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390173/Lien%20vers%20joueurs%20anonymes.user.js
// @updateURL https://update.greasyfork.org/scripts/390173/Lien%20vers%20joueurs%20anonymes.meta.js
// ==/UserScript==

$(document).ready(function() {
        var start = performance.now();

        var url = window.location.href.split('?')[0]; //without get parameters
        var player_id = url.split('/').slice(-1)[0]; // player id
        var cache = getCache(player_id);

        var lines = $("table.dynatable tr");//lines of the palmares table
        var anonymous_players = [];

        lines.each(function( index ) {
            var cells = $(this).children('td');

            var name = cells.first().find('a').html();
            var ranking = cells.eq(2).find('span').html();
            var result = cells.eq(3).find('span').attr('class');
            var name_element = cells.first();
            var year_element = cells.eq(1);

            if(!name && ranking) {
                //check cache first
                if(cache) {
                  var cache_player = cache.find(player => player.hash == [ranking, result].join('-'));
                  if(cache_player) {
                    name_element.html(`<a href="/palmares/${cache_player.id}">${cache_player.name} (Anonyme)</a>`);
                    if(cache_player.yob)
                        year_element.html(`<span class="palmares_match_opponent_birthdate">${cache_player.yob}</span>`);
                    return; //continue
                  }
                }

                anonymous_players.push({
                    ranking: ranking,
                    result: result,
                    name_element: name_element,
                    year_element: year_element,
                })
            }
        });

        if(anonymous_players.length) {
            var simulation_url = 'https://tenup.fft.fr/simulation-classement/' + player_id;

            $.ajax({url: simulation_url, success: function(data){
               var dummy = $('<div></div>');dummy.html(data); //create a dummy element to be parsed later
               var ids = [];

               anonymous_players.forEach(function(player) {
                   var player_id = findPlayer(player);

                   if(player_id) {
                       player.id = player_id
                       ids.push(player.id);
                       findName(player)
                   }
               });

               function findPlayer(player) {
                   var victories = '.victories-part table tr';
                   var defeats = '.defeats-part table tr';

                   var target = player.result == 'victory' ? $(victories, dummy) : $(defeats, dummy);
                   var target_id = false;

                   target.each(function(index) {
                       var cells = $(this).children('td');

                       var id = cells.eq(1).siblings('input').first().val();
                       var name = cells.eq(1).html();
                       var ranking = cells.eq(2).html();

                       if(name == 'Anonyme' && ranking == player.ranking && !ids.includes(id)) {
                           target_id = id;
                           return false; //break out of the loop
                       }
                   });

                   return target_id;
               }
           }});

            function findName(player) {
                var url = 'https://tenup.fft.fr/palmares/' + player.id;

                $.ajax({
                    url: url
                }).done(function(data) {
                    var dummy_palm = $('<div></div>');dummy_palm.html(data); //create a dummy element to be parsed later
                    var name = $('ol.breadcrumb', dummy_palm).children().eq(1).html();

                    player.name_element.html(`<a href="/palmares/${player.id}">${name} (Anonyme)</a>`);

                    var player_light = {
                       ranking: player.ranking,
                       result: player.result,
                       hash: [player.ranking, player.result].join('-'),
                       id: player.id,
                       name: name,
                    }
                    addToCache(player_light, player_id);
                });
            }

    }

    function addToCache(player, palmares_id) { //player object and palmares owner id
      var playerCache = localStorage.getItem('players');
      var players = playerCache ? JSON.parse(playerCache) : {};

      if(!players[palmares_id])
        players[palmares_id] = [];

      players[palmares_id].push(player);
      localStorage.setItem('players', JSON.stringify(players));
    }

    function getCache(palmares_id) { //return cache for current palmares or undefined
       var playerCache = localStorage.getItem('players');
       if(!playerCache)
        return undefined;

      playerCache = JSON.parse(playerCache);
      return playerCache[palmares_id];
    }
});
