// ==UserScript==
// @name         Facebook Plane React
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds the airplane reaction to Facebook. The reaction may appear as a second angry reaction icon.
// @author       Jordan
// @license      MIT
// @match        *://*.facebook.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370795/Facebook%20Plane%20React.user.js
// @updateURL https://update.greasyfork.org/scripts/370795/Facebook%20Plane%20React.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var install = function () {
        if (!window.require) {
            requestAnimationFrame(install);
            return;
        }

        var require = window.require;

        window.require = function (name) {
            var module = require.apply(this, arguments);

            if (name === 'UFIController') {
                var factory = module.factory;

                module.factory = function (a, c, d) {
                    if (d.feedbacktarget &&
                        d.feedbacktarget.supportedreactions &&
                        d.feedbacktarget.supportedreactions.indexOf(15) === -1) {
                        d.feedbacktarget.supportedreactions.push(15);
                    }

                    return factory.call(this, a, c, d);
                };

                window.require = require;
            }

            return module;
        };
    };

    install();
})();