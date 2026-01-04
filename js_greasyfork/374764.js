// ==UserScript==
// @name         Youtube exact upload
// @namespace    youtube-exact-upload
// @version      0.2
// @description  Adds exact upload time to youtube videos
// @author       theo0165
// @source       https://github.com/theo0165/youtube-exact-upload
// @website      https://github.com/theo0165
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374764/Youtube%20exact%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/374764/Youtube%20exact%20upload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var YT_API_KEY = "";

    console.log("YT EXACT UPLOAD LOADED");

    var BASE_URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=" + YT_API_KEY;

    function genUrl(){
        const urlParams = new URLSearchParams(window.location.search);

        if(urlParams.get("v") != null){
            return BASE_URL + "&id=" + urlParams.get("v");
        }else {
            return "";
        }
    }

    function parseDate(date){
        var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        return date.getDate() + " " + months[date.getMonth()] + ". " + date.getFullYear() + " " + (date.getHours() < 10 ? date.getHours() + "0" : date.getHours()) + ":" + (date.getMinutes() < 10 ? date.getMinutes() + "0" : date.getMinutes());
    }

    if(YT_API_KEY != "" || typeof YT_API_KEY != "undefined"){
        var url = genUrl();

        if(url != ""){
            fetch(url)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                if(data.pageInfo.totalResults > 0){
                    var element = document.querySelector(".date");
                    var date = new Date(data.items[0].snippet.publishedAt);

                    element.innerHTML = "Published at " + parseDate(date);
                }
            })
            .catch(error => console.error("YOUTUBE EXACT UPLOAD ERROR: " + error, "\nINVALID API KEY?"))
        }
    }else{
        console.error("YOUTUBE EXACT UPLOAD ERROR: Undefined api key");
    }
})();