// ==UserScript==
// @name         YouTube Video Auto Pop-out
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Pop-out video to bottom-right when scrolling down to comments
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484817/YouTube%20Video%20Auto%20Pop-out.user.js
// @updateURL https://update.greasyfork.org/scripts/484817/YouTube%20Video%20Auto%20Pop-out.meta.js
// ==/UserScript==

(function() {
  "use strict";

  let originalStyles;
  const fixedStyles = {
    position: "fixed",
    top: "auto",
    left: "auto",
    bottom: "20px",
    right: "50px",
    zIndex: "1000",
    transition: "none",
  };

  const playButton = `
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
      <path
        class="ytp-svg-fill"
        d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
      />
    </svg>
  `;
  const pauseButton = `
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
      <path
        class="ytp-svg-fill"
        d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
      />
    </svg>
  `;

  function printLog(message) {
    console.log(`[YouTube Video Pop-out]: ${message}`);
  }

  function getVideoPlayer() {
    return document.querySelector("video.html5-main-video");
  }

  function videoHasEnded() {
    const video = getVideoPlayer();
    const progress = video.currentTime / video.duration;
    return progress === 1;
  }

  function isValidVideo() {
    return getVideoPlayer().duration > 0;
  }

  function setStyles(elem, propertyObject) {
    for (let property in propertyObject) elem.style[property] = propertyObject[property];
  }

  function getVideoSize(fixed = false) {
    const rect = getVideoPlayer().getBoundingClientRect();
    const width = fixed ? rect.width / 2 : rect.width;
    const height = fixed ? rect.height / 2 : rect.height;
    return {
      width: `${width}px`,
      height: `${height}px`
    };
  }

  function setPlayIcon(button, paused) {
    const icon = paused ? playButton : pauseButton;
    button.innerHTML = icon;
  }

  function setButtonVisible(button, visible) {
    button.style.display = visible ? "block" : "none";
  }

  function removeFixedContainer() {
    const container = document.querySelector("#fixed-container");
    if (container) container.remove();
  }

  function moveVideoToCorner() {
    const videoPlayer = getVideoPlayer();
    if (videoPlayer.classList.contains("in-corner")) return false;

    originalStyles = {
      position: videoPlayer.style.position,
      // top: videoPlayer.style.top,
      // left: videoPlayer.style.left,
      width: getVideoSize().width,
      height: getVideoSize().height,
      zIndex: videoPlayer.style.zIndex,
      transition: videoPlayer.style.transition,
    };
    fixedStyles.width = getVideoSize(true).width;
    fixedStyles.height = getVideoSize(true).height;

    const videoContainer = document.createElement("div");
    videoContainer.setAttribute("id", "fixed-container");
    const containerStyle = {
      ...fixedStyles,
      cursor: "move"
    };
    setStyles(videoContainer, containerStyle);

    const pauseButton = document.createElement("div");
    setPlayIcon(pauseButton, videoPlayer.paused);
    pauseButton.addEventListener("click", () => {
      videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
    });
    videoPlayer.addEventListener("play", () => setPlayIcon(pauseButton, false));
    videoPlayer.addEventListener("pause", () => setPlayIcon(pauseButton, true));
    videoPlayer.addEventListener("ended", () => restoreVideoPosition());

    const buttonStyles = {
      display: "none",
      position: "absolute",
      height: "36px",
      top: "calc(50% - 18px)",
      left: "calc(50% - 18px)",
      cursor: "pointer",
      zIndex: "1100",
    };
    setStyles(pauseButton, buttonStyles);
    videoContainer.appendChild(pauseButton);

    setStyles(videoPlayer, {
      width: "100%",
      height: "100%"
    });

    videoPlayer.style.pointerEvents = "none";
    videoPlayer.classList.add("in-corner");
    videoContainer.appendChild(videoPlayer);
    document.querySelector("body").appendChild(videoContainer);

    videoContainer.addEventListener("mouseenter", () => setButtonVisible(pauseButton, true));
    videoContainer.addEventListener("mouseleave", () => setButtonVisible(pauseButton, false));

    makeDraggable(videoContainer);
  }

  function restoreVideoPosition() {
    const videoPlayer = getVideoPlayer();
    if (!videoPlayer.classList.contains("in-corner")) return false;

    setStyles(originalStyles);
    videoPlayer.style.pointerEvents = "auto";
    videoPlayer.classList.remove("in-corner");
    document.querySelector(".html5-video-container").appendChild(videoPlayer);
    document.querySelector("#fixed-container").remove();
  }

  function makeDraggable(elem) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    elem.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      const topPosition = elem.offsetTop - pos2 + "px";
      elem.style.top = topPosition;
      fixedStyles.top = topPosition;
      const leftPosition = elem.offsetLeft - pos1 + "px";
      elem.style.left = leftPosition;
      fixedStyles.left = leftPosition;
      fixedStyles.right = "auto";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function isElementInvisible(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.bottom <= 0 ||
      rect.right <= 0 ||
      rect.top >= (window.innerHeight || document.documentElement.clientHeight) ||
      rect.left >= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function scrollListener() {
    const playerSection = document.querySelector("#player");
    const playerIsVisible = isElementInvisible(playerSection);

    if (playerIsVisible && isValidVideo() && !videoHasEnded()) {
      moveVideoToCorner();
    } else {
      restoreVideoPosition();
    }
  }

  document.addEventListener("yt-navigate-finish", () => {
    const isVideoPage = location.pathname === "/watch";
    if (isVideoPage) return document.addEventListener("scroll", scrollListener);
    document.removeEventListener("scroll", scrollListener);
    removeFixedContainer();
  });
})();
