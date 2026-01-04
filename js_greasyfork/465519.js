// ==UserScript==
// @name        YouTube Anti-Shorts
// @version     1.0.5
// @author      sapondanaisriwan
// @namespace   https://github.com/sapondanaisriwan/youtube-anti-shorts
// @description Remove all shorts
// @match       https://www.youtube.com/*
// @grant       none
// @license      MIT
// @homepageURL https://github.com/sapondanaisriwan/youtube-anti-shorts
// @supportURL  https://github.com/sapondanaisriwan/youtube-anti-shorts/issues
// @icon        https://i.imgur.com/I9uDrsq.png
// @downloadURL https://update.greasyfork.org/scripts/465519/YouTube%20Anti-Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/465519/YouTube%20Anti-Shorts.meta.js
// ==/UserScript==

/*
If you want to submit a bug or request a feature please report via github issue. Since I receive so many emails, I can't reply to them all.
Contact: sapondanaisriwan@gmail.com
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
*/

"use strict";

// Customize the way you like :)
const settings = {
  Hide_Tab: true, // Hide Tabs that named "SHORT"
  Home_Page: true,
  Channel_Page: true,
  Watch_Page: true,
  Search_Page: true,
  Hashtag_Page: true,
  Subscription_Page: {
    Videos_Per_Row: 6,
    Hide_Shorts: true,
    Hide_Channel_Profile: true,
  },
};

const config = { childList: true, subtree: true, attributes: true };
const selectors = {
  tabs: {
    parent: "tp-yt-paper-tab",
    element: "tp-yt-paper-tab .tab-title",
  },
  navbar: {
    collapse: 'a.ytd-mini-guide-entry-renderer[title="Shorts"]',
    expanded: `
      #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Shorts"],
      a.ytd-mini-guide-entry-renderer[title="Shorts"]
    `,
  },
  filterBar: {
    parent: "yt-chip-cloud-chip-renderer",
    element: "yt-chip-cloud-chip-renderer #text[title='Shorts']",
  },
  searchPage: {
    reel: "ytd-search ytd-reel-shelf-renderer",
    videos: {
      parent: "ytd-video-renderer[is-search]",
      element: "ytd-search #thumbnail[href^='/shorts/']",
    },
  },
  homePage: {
    reel: {
      parent: "ytd-rich-section-renderer",
      element: "[page-subtype='home'] ytd-rich-shelf-renderer[is-shorts]",
    },
  },
  subscriptionPage: {
    reel: {
      parent: "ytd-rich-section-renderer",
      element:
        "[page-subtype='subscriptions'] ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer",
    },
    reelList: {
      parent: "ytd-item-section-renderer[page-subtype='subscriptions']",
      element: "ytd-reel-shelf-renderer",
    },
    videos: {
      parent:
        "ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-item-section-renderer",
      element: "[page-subtype='subscriptions'] #thumbnail[href^='/shorts/']",
    },
  },
  channelPage: {
    reel: {
      parent: "ytd-item-section-renderer",
      element: '[page-subtype="channels"] ytd-reel-shelf-renderer',
    },
    feed: {
      element:
        "[page-subtype='channels'] ytd-rich-grid-renderer[is-shorts-grid]",
    },
  },
  watchPage: {
    reel: "ytd-watch-flexy ytd-reel-shelf-renderer",
  },
  hashtagPage: {
    video: {
      parent: "ytd-rich-item-renderer",
      element:
        "[page-subtype='hashtag-landing-page'] #thumbnail[href^='/shorts/']",
    },
  },
};

