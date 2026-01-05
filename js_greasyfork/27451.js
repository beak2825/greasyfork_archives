// ==UserScript==
// @name         T411 anti pub
// @version      0.3
// @description  Fait fonctionner le bouton de téléchargement si vous utilisez un bloqueur de pub
// @author       Thibaut SEVERAC <thibaut.severac@ynov.com>
// @supportURL https://github.com/thib3113/T411-anti-pub/issues
// @include *.t411.li/*
// @include *.t411.al/*
// @run-at document-end
// @namespace https://greasyfork.org/users/33719
// @downloadURL https://update.greasyfork.org/scripts/27451/T411%20anti%20pub.user.js
// @updateURL https://update.greasyfork.org/scripts/27451/T411%20anti%20pub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // search hiden download link
    var link = jQuery(".banner-adv.banner-300 a");
    if(link.length === 0){
        console.error("Impossible de trouver le lien de téléchargement dans la page");
    }
    else{
        var no_pub_link = link.parent("div").siblings("div").children("a:first");
        if(no_pub_link.length === 0)
            console.error("Impossible de trouver le lien sans pub");
        else{
           no_pub_link.off("click");
           no_pub_link.get(0).href = link.attr("href");
        }
    }
    jQuery('div.download div:not(.banner-adv)').off("click");
})();
