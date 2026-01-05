// ==UserScript==
// @name         Gentside Direct Video Player
// @namespace    http://tampermonkey.net/
// @icon         http://gaming.gentside.com/favicon.ico
// @version      0.1
// @description  Enlève les pubs et permet d'accèder au lien direct de la vidéo. Ce qui facilite le partage!
// @author       You
// @match        http://gaming.gentside.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20428/Gentside%20Direct%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/20428/Gentside%20Direct%20Video%20Player.meta.js
// ==/UserScript==

if(document.URL.indexOf("internal") != -1) {
    $( "#share, #next, #logo" ).remove();
} else {
    // Ads Removal
    $( "#banniere, #pave_haut, #pave_bas, #annonce").remove();
    // Siteweb tweaks
    $( ".post-dock, #actionreceiver" ).remove();
    $('#wrapper').css({
        'width': '80%'
    });
    var link = document.getElementsByTagName("iframe")[0].getAttribute("src");
    $(".post-share").html(
        '<a class="button-medium button-fb largest center mt10 mb10" href="'+link+'">Lien direct vers la vidéo</a>'
    );
}