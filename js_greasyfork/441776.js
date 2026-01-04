// ==UserScript==
// @name         WaniKani Bookmarks
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Bookmark items for later use
// @author       Gorbit99
// @include      /https://(www|preview).wanikani.com/((dashboard|contact|about|radicals|kanji|vocabulary).*)?$/
// @include      /https://(www|preview).wanikani.com/(radicals|kanji|vocabulary)/.+/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @require      https://greasyfork.org/scripts/441792-cidwwa/code/CIDWWA.js?version=1121974
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441776/WaniKani%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/441776/WaniKani%20Bookmarks.meta.js
// ==/UserScript==
(() => {
  "use strict";

  if (window.localStorage.getItem("wk-bookmarks") === null) {
    window.localStorage.setItem("wk-bookmarks", JSON.stringify({}));
  }

  let bookmark;
  const modal = window.createModal({ title: "Bookmarks" });
  const button = window.createButton({
    japaneseText: "ブックマーク",
    englishText: "Bookmarks",
    color: "green",
    hoverColor: "#96ff9a",
  });

  let bookmarks = JSON.parse(window.localStorage.getItem("wk-bookmarks"));
  let currentItem = location.href.match(/(radicals|kanji|vocabulary)\/.+/)?.[0];

  (function () {
    if (currentItem) {
      addBookmarkTag();

      const observer = new MutationObserver(() => {
        observer.disconnect();
        currentItem = location.href.match(
          /(radicals|kanji|vocabulary)\/.+/
        )?.[0];
        bookmark.remove();
        addBookmarkTag();
        observer.observe(document.body, {
          childList: true,
        });
      });
      observer.observe(document.body, {
        childList: true,
      });
    }
    addBookmarksButton();
    addBookmarksModal();
  })();

  const bookmarksStyle = window.createStyle();
  bookmarksStyle.setStyle({
    ".bookmark-tag": {
      position: "fixed",
      top: "0",
      left: "1em",
      borderLeft: "1em solid darkred",
      borderRight: "1em solid darkred",
      borderBottom: "1em solid transparent",
      height: "5em",
      transition: "height 0.25s",
      cursor: "pointer",
    },
    ".bookmark-list": {
      overflow: "auto",
      height: "40em",
      overscrollBehavior: "contain",
      width: "30em",
    },
    ".bookmark-radical": {
      backgroundImage: "linear-gradient(to bottom, #0af, #0093dd)",
      borderTop: "1px solid #88d7ff",
      borderBottom: "1px solid #069",
    },
    ".bookmark-kanji": {
      backgroundImage: "linear-gradient(to bottom, #f0a, #dd0093)",
      borderTop: "1px solid #f6c",
      borderBottom: "1px solid #c08",
    },
    ".bookmark-vocabulary": {
      backgroundImage: "linear-gradient(to bottom, #a0f, #9300dd)",
      borderTop: "1px solid #c655ff",
      borderBottom: "1px solid #80c",
    },

    ".bookmark-list-item a": {
      height: "66px",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      textDecoration: "none",
      color: "white",
      textShadow: "0 1px 0 rgb(0 0 0 / 30%)",

      "& .character": {
        fontSize: "27px",
      },

      "& ul": {
        listStyle: "none",
      },

      "& li": {
        fontSize: "12px",
        fontFamily:
          '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: "400",
        marginBottom: "0.25em",
        textAlign: "center",

        "&[lang=ja]": {
          fontFamily:
            '"Hiragino Kaku Gothic Pro", "Meiryo", "Source Han Sans Japanese", "NotoSansCJK", "TakaoPGothic", "Yu Gothic", "ヒラギノ角ゴ Pro W3", "メイリオ", "Osaka", "MS PGothic", "ＭＳ Ｐゴシック", "Noto Sans JP", "PingFang SC", "Noto Sans SC", sans-serif',
        },
      },
    },
  });

  function addBookmarkTag() {
    const container = document.querySelector("body");
    bookmark = document.createElement("div");
    bookmark.classList.add("bookmark-tag");
    container.append(bookmark);

    if (bookmarks[currentItem]) {
      bookmark.style.height = "8em";
    }

    bookmark.addEventListener("click", bookmarkClick);
  }

  function bookmarkClick() {
    bookmarks = JSON.parse(window.localStorage.getItem("wk-bookmarks"));
    if (bookmarks[currentItem]) {
      moveUpBookmark();
      delete bookmarks[currentItem];
      saveBookmarks();
    } else {
      moveDownBookmark();
      bookmarks[currentItem] = extractItem();
      saveBookmarks();
    }
  }

  function extractItem() {
    if (currentItem.startsWith("radicals")) {
      const radical = document.querySelector(
        ".page-header .subject-character"
      ).textContent;
      const name = document.querySelector(
        ".page-header__title-text"
      ).textContent;
      return {
        radical,
        name,
      };
    }
    if (currentItem.startsWith("kanji")) {
      const kanji = document.querySelector(
        ".page-header .subject-character"
      ).textContent;
      const meaning = document.querySelector(
        ".page-header__title-text"
      ).textContent;
      const reading = document
        .querySelector(
          ".subject-readings__reading--primary .subject-readings__reading-items"
        )
        .textContent.trim();
      return {
        kanji,
        meaning,
        reading,
      };
    }
    if (currentItem.startsWith("vocabulary")) {
      const vocabulary = document.querySelector(
        ".page-header .subject-character"
      ).textContent;
      const meaning = document.querySelector(
        ".page-header__title-text"
      ).textContent;
      const reading = document
        .querySelector(".reading-with-audio__reading")
        .textContent.trim();
      return {
        vocabulary,
        meaning,
        reading,
      };
    }
  }

  function moveDownBookmark() {
    bookmark.style.height = "8em";
  }

  function moveUpBookmark() {
    bookmark.style.height = "5em";
  }

  function saveBookmarks() {
    window.localStorage.setItem("wk-bookmarks", JSON.stringify(bookmarks));
  }

  function addBookmarksButton() {
    button.onTurnOn(() => modal.open());
    button.onTurnOff(() => modal.close());
  }

  function addBookmarksModal() {
    modal.setContent(`
        <ul class="bookmark-list multi-character-grid">
        </ul>
    `);

    modal.onOpen(() => {
      addItemsToList();
    });

    modal.onClose(() => {
      button.setState(false);
    });

    addItemsToList();
  }

  function addItemsToList() {
    const list = document.querySelector(".bookmark-list");
    list.innerHTML = "";

    for (let key in bookmarks) {
      if (key.startsWith("radicals")) {
        list.innerHTML += `
          <li class="bookmark-radical bookmark-list-item">
            <a style="padding: 12px" href="/${key}">
              <span class="character" lang="ja">${bookmarks[key].radical}</span>
              <ul>
                <li lang="ja"></li>
                <li>${bookmarks[key].name}</li>
              </ul>
            </a>
          </li>
        `;
      } else if (key.startsWith("kanji")) {
        list.innerHTML += `
            <li class="bookmark-kanji bookmark-list-item">
              <a style="padding: 12px" href="/${key}">
                <span class="character" lang="ja">${bookmarks[key].kanji}</span>
                <ul>
                  <li lang="ja">${bookmarks[key].reading}</li>
                  <li>${bookmarks[key].meaning}</li>
                </ul>
              </a>
            </li>
        `;
      } else if (key.startsWith("vocabulary")) {
        list.innerHTML += `
            <li class="bookmark-vocabulary bookmark-list-item">
              <a style="padding: 12px" href="/${key}">
                <span class="character" lang="ja">${bookmarks[key].vocabulary}</span>
                <ul>
                  <li lang="ja">${bookmarks[key].reading}</li>
                  <li>${bookmarks[key].meaning}</li>
                </ul>
              </a>
            </li>
        `;
      }
    }
  }
})();