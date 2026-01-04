// ==UserScript==
// @name         Mercari To Zenmarket
// @namespace    http://artemisdev.moe/
// @version      1.3
// @description  Add button to quickly open zenmarket page from mercari
// @author       Artemis
// @match        https://jp.mercari.com/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercari.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528121/Mercari%20To%20Zenmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/528121/Mercari%20To%20Zenmarket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onClick (e) {
        var path = window.location.pathname;
        var id = path.substring(path.lastIndexOf('/') + 1);
        window.open("https://zenmarket.jp/en/mercariproduct.aspx?itemCode=" + id);
    }

    window.addEventListener ("load", function() {
        var button = document.createElement ('div');
        button.setAttribute("class", "merNavigationTopMenuItem default__1c6d4605");
        button.innerHTML = '<div class="navButton__1c6d4605"><button type="button" id="artemisZenbtn" class="sc-cbae8f5c-1 gCVCIB">ZEN</button></div>';
        button.addEventListener("click", onClick, false);

        var parent = document.getElementsByClassName("merNavigationTop")[0].children[0].children[3];
        var sibling = parent.children[0];
        parent.insertBefore(button, sibling);
    });
})();