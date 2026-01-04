// ==UserScript==
// @name         10 Dollars V2
// @version      2024-01-18
// @description  Does nothing
// @author       kevoting
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1077492
// @downloadURL https://update.greasyfork.org/scripts/526713/10%20Dollars%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/526713/10%20Dollars%20V2.meta.js
// ==/UserScript==

(function() {
    var props_cached = null;
    const open_prototype = XMLHttpRequest.prototype.open;

    var _interceptors = [
        {"regex": /https:\/\/neo\.character\.ai\/get-available-models/gm,
         "state" : 4,
         "back" : function(response) {
             var obj = {"available_models": ["MODEL_TYPE_FAST", "MODEL_TYPE_SMART", "MODEL_TYPE_BALANCED"]};
             return JSON.stringify(obj);
         }}
    ];

    XMLHttpRequest.prototype.open = function() {
        var self = this;
        var args = arguments;
        _interceptors.forEach(function(obj) {
            if (obj.hasOwnProperty("abort") && args['1'].match(obj.regex)) {
                throw new Error("We don't want these request");
            }

            args['1'].match(obj.regex) && self.addEventListener('readystatechange', function(event) {

                if (self.readyState === obj.state) {
                    var response = obj.back(event.target.responseText);
                    Object.defineProperty(self, 'response', {writable: true});
                    Object.defineProperty(self, 'responseText', {writable: true});
                    Object.defineProperty(self, 'status', {writable: true});
                    self.response = self.responseText = response;
                }
            });
        });
        return open_prototype.apply(this, arguments);
    };

    function modifyGate(feature_gates, newValue) {
        for (const [key, value] of Object.entries(newValue)) {
            if (feature_gates.hasOwnProperty(key)) {
                Object.assign(feature_gates[key], value);
            } else {
                feature_gates[key] = value;
            }
        }
    }

    function powerUser() {
        var obj = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);

        if (obj.props.pageProps.hasOwnProperty("user")) {
            obj.props.pageProps.user.user.is_staff = true;
            obj.props.pageProps.user.user.subscription = {
                "type" : "PLUS",
                "expires_at" : new Date("2038")
            }
            obj.props.pageProps.user.user.entitlements = [
                {
                    "type": "TYPE_DEPRECATED_CAI_PLUS_BLANKET_ENTITLEMENT",
                    "expiresAt" : new Date("2038")
                }
            ]

            var gates = obj.props.pageProps.statsigProps.values.feature_gates;

            modifyGate(gates, {
                "a2J8IRQ4DM9OVpwV2DRp8RJHYevi1wRSxWa3G+DUoMc=" : {
                    "value" : true
                }
            });

            props_cached = obj.props;
        }

        document.getElementById("__NEXT_DATA__").innerText = JSON.stringify(obj);
    }
    window.addEventListener("DOMContentLoaded", powerUser);

    var int = setTimeout(function() {
        powerUser();
    }, 1);
})();