// ==UserScript==
// @name         ImportChecker
// @namespace    StateV-ImportChecker
// @version      0.2
// @description  Checks Import
// @author       Marvins13
// @match        https://net.statev.de/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390255/ImportChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/390255/ImportChecker.meta.js
// ==/UserScript==

setInterval(() => checkImport(), 10000);

function checkImport(){
    var url = window.location.href;
    if(url.includes('import')){
        var auctions = document.getElementsByClassName('assignment');
        for(var i = 0; i < auctions.length; i++){
            var place = auctions[i].childNodes[1].childNodes[1].childNodes[1].childNodes[1].innerHTML;
            var carName = 'Neon';
            var carPS = '243';
            if(place.includes(carName) /*&& place.includes(carPS)*/){
                var time = new Date();
                var car = place.substring(place.indexOf('class="headerName">') + 19, place.indexOf('PS') + 2)+ ' --- ' + time;
                GM_xmlhttpRequest ( {
                    method:     "POST",
                    url:        "http://localhost:8000/notes",
                    data:       "car=" + car,
                    headers:    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        console.log(response.responseText);
                    },
                    onerror: function(reponse) {
                        console.log("error: ", reponse);
                    }
                });
            }
        }
    }
}