// ==UserScript==
// @name         Scout Prediction Data Download
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Add a download as CSV button to FFScout's Rate My Team page.
// @author       Sertalp B. Cay
// @license      MIT
// @match        https://rate-my-team.fantasyfootballscout.co.uk/players/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantasyfootballscout.co.uk
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.21/jquery.csv.js
// @downloadURL https://update.greasyfork.org/scripts/452117/Scout%20Prediction%20Data%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/452117/Scout%20Prediction%20Data%20Download.meta.js
// ==/UserScript==

var $ = window.jQuery;

function get_data() {
    let tags = $("table thead th").toArray().map(i => i.innerText);
    let values = $("table tbody tr").toArray().map(i => $(i).find("td").toArray().map(i => i.innerText));
    let minutes = $("table tbody tr").toArray().map(i => $(i).find(".tooltiptext").toArray().map(j => j.innerHTML.split(" ")).map(j => j[j.length-1]));
    let combined = values.map(i => Object.fromEntries(i.map((k,j) => [tags[j], k])));
    let xp_tags = tags.filter(i => i.includes("GW")).map(i => [i, i.split("GW")[1] + "_Pts"]);
    let min_tags = tags.filter(i => i.includes("GW")).map(i => i.split("GW")[1] +"_xMin");
    combined.forEach((e,i) => {
        min_tags.forEach((t,j) => {
            e[t] = minutes[i][j];
        });
        xp_tags.forEach((t,j) => {
            e[t[1]] = e[t[0]];
            delete e[t[0]];
        });
    });
    return combined;
}

function download_csv_data(csv, filename) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function parse_and_download() {
    let csv_str = get_data();
    let csv_text = window.jQuery.csv.fromObjects(csv_str);
    download_csv_data(csv_text, "ffscout.csv");
}

$(document).ready(function() {
  setTimeout(() => {
    let btn = document.createElement("button");
    btn.innerHTML = "Download as CSV";
    btn.addEventListener("click", parse_and_download);
    let e = document.querySelector(".table-container");
    e.prepend(btn);
  }, 500);
});
