// ==UserScript==
// @name         archive.org - Streamable-only games repositories
// @namespace    https://archive.org/details/stream_only?and[]=mediatype%3A%22software%22
// @description  Detects and redirects to the source repositories of streamable-only games from archive.org collection
// @icon         http://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Internet_Archive_logo_and_wordmark.png/240px-Internet_Archive_logo_and_wordmark.png
// @author       ner0
// @copyright    2021, ner0 (https://openuserjs.org/users/ner0)
// @license      MIT
// @version      0.1
// @supportURL   https://openuserjs.org/scripts/ner0/archive.org_-_Streamable-only_games_repositories/issues
// @grant        none
// @require      https://code.jquery.com/jquery-1.10.2.min.js
//
// @include      *://archive.org/details/*
// @downloadURL https://update.greasyfork.org/scripts/426838/archiveorg%20-%20Streamable-only%20games%20repositories.user.js
// @updateURL https://update.greasyfork.org/scripts/426838/archiveorg%20-%20Streamable-only%20games%20repositories.meta.js
// ==/UserScript==

if (window.location.href.indexOf(document.domain + "/details/") > -1) {
    var links = document.getElementsByTagName("a");
    for (var i=0; i<links.length; i++) {
        var link = "" + links[i];
        if (link.indexOf("stream") != -1) {
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var emuLoader = "" + scripts[i].text;
                if (emuLoader.indexOf("AJS.emulate_setup") != -1) {
                    emuLoader = emuLoader.substring(emuLoader.indexOf("\/"));
                    emuLoader = emuLoader.replace("\\", "");
                    emuLoader = emuLoader.substring(0, emuLoader.indexOf("?"));

                    var response = "";
                    $.ajax({
                        type: "GET",
                        url: "https://" + document.domain + emuLoader,
                        async: false,
                        success: function (text) {
                            response = text;
                            response = response.substring(response.indexOf("https"));
                            response = response.substring(0, response.indexOf(")"));
                            /*
                            console.log("Download repository: " + response);
                            window.open(response, "_blank");
                            */
                            if (confirm("Browse this game's repository?")) {
                                window.location.href = response;
                            }
                        }
                    });
                    break;
                }
            }
            break;
        }
    }
}