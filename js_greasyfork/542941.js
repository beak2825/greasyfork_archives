// ==UserScript==
// @name        FontBrosRipper
// @namespace   adrian
// @author      adrian
// @match       https://www.fontbros.com/font-family/*
// @version     1.7
// @description Download Fonts from fontbros
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @require     https://unpkg.com/pako@2.1.0/dist/pako_inflate.min.js
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542941/FontBrosRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/542941/FontBrosRipper.meta.js
// ==/UserScript==

async function zlibDecompress(buffer) {
  const ds = new DecompressionStream("deflate");
  const writer = ds.writable.getWriter();
  writer.write(buffer);
  writer.close();
  return new Response(ds.readable).arrayBuffer();
}

// Based on https://github.com/arty-name/woff2otf/blob/master/woff2otf.js
async function WOFFtoTF(bufferIn) {
  const dataViewIn = new DataView(bufferIn);
  let offsetIn = 0;

  const read2 = () => {
    const uint16 = dataViewIn.getUint16(offsetIn);
    offsetIn += 2;
    return uint16;
  };

  const read4 = () => {
    const uint32 = dataViewIn.getUint32(offsetIn);
    offsetIn += 4;
    return uint32;
  };

  const WOFFHeader = {
    signature: read4(),
    flavor: read4(),
    length: read4(),
    numTables: read2(),
    reserved: read2(),
    totalSfntSize: read4(),
    majorVersion: read2(),
    minorVersion: read2(),
    metaOffset: read4(),
    metaLength: read4(),
    metaOrigLength: read4(),
    privOffset: read4(),
    privLength: read4(),
  };

  let entrySelector = 0;
  while (Math.pow(2, entrySelector) <= WOFFHeader.numTables) {
    entrySelector++;
  }
  entrySelector--;

  const searchRange = Math.pow(2, entrySelector) * 16;
  const rangeShift = WOFFHeader.numTables * 16 - searchRange;

  const tableDirectoryEntries = [];
  for (let i = 0; i < WOFFHeader.numTables; i++) {
    tableDirectoryEntries.push({
      tag: read4(),
      offset: read4(),
      compLength: read4(),
      origLength: read4(),
      origChecksum: read4(),
    });
  }

  const tableDataProcessingOrder = [...tableDirectoryEntries].sort(
    (a, b) => a.offset - b.offset
  );

  const outBufferSize =
    4 +
    2 +
    2 +
    2 +
    2 +
    tableDirectoryEntries.length * (4 + 4 + 4 + 4) +
    tableDirectoryEntries.reduce(
      (acc, entry) =>
        acc +
        entry.origLength +
        (entry.origLength % 4 === 0 ? 0 : 4 - (entry.origLength % 4)),
      0
    );

  const arrayOut = new Uint8Array(outBufferSize);
  const bufferOut = arrayOut.buffer;
  const dataViewOut = new DataView(bufferOut);
  let offsetOut = 0;

  const write2 = (uint16) => {
    dataViewOut.setUint16(offsetOut, uint16);
    offsetOut += 2;
  };

  const write4 = (uint32) => {
    dataViewOut.setUint32(offsetOut, uint32);
    offsetOut += 4;
  };

  write4(WOFFHeader.flavor);
  write2(WOFFHeader.numTables);
  write2(searchRange);
  write2(entrySelector);
  write2(rangeShift);

  let tableDataOffset = 12 + WOFFHeader.numTables * 16;
  tableDataProcessingOrder.forEach((entry) => {
    entry.outOffset = tableDataOffset;
    tableDataOffset += entry.origLength;
    if (tableDataOffset % 4 !== 0) {
      tableDataOffset += 4 - (tableDataOffset % 4);
    }
  });

  tableDirectoryEntries.forEach((tableDirectoryEntry) => {
    write4(tableDirectoryEntry.tag);
    write4(tableDirectoryEntry.origChecksum);
    write4(tableDirectoryEntry.outOffset);
    write4(tableDirectoryEntry.origLength);
  });

  let size = tableDataOffset;

  for (const tableDirectoryEntry of tableDataProcessingOrder) {
    const compressedData = bufferIn.slice(
      tableDirectoryEntry.offset,
      tableDirectoryEntry.offset + tableDirectoryEntry.compLength
    );

    let uncompressedData;
    if (tableDirectoryEntry.compLength !== tableDirectoryEntry.origLength) {
      const decompressedBuffer = await zlibDecompress(
        new Uint8Array(compressedData)
      );
      uncompressedData = new Uint8Array(decompressedBuffer);
    } else {
      uncompressedData = new Uint8Array(compressedData);
    }

    arrayOut.set(uncompressedData, tableDirectoryEntry.outOffset);
    let offset =
      tableDirectoryEntry.outOffset + tableDirectoryEntry.origLength;

    let padding = 0;
    if (offset % 4 !== 0) {
      padding = 4 - (offset % 4);
    }
    arrayOut.set(
      new Uint8Array(padding),
      tableDirectoryEntry.outOffset + tableDirectoryEntry.origLength
    );
  }

  return bufferOut.slice(0, size);
}

