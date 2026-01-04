// ==UserScript==
// @name         Seeking Alpha Full Article
// @namespace    https://greasyfork.org/en/scripts/419808/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @match        https://seekingalpha.com/article/*
// @match        https://seekingalpha.com/news/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419808/Seeking%20Alpha%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/419808/Seeking%20Alpha%20Full%20Article.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sp = window.location.href.split("/");
    var articleid = sp[sp.length-1].split("-")[0];
    var type = "news";
    if (sp[sp.length-2] == "article") {
        type = "articles";
    }
    var url = 'https://seekingalpha.com/api/v3/' + type + '/' + articleid;
    jQuery.getJSON(url, function(data) {
        var css = jQuery('link').attr("rel", "stylesheet").attr("href", "https://unpkg.com/purecss@2.0.6/build/pure-min.css")
        .attr("integrity", "sha384-Uu6IeWbM+gzNVXJcM9XV3SohHtmWE+3VGi496jvgX1jyvDTXfdK+rfZc8C1Aehk5")
        .attr("crossorigin", "anonymous");
        jQuery('html').empty();
        jQuery('html').append(css);
        jQuery('html').append(data.data.attributes.content);
        console.log(data.data.attributes.content);
    });
})();