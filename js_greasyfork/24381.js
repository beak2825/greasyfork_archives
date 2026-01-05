// ==UserScript==
// @name         Add Futbin button on Futhead Player page
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show Futbin Link and Price on FutHead Player page
// @author       Syntaxlb
// @match        http://www.futhead.com/17/*/*
// @match        http://www.futhead.com/squad-building-challenges/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24381/Add%20Futbin%20button%20on%20Futhead%20Player%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/24381/Add%20Futbin%20button%20on%20Futhead%20Player%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';


    
	function processFutbin()
    {

        var search = $('.font-16.fh-red a').text();

        var rating = $('.player-cards > .playercard .playercard-rating').text();
        var position = $('.player-cards > .playercard .playercard-position').text();
        
        var url = 'http://xbox-store-checker.com/fr/fut/api/futbin.json';
        
		$.ajax({
			url: url,
            async: true,
			dataType: 'json',
			data: 'name=' + search + '&rating=' + rating + '&position=' + position,
			type: 'get',
            crossDomain: true,
			success: function (data){
				
                var buttonFutbin = $('<a></a>').attr('class', 'btn btn-futhead btn-full').attr('href', data.url).attr('target', '_blank').text(search + ' sur FUTBIN');
                buttonFutbin.insertBefore($('.new-topic.btn-futhead'));
                
                $('.ps-bin-band span').text(data.price_ps);
                $('.xb-bin-band span').text(data.price_xbox);
                
			},
			error: function(e, textStatus)
			{
                console.log('error');
				// console.log(e);
                // console.log(textStatus);
			}
		});
        
    }

    function processFutbinPlayers()
    {

        var players = $('.player-group-table li');
        
        var arrNames = [];
        var arrPositions = [];
        var arrRatings = [];

        var url = 'http://xbox-store-checker.com/fr/fut/api/futbin.json';
        var nbPlayer = 0;
        
        $(players).each(function (){
            if ($(this).find('.player-name').text() !== '') nbPlayer = nbPlayer + 1;
        });
        
        $('#show-price-playerlist').text('Récupèration des prix en cours...');

        $(players).each(function (){
            var name = $(this).find('.player-name').text();
            var position = $(this).find('.player-club-league-name > strong').text();
            var rating = $(this).find('.player-rating span').text();
            
            var player = $(this);
            if (name !== '')
            {
                
                $.ajax({
                    url: url,
                    async: true,
                    dataType: 'json',
                    data: 'name=' + name + '&rating=' + rating + '&position=' + position,
                    type: 'get',
                    crossDomain: true,
                    success: function (data){
                        nbPlayer = nbPlayer - 1;
                        if (nbPlayer === 0)
                        {
                            $('#show-price-playerlist').text('Récupèration des prix terminée');   
                        }
                        $(player).find('.price-platform-target[data-platform="xb"]').text(data.price_xbox);
                        $(player).find('.price-platform-target[data-platform="ps"]').text(data.price_ps);
                    },
                    error: function(e, textStatus)
                    {
                        console.log('error');
                        // console.log(e);
                        // console.log(textStatus);
                    }
                });
            }
            
        });
    }
    
    
    
        // Player Page
    if ($('.font-16.fh-red a').length > 0)
    {
        processFutbin();
    }
    
    // Squad Page
    if ($('#squad').length > 0)
    {
        var squadUrl = $('meta[property="og:url"]').attr('content');
        var squadPriceUrl = 'http://xbox-store-checker.com/fr/futhead-price?squadId='+squadUrl;
        var buttonSquadPrice = $('<a></a>').attr('class', 'btn btn-futhead btn-full').attr('href', squadPriceUrl).attr('target', '_blank').text('Squad Price Calculator');
        buttonSquadPrice.prependTo($('.main-content > .row > .col-rigid-300'));
    }
    
    // Players list Page
    if ($('.player-group-table').length > 0)
    {
        var buttonPlayersListPrice = $('<a></a>').attr('class', 'btn btn-futhead btn-full').attr('id', 'show-price-playerlist').attr('href', '#').text('Voir les prix');
        buttonPlayersListPrice.prependTo($('.main-content > .row > .col-rigid-300'));
        
        $('body').on('click', '#show-price-playerlist', function(e) {
            e.preventDefault();
            processFutbinPlayers();
            return false;
        });
    }
    

    
})();