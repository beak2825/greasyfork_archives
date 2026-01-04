// ==UserScript==
// @name           Anti-Anti Adblock v1 (All Sites)
// @namespace      https://greasyfork.org/en/users/198860-zyenith
// @grant          none
// @description    A simple anti-adblock script, will work for typical anti-adblock stuff rolled out by Google.
// @author         zyenith
// @version        0.0.1
// @match          *://*/*
// @run-at         document-start
// @antifeature    Tracking, for compatibility info
// @require        https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/456855/Anti-Anti%20Adblock%20v1%20%28All%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456855/Anti-Anti%20Adblock%20v1%20%28All%20Sites%29.meta.js
// ==/UserScript==

const detected = {
    active: false,
    element: null
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (!node.classList) {
                return;
            }

            const allElements = document.getElementsByTagName("*");

            const element = Array.from(allElements).find((element) => element.classList.value.length && element.tagName === "DIV" && element.textContent.match(/Support\sFree\s\w+/));

            if (!element) {
                return;
            }

            detected.active = true;
            detected.element = element;

            observer.disconnect();

            const visibilityObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.style.visibility === "hidden") {
                        element.remove();
                        visibilityObserver.disconnect();
                    };
                });
            });

            visibilityObserver.observe(element, { attributes: true });
        });
    });
});

observer.observe(document, { childList: true, subtree: true });

setTimeout(observer.disconnect, 25000);