const downloadImages = async () => {
  const progressBar = document.createElement("div");
  progressBar.id = "dl-progress";
  progressBar.textContent = "Starting...";
  progressBar.style.padding = "20px";
  progressBar.style.backgroundColor = "black";
  progressBar.style.borderRadius = "10px";
  progressBar.style.border = "1px solid white";
  progressBar.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
  progressBar.style.position = "fixed";
  progressBar.style.left = "50%";
  progressBar.style.top = "50%";
  progressBar.style.transform = "translate(-50%,-50%)";
  progressBar.style.zIndex = "9999";
  progressBar.style.fontSize = "20px";
  progressBar.style.color = "white";
  document.body.appendChild(progressBar);
  const html = await fetch(window.location.href).then(r => r.text());
  const fontElements = [...html.matchAll(/<link rel="stylesheet" href="\/library\/styles\/webfont-[A-Z0-9]+\.css" media="print" onload="this\.media='all'">/g)].map(elMatch => elMatch[0]);
  console.log(fontElements)
  const names = Object.fromEntries([...document.getElementById("preview-font-style").options].map((el) => {
    return [el.value, el.innerText]
  }))
  console.log(names);
  const fontCSSUrls = fontElements.flatMap(elHTML => {
    const url = elHTML.match(/\/library\/styles\/webfont-[A-Z0-9]+\.css/)[0];
    const fontID = url.replace("/library/styles/webfont-", "").replace(".css", "");
    const name = names[fontID];
    if (!name) {
      return [];
    }
    return [{ name, url }];
  });
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
    bufferedWrite: true,
  });
  progressBar.textContent = `${fontCSSUrls.length} fonts found.`;
  let i = 0;
  await Promise.all(fontCSSUrls.map(async (font) => {
    const css = await fetch(font.url).then(r => r.text());
    const fontDataURI = css.match(/data:application\/font-woff;base64,.*'\) format\("woff"\)/)[0].replace(`') format("woff")`, "");
    const fontData = await fetch(fontDataURI).then(r => r.arrayBuffer())
    const convertedFontDataBuffer = await WOFFtoTF(fontData)
    const convertedFontData = new Blob([convertedFontDataBuffer]);
    zipWriter.add(
      `${font.name}.${btoa(String.fromCharCode(...new Uint8Array(convertedFontDataBuffer.slice(0, 4)))) === "AAEAAA==" ? "ttf" : "otf"}`,
      new zip.BlobReader(convertedFontData),
      {},
    );
    i++;
    progressBar.textContent = `fetched font ${i + 1}/${images.length}`;
  }))
  progressBar.textContent = "font fetching done. generating zip";
  const blobURL = URL.createObjectURL(await zipWriter.close());
  const link = document.createElement("a");
  link.href = blobURL;
  link.download = `${document.title.replace(" | Font Bros", "")}.zip`;
  link.click();
  progressBar.textContent = "done.";
  setTimeout(() => progressBar.remove(), 1000);
};

const dlButton = document.createElement("button");
dlButton.id = "dl-button";
dlButton.textContent = "Download";
dlButton.style.padding = "5px 12px";
dlButton.style.backgroundColor = "#ef0029";
dlButton.style.borderRadius = "8px";
dlButton.style.border = "3px solid #000";
dlButton.style.boxShadow = "0 4px 0 #000";
dlButton.style.position = "fixed";
dlButton.style.left = "5px";
dlButton.style.bottom = "5px";
dlButton.style.zIndex = "9999";
dlButton.style.fontSize = ".75rem";
dlButton.style.fontWeight = "800";
dlButton.style.color = "white";
dlButton.addEventListener("click", () => downloadImages());
document.body.appendChild(dlButton);


VM.shortcut.register("cm-s", () => downloadImages());
VM.shortcut.enable();

GM_registerMenuCommand("Download Fonts (Ctrl/Cmd + S)", () =>
  downloadImages(),
);
