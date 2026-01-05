// ==UserScript==
// @name         Movie4k Streamcloud Online Checker
// @namespace    http://wavecom.me/
// @version      1.0
// @description  Checks Streamcloud Links
// @author       wavecom
// @match        *movie4k.to/*
// @include      *movie4k.to/*
// @exclude      *movie4k.to/index.php
// @exclude      *movie4k.to/movies.php?list=search
// @exclude      *movie4k.to/movies-all.html
// @exclude      *movie4k.to/genres-movies.html
// @exclude      *movie4k.to/tvshows-updates.html
// @exclude      *movie4k.to/movies-updates.html
// @exclude      *movie4k.to/tvshows-all.html
// @exclude      *movie4k.to/genres-tvshows.html
// @exclude      *movie4k.to/xxxcheck.php*
// @exclude      *movie4k.to/xxx-updates.html
// @exclude      *movie4k.to/xxx-all.html
// @exclude      *movie4k.to/genres-xxx.html
// @exclude      *movie4k.to/tvshows-all.html
// @downloadURL https://update.greasyfork.org/scripts/11710/Movie4k%20Streamcloud%20Online%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/11710/Movie4k%20Streamcloud%20Online%20Checker.meta.js
// ==/UserScript==


var myContainer = '<div style="border: 1px; position:absolute; padding: 10px;top: 210px; right: 15%;background-color: grey;border-style: solid;min-width: 300px;min-height: 50px;padding-bottom: 20px;"><h2>StreamCloud Status</h2><br><div id="insertStreamcloudLinks"></div></div>';
document.body.innerHTML += myContainer;

var theDiv = document.getElementById("insertStreamcloudLinks");
var elements = document.getElementById("menu").getElementsByTagName("a");
var myLink = "unknown";

for (var i=0; i<elements.length; i++) {
    var thatElement = elements[i];
    if (thatElement.innerText.indexOf("Streamclou") > -1) {
        myLink = thatElement.href;

        GM_xmlhttpRequest({
            method: "GET",
            url: myLink,
            onload: function(response) {

                parser = new DOMParser();
                var doc = parser.parseFromString(response.responseText, "text/html");
                var select = doc.getElementsByName("hosterlist")[0].getElementsByTagName("option");
                console.log(select.length + " Streamcloud Links found");

                for (var h=0; h<select.length; h++) 
                {

                    var thatLink = window.location.origin + "/" + select[h].value;

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: thatLink,
                        onload: function(response) {

                            pars = new DOMParser();
                            var docu = pars.parseFromString(response.responseText, "text/html");
                            var links = docu.getElementById("maincontent5").getElementsByTagName("a");

                            for (var z=0; z<links.length; z++) {
                                var sclink = links[z];
                                if(sclink.href.indexOf("streamcloud.eu") > -1){

                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: sclink.href,
                                        onload: function(response) {

                                            play = new DOMParser();
                                            var dosc = play.parseFromString(response.responseText, "text/html");
                                            var dlbutton = dosc.getElementById("btn_download") 

                                            var elem = document.createElement("b");
                                            if (typeof(dlbutton) != 'undefined' && dlbutton != null) {
                                                elem.innerHTML = "<a href ='" + response.finalUrl + "'>Online</a><br>";
                                            } else{
                                                elem.innerHTML = "<a style='color:red;' href ='" + response.finalUrl + "'>Offline</a><br>";
                                            }
                                            theDiv.appendChild(elem);
                                        }
                                    });

                                }
                            }
                        }
                    });
                }
            }
        });
    }
}


