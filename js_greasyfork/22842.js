// ==UserScript==
// @name           Google Timer Title Update
// @namespace      org.alorel.googletimer
// @author         Alorel <a.molcanovas@gmail.com>
// @description    Automatically updates the title when using Google's timer
// @include        https://*google.*/search?*
// @version        1.0.3
// @icon           https://cdn.rawgit.com/AlorelUserscripts/google-timer-title-switcher/master/icon.png
// @run-at         document-end
// @grant          GM_info
// @downloadURL https://update.greasyfork.org/scripts/22842/Google%20Timer%20Title%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/22842/Google%20Timer%20Title%20Update.meta.js
// ==/UserScript==

//launch
(function () {
    var container;

    if (container = document.querySelector("#act-timer-section>div")) {
        var timerArea = container.querySelector("div");

        try {
            document.querySelector('link[rel="shortcut icon"]').setAttribute("href", GM_info.script.icon);
        } catch (e) {
        }

        [".srg", "#searchform", "#extrares", "#top_nav", "#navcnt", "#appbar"].forEach(function (selector) {
            setTimeout(function () {
                try {
                    var el = document.querySelector(selector);
                    el.parentNode.removeChild(el);
                } catch (e) {
                    console.error(e);
                }
            }, 0);
        });

        (new MutationObserver(function () {
            if (container.classList.contains("act-tim-paused")) {
                document.title = "PAUSED";
            } else if (container.classList.contains("act-tim-finished")) {
                document.title = "FINISHED";
            } else {
                document.title = timerArea.innerText.trim();
            }
        })).observe(timerArea, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        });
    }
})();