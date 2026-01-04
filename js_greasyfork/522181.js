// ==UserScript==
// @name         Remove the Shipping Process Guide of the Temu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the shipping process guide of the Temu
// @author       ismile
// @match        https://seller.kuajingmaihuo.com/*
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNzMzMjA5NjExOTA1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyNjAyIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg2My43ODk4MjIgOTA2LjYyNzgzOW0tMTEuOTkyNTMxLTExLjk5MjUzMWwtMjQ2LjU0ODMzNS0yNDYuNTQ4MzM1cS0xMS45OTI1MzEtMTEuOTkyNTMxIDAtMjMuOTg1MDYybDQzLjg5NzE4OS00My44OTcxODlxMTEuOTkyNTMxLTExLjk5MjUzMSAyMy45ODUwNjIgMGwyNDYuNTQ4MzM1IDI0Ni41NDgzMzVxMTEuOTkyNTMxIDExLjk5MjUzMSAwIDIzLjk4NTA2MmwtNDMuODk3MTg5IDQzLjg5NzE4OXEtMTEuOTkyNTMxIDExLjk5MjUzMS0yMy45ODUwNjIgMFoiIGZpbGw9IiNGRjU3NTciIHAtaWQ9IjIyNjAzIi8+PHBhdGggZD0iTTU5My4yMTEzNTcgODM4LjcwMTI4M20xMS45OTI1MzEtMTEuOTkyNTMxbDI0Ni41NDgzMzYtMjQ2LjU0ODMzNnExMS45OTI1MzEtMTEuOTkyNTMxIDIzLjk4NTA2MiAwbDQzLjg5NzE4OSA0My44OTcxODlxMTEuOTkyNTMxIDExLjk5MjUzMSAwIDIzLjk4NTA2MmwtMjQ2LjU0ODMzNiAyNDYuNTQ4MzM2cS0xMS45OTI1MzEgMTEuOTkyNTMxLTIzLjk4NTA2MiAwbC00My44OTcxODktNDMuODk3MTg5cS0xMS45OTI1MzEtMTEuOTkyNTMxIDAtMjMuOTg1MDYyWiIgZmlsbD0iI0ZGNTc1NyIgcC1pZD0iMjI2MDQiLz48cGF0aCBkPSJNOTIuMjg4IDEyOG0yMy44MDggMGw3MDIuOTc2IDBxMjMuODA4IDAgMjMuODA4IDIzLjgwOGwwIDQ4LjM4NHEwIDIzLjgwOC0yMy44MDggMjMuODA4bC03MDIuOTc2IDBxLTIzLjgwOCAwLTIzLjgwOC0yMy44MDhsMC00OC4zODRxMC0yMy44MDggMjMuODA4LTIzLjgwOFoiIGZpbGw9IiNGRjU3NTciIHAtaWQ9IjIyNjA1Ii8+PHBhdGggZD0iTTkyLjI4OCAzODQuNzA0bTIzLjgwOCAwbDcwMi45NzYgMHEyMy44MDggMCAyMy44MDggMjMuODA4bDAgNDguMzg0cTAgMjMuODA4LTIzLjgwOCAyMy44MDhsLTcwMi45NzYgMHEtMjMuODA4IDAtMjMuODA4LTIzLjgwOGwwLTQ4LjM4NHEwLTIzLjgwOCAyMy44MDgtMjMuODA4WiIgZmlsbD0iI0ZGNTc1NyIgcC1pZD0iMjI2MDYiLz48cGF0aCBkPSJNOTIuMjg4IDY0MS40MDhtMTcuMDI0IDBsMzQ5Ljk1MiAwcTE3LjAyNCAwIDE3LjAyNCAxNy4wMjRsMCA2MS45NTJxMCAxNy4wMjQtMTcuMDI0IDE3LjAyNGwtMzQ5Ljk1MiAwcS0xNy4wMjQgMC0xNy4wMjQtMTcuMDI0bDAtNjEuOTUycTAtMTcuMDI0IDE3LjAyNC0xNy4wMjRaIiBmaWxsPSIjRkY1NzU3IiBwLWlkPSIyMjYwNyIvPjwvc3ZnPg==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522181/Remove%20the%20Shipping%20Process%20Guide%20of%20the%20Temu.user.js
// @updateURL https://update.greasyfork.org/scripts/522181/Remove%20the%20Shipping%20Process%20Guide%20of%20the%20Temu.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let container = null;

  function createSvgIcon() {
    container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "50px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.width = "30px";
    container.style.height = "30px";
    container.style.zIndex = "9999";
    container.style.cursor = "pointer";
    container.style.userSelect = "none";
    container.style.display = "none";

    container.innerHTML = `
        <svg t="1733208640424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22436" width="30" height="30">
            <path d="M863.789822 906.627839m-11.992531-11.992531l-246.548335-246.548335q-11.992531-11.992531 0-23.985062l43.897189-43.897189q11.992531-11.992531 23.985062 0l246.548335 246.548335q11.992531 11.992531 0 23.985062l-43.897189 43.897189q-11.992531 11.992531-23.985062 0Z" fill="#FF5757" p-id="22437"></path>
            <path d="M593.211357 838.701283m11.992531-11.992531l246.548336-246.548336q11.992531-11.992531 23.985062 0l43.897189 43.897189q11.992531-11.992531 0 23.985062l-246.548336 246.548336q-11.992531 11.992531-23.985062 0l-43.897189-43.897189q-11.992531-11.992531 0-23.985062Z" fill="#FF5757" p-id="22438"></path>
            <path d="M92.288 128m23.808 0l702.976 0q23.808 0 23.808 23.808l0 48.384q0 23.808-23.808 23.808l-702.976 0q-23.808 0-23.808-23.808l0-48.384q0-23.808 23.808-23.808Z" fill="#FF5757" p-id="22439"></path>
            <path d="M92.288 384.704m23.808 0l702.976 0q23.808 0 23.808 23.808l0 48.384q0 23.808-23.808 23.808l-702.976 0q-23.808 0-23.808-23.808l0-48.384q0-23.808 23.808-23.808Z" fill="#FF5757" p-id="22440"></path>
            <path d="M92.288 641.408m17.024 0l349.952 0q17.024 0 17.024 17.024l0 61.952q0 17.024-17.024 17.024l-349.952 0q-17.024 0-17.024-17.024l0-61.952q0-17.024 17.024-17.024Z" fill="#FF5757" p-id="22441"></path>
        </svg>
      `;

    container.addEventListener("click", () => {
      removeTargetDivsAndFetch();
      container.style.display = "none";
    });

    document.body.appendChild(container);
  }

  function removeTargetDivsAndFetch() {
    const modalDiv = document.querySelector('[data-testid="beast-core-modal"]');
    const maskDiv = document.querySelector(
      '[data-testid="beast-core-modal-mask"]'
    );

    let deleted = false;

    if (modalDiv) {
      modalDiv.remove();
      deleted = true;
    }

    if (maskDiv) {
      maskDiv.remove();
      deleted = true;
    }

    if (deleted) {
      fetch(
        "https://seller.kuajingmaihuo.com/bgSongbird-api/supplier/config/editDeliveryProcessDisplayConfig",
        {
          headers: {
            "anti-content": "",
            "content-type": "application/json",
            referer: "https://seller.kuajingmaihuo.com/",
            mallid: localStorage.getItem("mall-info-id") || "",
          },
          body: JSON.stringify({ displayDeliveryProcess: 1 }),
          method: "POST",
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Request Success!");
          } else {
            console.error("Request Failed: ", response.status);
          }
        })
        .catch((error) => console.error("Request Failed: ", error));
    }
  }

  function checkForTargetDiv() {
    const targetDiv = document.querySelector(".guide-steps_box__2jPgE");
    if (targetDiv) {
      if (!container) {
        createSvgIcon();
      }
      container.style.display = "block";
    } else if (container) {
      container.style.display = "none";
    }
  }

  function delayedCheck() {
    setTimeout(() => {
      checkForTargetDiv();
    }, 100);
  }

  function observeDomChanges() {
    const observer = new MutationObserver(() => {
      checkForTargetDiv();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", delayedCheck);
  }

  function init() {
    checkForTargetDiv();
    observeDomChanges();
  }

  window.addEventListener("load", init);
})();
