// ==UserScript==
// @name         MyDépixelisationLabs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  c'est mieux des images sans petits carrés !
// @author       Alexandreou
// @match        https://www.dealabs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34420/MyD%C3%A9pixelisationLabs.user.js
// @updateURL https://update.greasyfork.org/scripts/34420/MyD%C3%A9pixelisationLabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByTagName("img");
    var elem;
    for(var i = 0; i < elements.length; i++){
        elem = elements[i].src;
        elem = elem.replace("user_small_listing_avatar", "user_avatar");
        elem = elem.replace("user_small_avatar", "user_avatar");
        elem = elem.replace("profile-listing-placeholder_028af.png", "profile-placeholder_f56af.png");
        elements[i].src=elem;
    }
})();