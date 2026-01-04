// ==UserScript==
// @name         Discogs/User/Ratings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       denlekke
// @match        https://www.discogs.com/user/*/ratings
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/405157/DiscogsUserRatings.user.js
// @updateURL https://update.greasyfork.org/scripts/405157/DiscogsUserRatings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    var username = ''
    if(url.includes("user/")){
        username = url.split('user/')[1].split('/ratings')[0];

        console.log(username);
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        "http://denlekke.aphrodite.feralhosting.com:5000/rating?username="+username,
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload:     function (response) {
                //console.log(response);
                //var json = JSON.parse(response);
                var responseJson = JSON.parse(response.responseText);
                var body = document.body;
                body.innerHTML = "";

                var listDiv = document.createElement("div");
                for (var i = 0; i < responseJson.length ; i++){
                    var rating = document.createElement('li');
                    rating.innerHTML = "rating: "+responseJson[i][0]+" link: "+ "release".link("https://www.discogs.com/release/"+responseJson[i][1]);
                    listDiv.appendChild(rating);
                }
                body.appendChild(listDiv);
                console.log(responseJson);
            }
        } );
    }


})();