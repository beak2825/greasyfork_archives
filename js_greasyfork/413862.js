// ==UserScript==
// @name         Strava - Feed buttons
// @namespace    https://github.com/bogdal/userscripts
// @version      0.1
// @description  Adds buttons that switch the activity feeds directly.
// @author       Adam Bogdał
// @match        https://www.strava.com/dashboard*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413862/Strava%20-%20Feed%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/413862/Strava%20-%20Feed%20buttons.meta.js
// ==/UserScript==

GM_addStyle(`
    .us-feed-buttons { float: right; }
    .us-feed-buttons a:focus { outline: none; }
    .us-feed-buttons .feed-selected { color: #000; background-color: #fff; border-color: #fff; }
`);

const FEED_TYPE_CLUB = "club";
const FEED_TYPE_FOLLOWING = "following";
const FEED_TYPE_MY_ACTIVITY = "my_activity";

const feedButtons = [
  {
    title: "Following",
    icon: "group",
    feedType: FEED_TYPE_FOLLOWING,
    isActive: (loadedFeed) =>
      ![FEED_TYPE_MY_ACTIVITY, FEED_TYPE_CLUB].includes(loadedFeed),
  },
  {
    title: "Your Activities",
    icon: "avatar",
    feedType: FEED_TYPE_MY_ACTIVITY,
    isActive: (loadedFeed) => loadedFeed === FEED_TYPE_MY_ACTIVITY,
  },
];

const params = new URLSearchParams(window.location.search);
const currentFeedType = params.get("feed_type");

const createButton = (iconName, title, url, isActive) => {
  let icon = document.createElement("span");
  icon.classList.add(`icon-${iconName}`, "app-icon", "icon-lg");

  let link = document.createElement("a");
  link.classList.add("btn");
  link.href = url;
  link.title = title;
  link.appendChild(icon);

  if (isActive) {
    link.classList.add("feed-selected");
  }
  return link;
};

const createFeedButtons = (container, classes) => {
  container.classList.add(classes);
  feedButtons.forEach((config) => {
    container.append(
      createButton(
        config.icon,
        config.title,
        `/dashboard?feed_type=${config.feedType}`,
        config.isActive(currentFeedType)
      )
    );
  });
  return container;
};

new MutationObserver((mutations, observer) => {
  const settingsBox = document.querySelector(".feed-header.feed-settings");
  if (settingsBox) {
    settingsBox.append(
      createFeedButtons(document.createElement("div"), "us-feed-buttons")
    );
    observer.disconnect();
  }
}).observe(document, { childList: true, subtree: true });
