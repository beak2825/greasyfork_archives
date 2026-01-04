// ==UserScript==
// @name        Reddit - Old School
// @version     1.5.1
// @grant       none
// @include     https://*.reddit.com/*
// @namespace   selbi
// @description Allows for easy navigation through a sub by pressing the left/right arrow keys, amongst other useful experience improvements. (Only works for old.reddit.com, so this script automatically redirects you there.)
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/381544/Reddit%20-%20Old%20School.user.js
// @updateURL https://update.greasyfork.org/scripts/381544/Reddit%20-%20Old%20School.meta.js
// ==/UserScript==

// Make sure the script is only run once
if (window.top === window.self) {
  redditOldSchool();
}

function redditOldSchool() {
  ////////////////////////
  // ENTRY POINT

  // Matches any URL that isn't on the "old" reddit
  const NON_OLD_SUBDOMAIN_REGEX = /^https?:\/\/((?!old)\w+)/i;

  // Setup script, or redirect if this isn't the old reddit
  let url = window.location.href;

  // Abort everything for media links, as those are only evailable on new reddit
  if (url.includes("/media?url=")) {
    return;
  }


  let matches = url.match(NON_OLD_SUBDOMAIN_REGEX);
  if (matches != null && matches.length > 1) {
    let subdomain = matches[1]; // always the second match
    url = url.replace(subdomain, "old");
    window.location.href = url;
  } else {
    setup();
  }

  ////////////////////////
  // SETUP

  // Directions
  const SCROLL_RIGHT = 1;
  const SCROLL_LEFT = -1;

  // Main setup function
  function setup() {
    if (url.includes("/comments/")) {
      redditScrollSetupClickComments();
    } else {
      const siteTable = document.getElementById("siteTable");
      redditScrollSetupClickPost(siteTable);
      redditScrollSetupClickableArrows(siteTable);
      redditScrollSetupKeys();
    }
  }

  // Open/close post by clicking it
  function redditScrollSetupClickPost(siteTable) {
    siteTable.addEventListener('click', (event) => {
      let targetElem = event.target;
      scrollToTarget(targetElem);
    });
  }

  // Clickable arrows at the bottom right
  function redditScrollSetupClickableArrows(siteTable) {
    let rightClickArrow = document.createElement("div");
    rightClickArrow.classList.add("clickableNavigationArrow")
    rightClickArrow.innerHTML = "&#9658;";
    rightClickArrow.onclick = () => leftRightScroll(SCROLL_RIGHT);
    siteTable.appendChild(rightClickArrow);

    let leftClickArrow = document.createElement("div");
    leftClickArrow.classList.add("clickableNavigationArrow", "clickableNavigationArrowLeft")
    leftClickArrow.innerHTML = "&#9668;";
    leftClickArrow.onclick = () => leftRightScroll(SCROLL_LEFT);
    siteTable.appendChild(leftClickArrow);
  }

  // Scroll by pressing left/right/+/- arrow keys on the keyboard
  function redditScrollSetupKeys() {
    document.onkeydown = (e) => {
      // Fetch the key and only allow left/right/+/-
      const ARR_LEFT  =  37;
      const ARR_RIGHT =  39;
      const NUM_PLUS  = 107;
      const NUM_MINUS = 109;

      const key = e.keyCode;
      if (key === ARR_LEFT) {
        leftRightScroll(SCROLL_LEFT);
      } else if (key === ARR_RIGHT) {
        leftRightScroll(SCROLL_RIGHT);
      } else if (key === NUM_PLUS) {
        browseMultiImagePost(SCROLL_RIGHT);
      } else if (key === NUM_MINUS) {
        browseMultiImagePost(SCROLL_LEFT);
      }
    }
  }

  ////////////////////////

  // Open/close comments by clicking them
  function redditScrollSetupClickComments() {
    // NTS: #siteTable and .sitetable are two very different elements!
    document.querySelector(".commentarea .sitetable").addEventListener('click', (event) => {
      let targetElem = event.target;
      if (isIgnoredElem(targetElem) || window.getSelection().toString() !== "") {
        return;
      }
      let entry = findParentElemByClass(targetElem, "entry", 5);
      if (entry != null) {
        entry.querySelector(".expand").click();
        scrollToY(entry);
      }
    });
  }

  ////////////////////////

  // Variable to keep track of the currently selected post
  let currentPost = null;

  // Main logic to scroll through reddit with left/right arrows
  function leftRightScroll(direction) {
    // Don't scroll the page if we're currently in a text box
    if (isIgnoredElem(document.activeElement)) {
      return;
    }

    // If no post is set yet, jump to the very top one
    if (currentPost == null) {
      scrollToTarget(document.querySelector("#siteTable .entry"));
      return;
    }

    // Find the parent container for the post
    let post = findParentElemByClass(currentPost, "thing", 2);
    if (post == null) {
      return;
    }

    // Set the relative browsing methods depending on whether left or right was pressed
    let sibling, child;
    if (direction === SCROLL_LEFT) {
      sibling = (post) => post.previousElementSibling;
      child = (post) => post.lastChild;
    } else if (direction === SCROLL_RIGHT) {
      sibling = (post) => post.nextElementSibling;
      child = (post) => post.firstChild;
    }

    // Find the new sibling post relative to the currently opened one
    // (Plus some fluff to make page transitions seamless and skipping over non-expandable posts)
    do {
      let siblingPost = sibling(post);
      if (siblingPost == null) {
        post = post.parentElement;
      } else if (siblingPost.classList.contains("sitetable")) {
        post = child(siblingPost);
      } else {
        post = siblingPost;
      }
      if (post == null) {
        return;
      }
    } while (!post.classList.contains("thing") || !post.querySelector(".expando-button") || post.classList.contains("promoted"));

    // Close the previous post, if it was still open
    let expando = currentPost.querySelector(".expando-button");
    if (expando.classList.contains("expanded")) {
      expando.click();
    }
    // Open the new post and scroll to it
    let scrollTarget = post.querySelector(".entry");
    scrollToTarget(scrollTarget);
  }

  // For easy navigation of multi-image posts with the +/- Numpad keys
  function browseMultiImagePost(direction) {
    // Don't do anything if there's no open post or if we're currently in a text box
    if (currentPost == null || isIgnoredElem(document.activeElement)) {
      return;
    }

    // Find out if the currently open post is a multi-image one
    let stepContainer = currentPost.querySelector(".res-step-container");
    if (stepContainer) {
      // Click the applicable previous/next buttons
      if (direction === SCROLL_LEFT) {
        stepContainer.querySelector(".res-step-previous").click();
      } else if (direction === SCROLL_RIGHT) {
        stepContainer.querySelector(".res-step-next").click();
      }
    }
  }

  ////////////////////////
  // All kinds of helper functions

  const MAX_PARENT_DEPTH = 7;
  function scrollToTarget(targetElem) {
    if (targetElem.classList.contains("expando-button")) {
      scrollToY(targetElem.parentElement);
    } else {
      if (!targetElem.classList.contains("res-step")) {
        let entry = findParentElemByClass(targetElem, "entry", MAX_PARENT_DEPTH);
        if (entry != null) {
          entry.querySelector(".expando-button").click();
          currentPost = entry;
        }
      }
    }
  }

  function findParentElemByClass(elem, className, maxSearchDepth) {
    if (elem == null || maxSearchDepth <= 0) {
      return null;
    } else if (elem.classList.contains(className)) {
      return elem;
    }
    return findParentElemByClass(elem.parentElement, className, maxSearchDepth - 1);
  }

  function scrollToY(elem) {
    let scroll = elem.getBoundingClientRect().top + window.scrollY;
    window.scroll({
      top: scroll,
      left: 0,
      behavior: "smooth"
    });
  }

  const IGNORED_TAG_TYPES = ["a", "textarea", "input"];
  function isIgnoredElem(elem) {
    let tag = elem.tagName.toLowerCase();
    return IGNORED_TAG_TYPES.includes(tag);
  }

  ////////////////////////

  function addGlobalStyle(css) {
    let style = document.createElement("style");
    style.innerHTML = css;

    let head = document.querySelector("head");
    if (head) {
      head.appendChild(style);
    }
  }

  addGlobalStyle(`
    body {
      overflow-x: hidden;
    }

    .entry {
      transition: 0.06s ease;
    }
    .entry:hover, .res-nightmode .entry.res-selected:hover {
      background-color: rgba(128,128,128, 0.2) !important;
      cursor: pointer;
    }

    .NERPageMarker {
      display: none;
    }

    :root {
      --scroll-arrow-width: 6vw;
    }

   .clickableNavigationArrow {
      position: fixed;
      bottom: 0;
      right: 0;
      width: var(--scroll-arrow-width);
      font-size: var(--scroll-arrow-width);
      text-align: center;
      opacity: 0.02;
      transition: 0.1s ease;
      user-select: none;
      color: gray;
    }

    .clickableNavigationArrow:hover {
      opacity: 0.8;
      cursor: pointer;
    }

    .clickableNavigationArrowLeft {
      right: var(--scroll-arrow-width);
    }
  `);

  ////////////////////////
}
