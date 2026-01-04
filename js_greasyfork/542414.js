// ==UserScript==
// @name            FapForFun | Images resize
// @namespace       http://tampermonkey.net/
// @version         1.0.0
// @description     Resize small images to big (up to 600x600)
// @author          ExtraLewd
// @match           https://fapforfun.net/archives/*
// @match           https://fapforfun.net/*
// @match           https://*.fapforfun.net/*
// @icon            https://fapforfun.net/favicon.ico
// @run-at          document-start
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @downloadURL https://update.greasyfork.org/scripts/542414/FapForFun%20%7C%20Images%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/542414/FapForFun%20%7C%20Images%20resize.meta.js
// ==/UserScript==

(() => {
  // src/utils/dom.ts
  var imageHostingSelectors = [
    "img[src^='https://imgdrive.net/images/small/']",
    "img[src^='https://imgadult.com/upload/small/']",
    "img[src^='https://imgtaxi.com/images/small/']"
  ];
  var findImages = () => {
    return document.querySelectorAll(
      imageHostingSelectors.join(",")
    );
  };
  var waitForElement = (selector, timeout = 6e4 * 5) => {
    return new Promise((ok, fail) => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          ok(el);
          clearInterval(interval);
          return;
        }
      }, 1e3);
      setTimeout(() => {
        clearInterval(interval);
        fail("Timeout");
      }, timeout);
    });
  };
  var attachObserver = async (select, callback) => {
    try {
      const search = await waitForElement(select);
      const observer2 = new MutationObserver(callback);
      observer2.observe(search, { childList: true, subtree: true });
      callback();
      return observer2;
    } catch (error) {
      console.error(error);
    }
  };

  // src/index.ts
  var bootstrap = async () => {
    await waitForElement(imageHostingSelectors.join(","));
    (await observer).disconnect();
    const images = findImages();
    for (const image of images) {
      image.referrerPolicy = "no-referrer";
      image.src = image.src.replace("/small/", "/big/");
      image.height = "600";
      image.width = "600";
    }
    (await observer).observe(document.body, { childList: true, subtree: true });
  };
  var observer = attachObserver("body", bootstrap);
})();
