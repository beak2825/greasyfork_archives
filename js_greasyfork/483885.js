// ==UserScript==
// @name        gulper.io fast respawn
// @namespace   Violentmonkey Scripts
// @match       https://gulper.io/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      illegalsolutions
// @description Fast respawn on gulper.io
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483885/gulperio%20fast%20respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/483885/gulperio%20fast%20respawn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetNode = document.getElementById('game-stats');
    var config = { attributes: true, attributeFilter: ['style'] };

    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'attributes') {
                var visibility = window.getComputedStyle(targetNode).getPropertyValue('visibility');
                if (visibility === 'visible') {
                    $("#restart-btn").click();
                }
            }
        }
    };

    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();