// ==UserScript==
// @name         HailuoAI Tab Status
// @namespace    HailuoAI
// @version      1.97
// @description  Gives you notifications for almost-finished videos and sets links so those that get quickly removed have the link lingering (with autoplay to cache in in the browser), will also clean up videos that are never served up because the server rejects them, will also delete video cards that had rejected prompts, also has control for whether to receive notifications
// @author       DUVish
// @match        https://hailuoai.video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hailuoai.video
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519681/HailuoAI%20Tab%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/519681/HailuoAI%20Tab%20Status.meta.js
// ==/UserScript==

const linkStyleEl = document.createElement("style");
const linkStyle = `
.linkElClass {
  color: cornflowerblue;
  position: absolute;
  top: 45px;
  left: 0px;
  height: 14px;
  width: 26px;
  font-size: 9px;
  background-color: black;
  text-align: center;
  opacity: 0.35;
  z-index: 1000000;
}

.linkElClass:hover {
  opacity: 1.0;
}

.videoPreviewElClass {
  position: absolute;
  top: -30px;
  left: 30px;
  width: 200px;
  max-width: 400px;
  max-height: 200px;
  z-index: 10000000000;
}

.automatic-btn-container {
  color: white;
  padding-right: 20px;
  font-size: 12px;
}

.automatic-btn-script, .notification-btn-script, .delete-btn-script, .remove-btn-from-dom-script, .preview-btn-script {
  background-color: white;
  padding: 5px;
  color: black;
  border-radius: 9px;
  cursor: pointer;
}

.automatic-btn-script:hover, .notification-btn-script:hover, .delete-btn-script:hover, .remove-btn-from-dom-script:hover, .preview-btn-script:hover {
  background-color: #d0cfcf;
}

.automatic-btn-script:active, .notification-btn-script:active, .delete-btn-script:active, .remove-btn-from-dom-script:active, .preview-btn-script:active {
  background-color: #a6a6a6;
}
`;
linkStyleEl.textContent = linkStyle;
document.head.appendChild(linkStyleEl);

let CREATE_BTN_BOOLEAN = false;
let NOTIFICATION_BTN_BOOLEAN = false;
let DELETE_BTN_BOOLEAN = false;
let REMOVE_FROM_DOM_BTN_BOOLEAN = false;
let PREVIEW_LINKS_BTN_BOOLEAN = false;

const navBarClassSelector = "origin-right";
const videoCardSelector = "grid-video-card";
const createButtonSelector = "pink-gradient-btn";
const deleteButtonSelector = "absolute right-[10px] top-3 z-[4] cursor-pointer";
const deleteButtonConfirmSelector = "ant-btn-color-primary";
const modalSelector = "ant-modal-content";
const modalCloseButtonSelector = "modal-close-icon";
const videoQueueTextSelector = "relative h-full w-full content-center text-center text-[13px] font-medium";

const maxQueueSize = 5;
const queueIsFullMatch = `${maxQueueSize}`;

const interval = 2000; //normally 2 seconds
const getDeleteVideoCardDelay = () => {
  return document.hidden ? 12000 : 200;
}

const shouldBeDeletedStr = "The video generation failed as it does not comply with community policies.";
const contentWarningShouldBeDeletedStr = "Content generation error, please regenerate";
const textContentShouldBeDeletedStr = "There is an issue with the text content, try using different content";
const textCommunityWarningShouldBeDeletedStr = "It might not meet our community guidelines, please try a different content.";
const textGuidelinesContentShouldBeDeletedStr = "Text content violated Community Guidelines, please revise and try again.";
const generationFailedShouldBeDeletedStr = "Generation failed because video content violated Community Guidelines.";
const generationContentFailedShouldBeDeletedStr = "Generation failed because content violated Community Guidelines.";
const deleteStrings = [shouldBeDeletedStr, contentWarningShouldBeDeletedStr, textContentShouldBeDeletedStr, textCommunityWarningShouldBeDeletedStr, textGuidelinesContentShouldBeDeletedStr, generationFailedShouldBeDeletedStr, generationContentFailedShouldBeDeletedStr];

