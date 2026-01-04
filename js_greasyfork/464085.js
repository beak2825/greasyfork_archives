// ==UserScript==
// @name         Twitter ALT info
// @namespace    https://twitter.com/shangrenxi
// @version      1.0.1
// @description  在Twitter信息流中显示图片的ALT信息
// @icon         http://www.google.com/s2/favicons?domain=twitter.com
// @author       Alban
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @license MIT  Alban
// @downloadURL https://update.greasyfork.org/scripts/464085/Twitter%20ALT%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/464085/Twitter%20ALT%20info.meta.js
// ==/UserScript==

const tweetSelector = 'article[data-testid="tweet"]';
const tweetTextSelector = 'div[data-testid="tweetText"]';
const tweetPhotoSelector = 'div[data-testid^="tweetPhoto"]';

const appendAltText = (tweet, altText) => {
  const tweetTextElement = tweet.querySelector(tweetTextSelector);
  const existingList =
    tweetTextElement?.querySelector(".alt-list") ??
    (() => {
      const newList = document.createElement("ol");
      newList.className = "alt-list";
      const altPromptText = document.createTextNode("ALTs: ");
      const altPrompt = document.createElement("span");
      altPrompt.className = "alt-prompt";
      altPrompt.appendChild(altPromptText);
      const container = document.createElement("div");
      container.className = "alt-container";
      container.appendChild(altPrompt);
      container.appendChild(newList);
      tweetTextElement.appendChild(container);
      return newList;
    })();

  const listItem = document.createElement("li");
  const altTextNode = document.createTextNode(altText);
  const altTextContainer = document.createElement("div");
  altTextContainer.className = "alt-text"
  altTextContainer.appendChild(altTextNode);
  listItem.appendChild(altTextContainer);
  existingList.appendChild(listItem);
};

const processedTweets = new Map();

const processTweet = (tweet) => {
  if (processedTweets.get(tweet)) {
    return;
  }
  processedTweets.set(tweet, true);
  tweet.querySelectorAll(tweetPhotoSelector).forEach((photo) => {
    const altText = photo.getAttribute("aria-label");
    if (altText && altText.length >= 10) {
      appendAltText(tweet, altText);
    }
  });
};

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        !processedTweets.get(entry.target) &&
        entry.target.matches(tweetSelector) &&
        entry.target.querySelector(tweetPhotoSelector)
      ) {
        processTweet(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const observerConfig = { childList: true, subtree: true };
const mutationObserver = new MutationObserver((mutationsList) =>
  mutationsList.forEach(({ addedNodes }) =>
    addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.querySelectorAll(tweetSelector).forEach((tweet) => {
          intersectionObserver.observe(tweet);
        });
      }
    })
  )
);

document.querySelectorAll(tweetSelector).forEach((tweet) => {
  intersectionObserver.observe(tweet);
});

mutationObserver.observe(document.body, observerConfig);

GM_addStyle(`
  .alt-container {
    display: block;
    margin-top: 10px;
    background-color: #cce6ff5e;
    padding: 8px;
    border-radius: 8px;
    border-style: solid;
    border-color: #cce6ff;
  }

  .alt-prompt {
    font-weight: bold;
    color: #1d9bf0;
    font-size: 15px;
  }

  .alt-list {
    padding-left: 20px;
    margin-block-start: 0.2em;
    margin-block-end: 0.2em;
  }

  .alt-text {
    padding: .2em;
    font-size: 15px;
}
`);