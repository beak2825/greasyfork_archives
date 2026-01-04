// ==UserScript==
// @name		My Trusted-Types Helper
// @version		0.1.0
// @description	This is mainly to enable TamperMonkey to continue using scripts that have `@require` dependencies on sites with a restrictive `Trusted-Types` policy. At least until TM v4.14 comes out, the milestone has already been added: https://github.com/Tampermonkey/tampermonkey/issues/1334#event-5361683856 \n Make sure this script is executed before the `@require`ing of any dependencies
// @namespace	bp
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		*
// @run-at		document-start
// @noframes
// @grant		none
// ==/UserScript==

// How to work with Trusted Types: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API

// This is mainly to enable TamperMonkey to continue using scripts that have `@require` dependencies on sites with a restrictive `Trusted-Types` policy. At least until TM v4.14 comes out, the milestone has already been added: https://github.com/Tampermonkey/tampermonkey/issues/1334#event-5361683856
// Make sure this script is executed before the `@require`ing of any dependencies

// Although TT is still an experimental feature, Google seems quite keen to enforce it already, albeit half-assedly, where supported. Ugh! >.<

// This script provides pass-through policies to try to enable you to do what ever you want with the DOM, while trying not to disturb any defaults in place.
// Basically, if you have to create your own Trusted Types (e.g. TrustedHTML), and if the site's CSP allows for the creation of new policies, you can use a permissive policy to wrap your strings into a Trusted Type, like TrustedHTML, which the browser will then allow you to assign to the DOM.
// Best case scenario: The site has no default policy set. This allows us to specify our own, in which we can then allow everything (pass-through); this will restore all ability to modify the DOM.
// If we have to create a custom policy, all contents have to be piped through the relevant function of the TT Policy, like `TTP.createHTML("unsafe string contents")`, which will then return trusted contents.

const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
const prefix = GM_info.script.name;
var passThroughFunc = function (string, sink) {
    return string; // Anything passing through this function will be returned without change
}
var TTPName = "passthrough";
var TTP_default, TTP = { createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc }; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
var needsTrustedHTML = false;
function doit() {
    try {
        if (typeof window.isSecureContext !== 'undefined' && window.isSecureContext) {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                needsTrustedHTML = true;
                if (trustedTypes.defaultPolicy) {
                    log("TT Default Policy exists");
                    if (overwrite_default)
                        TTP = window.trustedTypes.createPolicy("default", TTP);
                    else
                        TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
                    TTP_default = trustedTypes.defaultPolicy;

                    log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
                }
                else {
                    TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
                }
                log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
            }
        }
    } catch (e) {
        log(e);
    }
}

function log(...args) {
    if ("undefined" != typeof (prefix) && !!prefix)
        args = [prefix + ":", ...args];
    if ("undefined" != typeof (debugging) && !!debugging)
        args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
    console.log(...args);
}

doit();