const failToPassReviewStr = "Failure to pass the review.";
const communityGuidelinesStr = "This video is not available because it violated Community Guidelines.";
const contentCommunityGuidelinesStr = "This content is not available because it violated Community Guidelines.";
const censoredAfterCreationStrings = [failToPassReviewStr, communityGuidelinesStr, contentCommunityGuidelinesStr];

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const setTitleFunc = () => {
    const allLoadingVideos = Array.from(document.querySelectorAll(".ant-progress-text"));
    const highestPercentage = "";
    const allNumbers = allLoadingVideos.map((loading) => {
      const loadingText = loading?.innerText?.match(/(\d+)./)?.[1];
      const loadingTextNum = Number(loadingText);
      return loadingTextNum;
    });
    const highestNumber = allNumbers.sort((a, b) => b - a)[0];
    if (!isNaN(highestNumber)) {
      document.title = "-" + highestNumber + "-";
      if (highestNumber >= 90) createNotification();
    } else {
      document.title = "Empty";
    }
};

const setLinkFunc = () => {
  const videoCards = Array.from(document.querySelectorAll(`.${videoCardSelector}`));
  let hasDeleted = false;
  let hasRemoved = false;
  videoCards.forEach(video => {
    if (!hasDeleted && determineCardShouldBeDeleted(video)) {
      deleteVideoCard(video);
      hasDeleted = true;
    } else if (!hasRemoved && determineCardShouldBeRemovedFromDOM(video)) {
      removeVideoCardFromDOM(video);
      //hasRemoved = true;
    } else if (video.dataset.linkSet) {
      return;
    } else {
      const videoEl = video.querySelector("video");
      if (!videoEl) return;

      videoEl.play();
      setTimeout(() => {videoEl.pause()}, 2000);
      const videoElLink = videoEl.src;
      const positionedEl = video.querySelector(".aspect-video-padding");
      const linkEl = document.createElement("span");
      const anchorEl = document.createElement("a");
      anchorEl.innerText = "[Link]";
      linkEl.classList.add("linkElClass");
      anchorEl.href = videoElLink;
      linkEl.appendChild(anchorEl);
      positionedEl.appendChild(linkEl);
      linkEl.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(videoElLink, "_blank");
      });
      linkEl.addEventListener("mouseenter", (e) => {
        if (determinePreviewShouldShowForVideo(video)) {
          const videoPreviewEl = document.createElement("video");
          videoPreviewEl.classList.add("videoPreviewElClass");
          videoPreviewEl.autoplay = true;
          videoPreviewEl.src = videoElLink;
          linkEl.appendChild(videoPreviewEl);
        }
      });
      linkEl.addEventListener("mouseleave", (e) => {
        const videoPreviewEl = linkEl.querySelector(".videoPreviewElClass");
        if (videoPreviewEl) videoPreviewEl.remove();
      });
      video.dataset.linkSet = "true";
    }
  });
}

const determineCardShouldBeDeleted = (videoEl) => {
  return (deleteStrings.includes(videoEl.innerText.split("\n")[0]) || deleteStrings.includes(videoEl.innerText.split("\n")[1])) && DELETE_BTN_BOOLEAN && !isModalOpen();
}

const deleteVideoCard = (videoEl) => {
  const deleteButton = videoEl.getElementsByClassName(deleteButtonSelector)?.[0];
  if (deleteButton) {
    deleteButton.click();
    setTimeout(() => {
      if (isModalOpen()) {
        const confirmButtons = document.getElementsByClassName(deleteButtonConfirmSelector);
        if (confirmButtons?.length) Array.from(confirmButtons).forEach(confirmButton => confirmButton?.click());
      }
    }, getDeleteVideoCardDelay());
  }
}

