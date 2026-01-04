// ==UserScript==
// @name         TILT Gaming Tournaments reskin
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Reskin of default Challonge theme build specific for TILT Quake Poland Tournaments
// @author       Eryk Wróbel
// @match        https://challonge.com/pl/*tilt*
// @match        https://challonge.com/*tilt*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=challonge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456574/TILT%20Gaming%20Tournaments%20reskin.user.js
// @updateURL https://update.greasyfork.org/scripts/456574/TILT%20Gaming%20Tournaments%20reskin.meta.js
// ==/UserScript==

// change log
// v 0.1.2 - fixed bug with "contains" in url
// v 0.1.1 - bigger paddings on module section & removed overflow. Added another match settings for easier navs.
// v 0.1 - start of the script


(function() {
    'use strict';

    // pallete

    var light = '#1b222c';
    var dark = '#12151c';
    var neutral = '#191d26';
    var lred = '#852122';
    var dred = '#701416';
    var orange = '#ff7324';
    var blue = '#135b9e';

    var lighto = '#1b222ce4';
    var darko = '#12151ce4';
    var neutralo = '#191d26e4';
    var lredo = '#661b1ce8';
    var dredo = '#531516e8';

    var blighter = '#ffffff0d';
    var bdarker = '#00000040';

    var text = '#D8D8D8';
    var anchor = '#fff';
    var header = '';
    var font = 'Teko';

    var box_shadow = '0 1px 2px rgb(0 0 0 / 8%), 0 2px 4px rgb(0 0 0 / 6%), 0 4px 8px rgb(0 0 0 / 6%), 0 8px 16px rgb(0 0 0 / 13%), 0 16px 32px rgb(0 0 0 / 21%)';
    var drop_shadow = 'drop-shadow(0 1px 2px rgb(0 0 0 / 8%)) drop-shadow(0 2px 4px rgb(0 0 0 / 6%)), drop-shadow(0 4px 8px rgb(0 0 0 / 6%)), drop-shadow(0 8px 16px rgb(0 0 0 / 13%)), drop-shadow(0 16px 32px rgb(0 0 0 / 21%));';

    var bg_image = 'https://cdn.discordapp.com/attachments/829686766910963752/1052549523827855471/sorlag.jpg';
    // regular will all champs for tournaments different then Xmas
    //var bg_image_bottom = 'https://cdn.discordapp.com/attachments/829686766910963752/1052549494199300116/all_champs.jpg';
    var bg_image_bottom = 'https://cdn.discordapp.com/attachments/1035121885186359386/1048232300678234143/1514372074_20171226203221_1_2.jpg';

    var tilt_logo = '<img src="https://tiltgaming.pl/wp-content/uploads/2022/10/TILT%E2%84%A2-Black-Logo.png" id="tilt_logo">';


    $('document').ready(function() {

        var img_file = new Image();
        img_file.src = bg_image;

        $(img_file).on('load', function() {
            $('.cover > .image').attr('src', '').css(
                {
                    'height':  img_file.height,
                    'background-repeat': 'no-repeat',
                    'background-color': dred,
                    'width': '100%',
                    'background-position': 'center top',
                    'background-image': 'linear-gradient(0deg, rgb(112, 20, 22) 0%, rgba(112, 20, 22, 0) 50%, rgba(112, 20, 22, 0) 100%), url("'+bg_image+'")',
                    'display': 'block'
                }
            );

            $('#registration').css({
                'background': darko,
                'backdrop-filter': 'blur(3px)'
            });


            $('body').css(
                {
                    'text-shadow': '-1px 2px 3px #000000ab',
                    'background-color': dred
                }
            );

            $('.default-nav').css(
                {
                    'background-color': '#000000bf',
                    'backdrop-filter': 'blur(5px)',
                    'border-bottom': '1px solid #00000033'
                }
            );

            $('.fyi, ul.group-nav').css(
                {
                    'background': darko,
                    'backdrop-filter': 'blur(3px)'
                }
            );

            $('body').on('ready', '#registration', function() {
                    $(this).css({
                        'background': darko,
                        'backdrop-filter': 'blur(3px)'
                    })
                }
            );

            $('.striped-table').css('background-color', dred);
            $('.striped-table.-light>tbody>tr:nth-child(odd)').css('background-color', 'unset');
            $('.striped-table.-light>tbody>tr:nth-child(even)').css('background-color', bdarker);
            $('.standings-container').css('padding', '13px');
            $('.bracket-line').css('stroke', orange);
            $('.match--identifier').css(
                {
                    'fill': '#c6201c',
                    'font-size': '11px'
                }
            );

            $('.search-bar').css(
                {
                    'background-color': '#ffffff13',
                    'border': '1px solid #00000033'
                }
            );

            $('.cover').insertBefore($('.tournament-banner')).css(
                {
                    'position':'absolute',
                    'z-index': -1,
                    'top': 0,
                    'width':'100%',
                    'height': 'auto'

                }
            );

            $('.tournament-banner').css(
                {
                    'background-color': dredo,
                    'backdrop-filter': 'blur(3px)',
                    'box-shadow': box_shadow
                }
            );

            $('.tournament-description').css(
                {
                    'backdrop-filter' : 'blur(3px)',
                    'background-color' : darko,
                    'border-left' : '3px solid ' + orange
                }
            );

            $('.default-panel.-dark').css(
                {
                    'background-color': darko
                }
            );

            $('.winner-card').css(
                {
                    'background-color': bdarker,
                    'box-shadow': box_shadow
                }
            );

            $('.btn-light-default').css(
                {
                    'background-color': dred,
                    'box-shadow': box_shadow,
                    'border-color': lred
                }
            );

            $('.footer-public').css(
                {
                    'background-color': dark
                }
            );

            $('.sticky-nav').css(
                {
                    'background-color': dred,
                    'box-shadow': box_shadow
                }
            );

            $('.full-screen-target').css(
                {
                    'background-image': ' linear-gradient(rgba(0,0,0,0.95), rgba(112,20,22,0.5)),  url("'+ bg_image_bottom +'")',
                    'background-size': 'cover',
                    'background-color': darko,
                    'box-shadow': box_shadow,
                    'background-repeat': 'no-repeat'

                }
            );

            $('.round-label text.round-label--best-of').css(
                {
                    'fill': orange
                }
            );

            $('.match--player-background').css(
                {
                    'fill': '#0d0202'
                }
            );

            $('.match--seed-background').css(
                {
                    'fill': '#250404'
                }
            );

            $('.match--seed').css(
                {
                    'fill': '#fff'
                }
            );

            $('.match--base-background').css(
                {
                    'fill': lighto
                }
            );

            $('.match--player-divider').css(
                {
                    'stroke': lighto
                }
            );

            $('.match').css(
                {
                    'filter': 'drop-shadow(0 0 1px rgba(255,255,255,0.1)) drop-shadow(rgba(0, 0, 0, 0.75) 2px 4px 6px) drop-shadow(rgba(0, 0, 0, 0.25) 2px 4px 9px)'
                }
            );

            $('.match--player-score').css(
                {
                    'fill': '#000000',
                    'font-weight': 'bold'
                }
            );

            $(' .match--player-score-background').css(
                {
                    'fill': '#ffffff1f00000'
                }
            );

            $('.content-wrapper.-with-ads').css(
                {
                    'padding': '0',
                }
            );

            if (window.location.href.includes('module')) {
                $('body .nav-spacer').css(
                    {
                        'height': '45px'
                    }
                );

                $('.tournament-bracket').css(
                    {
                        'overflow': 'unset'
                    }
                );
            }

        });
    });
})();