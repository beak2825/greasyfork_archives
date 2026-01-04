// ==UserScript==
// @name         Noxtrip - public script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Stastne a Vesele 2024
// @author       You
// @match        https://www.darkelf.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520357/Noxtrip%20-%20public%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/520357/Noxtrip%20-%20public%20script.meta.js
// ==/UserScript==
// v0.1 Stastne a vesele
(function() {
    'use strict';

    const MAP_CASTING_LS_LANDS = "DE_mapCasting_lands";

    process( );

    function process( ){
        if ( !document.URL.match("https://www.darkelf.cz/magie.asp" )){
            return;
        }
        addHButtonToPlayerCasting( );
    }

    function addHButtonToPlayerCasting( ){
        var selectPlayer = document.getElementsByName("vladce")[0];
        var button = document.createElement('button');
        button.id = 'noxtrip_player_casting_VSK';
        button.onclick = selectPlayerLands;
        button.style.cssText = "margin-top: 5px;"
        button.className = "butt_sml";
        var img = document.createElement('img');
        img.setAttribute("src","images/mapy/but_select.gif");
        img.style.cssText = "max-width: 30px;"
        button.appendChild(img);
        button.onclick = (e) => {
            e.preventDefault();
            selectPlayerLands();
        };
        selectPlayer.parentNode.appendChild(button);
    }

    function selectPlayerLands(){
       var selectPlayer = document.getElementsByName("vladce")[0];
        if (selectPlayer.selectedIndex){
            var player = selectPlayer[selectPlayer.selectedIndex].text.match(".*? \\(")[0];
            player = player.substring(0, player.length - 2);

            getMapPromise(player).then(function(result){
                var mapData = result;
                var lands = mapData.lands;
                if (lands && mapData.leagueId){
                    window.localStorage.setItem(getStorageKeyWithLeague(mapData.leagueId), JSON.stringify({
                        lands,
                        updatedAt: Date.now()
                    }));
                    for (var i = 0; i < window.parent.frames.length ; i++){
                        if ( window.parent.frames[i].name == 'mapa' && window.parent.frames[i].window.location.pathname == "/map_new.asp" ){
                           window.parent.frames[i].window.location.reload();
                        }
                    }
                }
            })
        }else{
            var textAreaMagic = document.getElementById("textAreaMagic");
            var landsTA = textAreaMagic.value.split(',');
            if ( landsTA ){
                getMapPromise(null,landsTA).then(function(result){
                    var mapData = result;
                    var lands = mapData.lands;
                    if (lands && mapData.leagueId){
                        window.localStorage.setItem(getStorageKeyWithLeague(mapData.leagueId), JSON.stringify({
                            lands,
                            updatedAt: Date.now()
                        }));
                        for (var i = 0; i < window.parent.frames.length ; i++){
                            if ( window.parent.frames[i].name == 'mapa' && window.parent.frames[i].window.location.pathname == "/map_new.asp" ){
                                window.parent.frames[i].window.location.reload();
                            }
                        }
                    }
                })

            }

        }
    }

    function getMapPromise(player,lands){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/map_new.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseMap(player,lands,xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseMap(player, lands, httpResponse){
        var map = {
            lands : [],
            leagueId : ''
        }
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');


        if (dom.getElementById("info_text")){
            var leagueName = dom.getElementById("info_text").innerHTML.match("Liga .*?,")[0];
            map.leagueId = leagueName.substring(5, leagueName.length-1);
        }

        var divs = dom.getElementsByTagName("div");
        for (var i = 0; i < divs.length ; i++){
           if (player){
               if ( divs[i].getAttribute("data-player") == player ){
                   map.lands.push([divs[i].getAttribute("data-id"),divs[i].getAttribute("data-name")])
               }
           }else if (lands && divs[i].getAttribute("data-name") ) {
               if ( lands.includes( divs[i].getAttribute("data-name") ) ){
                   map.lands.push([divs[i].getAttribute("data-id"),divs[i].getAttribute("data-name")])
               }
           }
        }
        return map;
    }


    function getStorageKeyWithLeague(leagueId) {
		return `${MAP_CASTING_LS_LANDS}_${leagueId}`;
	}



})();