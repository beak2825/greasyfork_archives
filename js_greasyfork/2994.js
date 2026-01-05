// ==UserScript==
// @name           IEEExplore PDF + frame replacement
// @description    Replaces all PDF links on IEEE Xplore with the direct link to the file, bypassing the annoying frameset.
// @namespace      userscripts
// @include        http://ieeexplore.ieee.org/*
// @version        0.7
// @downloadURL https://update.greasyfork.org/scripts/2994/IEEExplore%20PDF%20%2B%20frame%20replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/2994/IEEExplore%20PDF%20%2B%20frame%20replacement.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
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
    // this replaces the links
    function ieee_replace_links() {
        jQ('a[href^="/xpl/ebooks/bookPdfWithBanner.jsp"]').each(function process() {
            jQ(this).attr("href").match(/\/xpl\/ebooks\/bookPdfWithBanner\.jsp\?fileName=(\d+)\.pdf\&bkn\=(\d+)/g);
            jQ(this).attr("href", "/ebooks/" + RegExp.$2 + "/" + RegExp.$1 + ".pdf?bkn=" + RegExp.$2);
        });
        
        jQ('a[href^="/stamp/stamp"]').each(function process() {jQ(this).attr("href", jQ(this).attr("href").replace("stamp/stamp", "stampPDF/getPDF")); });
    }
    // this redirects the frameset if we end up there somehow (e.g. following a link)
    function ieee_redir_frame() {
        var hh = document.location.href.replace("stamp/stamp", "stampPDF/getPDF");
        // ieee doesn't like leading zeroes
        hh = hh.replace(/arnumber=0*/g, "arnumber=");
        // setting the location reloads the page, we don't want that
        if (hh != document.location.href)
            document.location.href = hh;
    }
    ieee_redir_frame();
    ieee_replace_links();
    // some pages have dynamically loaded links (e.g. cited by)
    document.body.addEventListener('DOMNodeInserted', function(event) { ieee_replace_links(); }, false);
}

// load jQuery and execute the main function
addJQuery(main);
