// ==UserScript==
// @name         Export Twitter Bookmarks
// @description  Exports the data of your Twitter bookmarks into a JSON file that you can download
// @author       GPP (https://github.com/gpp-0)
// @version      1
// @namespace    https://github.com/gpp-0
// @match        https://x.com/i/bookmarks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513337/Export%20Twitter%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/513337/Export%20Twitter%20Bookmarks.meta.js
// ==/UserScript==

const bookmarksFound = new Event("bookmarksFound");

const tweetRegex = /.*\/status\/\d+$/;
const excludeRegex = /.*\/i\/status\/\d+$/;
const imageRegex = /https:\/\/pbs.twimg.com\/media\/.*/;

const initConfig = { attributes: true, childList: true, subtree: true };
const config = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: ["src"],
};

const tweetMap = new Map();
let bookmarksDiv;

const initObserver = new MutationObserver(function findBookmarks(list, observer) {
  for (const mutation of list) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        bookmarksDiv = node.querySelectorAll(
          'div[aria-label="Timeline: Bookmarks"]'
        );
        if (bookmarksDiv.length) {
          bookmarksDiv = bookmarksDiv[0];
          observer.disconnect();
          document.dispatchEvent(bookmarksFound);
          return;
        }
      }
    }
  }
});
const observer = new MutationObserver(function onBookmarksUpdate(list, observer) {
  for (const mutation of list) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        const tweetNodes = node.getElementsByTagName("article");
        for (const tweetNode of tweetNodes) {
          const tweetPermaNode = Array.from(
            tweetNode.getElementsByTagName("a")
          ).find(
            (aTag) =>
              tweetRegex.test(aTag.href) && !excludeRegex.test(aTag.href)
          );
          if(!tweetPermaNode) continue;
          const tweetUrl = tweetPermaNode.href;
          if (!tweetMap.has(tweetUrl)) {
            tweetMap.set(tweetUrl, {
              text: "",
              datePosted: tweetPermaNode.firstChild.getAttribute("datetime"),
              images: new Set(),
            });
          }
          const tweet = tweetMap.get(tweetUrl);
          if (tweet.text) break;
          let textNode = tweetNode.querySelectorAll(
            'div[data-testid="tweetText"]'
          );
          if (textNode.length) {
            for (const textPartNode of textNode[0].childNodes) {
              if (textPartNode.nodeName == "IMG"){
                tweet.text += textPartNode.alt;
              } else {
                tweet.text += textPartNode.textContent;
              }
            }
          }
          if (
            tweetNode.querySelectorAll('div[data-testid="tweetPhoto"]').length
          ) {
            tweet.video = true;
          }
        }
      }
    }
    if (mutation.type === "attributes") {
      const imageUrl = mutation.target.src;
      if (imageRegex.test(imageUrl)) {
        const tweetNode = mutation.target.closest("article");
        const tweetUrl = Array.from(tweetNode.getElementsByTagName("a")).find(
          (aTag) => tweetRegex.test(aTag.href) && !excludeRegex.test(aTag.href)
        ).href;
        tweetMap.get(tweetUrl).images.add(imageUrl.split("&name")[0]);
      }
    }
  }
});

document.addEventListener("bookmarksFound", (event) => {
  observer.observe(bookmarksDiv, config);
  bookmarksDiv.style.border = "4px solid red";
  console.log("Observing...");

  addEventListener("keydown", (keyEvent) => {
    if (keyEvent.code == "F2") {
      const text = JSON.stringify(
        Object.fromEntries(tweetMap),
        (_, value) => (value instanceof Set ? [...value] : value),
        2
      );
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/json;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", "bookmarks.json");
      element.style.display = "none";
      element.click();
      console.log("Saved bookmarks to file");
    }
  });

  addEventListener("keydown", (keyEvent) => {
    if (keyEvent.code == "F4") {
      console.log(tweetMap);
    }
  });
});

initObserver.observe(document.body, initConfig);