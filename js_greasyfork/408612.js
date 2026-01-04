// ==UserScript==
// @name        Unblock Brave from archive.is
// @namespace   Violentmonkey Scripts
// @match       https://archive.is/*
// @match       https://archive.today/*
// @match       https://archive.vn/*
// @grant       none
// @version     1.6
// @author      -
// @description a pointless cat and mouse game
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/408612/Unblock%20Brave%20from%20archiveis.user.js
// @updateURL https://update.greasyfork.org/scripts/408612/Unblock%20Brave%20from%20archiveis.meta.js
// ==/UserScript==
(function() {
    "use strict";

    const inject = function() {
        "use strict";

        function delete_cookie(name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++)
          delete_cookie(cookies[i].split("=")[0]);

        if (navigator.brave) { //don't interfere with brave shield
            Object.defineProperty(window.navigator, "brave", {
                enumerable: false,
                get: function() {
                    return undefined;
                }
            });
        }

        function wrap_fn(source, applyfn) {
            return (new Proxy(source, {
                apply: applyfn,
                get(target, key) {
                    const property = target[key];
                    return (typeof property === 'function') ?
                        property.bind(target) :
                        property;
                }
            }))
        }


        Reflect.ownKeys = wrap_fn(Reflect.ownKeys, function(target, thisArg, argList) {
            let ret = target.apply(thisArg, argList);
            if (argList.length > 0 && argList[0] === window.navigator) {
                return []
            }

            return ret
        })


        Object.getOwnPropertyNames = wrap_fn(Object.getOwnPropertyNames, function(target, thisArg, argList) {
            let ret = target.apply(thisArg, argList);
            if (argList.length > 0 && argList[0] === window.navigator) {
                return []
            }

            return ret
        })

        Object.getOwnPropertyDescriptors = wrap_fn(Object.getOwnPropertyDescriptors, function(target, thisArg, argList) {
            let ret = target.apply(thisArg, argList);
            if (argList.length > 0 && argList[0] === window.navigator) {
                return {}
            }

            return ret
        })


        Object.getPrototypeOf = wrap_fn(Object.getPrototypeOf, function(target, thisArg, argList) {
            let ret = target.apply(thisArg, argList);
            if (argList.length > 0 && argList[0] === window.navigator) {
                delete ret.brave
            }
            return ret
        })


        navigator.hasOwnProperty = wrap_fn(navigator.hasOwnProperty, function hasOwnProperty(target, thisArg, argList) {
            if (argList.length > 0 && argList[0] === "brave") {
                return false
            }

            return target.apply(thisArg, argList);
        })

    }


    const script = document.createElement("script");
    const target = document.head || document.documentElement;
    script.text = "(" + inject.toString() + ")();";

    target.appendChild(script);
    target.removeChild(script);
})();