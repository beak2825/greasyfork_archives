// ==UserScript==
// @name               RYMLyricsViewer
// @name:de            RYMLyricsViewer
// @name:en            RYMLyricsViewer
// @namespace          sun/userscripts
// @version            1.1.3
// @description        Allows the viewing of song lyrics on Rate Your Music without a subscription.
// @description:de     Erlaubt das Ansehen von Songtexten auf Rate Your Music ohne ein Abonnement.
// @description:en     Allows the viewing of song lyrics on Rate Your Music without a subscription.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            https://rateyourmusic.com/song/*
// @match              https://rateyourmusic.com/song/*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/RYMLyricsViewer.png
// @copyright          2024-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/512130/RYMLyricsViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/512130/RYMLyricsViewer.meta.js
// ==/UserScript==

(() => {
  const frame = document.getElementById("page_song_section_lyrics_frame");
  const inner = document.getElementsByClassName(
    "page_song_section_lyrics_lyric_inner",
  );

  const observer = new MutationObserver(() => {
    const button = document.getElementById(
      "page_song_section_lyrics_view_full_btn",
    );
    const error = document.getElementsByClassName(
      "page_song_section_lyrics_status_error",
    );

    if (frame.classList.contains("show_overlay"))
      frame.classList.remove("show_overlay");

    if (button) button.remove();

    if (error.length)
      for (const element of Array.from(error))
        if (element.style.display !== "none") element.style.display = "none";
  });

  observer.observe(frame, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  unsafeWindow.rym.request
    .api("GET", `/api/1/lyric/${frame.dataset.lfid}/view`)
    .then((response) => response.json())
    .then((data) => {
      const lyric = data.lyric;
      const lfid = data.lfid || undefined;
      const writers = data.writers || undefined;
      const publishers =
        data.publishers.filter(Boolean).join(", ") || undefined;

      let html = '<div style="font-size: 0.75em; margin-top: 2em;">';
      if (lfid) html += `<p style="margin-bottom: 0;">LFID: ${lfid}</p>`;
      if (writers)
        html += `<p style="margin-bottom: 0;">Written by: ${writers}</p>`;
      if (publishers)
        html += `<p style="margin-bottom: 0;">Published by: ${publishers}</p>`;
      html += "</div>";

      for (const element of Array.from(inner)) {
        element.innerText = lyric;
        if (writers || publishers || lfid) element.innerHTML += html;
      }
    });
})();
