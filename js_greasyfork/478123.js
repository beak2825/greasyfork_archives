// ==UserScript==
// @name         GC Food Colour Hider
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Toggle for hiding the food colours that only have 1-2 pets for in the rainbow pool pet colours. Mostly Chia but also includes some other minor ones like coconut jubjub and mallow grundo. Keeps ones that apply to more pets like Strawberry. On by default. 
// @author       Twiggies
// @match        *://www.grundos.cafe/rainbowpool/neopetcolours/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478123/GC%20Food%20Colour%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/478123/GC%20Food%20Colour%20Hider.meta.js
// ==/UserScript==

const chiaColourList = ["apple","asparagus","aubergine","avocado","blueberry","carrot","chokato","coconut","corn","dragonfruit","durian","garlic","gooseberry","grape","lemon","lime","mallow","nugget","pea","peach","pear","pepper","pineapple","plum","thornberry","tomato"];

(function() {
    'use strict';

    //Find the colour dropdown input.
    const colourSelect = document.querySelector('select[name="colour"]');
    //Add the checkbox toggle.
    colourSelect.parentElement.insertAdjacentHTML('afterend','<label for="chiaColourToggle"><input type="checkbox" id="chiaColourToggle" style="width:auto" checked>Hide Food Colours</label>')

    function hideColours() {
        for (let i = 0; i < colourSelect.options.length; i++) {
                if (chiaColourList.includes(colourSelect.options[i].value)) {
                    colourSelect.options[i].style.display = "none";
                }
            }
    }

    //Remove this line below if you do not want them hidden by default
    hideColours()

    //Add the event for hiding/showing.
    document.getElementById('chiaColourToggle').addEventListener("click", function (e) {
        if (this.checked) {
            //Hide the chia colours.
            hideColours();

        }
        else {
            for (let i = 0; i < colourSelect.options.length; i++) {
                if (colourSelect.options[i].style.display === "none") {
                    colourSelect.options[i].style.display = "";
                }
            }
        }
      });

})();