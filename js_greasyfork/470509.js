// ==UserScript==
// @name         latestBGonStripChat
// @namespace    http://carllx.com/
// @version      0.1.5.2
// @description  Enable users to seamlessly access and appreciate the latest backgrounds on SC.
// @author       carllx
// @match        https://stripchat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stripchat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470509/latestBGonStripChat.user.js
// @updateURL https://update.greasyfork.org/scripts/470509/latestBGonStripChat.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // function replaceTimestamp(url) {
  //   const timestampRegex = /\d+(?=\/)/;
  //   const newTimestamp = Math.floor(Date.now() / 1000) - 19;
  //   return url.replace(timestampRegex, newTimestamp);
  // }

  function updateSrcInHTML() {
    const users = [];
    // console.error(`users.length:`);
    const aWrapperElements = document.querySelectorAll(".model-list-item-link");
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    aWrapperElements.forEach((wrapElement) => {
      const rect = wrapElement.getBoundingClientRect();

      const isInView =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.left >= 0 &&
        rect.right <= viewportWidth;
      if (isInView) {
        const imgElement = wrapElement.querySelector(
          ".image-background"
        );
        const src = imgElement.getAttribute("src");

        const usernamePath = wrapElement.getAttribute("href"); //'/MiaBakker'

        // XXXXXXXXXXXX
        users.push({ n: usernamePath, el: imgElement });
        // XXXXXXXXXXXX
      }
    });
    // XXXXXXXXXXXX
    console.log(`users.length:${users.length}`);
    getUserofCam(users);
    // XXXXXXXXXXXX
  }
  function executeFunctionEverySec(fn , sec) {
    const intervalId = setInterval(fn, sec);
    const eventListener = () => {
      clearInterval(intervalId);
      document.removeEventListener("stop", eventListener);
      // Additional code to handle the 'stop' event if needed
    };
    document.addEventListener("stop", eventListener);
  }
  //   return fetch(`https://stripchat.com/api/front/v2/models/username${n}/cam`)

  function getUserofCam(users) {
    //  users : [ {n:, el:},]

    const fetchUserData = async (user) => {
      const { n, el } = user;
      const resolvedEl = await Promise.resolve(el);
      return fetch(`https://stripchat.com/api/front/v2/models/username/${n}/cam`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Something went wrong");
        })
        .then((ob) => {
          const snapshotTimestamp = ob.user.user.snapshotTimestamp;
          //   https://img.strpst.com/thumbs/1695366450/104138876_webp
          const orgSrc = resolvedEl.getAttribute("src");
          const timestampRegex = /\d+(?=\/)/;
          // debugger
          const newSrc = orgSrc.replace(timestampRegex, snapshotTimestamp);
          resolvedEl.setAttribute("src", newSrc);

          resolvedEl.onerror = function () {
            this.onerror = null;
            this.src = orgSrc;
            this.classList.remove('image-background__image--is-hidden')
            console.log(this)
          };
          return true;
        });
    };

    Promise.all(users.map(fetchUserData)).then((results) => {
      console.log("ok"); // log name property of first user
    });
  }

  executeFunctionEverySec(updateSrcInHTML , 3000);

})();
