// ==UserScript==
    // @name Porn to torrent auto search
    // @description      Add small buttons on many porn pages to search for the movie's title or performer on 3 torrent sites. Based on 'IMDB to RARBG Torrent Search' from nickpapoutsis.
    // @namespace        Kinder Way
    // @author           Kinder Way
    // @license          Creative Commons Attribution Non Commercial Share Alike 4.0 International (CC BY-NC-SA 4.0)
    // @include          https://bangbros.com/*
    // @include          https://www.pervmom.com/*
    // @include          https://pornpros.com/*
    // @include          https://www.mofos.com/*
    // @include          https://www.teamskeet.com/*
    // @include          https://www.brazzers.com/*
    // @include          https://tour.nympho.com/*
    // @include          https://tour.trueanal.com/*
    // @include          https://tour.analonly.com/*
    // @include          https://tour.allanal.com/*
    // @include         https://www.mylf.com/*
    // @include          https://teamskeet.com/*
    // @include          https://tiny4k.com/*
    // @include          https://lubed.com/*
    // @include          https://cum4k.com/*
    // @include          https://exotic4k.com/*
    // @include https://nubiles-porn.com/*
    // @include https://www.realitykings.com/*
    // @include https://povd.com/*
    // @include https://www.milfed.com/*
    // @include https://momlover.com/*
    // @include https://www.sislovesme.com/*
    // @include https://www.dadcrush.com/*
    // @include https://povd.com/*
    // @include https://theporndb.net/*
// @include https://dirtyauditions.com/*
// @include https://www.bang.com/*
// @include https://jayspov.net/*
// @include https://holed.com/*
// @include https://anal4k.com/*
// @include https://www.naughtyamerica.com/*
// @include https://www.mrluckypov.com/*
// @include https://inserted.com/*
// @include https://pervcity.com/*
// @include https://www.tushyraw.com/*
// @include https://girlcum.com/*
// @include https://www.propertysex.com/*

    //
    // @version          2.3.1
    // @contributionURL  https://www.paypal.com/donate/?cmd=_donations&business=kinderway4@gmail.com&item_name=Greasy+Fork+donation&Z3JncnB0=
