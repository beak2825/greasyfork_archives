// ==UserScript==
// @name         WaniKani Forums: Large Image Embedder
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Embeds images which Discourse refuses to embed
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38063/WaniKani%20Forums%3A%20Large%20Image%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/38063/WaniKani%20Forums%3A%20Large%20Image%20Embedder.meta.js
// ==/UserScript==

(function($, wfs) {
    //embeds images if there are any broken ones to find
    function embedImages(e) {
        console.log('swooosh');
        var url = $(e).attr('href');
        var img = document.createElement('img');
        img.src = url;
        var elem = $(e.closest('.large-image-placeholder'));
        elem.addClass('lightbox');
        elem.attr('href', url);
        elem.empty();
        elem.append(img);
        elem.append('<div class="meta">'+
        '    <span class="filename"><small>Embedded by the <i>Large Image Embedder</i>'+
        '    </small></span></div>');
    }

    wfs.wait('.large-image-placeholder a', embedImages)
})(window.jQuery, window.wfs);
