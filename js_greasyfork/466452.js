// ==UserScript==
// @name         Fotmob - JSON Data Pull
// @namespace    Violentmonkey Scripts
// @match        https://www.fotmob.com/match/*
// @author       Sertalp B. Cay
// @grant        none
// @version      0.1
// @license      MIT
// @description  5/16/2023, 11:54:48 AM
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.21/jquery.csv.js
// @downloadURL https://update.greasyfork.org/scripts/466452/Fotmob%20-%20JSON%20Data%20Pull.user.js
// @updateURL https://update.greasyfork.org/scripts/466452/Fotmob%20-%20JSON%20Data%20Pull.meta.js
// ==/UserScript==

var $ = window.jQuery;

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


function download_as_json() {
  let json_data = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps;
  debugger;
  // data = JSON.stringify(params, null, 4);
  var filename = json_data.general.matchId
  saveAsFile(filename + ".json", json_data)
}

$(document).ready(function() {

  debugger;

  // add a button after MatchFactsWrapper
  let dv = document.createElement("div");
  dv.style = "text-align: center;"
  let btn = document.createElement("button");
  btn.innerHTML = "Download as JSON";
  btn.addEventListener("click", download_as_json);
  let e = document.querySelector("#MatchFactsWrapper");
  btn.style = "color: black; background-color: white; padding: 5px; margin: 5px; border: 1px solid black;"
  dv.append(btn);
  e.prepend(dv);

});
