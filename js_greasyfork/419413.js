// ==UserScript==
// @name         AnimesOnline.cc Wide Player
// @namespace    https://greasyfork.org/users/715485
// @version      0.1
// @description  Coloca o player comun do site animesonline.cc em wide. (modo teatro)
// @author       luiz-lp
// @icon         https://animesonline.cc/wp-content/uploads/2019/06/favicon.png
// @match        http*://animesonline.cc/*
// @downloadURL https://update.greasyfork.org/scripts/419413/AnimesOnlinecc%20Wide%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/419413/AnimesOnlinecc%20Wide%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            if(document.querySelector("div.playex") != null){
                document.querySelector("div.playex").setAttribute("style", "max-height: none; min-height: auto;");
            }
            var divPlayer = document.getElementById('playex');
            var divTarget = document.querySelector("ul.abc");
            insertAfter(divTarget, divPlayer);
        }
    });
})();