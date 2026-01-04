// ==UserScript==
// @name         SerienStream.to | AniWorld.to - Stream Language Selector
// @namespace    https://greasyfork.org/en/scripts/535829-serienstream-to-aniworld-to-stream-language-selector
// @version      25.4
// @description  Selects the language of the stream on SerienStream.to and AniWorld.to to be displayed first, based on the language selection.
// @description:de Wählt die Sprache des Streams auf SerienStream.to und AniWorld.to, die zuerst angezeigt werden soll, basierend auf der Sprachauswahl.
// @author       mOlDaViA
// @license      MIT
// @match        https://s.to/serie/stream/*/staffel-*/episode-*
// @match        https://serienstream.to/serie/stream/*/staffel-*/episode-*
// @match        http://186.2.175.5/serie/stream/*/staffel-*/episode-*
// @match        https://aniworld.to/anime/stream/*/staffel-*/episode-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=s.to
// @grant        unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/535829/SerienStreamto%20%7C%20AniWorldto%20-%20Stream%20Language%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/535829/SerienStreamto%20%7C%20AniWorldto%20-%20Stream%20Language%20Selector.meta.js
// ==/UserScript==

(function () {
  "use strict";

  unsafeWindow.sortLanguage = function () {
    let languageOrder = [""];
    let langKeyMap = {};

    // >>> For Serienstream.to <<<
    // "en" = English Dub
    // "sub" = German Sub
    // "de" = German Dub
    // Example: ["sub", "de", "en"] will show German Sub first, then German Dub, and finally English Dub.
    if (
      window.location.href.includes("serienstream.to") ||
      window.location.href.includes("s.to") ||
      window.location.href.includes("186.2.175.5")
    ) {
      // Change the language order here:
      // switch the order by changing the position of the language codes in the array
      // e.g.
      // languageOrder.push("en");
      // languageOrder.push("sub");
      // languageOrder.push("de");
      // will show English Dub first, then German Sub, and finally German Dub.
      languageOrder.push("sub");
      languageOrder.push("en");
      languageOrder.push("de");
      langKeyMap = {
        sub: "3",
        en: "2",
        de: "1",
      };
    }

    // >>> For Aniworld.to <<<
    // "subDe" = German Sub
    // "subEn" = English Sub
    // "de" = German Dub
    // Example: ["subDe", "subEn", "de"] will show German Sub first, then English Sub, and finally German Dub.
    else if (window.location.href.includes("aniworld.to")) {
      // Change the language order here:
      // switch the order by changing the position of the language codes in the array
      // e.g.
      // languageOrder.push("subEn");
      // languageOrder.push("subDe");
      // languageOrder.push("de");
      // will show English Sub first, then German Sub, and finally German Dub.
      languageOrder.push("subDe");
      languageOrder.push("subEn");
      languageOrder.push("de");
      langKeyMap = {
        subDe: "3",
        subEn: "2",
        de: "1",
      };
    }

    let found = false;
    for (let i = 0; i < languageOrder.length; i++) {
      const lang = languageOrder[i];
      const langKey = langKeyMap[lang];
      const selector = `.hosterSiteVideo ul li[data-lang-key="${langKey}"]`;

      if ($(selector).length > 0) {
        $(selector).show();
        $(`.hosterSiteVideo ul li[data-lang-key!="${langKey}"]`).hide();
        $(`.changeLanguageBox img[data-lang-key="${langKey}"]`).addClass(
          "selectedLanguage"
        );
        $(`.changeLanguageBox img[data-lang-key!="${langKey}"]`).removeClass(
          "selectedLanguage"
        );

        checkInlinePlayer();
        found = true;
        break;
      }
    }

    if (!found) {
      $(".changeLanguageBox").after(
        "<small>Derzeit keine Streams für diese Episode verfügbar.</small><br /><br />"
      );
    }
  };
  unsafeWindow.sortLanguage();
})();