// Stolen from AdashimaaTube
const styles = {
  subscriptionPage: {
    layoutFix: `
    [page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row,
    [page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row #contents {
      display: contents;
    }

    [page-subtype="subscriptions"] ytd-rich-item-renderer:not([is-reel-item-style-avatar-circle]) {
      width: calc(100%/${settings.Subscription_Page.Videos_Per_Row} - 4px - 0.01px)
    }

    [page-subtype="subscriptions"] ytd-rich-grid-renderer #contents #contents > ytd-rich-item-renderer:not([is-reel-item-style-avatar-circle]) {
      margin-left: 0;
      margin-right: calc(var(--ytd-rich-grid-item-margin) / 4);
      margin-bottom: 24px;
    }

    [page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer {
      padding-top: 0;
    }
    [page-subtype="subscriptions"] #content.ytd-rich-section-renderer {
      margin: 0;
      max-width: 100%;
    }

    [page-subtype="subscriptions"][mini-guide-visible] ytd-two-column-browse-results-renderer.grid.grid-disabled {
      max-width: var(--ytd-grid-max-width);
    }
    @media screen and (max-width: 1170px) {
      [page-subtype="subscriptions"][mini-guide-visible] ytd-two-column-browse-results-renderer.grid.grid-disabled {
        width: var(--ytd-grid-4-columns-width);
      }
    }
    @media screen and (min-width: 1171px) {
      [page-subtype="subscriptions"][mini-guide-visible] ytd-two-column-browse-results-renderer.grid.grid-disabled,
      [page-subtype="subscriptions"]:not([mini-guide-visible]) ytd-two-column-browse-results-renderer.grid.grid-disabled {
        width: var(--ytd-grid-5-columns-width);
      }
    }
    @media screen and (min-width: 1440px) {
      [page-subtype="subscriptions"][mini-guide-visible] ytd-two-column-browse-results-renderer.grid.grid-disabled {
        width: var(--ytd-grid-6-columns-width);
      }
    }
    @media screen and (min-width: 1553px) {
      [page-subtype="subscriptions"]:not([mini-guide-visible]) ytd-two-column-browse-results-renderer.grid.grid-disabled {
        width: var(--ytd-grid-6-columns-width);
      }
    }
    `,
    hideChannelProfile: `
    [page-subtype="subscriptions"] #avatar-link.ytd-rich-grid-media {
      display: none;
    }
    `,
  },
};

function checkDisplay(ele) {
  return ele.style.display === "none";
}

function setHide(ele) {
  ele.style.display = "none";
}

function hideEle(ele) {
  const isEleHide = checkDisplay(ele);
  !isEleHide && setHide(ele);
}

function hideParentEle(ele, parent) {
  const parentEle = ele.closest(parent);
  if (parentEle) {
    const isParentHide = checkDisplay(parentEle);
    !isParentHide && setHide(parentEle);
  }
}

function hideShorts(selector, parent = "") {
  [...document.querySelectorAll(selector)].forEach((ele) =>
    parent ? hideParentEle(ele, parent) : hideEle(ele)
  );
}

function hideShortsText(selector, parent = "") {
  [...document.querySelectorAll(selector)].forEach(
    (ele) =>
      ele.textContent.toLowerCase() === "shorts" && hideParentEle(ele, parent)
  );
}

// Function to remove DOM element
const removeEle = (id) => {
  const ele = document.getElementById(id);
  ele && ele.remove();
};

// Function to inject a style into the webpage
const injectStyle = (id, css) => {
  // Remove before adding
  removeEle(id);

  const style = document.createElement("style");
  style.type = "text/css";
  style.id = id;
  style.textContent = css;
  document.documentElement.appendChild(style);
};

function run() {
  // Home Page
  if (settings.Home_Page) {
    hideShorts(selectors.homePage.reel.element, selectors.homePage.reel.parent);
  }

  // Channel Page
  if (settings.Channel_Page) {
    hideShorts(selectors.channelPage.feed.element);
    hideShorts(
      selectors.channelPage.reel.element,
      selectors.channelPage.reel.parent
    );
  }

  // Watch Page
  if (settings.Watch_Page) {
    hideShorts(selectors.watchPage.reel);
  }

  // Search Page
  if (settings.Search_Page) {
    hideShorts(selectors.searchPage.reel);
    hideShorts(
      selectors.searchPage.videos.element,
      selectors.searchPage.videos.parent
    );
  }

  // Subscription Page
  if (settings.Subscription_Page.Hide_Shorts) {
    hideShorts(
      selectors.subscriptionPage.videos.element,
      selectors.subscriptionPage.videos.parent
    );
    hideShorts(
      selectors.subscriptionPage.reel.element,
      selectors.subscriptionPage.reel.parent
    );
    hideShorts(
      selectors.subscriptionPage.reelList.element,
      selectors.subscriptionPage.reelList.parent
    );
  }

  // Hashtag Page
  if (settings.Hashtag_Page) {
    hideShorts(
      selectors.hashtagPage.video.element,
      selectors.hashtagPage.video.parent
    );
  }

  if (settings.Hide_Tab) {
    // Tabs
    hideShortsText(selectors.tabs.element, selectors.tabs.parent);
    hideShorts(selectors.navbar.expanded);
    hideShorts(selectors.navbar.collapse);

    // Hashtag Page
    hideShorts(selectors.filterBar.element, selectors.filterBar.parent);
  }
}

settings.Subscription_Page.Hide_Shorts &&
  injectStyle("Stolen-from-AdashimaaTube", styles.subscriptionPage.layoutFix);
settings.Subscription_Page.Hide_Channel_Profile &&
  injectStyle(
    "hide-channel-profile",
    styles.subscriptionPage.hideChannelProfile
  );
const observer = new MutationObserver(run);
observer.observe(document.documentElement, config);