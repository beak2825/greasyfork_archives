// ==UserScript==
// @name         Arrow Key Navigation
// @version      0.1
// @description  Change pages with arrow keys
// @author       MV
// @include      https://e-hentai.org/*
// @include      https://*.booru.org/*
// @include      http://*.booru.org/*
// @include      https://e621.net/*
// @include      https://nhentai.net/*
// @include      https://chan.sankakucomplex.com/*
// @exclude      https://nhentai.net/g/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_info
// @namespace https://greasyfork.org/users/4506
// @downloadURL https://update.greasyfork.org/scripts/381969/Arrow%20Key%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/381969/Arrow%20Key%20Navigation.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function GM_main () {
    var JQUERY = null;

    try {
        console.log('jQuery version is: ' + jQuery.fn.jquery);
        JQUERY = jQuery;
    } catch (err) {}
    try {
        console.log('jQ version is: ' + jQ.fn.jquery);
        JQUERY = jQ;
    } catch (err) {}

    try {
        Post.resize_image();
    } catch(err) {
        // https://chan.sankakucomplex.com
    }

    JQUERY(document).ready(function() {
        JQUERY(document).keydown(function(e) {
            console.log('keypress: ' + e.which);
            if (e.which == 39) { //right arrow
                try {
                    JQUERY('td.ptds').next('td').click();
                    console.log($('td.ptds').next('td'));
                } catch(err) {
                    // https://e-hentai.org/
                }
                try {
                    JQUERY('#paginator > div > a.next_page')[0].click();
                } catch(err) {
                    // https://e621.net/
                }
                try {
                    JQUERY('div[id^="pool"] > p:nth-child(3) > span:nth-child(3) > a')[0].click();
                } catch(err) {
                    // https://e621.net/ next in pool
                }
                try {
                    JQUERY('section.pagination > a.next')[0].click();
                } catch(err) {
                    // https://nhentai.net/
                }
                try {
                    JQUERY('#paginator > a:[alt="next"]')[0].click();
                } catch(err) {
                    // https://*.booru.org/
                }
            } else if (e.which == 37) { // left arrow
                try {
                    JQUERY('td.ptds').prev('td').click();
                } catch(err) {
                    // https://e-hentai.org/
                }
                try {
                    JQUERY('#paginator > div > a.prev_page')[0].click();
                } catch(err) {
                    // https://e621.net/
                }
                try {
                    JQUERY('div[id^="pool"] > p:nth-child(3) > span:nth-child(2) > a')[0].click();
                } catch(err) {
                    // https://e621.net/ previous in pool
                }
                try {
                    JQUERY('section.pagination > a.previous')[0].click();
                } catch(err) {
                    // https://nhentai.net/
                }
                try {
                    JQUERY('#paginator > a:[alt="back"]')[0].click();
                } catch(err) {
                    // https://*.booru.org/
                }
            }
        });
    });
}
addJQuery(GM_main);