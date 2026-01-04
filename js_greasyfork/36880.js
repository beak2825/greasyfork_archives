// ==UserScript==
// @name         kosmiczni.pl-oponent-statistics-plus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  show user's statistic with statistics of the opponent
// @author       dorunallm (dorunallm@gmail.com)
// @match        https://kosmiczni.pl/*/*
// @match        https://*.kosmiczni.pl/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/36880/kosmicznipl-oponent-statistics-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/36880/kosmicznipl-oponent-statistics-plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var game = {
        created: [false, false],
        fields: [
            // level,               power,                 speed,                 endurance,             will,                  ki,                    life
            [ $('span#char_level'), $('span#char_stat_1'), $('span#char_stat_2'), $('span#char_stat_3'), $('span#char_stat_4'), $('span#char_stat_5'), $('b#char_power')    ],
            [ $('b#pd_lvl'),        $('b#pd_a1'),          $('b#pd_a2'),          $('b#pd_a3'),          $('b#pd_a4'),          $('b#pd_a5'),          $('b#pd_power')],
            [ $('b#mob_desc_lvl'),  $('b#mob_desc_a1'),    $('b#mob_desc_a2'),    $('b#mob_desc_a3'),    $('b#mob_desc_a4'),    $('b#mob_desc_a5'),    $('b#mob_desc_power')]
        ]
    };
    game.create = function(mode) {
        if( ! game.created[mode-1] ) {
            $.each(game.fields[mode], function(i, field) {
                $( $('<i>', { id: 'player_' + mode + '_' + i } ) ).insertAfter( field );
            });
            game.created[mode-1] = true;
        }
    };
    game.createGame = function(mode) {
        $.each(game.fields[mode], function(i, field) {
            field.css( { width: 100, display : 'inline-block' } );
        });
        game.fields[mode][0].css("width", (mode == 2) ? "195" : "205");
        game.create(mode);
    };
    game.display = function(mode) {
        $.each(game.fields[0], function(i, field) {
            var user = $(field).text();
            var oponent = $(game.fields[mode][i]).text();
            var value = function(text) {
                return parseFloat( text.replace(/[.]/g, '').replace(/\s/g, '') );
            };
            var css = '';
            var userValue = value( user );
            var oponentValue = value( oponent );
            var text = '';
            if( userValue > oponentValue ) {
                css='green';
                text = '+';
            }else if( userValue < oponentValue ) {
                css='red';
            }
            text+=(userValue-oponentValue).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
            $('i#player_' + mode + '_' + i).text(text).removeClass().addClass( css );
        });
    };
    $(document).on('click', function(event) {
        var target = $( event.target );
        if ( target.is( "button.common_mob_info,i.in,img,a.info" ) ) {
            setTimeout(function() {
                game.createGame(2);
                if( $('div#mob_desc_con:visible').size() > 0 ) {
                    game.display(2);
                }
            }, 1000);
        }else if( target.is('strong.player_rank0') ) {
            setTimeout(function() {
                game.createGame(1);
                if( $('div#player_desc_con:visible').size() > 0 ) {
                    game.display(1);
                }
            }, 1000);
        }
    });

})();