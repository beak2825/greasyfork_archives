// ==UserScript==
// @name             House of Usenet - AutoThxAndDownloader
// @description      Auto presses thanks and triggers the download and closes tab after download. You only have to open the entry you want to download in a new tab.
// @version          2.3.1
// @grant            none
// @author           UnFairlight
// @namespace        unfairlight.hou.autothxanddownloader
// @run-at           document-end
// @match            https://house-of-usenet.com/threads/*
// @downloadURL https://update.greasyfork.org/scripts/447900/House%20of%20Usenet%20-%20AutoThxAndDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/447900/House%20of%20Usenet%20-%20AutoThxAndDownloader.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

if (
  document.querySelector(".p-breadcrumbs [href='/categories/cine.655/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/movies.658/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/serien.721/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/animes.6844/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/dokus.5698/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/tv.7497/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/videospiele-und-software.635/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/musik.677/']") !== null ||
  document.querySelector(".p-breadcrumbs [href='/categories/digitale-medien.5779/']") !== null
) {
  console.log("apply auto downloader");

  function loopButtons(index, thankButtons) {
    console.log("Button", thankButtons[index]);
    if (!thankButtons[index].classList.contains("has-reaction")) {
      console.log("Thank button is not hidden");
      thankButtons[index].click();

      let postId = thankButtons[index].href.match(/\d+/)[0];
      console.log("Post ID", postId);

      let isLastThank = index + 1 >= thankButtons.length;
      console.log("Last thank", isLastThank);

      setTimeout(() => {
        triggerDownload(postId, 0, isLastThank);
      }, getRandomDelay());
    } else {
      console.log("Thank button is hidden");
    }

    index++;
    if (index < thankButtons.length) {
      setTimeout(() => {
        loopButtons(index, thankButtons);
      }, getRandomDelay());
    }
  }

  async function triggerDownload(postId, retryCount, isLastThank) {
    const post = document.querySelector(`#js-post-${postId}`);
    console.log("Post", post);
    const downloadButton = post.querySelector(".message-content .message-attachments a");

    if (downloadButton !== null) {
      console.log("Download button", downloadButton);
      downloadButton.click();

      if (isLastThank) {
        await new Promise((resolve) => {
          setTimeout(() => {
            window.close();
            resolve();
          }, getRandomDelay());
        });
      }
    } else {
      retryCount++;
      if (retryCount <= 5) {
        await new Promise((resolve) => {
          setTimeout(() => {
            triggerDownload(postId, retryCount, isLastThank);
            resolve();
          }, getRandomDelay());
        });
      }
    }
  }

  function getRandomDelay() {
    return 2001 + Math.floor(Math.random() * 1500);
  }

  function initiateAutoDownload() {
    console.log("Apply auto downloader");

    const thankButtons = document.querySelectorAll(".message-footer a.reaction:not(.has-reaction)");
    console.log("Thank buttons", thankButtons);

    if (thankButtons.length > 0) {
      loopButtons(0, thankButtons);
    } else {
      console.log("No thank buttons found!");
    }
    
  }

  window.addEventListener("load", () => {
    console.log("Page loaded. Initiating auto download...");
    setTimeout(initiateAutoDownload, getRandomDelay());
  });
}

