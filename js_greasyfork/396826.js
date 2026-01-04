// ==UserScript==
// @name            WME Permalink cleaner
// @version         1.1.0
// @description     Removes layer and filter information from WME permalinks
// @grant           none
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @include         https://editor-beta.waze.com*
// @copyright       Mistraz
// @run-at          document-start
// @namespace https://greasyfork.org/en/users/438047-mistraz
// @downloadURL https://update.greasyfork.org/scripts/396826/WME%20Permalink%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/396826/WME%20Permalink%20cleaner.meta.js
// ==/UserScript==
(function () {
    function cleanUrl(loc) {
        let params = new URL(loc.href).searchParams.entries();
        let newParams = [];
        let hasChanged = false;
        let newURL = new URL(loc.href);
        for (const param of params) {
            if (
                param[0] !== "s" 
                && param[0] !== "Filter"
                && param[0] !== "layers"
                ) {
                newParams.push(param);
            } else {
                hasChanged = true;
            }
        }
        if (hasChanged) {
            newURL.search = "?" + newParams.reduce((acc, cur) => acc + `&${cur[0]}=${cur[1]}`, "").substr(1);
            window.location.href = newURL.href;
        }
    }
    
    cleanUrl(window.location);
}());