const determineCardShouldBeRemovedFromDOM = (videoEl) => {
  return (deleteStrings.includes(videoEl.innerText.split("\n")[0]) || deleteStrings.includes(videoEl.innerText.split("\n")[1])) && REMOVE_FROM_DOM_BTN_BOOLEAN && !isModalOpen() && videoEl.style.display !== "none";
}

const determinePreviewShouldShowForVideo = (videoEl) => {
  return (censoredAfterCreationStrings.includes(videoEl.innerText.split("\n")[0]) || censoredAfterCreationStrings.includes(videoEl.innerText.split("\n")[1])) && PREVIEW_LINKS_BTN_BOOLEAN && videoEl.style.display !== "none";
}

const removeVideoCardFromDOM = (videoEl) => {
  videoEl.style.setProperty('display', 'none', 'important');
}

const clickGenerateFunc = () => {
  const createBtn = document.querySelector(`.${createButtonSelector}`);
  if (CREATE_BTN_BOOLEAN && createBtn && !determineIfQueueIsFull()) {
    createBtn.click();
  }
}

const determineIfQueueIsFull = () => {
  const queueText = document.getElementsByClassName(videoQueueTextSelector)?.[0]?.textContent;
  return queueText === queueIsFullMatch || queueText === '6';
}

const isModalOpen = () => {
  return document.querySelector(`.${modalSelector}`);
}

const cleanupOpenModalsFunc = () => {
  if (isModalOpen() && DELETE_BTN_BOOLEAN && !document.hidden) {
    const closeButtons = Array.from(document.querySelectorAll(`.${modalCloseButtonSelector}`));
    if (closeButtons?.length) {
      closeButtons.forEach(closeButton => closeButton.click());
    }
  }
}

const runAllForInterval = () => {
  setTitleFunc();
  setLinkFunc();
  clickGenerateFunc();
  //cleanupOpenModalsFunc();
}

setInterval(runAllForInterval, interval);

function askNotificationPermission() {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }
  Notification.requestPermission().then((permission) => {
  });
}

const createNotification = () => {
  if (NOTIFICATION_BTN_BOOLEAN) {
    const img = "https://registry.npmmirror.com/@lobehub/icons-static-png/1.5.0/files/dark/hailuo-color.png";
    const text = `HailuoAI task past 90%.`;
    const notification = new Notification("HailuoAI video cooked up", { body: text, icon: img });
  }
}

document.addEventListener('click', askNotificationPermission);
setTimeout(() => {document.removeEventListener('click', askNotificationPermission)}, interval * 5);

const createAutomaticButtonSwitch = () => {
  let containerSpan = document.createElement("span");
  containerSpan.classList.add("automatic-btn-container");
  let textSpan = document.createElement("span");
  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("automatic-btn-script");
  textSpan.innerText = "GENERATE - ";
  buttonSpan.innerText = CREATE_BTN_BOOLEAN ? "TRUE" : "FALSE";
  buttonSpan.addEventListener("click", (e) => {
    let button = document.querySelector("automatic-btn-script");
    CREATE_BTN_BOOLEAN = !CREATE_BTN_BOOLEAN;
    buttonSpan.innerText = CREATE_BTN_BOOLEAN ? "TRUE" : "FALSE";
  });
  containerSpan.appendChild(textSpan);
  containerSpan.appendChild(buttonSpan);
  document.querySelector(`.${navBarClassSelector}`).prepend(containerSpan);
}

