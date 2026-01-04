// ==UserScript==
// @name         Thingiverse allow adding things to multiple collections
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enables the Collected button to be pressed to add an item to another collection - this additionally fixes the issue that the server does not update immediately once a thing has been removed from a collection, allowing you to immediately add to another one.
// @author       H. J. Norden
// @match        https://www.thingiverse.com/thing:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421715/Thingiverse%20allow%20adding%20things%20to%20multiple%20collections.user.js
// @updateURL https://update.greasyfork.org/scripts/421715/Thingiverse%20allow%20adding%20things%20to%20multiple%20collections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let DONE = false;

    function get_collected_btn() {
        if (DONE) return;
        for (let el of document.getElementsByTagName("a")) {
            if (el.innerHTML === "Collected") {
                return el.parentNode;
            }
        }
    }

    function show_collection_window() {
        let el = document.getElementsByClassName("SidebarMenu__collectWindowWrapper--2dRST")[0];
        el.classList.remove("CollectThingWindow__hidden--OSA7G");
    }

    function hide_collection_window() {
        let el = document.getElementsByClassName("SidebarMenu__collectWindowWrapper--2dRST")[0];
        el.classList.add("CollectThingWindow__hidden--OSA7G");
    }

    function fix_collection_window_closing() {
        let close_btn = document.getElementsByClassName("CollectThingWindow__closeImageWraper--2oYuJ")[0];
        let save_btn = document.getElementsByClassName("CollectThingWindow__buttonWrapper--1rp4p")[0];
        close_btn.addEventListener("click", hide_collection_window);
        save_btn.addEventListener("click", hide_collection_window);
    }

    function enable_collection(from_button) {
        if (DONE) return;
        if (from_button === undefined) {
            console.log("Couldn't find 'Collected' button!");
            return;
        }

        fix_collection_window_closing();

        from_button.classList.remove("SideMenuItem__itemDisabled--pGJ7S");
        from_button.addEventListener("click", show_collection_window);

        DONE = true;
    }


    // Try multiple timeouts for different network conditions...
    setTimeout(function(){enable_collection(get_collected_btn());}, 100);
    setTimeout(function(){enable_collection(get_collected_btn());}, 500);
    setTimeout(function(){enable_collection(get_collected_btn());}, 2000);
    setTimeout(function(){enable_collection(get_collected_btn());}, 5000);

})();