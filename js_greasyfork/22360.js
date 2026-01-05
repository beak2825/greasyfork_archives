// ==UserScript==
// @name         Redirect torcache.net to itorrents.org
// @namespace    http://www.dieterholvoet.com
// @version      1.0
// @description  Change torcache.net links on torrent websites to itorrents.org links
// @author       Dieter Holvoet
// @match        https://torrentproject.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22360/Redirect%20torcachenet%20to%20itorrentsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/22360/Redirect%20torcachenet%20to%20itorrentsorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    switch(window.location.hostname) {
        case "torrentproject.se":
            torrentproject();
            break;
    }
})();

function torrentproject() {
    var urls = document.querySelectorAll(".usite a");
    
    for(var i = 0; i < urls.length; i++) {
        var text = urls[i].innerHTML,
            href = urls[i].getAttribute("href");
        
        if(text.indexOf("torcache.net") !== -1) {
            console.log(text, href);
            urls[i].innerHTML = text.replace("torcache.net", "itorrents.org");
            urls[i].setAttribute("href", href.replace("torcache.net", "itorrents.org"));
        }
    }
}