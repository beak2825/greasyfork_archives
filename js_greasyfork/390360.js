// ==UserScript==
// @name         keybr colored keyzones
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show colored keyzones on keyboard while practicing
// @author       Akash Mugu
// @match        https://www.keybr.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390360/keybr%20colored%20keyzones.user.js
// @updateURL https://update.greasyfork.org/scripts/390360/keybr%20colored%20keyzones.meta.js
// ==/UserScript==

// window.onSelectorReady
window.onSelectorReady = function ready(selector, cb) {
    var document = window.document;
    var cbCalled = false;

    function check() {
        var el = document.querySelector(selector);

        if (el && !cbCalled) {
            cbCalled = true;
            cb(el);
        }
    }

    var observer = new MutationObserver(check);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    check();
};

// window.observeAttrs
window.observeAttrs = function(el, attrName, cb) {
    var observer = new MutationObserver(function(mutationsList) {
        for (var i = 0; i < mutationsList.length; i++) {
            var mutation = mutationsList[i];
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === attrName
            ) {
                cb();
            }
        }
    });

    observer.observe(el, { attributes: true });
};

// main
(function() {
    "use strict";

    // constants
    var keyboardSelector =
        "#root > section > div.Practice-keyboard.l--normal > div > svg > svg.Keyboard-layout";

    window.onSelectorReady(keyboardSelector, function(kb) {
        var keys = kb.querySelectorAll("svg.KeyboardKey");

        keys.forEach(function(el) {
            window.observeAttrs(el, "class", function() {
                var datazone = el.dataset.zone;
                var classStr = el.getAttribute("class");
                var classArr = classStr.split(" ");
                var classHasZone = classStr.includes("zone");

                function setDataZoneFromClass() {
                    el.dataset.zone = classArr.find(function(c) {
                        return c.includes("zone");
                    });
                }

                function setDataZoneToClass() {
                    el.setAttribute(
                        "class",
                        classArr.concat(datazone).join(" ")
                    );
                }

                if (classHasZone && !datazone) {
                    setDataZoneFromClass();
                }

                if (!classHasZone && datazone) {
                    setDataZoneToClass();
                }
            });
        });
    });
})();
