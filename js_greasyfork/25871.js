// ==UserScript==
// @name         Disable Disqus URL Tracking
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove the http[s]://disq.us/url?url= Disqus added in 2016-12
// @author       Luke Breuer
// @match        *://disqus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25871/Disable%20Disqus%20URL%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/25871/Disable%20Disqus%20URL%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // not using jquery because:
    // https://statuscode.ch/2017/03/CSP-unsafe-eval-and-jquery/
    // but we can apparently trust that Disqus included it

    function post_count() {
        return $("#conversation li.post").length;
        //return document.evaluate("count(//*[@id='conversation']//li[@class='post'])", document, null, XPathResult.NUMBER_TYPE, null).numberValue;
    }

    function fix_urls() {
        // As of 2016-12-20, Disqus uses http tracking for http links, and https tracking for https links
        var urls = $("a[href^='http://disq.us/url?url='], a[href^='https://disq.us/url?url=']");
        //console.log("Offending URL count: " + urls.length);
        //console.log(post_count());

        urls.each(function() {
            var new_url = /^https?:\/\/disq.us\/url\?url=(https?:.*?)(:.+)?(&.+)?$/i.exec(decodeURIComponent(this.href))[1];
            //console.log(decodeURIComponent(this.href));
            //console.log(new_url);
            this.href = new_url;
        });
    }

    function wait_for_min_posts(min, max_tries, f) {
        var try_wait = 200; // ms
        var tid = setInterval(function() {
            if (post_count() >= min) {
                clearInterval(tid);
                f();
            }
            if (--max_tries <= 0)
                clearInterval(tid);
        }, try_wait);
    }

    //console.log("UserScript entered");

    var lastCount = 0;
    var iteration = 0;
    setInterval(function() {
        var count = post_count();
        iteration++;
        if (count != lastCount) {
            console.log(iteration, count);
            lastCount = count;
        }
    }, 50);

    wait_for_min_posts(1, 200, function() {
        fix_urls();
        // catch additional comments loaded from navigation to specific comment (#comment-)
        wait_for_min_posts(post_count() + 1, 100, function() { fix_urls(); });

        $('#posts > div.load-more > a').click(function() {
                wait_for_min_posts(post_count() + 1, 100, function() { fix_urls(); });
            });
    });
})();