// ==UserScript==
// @name         Foodora - Highlight items (EN|FI|+)
// @namespace    1N07
// @version      0.4.2
// @description  Highlight items on Foodora (fantasy / fantasia highlighted by default) (EN|FI|+)
// @author       1N07
// @license      unlicense
// @match        https://www.foodora.fi/*restaurant/*
// @match        https://www.foodora.se/*restaurant/*
// @match        https://www.foodora.no/*restaurant/*
// @match        https://www.foodora.hu/*restaurant/*
// @match        https://www.foodora.cz/*restaurant/*
// @match        https://www.foodora.at/*restaurant/*
// @icon         https://www.google.com/s2/favicons?domain=foodora.fi
// @compatible   firefox Only tested on Firefox with Tampermonkey, but should probably work on pretty much all browsers and script managers
// @compatible   chrome Only tested on Firefox with Tampermonkey, but should probably work on pretty much all browsers and script managers
// @compatible   opera Only tested on Firefox with Tampermonkey, but should probably work on pretty much all browsers and script managers
// @compatible   edge Only tested on Firefox with Tampermonkey, but should probably work on pretty much all browsers and script managers
// @compatible   safari Only tested on Firefox with Tampermonkey, but should probably work on pretty much all browsers and script managers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423439/Foodora%20-%20Highlight%20items%20%28EN%7CFI%7C%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423439/Foodora%20-%20Highlight%20items%20%28EN%7CFI%7C%2B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Note, names are not case sensitive
    var names = [
        "my choice",
        "your choice",
        "fantasy",
        "oma valinta",
        "kuten haluatte",
        "fantasia"
    ];

    setInterval(CheckForOmaValinta, 200);

    function CheckForOmaValinta() {
        let found = document.querySelectorAll("[data-testid='menu-product-name']:not(.highlight-checked)");
        for(let i = 0; i < found.length; i++)
        {
            found[i].classList.add("highlight-checked");
            for(let j = 0; j < names.length; j++)
            {
                if(found[i].innerHTML.toLowerCase().includes(names[j].toLowerCase()))
                {
                    let target = found[i];
                    while(!target.classList.contains('product-tile'))
                        target = target.parentNode;
                    target = target.getElementsByClassName("product-tile__animation-overlay")[0];
                    target.style.backgroundColor = "rgba(112, 255, 60, 0.33)";
                    j = names.length; //break inner loop
                }
            }
        }
    }
})();