// ==UserScript==
// @name         Slowly letter counter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A simple letter counter for Slowly web
// @author       Frollo
// @match        https://web.slowly.app/friend/*
// @license      GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slowly.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447999/Slowly%20letter%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/447999/Slowly%20letter%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function get_number_of_letters() {
        return document.querySelectorAll('.letter-sm').length;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Creating node
    let txt_node = document.createTextNode("Loading... Don't forget to scrool down!");
    let my_span = document.createElement('a');
    my_span.appendChild(txt_node);

    function display_number_of_letters(my_el) {
        my_el.text = 'Letters: ' + get_number_of_letters();
    }

    //console.log("To get the correct number of letters don't forget to scroll the page all way down!");

    window.onload = async function() {
        let loading_time = 5000;
        let refreshing_time = 3000;

        await sleep(loading_time);
        let friend_pane = document.querySelector('.friend-header');
        let my_el = friend_pane.appendChild(my_span);
        window.setInterval(function() { display_number_of_letters(my_el) }, refreshing_time);
    };
})();