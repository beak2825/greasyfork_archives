// ==UserScript==
// @name         Waze Map Editor - Validator fix (Fork for bookmarklet)
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  hack to put WME Validator 1.1.20 working with last WME
// @author       Delfim Machado - dbcm@profundos.org
// @author       Glodenox - https://github.com/Glodenox
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29108/Waze%20Map%20Editor%20-%20Validator%20fix%20%28Fork%20for%20bookmarklet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29108/Waze%20Map%20Editor%20-%20Validator%20fix%20%28Fork%20for%20bookmarklet%29.meta.js
// ==/UserScript==

// got from WME webpackJsonp
(function(e, t, i) {
    "use strict";
    var n;

    var s_defined = function(e) {
        return "undefined" != typeof e && null !== e;
    };

    n = OpenLayers.Class(OpenLayers.Renderer.SVG, {
        initialize: function() {
            OpenLayers.Renderer.SVG.prototype.initialize.apply(this, arguments),
                this.supportUse = !0;
        },
        setAnimation: function(e, t) {
            var i = document.createElementNS(this.xmlns, "animate");
            i.setAttributeNS(null, "attributeName", t.attributeName),
                i.setAttributeNS(null, "dur", t.dur),
                t.from && i.setAttributeNS(null, "from", t.from),
                t.to && i.setAttributeNS(null, "to", t.to),
                t.fill && i.setAttributeNS(null, "fill", t.fill),
                t.begin && i.setAttributeNS(null, "begin", t.begin),
                t.id && i.setAttributeNS(null, "id", t.id),
                t.fill && i.setAttributeNS(null, "fill", t.fill),
                e.appendChild(i);
        },
        setStyle: function(e, t, i) {
            if (OpenLayers.Renderer.SVG.prototype.setStyle.apply(this, arguments),
                t.animation && this.setAnimation(e, t.animation),
                t.mask && e.setAttributeNS(null, "mask", t.mask),
                t.filter && e.setAttributeNS(null, "filter", t.filter),
                s_defined(t.rx) && e.setAttributeNS(null, "rx", t.rx),
                s_defined(t.ry) && e.setAttributeNS(null, "ry", t.ry),
                s_defined(t.maskID)) {
                var n, r = document.getElementById(t.maskID);
                r || (r = document.createElementNS(this.xmlns, "mask"),
                        n = document.createElementNS(this.xmlns, "rect"),
                        n.setAttributeNS(null, "x", "0"),
                        n.setAttributeNS(null, "y", "0"),
                        n.setAttributeNS(null, "width", "100%"),
                        n.setAttributeNS(null, "height", "100%"),
                        n.setAttributeNS(null, "fill", "white"),
                        r.setAttributeNS(null, "id", t.maskID),
                        r.appendChild(n)),
                    r.appendChild(e),
                    r._style = t,
                    e = r;
            }
            return e;
        },
        importSymbol: function(e) {
            return this.symbolMetrics = {},
                this.symbolMetrics[e] = [0, 0, 0],
                e;
        },
        getNodeType: function(e, t) {
            var i;
            return i = OpenLayers.Renderer.SVG.prototype.getNodeType.apply(this, arguments),
                "circle" === i && s_defined(t.rx) && s_defined(t.ry) && (i = "ellipse"),
                i;
        },
        dashStyle: function(e, t) {
            var i;
            if (e.strokeDashArray)
                return e.strokeDashArray;
            i = e.strokeWidth * t;
            var n = e.strokeDashstyle;
            switch (n) {
                case "solid":
                    return "none";
                case "dot":
                    return [1, 4 * i].join();
                case "dash":
                    return [4 * i, 4 * i].join();
                case "dashdot":
                    return [4 * i, 4 * i, 1, 4 * i].join();
                case "longdash":
                    return [8 * i, 4 * i].join();
                case "longdashdot":
                    return [8 * i, 4 * i, 1, 4 * i].join();
                default:
                    return OpenLayers.String.trim(n).replace(/\s+/g, ",");
            }
        },
        CLASS_NAME: "Waze.Renderer.ExtendedSVG"
    });

    window.ExtendedSVG = n;
})();

// translations hack
if (typeof I18n.translations.en == 'undefined') {
    I18n.translations["en"] = {
        "layers": {
            "name": {}
        }
    };
}

// create proxy for require
var reqold = window.require;
window.require = function(e) {
    if (e === 'Waze/Renderer/ExtendedSVG') {
        return this.ExtendedSVG;
    }
    return reqold(e);
};

W.map.mapState.getLayerVisibilityBitmask = function() {
    return W.map.mapState.map.layerVisibilityBitmask || {};
}

