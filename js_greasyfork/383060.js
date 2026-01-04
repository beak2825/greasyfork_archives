"use strict";
// ==UserScript==
// @name            Taiwan ISRC to MusicBrainz
// @version         3.1.0
// @namespace       http://www.agj.cl/
// @description     Adds an “Add to MusicBrainz” button to any Taiwan ISRC website record entry page, which prefills the record submission form on MusicBrainz.
// @description.zh  在台灣ISRC網站裡的專輯頁上加「Add to MusicBrainz」（加到 MusicBrainz 音樂數據庫）的按鈕。
// @license         Unlicense
// @include         http*://isrc.ncl.edu.tw/C100/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/383060/Taiwan%20ISRC%20to%20MusicBrainz.user.js
// @updateURL https://update.greasyfork.org/scripts/383060/Taiwan%20ISRC%20to%20MusicBrainz.meta.js
// ==/UserScript==
(() => {
  // Utilities.
  const sel = document.querySelector.bind(document);
  const selIn = (el, selector) => el.querySelector(selector);
  const dom = (tag, attrs, ...children) => {
    const el = document.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach((attr) =>
        el.setAttribute(attr.toString(), attrs[attr] ?? ""),
      );
    children
      .map((obj) =>
        typeof obj === "string" ? document.createTextNode(obj) : obj,
      )
      .forEach((node) => el.appendChild(node));
    return el;
  };
  const counter = () => {
    let i = 0;
    return () => i++;
  };
  const onFullLoad = (cb) =>
    /complete/.test(document.readyState)
      ? setTimeout(cb, 0)
      : window.addEventListener("load", cb, { once: true });
  const checkValue = (value) => (value === undefined ? "" : value);
  const input = (name, value) =>
    dom("input", {
      name: name,
      value: checkValue(value?.toString()),
      type: "text",
    });
  const onChanged = (el, cb) => {
    const observer = new MutationObserver(cb);
    observer.observe(el, { childList: true, subtree: true });
    return observer.disconnect.bind(observer);
  };
  onFullLoad(async () => {
    if (sel("#musicbrainz-button")) {
      // We're already loaded.
      return;
    }
    // Add elements to DOM.
    const button = dom(
      "button",
      {
        class: "btn btn-outline-secondary pull-right",
        id: "musicbrainz-button",
      },
      "Add to MusicBrainz",
    );
    const form = dom("form", {
      name: "musicbrainz-submit",
      action: "https://musicbrainz.org/release/add",
      method: "post",
      "accept-charset": "utf-8",
      style: "display: none",
      target: "_blank",
    });
    const container = sel(".card-header");
    container?.insertAdjacentElement("afterbegin", form);
    container?.insertAdjacentElement("afterbegin", button);
    button.addEventListener("click", (e) => {
      form.submit();
      e.preventDefault();
    });
    sel("head")?.append(
      dom(
        "style",
        {},
        `
          #musicbrainz-button {
            float: right
          }`,
      ),
    );
    const table = sel(".table");
    const songsTable = sel("#songsTable");
    if (!table || !songsTable) {
      return;
    }
    const updateForm = () => {
      // Get values.
      const values = Array.from(table.querySelectorAll("tr") ?? []).reduce(
        (r, el) => {
          const label = selIn(el, "th")?.textContent?.trim() ?? "";
          const value = selIn(el, "td")?.textContent?.trim() ?? "";
          if (/表演者/.test(label)) r.artist = value;
          else if (/樂團名稱/.test(label)) r.artist = value;
          else if (/專輯名稱/.test(label)) r.title = value;
          else if (/發行公司/.test(label))
            r.label = value.match(/([A-Z]+\d+)?(.+)/)?.[2];
          else if (/產品編碼/.test(label)) r.cat = value;
          else if (/EAN\/UPC碼/.test(label)) r.barcode = value;
          else if (/發行日期/.test(label)) r.date = value.split(/[-.]/);
          return r;
        },
        {},
      );
      values.tracks = Array.from(songsTable.querySelectorAll("tr") ?? []).map(
        (el) => {
          const [hours, minutes, seconds] =
            el
              .querySelector("td.text-right")
              ?.textContent?.trim()
              .split(".")
              .map(Number) ?? [];
          const paddedSeconds = seconds?.toString().padStart(2, "0");
          return {
            title:
              el
                .querySelector("a")
                ?.textContent?.trim()
                .replace(/^\[\S+\] \d+[.](.*)$/, "$1") ?? "",
            length:
              hours && minutes
                ? `${hours * 60 + minutes}:${paddedSeconds}`
                : "0:00",
          };
        },
      );
      // Create form inputs.
      const baseInputs = [
        input("name", values.title),
        input("artist_credit.names.0.name", values.artist),
        input("labels.0.name", values.label),
        input("labels.0.catalog_number", values.cat),
        input("events.0.date.year", values.date?.[0]),
        input("events.0.date.month", values.date?.[1]),
        input("events.0.date.day", values.date?.[2]),
        input("events.0.country", "TW"),
        input("barcode", values.barcode),
        input("urls.0.url", window.location.href),
        input("urls.0.link_type", "82"),
        input("language", "cmn"),
        input("script", "Hant"),
        input("status", "official"),
        input("mediums.0.format", "cd"),
        dom(
          "textarea",
          { name: "edit_note" },
          "From Taiwan ISRC: " +
            window.location.href +
            "\n\n" +
            "Imported using the “Taiwan ISRC to MusicBrainz” userscript: https://github.com/agj/agj-userscripts/tree/master/Taiwan%20ISRC%20to%20MusicBrainz",
        ),
      ];
      const trackCount = counter();
      const trackInputs = values.tracks.flatMap(({ title, length }) => {
        const i = trackCount();
        return [
          input(`mediums.0.track.${i}.name`, title),
          input(`mediums.0.track.${i}.length`, length),
          input(`mediums.0.track.${i}.number`, i + 1),
        ];
      });
      // Replace form contents with new data.
      form.textContent = "";
      form.append(...baseInputs, ...trackInputs);
    };
    updateForm();
    // Listen to changes in data.
    onChanged(table, updateForm);
    onChanged(songsTable, updateForm);
  });
})();
