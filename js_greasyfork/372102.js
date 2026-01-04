// ==UserScript==
// @name         Steam one-click remove from wishlist
// @namespace    driver8.net
// @version      0.1
// @description  Allows you to remove an item from your Steam wishlist with one click on the "On Wishlist" button on the game's store page.
// @author       driver8
// @match        *://*.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372102/Steam%20one-click%20remove%20from%20wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/372102/Steam%20one-click%20remove%20from%20wishlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('hi steam wishlist');

    var nwl_button = document.querySelector('#add_to_wishlist_area > a');
    var owl_button = document.querySelector('.queue_actions_ctn > .queue_btn_active, #add_to_wishlist_area_success > a');

    if (nwl_button) {
        console.log('no-wishlist button', nwl_button);
        nwl_button.onclick = customAddToWishlist;
    } else if (owl_button) {
        console.log('on wishlist button', owl_button);
        owl_button.href = '#';
        owl_button.onclick = removeFromWishlist;
    }

    function removeFromWishlist(evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        var m1 = document.cookie.match(/steamRememberLogin=(\d+)/);
        var m2 = document.cookie.match(/steamLoginSecure=(\d+)/);
        var profile_id = (m1 && m1[1]) || (m2 && m2[1]);
        var m3 = document.cookie.match(/sessionid=([0-9a-f]+)/);
        var session_id = m3 && m3[1];
        var m4 = document.location.href.match(/store\.steampowered\.com\/app\/(\d+)/);
        var app_id = m4 && m4[1];

        if (profile_id && session_id && app_id) {
            var url = 'https://store.steampowered.com/wishlist/profiles/' + profile_id + '/remove/';
            console.log(url, session_id, app_id);
            var fd = new FormData();
            fd.set('appid', app_id);
            fd.set('sessionid', session_id);
            var oReq = new XMLHttpRequest();
            oReq.responseType = 'json';
            oReq.addEventListener("load", load_handler);
            oReq.open("POST", url);
            oReq.send(fd);
        }
        return false;
    }

    function load_handler(evt) {
        console.log('this', this);
        if (this.response && this.response.success == 1) {
            console.log('Successfully removed from wishlist');
            //owl_button.href = "javascript:AddToWishlist( parseInt(app_id), 'add_to_wishlist_area', 'add_to_wishlist_area_success', 'add_to_wishlist_area_fail', '' );";
            location.reload();
        }
    }

    function customAddToWishlist(evt) {
        var owl_button,
            i = 0;
        (function getButton() {
            owl_button = document.querySelector('.queue_actions_ctn > .queue_btn_active, #add_to_wishlist_area_success > a');
            console.log('on wishlist button', owl_button);
            if (!owl_button && i < 200) {
                console.log('try #', ++i);
                window.setTimeout(getButton, 20);
            } else {
                owl_button.onclick = removeFromWishlist;
            }
        })();
    }
})();