// @downloadURL https://update.greasyfork.org/scripts/429710/Porn%20to%20torrent%20auto%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/429710/Porn%20to%20torrent%20auto%20search.meta.js
    // ==/UserScript==





    (function() {
        'use strict';



      getMovieId();


        if (movieId) {

            let divT = document.createElement('divT');
            divT.innerHTML = '<a id="1337x">1337x</a>';
            divT.style.display = "inline-block";
            divT.style.position = "fixed";
            divT.style.left = "1%";
            divT.style.top = "10%";
            divT.style.zIndex = '9999';
            document.body.append(divT);

            let iconT = document.getElementById('1337x');
            iconT.style.background = 'white';
            iconT.style.color = 'blue';
            iconT.style.fontWeight = '800';
            iconT.style.padding = '5px';
            iconT.style.border = 'solid 2px black';
            iconT.style.borderRadius = '7px';
            iconT.style.textDecoration = 'none';
            iconT.style.fontSize = '0.8em';
            iconT.href = 'https://1337x.to/sort-search/' + movieId + '/time/desc/1/';
            iconT.target = '_blank';

            let divG = document.createElement('divG');
            divG.innerHTML = '<a id="galaxy">GALAXY</a>';
            divG.style.display = "inline-block";
            divG.style.position = "fixed";
            divG.style.left = "1%";
            divG.style.top = "12%";
            divG.style.zIndex = '9999';
            document.body.append(divG);

            let iconG = document.getElementById('galaxy');
            iconG.style.background = 'white';
            iconG.style.color = 'blue';
            iconG.style.fontWeight = '800';
            iconG.style.padding = '5px';
            iconG.style.border = 'solid 2px black';
            iconG.style.borderRadius = '7px';
            iconG.style.textDecoration = 'none';
            iconG.style.fontSize = '0.8em';
            iconG.href = 'https://torrentgalaxy.to/torrents.php?search=+' + movieId + '&sort=id&sort=id&order=desc';
            iconG.target = '_blank';



            let divK = document.createElement('divK');
            divK.innerHTML = '<a id="KNABEN">KNABEN</a>';
            divK.style.display = "inline-block";
            divK.style.position = "fixed";
            divK.style.left = "1%";
            divK.style.top = "14%";
            divK.style.zIndex = '9999';
            document.body.append(divK);

            let iconK = document.getElementById('KNABEN');
            iconK.style.background = 'white';
            iconK.style.color = 'blue';
            iconK.style.fontWeight = '800';
            iconK.style.padding = '5px';
            iconK.style.border = 'solid 2px black';
            iconK.style.borderRadius = '7px';
            iconK.style.textDecoration = 'none';
            iconK.style.fontSize = '0.8em';
            iconK.href = 'https://knaben.org/search/' + movieId + '/5000000/1/date';
            iconK.target = '_blank';

          let divE = document.createElement('divE');
            divE.innerHTML = '<a id="EXT">EXT</a>';
            divE.style.display = "inline-block";
            divE.style.position = "fixed";
            divE.style.left = "1%";
            divE.style.top = "16%";
            divE.style.zIndex = '9999';
            document.body.append(divE);

            let iconE = document.getElementById('EXT');
            iconE.style.background = 'white';
            iconE.style.color = 'blue';
            iconE.style.fontWeight = '800';
            iconE.style.padding = '5px';
            iconE.style.border = 'solid 2px black';
            iconE.style.borderRadius = '7px';
            iconE.style.textDecoration = 'none';
            iconE.style.fontSize = '0.8em';
            iconE.href = 'https://ext.to/search/?order=age&sort=desc&q=' + movieId + '&c=xxx';
            iconE.target = '_blank';

let divP = document.createElement('divP');
            divP.innerHTML = '<a id="pornrips">pornrips</a>';
            divP.style.display = "inline-block";
            divP.style.position = "fixed";
            divP.style.left = "1%";
            divP.style.top = "18%";
            divP.style.zIndex = '9999';
            document.body.append(divP);

            let iconP = document.getElementById('pornrips');
            iconP.style.background = 'white';
            iconP.style.color = 'blue';
            iconP.style.fontWeight = '800';
            iconP.style.padding = '5px';
            iconP.style.border = 'solid 2px black';
            iconP.style.borderRadius = '7px';
            iconP.style.textDecoration = 'none';
            iconP.style.fontSize = '0.8em';
            iconP.href = 'https://pornrips.to/?s=' + movieId;
            iconP.target = '_blank';

let divxc = document.createElement('divxc');
            divxc.innerHTML = '<a id="xclub">xclub</a>';
            divxc.style.display = "inline-block";
            divxc.style.position = "fixed";
            divxc.style.left = "1%";
            divxc.style.top = "20%";
            divxc.style.zIndex = '9999';
            document.body.append(divxc);

            let iconxc = document.getElementById('xclub');
            iconxc.style.background = 'white';
            iconxc.style.color = 'blue';
            iconxc.style.fontWeight = '800';
            iconxc.style.padding = '5px';
            iconxc.style.border = 'solid 2px black';
            iconxc.style.borderRadius = '7px';
            iconxc.style.textDecoration = 'none';
            iconxc.style.fontSize = '0.8em';
            iconxc.href = 'https://xxxclub.to/torrents/browse/all/' + movieId + '?sort=uploaded&order=desc';
            iconxc.target = '_blank';


let divph = document.createElement('divph');
            divph.innerHTML = '<a id="pornhoader">pornhoader</a>';
            divph.style.display = "inline-block";
            divph.style.position = "fixed";
            divph.style.left = "1%";
            divph.style.top = "22%";
            divph.style.zIndex = '9999';
            document.body.append(divph);

            let iconph = document.getElementById('pornhoader');
            iconph.style.background = 'white';
            iconph.style.color = 'blue';
            iconph.style.fontWeight = '800';
            iconph.style.padding = '5px';
            iconph.style.border = 'solid 2px black';
            iconph.style.borderRadius = '7px';
            iconph.style.textDecoration = 'none';
            iconph.style.fontSize = '0.8em';
            iconph.href = 'https://pornhoarder.tv/search/?search=' + movieId + '&sort=0&date=0';
            iconph.target = '_blank';

        }

        var movieId;

        function getMovieId() {
        let arr = window.location.pathname;
          let i = arr.length-1;


                  for (let j = i; j>1; j--){

             if( arr[j]=='/'){
              movieId = arr.substring(j+1).replace(/-/gi,' ');
               j=0;

              }
        }

        }




})();

