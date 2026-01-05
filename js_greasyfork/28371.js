// ==UserScript==
// @name         CouchPotato Script Injector
// @namespace    http://www.tampermonkey.net
// @version      0.1
// @description  Injects the CouchPotato automation script on IMDB movie pages
// @author       GCandez
// @match        http://www.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28371/CouchPotato%20Script%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/28371/CouchPotato%20Script%20Injector.meta.js
// ==/UserScript==

//CONFIGURATION


var apiAdress = ''; //The adress for the CouchPotato API (e.g. http://localhost:8080/api)
var apiKey = ''; //The key for the CouchPotato API


(function(){
    //CHECK IF CURRENT PAGE IS MOVIE PAGE
    var element = document.querySelector('meta[property="og:type"]');
    var content = element && element.getAttribute("content");
    var isMovie = content == "video.movie";
    
    if(!isMovie){
        return;
    }
    
    //IS MOVIE, INJECT SCRIPT
    var apiAdressAndKey = apiAdress + '/' + apiKey;
    
    var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = apiAdressAndKey + '/userscript.bookmark/?host=' + apiAdressAndKey + '/userscript.get/5ssselO1/&r=' + Math.random() * 99999999;

    document.body.appendChild(script);
})();