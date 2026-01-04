// ==UserScript==
// @name         Modify Traces
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2018.11.07.01
// @description  Modify the Waze & User trace displayed by URs
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @exclude      https://www.waze.com/*user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368384/Modify%20Traces.user.js
// @updateURL https://update.greasyfork.org/scripts/368384/Modify%20Traces.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* ecmaVersion 2017 */
/* global $ */
/* global _ */
/* global WazeWrap */
/* global require */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    var URMO;
    var recoloredArrow = "";
    var recoloredUserArrow = "";
    var img = new Image();
    var userArrow = new Image();
    var mIcon;

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model && W.loginManager.user &&
            $)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    bootstrap();

    function modifyRules(){
        getTraceLayer().then(val => {
            //In theory these are always the same index - but better to search and be sure we get the right ones
            let sugRouteArrowIndex = val.styleMap.styles.default.rules.findIndex(function(e){ return e.filter.value == "suggestedRouteArrow";});
            let sugRouteIndex = val.styleMap.styles.default.rules.findIndex(function(e){ return e.filter.value == "suggestedRoute";});
            let userRouteArrowIndex = val.styleMap.styles.default.rules.findIndex(function(e){ return e.filter.value == "driveArrow";});
            let userRouteIndex = val.styleMap.styles.default.rules.findIndex(function(e){ return e.filter.value == "drive";});

            //Waze suggested route
            //default is 5
            val.styleMap.styles.default.rules[sugRouteArrowIndex].symbolizer.graphicHeight = 8;
            //default is 9
            val.styleMap.styles.default.rules[sugRouteArrowIndex].symbolizer.graphicWidth = 12;

            //User driven route
            //default is 5
            val.styleMap.styles.default.rules[userRouteArrowIndex].symbolizer.graphicHeight = 8;
            //default is 9
            val.styleMap.styles.default.rules[userRouteArrowIndex].symbolizer.graphicWidth = 12;
            //This would change the route color from dark purple
            //val.styleMap.styles.default.rules[sugRouteIndex].symbolizer.strokeColor = "#c77aff";

            getModifiedArrow().then(result => {
                val.styleMap.styles.default.rules[sugRouteArrowIndex].symbolizer.externalGraphic = recoloredArrow;
                val.redraw();
            });

            getModifiedUserArrow().then(result => {
                val.styleMap.styles.default.rules[userRouteArrowIndex].symbolizer.externalGraphic = recoloredUserArrow;
                val.redraw();
            });

            val.redraw();
            URMO.disconnect(); //We only need the MO to fire once - once the rule is set it persists on the layer.  The layer isn't created until the first time a user clicks on a UR, though.
        });

    }

    function getTraceLayer(tries = 1) { //Need to use a promise to get the layer - if we do not, we have to fudge some delay after clicking to wait until the layer is created and everything set up before we go through our changes
        return new Promise((resolve, reject) => {
            if (W.map.getLayersByName("problemMoreInfo").length > 0)
                resolve(W.map.getLayersByName("problemMoreInfo")[0]);
            else {
                if(tries <= 10)
                    setTimeout(() => resolve(getTraceLayer(tries++)), 100);
            }
        });
    }

    function getModifiedArrow(tries = 1){
        return new Promise((resolve, reject) =>{
            if(recoloredArrow === ""){
                if(tries <= 50)
                    setTimeout(() => resolve(getModifiedArrow(tries++)), 100);
            }
            else
                resolve(recoloredArrow);
        });
    }

    function getModifiedUserArrow(tries = 1){
        return new Promise((resolve, reject) =>{
            if(recoloredUserArrow === ""){
                if(tries <= 50)
                    setTimeout(() => resolve(getModifiedUserArrow(tries++)), 100);
            }
            else
                resolve(recoloredUserArrow);
        });
    }

    function URLayerPopulated(mutations){
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];
                if (addedNode.nodeType === Node.ELEMENT_NODE && $(addedNode).hasClass('mapUpdateRequest'))
                    modifyRules();
            }
        });
    }

    function init(){
        img.crossOrigin = "anonymous";
        img.onload = recolorArrow;
        img.src = "https://editor-assets.waze.com/production/img/one-way-routed9aa340910f8fc7a0fd2285fa0aab968.png";

        userArrow.crossOrigin = "anonymous";
        userArrow.onload = recolorUserArrow;
        userArrow.src = "https://editor-assets.waze.com/production/img/one-way-drivee7f57df07fa6d5f61eee9b71ae5e18b1.png";

        URMO = new MutationObserver(URLayerPopulated);
        URMO.observe($('#panel-container')[0], {childList : true, subtree: true});
    }

    //changes the purple Waze drive arrows to white for more contrast.
    function recolorArrow() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let imgData = ctx.getImageData(0, 0, 9, 5);
        let data = imgData.data;

        for (var i = 0; i < data.length; i += 4) {
            let red = data[i + 0];
            let green = data[i + 1];
            let blue = data[i + 2];
            let alpha = data[i + 3];

            // skip transparent/semiTransparent pixels
            if (alpha < 10)
                continue;

            let hsl = rgbToHsl(red, green, blue);
            let hue = hsl.h * 360;

            // change purple pixels to the new color
            if (hue > 260 && hue < 270) {
                var newRgb = hslToRgb((hue - 200)/360, hsl.s, 100);//hsl.l); //Setting l to 100 forces it to white
                data[i + 0] = newRgb.r;
                data[i + 1] = newRgb.g;
                data[i + 2] = newRgb.b;
                //data[i + 3] = 255;
            }
        }
        let mycanvas = document.createElement('canvas');
        $(mycanvas).attr('width', 9);
        $(mycanvas).attr('height', 5);
        let newctx = mycanvas.getContext('2d');
        newctx.putImageData(imgData,0,0);
        recoloredArrow = mycanvas.toDataURL();
    }

    function recolorUserArrow() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        ctx.drawImage(userArrow, 0, 0);
        let imgData = ctx.getImageData(0, 0, 9, 5);
        let data = imgData.data;

        for (var i = 0; i < data.length; i += 4) {
            let red = data[i + 0];
            let green = data[i + 1];
            let blue = data[i + 2];
            let alpha = data[i + 3];

            // skip transparent/semiTransparent pixels
            if (alpha < 10)
                continue;

            let hsl = rgbToHsl(red, green, blue);
            let hue = hsl.h * 360;

            // change green pixels to the new color
            if (hue > 157 && hue < 160) {
                var newRgb = hslToRgb((hue - 157)/360, .037, .106);//hsl.l);
                data[i + 0] = newRgb.r;
                data[i + 1] = newRgb.g;
                data[i + 2] = newRgb.b;
            }
        }
        let mycanvas = document.createElement('canvas');
        $(mycanvas).attr('width', 9);
        $(mycanvas).attr('height', 5);
        let newctx = mycanvas.getContext('2d');
        newctx.putImageData(imgData,0,0);
        recoloredUserArrow = mycanvas.toDataURL();
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min)
            h = s = 0; // achromatic
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return ({
            h: h,
            s: s,
            l: l,
        });
    }

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s == 0)
            r = g = b = l; // achromatic
        else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return ({
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        });
    }
})();