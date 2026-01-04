// ==UserScript==
// @name         MEMRISE KANJAX with KOOHI v3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds scripts to find Kanji on website page and makes them interactive with Kanji Koohi data + kanji strokes.
// @author       superpawko
// @match        *://www.memrise.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31169/MEMRISE%20KANJAX%20with%20KOOHI%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/31169/MEMRISE%20KANJAX%20with%20KOOHI%20v3.meta.js
// ==/UserScript==


// IMPORTANT: It only runs scripts from your hardrive from: http://127.0.0.1:8887/
// IMPORTANT: You need a webserver to host this files. ( check Web Server for Chrome (Chrome Extension))
// IMPORTANT2: Inside _kanjax_with_koohii.js there is also url to kanji stroke order SVG's (vector images), if you host your data somewhere else change it also. 

$(document).ready(function() {
    MEMRISE.garden.boxes.load = (function() {

        var cached_function = MEMRISE.garden.boxes.load;
        return function() {

            MEMRISE.garden.boxes.activate_box = (function() {
                var cached_function = MEMRISE.garden.boxes.activate_box;
                return function() {

                    var result = cached_function.apply(this, arguments);

                    var scriptElementBpop = document.createElement( "script" );
                    scriptElementBpop.type = "text/javascript";
                    scriptElementBpop.src = "http://127.0.0.1:8887/_jquery.bpopup.min.js";
                    document.body.appendChild( scriptElementBpop );

                    var scriptElement = document.createElement( "script" );
                    scriptElement.type = "text/javascript";
                    scriptElement.src = "http://127.0.0.1:8887/_kanjax_with_koohii.js";
                    document.body.appendChild( scriptElement );

                    return result;


                };
            }());

            return cached_function.apply(this, arguments);
        };
    }());
});


