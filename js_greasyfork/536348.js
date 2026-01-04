// ==UserScript==
// @name           EzGif.com – True Menu [Ath]
// @description    Complete menu with all tools on Ez Gif (EzGif.com).
// @namespace      athari
// @author         Athari (https://github.com/Athari)
// @copyright      © Prokhorov ‘Athari’ Alexander, 2024–2025
// @license        MIT
// @homepageURL    https://github.com/Athari/AthariUserJS
// @supportURL     https://github.com/Athari/AthariUserJS/issues
// @version        1.0.0
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ezgif.com
// @match          https://*.ezgif.com/*
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_info
// @run-at         document-start
// @require        https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require        https://cdn.jsdelivr.net/npm/string@3.3.3/dist/string.min.js
// @require        https://cdn.jsdelivr.net/npm/@athari/monkeyutils@0.5.6/monkeyutils.u.min.js
// @resource       script-urlpattern  https://cdn.jsdelivr.net/npm/urlpattern-polyfill/dist/urlpattern.js
// @tag            athari
// @downloadURL https://update.greasyfork.org/scripts/536348/EzGifcom%20%E2%80%93%20True%20Menu%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/536348/EzGifcom%20%E2%80%93%20True%20Menu%20%5BAth%5D.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const convertersUpdatePeriod = 1000 * 60 * 60 * 24 * 7;

  const { waitForDocumentReady, h, u, f, download, attempt, ress, scripts, els, opts } =
    //require("../@athari-monkeyutils/monkeyutils.u"); // TODO
    athari.monkeyutils;

  const res = ress(), script = scripts(res);
  const eld = doc => els(doc, {
    lnkConverters: '#converter-list a',
    ath: {
      selConvFrom: '#ath-conv-from', selConvTo: '#ath-conv-to', btnConvUpdate: '#ath-conv-update',
      lstConverters: "#ath-converters", itmConverter: "#ath-converters li",
    },
  }), el = eld(document);
  const opt = opts({
    converters: [], tools: [], lastConvertersUpdateTime: null, lastConvertersUpdateVersion: null,
  });

  S.extendPrototype();
  Object.assign(globalThis, globalThis.URLPattern ? null : await script.urlpattern);

  await waitForDocumentReady();
  console.log(GM_info);
  const scriptVersionSignature = `${GM_info.script.version}@${new Date(GM_info.script.lastModified ?? 0).toISOString()}`;

  const formatNames = {
    WEBP: "Web Picture (.WEBP)",
    PDF: "Portable Document Format (.PDF)",
    GIF: "Graphics Interchange Format (.GIF)",
    JPG: "JPEG (.JPG .JPEG)",
    JPEG: "JPEG (.JPG .JPEG)",
    APNG: "Animated Portable Network Graphics (.PNG .APNG)",
    JXL: "JPEG XL (.JXL)",
    AVIF: "AV1 Image File (.AVIF)",
    MNG: "Multiple-image Network Graphics (.MNG)",
    MVIMG: "Android JPEG Motion Picture (.MVIMG)",
    ANI: "Animated Windows Cursor (.ANI)",
    HEIC: "HEVC High Efficiency Image File (.HEIC)",
    BMP: "Windows Bitmap (.BMP)",
    BPG: "Better Portable Graphics (.BPG)",
    TGS: "Lottie / Telegram Animated Sticker (.TGS .LOTTIE .JSON)",
    TIFF: "Tagged Image File Format (.TIF .TIFF)",
    HEIF: "High Efficiency Image File (.HEIF)",
    SVG: "Scalable Vector Graphics (.SVG)",
    PNG: "Portable Network Graphics (.PNG)",
    JP2: "JPEG 2000 (.JP2 .J2K .JPM)",
    WEBM: "Web Media (.WEBM)",
    MKV: "Matroska Video (.MKV)",
    MOV: "QuickTime File (.MOV)",
    '3GP': "3GPP File (.3GP)",
    MO: "Compiled GetText Portable Object (.MO)",
    PO: "GetText Portable Object (.PO)",
    CSV: "Comma-Separated Values (.CSV)",
    MP3: "MPEG Audio Layer III (.MP3)",
    MP4: "MPEG-4 Video (.MP4)",
    SPRITE: "Sprite Sheet",
    SPRITES: "Sprite Sheet",
    DATAURI: "Data URI (DATA:)",
  };
  const allTools = {
    Optimize: {
      "GIF": 'optimize',
      "GIF fix": 'repair',
      "PNG": 'optipng',
      "JPEG": 'optijpeg',
      "WEBP": 'optiwebp',
      "Video": 'video-compressor',
    },
    Make: {
      "GIF": 'maker',
      "WEBP": 'webp-maker',
      "APNG": 'apng-maker',
      "AVIF": 'avif-maker',
      "JXL": 'jxl-maker',
      "MNG": 'mng-maker',
    },
    "Extract frames": {
      "GIF": 'split',
      "JPEG": 'video-to-jpg',
      "PNG": 'video-to-png',
      "Sprites": 'sprite-cutter',
    },
    Generate: {
      "QR code": 'qr-generator',
      "Barcode": 'barcode-generator',
    },
    Info: {
      "Metadata": 'view-metadata',
    },
  };

  el.tag.head.insertAdjacentHTML('beforeEnd', /*html*/`
    <style>
      :root {
        color-scheme: light dark;
        --ath-color-background: #fff;
        --ath-color-shadow: #0016;
        --ath-shadow-main: 1px 1px 3px var(--ath-color-shadow);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --ath-color-background: #212830;
          --ath-color-shadow: #000;
        }
      }
      body {
        display: grid;
        grid-template-areas:
          ". menu main ."
          ". menu foot .";
        grid-template-columns: 1fr 380px auto 1fr;
        min-height: calc(100vh + 1px);
        #wrapper {
          grid-area: main;
          width: auto;
          max-width: 1420px;
          box-shadow: var(--ath-shadow-main);
        }
        footer {
          grid-area: foot;
        }
        .ath-menu {
          box-sizing: border-box;
          grid-area: menu;
          align-self: start;
          position: sticky;
          top: 10px;
          max-height: calc(100vh - 20px);
          margin: 8px;
          padding: 20px;
          display: flex;
          flex-flow: column;
          gap: .7em;
          background: var(--ath-color-background);
          border-radius: 2px;
          box-shadow: var(--ath-shadow-main);
          h3 {
            margin: 0;
          }
        }
      }
      #content {
        #sidebar {
          display: none;
        }
        #main {
          margin: 0;
        }
      }
      #ath-conv-ctls {
        display: flex;
        flex-flow: row;
        gap: .5rem;
        select {
          flex: 1;
          width: 100%;
        }
      }
      .ath-tool-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0 1em;
        min-height: fit-content;
        margin: 0;
        padding: 0;
        list-style-type: none;
        overflow: hidden auto;
        &.ath-compact {
          grid-template-columns: repeat(4, 1fr);
          gap: 0 .5em;
        }
        li {
          min-width: fit-content;
        }
      }
      #ath-converters {
        height: fit-content;
        min-height: 2lh;
        a {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-right: 2ch;
          strong {
            opacity: 0.5;
          }
        }
      }
      .ath-hidden {
        display: none;
      }
    </style>`);

  const getFormatName = s => formatNames[s.split(" ")[0].toUpperCase()] ?? s;

  const updateConverters = () => attempt("update converters", async () => {
    const doc = await download("https://ezgif.com/converters", 'html');
    const elDoc = eld(doc);
    const converters = [];
    for (const lnkConv of elDoc.all.lnkConverters) {
      const [ , convFrom, convTo ] = lnkConv.innerText.trim().match(/^(\S+) to (\S+)$/);
      converters.push({
        name: lnkConv.getAttribute('name'),
        title: lnkConv.getAttribute('title'),
        href: lnkConv.getAttribute('href'),
        from: convFrom,
        to: convTo,
      });
    }
    opt.converters = converters;
  });

  const updateControls = () => attempt("update controls", () => {
    const htmlConvertersOptions = (dir) => {
      const formats = _(opt.converters).groupBy(dir).map((cs, format) => ({
        format,
        count: cs.length,
        names: cs.map(c => c.name).join(" "),
      })).value();
      return /*html*/`
        <option value="-">${h(dir)}</option>
        ${formats.map(f => /*html*/`
          <option value="${u(f.format)}" data-converter-names="${h(f.names)}">${h(formatNames[f.format] ?? f.format)} (${h(f.count)})</option>
        `).join("")}
      `;
    };
    el.ath.selConvFrom.innerHTML = htmlConvertersOptions('from');
    el.ath.selConvTo.innerHTML = htmlConvertersOptions('to');
    el.ath.lstConverters.innerHTML = opt.converters.map(c => /*html*/`
      <li data-name="${h(c.name)}" data-from="${h(c.from)}" data-to="${h(c.to)}">
        <a href=${h(c.href)} title="${getFormatName(c.from)} -> ${getFormatName(c.to)}">
          <div>${h(`${c.from}`)}</div>
          <strong>⇒</strong>
          <div>${h(`${c.to}`)}</div>
        </a>
      </li>
    `).join("");
  });

  const expandMenu = () => attempt("expand menu", async () => {
    const updateConvertersList = () => {
      const [ convFrom, convTo ] = [ el.ath.selConvFrom.value, el.ath.selConvTo.value ];
      for (const elConv of el.ath.all.itmConverter)
        elConv.classList.toggle('ath-hidden', !(
          (convFrom === '-' || convFrom === elConv.dataset.from) &&
          (convTo === '-' || convTo === elConv.dataset.to)));
    };
    const updateConvertersAndControls = async () => {
      el.ath.btnConvUpdate.innerText = "Updating...";
      await updateConverters();
      await updateControls();
      el.ath.btnConvUpdate.innerText = "Update";
    };
    el.tag.footer.insertAdjacentHTML('beforeBegin', /*html*/`
      <div class="ath-menu">

        <h3>Convert</h3>
        <div id="ath-conv-ctls">
          <select id="ath-conv-from" title="Convert from">loading</select>
          <select id="ath-conv-to" title="Convert to">loading</select>
          <button id="ath-conv-update">Update</button>
        </div>
        <ul class="ath-tool-list" id="ath-converters">Loading...</ul>

        ${Object.entries(allTools).map(([verb, tools]) => /*html*/`
          <h3>${verb}</h3>
          <ul class="ath-tool-list ath-compact">
            ${Object.entries(tools).map(([title, slug]) => /*html*/`
              <li><a href="/${slug}" title="${getFormatName(title)}">${title}</a></li>
            `).join("")}
          </ul>
        `).join("")}

      </div>`);
    el.ath.btnConvUpdate.onclick = updateConvertersAndControls;
    el.ath.selConvFrom.onchange = updateConvertersList;
    el.ath.selConvTo.onchange = updateConvertersList;
    updateControls();
    updateConvertersList();
  });

  if (opt.lastConvertersUpdateTime == null ||
      opt.lastConvertersUpdateTime + convertersUpdatePeriod > Date.now() ||
      opt.lastConvertersUpdateVersion != scriptVersionSignature) {
    await updateConverters();
    opt.lastConvertersUpdateTime = Date.now();
    opt.lastConvertersUpdateVersion =scriptVersionSignature;
  }
  await expandMenu();
})();