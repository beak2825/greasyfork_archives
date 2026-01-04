// ==UserScript==
// @name         auto refresh auth
// @namespace    proximis
// @version      0.3
// @description  grafana auto refresh
// @author       You
// @match        https://prx-graf.omn.proximis.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373416/auto%20refresh%20auth.user.js
// @updateURL https://update.greasyfork.org/scripts/373416/auto%20refresh%20auth.meta.js
// ==/UserScript==

(function() {
    var load = function() {
        if (typeof jQuery === 'undefined') {
            setTimeout(load, 100);
        } else {
            if (jQuery('#autorefresh').length) {
                jQuery('#autorefresh').remove();
            }
            jQuery('body').append('<iframe id="autorefresh" src="https://prx-graf.omn.proximis.com/_gcp_iap/session_refresher"/>');
            setTimeout(load, 600000);
        }
    }
    load();
})();