const createAutomaticNotificationSwitch = () => {
  let containerSpan = document.createElement("span");
  containerSpan.classList.add("automatic-btn-container");
  let textSpan = document.createElement("span");
  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("notification-btn-script");
  textSpan.innerText = "SEND NOTIFICATIONS - ";
  buttonSpan.innerText = NOTIFICATION_BTN_BOOLEAN ? "TRUE" : "FALSE";
  buttonSpan.addEventListener("click", (e) => {
    let button = document.querySelector("notification-btn-script");
    NOTIFICATION_BTN_BOOLEAN = !NOTIFICATION_BTN_BOOLEAN;
    buttonSpan.innerText = NOTIFICATION_BTN_BOOLEAN ? "TRUE" : "FALSE";
  });
  containerSpan.appendChild(textSpan);
  containerSpan.appendChild(buttonSpan);
  document.querySelector(`.${navBarClassSelector}`).prepend(containerSpan);
}

const createShouldDeleteVideosSwitch = () => {
  let containerSpan = document.createElement("span");
  containerSpan.classList.add("automatic-btn-container");
  let textSpan = document.createElement("span");
  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("delete-btn-script");
  textSpan.innerText = "DELETE REJECTED VIDEOS (API) - ";
  buttonSpan.innerText = DELETE_BTN_BOOLEAN ? "TRUE" : "FALSE";
  buttonSpan.addEventListener("click", (e) => {
    let button = document.querySelector("delete-btn-script");
    DELETE_BTN_BOOLEAN = !DELETE_BTN_BOOLEAN;
    buttonSpan.innerText = DELETE_BTN_BOOLEAN ? "TRUE" : "FALSE";
  });
  containerSpan.appendChild(textSpan);
  containerSpan.appendChild(buttonSpan);
  document.querySelector(`.${navBarClassSelector}`).prepend(containerSpan);
}

const createShouldRemoveVideosFromDOMSwitch = () => {
  let containerSpan = document.createElement("span");
  containerSpan.classList.add("automatic-btn-container");
  let textSpan = document.createElement("span");
  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("remove-btn-from-dom-script");
  textSpan.innerText = "REMOVE REJECTED VIDEOS (no API) - ";
  buttonSpan.innerText = REMOVE_FROM_DOM_BTN_BOOLEAN ? "TRUE" : "FALSE";
  buttonSpan.addEventListener("click", (e) => {
    let button = document.querySelector("remove-btn-from-dom-script");
    REMOVE_FROM_DOM_BTN_BOOLEAN = !REMOVE_FROM_DOM_BTN_BOOLEAN;
    buttonSpan.innerText = REMOVE_FROM_DOM_BTN_BOOLEAN ? "TRUE" : "FALSE";
  });
  containerSpan.appendChild(textSpan);
  containerSpan.appendChild(buttonSpan);
  document.querySelector(`.${navBarClassSelector}`).prepend(containerSpan);
}

const createShouldPreviewVideosSwitch = () => {
  let containerSpan = document.createElement("span");
  containerSpan.classList.add("automatic-btn-container");
  let textSpan = document.createElement("span");
  let buttonSpan = document.createElement("span");
  buttonSpan.classList.add("preview-btn-script");
  textSpan.innerText = "PREVIEW VIDEOS ON [LINK] HOVER - ";
  buttonSpan.innerText = PREVIEW_LINKS_BTN_BOOLEAN ? "TRUE" : "FALSE";
  buttonSpan.addEventListener("click", (e) => {
    let button = document.querySelector("preview-btn-script");
    PREVIEW_LINKS_BTN_BOOLEAN = !PREVIEW_LINKS_BTN_BOOLEAN;
    buttonSpan.innerText = PREVIEW_LINKS_BTN_BOOLEAN ? "TRUE" : "FALSE";
  });
  containerSpan.appendChild(textSpan);
  containerSpan.appendChild(buttonSpan);
  document.querySelector(`.${navBarClassSelector}`).prepend(containerSpan);
}

setTimeout(createAutomaticButtonSwitch, interval);
setTimeout(createShouldDeleteVideosSwitch, interval);
setTimeout(createShouldPreviewVideosSwitch, interval);
setTimeout(createAutomaticNotificationSwitch, interval);
setTimeout(createShouldRemoveVideosFromDOMSwitch, interval);







