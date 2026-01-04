// ==UserScript==
// @name         Distractionator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes annoying news and feeds from Google, DuckDuckGO, Youtube, and Quora
// @author       You
// @match        https://www.youtube.com/*
// @match        https://duckduckgo.com/*
// @match        https://www.google.com/*
// @match        https://www.quora.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408373/Distractionator.user.js
// @updateURL https://update.greasyfork.org/scripts/408373/Distractionator.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {

    var timer = setInterval(go, 500);

    function go() {

        var duckduckGoNews = "#duckbar_static li a:contains(News),.js-module--news,#hdtb-msb-vis a:contains(News)";
        var googleNewsButton = "#hdtb-msb-vis a:contains(News)";
        var googleNewStories = "h3:contains(Top stories)";
        var youtubeFeed = ".ytd-two-column-browse-results-renderer";
        var quoraFeed = ".qu-display--flex";
        var allSelectors =
            duckduckGoNews + "," +
            googleNewsButton + "," +
            googleNewStories + "," +
            youtubeFeed + "," +
            quoraFeed;

        // DuckDuckGO news
        jQ(duckduckGoNews).remove();

        // Google News
        jQ(googleNewsButton).remove();
        jQ(googleNewStories).parent().parent().remove();

        // Youtube
        jQ(youtubeFeed).remove();

        // Quora
        jQ(quoraFeed).remove();

        if(jQ(allSelectors).length) {
            clearInterval(window.timer);
            return;
        }

    }
}


// load jQuery and execute the main function
addJQuery(main);