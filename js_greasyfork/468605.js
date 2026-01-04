// ==UserScript==
// @name         Lemmy Style Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Reformat widescreen desktop to look more like Reddit
// @author       mershed_perderders, CodingAndCoffee
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&amp;amp;amp;domain=itjust.works
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468605/Lemmy%20Style%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/468605/Lemmy%20Style%20Cleanup.meta.js
// ==/UserScript==

// adapted from, and credit to, https://github.com/soundjester/lemmy_monkey/blob/main/old.reddit

(function() {
    'use strict';
    //Thank you God!
    var isLemmy;
    try {
        isLemmy = document.head.querySelector("[name~=Description][content]").content === "Lemmy";
    } catch (_er) {
        isLemmy = false;
    }

    function isMobileUser() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    };

    //special thanks to StackOverflow - the one true source of all code, amen.
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function makeClickableHeaders () {
        document.querySelectorAll("button[aria-label='Collapse'], button[aria-label='Expand']").forEach(function (it) {
            if (typeof it.parentNode.dataset['clickableHeader'] !== 'string') {
                it.parentNode.addEventListener('click', function() {
                    it.click();
                });
                it.parentNode.setAttribute('data-clickable-header', true);
            }
        });
    }

    //specific Lemmy-to-Old.Reddit style reformats
    if (isLemmy) {
        GM_addStyle(".upvote, .downvote, .vote-bar>.unselectable { font-size: 1.5em; }");
        GM_addStyle(".container-fluid, .container-lg, .container-md, .container-sm, .container-xl {   margin-right: unset !important; margin-left: unset !important;}");
        GM_addStyle(".container, .container-lg, .container-md, .container-sm, .container-xl { max-width: 100% !important; }");
        GM_addStyle(".col-md-4 { flex: 0 0 20% !important; max-width: 20%; }");
        if (!isMobileUser()) {
            GM_addStyle(".col-md-8 { flex: 0 0 80% !important; max-width: 80%; }");
        }
        GM_addStyle(".col-sm-2 { flex: 0 0 9% !important; max-width: 10%; }");
        GM_addStyle(".col-1 { flex: 0 0 4% !important; max-width: 5%; }");
        GM_addStyle(".mb-2, .my-2 { margin-bottom: 0.3rem !important; }");
        GM_addStyle(".thumbnail {   min-height: 100px; max-height: 125px; }");
        GM_addStyle(".mb-3, .my-3 { margin-bottom: .2rem !important; }");
        GM_addStyle(".mt-3, .my-3 { margin-top: .2rem !important; }");
        GM_addStyle(".vote-bar { margin-top: 15px !important; }");
        if (!isMobileUser()) {
            GM_addStyle(".comments {  margin-left: 20px; }"); // removed max-width parameter that squished nested comments
        }

        // make header clickable to collapse/expand
        GM_addStyle(".d-flex:has([aria-label='Collapse']) { cursor: pointer; }");
        GM_addStyle(".d-flex:has([aria-label='Expand']) { cursor: pointer; }");
        GM_addStyle(".d-flex:has([aria-label='Collapse']) .flex-lg-grow-0 { flex-grow: 1 !important; }");
        GM_addStyle(".d-flex:has([aria-label='Expand']) .flex-lg-grow-0 { flex-grow: 1 !important; }");
        GM_addStyle(".d-flex:has([aria-label='Collapse']) .fw-bold::after { content: ' points' }");
        GM_addStyle(".d-flex:has([aria-label='Expand']) .fw-bold::after { content: ' points' }");

        if (!isMobileUser()) {
            makeClickableHeaders();
            setInterval(makeClickableHeaders, 50);
        }

        // rearrange upvote/downvote and reply buttons
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='reply'] { order: 1 }");
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='reply']::after { content: ' reply'; }");
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='Upvote'] { order: 2; margin-left: auto; }");
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='Downvote'] { order: 3 }");
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='more'] { order: 10 }");

        // upvote / downvote hover colors
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='Upvote']:hover { color: #3498db !important }");
        GM_addStyle(".comment .d-flex:nth-child(2) [aria-label='Downvote']:hover { color: #e74c3c !important }");
    }
})();