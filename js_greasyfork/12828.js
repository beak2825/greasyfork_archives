// ==UserScript==
// @name                WME Segments Zoom Level Tweak
// @namespace           http://userscripts.org/users/419370
// @description         Enables the editor to load Freeways and Major Highways at zoom=12 and zoom=13
// @author              Timbones
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.18
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/12828/WME%20Segments%20Zoom%20Level%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/12828/WME%20Segments%20Zoom%20Level%20Tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initOverride() {
        // reconfigure WME to load segments at low zoom
        W.controller._clearRepositoriesByZoom_orig=W.controller._clearRepositoriesByZoom;
        W.controller._clearRepositoriesByZoom=function(e){
            if (e >= 12 && e < 14) { e = 14; }
            return W.controller._clearRepositoriesByZoom_orig(e);
        }

        // override the parameters we send to Waze when requesting segments
        W.controller.sendReadFeatures_orig=W.controller.sendReadFeatures;
        W.controller.sendReadFeatures=function(e, t, n){
            if (W.map.getZoom() >= 12 && W.map.getZoom() < 14) {
                e.filter.roadTypes=[3,4,6,15]; // Freeway, Ramps, Major Highway, Ferry
            }
            return W.controller.sendReadFeatures_orig(e, t, n);
        }

        // if map is loaded at low zoom, force the model to reload and reselect segments
        if (W.map.getZoom() >= 12 && W.map.getZoom() < 14) {
            W.controller.reloadData();
            if (location.search.indexOf('segments=') != -1) {
                W.model.events.register("mergeend", null, reselectSegments);
            }
        }
    }

    function reselectSegments() {
        W.model.events.unregister("mergeend", null, reselectSegments);

        var q=location.search.match(new RegExp("[?&]segments?=([^&]*)"));
        var s=q[1].split(',');
        var o=[];
        for(var i=0;i<s.length;i++){
            var n=W.model.segments.objects[s[i]];
            if(typeof n!='undefined')
                o.push(n);
        }
        W.selectionManager.setSelectedModels(o);
    }

    setTimeout(initOverride, 2020);
})();