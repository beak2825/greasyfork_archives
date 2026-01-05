// ==UserScript==
// @name         WME Clear Geometry
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      0.8
// @description  Temporary script to hook "1" for clearing geometry until Toolbox is fixed
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @author       JustinS83
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/24871/WME%20Clear%20Geometry.user.js
// @updateURL https://update.greasyfork.org/scripts/24871/WME%20Clear%20Geometry.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function() {

var UpdateSegmentGeometry;

    function bootstrap(tries = 1) {

        if (W &&
            W.map &&
            W.model &&
            require &&
            WazeWrap.Interface &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function init(){
        UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');

        new WazeWrap.Interface.Shortcut('clearGeomShortcut', 'Clears road geometry', 'editing', 'Editing', '1', ClearGeometry, this).add();

    }

    function ClearGeometry(){
        if (W.selectionManager.getSelectedFeatures().length !== 0) {
            for (i = 0; i < W.selectionManager.getSelectedFeatures().length; i++) {
                var seg = W.selectionManager.getSelectedFeatures()[i].model;
                if (seg.type == "segment") {
                    var newGeo = seg.geometry.clone();
                    newGeo.components.splice(1, newGeo.components.length - 2);
                    newGeo.components[0].calculateBounds();
                    newGeo.components[1].calculateBounds();
                    W.model.actionManager.add(new UpdateSegmentGeometry(seg, seg.geometry, newGeo));
                }
            }
        }
    }
})();