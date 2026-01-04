// ==UserScript==
// @name         Faucethunt Auto
// @namespace    forumbitcoin.co.id
// @version      1.0
// @description  Go to: https://www.faucethunt.win/?ref=4352
// @author       Gastino
// @match        https://www.faucethunt.win/*
// @match        https://www.faucethunt.com/*
// @match        https://faucethunt.win/*
// @match        https://faucethunt.com/*
// @downloadURL https://update.greasyfork.org/scripts/36355/Faucethunt%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/36355/Faucethunt%20Auto.meta.js
// ==/UserScript==

(function() {
    setInterval( function(){
        if($('#timer').text() === "")
        {
            claimSatoshis();
        }
    },1000);
})();