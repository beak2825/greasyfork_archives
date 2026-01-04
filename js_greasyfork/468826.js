// ==UserScript==
// @name        Kbin Post Expander
// @match       https://kbin.social/*
// @match       https://fedia.io/*
// @match       https://karab.in/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @run-at      document-end
// @description Expand posts in feeds
// @version     1.2.1
// @namespace   https://greasyfork.org/users/1096641
// @downloadURL https://update.greasyfork.org/scripts/468826/Kbin%20Post%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/468826/Kbin%20Post%20Expander.meta.js
// ==/UserScript==


function fetchFullContent(url, callback) {
  var GMxmlHttpRequest = GM_xmlhttpRequest || GM.xmlHttpRequest;
  GMxmlHttpRequest({
    method: "GET",
    url: url,
    onload: function (response) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(response.responseText, "text/html");
      let fullContent = "";
      let pTags = doc.querySelectorAll(".entry__body .content p");
      for (let p of pTags) {
        fullContent += p.outerHTML;
      }
      callback(fullContent);
    },
  });
}

function expandDescription(event, special = false) {
  let descElement = event.currentTarget.closest("article").querySelector(".content.short-desc");
  let postElement = descElement.closest("article");
  let headerElement = postElement.querySelector("header");
  let asideElement = postElement.querySelector("aside.meta");
  let commentLink = postElement.querySelector('[href$="#comments"]').href;

  if (descElement.dataset.fullContent === "true") {
    descElement.innerHTML = descElement.dataset.originalDesc;
    descElement.dataset.fullContent = "false";
    if (special) {
      descElement.style.gridColumnStart = "";
      descElement.style.display = "";
      headerElement.style.gridColumnEnd = "";
      asideElement.style.gridColumnEnd = "";
    }
  } else {
    descElement.dataset.originalDesc = descElement.innerHTML;

    fetchFullContent(commentLink, function (fullContent) {
      descElement.innerHTML = fullContent;
      descElement.dataset.fullContent = "true";
      if (special) {
        if (window.innerWidth < 689) {
          descElement.style.gridColumnStart = "1";
        } else {
          descElement.style.gridColumnStart = "2";
          headerElement.style.gridColumnEnd = "5";
          asideElement.style.gridColumnEnd = "5";
        }
        descElement.style.display = "block";
      }
    });
  }
}

function applyToNewPosts() {
  let descriptions = document.querySelectorAll(
    "article .content.short-desc:not(.expanded-description)"
  );
  let icons = document.querySelectorAll(
    "article .meta-link .fa-regular.fa-newspaper:not(.expanded-description)"
  );

  for (let desc of descriptions) {
    desc.classList.add("expanded-description");
    desc.style.cursor = "pointer";
    desc.addEventListener("click", expandDescription);
  }

  for (let icon of icons) {
    icon.classList.add("expanded-description");
    icon.style.cursor = "pointer";
    icon.addEventListener("click", (event) => expandDescription(event, true));
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  applyToNewPosts();

  let observer = new MutationObserver(applyToNewPosts);
  observer.observe(document.body, { childList: true, subtree: true });
});
