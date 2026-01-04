// ==UserScript==
// @name         nitro.to magnet converter
// @namespace    http://http://nitro.to/
// @version      0.1
// @description  Get proper magnet links on nitro.to
// @author       CactusPie
// @match        http://nitro.to/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369575/nitroto%20magnet%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/369575/nitroto%20magnet%20converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getMagnetUrlFromHtml(htmlContent){
        return htmlContent.match(/magnet.*=/g)[0];
    }

    function retrieveAndSetMagnet(url, anchorToModify){
        $.ajax({
            url: url,
            success: function(data){
                var magnetUrl = getMagnetUrlFromHtml(data);
                $(anchorToModify).prop("href", magnetUrl);
            }
        });
    }

    function onMagnetClick(that){
        var link = that.title.replace("__DWNMAGNET__", "download_magnet.php");
        var originalUrl = baseUrl + link;
        retrieveAndSetMagnet(originalUrl, that);
    }

    var windowLocation = window.location;
    var baseUrl = windowLocation.protocol + "//" + windowLocation.host;

    var links = $("a.short-link[onclick^='getMagnet']");
    for(var i=0; i<links.length; i++){
        var link = $(links[i]);
        link.prop('onclick',null).off('click');
        link.click(function() {onMagnetClick(this);});
    }
})();