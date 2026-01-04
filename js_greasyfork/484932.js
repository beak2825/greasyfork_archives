// ==UserScript==
// @name         4chan Audio Embed Player
// @namespace    fabulous.cupcake.jp.net
// @version      2024.01.16.1
// @description  Yet another script to play 4chan file uploads with link to external audio source
// @author       FabulousCupcake
// @license      MIT
// @match        https://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484932/4chan%20Audio%20Embed%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/484932/4chan%20Audio%20Embed%20Player.meta.js
// ==/UserScript==

// Immediately start video
// Or wait until audio is ready?
const PAUSE_VIDEO_UNTIL_AUDIO = true;

const ALLOWED_DOMAINS = [
  "4cdn.org",
  "catbox.moe",
  "dmca.gripe",
  "lewd.se",
  "pomf.cat",
  "zz.ht",
];

const addEventListenerOnce = (eventName, el, fn) => {
  const id = `${eventName}-event-added`;
  const isAlreadyAdded = el.getAttribute(id);
  if (isAlreadyAdded) return;

  el.addEventListener(eventName, fn);
  el.setAttribute(id, true);
}

// Takes a post, detects if it has audio data
// And adds audio element in the page if so
const process = post => {
  // Drop if not post
  if (!post.classList.contains("postContainer")) return;

  // Drop if no attachment
  const hasImage = post.querySelector("img");
  if (!hasImage) return;

  // Look for Audio URL
  // Sometimes 4chanX has run so we need to account for that
  const pattern = /\[sound=(.+?)\]/;
  const fileTextEl = post.querySelector(".fileText-original") ?
    post.querySelector(".fileText-original a[title]") :
    post.querySelector(".fileText a[title]");
  const fileName = fileTextEl?.getAttribute("title");
  const matches = fileName?.match(pattern)?.[1];
  if (!matches) return;

  // Sanitize URL
  const audioURLText = decodeURIComponent(matches.replaceAll("_", "%"));
  const audioURL = new URL(`https://${audioURLText}`);

  // Reject unless allowed domain
  const isAllowedDomain = ALLOWED_DOMAINS.some(d => audioURL.hostname.endsWith(d));
  if (!isAllowedDomain) return;
  
  // Insert to page
  const id = post.id.replaceAll(/[^\d]/g, "");
  const element = `<audio id="audio-${id}" class="file-audio" loop preload="none" controls src="${audioURL.toString()}" style="display:none;"></audio>`;
  document.body.insertAdjacentHTML("afterbegin", element);
}


// Execute process() to all posts in the page
const processAll = () => {
  const posts = Array.from(document.querySelectorAll(".postContainer"));
  posts.forEach(post => process(post));
}


// Execute process() to any new posts added after initial page load
const newPostHandler = (mutations) => {
  const newPosts = mutations.map(m => Array.from(m.addedNodes)).flat(Infinity);
  newPosts.forEach(post => process(post));
}

const watchNewPost = (callback) => {
  const postParent = document.querySelector(".board .thread");
  const config = { childList: true }
  const observer = new MutationObserver(callback);
  observer.observe(postParent, config);
}


// Autoplay video when 4chanX video plays
const hoverFileHandler = () => {
  const hoverUI = document.querySelector("#hoverUI");
  const media = document.querySelector("[data-file-i-d]");
  const video = document.querySelector("video[data-file-i-d]");

  // Pause everything if there are no open media embeds (either hover or in a post)
  if (!media) {
    const audios = Array.from(document.querySelectorAll(".file-audio")).forEach(audio => audio.pause());
    return;
  }

  const postID = media.getAttribute('data-file-i-d').match(/\.(\d+)\./)[1];
  const audio = document.querySelector(`.file-audio[id="audio-${postID}"]`);

  // Abort if no associated audio found
  if (!audio) return;

  // If it's video, add some event listeners to ensure synchronization
  if (video) {
    // Audio takes a bit to start initially
    // So we tell it to catch up to the video once it's actually ready to play
    audio.addEventListener("canplay", () => {
      audio.currentTime = video.currentTime;
      video.play();
    }, { once: true });

    // Tell video to wait if audio not ready
    if (PAUSE_VIDEO_UNTIL_AUDIO) {
      audio.addEventListener("waiting", () => {
        video.pause();
      }, { once: true });
    }

    // Sync audio when video is controlled manually
    addEventListenerOnce("seeked", video, () => audio.currentTime = video.currentTime);
    addEventListenerOnce("pause", video, () => audio.pause());
    addEventListenerOnce("playing", video, () => {
      // For some bizzare reason it can play while not being shown anywhere in DOM
      // Do NOT play audio when that happens
      const video = document.querySelector("video[data-file-i-d]");
      if (!video) return;

      audio.currentTime = video.currentTime;
      audio.play();
    });
  }

  // This is a super janky way to detect when 4chanX embed is closed
  // Attempt to pause whenever mouse leaves the media (which happens when you close the embed)
  // If already paused, do nothing
  addEventListenerOnce("mouseleave", media, () => {
    if (audio.paused) return;
    window.setTimeout(hoverFileHandler, 0);
  });

  // Play audio
  audio.play();

  // If state is still paused after explicit play
  // it may be due to autoplay being blocked
  if (audio.paused) {
    const notifyEvent = new CustomEvent("CreateNotification", {
      bubbles: true,
      detail: {
        type: "warning",
        content: "Your browser blocked autoplay, click anywhere on the page to activate it and try again",
        lifetime: 5,
      },
    });
    document.dispatchEvent(notifyEvent);
  }
}

const watchHoverUI = (callback) => {
  const hoverUI = document.querySelector("#hoverUI");
  if (!hoverUI) return;

  const config = { childList: true }
  const observer = new MutationObserver(callback);
  observer.observe(hoverUI, config);
}

const main = () => {
  processAll();
  watchNewPost(newPostHandler);
  watchHoverUI(() => window.setTimeout(hoverFileHandler, 0));
}

main();