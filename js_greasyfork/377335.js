// ==UserScript==
// @name         Mturk Contribute to "Seen" API
// @namespace    salembeats
// @version      1.03
// @description  When browsing mTurk, notify that seen HITs have been seen.
// @author       Cuyler Stuwe (salembeats)
// @include      https://worker.mturk.com/
// @include      https://worker.mturk.com/projects
// @include      https://worker.mturk.com/projects/
// @include      https://worker.mturk.com/projects?page_size*
// @include      https://worker.mturk.com/?end_signin=1*
// @include      https://worker.mturk.com/?page_number*
// @include      https://worker.mturk.com/projects/?page_number=*
// @include      https://worker.mturk.com/?page_size=*&page_number=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.8/pako.min.js
// @grant        GM_xmlhttpRequest
// @connect      cuylerstuwe.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377335/Mturk%20Contribute%20to%20%22Seen%22%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/377335/Mturk%20Contribute%20to%20%22Seen%22%20API.meta.js
// ==/UserScript==

const USE_LOGS = false;
const log = USE_LOGS ? (text) => console.log(text) : (text) => {};

async function sendSeenLog(jsonStr) {
    const data = encodeURIComponent(jsonStr);
    const compressed = pako.deflate(data);

    fetch("https://www.cuylerstuwe.com:12121/seen", {
        method: "POST",
        body: new Blob([ compressed ], { type: 'application/octet-stream'})
    });
}

async function main() {
    const hitsTable = document.querySelector("[data-react-class*='hitSetTable']");
    if(!hitsTable) {return;}
    const hits = JSON.parse(hitsTable.dataset.reactProps).bodyData;
    const payload = JSON.stringify(hits);
    sendSeenLog(payload);
    log("Sent this payload of seen HITs:");
    log(payload);
}

main();