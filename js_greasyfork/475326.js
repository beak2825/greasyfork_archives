// ==UserScript==
// @name     Datadog RUM log highlighting
// @description Optional userscript that adds highting to relevant RUM entries specified by https://greasyfork.org/en/scripts/475250-sentry-to-datadog-rum-and-log-buttons
// @version  1
// @grant    none
// @match    https://app.datadoghq.com/rum/sessions*
// @namespace happyviking
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/475326/Datadog%20RUM%20log%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/475326/Datadog%20RUM%20log%20highlighting.meta.js
// ==/UserScript==

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const main = async () => {

    await waitForElm('.dt-event_date') //Just waiting till it loads

    const url = new URL(window.location)
    const params = url.searchParams

    const from = params.get("highlight_from")
    const to = params.get("highlight_to")

    if (!from || !to) return

    document.querySelectorAll('tbody.log-dt-event').forEach(tbody => {
        let timestampText = tbody.querySelector(".dt-event_date").textContent //Example: Sep 13 15:39:44.766
        timestampText = timestampText.split(".")[0]
        timestampText += ` ${(new Date()).getFullYear()} UTC`
        const millis = (new Date(Date.parse(timestampText))).getTime()

        if (millis > from && millis < to) tbody.style.backgroundColor = "#FFE993"

    })
}

//There are probably cleaner ways to do this but I don't really care, this works and this
//is supposed to be fast
let currentPage = location.href;
main()
setInterval(() =>
{
    if (currentPage != location.href){
        currentPage = location.href;
        main()
    }
}, 500);
