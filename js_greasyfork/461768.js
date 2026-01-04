// ==UserScript==
// @name         Pandabuy Redirector
// @namespace    http://tampermonkey
// @version      3.1
// @description  Redirects Weidian and Taobao links to Pandabuy
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461768/Pandabuy%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/461768/Pandabuy%20Redirector.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Define constants for Pandabuy, Weidian, and Taobao domains
  const pandabuyDomain = "pandabuy.com";
  const weidianDomain = "weidian.com";
  const taobaoDomain = "taobao.com";

  // Function to check if a link matches Pandabuy, Weidian, or Taobao domains
  function checkLink(link) {
    if (
      link.href.includes(pandabuyDomain) ||
      link.href.includes(weidianDomain) ||
      link.href.includes(taobaoDomain)
    ) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        // If the link is not on Pandabuy, redirect to Pandabuy
        if (!link.href.includes(pandabuyDomain)) {
          // If the link is a Weidian link with a userid parameter, construct a new URL with the Pandabuy shop detail page and userid as a parameter
          if (
            link.href.includes(weidianDomain) &&
            link.href.includes("userid")
          ) {
            const userid = link.href.match(/userid=(\d+)/)[1];
            const newUrl =
              "https://www.pandabuy.com/shopdetail?t=wd&id=" +
              encodeURIComponent(userid);
            const newLink = document.createElement("a");
            newLink.href = newUrl;
            newLink.target = "_blank";
            newLink.click();
          }
          // If the link is a Taobao link with a subdomain, check if it's "item" and redirect to the usual product page if it is, otherwise construct a new URL with the Pandabuy shop detail page and subdomain as a parameter
          else if (
            link.href.includes(taobaoDomain) &&
            link.href.includes("://") &&
            link.href.includes(".")
          ) {
            const subdomain = link.href.match(/\/\/(.+?)\./)[1];
            if (subdomain === "item" || subdomain === "m") {
              const newUrl =
                "https://www.pandabuy.com/product?url=" +
                encodeURIComponent(link.href);
              const newLink = document.createElement("a");
              newLink.href = newUrl;
              newLink.target = "_blank";
              newLink.click();
            } else {
              const newUrl =
                "https://www.pandabuy.com/shopdetail?t=taobao&id=" +
                encodeURIComponent(subdomain);
              const newLink = document.createElement("a");
              newLink.href = newUrl;
              newLink.target = "_blank";
              newLink.click();
            }
          }
          // If the link is not a Weidian or Taobao link, construct a new URL with the Pandabuy product page and the original link as a parameter
          else {
            const newUrl =
              "https://www.pandabuy.com/product?url=" +
              encodeURIComponent(link.href);
            const newLink = document.createElement("a");
            newLink.href = newUrl;
            newLink.target = "_blank";
            newLink.click();
          }
        }
      });
    }
  }
  // Check if user is on pandabuy.com, weidian.com, or taobao.com before applying the link conversion script
  if (
    !window.location.href.includes(pandabuyDomain) &&
    !window.location.href.includes(weidianDomain) &&
    !window.location.href.includes(taobaoDomain)
  ) {
    // Check existing links on page load
    const links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      checkLink(links[i]);
    }
    // Observe for changes in the DOM and check new links
    const observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1) {
              if (addedNode.tagName === "A") {
                checkLink(addedNode);
              }
              // Check links in any new nodes that are added to the DOM
              else {
                const containerLinks = addedNode.getElementsByTagName("a");
                for (let j = 0; j < containerLinks.length; j++) {
                  checkLink(containerLinks[j]);
                }
              }
            }
          }
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
