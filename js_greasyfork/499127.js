// ==UserScript==
// @name             视频网页最大化
// @description    视频网页最大化，按Esc可以切换最大化或还原，按Tab可以选择播放控件
// @namespace   代码修改来自#https://github.com/popiazaza/Youtube-Max-Video-Height
// @match           *://*/*
// @version         0.0.1
// @author         yuensui
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/499127/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499127/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle(`
ytd-watch-flexy[theater] #player-wide-container.ytd-watch-flexy, ytd-watch-flexy[fullscreen] #player-wide-container.ytd-watch-flexy, ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy, ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
  max-height: calc(100vh);
}
#masthead-container.ytd-app {
  opacity: 0;
}
#page-manager.ytd-app {
  margin-top: 0;
}
`);

let pinnedTopBar = false;
let timeoutMouseout;

(function () {
  const mastheadContainer = document.getElementById("masthead-container");
  const pageManager = document.getElementById("page-manager");
  mastheadContainer.style.transition = "opacity 0.2s";
  mastheadContainer.style.opacity = 0;
  pageManager.style.marginTop = 0;
  document.onkeydown = hotkeys;
  mastheadContainer.addEventListener(
    "mouseover",
    function () {
      clearTimeout(timeoutMouseout);
      toggleHeader(1);
    },
    true
  );
  mastheadContainer.addEventListener(
    "mouseout",
    function () {
      timeoutMouseout = setTimeout(toggleHeader, 500, 2);
    },
    true
  );

  let previousUrl;

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      if (window.location.pathname.startsWith("/watch")) {
        pinnedTopBar = false;
        toggleHeader(2);
      } else {
        pinnedTopBar = true;
        toggleHeader(1);
      }
      previousUrl = window.location.href;
    }
  });

  const config = { subtree: true, childList: true };

  observer.observe(document, config);
})();

function toggleHeader(mouseover = 0) {
  const mastheadContainer = document.getElementById("masthead-container");
  const pageManager = document.getElementById("page-manager");
  if (mouseover === 1 || mastheadContainer.style.opacity === 0) {
    mastheadContainer.style.opacity = 1;
    pageManager.style.marginTop =
      "var(--ytd-masthead-height,var(--ytd-toolbar-height))";
  } else if (
    !pinnedTopBar &&
    (mouseover === 2 || mastheadContainer.style.opacity === 1)
  ) {
    mastheadContainer.style.opacity = 0;
    pageManager.style.marginTop = 0;
    for (let element of Array.from(document.querySelectorAll(".gstl_50"))) {
      element.style.display = "none";
    }
  }
}

function hotkeys(e) {
  if (e.code === "Tab") {
    document.getElementById("guide-button").click();
  } else if (e.code === "Escape") {
    pinnedTopBar = !pinnedTopBar;
    if (pinnedTopBar) {
      toggleHeader(1);
    } else {
      toggleHeader(2);
    }
  }
}
