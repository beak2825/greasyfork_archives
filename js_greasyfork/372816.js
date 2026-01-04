// ==UserScript==
// @name         WaniKani Forums: Giphy/Pinterest embedder
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Embeds images which Discourse fails to embed
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372816/WaniKani%20Forums%3A%20GiphyPinterest%20embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/372816/WaniKani%20Forums%3A%20GiphyPinterest%20embedder.meta.js
// ==/UserScript==

(function($, wfs) {
    wfs.wait('.topic-body p > a[target="_blank"]', embedImages)
    //embeds images if there are any broken ones to find
    function embedImages(e) {
        var embed = false;
        var url = $(e).attr('href');
        if (e.innerText == "") {
            if (url.match(/https:\/\/media\.giphy\.com\/media\/.+\/giphy\.gif/) != null) {
                var ID = url.split("/")[4];
                url = "https://i.giphy.com/media/"+ID+"/giphy.webp";
                embed = true;
            }
            else if (url.match(/https:\/\/i\.pinimg\.com\/.*\.gif/) != null) embed = true;
            if (embed) {
                var img = document.createElement('img');
                img.src = url;
                img.alt = 'Loading image...';
                var elem = $(e.parentElement);
                elem.addClass("lightbox");
                elem.empty();
                elem.append(img);
                elem.append('<div class="meta">'+
                '    <span class="filename"><small>Embedded by the <i>Giphy/Pinterest Embedder</i>'+
                '    </small></span></div>');
            }
        }
    }
})(window.jQuery, window.wfs);
