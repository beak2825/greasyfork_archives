// ==UserScript==
// @name         Dalhousie Auto Login
// @namespace    https://github.com/andylizi
// @version      0.1
// @description  Automatically click login buttons in Dalhousie University's IT system for you.
// @author       andylizi
// @license      MPL-2.0
// @match        https://dal.brightspace.com/d2l/login*
// @match        https://login.microsoftonline.com/*
// @match        https://dalonline.dal.ca/*
// @match        https://app.crowdmark.com/sign-in/dalhousie-university
// @icon         https://cdn.dal.ca/etc/designs/dalhousie/clientlibs/global/default/images/favicon/icon-192x192.png
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481979/Dalhousie%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/481979/Dalhousie%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const DAL_EMAIL_SUFFIX = "@dal.ca";
    const DAL_AZURE_TENANT_ID = "dbd5a2dd-nav2iax13wpi-ex0fh5rwrc9x3ea5okdcx7c4ruenta";

    const $ = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document);

    ({
        "dal.brightspace.com": onDocumentEnd(handleBrightspace),
        "login.microsoftonline.com": onDocumentEnd(handleMicrosoft),
        "dalonline.dal.ca": handleDalOnline,
        "app.crowdmark.com": onDocumentEnd(handleCrowdmark)
    })[location.hostname]?.();

    // Brightspace NetID login
    function handleBrightspace() {
        tryUntil(() => {
            const block = $("d2l-html-block")?.shadowRoot;
            if (!block) return false;

            Array.prototype.find
                .call(block.querySelectorAll("a"), (a) => a.textContent === "NetID@dal.ca Login")
                ?.click();
        });
    }

    // Microsoft account picker (appears when you have both school and personal account logged in)
    function handleMicrosoft() {
        if (document.title !== "Sign in to your account") return;

        // Only activates when the current tenant is Dalhousie
        const favicon = $("link#tenantFavicon");
        if (!favicon?.href?.includes(DAL_AZURE_TENANT_ID)) return;

        tryUntil(() => {
            const heading = $("[role=main] [role=heading][aria-level='1']");
            if (heading?.textContent !== "Pick an account") return false;

            const options = $$("[role=main] [role=listitem] > [role=button]:has(.tile-img)");
            if (!options.length) return false;

            const schoolAccounts = Array.prototype.filter.call(options, (opt) =>
                opt.textContent.split(/\n\s*/).find((line) => line.endsWith(DAL_EMAIL_SUFFIX))
            );
            if (schoolAccounts.length === 1) {
                schoolAccounts[0].click();
            }
        });
    }

    // DalOnline login
    function handleDalOnline() {
        const REDIRECT_PAYLOAD_KEY = "__userscript_auto_redirect_request__";
        const LAST_REDIRECT_KEY = "__userscript_auto_redirect_last__";

        function isRedirectInCooldown(now = Date.now(), cd = 10000) {
            const lastRedirect = sessionStorage.getItem(LAST_REDIRECT_KEY);
            return lastRedirect && now - parseInt(lastRedirect) < cd;
        }

        function trySetRedirect(validFor) {
            // Do not redirect again if we're <10s since the last one, to prevent infinite loop
            const now = Date.now();
            if (!isRedirectInCooldown(now)) {
                const req = [location.href, now + validFor];
                sessionStorage.setItem(REDIRECT_PAYLOAD_KEY, JSON.stringify(req));
                return true;
            }
            return false;
        }

        function tryExecuteRedirect(now = Date.now()) {
            const request = sessionStorage.getItem(REDIRECT_PAYLOAD_KEY);
            if (request) {
                sessionStorage.removeItem(REDIRECT_PAYLOAD_KEY);
                const [target, expires] = JSON.parse(request);
                if (now < expires) {
                    sessionStorage.setItem(LAST_REDIRECT_KEY, String(now));
                    location.href = target;
                    return true;
                }
            }
            return false;
        }

        if (location.pathname === "/PROD/twbkwbis.p_idm_logout") {
            // Stop meta refresh, https://stackoverflow.com/a/28436174
            try {
                document.documentElement.textContent = "";
            } catch (e) {
                console.error(e);
            }
            try {
                window.stop();
            } catch (e) {
                console.error(e);
            }

            if (tryExecuteRedirect()) {
                // Reset cooldown after logout redirects
                sessionStorage.removeItem(LAST_REDIRECT_KEY);
            } else {
                // The logout page redirects to www.dal.ca by default.
                location.href = "https://dalonline.dal.ca/";
            }
            return;
        } else if (
            location.pathname === "/PROD/twbkwbis.P_GenMenu" &&
            // When logging in using CAS
            (document.referrer === "https://dalonline.dal.ca/" ||
                // When logging in using the built-in form
                document.referrer === "https://dalonline.dal.ca/PROD/twbkwbis.P_ValLogin")
        ) {
            if (tryExecuteRedirect()) return;
        }

        const restoreAlert = detourFunction(
            unsafeWindow,
            "alert",
            (get) =>
                function alert(...args) {
                    if (args[0] === "Session timeout occurred") {
                        // Try redirecting back to the current URL after logging out
                        trySetRedirect(60000); // Expires in 60s
                        return;
                    }
                    return get().apply(this, args);
                }
        );

        onDocumentEnd(() => {
            restoreAlert();

            if (document.title === "Dalhousie Online: User Login") {
                const a = $(".infotextdiv a");
                if (a?.textContent === "Dalhousie Single Sign-on") {
                    // Try redirecting back to the current URL after logging in
                    trySetRedirect(2 * 60000); // Expires in 2min
                    a.click();
                }
            }
        })();
    }

    // Crowdmark login
    function handleCrowdmark() {
        Array.prototype.find.call($$("a.button"), (a) => a.textContent === "Sign in with Brightspace")?.click();
    }

    // Helper function for retrying the specified action as long as it returns false.
    // Useful for waiting target element to load.
    function tryUntil(callback, timeout = 3000) {
        const start = Date.now();
        const check = () => {
            if (callback.call(this) === false && Date.now() - start < timeout) {
                setTimeout(check, 100);
            }
        };
        check();
    }

    // Return a new function that delays running the callback until DOMContentLoaded
    function onDocumentEnd(callback) {
        return function (...args) {
            const handler = () => callback.apply(this, args);
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", handler, { once: true });
            } else {
                handler();
            }
        };
    }

    // Monkey-patch a function with proper support for exotic configuration.
    function detourFunction(obj, prop, makeTrampoline) {
        const oldDesc = Object.getOwnPropertyDescriptor(obj, prop);
        if (!oldDesc) throw new TypeError(`obj.${prop} is not a function`);

        // Create a "host" object for the original description to live on.
        const dummy = Object.create(null, { [prop]: oldDesc });
        const trampoline = makeTrampoline(() => Reflect.get(dummy, prop, obj));

        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: oldDesc.enumerable,
            get() {
                return trampoline;
            },
            set(newFn) {
                Reflect.set(dummy, prop, newFn, obj);
            }
        });

        const restore = () => {
            // We don't reuse `oldDesc` in case the value has changed since then
            Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(dummy, prop));
        };
        return restore;
    }
})();
