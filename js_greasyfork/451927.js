// ==UserScript==
// @name         workflowy-img
// @namespace    https://github.com/zkytech/Tampermonkey_scripts
// @version      0.0.2
// @description  Automatically render pictures in workflowy
// @author       zkytech
// @include      *://workflowy.com*
// @grant        none1
// @downloadURL https://update.greasyfork.org/scripts/451927/workflowy-img.user.js
// @updateURL https://update.greasyfork.org/scripts/451927/workflowy-img.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const regexpImgUrl = /http[s]?:\/\/.*\.(jpg|png|ico|gif|jpeg)(\?.*)?/i;
  function refreshImgs() {
    // make sure all img url exists in contentLink
    document
      .querySelectorAll("img.workflowy-img-generated-img-element")
      .forEach((imgElement) => {
        const UUID = imgElement.id.replace(/^img/, "link");
        const link = document.getElementById(UUID);
        if (
          link &&
          link.href != imgElement.src &&
          regexpImgUrl.test(link.href)
        ) {
          imgElement.src = link.href;
        } else if (!link) {
          // img url text has been deleted
          imgElement.remove();
        }
      });

    // make sure all contentLink has been rendered
    document.querySelectorAll("a.contentLink").forEach((link) => {
      if (
        link.href &&
        regexpImgUrl.test(link.href) &&
        !link.getAttribute("workflowy-img-rendered")
      ) {
        const UUID = crypto.randomUUID();
        const imgElement = document.createElement("img");
        imgElement.src = link.href;
        imgElement.id = "img" + UUID;
        imgElement.className = "workflowy-img-generated-img-element";

        link.parentElement.parentElement.parentElement.parentElement.appendChild(
          imgElement
        );
        link.setAttribute("workflowy-img-rendered", true);
        link.id = "link" + UUID;
      } else if (link.id && link.getAttribute("workflowy-img-rendered")) {
        const UUID = link.id.replace(/^link/, "img");
        const imgElement = document.getElementById(UUID);
        if (imgElement.src != link.href) {
          // img url change
          if (regexpImgUrl.test(link.href)) {
            // if new url is still img, update <img> element
            imgElement.src = link.href;
          } else {
            // new url is not img, remove <img> element
            imgElement.remove();
            link.removeAttribute("id");
            link.removeAttribute("workflowy-img-rendered");
          }
        }
      }
    });
  }
  // refresh all img when dom change
  const observer = new MutationObserver(function (mutations, observer) {
    console.log("refreshing img");
    refreshImgs();
  });
  const el = document.querySelector("body");
  const options = {
    childList: true,
    attributes: false,
    subtree:true
  };
  observer.observe(el, options);
})();
