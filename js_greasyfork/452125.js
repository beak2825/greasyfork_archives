// ==UserScript==
// @name         WhoScored JSON Data Download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a download button for WhoScored data
// @author       Sertalp B. Cay
// @license      MIT
// @match        https://www.whoscored.com/Matches/*/Live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whoscored.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/452125/WhoScored%20JSON%20Data%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/452125/WhoScored%20JSON%20Data%20Download.meta.js
// ==/UserScript==

(function() {

    let $ = window.jQuery;

    function download_as_json() {
        // var params = window.requirejs.s.contexts._.config.config.params;
        var params = require.config.params;
        // events = params.args.matchCentreData.events
        var saveAsFile = (filename, dataObjToWrite) => {
            const blob = new Blob([JSON.stringify(dataObjToWrite, null, 4)], { type: "application/json" });
            const link = document.createElement("a");

            link.download = filename;
            link.href = window.URL.createObjectURL(blob);
            link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

            const evt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            });

            link.dispatchEvent(evt);
            link.remove()
        };
        // data = JSON.stringify(params, null, 4);
        var filename = params.matchheader.matchId + '_' + params.args.matchCentreData.home.name + '_vs_' + params.args.matchCentreData.away.name;
        saveAsFile(filename + ".json", params)
    }

    $(document).ready(function() {
        let btn = document.createElement("button");
        btn.innerHTML = "Download as JSON";
        btn.addEventListener("click", download_as_json);
        let e = document.querySelector("#live-match");
        btn.style.color = 'black';
        e.prepend(btn);
    });


})()
