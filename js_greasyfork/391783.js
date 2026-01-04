// ==UserScript==
// @name        WME Fix Map Object
// @namespace   http://www.tomputtemans.com/
// @description Temporary fix for the changes made in the WME internal data structure that breaks any script that interacts with the map. Also monitors and reports the usage of these copied over properties.
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/391783/WME%20Fix%20Map%20Object.user.js
// @updateURL https://update.greasyfork.org/scripts/391783/WME%20Fix%20Map%20Object.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    var recoveredProperties = new Map();
    var nullProperties = new Set();

    function init() {
        if (typeof W === 'undefined' ||
            typeof W.map === 'undefined' ||
            typeof W.map.olMap === 'undefined') {
            setTimeout(init, 100);
            return;
        }
        recoverProperties();
        W.map = new Proxy(W.map, {
            'get': function(target, property) {
                checkProperty(property);
                return Reflect.get(...arguments);
            }
        });
        console.log("Fix Map Object: The following properties have been recovered: ", Array.from(recoveredProperties.keys()).sort());
        // A property might have been null at the moment of copying, so we retry getting these copied over
        setInterval(checkNullProperties, 2000);
    }
    init();

    function recoverProperties() {
        // Go through all properties, including the prototype chain
        for (var mapProperty in W.map.getOLMap()) {
            if (!W.map[mapProperty]) {
                recoveredProperties.set(mapProperty, 0);
                W.map[mapProperty] = W.map.getOLMap()[mapProperty];
                if (W.map[mapProperty] == null) {
                    nullProperties.add(mapProperty);
                }
            }
        }
    }

    function checkProperty(propertyName) {
        if (recoveredProperties.has(propertyName)) {
            var timesCalled = recoveredProperties.get(propertyName);
            if (timesCalled >= 10) {
                return;
            }
            console.groupCollapsed("Fix Map Object: Removed property W.map." + propertyName + " accessed. Expand for stack trace.");
            console.trace();
            console.groupEnd();
            if (timesCalled == 9) {
                console.warn("Fix Map Object: No longer reporting on removed property W.map." + propertyName + " (limit reached)");
            }
            recoveredProperties.set(propertyName, timesCalled + 1);
        }
    }

    function checkNullProperties() {
        nullProperties.forEach((property) => {
            if (W.map.getOLMap()[property] != null) {
                W.map[property] = W.map.getOLMap()[property];
                nullProperties.delete(property);
            }
        });
    }
})();