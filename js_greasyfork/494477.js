// ==UserScript==
// @name         Age Gate Bypass for Epic Games Store and Steam
// @namespace    http://t.me/LexShared
// @version      1
// @description  Bypass age verification gates by setting cookies on both Epic Games Store and Steam, allowing for seamless access to content without repeated age checks.
// @author       Lex Fradski
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAADBQTFRFR3BMAAAA////+Pj47u7u0dHRwcHBsLCwoKCgj4+Pf39/ampqUlJSNjY2Hh4eAAAA4/3B8wAAAAJ0Uk5TAMDt9w+IAAAEKElEQVR42uXaiYrjOBSF4Z4rXS13O+//ttOKI7J1tZVomC7oHxwjI/hQKWVI4h+P4b/pnx+/C5lov3qGcN8unyId2/H3QcJ/FhgH3I/hcQoA8zLgZsdshMectooU+llGpg4ncqFR6HhNCqYKpRTBY5ajEoUQQ2nk60hirqhUoJQgRMw8kMqUoETB1CCUJFMZiOhAjmnrSAEApYxGZSDHkGBEgUx1nCoxOuWB8BXBaBnJIgonCiYZiIhAibxTwhhTxVjoREgORETe25MCJLJEDqERlEYKRCLyeyQTX5DRmysZ50aEu5XUTBlAJcY90og+WUnBSChRwd2ejCOA9oT0Qh/uiQBGRH2uJK4b71dkAF6Ix0r0tpJYR0YAiMgGMvIrYhNxGslAkN7/PzEdATheXUcRqghVB0wNALzXZpfROOY0gP+yG2Thj5NlJNPHtXcQVu3nFnfZQJpKb55/DxgA5I+RZGzVWE+AUf0YYeGITnYCjHRnJcpW9BdA4LHY2BMrST2fAJd4490l2tMpMOqfI7e4DeDrfAM5B2ZpB8kaWKnuIBRYSrcQxVKxhVQs5Fq3kLwAjKlbCDm+Liawi8iXQLsBuwifA/sIBR7zVyBXdd1CFI/pKwAAsYU0PBZPwIx3kIyn+AqI476+g5DjMaFUxPGcbSGCx8Lxy9IOwlirbiDrd+ItxLBUbCENa/EOkrFW30HIsZRtIbIiSElbCJ8APoEdhOIc2EfsHNhH2jmwj2Q81V4BbhZ9B3m9E78CAGBbiOAxvwc0MEs7SMFTmUZ5ArO6g1DgsTqBx3QLMTwWgV8VW0jDWryDZKzVNpD1O/EWIlgr7SAFa5UdhAJLyRZiOC2sMW0hbQmgPSSfA/sI+RdAvwH7iJwD+0g5B/YRAmZfAvuInQP7SDsH9pFEa7Xv9eVzbPS9fhCwZrAmMIO4yDhcPdREFFCRgAtMREzEL2O4SKhHX0UiWYqsrD07hbBpsShs7K0YUKQVtOTe2Xq14F4aILV0K1JXEc/wILTesxCcoUWjZGFowwWpyFWgBb1osGkBpBQFZ38DiQNpfCCsUVqZSOEeqZcXpEEZy0hCCooqXcqBNKBYnogZK/d0QTrA1isgXSu0LCOouaFnDhFjeIUxazOtMAHQ3FkUHNYgzFYzO6BcDNbwvd7C9VYAQGgrzKUZRl6PWhPDyOaFrrGO0K0AoGmOsg+EbvHTV23J3kK6X5ofFRqi11plIuqu4+wTMTcmInkL4TLCqNKIazdgImImDytpvSWiGm8gM1zS+Tk0yYHMODCRnMcctrcQiREAhI9My7FHB9JEylBjIgHYOL+FcL3kQOQxFKlElHFF7DrNJlJqzceEdWSmAKLOv1aNeyRfN1ppxi2WEb+FIzdVm4N5fT4tgzjC0V/1U3mR7XL9Ew+R/S+Pw/0L1sgDkDFRL1YAAAAASUVORK5CYII=
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/agecheck/*
// @match        https://store.steampowered.com/*/agecheck*
// @match        https://store.epicgames.com/*/p/*
// @grant        none
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/494477/Age%20Gate%20Bypass%20for%20Epic%20Games%20Store%20and%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/494477/Age%20Gate%20Bypass%20for%20Epic%20Games%20Store%20and%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set cookies
    function setCookie(name, value, options) {
        document.cookie = `${name}=${value}${options}`;
    }

    // Common cookie options
    const secureOptions = "; Secure; Path=/; Max-Age=31536000; SameSite=None";

    // Domain specific actions
    if (location.hostname.includes("store.epicgames.com")) {
        if (document.cookie.indexOf('egs_age_gate_dob=') === -1) {
            setCookie("egs_age_gate_dob", "1970-01-01", "; path=/; domain=.store.epicgames.com;");
            window.location.reload();
        }
    } else if (location.hostname.includes("store.steampowered.com")) {
        setCookie("wants_mature_content", "1", secureOptions);

        const twentyFiveYearsAgo = ((Date.now() - 788_400_000_000) / 1000).toFixed();
        setCookie("birthtime", twentyFiveYearsAgo, secureOptions);

        window.addEventListener("DOMContentLoaded", () => {
            if (document.getElementById("app_agegate")) {
                location.reload();
            }
        });
    } else if (location.hostname.includes("steamcommunity.com")) {
        setCookie("wants_mature_content", "1", secureOptions);

        window.addEventListener("DOMContentLoaded", () => {
            const proceed = function (context = window) {
                if ("AcceptAppHub" in context) {
                    context.Proceed?.();
                }
            };

            if ("wrappedJSObject" in window) {
                proceed(window.wrappedJSObject);
            } else {
                const script = document.createElement("script");
                script.text = `"use strict";(${proceed})();`;
                (document.head ?? document.documentElement).prepend(script);
                script.remove();
            }
        });
    }
})();