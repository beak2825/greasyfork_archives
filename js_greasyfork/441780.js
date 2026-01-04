// ==UserScript==
// @name              HumbleBundle download all ebook as zip
// @name:zh-CN        HB 慈善包电子书打包下载
// @namespace         moe.jixun
// @license           MIT
// @version           1.0.2
// @author            Jixun
// @description       Download all books with supplement as a single zip file.
// @description:zh-cn 打包所有电子书以及补充内容为一个 ZIP 文件。
// @match             https://www.humblebundle.com/downloads
// @match             https://www.humblebundle.com/downloads*
// @grant             none
// @require           https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/441780/HumbleBundle%20download%20all%20ebook%20as%20zip.user.js
// @updateURL https://update.greasyfork.org/scripts/441780/HumbleBundle%20download%20all%20ebook%20as%20zip.meta.js
// ==/UserScript==

function formatName(name) {
  return name.replace(/[/\\:'"]/g, "_");
}

async function addDownload(zip, fileName, url) {
  console.info("downloading: %s", fileName);
  const fileBlob = await fetch(url).then(r => r.blob());
  zip.file(fileName, fileBlob);
}

async function generateZipBlob(zip) {
  return new Promise((resolve, reject) => {
    let slices = [];

    // Use internal stream to support large zip file download (to some extend).
    const stream = zip.generateInternalStream({ type: "blob" });
    stream.on("data", (data) => {
      slices.push(data);
    });
    stream.on("error", (err) => {
      slices = null;
      reject(err);
    });
    stream.on("end", () => {
      const blob = new Blob(slices, { type: "application/zip" });
      slices = null;
      resolve(blob);
    });
    stream.resume();
  });
}

class CounterName {
  #counter = new Map();

  next(key) {
    const count = this.#counter.get(key) || 0;
    this.#counter.set(key, count + 1);
    if (count === 0) {
      return key;
    }
    return `${key} (${count + 1})`;
  }
}

async function doWork($el) {
  const $root = $el.parents(".wrapper");
  const dlFormat = $(".js-file-type-select", $root).val();

  if (dlFormat === 'Supplement') {
    alert('Please select a different format to download.');
    return;
  }

  const zip = new JSZip();
  const $rows = $(".js-download-rows .row", $root);
  $rows.css("opacity", 0.5);

  for (const row of Array.from($rows)) {
    const $row = $(row);
    const bookName = $row.data("human-name");
    const $dlBtns = $(".js-start-download a", $row);
    if ($dlBtns.length === 0) {
      console.warn("%s does not contain a download link", bookName);
      continue;
    }

    const counter = new CounterName();
    for(const $btn of Array.from($dlBtns)) {
      const name = $btn.textContent.trim().toLowerCase();
      const url = $btn.href;
      const ext = new URL(url).pathname.match(/\.([\w]+)$/)?.[1] || name;
      let fileName = bookName;
      if (name === 'supplement' || name === 'zip') {
        fileName = `${bookName} (Supplement)`;
      }
      fileName = `${counter.next(fileName)}.${ext}`;
      await addDownload(zip, fileName, url);

    }

    $row.css("opacity", 1).css("background", "#beffcf");
  }

  console.info("generating zip...");
  const packageName = document.title.replace(/\(.+/, "").trim();
  const zipName = `${formatName(packageName)}.zip`;

  // For debug purpose
  window.__last_zip = zip;

  const zipBlob = await generateZipBlob(zip);
  saveAs(zipBlob, zipName);
}

function main() {
  $("<style>")
    .text(".js-zip-download:disabled { opacity: 0.7 }")
    .appendTo(document.head);

  const $bulkDl = $(".js-bulk-download").text("BULK");
  $bulkDl.each((i, $bulkDlBtn) => {
    const $zipButton = $(
      '<button class="js-zip-download button-v2 blue rectangular-button" type="button">ZIP</button>'
    )
      .insertAfter($bulkDlBtn)
      .css("margin-left", "0.25em");

    $zipButton.click((e) => {
      e.preventDefault();
      e.stopPropagation();

      $zipButton.prop("disabled", true);
      doWork($zipButton)
        .catch(console.error)
        .finally(() => {
          $zipButton.prop("disabled", false);
        });
    });
  });
}

function boot() {
  if (boot.counter-- > 0) {
    if (!window.$ || $(".js-bulk-download").length === 0) {
      setTimeout(boot, 500);
    }
    main();
  }
}
boot.counter = 30;

setTimeout(boot);
