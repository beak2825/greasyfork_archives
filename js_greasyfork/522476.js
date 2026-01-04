// ==UserScript==
// @name         Pornolab Preloaded Preview
// @version      1.6.5
// @description  Preloads and dynamically displays preview images below links, avoiding duplicate previews. Implements fallback to the next image if the first fails to load. Includes debug mode.
// @author       Ace
// @license      MIT
// @match        *://pornolab.net/forum/tracker*
// @match        *://pornolab.net/forum/viewforum*
// @match        *://pornolab.net/forum/search*
// @icon         https://static.pornolab.net/favicon.ico
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1418199
// @downloadURL https://update.greasyfork.org/scripts/522476/Pornolab%20Preloaded%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/522476/Pornolab%20Preloaded%20Preview.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    /* ================= CONFIG ================= */

    const MIN_HEIGHT = 201;
    const MAX_CONCURRENT_FETCHES = 5;
    const PREVIEW_HEIGHT = "17rem";

    /* ================= STYLES ================= */

    const style = document.createElement("style");
    style.textContent = `
    .preview-container {
      height: ${PREVIEW_HEIGHT};
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      margin-top: 0.5rem;

      background: #111;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #888;
    }

    .preview-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }

    /* Aspect-aware soft constraints */
    .preview-container img.portrait {
      max-width: 70%;
    }

    .preview-container img.landscape {
      max-height: 80%;
    }
  `;
    document.head.appendChild(style);

    /* ================= CACHE ================= */

    // Session-only cache: topic URL -> array of preview URLs
    const previewCache = new Map();

    /* ================= HELPERS ================= */

    function buildUrl(link) {
        // IMPORTANT: preserve /forum/ path
        return new URL(link.getAttribute("href"), location.href).href;
    }

    async function fetchPreviewUrls(url) {
        if (previewCache.has(url)) {
            return previewCache.get(url);
        }

        const res = await fetch(url);
        if (!res.ok) {
            previewCache.set(url, []);
            return [];
        }

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        // Forum structure guarantee:
        // <var class="postImg" title="FULL_IMAGE_URL">
        const urls = [...doc.querySelectorAll(".postImg")]
        .map(el => el.getAttribute("title"))
        .filter(Boolean);

        previewCache.set(url, urls);
        return urls;
    }

    function attachFallbackAndAspectLogic(img, urls) {
        let index = 0;

        const tryNext = () => {
            index++;
            if (index < urls.length) {
                img.src = urls[index];
            } else {
                img.replaceWith(createEmptyPlaceholder());
            }
        };

        img.addEventListener("error", tryNext);

        img.addEventListener("load", () => {
            // Reject small images
            if (img.naturalHeight < MIN_HEIGHT) {
                tryNext();
                return;
            }

            // Aspect-aware refinement (cheap, one-time)
            const ratio = img.naturalWidth / img.naturalHeight;
            if (ratio < 0.75) {
                img.classList.add("portrait");
            } else if (ratio > 1.6) {
                img.classList.add("landscape");
            }
        });
    }

    function createEmptyPlaceholder() {
        const div = document.createElement("div");
        div.className = "preview-container";
        div.textContent = "No Eligible preview found";
        return div;
    }

    function insertPreview(link, urls) {
        const container = document.createElement("div");
        container.className = "preview-container";

        if (!urls.length) {
            container.textContent = "No Eligible preview found";
            link.after(container);
            return;
        }

        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = urls[0];

        attachFallbackAndAspectLogic(img, urls);

        container.appendChild(img);
        link.after(container);
    }

    /* ================= PROCESSING ================= */

    const links = [...document.querySelectorAll(".tLink, .tt-text")];
    let index = 0;

    async function worker() {
        while (index < links.length) {
            const link = links[index++];
            if (link.dataset.previewDone) continue;

            link.dataset.previewDone = "1";

            try {
                const urls = await fetchPreviewUrls(buildUrl(link));
                insertPreview(link, urls);
            } catch {
                insertPreview(link, []);
            }
        }
    }

    // Run workers (ordered, balanced)
    await Promise.all(
        Array.from({ length: MAX_CONCURRENT_FETCHES }, worker)
    );

})();