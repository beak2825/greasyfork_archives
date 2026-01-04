// ==UserScript==
// @name         WME Disable Closed Updates
// @namespace    https://greasyfork.org/en/users/668704-phuz
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version      1.00
// @description  Disable the Closed Updates Layer when loading WME
// @author       phuz
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
/* global OpenLayers */
/* global W */
/* global WazeWrap */
/* global $ */
/* global I18n */
/* global _ */
// @downloadURL https://update.greasyfork.org/scripts/418411/WME%20Disable%20Closed%20Updates.user.js
// @updateURL https://update.greasyfork.org/scripts/418411/WME%20Disable%20Closed%20Updates.meta.js
// ==/UserScript==

//Begin script function
(function () {
    //Bootstrap
    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model
            && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () { bootstrap(++tries); }, 200);
        }
    }
    //Initializations...
    function init() {
        setTimeout(function() {
            W.layerSwitcherController.checkboxState.set("ITEM_CLOSED_UPDATE_REQUESTS",false)
        },500);
    }
    bootstrap();
})();