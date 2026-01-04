// ==UserScript==
// @name         Item 'Feed to Pet' Hider
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hides the options for feeding an item to a pet. Can toggle back on if want to feed something to a pet.
// @author       Cherri & Twiggies
// @match        *://www.grundos.cafe/itemview/*
// @icon         https://i.imgur.com/DWN7LkC.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478280/Item%20%27Feed%20to%20Pet%27%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/478280/Item%20%27Feed%20to%20Pet%27%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //get the item action select element
    const itemselect = document.getElementById('itemaction_select');
    //Add the toggle for showing/hiding
    itemselect.parentElement.insertAdjacentHTML('beforebegin','<label for="feedtoggle"><input type="checkbox" id="feedtoggle" style="width:auto" checked />Hide Feed Options</label>')

    //Hide the options in the selection that is a feed action. (where value starts with 'feed|')
    function hidefeed() {
        for (let i = itemselect.length-1; i >= 0; i--) {
            if (itemselect[i].value.startsWith('feed|')) {
                itemselect[i].style.display = "none";
            }
        }
    };

    //Shows everything that was hidden.
    function showfeed() {
        for (let i = 0; i < itemselect.length; i++) {
            if (itemselect[i].style.display === "none") {
                itemselect[i].style.display = "";
            }
        }
    };

    //Automatically hide the feed options when loading in.
    hidefeed();

    document.getElementById('feedtoggle').addEventListener("click", function (e) {
        if (this.checked) {
            hidefeed();
        } else {
            showfeed();
        }
      });
})();