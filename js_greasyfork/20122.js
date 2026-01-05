// ==UserScript==
// @name         KAT Meta Integration
// @namespace    pxgamer
// @version      0.5
// @description  Adds a KAT link to other sites using KAT.
// @author       pxgamer
// @include      *giantbomb.com/*/3030-*
// @include      *imdb.com/title/tt*
// @include      *trakt.tv/movies/*
// @include      *trakt.tv/shows/*
// @include      *anidb.net/perl-bin/animedb.pl?show=anime&aid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20122/KAT%20Meta%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/20122/KAT%20Meta%20Integration.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    var kt = {};

    kt = {
        init: function() {
            kt.cor = false;
            kt.isValid = false;
            kt.url = location.href;
            if (kt.url.indexOf('giantbomb.com/') > -1) {
                kt.glin = 'https://kat.cr/g-g';
                kt.gurl = kt.url.split('/')[4].split('-')[1];
                kt.kurl = kt.glin + kt.gurl + '/';
                kt.cor  = true;
            }
            else if (kt.url.indexOf('imdb.com/') > -1) {
                kt.glin = 'https://kat.cr/i-i';
                kt.gurl = kt.url.split('/')[4].split('tt')[1];
                kt.kurl = kt.glin + kt.gurl + '/';
                kt.cor  = true;
            }
            else if (kt.url.indexOf('trakt.tv/') > -1) {
                if (kt.url.indexOf('/movies/') > -1) {
                    kt.glin = 'https://kat.cr/i-i';
                }
                else if (kt.url.indexOf('/shows/') > -1) {
                    kt.glin = 'https://kat.cr/i-tv';
                }

                if ($('h1').text().indexOf('Movies') == -1 && $('h1').text().indexOf('Shows') == -1) {
                    kt.isValid = true;
                }

                if (kt.isValid) {
                    kt.gurl = $('div.sidebar ul.external li a[href^="http://www.imdb.com/"]').attr('href').split('/')[4].split('tt')[1];
                    kt.kurl = kt.glin + kt.gurl + '/';
                    kt.cor  = true;
                }
            }
            else if (kt.url.indexOf('anidb.net/') > -1) {
                if (kt.url.indexOf('show=anime&aid=') > -1) {
                    kt.glin = 'https://kat.cr/i-a';
                    kt.gurl = kt.url.split('&aid=')[1];
                    kt.kurl = kt.glin + kt.gurl + '/';
                    kt.cor  = true;
                }
            }
            else {kt.cor = false;}

            if (kt.checkAvail()) {
                if (kt.cor) {
                    kt.addFeatures();
                }
            }
        },
        addFeatures: function() {
            if (kt.url.indexOf('giantbomb.com/') > -1) {
                $('ul.system-list').append('<li class="system"><a href="'+kt.kurl+'" target="_blank"><img src="https://pximg.xyz/images/377713844639dbc0456d2dfd483d8f13.png"/></a></li>');
            }
            else if (kt.url.indexOf('imdb.com/') > -1) {
                $('.winner-option.watch-option').after('<div class="watch-option secondary-watch-option blueBadgeImdb"><a href="'+kt.kurl+'" target="_blank">\
<div class=""><img src="https://pximg.xyz/images/8fbebe200ba1c18b65ab0a6374ea5d7b.png" style="width: 34px; height: 30px;" /></div>\
<div class="secondary-info">ON&nbsp;KAT</div>\
</a></div>');
                $( "div.blueBadgeImdb" ).hover(
                    function() {
                        $( this ).css( 'background', '#136CB2' );
                    },
                    function() {
                        $( this ).css( 'background', '#EEEEEE' );
                    }
                );
            }
            else if (kt.url.indexOf('trakt.tv/') > -1) {
                $('div.sidebar ul.external').append('<li><a target="_blank" href="'+kt.kurl+'">Kickass<div class="fa fa-external-link"></div></a></li>');
            }
            else if (kt.url.indexOf('anidb.net/') > -1) {
                $('#tabbed_pane ul.tabs li.save_as_default.tab.fake').before('<li class="tab" style="margin-right: 5px;"><a target="_blank" href="'+kt.kurl+'" style="color: black;">Kickass</a></li>');
            }
            else {}
        },
        checkAvail: function() {
            // REMOVE THIS LATER
            //return true;
            var returnedData;
            $.ajax({
                type: "GET",
                url: kt.kurl,
                async: false,
                success: function (data) {
                    returnedData = data;
                },
                returnData: "json"
            });
            if (returnedData.indexOf('<div class="errorpage">') == -1) {
                return true;
            }
            return false;
        }
    };

    kt.init();

    console.info(kt);
})();
