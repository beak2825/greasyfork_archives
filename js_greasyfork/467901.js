// ==UserScript==
// @name         K MANGA Ripper
// @version      2.3.9
// @description  Adds a download button to rip chapters from K MANGA (bypasses image scrambling protection)
// @author       /a/non
// @namespace    K MANGA Ripper
// @license      MIT
// @match        https://kmanga.kodansha.com/*
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://kmanga.kodansha.com/&size=64
// @grant        none
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/467901/K%20MANGA%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/467901/K%20MANGA%20Ripper.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  let selectedChapter;
  const canvas = new OffscreenCanvas(0, 0);
  const ctx = canvas.getContext("2d", { alpha: false });

  // Hook fetch method to intercept request to selected chapter's info
  const ogFetch = fetch;
  fetch = async (url, options) => {
    const response = await ogFetch(url, options);
    if (typeof url === "string" && url.includes("/web/episode/viewer")) {
      selectedChapter = await response.clone().json();
    }
    return response;
  };

  // Descrambling logic and tile dimension calculations from chunk-BgjE_s8Z.js (simplified)
  const getUnscrambledCoords = (seed) => {
    const seed32 = new Uint32Array(1);
    seed32[0] = seed;
    const pairs = [];
    for (let i = 0; i < 16; i++) {
      seed32[0] ^= seed32[0] << 13;
      seed32[0] ^= seed32[0] >>> 17;
      seed32[0] ^= seed32[0] << 5;
      pairs.push([seed32[0], i]);
    }
    pairs.sort((a, b) => a[0] - b[0]);
    const sortedVal = pairs.map((e) => e[1]);

    return sortedVal.map((e, i) => ({
      source: {
        x: e % 4,
        y: Math.floor(e / 4),
      },
      dest: {
        x: i % 4,
        y: Math.floor(i / 4),
      },
    }));
  };

  // Rearrange the tiles based on the unscrambled coordinates
  const drawPage = async (page, coords) => {
    const getTileDimension = (size) => (Math.floor(size / 8) * 8) / 4;
    const pageWidth = page.width;
    const pageHeight = page.height;
    const tileWidth = getTileDimension(pageWidth);
    const tileHeight = getTileDimension(pageHeight);

    canvas.width = pageWidth;
    canvas.height = pageHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(page, 0, 0);
    for (const c of coords) {
      ctx.drawImage(
        page,
        c.source.x * tileWidth,
        c.source.y * tileHeight,
        tileWidth,
        tileHeight,
        c.dest.x * tileWidth,
        c.dest.y * tileHeight,
        tileWidth,
        tileHeight
      );
    }

    return await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 1,
    });
  };

  const getTitle = () => {
    const title = document.querySelector(".p-episode__header-ttl").innerText;
    return title.replace(/[<>:"\/\|?*]/g, "");
  };

  const downloadChapter = async (progressBar) => {
    if (!selectedChapter) {
      throw new Error("No chapter found");
    }
    const scrambleSeed = selectedChapter.scramble_seed;
    const pageList = selectedChapter.page_list;
    if (!scrambleSeed) {
      throw new Error("No scramble seed found for selected chapter");
    }
    if (!pageList || !pageList.length) {
      throw new Error("No page found in selected chapter");
    }

    const isLoggedIn = document.querySelector(".l-header__user");
    if (isLoggedIn) {
      const ok = confirm(
        "WARNING: You may get your account banned for ripping.\nThis script will be updated later to be safer once more is known, but in the meantime I recommend you avoid using it (at least too much, a few chapters here and there should be fine (maybe)).\nIf you're just ripping free chapters, you can simply log out first (and change your IP if you want to be absolutely sure) before doing so.\nIf you want to proceed anyway, click Ok."
      );
      if (!ok) return;
    }

    const pageCount = pageList.length;
    const title = getTitle();

    let pageCountProgress = 0;
    const updateDlProgress = () => {
      const percentage = Math.round(
        (++pageCountProgress / (pageCount * 4)) * 100
      );
      progressBar.style.width = percentage + "%";
    };

    let pageBitmaps;
    try {
      const responses = await Promise.all(
        pageList.map(async (pageUrl) => {
          const response = await fetch(pageUrl);
          updateDlProgress();
          return response;
        })
      );

      const blobs = await Promise.all(
        responses.map(async (response) => {
          const blob = await response.blob();
          updateDlProgress();
          return blob;
        })
      );

      // Convert blobs to image bitmaps to use with canvas
      pageBitmaps = await Promise.all(
        blobs.map(async (blob) => {
          const pageBitmap = await createImageBitmap(blob);
          updateDlProgress();
          return pageBitmap;
        })
      );
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't retrieve chapter pages");
    }

    const unscrambledPageBlobs = [];
    const unscrambledCoords = getUnscrambledCoords(scrambleSeed);
    try {
      for (const page of pageBitmaps) {
        const blob = await drawPage(page, unscrambledCoords);
        updateDlProgress();
        unscrambledPageBlobs.push(blob);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't unscramble chapter pages");
    }

    try {
      const zip = new JSZip();
      const padStartLength = pageCount.toString().length;
      unscrambledPageBlobs.forEach((page, index) => {
        const paddedFileName =
          (index + 1).toString().padStart(padStartLength, "0") + ".jpg";
        zip.file(paddedFileName, page, { binary: true });
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      await saveAs(zipBlob, title + ".zip");
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't process zip file");
    }
  };

  const insertDlButton = (target) => {
    const dlButtonWrapper = document.createElement("div");
    const progressBar = document.createElement("div");
    const dlButton = document.createElement("button");
    dlButtonWrapper.id = "dl-button-wrapper";
    progressBar.id = "progress-bar";
    dlButton.id = "dl-button";
    dlButton.innerText = "Download Chapter";

    dlButton.onclick = async () => {
      dlButton.disabled = true;
      dlButton.innerText = "Downloading...";
      dlButton.classList = ["loading"];
      const resetButton = (isSuccess) => {
        dlButton.disabled = false;
        dlButton.classList = isSuccess ? ["completed"] : [];
        dlButton.innerText = "Download Chapter";
        progressBar.style.width = "0";
      };

      try {
        if (!selectedChapter) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        await downloadChapter(progressBar);
        setTimeout(() => resetButton(true), 500);
      } catch (error) {
        dlButton.innerText = "Download Failed";
        dlButton.classList = ["fail"];
        setTimeout(() => resetButton(false), 2000);
        setTimeout(() => {
          alert(
            `Error downloading chapter: ${error.message}\nReload the page and try again\nIf the issue persists, please report it in the feedback section of the script's homepage`
          );
        }, 100);
      }
    };

    target.appendChild(dlButtonWrapper);
    dlButtonWrapper.appendChild(progressBar);
    dlButtonWrapper.appendChild(dlButton);
  };

  const injectDlButtonStyle = () => {
    const dlButtonStyle = document.createElement("style");
    dlButtonStyle.textContent = `
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            :root {
                --download-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11' fill='none' stroke='%230d3594' stroke-width='2' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E");
                --loading-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%231DA1F2' stroke-width='4' opacity='0.4'%3E%3C/circle%3E%3Cpath d='M12,2 a10,10 0 0 1 10,10' fill='none' stroke='%230d3594' stroke-width='4' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E");
                --completed-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11' fill='none' stroke='%230d3594' stroke-width='2' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E");
                --fail-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='red' stroke='black' stroke-width='2' opacity='0.8'%3E%3C/circle%3E%3Cpath d='M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4' fill='%23fff' stroke='none'%3E%3C/path%3E%3C/svg%3E");
                --locked-svg: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18 10.5C19.6569 10.5 21 11.8431 21 13.5V19.5C21 21.1569 19.6569 22.5 18 22.5H6C4.34315 22.5 3 21.1569 3 19.5V13.5C3 11.8431 4.34315 10.5 6 10.5V7.5C6 4.18629 8.68629 1.5 12 1.5C15.3137 1.5 18 4.18629 18 7.5V10.5ZM12 3.5C14.2091 3.5 16 5.29086 16 7.5V10.5H8V7.5C8 5.29086 9.79086 3.5 12 3.5ZM18 12.5H6C5.44772 12.5 5 12.9477 5 13.5V19.5C5 20.0523 5.44772 20.5 6 20.5H18C18.5523 20.5 19 20.0523 19 19.5V13.5C19 12.9477 18.5523 12.5 18 12.5Z' fill='%235e5e5e'/%3E%3C/svg%3E");
            }

            .p-episode__twitter {
                display: none;
            }

            #dl-button-wrapper {
                position: relative;
                width: 180px;
                height: 35px;
            }

            #progress-bar {
                position: absolute;
                z-index: 1;
                top: 2px;
                bottom: 0;
                left: 2px;
                right: 0;
                width: 0;
                max-width: 176px;
                height: 31px;
                border-radius: 4px;
                background-color: #d4d4d4;
            }

            #dl-button {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 180px;
                height: 35px;
                font-family: "Helvetica Neue", "Helvetica", "Aral", "sans-serif";
                font-size: 1.5rem;
                font-weight: bold;
                color: #0d3594;
                border: 2px solid #0d3594;
                border-radius: 7px;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            #dl-button:not(.loading):not(.locked):not(.fail):hover {
                opacity: 0.8;
            }
            #dl-button.loading {
                opacity: 0.8;
                cursor: default;
            }
            #dl-button.fail {
                color: red;
                border-color: red;
                cursor: default;
            }
            #dl-button.locked {
                color: #5e5e5e;
                border-color: #5e5e5e;
                cursor: default;
            }

            #dl-button::before {
                content: "";
                display: inline-block;
                background-image: var(--download-svg);
                background-size: contain;
                background-repeat: no-repeat;
                width: 20px;
                height: 20px;
                margin-left: -5px;
                margin-right: 5px;
            }
            #dl-button.loading::before {
                background-image: var(--loading-svg);
                animation: spin 1s linear infinite;
            }
            #dl-button.completed::before {
                background-image: var(--completed-svg);
            }
            #dl-button.fail::before {
                background-image: var(--fail-svg);
                margin-right: 8px;
            }
            #dl-button.locked::before {
                background-image: var(--locked-svg);
                margin-bottom: 2px;
            }
        `;
    document.head.appendChild(dlButtonStyle);
  };

  const checkChapter = (mutationList, observer) => {
    if (!location.pathname.match(/^\/title\/.*\/episode\/.*$/)) {
      return;
    }
    const target = document.querySelector(".p-episode__header-item02");
    if (!target) return;

    let dlButton = document.querySelector("#dl-button");
    if (!dlButton) {
      insertDlButton(target);
      dlButton = document.querySelector("#dl-button");
    }

    const isNotBought = document.querySelector(".p-episode-purchase");
    if (isNotBought) {
      dlButton.disabled = true;
      dlButton.setAttribute(
        "title",
        "Cannot download a chapter you don't have access to"
      );
      dlButton.classList.add("locked");
    } else if (dlButton.classList.contains("locked")) {
      dlButton.disabled = false;
      dlButton.removeAttribute("title");
      dlButton.classList.remove("locked");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectDlButtonStyle();
    const observer = new MutationObserver(checkChapter);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
