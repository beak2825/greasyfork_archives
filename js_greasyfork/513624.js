// ==UserScript==
// @name         Dynasty Scans Batch Downloader
// @namespace    mccranky83.github.io
// @version      2024-10-23
// @description  Download doujinshi from Dynasty Scans
// @author       Mccranky83
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @match        https://dynasty-scans.com/series/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dynasty-scans.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513624/Dynasty%20Scans%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513624/Dynasty%20Scans%20Batch%20Downloader.meta.js
// ==/UserScript==

class Semaphore {
  constructor() {
    this.counter = 200;
    this.queue = [];
  }
  async acquire() {
    this.counter > 0
      ? this.counter--
      : await new Promise((res) => {
          this.queue.push(res);
        });
  }
  release() {
    if (this.queue.length > 0) {
      this.queue.shift()();
      this.counter--;
    }
    this.counter++;
  }
}

(() => {
  "use strict";

  window.dl = dl;
  window.dlAll = dlAll;
  const s = new Semaphore();
  const h = {
    get(tar, key) {
      const val = Reflect.get(tar, key);
      if (typeof val === "object") return new Proxy(val, h);
      else return val;
    },
    set(tar, key, val) {
      Reflect.set(...arguments);
      const dl = $("#dl-all");
      if (key === "count") {
        Reflect.get(tar, key) ? dl.show() : dl.hide();
      }
      return true;
    },
  };
  const selected = new Proxy({ count: 0, index: [] }, h);
  $(".chapter-list dd").each((i, cur) => {
    $("<a>", {
      href: `javascript:;`,
      text: "Download",
      class: "label",
    }).appendTo(cur);
    $("<input>", { type: "checkbox", checked: false }).prependTo(cur);
  });
  $("dd")
    .slice(1)
    .find("a:last")
    .each((i, cur) => {
      $(cur).click(() => {
        dl(i + 1, s);
      });
    });
  $(".chapter-list").prepend(`
          <dd>
            <input type="checkbox">
            <span><b>Toggle All</b></span>
          </dd>
        `);
  const $checkbox = $("input[type='checkbox']");
  $checkbox.eq(0).on("change", function () {
    const checked = $(this).is(":checked");
    if (checked) {
      const length = $checkbox.length - 1;
      selected.count = length;
      selected.index = Array.from({ length }, (_, i) => i);
    } else {
      selected.count = 0;
      selected.index = [];
    }
    $checkbox.slice(1).each((_, cur) => {
      $(cur).prop("checked", checked);
    });
    console.log(JSON.stringify(selected));
  });
  $checkbox.slice(1).each(function (i) {
    $(this).on("change", () => {
      if ($(this).prop("checked")) {
        selected.count++;
        selected.index.push(i);
        selected.count === $checkbox.length - 1 &&
          $checkbox.eq(0).prop("checked", true);
      } else {
        selected.count--;
        selected.index.splice(selected.index.indexOf(i), 1);
        $checkbox.eq(0).prop("checked", false);
      }
      console.log(JSON.stringify(selected));
    });
  });
  $("<a>", {
    href: `javascript:;`,
    text: "Download all",
    class: "label",
    id: "dl-all",
    css: {
      display: "none",
    },
  }).appendTo("dd:first");
  $("a:contains('Download all')").click(() => {
    dlAll(selected, s);
  });
})();

async function dl(i, s) {
  const dl = $("dd")
    .eq(i + 1)
    .find("a:last");
  const text = dl.text();
  dl.text("Loading...");
  const zip = new JSZip();
  const name =
    $(".tag-title b").text() +
    "_" +
    $("dd")
      .eq(i + 1)
      .find("a:first")
      .text();
  const folder = zip.folder(name);
  const src =
    location.origin + $("dd").slice(1).eq(i).find("a:first").attr("href");
  const { pages, iframe } = await getPages(src);
  iframe.remove();
  await Promise.all(
    pages.map(async (page) => {
      const url = location.origin + page.image;
      const filename = page.image.split("/").slice(-1)[0];
      await s.acquire();
      await fetch(url, { signal: AbortSignal.timeout(30_000) })
        .then((res) => res.arrayBuffer())
        .then((res) => {
          folder.file(filename, res, { binary: true });
        })
        .catch(() => {})
        .finally(s.release.bind(s));
    }),
  );
  saveAs(
    await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    }),
    name,
  );
  dl.text(text);
}

async function dlAll(selected, s) {
  selected.index.forEach(async (i) => {
    await dl(i, s);
    selected.count = 0;
    selected.index = [];
    $("dd input").prop("checked", false);
  });
}

async function getPages(src) {
  return new Promise((res) => {
    const iframe = $("<iframe>", {
      src,
      css: {
        display: "none",
      },
    });
    iframe.appendTo("body");
    iframe.on("load", () =>
      res({
        pages: iframe[0].contentWindow.pages,
        iframe,
      }),
    );
  });
}
