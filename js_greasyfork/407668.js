// ==UserScript==
// @name         FacebookBlocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  block people on facebook
// @author       Kronzky
// @match        *://m.facebook.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/407668/FacebookBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/407668/FacebookBlocker.meta.js
// ==/UserScript==

var names = ["Hashem"];

function removePeople() {
    var articles = document.getElementsByTagName("article");
    console.log(articles.length + " articles");

    for (var article of articles) {
        console.log(article.getAttribute('id'));
        var divs = article.getElementsByClassName("du");
        if (divs.length>0) {
            var div = divs[0];
            console.log('  '+div);
            var links = article.getElementsByTagName("a");
            for (var link of links) {
                //console.log('   link: '+link.href)
                for (var name of names) {
                    if (link.href.indexOf(name)!=-1) {
                        //console.log('  *removed*');
                        article.style = "display:none!important";
                        break;
                    };
                };
            };
        };
    };
};

(function() {
    'use strict';
    removePeople();
    window.addEventListener("scroll", removePeople, false);
})();