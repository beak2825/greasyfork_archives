// ==UserScript==
// @name         Tagpro map stats
// @namespace    https://tagpro.koalabeast.com/
// @version      0.4
// @description  Tagpro map stats duh
// @author       You
// @match        https://tagpro.koalabeast.com/game
// @icon         https://www.google.com/s2/favicons?domain=koalabeast.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423919/Tagpro%20map%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/423919/Tagpro%20map%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForMapname () {
        var waitForLoaded = new MutationObserver(function (mutations) {
            var elem = document.querySelector('#mapInfo');
            if (elem && elem.textContent) {
                waitForLoaded.disconnect();
                var mapname = elem.textContent.match(/Map:\s(.+)\sby/)[1];
                getMapStat(mapname);
            }
        });
        var config = {attributes: true, childList: true, subtree: true};
        waitForLoaded.observe(document.body, config)
    }

    function ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getMapStat(mapname){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var allmaps = JSON.parse(xhttp.responseText);
                var i, maptype;
                for(maptype in allmaps){
                    var maps = allmaps[maptype];
                    for(i in maps){
                        var map = maps[i];
                        if(map.name == mapname){
                            var msg = mapname + " (" + ucfirst(maptype) + " map) / rating: " + map.averageRating + "% / total plays: " + map.totalPlays;
                            // + (i + 1) + ". place in rotation";
                            console.log(msg);
                            setTimeout(function(){
                                tagpro.socket.emit("chat", {
                                    message: msg,
                                    toAll: 1,
                                });
                            }, 8000);
                            return;
                        }
                    }
                }

            }
        };
        xhttp.open("GET", "https://tagpro.koalabeast.com/maps.json", true);
        xhttp.send();
    }

    waitForMapname();

})();
