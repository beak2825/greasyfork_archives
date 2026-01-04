// ==UserScript==
// @name            CDJournal to MusicBrainz
// @name:ja         CDJournal から MusicBrainz に
// @version         1.0.3
// @namespace       http://www.agj.cl/
// @description     Adds a link "MusicBrainz に投稿" to any CDJournal.co.jp record entry page (right of the artist/record title) that opens the Add Release form in MusicBrainz, prefilling it with that record's information.
// @description:ja  CDJournal.com のレコードページに「MusicBrainz に投稿」というリンクを追加します（作品名の右側に）。リンクをクリックすると、レコードの詳細で書き込み済み MusicBrainz の Add Release（リリースを投稿）ページが開かれます。
// @license         Unlicense
// @include         http*://artist.cdjournal.com/d/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/39540/CDJournal%20to%20MusicBrainz.user.js
// @updateURL https://update.greasyfork.org/scripts/39540/CDJournal%20to%20MusicBrainz.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Utilities.

  const sel = document.querySelector.bind(document);
  const selAll = document.querySelectorAll.bind(document);
  const selIn = (el, selector) => el.querySelector(selector);
  const get = (prop) => (obj) => obj[prop];
  const esc = encodeURIComponent;
  const dom = (tag, attrs, ...children) => {
    const el = document.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach((attr) => el.setAttribute(attr, attrs[attr]));
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
  const flatten = (list) =>
    list.reduce(
      (r, item) =>
        Array.isArray(item) ? r.concat(flatten(item)) : r.concat([item]),
      [],
    );

  // Get values.

  const values = Array.from(selAll("#discdata_right_body .discdata li")).reduce(
    (r, el) => {
      const text = el.textContent;
      if (/^アーティスト/.test(text)) r.artist = selIn(el, "div").textContent;
      else if (/^原題/.test(text)) r.title = selIn(el, "div").textContent;
      else if (/^形態/.test(text))
        r.type = selIn(el, "div").textContent.split(" /")[0];
      else if (/^レーベル/.test(text)) r.label = selIn(el, "div").textContent;
      else if (/^規格品番/.test(text)) r.cat = selIn(el, "div").textContent;
      else if (/^発売日/.test(text))
        r.date = selIn(el, "div").textContent.split("/");
      return r;
    },
    {},
  );
  values.tracks = Array.from(selAll(".songlist .song .song_title")).map(
    get("textContent"),
  );
  if (!("title" in values))
    values.title = sel("#center_body h1").textContent.match(/ \/ (.+)$/)[1];

  // Add submit link.

  const checkType = (raw) =>
    raw === "アルバム"
      ? "album"
      : raw === "ミニアルバム"
        ? "ep"
        : raw === "シングル"
          ? "single"
          : "";

  const link = dom("a", null, "MusicBrainz に投稿");
  const input = (name, value) =>
    dom("input", { name: name, value: value, type: "text" });
  const form = dom(
    "form",
    {
      name: "musicbrainz-submit",
      action: "https://musicbrainz.org/release/add",
      method: "post",
      "accept-charset": "utf-8",
      style: "display: none",
    },
    input("name", values.title),
    input("artist_credit.names.0.name", values.artist),
    input("type", checkType(values.type)),
    input("labels.0.name", values.label),
    input("labels.0.catalog_number", values.cat),
    input("events.0.date.year", values.date[0]),
    input("events.0.date.month", values.date[1]),
    input("events.0.date.day", values.date[2]),
    input("events.0.country", "JP"),
    input("language", "jpn"),
    input("script", "Jpan"),
    input("status", "official"),
    input("mediums.0.format", "cd"),
    input("edit_note", "From CDJournal: " + window.location.href),
  );
  const container = dom("div", { id: "musicbrainz-submit" }, link, form);

  const trackCount = counter();
  flatten(
    values.tracks.map((title) => {
      const i = trackCount();
      return [
        input(`mediums.0.track.${i}.name`, title),
        input(`mediums.0.track.${i}.number`, i + 1),
      ];
    }),
  ).map((el) => form.appendChild(el));

  sel("#artist_sub").appendChild(container);
  link.addEventListener("click", (e) => {
    form.submit();
    e.preventDefault();
  });

  sel("head").appendChild(
    dom(
      "style",
      null,
      `
	#musicbrainz-submit a {
		cursor: pointer;
		font-size: 1.2em;
		font-weight: bold;
	}
`,
    ),
  );
})();
