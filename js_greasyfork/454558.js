// ==UserScript==
// @name     sneedex tooltips
// @version  1
// @grant    none
// @match https://*.sneedex.moe/*
// @description tooltips to tell you what the colors mean on sneedex.
// @namespace https://greasyfork.org/users/981420
// @downloadURL https://update.greasyfork.org/scripts/454558/sneedex%20tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/454558/sneedex%20tooltips.meta.js
// ==/UserScript==
var oldHref = document.location.href;

window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                //console.log("CHANGED");
                for (const label of document.querySelectorAll("label")) {
                    switch (label.className) {
                        case "bad":
                            label.title = "Bad Encode";
                            break;
                        case "bain":
                            label.title = "Bad Encode and Incomplete";
                            break;
                        case "unmuxed":
                            label.title = "Unmuxed";
                            break;
                        case "unba":
                            label.title = "Bad Encode and Unmuxed";
                            break;
                        case "incomplete":
                            label.title = "Incomplete";
                            break;
                        case "unin":
                            label.title = "Unmuxed and Incomplete";
                            break;
                        default:
                            label.title = "Normal";
                            break;
                    }
                }
                console.log("done adding tooltips");
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};
