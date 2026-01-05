// ==UserScript==
// @name         BNL Validator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights errors on the WME map (currently work in progress, not ready for distribution)
// @author       You
// @include      https://www.waze.com/*/editor/*
// @include      https://www.waze.com/editor/*
// @include      https://editor-beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23580/BNL%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/23580/BNL%20Validator.meta.js
// ==/UserScript==

var BNLValidator_checks = {};

function log(message) {
    if (typeof message === 'string') {
        console.log('BNLValidator: ' + message);
    } else {
        console.log('BNLValidator: ', message);
    }
}

// initialize BNLValidator and do some checks
function BNLValidator_bootstrap() {
    log("Start");
    if(!window.Waze.map) {
        setTimeout(BNLValidator_bootstrap, 1000);
        return;
    }
    BNLValidator_init();
}

function BNLValidator_init() {
    // Check initialisation
    if (typeof Waze == 'undefined' || typeof I18n == 'undefined') {
        setTimeout(BNLValidator_init, 660);
        log('Waze object unavailable, map still loading');
        return;
    }
    BNLValidator_ScanArea();
    log(Waze.map.events);
    Waze.map.events.register("moveend", null, BNLValidator_ScanArea);
    Waze.map.events.register("mouseup", null, BNLValidator_ScanArea);
    Waze.map.events.register("zoomend", null, BNLValidator_ScanArea);
    Waze.map.events.register("resize", null, BNLValidator_ScanArea);
}

function getId(node) {
    return document.getElementById(node);
}
var polygons = [];
function BNLValidator_ScanArea() {
    $.each(polygons, function (_p, _v) { $(_v).remove(); });
    $.each(Waze.model.segments.objects, function( k, v ) {
        if (v.model.streets.get(this.attributes.primaryStreetID) === undefined) {
            var segment = Waze.model.segments.get(k);
            var attributes = segment.attributes;
            var line = getId(segment.geometry.id);
            var line2 = line.cloneNode(false);
            var parent = $(line).parent();

            $(line2).attr("id" , line2.id + "_cln");
            polygons.push(line2);
            line2.setAttribute("stroke", '#371B8D');
            line2.setAttribute("stroke-opacity", 0.6);
            line2.setAttribute("stroke-dasharray", "none");
            line2.setAttribute("stroke-width", 30);
            $(line).parent().prepend(line2);
        }
    });
}
setTimeout(BNLValidator_bootstrap, 3000);