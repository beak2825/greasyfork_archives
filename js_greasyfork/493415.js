// ==UserScript==
// @name     ZebraPuzzles Note Sheet Export
// @description Adds a button to the puzzle page on ZebraPuzzles.com, which generates and downloads a CSV spreadsheet to take notes on.
// @version  2
// @grant    none
// @match    *://www.zebrapuzzles.com/p/*
// @license  WTFPL
// @namespace https://greasyfork.org/users/1292794
// @downloadURL https://update.greasyfork.org/scripts/493415/ZebraPuzzles%20Note%20Sheet%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/493415/ZebraPuzzles%20Note%20Sheet%20Export.meta.js
// ==/UserScript==

function getZebraId() {
  return document
    .querySelector(".info-left div:nth-child(2)")
    .innerText.match(/^#([0-9]+)/)[1];
}

function generateCsv() {
  const cols = Array.from(
    document.querySelectorAll(".container-columns .column")
  );

  const col_keys = Array.from(cols[0].querySelectorAll("option")).map(
    (opt) => opt.innerText
  );

  const opts = Array.from(cols[1].querySelectorAll("select")).map((sel) =>
    Array.from(sel.querySelectorAll("option:nth-child(n+2)")).map(
      (opt) => opt.innerText
    )
  );

  let csv = ";1;2;3;4;5\n";

  col_keys.forEach((k, i) => {
    csv += k;
    for (let n = 0; n < 5; n++) {
      csv += ';"' + opts[i].join("\n") + '"';
    }
    csv += "\n";
  });

  return csv;
}

function download(text, filename) {
  const url = window.URL.createObjectURL(
    new Blob([text], { type: "text/csv" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}

const button = document.createElement("button");
button.style.position = "fixed";
button.style.bottom = "10px";
button.style.right = "10px";
button.innerText = "Generate note sheet";
button.addEventListener("click", () => {
  const id = getZebraId();
  console.log({ id });
  const csv = generateCsv();
  console.log({ csv });
  download(csv, `zebra-${id}.csv`);
});

document.body.appendChild(button);
