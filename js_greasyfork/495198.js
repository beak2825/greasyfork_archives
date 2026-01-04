// ==UserScript==
// @name         Linkedvertise Bypass
// @namespace    PeixeDev
// @version      0.3
// @description  Stop being used to ads.
// @author       PeixeDev
// @run-at       document-start
// @match        linkvertise.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @license JoaoP
// @downloadURL https://update.greasyfork.org/scripts/495198/Linkedvertise%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/495198/Linkedvertise%20Bypass.meta.js
// ==/UserScript==

function applyRequest(url, callback) {
    GM_xmlhttpRequest ({
        method:         "GET",
        responseType:   "json",
        url:            url,
        onload: callback,
    });
}

const url = window.location.pathname;

window.stop();

applyRequest("https://linkvertise.net/api/v1/redirect/link/static" + url + "?origin=", function(json) {

    const response = json.response;
    const link = response.data.link.id
    const serial = btoa(JSON.stringify({timestamp: (new Date).getTime(), random: "6548307", link_id: link}));

    console.log("Found link id: " + link);
    console.log("Created serial: " + serial);

    applyRequest("https://linkvertise.net/api/v1/redirect/link" + url + "/target?serial=" + serial, function(json) {
        const finalurl = decodeURIComponent(JSON.parse('{"' + decodeURI(json.response.data.target.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}').k);
        console.log("Final url: " + finalurl);
        window.location.replace(json.response.data.target);
    });

});