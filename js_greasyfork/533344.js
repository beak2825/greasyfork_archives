// ==UserScript==
// @name         4khd.com Helper
// @namespace    http://tampermonkey.net/
// @description  4KHD helper
// @author       rainbowflesh
// @include      https://m.4khd.com/*
// @include      https://m.4khd.com/vip/*
// @include      https://www.terabox.com/s/*
// @connect      m.4khd.com
// @version      1.1.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4khd.com
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM.cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533344/4khdcom%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/533344/4khdcom%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Auto open the link if current page is /link/*
  function autoOpenCustomLink() {
    if (location.href.startsWith("https://m.4khd.com/link/")) {
      const interval = setInterval(() => {
        const link = document.querySelector("#custom_button");
        if (link && link.href) {
          clearInterval(interval);
          console.log("Opening custom_button href:", link.href);
          location.href = link.href;
        }
      }, 100);
    }
  }

  function autoClicker() {
    const interval = setInterval(() => {
      const button = document.getElementById("custom_button");
      if (button) {
        button.click();
        clearInterval(interval);
      }
    }, 3000);
  }

  function adsRemover() {
    window.addEventListener("load", () => {
      new MutationObserver(() => {
        document.querySelector("div.popup")?.remove();
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  function createLinkGroupUIContainer() {
    let linkGroupUIContainer = document.getElementById("linkGroupUIContainer");
    if (linkGroupUIContainer) return linkGroupUIContainer;

    linkGroupUIContainer = document.createElement("div");
    linkGroupUIContainer.id = "linkGroupUIContainer";
    linkGroupUIContainer.style = `
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.6);
    padding: 10px;
    border-radius: 8px;
    max-height: 90vh;
    min-width: 8em;
    overflow-y: auto;
  `;

    const title = document.createElement("div");
    title.textContent = "Failure links";
    title.style = `
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: white;
  `;

    const linksWrapper = document.createElement("div");
    linksWrapper.id = "linkList";

    linkGroupUIContainer.appendChild(title);
    linkGroupUIContainer.appendChild(linksWrapper);
    document.body.appendChild(linkGroupUIContainer);
    return linkGroupUIContainer;
  }

  function createCookedLink() {
    const stored = JSON.parse(localStorage.getItem("failureStatus") || "{}");
    const sortedKeys = Object.keys(stored).sort();

    const container = createLinkGroupUIContainer();
    const linkList = container.querySelector("#linkList");
    linkList.innerHTML = ""; // reset link list

    sortedKeys.forEach((key) => {
      if (stored[key] === true) return; // hide "true"

      const linkWrapper = document.createElement("div");
      linkWrapper.className = "failure-link";
      linkWrapper.style = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;
      `;

      const link = document.createElement("a");
      link.href = `https://m.4khd.com/${key}`;
      //link.target = "_blank";
      link.innerText = key;
      link.style.color = "red";
      link.style.marginRight = "8px";

      const deleteBtn = document.createElement("button");
      deleteBtn.style = `
        color: #fff;
        background: #900;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 2px;
        vertical-align: middle;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      `;
      deleteBtn.innerHTML = `
        <svg width="9" height="9" xmlns="http://www.w3.org/2000/svg" fill="white" fill-opacity="context-fill-opacity"><path d="M1 .412a.588.588 0 0 0-.416.172.588.588 0 0 0 0 .832L3.668 4.5.584 7.584a.588.588 0 0 0 0 .832.588.588 0 0 0 .832 0L4.5 5.332l3.084 3.084a.588.588 0 0 0 .832 0 .588.588 0 0 0 0-.832L5.332 4.5l3.084-3.084a.588.588 0 0 0 0-.832.588.588 0 0 0-.832 0L4.5 3.668 1.416.584A.588.588 0 0 0 1 .412z"/></svg>
      `;
      deleteBtn.onclick = () => {
        const data = JSON.parse(localStorage.getItem("failureStatus") || "{}");
        data[key] = true;
        localStorage.setItem("failureStatus", JSON.stringify(data));
        linkWrapper.remove();
      };

      linkWrapper.appendChild(link);
      linkWrapper.appendChild(deleteBtn);
      linkList.appendChild(linkWrapper);
    });
  }

  // save cookie to localStorage
  function saveCookies() {
    console.log("save the fucking cookie");
    GM_cookie.list({}, function (cookies, error) {
      if (!error) {
        const cook = cookies.filter((c) => c.name.startsWith("short_"));
        if (cook.length === 0) return;
        console.log("Adding cookies: ", cook);
        const stored = JSON.parse(localStorage.getItem("failureStatus") || "{}");
        console.log("stored cookies", stored);
        cook.forEach((c) => {
          const key = c.name.replace("short_", "");
          if (!(key in stored)) {
            stored[key] = false;
            console.log("4khd helper: add new key ", key, ": ", stored[key]);
          } else {
            console.log("4khd helper: ", key, "already exists in localStorage");
          }
        });

        localStorage.setItem("failureStatus", JSON.stringify(stored));
        createCookedLink();
      } else {
        console.error(error);
      }
    });
  }

  if (location.href.startsWith("https://m.4khd.com/vip/index.php")) {
    window.addEventListener("load", () => {
      console.log("Accessed vip page, saving cookies...");
      saveCookies();
    });
  }

  // 在页面加载完毕后执行（确保 saveCookies 的执行时机）
  window.addEventListener("load", () => {
    console.log("Page loaded, running autoClicker and adsRemover");
    autoClicker();
    autoOpenCustomLink();
    createCookedLink();
  });
})();
