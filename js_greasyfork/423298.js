// ==UserScript==
// @name         Loader.to "onclick" adware remover
// @description  Removes adware from Loader.to
// @version      0.1
// @author       MuchPog
// @match        https://loader.to/*
// @grant        none
// @namespace https://greasyfork.org/users/747741
// @downloadURL https://update.greasyfork.org/scripts/423298/Loaderto%20%22onclick%22%20adware%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/423298/Loaderto%20%22onclick%22%20adware%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){try{var downloads = document.getElementById("ds").children; for (var i = 0; i < downloads.length; i++){downloads[i].children[0].children[1].children[2].removeAttribute("onclick");}}catch{}}, 10);
})();