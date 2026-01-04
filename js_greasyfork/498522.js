// ==UserScript==
// @name         SharePoint list download link
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Add download link to SharePoint list items that contain links to files
// @author       apple-phi
// @match        *://*/*.aspx*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498522/SharePoint%20list%20download%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/498522/SharePoint%20list%20download%20link.meta.js
// ==/UserScript==
"use strict";

(async () => {
  const { BlobWriter, HttpReader, ZipWriter } = await import(
    "https://unpkg.com/@zip.js/zip.js/index.js"
  );
  for (const table of document.querySelectorAll(
    "table:has(> tbody > tr > td.ms-vb-title > .ms-vb.itx > a[href])"
  )) {
    const availableFiles = table.querySelectorAll(
      "td.ms-vb-title > .ms-vb.itx > a[href]"
    );
    let anchor = document.createElement("a");
    anchor.href = "#";
    anchor.textContent = `Zipped 0 of ${availableFiles.length} files`;
    table.closest("div").prepend(anchor);
    let progress = 0;
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    async function addFileToZip(link) {
      const absUrl = new URL(link, window.location.origin).href;
      const segments = absUrl.split("/");
      const filename = segments.pop() || segments.pop();
      await zipWriter.add(decodeURIComponent(filename), new HttpReader(absUrl));
      progress++;
      anchor.textContent = `Zipped ${progress} of ${availableFiles.length} files`;
    }
    await Promise.all(
      [...availableFiles].map((a) => a.getAttribute("href")).map(addFileToZip)
    ).then(async () => {
      anchor.textContent = "Download zip file";
      anchor.href = URL.createObjectURL(await zipWriter.close());
      anchor.download = `${
        document.querySelector("span.ms-sitemapdirectional").textContent ||
        "download"
      }.zip`;
    });
  }
})();
