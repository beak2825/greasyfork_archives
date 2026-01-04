// ==UserScript==
// @name         Copy SGF from OGS
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a COPY SGF button to OGS game page
// @author       Sada
// @match        https://online-go.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496247/Copy%20SGF%20from%20OGS.user.js
// @updateURL https://update.greasyfork.org/scripts/496247/Copy%20SGF%20from%20OGS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addCopySGFButton() {
    waitForElementToLoad("div.Dock").then((sidePanelDiv) => {
      if (!sidePanelDiv.querySelector(".copy-sgf-button")) {
        const copyButton = document.createElement("div");
        copyButton.className = "TooltipContainer copy-sgf-button";
        copyButton.innerHTML = `
                <div class="Tooltip disabled">
                    <p class="title">Copy SGF</p>
                </div>
                <div>
                    <a href="#"><i class="fa fa-clipboard"></i> Copy SGF</a>
                </div>
            `;

        copyButton.addEventListener("click", function (event) {
          event.preventDefault();
          copySGFToClipboard();
        });

        sidePanelDiv.appendChild(copyButton);
      }
    });
  }

  function showNotification(message, duration = 3000) {
    const notification = document.createElement("div");
    notification.id = "toast-meta-container"

    const positionContainer = document.createElement("div");
    positionContainer.className = "toast-position-container";

    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.textContent = message;

    notification.appendChild(positionContainer);
    positionContainer.appendChild(toastContainer);
    document.body.appendChild(notification);

    setTimeout(() => {
      positionContainer.style.height = toastContainer.offsetHeight + "px";
      positionContainer.classList.add("opaque");
    }, 1);

    setTimeout(() => {
      toastContainer.style.position = "relative";
      positionContainer.style.height = "auto";
      positionContainer.style.minHeight =
        positionContainer.offsetHeight + 3 + "px";
    }, 350);

    setTimeout(() => {
      positionContainer.style.transition = "opacity 0.5s";
      positionContainer.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, duration);
  }

  function copySGFToClipboard() {
    const gameID = window.location.pathname.split("/").pop();
    const sgfUrl = `https://online-go.com/api/v1/games/${gameID}/sgf?without-comments=1`;

    GM_xmlhttpRequest({
      method: "GET",
      url: sgfUrl,
      onload: function (response) {
        if (response.status === 200) {
          GM_setClipboard(response.responseText);
          showNotification("SGF content copied to clipboard!");
        } else {
          showNotification(`Failed to fetch SGF data: ${response.statusText}`);
        }
      },
      onerror: function () {
        showNotification("Request error. Failed to fetch SGF data.");
      },
    });
  }

  function isGamePage() {
    return window.location.pathname.includes("/game/");
  }

  function onUrlChange() {
    if (isGamePage()) {
      addCopySGFButton();
    }
  }

  function observeUrlChange() {
    let previousUrl = "";

    new MutationObserver(() => {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        onUrlChange();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  function waitForElementToLoad(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        return;
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, { subtree: true, childList: true });
    });
  }

  // start the observer and the script
  observeUrlChange();
})();
